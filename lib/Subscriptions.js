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
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var PropTypes = require("prop-types");
var shallowEqual = require('fbjs/lib/shallowEqual');
var invariant = require('invariant');
var Subscription = (function (_super) {
    __extends(Subscription, _super);
    function Subscription(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.initialize = function (props) {
            _this.queryObservable = _this.client.subscribe({
                query: props.query,
                variables: props.variables,
            });
        };
        _this.startSubscription = function () {
            _this.querySubscription = _this.queryObservable.subscribe({
                next: _this.updateCurrentData,
                error: _this.updateError,
            });
        };
        _this.getInitialState = function () {
            return {
                loading: true,
                error: undefined,
                data: undefined,
            };
        };
        _this.updateCurrentData = function (result) {
            _this.setState({
                data: result.data,
                loading: false,
                error: undefined,
            });
        };
        _this.updateError = function (error) {
            _this.setState({
                error: error,
                loading: false,
            });
        };
        _this.endSubscription = function () {
            if (_this.querySubscription) {
                _this.querySubscription.unsubscribe();
            }
        };
        invariant(!!context.client, "Could not find \"client\" in the context of Subscription. Wrap the root component in an <ApolloProvider>");
        _this.client = context.client;
        _this.initialize(props);
        _this.state = _this.getInitialState();
        return _this;
    }
    Subscription.prototype.componentDidMount = function () {
        this.startSubscription();
    };
    Subscription.prototype.componentWillReceiveProps = function (nextProps, nextContext) {
        if (shallowEqual(this.props, nextProps) &&
            this.client === nextContext.client) {
            return;
        }
        if (this.client !== nextContext.client) {
            this.client = nextContext.client;
        }
        this.endSubscription();
        this.initialize(nextProps);
        this.startSubscription();
        this.setState(this.getInitialState());
    };
    Subscription.prototype.componentWillUnmount = function () {
        this.endSubscription();
    };
    Subscription.prototype.render = function () {
        var _a = this.state, loading = _a.loading, error = _a.error, data = _a.data;
        var result = {
            loading: loading,
            error: error,
            data: data,
        };
        return this.props.children(result);
    };
    Subscription.contextTypes = {
        client: PropTypes.object.isRequired,
    };
    return Subscription;
}(React.Component));
exports.default = Subscription;
//# sourceMappingURL=Subscriptions.js.map