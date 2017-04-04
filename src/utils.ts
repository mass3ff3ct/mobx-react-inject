import {StoreConstructor, StoreContainerInstance} from "../index"

export type ArgumentPositions = number[]

const nativeExp = /\{\s*\[native code\]\s*\}/

export const metadataKey = Symbol()

export function resolveDependencies<I>(
    constructor: StoreConstructor<I>,
    container: StoreContainerInstance,
    parentDependencies = new Set<StoreConstructor<any>>(),
) {
    const argumentPositions: ArgumentPositions = Reflect.getOwnMetadata(metadataKey, constructor) || []
    const constructorDependencies: any[] = Reflect.getMetadata("design:paramtypes", constructor) || []
    const resolvedDependencies = new Array(constructorDependencies.length)

    parentDependencies.add(constructor)

    argumentPositions.forEach((position) => {
        const dependency = constructorDependencies[position]

        if (!container.has(dependency)) {
            detectCircularDependencies(parentDependencies, dependency)
            resolveDependencies(dependency, container, parentDependencies)
        }

        resolvedDependencies[position] = dependency
    })

    parentDependencies.delete(constructor)

    return resolvedDependencies
}

function isNative(fn: Function) {
    return nativeExp.test("" + fn)
}

export function throwError(message: string, target?: any) {
    throw new Error(`${message}.${target ? ` Error occurred in ${target.name}` : ""}`)
}

export function detectCircularDependencies<I>(dependencies: Set<StoreConstructor<any>>, constructor: StoreConstructor<I>) {
    if (dependencies.has(constructor)) {
        const chains = Array.from(dependencies.values()).map((dependency) => dependency.name).join(" -> ")
        throwError(`Circular dependencies are found in the following chain "${chains}"`)
    }
}

export function checkValidDependency(target: any, dependency: Function) {
    if (!dependency || !("constructor" in dependency)) {
        throwError("Dependency must have a constructor", target)
    }
    if (isNative(dependency)) {
        throwError("Dependency may not be native implementation", target)
    }
}

