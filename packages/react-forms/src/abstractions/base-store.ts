import { ActionEmitter } from "action-emitter";
import { StoreHydration } from "../contracts/store";
import { StoreStateChanged } from "../actions/store-actions";

export type StoreSetStateHandler<TState> = (state: TState) => TState;

export abstract class BaseStore<TState, THydrate> extends ActionEmitter implements StoreHydration<THydrate> {
    /**
     * State is private so it only get updated throught `setState` method.
     */
    private state: TState = this.getInitialState();

    /**
     * Constructs the initial state for this store.
     * This is called once during construction of the store.
     */
    protected abstract getInitialState(): TState;

    /**
     * Updates store state and emits specific given action and `StoreStateChanged` action.
     * @param action Specific given action that will be emitted.
     * @param handler State update handler.
     */
    protected setState<TPayload>(action: TPayload, handler: StoreSetStateHandler<TState>): void {
        const nextState = handler(this.state);
        if (nextState === this.state) {
            return;
        }
        this.state = nextState;

        this.emit(action);
        this.emit(new StoreStateChanged());
    }

    protected getState(): TState {
        return this.state;
    }

    public abstract hydrate(data: THydrate): void;
    public abstract dehydrate(): THydrate;
}
