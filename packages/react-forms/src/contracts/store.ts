export interface HydratableStore<TData> {
    hydrate(data: TData): void;
    dehydrate(): TData;
}
