import { v4 } from "uuid";
import { INJECTABLE_METADATA } from "../constants";

/**
 * Класс поставщика.
 *
 * @export
 * @class Provider
 */
export class Provider {
	/**
	 * Идентификатор поставщика.
	 *
	 * @private
	 * @type {TUuid}
	 * @memberof Provider
	 */
	private readonly id: TUuid = v4();

	/**
	 * * experimental => DynamicModule
	 *
	 * Получает значение, показывающее, что экземпляр поставщика определяется
	 * фабричным методом.
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Provider
	 */
	// private get isFactory(): boolean {
	// 	return this.useFactory !== undefined;
	// }

	/**
	 * Значение, показывающее, что поставщик не доступен для внедрения как зависимость.
	 *
	 * @private
	 * @type {boolean}
	 * @memberof Provider
	 */
	private _available?: boolean;

	/**
	 * Получает значение, показывающее, что поставщик не доступен для внедрения как зависимость.
	 *
	 * @readonly
	 * @type {boolean}
	 * @memberof Provider
	 */
	public get available(): boolean {
		return (this._available ??= Reflect.hasMetadata(
			INJECTABLE_METADATA,
			this.construct
		));
	}

	/**
	 * Создает экземпляр класса Provider.
	 *
	 * @param {TClassConstruct} construct Конструкт поставщика.
	 * @param {boolean} exportable Значение, показывающее, что поставщик может быть экспортирован в принимающий модуль.
	 * @memberof Provider
	 */
	constructor(
		public readonly construct: TClassConstruct,
		public readonly exportable: boolean
	) {}

	/**
	 * * experimental => DynamicModule
	 *
	 * Создает экземпляр класса Provider.
	 *
	 * @param {TClassConstruct} construct Конструкт поставщика.
	 * @param {boolean} exportable Значение, показывающее, что поставщик может быть экспортирован в принимающий модуль.
	 * @param {() => any} [useFactory] Фабричный метод для создания экземпляра поставщика.
	 * @memberof Provider
	 */
	// constructor(
	// 	public readonly construct: TClassConstruct,
	// 	public readonly exportable: boolean,
	// 	public readonly useFactory?: () => any
	// ) {}
}
