export type TProvider<TType = any> = {
	construct: TClassConstruct<TType>;
	useFactory: () => TType;
};
