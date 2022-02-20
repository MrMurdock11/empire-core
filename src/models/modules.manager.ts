import { Module } from "@models/module";

export class ModulesManager {
	private _modules = new Map<TClassConstruct, Module>();
}
