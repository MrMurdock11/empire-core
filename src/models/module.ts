import { isNull, isUndefined, some } from "lodash";
import { v4 } from "uuid";
import { GLOBAL_METADATA, MODULE_OPTIONS_METADATA } from "../constants";
import { Provider } from "./provider";

/**
 * Класс модуля.
 *
 * @export
 * @class Module
 */
export class Module {
	/**
	 * Идентификатор модуля.
	 *
	 * @private
	 * @type {TUuid}
	 * @memberof Module
	 */
	private readonly id: TUuid = v4();

	/**
	 * Значение, показывающее, что модуль определена для глобального области.
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Module
	 */
	private _global: boolean;

	/**
	 * Получает значение, показывающее, что модуль определена для глобального области.
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Module
	 */
	public get global(): boolean {
		return (this._global ??= Reflect.hasMetadata(
			GLOBAL_METADATA,
			this.construct
		));
	}

	/**
	 * Создает экземпляр класса Module.
	 *
	 * @param {TClassConstruct} construct Конструкт модуля.
	 * @param {Module[]} imports Импортируемые модули.
	 * @param {Provider[]} providers Поставщики модуля.
	 * @memberof Module
	 */
	private constructor(
		public readonly construct: TClassConstruct,
		public readonly imports: Module[],
		public readonly providers: Provider[]
	) {}

	public static create(
		construct: TClassConstruct,
		imports: Module[],
		providers: Provider[]
	): Module {
		if (!Reflect.hasMetadata(MODULE_OPTIONS_METADATA, construct)) {
			throw new TypeError(
				`The "${construct.name}" (sub)module didn't define in the system. Use decorator @Module to define your module.`
			);
		}

		if (isUndefined(imports) || isNull(imports)) {
			throw new TypeError(
				"Imported submodules can't be null or undefined."
			);
		}

		if (isUndefined(providers) || isNull(providers)) {
			throw new TypeError(
				"Providers of the module can't be null or undefined."
			);
		}

		const module = new Module(construct, imports, providers);

		return module;
	}

	/**
	 * Выполняет проверку принадлежности искомого конструкта к модулю.
	 *
	 * @param {TClassConstruct} construct Искомый конструкт.
	 * @returns {boolean} Значение, показывающее, что конструкт принадлежит данному модулю.
	 * @memberof Module
	 */
	public contains(construct: TClassConstruct): boolean {
		return some(this.providers, { construct });
	}
}
