type TInstanceClass<TClass = any> = TClass;
type TClassConstruct<TClass = any> = {
	new (...args: any[]): TClass;
};
type TUuid = string;

// * new type ---------------------------------------------------------
type TConstruct<TClassType = any> = {
	new (...args: any[]): TClassType;
};
