type TInstanceClass<TClass = any> = TClass;
type TClassConstruct<TClass = any> = {
	new (...args: any[]): TClass;
};
