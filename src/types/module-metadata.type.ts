import { TProvider } from "./provider.type";

export type TModuleMetadata = {
	construct: TClassConstruct;
	imports?: TClassConstruct[];
	commands?: TClassConstruct[];
	providers?: TProvider[];
	exports?: TClassConstruct[];
};

export const normalizeMetadata = (
	metadata: TModuleMetadata
): TModuleMetadata => {
	return {
		construct: metadata.construct,
		exports: metadata.exports ?? [],
		providers: metadata.providers ?? [],
		imports: metadata.imports ?? [],
		commands: metadata.commands ?? [],
	};
};
