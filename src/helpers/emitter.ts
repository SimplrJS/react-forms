// tslint:disable-next-line:no-any
export type Callback = (...args: any[]) => void;

export class TinyEmitter<THandler extends Callback> {
    private registry?: Callback | Callback[];

    public addListener(handler: THandler): () => void {
        if (this.registry == null) {
            this.registry = handler;
        } else if (Array.isArray(this.registry)) {
            this.registry.push(handler);
        } else {
            this.registry = [this.registry, handler];
        }

        return () => this.removeListener(handler);
    }

    public removeListener(handler: THandler): void {
        if (this.registry == null) {
            return;
        }

        if (Array.isArray(this.registry)) {
            const nextArray: Callback[] = [];

            for (let i = 0; i < this.registry.length; i++) {
                const callback = this.registry[i];
                if (callback !== handler) {
                    nextArray.push(callback);
                }
            }

            this.registry = nextArray;
        } else {
            this.registry = undefined;
        }
    }

    public emit(...payload: Parameters<THandler>): void {
        if (this.registry == null) {
            return;
        }

        if (Array.isArray(this.registry)) {
            for (let i = 0; i < this.registry.length; i++) {
                this.registry[i](...payload);
            }
        } else {
            this.registry(...payload);
        }
    }

    public getListenersCount(): number {
        if (this.registry == null) {
            return 0;
        }

        if (Array.isArray(this.registry)) {
            return this.registry.length;
        } else {
            return 1;
        }
    }
}
