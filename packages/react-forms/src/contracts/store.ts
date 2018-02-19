export interface StoreHydration<TData> {
    hydrate(data: TData): void;
    dehydrate(): TData;
}
