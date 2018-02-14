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
var react_1 = require("react");
var QueryRecyclerProvider_1 = require("./QueryRecyclerProvider");
var invariant = require('invariant');
var ApolloProvider = (function (_super) {
    __extends(ApolloProvider, _super);
    function ApolloProvider(props, context) {
        var _this = _super.call(this, props, context) || this;
        invariant(props.client, 'ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
        return _this;
    }
    ApolloProvider.prototype.getChildContext = function () {
        return {
            client: this.props.client,
        };
    };
    ApolloProvider.prototype.render = function () {
        return (React.createElement(QueryRecyclerProvider_1.default, null, React.Children.only(this.props.children)));
    };
    ApolloProvider.propTypes = {
        client: PropTypes.object.isRequired,
        children: PropTypes.element.isRequired,
    };
    ApolloProvider.childContextTypes = {
        client: PropTypes.object.isRequired,
    };
    return ApolloProvider;
}(react_1.Component));
exports.default = ApolloProvider;
//# sourceMappingURL=ApolloProvider.js.map