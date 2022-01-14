import { TProvider } from "./provider.type";

export type TModuleMetadata = Partial<{
	imports: TClassConstruct[];
	commands: TClassConstruct[];
	providers: TProvider[];
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
