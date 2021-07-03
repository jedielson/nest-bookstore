export interface IBuilder<TBuilder, TObject> {
  withDefaultConfigs(): TBuilder;
  withAsyncFactory(): TBuilder;
  withAsyncTransform(): TBuilder;
  build(): Promise<TObject>;
  buildList(length: number): Promise<TObject[]>;
}
