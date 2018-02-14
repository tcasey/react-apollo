/// <reference types="react" />
import * as React from 'react';
import { DocumentNode } from 'graphql';
import { OperationOption, DataProps, MutateProps } from './types';
export default function graphql<TProps extends TGraphQLVariables | {} = {}, TData = {}, TGraphQLVariables = {}, TChildProps = Partial<DataProps<TData, TGraphQLVariables>> & Partial<MutateProps<TData, TGraphQLVariables>>>(document: DocumentNode, operationOptions?: OperationOption<TProps, TData, TGraphQLVariables, TChildProps>): (WrappedComponent: React.ComponentType<TChildProps & TProps>) => React.ComponentClass<TProps>;
