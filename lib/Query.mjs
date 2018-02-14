var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ApolloError, } from 'apollo-client';
import { parser, DocumentType } from './parser';
const pick = require('lodash/pick');
const shallowEqual = require('fbjs/lib/shallowEqual');
const invariant = require('invariant');
function observableQueryFields(observable) {
    const fields = pick(observable, 'refetch', 'fetchMore', 'updateQuery', 'startPolling', 'stopPolling');
    Object.keys(fields).forEach(key => {
        const k = key;
        if (typeof fields[k] === 'function') {
            fields[k] = fields[k].bind(observable);
        }
    });
    return fields;
}
function isDataFilled(data) {
    return Object.keys(data).length > 0;
}
class Query extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.previousData = {};
        this.initializeQueryObservable = (props) => {
            const { variables, pollInterval, fetchPolicy, errorPolicy, notifyOnNetworkStatusChange, query, } = props;
            const operation = parser(query);
            invariant(operation.type === DocumentType.Query, `The <Query /> component requires a graphql query, but got a ${operation.type === DocumentType.Mutation ? 'mutation' : 'subscription'}.`);
            const clientOptions = {
                variables,
                pollInterval,
                query,
                fetchPolicy,
                errorPolicy,
                notifyOnNetworkStatusChange,
            };
            this.queryObservable = this.client.watchQuery(clientOptions);
        };
        this.startQuerySubscription = () => {
            this.querySubscription = this.queryObservable.subscribe({
                next: this.updateCurrentData,
                error: error => {
                    this.resubscribeToQuery();
                    if (!error.hasOwnProperty('graphQLErrors'))
                        throw error;
                    this.updateCurrentData();
                },
            });
        };
        this.removeQuerySubscription = () => {
            if (this.querySubscription) {
                this.querySubscription.unsubscribe();
            }
        };
        this.updateCurrentData = () => {
            this.setState({ result: this.queryObservable.currentResult() });
        };
        this.getQueryResult = () => {
            const { result } = this.state;
            const { loading, networkStatus, errors } = result;
            let { error } = result;
            if (errors && errors.length > 0) {
                error = new ApolloError({ graphQLErrors: errors });
            }
            let data = {};
            if (loading) {
                Object.assign(data, this.previousData, result.data);
            }
            else if (error) {
                Object.assign(data, (this.queryObservable.getLastResult() || {}).data);
            }
            else {
                data = result.data;
                this.previousData = result.data;
            }
            return Object.assign({ client: this.client, data: isDataFilled(data) ? data : undefined, loading,
                error,
                networkStatus }, observableQueryFields(this.queryObservable));
        };
        invariant(!!context.client, `Could not find "client" in the context of Query. Wrap the root component in an <ApolloProvider>`);
        this.client = context.client;
        this.initializeQueryObservable(props);
        this.state = {
            result: this.queryObservable.currentResult(),
        };
    }
    fetchData() {
        const _a = this.props, { children, ssr } = _a, opts = __rest(_a, ["children", "ssr"]);
        let { fetchPolicy } = opts;
        if (ssr === false)
            return false;
        if (fetchPolicy === 'network-only' || fetchPolicy === 'cache-and-network') {
            fetchPolicy = 'cache-first';
        }
        const observable = this.client.watchQuery(Object.assign({}, opts, { fetchPolicy }));
        const result = this.queryObservable.currentResult();
        if (result.loading) {
            return observable.result();
        }
        else {
            return false;
        }
    }
    componentDidMount() {
        this.startQuerySubscription();
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if (shallowEqual(this.props, nextProps) &&
            this.client === nextContext.client) {
            return;
        }
        if (this.client !== nextContext.client) {
            this.client = nextContext.client;
        }
        this.removeQuerySubscription();
        this.initializeQueryObservable(nextProps);
        this.startQuerySubscription();
        this.updateCurrentData();
    }
    componentWillUnmount() {
        this.removeQuerySubscription();
    }
    render() {
        const { children } = this.props;
        const queryResult = this.getQueryResult();
        return children(queryResult);
    }
    resubscribeToQuery() {
        this.removeQuerySubscription();
        const lastError = this.queryObservable.getLastError();
        const lastResult = this.queryObservable.getLastResult();
        this.queryObservable.resetLastResults();
        this.startQuerySubscription();
        Object.assign(this.queryObservable, { lastError, lastResult });
    }
}
Query.contextTypes = {
    client: PropTypes.object.isRequired,
};
export default Query;
