import {StoreConstructor} from "../index"
import {resolveDependencies} from "./utils"

export class StoreContainer {

    private map: Map<StoreConstructor<any>, any>

    private parentStore: StoreContainer

    public constructor(stores: Iterable<[StoreConstructor<any>, any]> = [], parentStore?: StoreContainer) {
        this.map = new Map(stores)
        this.map.set(StoreContainer, this)
        if (parentStore) {
            this.parentStore = parentStore
        }
    }

    private hasInParentStore(constructor: StoreConstructor<any>) {
        return this.parentStore && this.parentStore.has(constructor)
    }

    public has<I>(constructor: StoreConstructor<I>) {
        return this.map.has(constructor) || this.hasInParentStore(constructor)
    }

    public get<I>(constructor: StoreConstructor<I>) {
        if (this.hasInParentStore(constructor)) {
            return this.parentStore.get(constructor)
        }

        if (!this.map.has(constructor)) {
            this.map.set(constructor, this.resolve(constructor))
        }

        return this.map.get(constructor)
    }

    public resolve<I>(constructor: StoreConstructor<I>, ...args: any[]) {
        const resolvedDependencies = resolveDependencies(constructor, this).map((dependency) => this.get(dependency))
        return new constructor(...resolvedDependencies, ...args)
    }
}
