import { Children, } from 'react';
const assign = require('object-assign');
function getProps(element) {
    return (element.props ||
        element.attributes);
}
function isReactElement(element) {
    return !!element.type;
}
function isComponentClass(Comp) {
    return (Comp.prototype && (Comp.prototype.render || Comp.prototype.isReactComponent));
}
function providesChildContext(instance) {
    return !!instance.getChildContext;
}
export function walkTree(element, context, visitor) {
    if (Array.isArray(element)) {
        element.forEach(item => walkTree(item, context, visitor));
        return;
    }
    if (!element)
        return;
    if (isReactElement(element)) {
        if (typeof element.type === 'function') {
            const Comp = element.type;
            const props = assign({}, Comp.defaultProps, getProps(element));
            let childContext = context;
            let child;
            if (isComponentClass(Comp)) {
                const instance = new Comp(props, context);
                instance.props = instance.props || props;
                instance.context = instance.context || context;
                instance.state = instance.state || null;
                instance.setState = newState => {
                    if (typeof newState === 'function') {
                        newState = newState(instance.state, instance.props, instance.context);
                    }
                    instance.state = assign({}, instance.state, newState);
                };
                if (instance.componentWillMount) {
                    instance.componentWillMount();
                }
                if (providesChildContext(instance)) {
                    childContext = assign({}, context, instance.getChildContext());
                }
                if (visitor(element, instance, context) === false) {
                    return;
                }
                child = instance.render();
            }
            else {
                if (visitor(element, null, context) === false) {
                    return;
                }
                child = Comp(props, context);
            }
            if (child) {
                if (Array.isArray(child)) {
                    child.forEach(item => walkTree(item, context, visitor));
                }
                else {
                    walkTree(child, childContext, visitor);
                }
            }
        }
        else {
            if (visitor(element, null, context) === false) {
                return;
            }
            if (element.props && element.props.children) {
                Children.forEach(element.props.children, (child) => {
                    if (child) {
                        walkTree(child, context, visitor);
                    }
                });
            }
        }
    }
    else if (typeof element === 'string' || typeof element === 'number') {
        visitor(element, null, context);
    }
}
function hasFetchDataFunction(instance) {
    return typeof instance.fetchData === 'function';
}
function isPromise(query) {
    return typeof query.then === 'function';
}
function getQueriesFromTree({ rootElement, rootContext = {} }, fetchRoot = true) {
    const queries = [];
    walkTree(rootElement, rootContext, (element, instance, context) => {
        const skipRoot = !fetchRoot && element === rootElement;
        if (skipRoot)
            return;
        if (instance && isReactElement(element) && hasFetchDataFunction(instance)) {
            const query = instance.fetchData();
            if (isPromise(query)) {
                queries.push({ query, element, context });
                return false;
            }
        }
    });
    return queries;
}
export default function getDataFromTree(rootElement, rootContext = {}, fetchRoot = true) {
    let queries = getQueriesFromTree({ rootElement, rootContext }, fetchRoot);
    if (!queries.length)
        return Promise.resolve();
    const errors = [];
    const mappedQueries = queries.map(({ query, element, context }) => {
        return query
            .then(_ => getDataFromTree(element, context, false))
            .catch(e => errors.push(e));
    });
    return Promise.all(mappedQueries).then(_ => {
        if (errors.length > 0) {
            const error = errors.length === 1
                ? errors[0]
                : new Error(`${errors.length} errors were thrown when executing your GraphQL queries.`);
            error.queryErrors = errors;
            throw error;
        }
    });
}
