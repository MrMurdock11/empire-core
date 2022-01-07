import { MODULE_OPTIONS_METADATA } from "../constants";

export const Module =
	(options: Partial<TModuleOptions>): ClassDecorator =>
	target => {
		const { imports, commands, providers, exports } = options;
		Reflect.defineMetadata(
			MODULE_OPTIONS_METADATA,
			{
				imports: imports ?? [],
				commands: commands ?? [],
				providers: providers ?? [],
				exports: exports ?? [],
			},
			target
		);

		return target;
	};
