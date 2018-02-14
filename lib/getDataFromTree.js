"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var assign = require('object-assign');
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
function walkTree(element, context, visitor) {
    if (Array.isArray(element)) {
        element.forEach(function (item) { return walkTree(item, context, visitor); });
        return;
    }
    if (!element)
        return;
    if (isReactElement(element)) {
        if (typeof element.type === 'function') {
            var Comp = element.type;
            var props = assign({}, Comp.defaultProps, getProps(element));
            var childContext = context;
            var child = void 0;
            if (isComponentClass(Comp)) {
                var instance_1 = new Comp(props, context);
                instance_1.props = instance_1.props || props;
                instance_1.context = instance_1.context || context;
                instance_1.state = instance_1.state || null;
                instance_1.setState = function (newState) {
                    if (typeof newState === 'function') {
                        newState = newState(instance_1.state, instance_1.props, instance_1.context);
                    }
                    instance_1.state = assign({}, instance_1.state, newState);
                };
                if (instance_1.componentWillMount) {
                    instance_1.componentWillMount();
                }
                if (providesChildContext(instance_1)) {
                    childContext = assign({}, context, instance_1.getChildContext());
                }
                if (visitor(element, instance_1, context) === false) {
                    return;
                }
                child = instance_1.render();
            }
            else {
                if (visitor(element, null, context) === false) {
                    return;
                }
                child = Comp(props, context);
            }
            if (child) {
                if (Array.isArray(child)) {
                    child.forEach(function (item) { return walkTree(item, context, visitor); });
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
                react_1.Children.forEach(element.props.children, function (child) {
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
exports.walkTree = walkTree;
function hasFetchDataFunction(instance) {
    return typeof instance.fetchData === 'function';
}
function isPromise(query) {
    return typeof query.then === 'function';
}
function getQueriesFromTree(_a, fetchRoot) {
    var rootElement = _a.rootElement, _b = _a.rootContext, rootContext = _b === void 0 ? {} : _b;
    if (fetchRoot === void 0) { fetchRoot = true; }
    var queries = [];
    walkTree(rootElement, rootContext, function (element, instance, context) {
        var skipRoot = !fetchRoot && element === rootElement;
        if (skipRoot)
            return;
        if (instance && isReactElement(element) && hasFetchDataFunction(instance)) {
            var query = instance.fetchData();
            if (isPromise(query)) {
                queries.push({ query: query, element: element, context: context });
                return false;
            }
        }
    });
    return queries;
}
function getDataFromTree(rootElement, rootContext, fetchRoot) {
    if (rootContext === void 0) { rootContext = {}; }
    if (fetchRoot === void 0) { fetchRoot = true; }
    var queries = getQueriesFromTree({ rootElement: rootElement, rootContext: rootContext }, fetchRoot);
    if (!queries.length)
        return Promise.resolve();
    var errors = [];
    var mappedQueries = queries.map(function (_a) {
        var query = _a.query, element = _a.element, context = _a.context;
        return query
            .then(function (_) { return getDataFromTree(element, context, false); })
            .catch(function (e) { return errors.push(e); });
    });
    return Promise.all(mappedQueries).then(function (_) {
        if (errors.length > 0) {
            var error = errors.length === 1
                ? errors[0]
                : new Error(errors.length + " errors were thrown when executing your GraphQL queries.");
            error.queryErrors = errors;
            throw error;
        }
    });
}
exports.default = getDataFromTree;
//# sourceMappingURL=getDataFromTree.js.map