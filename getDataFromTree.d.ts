/// <reference types="react" />
import { ReactElement, ReactNode, Component } from 'react';
import ApolloClient from 'apollo-client';
export interface Context<Cache> {
    client?: ApolloClient<Cache>;
    store?: any;
    [key: string]: any;
}
export interface QueryTreeArgument<Cache> {
    rootElement: ReactElement<any>;
    rootContext?: Context<Cache>;
}
export interface QueryTreeResult<Cache> {
    query: Promise<Object>;
    element: ReactElement<any>;
    context: Context<Cache>;
}
export declare function walkTree<Cache>(element: ReactNode, context: Context<Cache>, visitor: (element: ReactElement<any> | string | number, instance: Component<any> | null, context: Context<Cache>) => boolean | void): void;
export default function getDataFromTree(rootElement: ReactElement<any>, rootContext?: any, fetchRoot?: boolean): Promise<void>;
