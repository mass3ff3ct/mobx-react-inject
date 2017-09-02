import * as React from "react"

export function inject(target: any, propertyName: string, propertyIndex?: number): any

type StoreConstructor<I> = new (...args: any[]) => I

interface StoreContainerInstance {
    has<I>(constructor: StoreConstructor<I>): boolean
    get<I>(constructor: StoreConstructor<I>): I
    resolve<I>(constructor: StoreConstructor<I>): I
}

interface StoreContainerConstructor {
    new <I>(stores?: Iterable<[StoreConstructor<I>, I]>, parentStore?: StoreContainerInstance): StoreContainerInstance
}

export const StoreContainer: StoreContainerConstructor

export interface StoreProviderProps {
    storeContainer?: StoreContainerInstance
    stores?: Iterable<[StoreConstructor<any>, any]>
}

export class StoreProvider extends React.Component<StoreProviderProps, {}> {}
