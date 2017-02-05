import * as assert from "power-assert"
import "reflect-metadata"
import {inject, StoreContainer} from "../src"

describe("Dependency injection", () => {
    class NoDependencyStore {}

    class ValidDependencyStore {
        constructor(@inject public validDependencyStore: NoDependencyStore) {}
    }

    class CyclicDependencyStore {
        constructor(@inject public cyclicDependencyStore: CyclicDependencyStore) {}
    }

    it("should create store with valid dependency", () => {
        let store: ValidDependencyStore
        assert.doesNotThrow(() => {
            store = (new StoreContainer()).get(ValidDependencyStore) as ValidDependencyStore
        })
        assert(store.validDependencyStore instanceof NoDependencyStore)
    })

    it("should throw exception if inject no valid dependency in store", () => {
        assert.throws(() => {
            class NoValidDependencyStore {
                constructor(@inject public noValidDependencyStore: string) {}
            }
        })
    })

    it("should resolve nested store containers", () => {
        const storeContainerParent = new StoreContainer()
        const storeContainerChild = new StoreContainer([], storeContainerParent)
        assert(storeContainerChild.get(NoDependencyStore) !== storeContainerParent.get(NoDependencyStore))
        assert(storeContainerParent.get(ValidDependencyStore) === storeContainerChild.get(ValidDependencyStore))
    })

    it("should resolve new instance store", () => {
        const storeContainer = new StoreContainer()
        const store = storeContainer.get(NoDependencyStore)
        const storeResolved = storeContainer.resolve(NoDependencyStore)
        assert(store !== storeResolved)
    })

    it("should resolve dependencies with correct sequence", () => {
        class CorrectDependencyStore {
            public noDependencyStore: NoDependencyStore
            public validDependencyStore: ValidDependencyStore
            constructor(@inject noDependencyStore: NoDependencyStore, @inject validDependencyStore: ValidDependencyStore){
                this.noDependencyStore = noDependencyStore
                this.validDependencyStore = validDependencyStore
            }
        }

        const storeContainer = new StoreContainer()
        const store = storeContainer.get(CorrectDependencyStore)
        assert(store.noDependencyStore instanceof NoDependencyStore)
        assert(store.validDependencyStore instanceof ValidDependencyStore)
    })

    it("should throw exception if inject dependency in property store", () => {
        assert.throws(() => {
            class NoConstructorDependencyStore {
                @inject
                public noConstructorDependencyStore: NoConstructorDependencyStore
            }
        })
    })

    it("should throw exception when detect cyclic dependency", () => {
        assert.throws(() => {
            (new StoreContainer()).get(CyclicDependencyStore)
        })
    })

    it("should create store with the substitution of dependency", () => {
        const storeContainer = new StoreContainer([[NoDependencyStore, new Date()]])
        const store = storeContainer.resolve(ValidDependencyStore)
        assert(store.validDependencyStore instanceof Date)
    })

})
