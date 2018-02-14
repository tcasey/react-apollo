/// <reference types="react" />
import * as React from 'react';
import * as PropTypes from 'prop-types';
import { ObservableQueryRecycler } from './queryRecycler';
export interface QueryRecyclerProviderProps {
    children: React.ReactNode;
}
declare class QueryRecyclerProvider extends React.Component<QueryRecyclerProviderProps> {
    static propTypes: {
        children: PropTypes.Validator<any>;
    };
    static contextTypes: {
        client: PropTypes.Requireable<any>;
    };
    static childContextTypes: {
        getQueryRecycler: PropTypes.Validator<any>;
    };
    private recyclers;
    constructor(props: QueryRecyclerProviderProps);
    componentWillReceiveProps(_: any, nextContext: any): void;
    getQueryRecycler(component: React.Component): ObservableQueryRecycler | undefined;
    getChildContext(): {
        getQueryRecycler: (component: React.Component<{}, {}>) => ObservableQueryRecycler | undefined;
    };
    render(): React.ReactNode;
}
export default QueryRecyclerProvider;
