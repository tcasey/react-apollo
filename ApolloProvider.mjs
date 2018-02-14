import * as React from 'react';
import * as PropTypes from 'prop-types';
import { Component } from 'react';
import QueryRecyclerProvider from './QueryRecyclerProvider';
const invariant = require('invariant');
export default class ApolloProvider extends Component {
    constructor(props, context) {
        super(props, context);
        invariant(props.client, 'ApolloClient was not passed a client instance. Make ' +
            'sure you pass in your client via the "client" prop.');
    }
    getChildContext() {
        return {
            client: this.props.client,
        };
    }
    render() {
        return (React.createElement(QueryRecyclerProvider, null, React.Children.only(this.props.children)));
    }
}
ApolloProvider.propTypes = {
    client: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
};
ApolloProvider.childContextTypes = {
    client: PropTypes.object.isRequired,
};
