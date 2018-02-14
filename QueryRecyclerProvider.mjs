import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ObservableQueryRecycler } from './queryRecycler';
class QueryRecyclerProvider extends React.Component {
    constructor(props) {
        super(props);
        this.recyclers = new WeakMap();
        this.getQueryRecycler = this.getQueryRecycler.bind(this);
    }
    componentWillReceiveProps(_, nextContext) {
        if (this.context.client !== nextContext.client) {
            this.recyclers = new WeakMap();
        }
    }
    getQueryRecycler(component) {
        if (!this.recyclers.has(component)) {
            this.recyclers.set(component, new ObservableQueryRecycler());
        }
        return this.recyclers.get(component);
    }
    getChildContext() {
        return {
            getQueryRecycler: this.getQueryRecycler,
        };
    }
    render() {
        return this.props.children;
    }
}
QueryRecyclerProvider.propTypes = {
    children: PropTypes.element.isRequired,
};
QueryRecyclerProvider.contextTypes = {
    client: PropTypes.object,
};
QueryRecyclerProvider.childContextTypes = {
    getQueryRecycler: PropTypes.func.isRequired,
};
export default QueryRecyclerProvider;
