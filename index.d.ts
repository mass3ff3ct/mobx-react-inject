import * as React from "react"

export function inject(target: any, propertyName: string, propertyIndex?: number): any

export interface StoreConstructor {
    new (...args: any[]): any
}

export type StoreInstance = any

export type ArgumentPositions = number[]

interface StoreContainerInstance {
    has(constructor: StoreConstructor): boolean
    get(constructor: StoreConstructor): StoreInstance
    resolve(constructor: StoreConstructor): StoreInstance
}

interface StoreContainerConstructor {
    new(stores?: Iterable<[StoreConstructor, StoreInstance]>, parentStore?: StoreContainerInstance): StoreContainerInstance
}

export const StoreContainer: StoreContainerConstructor

export interface StoreProviderProps {
    stores?: Iterable<[StoreConstructor, StoreInstance]>
}

export class StoreProvider extends React.Component<StoreProviderProps, void> {}
