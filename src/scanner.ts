import { flatten, omit, partial, uniqBy } from "lodash";
import { MODULE_OPTIONS_METADATA } from "./constants";
import { Command } from "./models/command";
import { Module } from "./models/module";
import { Provider } from "./models/provider";
import { ProviderFactory } from "./models/provider-factory";
import { TDynamicModule } from "./types/dynamic-module.type";
import {
	normalizeMetadata,
	TModuleMetadata,
} from "./types/module-metadata.type";

export interface IScanner {
	scan(rootModule: TClassConstruct): void;

	findCommandConstruct(token: string): TClassConstruct;

	findProvider(construct: TClassConstruct): Provider | ProviderFactory;

	canInject(injectable: TClassConstruct, parent: TClassConstruct): boolean;
}

export class Scanner implements IScanner {
	private _module: Module;

	private _commands: Command[] = [];

	private _global: Module[] = [];

	public scan(module: TClassConstruct): void {
		this._module = this.dive(module);
	}

	public findCommandConstruct(token: string): TClassConstruct {
		const command = this._commands.find(c => c.token === token);

		return command.construct;
	}

	public findProvider(
		construct: TClassConstruct<any>
	): Provider | ProviderFactory {
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
	 * хранимый в экземепляре сканера, иначе воспринимает указанный модуль как корневой
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

	private dive(target: TClassConstruct | TDynamicModule): Module {
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
		const providers = options.providers.map(p =>
			"construct" in p
				? new ProviderFactory(
						p.construct,
						options.exports.some(e => e === p.construct),
						p.useFactory
				  )
				: new Provider(
						p,
						options.exports.some(e => e === p)
				  )
		);
		const commands = options.commands.map(c => new Command(c));
		this._commands = this._commands.concat(commands);

		const module = new Module(construct, imports, commands, providers);
		if (module.global) {
			this._global.push(module);
		}

		return module;
	}
}
