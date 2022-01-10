import { TProviderFactory } from "./provider-factory.type";

export type TModuleMetadata = Partial<{
	imports: TClassConstruct[];
	commands: TClassConstruct[];
	providers: (TClassConstruct | TProviderFactory)[];
	exports: TClassConstruct[];
}>;

export const normalizeMetadata = (
	metadata: TModuleMetadata
): TModuleMetadata => {
	return {
		exports: metadata.exports ?? [],
		providers: metadata.providers ?? [],
		imports: metadata.imports ?? [],
		commands: metadata.commands ?? [],
	};
};
