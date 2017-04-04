import * as React from "react"
import {StoreContainer} from "./StoreContainer"
import {ArgumentPositions, checkValidDependency, metadataKey, throwError} from "./utils"

function propertyDecorator(target: any, propertyName: string) {
    if (!(target instanceof React.Component)) {
        throwError("Injection store can implement only in React.Component", target)
    }
    const targetConstructor = target.constructor
    const storeConstructor = Reflect.getMetadata("design:type", target, propertyName)

    checkValidDependency(target, storeConstructor)

    if (targetConstructor.contextTypes == null) {
        targetConstructor.contextTypes = {}
    }

    if (targetConstructor.contextTypes.storeContainer == null) {
        targetConstructor.contextTypes.storeContainer = React.PropTypes.instanceOf(StoreContainer).isRequired
    }

    Object.defineProperty(target, propertyName, {
        get() {
            return this.context.storeContainer.get(storeConstructor)
        },
    })
}

function parameterDecorator(target: any, parameterIndex: number) {
    const injectParameters: ArgumentPositions = Reflect.getMetadata(metadataKey, target) || []
    const parametersTypes = Reflect.getMetadata("design:paramtypes", target)
    checkValidDependency(target, parametersTypes[parameterIndex])
    injectParameters.push(parameterIndex)
    Reflect.defineMetadata(metadataKey, injectParameters, target)
}

export function inject(target: any, propertyName: string, propertyIndex?: number): any {
    if (propertyName && propertyIndex === void 0) {
        return propertyDecorator(target, propertyName)
    } else if (!propertyName && propertyIndex !== void 0) {
        return parameterDecorator(target, propertyIndex)
    }
    throwError("Decorator is to be applied to property in React.Component, or to a store constructor argument", target)
}
