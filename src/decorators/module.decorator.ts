import { MODULE_OPTIONS_METADATA } from "../constants";
import { TModuleOptions } from "../types/module-options.type";

export const Module =
	(options: Partial<TModuleOptions>): ClassDecorator =>
	target => {
		const { imports, commands, providers, exports } = options;

		Reflect.defineMetadata(
			MODULE_OPTIONS_METADATA,
			{
				construct: target,
				imports: imports ?? [],
				commands: commands ?? [],
				providers: providers ?? [],
				exports: exports ?? [],
			},
			target
		);

		return target;
	};
