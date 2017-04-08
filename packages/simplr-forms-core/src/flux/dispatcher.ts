import * as flux from "flux";

export interface DispatcherMessage {
    action: any;
}

export class DispatcherClass extends flux.Dispatcher<DispatcherMessage> {
    /**
     * Dispatches a payload to all registered callbacks.
     * 
     * @param {Object} dispatcherMessage
     */
    dispatch(dispatcherMessage: Object): void {
        let payload: DispatcherMessage = {
            action: dispatcherMessage
        };
        try {
            if (!this.isDispatching()) {
                super.dispatch(payload);
            } else {
                throw new Error("SimplrFlux.Dispatcher.dispatch(): Cannot dispatch in the middle of a dispatch.");
            }
        } catch (e) {
            console.error(e);
        }
    }

}

export var Dispatcher = new DispatcherClass();
