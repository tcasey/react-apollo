import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ApolloError, } from 'apollo-client';
import { parser, DocumentType } from './parser';
const pick = require('lodash/pick');
const assign = require('object-assign');
const hoistNonReactStatics = require('hoist-non-react-statics');
const shallowEqual = require('fbjs/lib/shallowEqual');
const invariant = require('invariant');
const defaultMapPropsToOptions = () => ({});
const defaultMapResultToProps = props => props;
const defaultMapPropsToSkip = () => false;
function observableQueryFields(observable) {
    const fields = pick(observable, 'variables', 'refetch', 'fetchMore', 'updateQuery', 'startPolling', 'stopPolling', 'subscribeToMore');
    Object.keys(fields).forEach(key => {
        const k = key;
        if (typeof fields[k] === 'function') {
            fields[k] = fields[k].bind(observable);
        }
    });
    return fields;
}
function getDisplayName(WrappedComponent) {
    return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}
let nextVersion = 0;
export default function graphql(document, operationOptions = {}) {
    const { options = defaultMapPropsToOptions, skip = defaultMapPropsToSkip, alias = 'Apollo', } = operationOptions;
    let mapPropsToOptions = options;
    if (typeof mapPropsToOptions !== 'function')
        mapPropsToOptions = () => options;
    let mapPropsToSkip = skip;
    if (typeof mapPropsToSkip !== 'function')
        mapPropsToSkip = () => skip;
    const mapResultToProps = operationOptions.props;
    const operation = parser(document);
    const version = nextVersion++;
    function wrapWithApolloComponent(WrappedComponent) {
        const graphQLDisplayName = `${alias}(${getDisplayName(WrappedComponent)})`;
        class GraphQL extends React.Component {
            constructor(props, context) {
                super(props, context);
                this.previousData = {};
                this.version = version;
                this.type = operation.type;
                this.dataForChildViaMutation = this.dataForChildViaMutation.bind(this);
                this.setWrappedInstance = this.setWrappedInstance.bind(this);
            }
            componentWillMount() {
                if (!this.shouldSkip(this.props)) {
                    this.setInitialProps();
                }
            }
            componentDidMount() {
                this.hasMounted = true;
                if (this.type === DocumentType.Mutation)
                    return;
                if (!this.shouldSkip(this.props)) {
                    this.subscribeToQuery();
                    if (this.refetcherQueue) {
                        const { args, resolve, reject } = this.refetcherQueue;
                        this.queryObservable
                            .refetch(args)
                            .then(resolve)
                            .catch(reject);
                    }
                }
            }
            componentWillReceiveProps(nextProps, nextContext) {
                if (this.shouldSkip(nextProps)) {
                    if (!this.shouldSkip(this.props)) {
                        this.unsubscribeFromQuery();
                    }
                    return;
                }
                const { client } = mapPropsToOptions(nextProps);
                if (shallowEqual(this.props, nextProps) &&
                    (this.client === client || this.client === nextContext.client)) {
                    return;
                }
                this.shouldRerender = true;
                if (this.client !== client && this.client !== nextContext.client) {
                    if (client) {
                        this.client = client;
                    }
                    else {
                        this.client = nextContext.client;
                    }
                    this.unsubscribeFromQuery();
                    this.queryObservable = null;
                    this.previousData = {};
                    this.updateQuery(nextProps);
                    if (!this.shouldSkip(nextProps)) {
                        this.subscribeToQuery();
                    }
                    return;
                }
                if (this.type === DocumentType.Mutation) {
                    return;
                }
                if (this.type === DocumentType.Subscription &&
                    operationOptions.shouldResubscribe &&
                    operationOptions.shouldResubscribe(this.props, nextProps)) {
                    this.unsubscribeFromQuery();
                    delete this.queryObservable;
                    this.updateQuery(nextProps);
                    this.subscribeToQuery();
                    return;
                }
                this.updateQuery(nextProps);
                this.subscribeToQuery();
            }
            componentWillUnmount() {
                if (this.type === DocumentType.Query) {
                    if (this.queryObservable) {
                        const recycler = this.getQueryRecycler();
                        if (recycler) {
                            recycler.recycle(this.queryObservable);
                            delete this.queryObservable;
                        }
                    }
                    this.unsubscribeFromQuery();
                }
                if (this.type === DocumentType.Subscription)
                    this.unsubscribeFromQuery();
                this.hasMounted = false;
            }
            getQueryRecycler() {
                return (this.context.getQueryRecycler &&
                    this.context.getQueryRecycler(GraphQL));
            }
            getClient(props) {
                if (this.client)
                    return this.client;
                const { client } = mapPropsToOptions(props);
                if (client) {
                    this.client = client;
                }
                else {
                    this.client = this.context.client;
                }
                invariant(!!this.client, `Could not find "client" in the context of ` +
                    `"${graphQLDisplayName}". ` +
                    `Wrap the root component in an <ApolloProvider>`);
                return this.client;
            }
            calculateOptions(props = this.props, newOpts) {
                let opts = mapPropsToOptions(props);
                if (newOpts && newOpts.variables) {
                    newOpts.variables = assign({}, opts.variables, newOpts.variables);
                }
                if (newOpts)
                    opts = assign({}, opts, newOpts);
                if (opts.variables || !operation.variables.length)
                    return opts;
                let variables = {};
                for (let { variable, type } of operation.variables) {
                    if (!variable.name || !variable.name.value)
                        continue;
                    const variableName = variable.name.value;
                    const variableProp = props[variableName];
                    if (typeof variableProp !== 'undefined') {
                        variables[variableName] = variableProp;
                        continue;
                    }
                    if (type.kind !== 'NonNullType') {
                        variables[variableName] = null;
                        continue;
                    }
                    invariant(typeof variableProp !== 'undefined', `The operation '${operation.name}' wrapping '${getDisplayName(WrappedComponent)}' ` +
                        `is expecting a variable: '${variable.name.value}' but it was not found in the props ` +
                        `passed to '${graphQLDisplayName}'`);
                }
                opts = Object.assign({}, opts, { variables });
                return opts;
            }
            calculateResultProps(result) {
                let name = this.type === DocumentType.Mutation ? 'mutate' : 'data';
                if (operationOptions.name)
                    name = operationOptions.name;
                const newResult = {
                    [name]: result,
                    ownProps: this.props,
                };
                if (mapResultToProps)
                    return mapResultToProps(newResult);
                return { [name]: defaultMapResultToProps(result) };
            }
            setInitialProps() {
                if (this.type === DocumentType.Mutation) {
                    return;
                }
                const opts = this.calculateOptions(this.props);
                this.createQuery(opts);
            }
            createQuery(opts, props = this.props) {
                if (this.type === DocumentType.Subscription) {
                    this.queryObservable = this.getClient(props).subscribe(assign({ query: document }, opts));
                }
                else {
                    const recycler = this.getQueryRecycler();
                    let queryObservable = null;
                    if (recycler)
                        queryObservable = recycler.reuse(opts);
                    if (queryObservable === null) {
                        this.queryObservable = this.getClient(props).watchQuery(assign({
                            query: document,
                            metadata: {
                                reactComponent: {
                                    displayName: graphQLDisplayName,
                                },
                            },
                        }, opts));
                    }
                    else {
                        this.queryObservable = queryObservable;
                    }
                }
            }
            updateQuery(props) {
                const opts = this.calculateOptions(props);
                if (!this.queryObservable) {
                    this.createQuery(opts, props);
                }
                if (this.queryObservable._setOptionsNoResult) {
                    this.queryObservable._setOptionsNoResult(opts);
                }
                else {
                    if (this.queryObservable.setOptions) {
                        this.queryObservable
                            .setOptions(opts)
                            .catch(() => null);
                    }
                }
            }
            fetchData() {
                if (this.shouldSkip())
                    return false;
                if (operation.type === DocumentType.Mutation ||
                    operation.type === DocumentType.Subscription)
                    return false;
                const opts = this.calculateOptions();
                if (opts.ssr === false)
                    return false;
                if (opts.fetchPolicy === 'network-only' ||
                    opts.fetchPolicy === 'cache-and-network') {
                    opts.fetchPolicy = 'cache-first';
                }
                const observable = this.getClient(this.props).watchQuery(assign({ query: document }, opts));
                const result = observable.currentResult();
                if (result.loading) {
                    return observable.result();
                }
                else {
                    return false;
                }
            }
            subscribeToQuery() {
                if (this.querySubscription) {
                    return;
                }
                const next = (results) => {
                    if (this.type === DocumentType.Subscription) {
                        this.lastSubscriptionData = results;
                    }
                    const clashingKeys = Object.keys(observableQueryFields(results.data));
                    invariant(clashingKeys.length === 0, `the result of the '${graphQLDisplayName}' operation contains ` +
                        `keys that conflict with the return object.` +
                        clashingKeys.map(k => `'${k}'`).join(', ') +
                        ` not allowed.`);
                    this.forceRenderChildren();
                };
                const handleError = (error) => {
                    this.resubscribeToQuery();
                    if (error.hasOwnProperty('graphQLErrors'))
                        return next({ error });
                    throw error;
                };
                this.querySubscription = this.queryObservable.subscribe({
                    next,
                    error: handleError,
                });
            }
            unsubscribeFromQuery() {
                if (this.querySubscription) {
                    this.querySubscription.unsubscribe();
                    delete this.querySubscription;
                }
            }
            resubscribeToQuery() {
                const lastSubscription = this.querySubscription;
                if (lastSubscription) {
                    delete this.querySubscription;
                }
                const { lastError, lastResult } = this.queryObservable;
                this.queryObservable.resetLastResults();
                this.subscribeToQuery();
                Object.assign(this.queryObservable, { lastError, lastResult });
                if (lastSubscription) {
                    lastSubscription.unsubscribe();
                }
            }
            shouldSkip(props = this.props) {
                return mapPropsToSkip(props);
            }
            forceRenderChildren() {
                this.shouldRerender = true;
                if (this.hasMounted)
                    this.forceUpdate();
            }
            getWrappedInstance() {
                invariant(operationOptions.withRef, `To access the wrapped instance, you need to specify ` +
                    `{ withRef: true } in the options`);
                return this.wrappedInstance;
            }
            setWrappedInstance(ref) {
                this.wrappedInstance = ref;
            }
            dataForChildViaMutation(mutationOpts) {
                const opts = this.calculateOptions(this.props, mutationOpts);
                if (typeof opts.variables === 'undefined')
                    delete opts.variables;
                opts.mutation = document;
                return this.getClient(this.props).mutate(opts);
            }
            dataForChild() {
                if (this.type === DocumentType.Mutation) {
                    return this.dataForChildViaMutation;
                }
                const opts = this.calculateOptions(this.props);
                const data = {};
                assign(data, observableQueryFields(this.queryObservable));
                if (this.type === DocumentType.Subscription) {
                    assign(data, {
                        loading: !this.lastSubscriptionData,
                        variables: opts.variables,
                    }, this.lastSubscriptionData && this.lastSubscriptionData.data);
                }
                else {
                    const currentResult = this.queryObservable.currentResult();
                    const { loading, networkStatus, errors } = currentResult;
                    let { error } = currentResult;
                    if (errors && errors.length > 0) {
                        error = new ApolloError({ graphQLErrors: errors });
                    }
                    assign(data, { loading, networkStatus });
                    let logErrorTimeoutId = setTimeout(() => {
                        if (error) {
                            let errorMessage = error;
                            if (error.stack) {
                                errorMessage = error.stack.includes(error.message)
                                    ? error.stack
                                    : `${error.message}\n${error.stack}`;
                            }
                            console.error(`Unhandled (in react-apollo:${graphQLDisplayName})`, errorMessage);
                        }
                    }, 10);
                    Object.defineProperty(data, 'error', {
                        configurable: true,
                        enumerable: true,
                        get: () => {
                            clearTimeout(logErrorTimeoutId);
                            return error;
                        },
                    });
                    if (loading) {
                        assign(data, this.previousData, currentResult.data);
                    }
                    else if (error) {
                        assign(data, (this.queryObservable.getLastResult() || {}).data);
                    }
                    else {
                        assign(data, currentResult.data);
                        this.previousData = currentResult.data;
                    }
                    if (!this.querySubscription) {
                        data.refetch = args => {
                            return new Promise((r, f) => {
                                this.refetcherQueue = { resolve: r, reject: f, args };
                            });
                        };
                    }
                }
                return data;
            }
            render() {
                if (this.shouldSkip()) {
                    if (operationOptions.withRef) {
                        return (React.createElement(WrappedComponent, Object.assign({}, assign({}, this.props, { ref: this.setWrappedInstance }))));
                    }
                    return React.createElement(WrappedComponent, Object.assign({}, this.props));
                }
                const { shouldRerender, renderedElement, props } = this;
                this.shouldRerender = false;
                if (!shouldRerender &&
                    renderedElement &&
                    renderedElement.type === WrappedComponent) {
                    return renderedElement;
                }
                const data = this.dataForChild();
                const clientProps = this.calculateResultProps(data);
                const mergedPropsAndData = assign({}, props, clientProps);
                if (operationOptions.withRef)
                    mergedPropsAndData.ref = this.setWrappedInstance;
                this.renderedElement = React.createElement(WrappedComponent, Object.assign({}, mergedPropsAndData));
                return this.renderedElement;
            }
        }
        GraphQL.displayName = graphQLDisplayName;
        GraphQL.WrappedComponent = WrappedComponent;
        GraphQL.contextTypes = {
            client: PropTypes.object,
            getQueryRecycler: PropTypes.func,
        };
        return hoistNonReactStatics(GraphQL, WrappedComponent, {});
    }
    return wrapWithApolloComponent;
}
