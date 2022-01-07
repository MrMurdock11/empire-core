import { flatten } from "lodash";
import { MODULE_OPTIONS_METADATA } from "./constants";
import { Command } from "./models/command";
import { Module } from "./models/module";
import { Provider } from "./models/provider";

export interface IScanner {
	scan(rootModule: TClassConstruct): void;

	find(token: string): TClassConstruct;

	canInject(injectable: TClassConstruct, parent: TClassConstruct): boolean;
}

export class Scanner implements IScanner {
	private _module: Module;

	private _commands: Command[] = [];

	public scan(module: TClassConstruct): void {
		this._module = this.dive(module);
	}

	public find(token: string): TClassConstruct {
		const command = this._commands.find(c => c.token === token);

		return command.construct;
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
		const childrenModules = module.imports;
		const childrenExportableProviders = flatten(
			childrenModules.map(m => m.providers.filter(p => p.exportable))
		);

		return childrenExportableProviders.some(p => p.construct === target);
	}

	/**
	 * Выполняет поиск родительского модуля для указанного конструкта.
	 *
	 * @remark Если не используется `modules`, то метод берет корневой модуль
	 * хранимый в экземепляре сканера, иначе воспринимает указанный модуль как корневой
	 * и ищет относительно него.
	 *
	 * @param {TClassConstruct} target
	 * @return {Module}
	 * @memberof Scanner
	 */
	private findModule(target: TClassConstruct): Module | undefined {
		let queue = [this._module];

		while (queue.length > 0) {
			const module = queue.shift();

			const isCorrectModule = module.has(target);
			if (isCorrectModule) {
				return module;
			}

			queue = queue.concat(module.imports);
		}

		return void 0;
	}

	private dive(module: TClassConstruct): Module {
		if (!Reflect.hasMetadata(MODULE_OPTIONS_METADATA, module)) {
			throw new TypeError(
				`"${module.constructor.name}" hasn't register into system.`
			);
		}

		const options: TModuleOptions = Reflect.getMetadata(
			MODULE_OPTIONS_METADATA,
			module
		);
		const imports = options.imports.map(i => this.dive(i));
		const providers = options.providers.map(
			p =>
				new Provider(
					p,
					options.exports.some(e => e === p)
				)
		);
		const commands = options.commands.map(c => new Command(c));
		this._commands = this._commands.concat(commands);

		return new Module(module, imports, commands, providers);
	}
}
