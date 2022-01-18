import { flatten, includes, map, uniqBy } from "lodash";
import { MODULE_OPTIONS_METADATA } from "./constants";
import { Command } from "./models/command";
import { Module } from "./models/module";
import { Provider } from "./models/provider";
import {
	normalizeMetadata,
	TModuleMetadata,
} from "./types/module-metadata.type";
import { TModuleOptions } from "./types/module-options.type";

export interface IScanner {
	scan(rootModule: TClassConstruct): void;

	findProvider(construct: TClassConstruct): Provider;

	canInject(injectable: TClassConstruct, parent: TClassConstruct): boolean;
}

export class Scanner implements IScanner {
	private _module: Module;

	private _commands: Command[] = [];

	private _global: Module[] = [];

	public scan(module: TClassConstruct): void {
		this._module = this.buildModuleTree(module);
	}

	public findProvider(construct: TClassConstruct<any>): Provider {
		const module = this.findModule(construct);
		const provider = module.providers.find(p => p.construct === construct);

		return provider;
	}

	public canInject(
		target: TClassConstruct,
		parent: TClassConstruct
	): boolean {
		const module = this.findModule(parent);

		// проверить является ли провайдер частью родительского модуля.
		const isProviderOrCommand = module.has(target);
		if (isProviderOrCommand) {
			return true;
		}

		// проверить не является ли провайдер экспортируемым.
		const uniqChildrenModules = uniqBy(
			[...module.imports, ...this._global],
			"construct"
		);
		const childrenExportableProviders = flatten(
			uniqChildrenModules.map(m => m.providers.filter(p => p.exportable))
		);

		const isExportableProvider = childrenExportableProviders.some(
			p => p.construct === target
		);

		if (isExportableProvider) {
			return true;
		}

		return false;
	}

	/**
	 * Выполняет поиск родительского модуля для указанного конструкта.
	 *
	 * @remark Если не используется `modules`, то метод берет корневой модуль
	 * хранимый в экземпляре сканера, иначе воспринимает указанный модуль как корневой
	 * и ищет относительно него.
	 *
	 * @param {TClassConstruct} providerConstruct Конструкт провайдера.
	 * @return {Module} Модуль в котором содержится провайдер.
	 * @memberof Scanner
	 */
	private findModule(providerConstruct: TClassConstruct): Module | undefined {
		let queue = [this._module];

		while (queue.length > 0) {
			const module = queue.shift();

			const isCorrectModule = module.has(providerConstruct);
			if (isCorrectModule) {
				return module;
			}

			queue = queue.concat(module.imports);
		}

		return void 0;
	}

	private dive(target: TClassConstruct | TModuleMetadata): Module {
		const isDynamicModule = "construct" in target;
		const construct = isDynamicModule ? target.construct : target;

		if (!Reflect.hasMetadata(MODULE_OPTIONS_METADATA, construct)) {
			throw new TypeError(
				`"${construct.constructor.name}" hasn't register into system.`
			);
		}

		const options: TModuleMetadata = isDynamicModule
			? normalizeMetadata(target)
			: Reflect.getMetadata(MODULE_OPTIONS_METADATA, construct);
		const imports = options.imports.map(i => this.dive(i));
		const providers = options.providers.map(
			({ construct, useFactory }) =>
				new Provider(
					construct,
					options.exports.some(e => e === construct),
					useFactory
				)
		);
		const commands = options.commands.map(c => new Command(c));
		this._commands = this._commands.concat(commands);

		const module = Module.create(construct, imports, providers);
		if (module.global) {
			this._global.push(module);
		}

		return module;
	}

	private buildModuleTree(moduleConstruct: TClassConstruct): Module {
		if (moduleConstruct === undefined) {
			throw new TypeError(`Module is undefined`);
		}

		if (!Reflect.hasMetadata(MODULE_OPTIONS_METADATA, moduleConstruct)) {
			throw new TypeError(
				`"${moduleConstruct.constructor.name}" hasn't register into system. You use this module but you never define him.`
			);
		}

		const options: TModuleMetadata = Reflect.getMetadata(
			MODULE_OPTIONS_METADATA,
			moduleConstruct
		);
		const imports = map(options.imports, construct =>
			this.buildModuleTree(construct)
		);
		const providers = map(
			options.providers,
			({ construct, useFactory }) =>
				new Provider(
					construct,
					includes(options.exports, construct),
					useFactory
				)
		);

		return Module.create(moduleConstruct, undefined, providers);
	}
}
