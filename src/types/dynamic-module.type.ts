import { TModuleMetadata } from "./module-metadata.type";

export type TDynamicModule = {
	construct: TClassConstruct;
} & TModuleMetadata;
