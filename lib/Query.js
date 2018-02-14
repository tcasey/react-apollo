"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var apollo_client_1 = require("apollo-client");
var parser_1 = require("./parser");
var pick = require('lodash/pick');
var shallowEqual = require('fbjs/lib/shallowEqual');
var invariant = require('invariant');
function observableQueryFields(observable) {
    var fields = pick(observable, 'refetch', 'fetchMore', 'updateQuery', 'startPolling', 'stopPolling');
    Object.keys(fields).forEach(function (key) {
        var k = key;
        if (typeof fields[k] === 'function') {
            fields[k] = fields[k].bind(observable);
        }
    });
    return fields;
}
function isDataFilled(data) {
    return Object.keys(data).length > 0;
}
var Query = (function (_super) {
    __extends(Query, _super);
    function Query(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.previousData = {};
        _this.initializeQueryObservable = function (props) {
            var variables = props.variables, pollInterval = props.pollInterval, fetchPolicy = props.fetchPolicy, errorPolicy = props.errorPolicy, notifyOnNetworkStatusChange = props.notifyOnNetworkStatusChange, query = props.query;
            var operation = parser_1.parser(query);
            invariant(operation.type === parser_1.DocumentType.Query, "The <Query /> component requires a graphql query, but got a " + (operation.type === parser_1.DocumentType.Mutation ? 'mutation' : 'subscription') + ".");
            var clientOptions = {
                variables: variables,
                pollInterval: pollInterval,
                query: query,
                fetchPolicy: fetchPolicy,
                errorPolicy: errorPolicy,
                notifyOnNetworkStatusChange: notifyOnNetworkStatusChange,
            };
            _this.queryObservable = _this.client.watchQuery(clientOptions);
        };
        _this.startQuerySubscription = function () {
            _this.querySubscription = _this.queryObservable.subscribe({
                next: _this.updateCurrentData,
                error: function (error) {
                    _this.resubscribeToQuery();
                    if (!error.hasOwnProperty('graphQLErrors'))
                        throw error;
                    _this.updateCurrentData();
                },
            });
        };
        _this.removeQuerySubscription = function () {
            if (_this.querySubscription) {
                _this.querySubscription.unsubscribe();
            }
        };
        _this.updateCurrentData = function () {
            _this.setState({ result: _this.queryObservable.currentResult() });
        };
        _this.getQueryResult = function () {
            var result = _this.state.result;
            var loading = result.loading, networkStatus = result.networkStatus, errors = result.errors;
            var error = result.error;
            if (errors && errors.length > 0) {
                error = new apollo_client_1.ApolloError({ graphQLErrors: errors });
            }
            var data = {};
            if (loading) {
                Object.assign(data, _this.previousData, result.data);
            }
            else if (error) {
                Object.assign(data, (_this.queryObservable.getLastResult() || {}).data);
            }
            else {
                data = result.data;
                _this.previousData = result.data;
            }
            return __assign({ client: _this.client, data: isDataFilled(data) ? data : undefined, loading: loading,
                error: error,
                networkStatus: networkStatus }, observableQueryFields(_this.queryObservable));
        };
        invariant(!!context.client, "Could not find \"client\" in the context of Query. Wrap the root component in an <ApolloProvider>");
        _this.client = context.client;
        _this.initializeQueryObservable(props);
        _this.state = {
            result: _this.queryObservable.currentResult(),
        };
        return _this;
    }
    Query.prototype.fetchData = function () {
        var _a = this.props, children = _a.children, ssr = _a.ssr, opts = __rest(_a, ["children", "ssr"]);
        var fetchPolicy = opts.fetchPolicy;
        if (ssr === false)
            return false;
        if (fetchPolicy === 'network-only' || fetchPolicy === 'cache-and-network') {
            fetchPolicy = 'cache-first';
        }
        var observable = this.client.watchQuery(__assign({}, opts, { fetchPolicy: fetchPolicy }));
        var result = this.queryObservable.currentResult();
        if (result.loading) {
            return observable.result();
        }
        else {
            return false;
        }
    };
    Query.prototype.componentDidMount = function () {
        this.startQuerySubscription();
    };
    Query.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
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
    };
    Query.prototype.componentWillUnmount = function () {
        this.removeQuerySubscription();
    };
    Query.prototype.render = function () {
        var children = this.props.children;
        var queryResult = this.getQueryResult();
        return children(queryResult);
    };
    Query.prototype.resubscribeToQuery = function () {
        this.removeQuerySubscription();
        var lastError = this.queryObservable.getLastError();
        var lastResult = this.queryObservable.getLastResult();
        this.queryObservable.resetLastResults();
        this.startQuerySubscription();
        Object.assign(this.queryObservable, { lastError: lastError, lastResult: lastResult });
    };
    Query.contextTypes = {
        client: PropTypes.object.isRequired,
    };
    return Query;
}(React.Component));
exports.default = Query;
//# sourceMappingURL=Query.js.map