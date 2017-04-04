import * as React from "react"
import {StoreContainerInstance, StoreProviderProps} from "../index"
import {StoreContainer} from "./StoreContainer"

export class StoreProvider extends React.Component<StoreProviderProps, void> {

    public static defaultProps = {
        stores: [],
    }

    public static contextTypes = {
        storeContainer: React.PropTypes.instanceOf(StoreContainer),
    }

    public static childContextTypes = {
        storeContainer: React.PropTypes.instanceOf(StoreContainer).isRequired,
    }

    private storeContainer: StoreContainerInstance

    public componentWillMount() {
        this.storeContainer = this.props.storeContainer
            ? this.props.storeContainer
            : new StoreContainer(this.props.stores, this.context.storeContainer)
    }

    public getChildContext() {
        return {storeContainer: this.storeContainer}
    }

    public render() {
        return React.Children.only(this.props.children)
    }
}
