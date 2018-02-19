import { ActionEmitter } from "action-emitter";
import { StoreHydration } from "../contracts/store";

export type StoreSetStateHandler<TState> = (state: TState) => TState;

export abstract class BaseStore<TState, THydrate> extends ActionEmitter implements StoreHydration<THydrate> {
    private state: TState = this.getInitialState();

    protected abstract getInitialState(): TState;
    protected setState<TPayload>(action: TPayload, handler: StoreSetStateHandler<TState>): void {
        const nextState = handler(this.state);
        if (nextState === this.state) {
            return;
        }

        this.emit(action);
        // this.emit(new StateChangedAction());
    }

    public abstract hydrate(data: THydrate): void;
    public abstract dehydrate(): THydrate;
}
