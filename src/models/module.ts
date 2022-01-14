import { GLOBAL_METADATA, MODULE_OPTIONS_METADATA } from "../constants";
import { Command } from "./command";
import { Provider } from "./provider";

/**
 * Класс модуля.
 *
 * @export
 * @class Module
 */
export class Module {
	/**
	 * Получает значение, показывающее, что модуль доступен помечен
	 * и доступен в системе.
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Module
	 */
	public get available(): boolean {
		return Reflect.hasMetadata(MODULE_OPTIONS_METADATA, this.construct);
	}

	/**
	 * Получает значение, показывающее, что модуль является определен для глобального области.
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Module
	 */
	public get global(): boolean {
		return Reflect.hasMetadata(GLOBAL_METADATA, this.construct);
	}

	/**
	 * Создает экземпляр класса Module.
	 *
	 * @param {TClassConstruct} construct Конструкт модуля.
	 * @param {Module[]} imports Импортируемые модули.
	 * @param {Command[]} commands Команды модуля.
	 * @param {Provider[]} providers Поставщики модуля.
	 * @memberof Module
	 */
	constructor(
		public readonly construct: TClassConstruct,
		public readonly imports: Module[],
		public readonly commands: Command[],
		public readonly providers: Provider[]
	) {}

	/**
	 * Выполняет проверку принадлежности искомого конструкта к модулю.
	 *
	 * @param {TClassConstruct} construct Конструкт.
	 * @returns {boolean} Значение, показывающее, что конструкт принадлежит данному модулю.
	 * @memberof Module
	 */
	public has(construct: TClassConstruct): boolean {
		return [
			...this.commands.map(c => c.construct),
			...this.providers.map(p => p.construct),
		].includes(construct);
	}
}
