export type ItemHandler = (item: any) => Promise<any>;

export interface IFlowService {
  each<TData>(
    items: TData[],
    handler: ItemHandler,
    parallelCount?: number
  ): Promise<any>;
}
