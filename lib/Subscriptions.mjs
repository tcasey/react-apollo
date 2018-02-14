import * as React from 'react';
import * as PropTypes from 'prop-types';
const shallowEqual = require('fbjs/lib/shallowEqual');
const invariant = require('invariant');
class Subscription extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.initialize = (props) => {
            this.queryObservable = this.client.subscribe({
                query: props.query,
                variables: props.variables,
            });
        };
        this.startSubscription = () => {
            this.querySubscription = this.queryObservable.subscribe({
                next: this.updateCurrentData,
                error: this.updateError,
            });
        };
        this.getInitialState = () => {
            return {
                loading: true,
                error: undefined,
                data: undefined,
            };
        };
        this.updateCurrentData = (result) => {
            this.setState({
                data: result.data,
                loading: false,
                error: undefined,
            });
        };
        this.updateError = (error) => {
            this.setState({
                error,
                loading: false,
            });
        };
        this.endSubscription = () => {
            if (this.querySubscription) {
                this.querySubscription.unsubscribe();
            }
        };
        invariant(!!context.client, `Could not find "client" in the context of Subscription. Wrap the root component in an <ApolloProvider>`);
        this.client = context.client;
        this.initialize(props);
        this.state = this.getInitialState();
    }
    componentDidMount() {
        this.startSubscription();
    }
    componentWillReceiveProps(nextProps, nextContext) {
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
    }
    componentWillUnmount() {
        this.endSubscription();
    }
    render() {
        const { loading, error, data } = this.state;
        const result = {
            loading,
            error,
            data,
        };
        return this.props.children(result);
    }
}
Subscription.contextTypes = {
    client: PropTypes.object.isRequired,
};
export default Subscription;
