import {StoreConstructor, StoreInstance} from "../index"
import {resolveDependencies} from "./utils"

export class StoreContainer {

    private map: Map<StoreConstructor, StoreInstance>

    private parentStore: StoreContainer

    public constructor(stores: Iterable<[StoreConstructor, StoreInstance]> = [], parentStore?: StoreContainer) {
        this.map = new Map(stores)
        this.map.set(StoreContainer, this)
        if (parentStore) {
            this.parentStore = parentStore
        }
    }

    private hasInParentStore(constructor: StoreConstructor) {
        return this.parentStore && this.parentStore.has(constructor)
    }

    public has(constructor: StoreConstructor) {
        return this.map.has(constructor) || this.hasInParentStore(constructor)
    }

    public get(constructor: StoreConstructor) {
        if (this.hasInParentStore(constructor)) {
            return this.parentStore.get(constructor)
        }

        if (!this.map.has(constructor)) {
            this.map.set(constructor, this.resolve(constructor))
        }

        return this.map.get(constructor)
    }

    public resolve(constructor: StoreConstructor) {
        const resolvedDependencies = resolveDependencies(constructor, this).map((dependency) => this.get(dependency))
        return new constructor(...resolvedDependencies)
    }
}
