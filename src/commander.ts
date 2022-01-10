import { isString } from "lodash";
import { Injector } from "./injector";
import { ICommand } from "./interfaces/command.interface";
import { IScanner } from "./scanner";

export type TUseCommanderHook = () => { commander: Commander };
export class Commander {
	constructor(
		private readonly _injector: Injector,
		private readonly _scanner: IScanner
	) {}

	public execute(token: string, ...args: any[]): void;
	public execute<TCommand extends ICommand>(
		target: TClassConstruct,
		...args: Parameters<TCommand["execute"]>
	): void;
	public execute(targetOrToken: string | TClassConstruct, ...args: any[]) {
		let target: TClassConstruct = isString(targetOrToken)
			? this._scanner.findCommandConstruct(targetOrToken)
			: targetOrToken;

		const hasCommandInstance = this._injector.has(target);
		const command = hasCommandInstance
			? this._injector.get(target)
			: this._injector.resolve(target);

		if (command === undefined) {
			throw new TypeError("Команда не была определена.");
		}

		command.execute(...args);
	}
}
