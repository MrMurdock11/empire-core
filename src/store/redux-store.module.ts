import { Store } from "redux";
import { Global } from "../decorators/global.decorator";
import { Module } from "../decorators/module.decorator";
import { TDynamicModule } from "../types/dynamic-module.type";
import { TProviderFactory } from "../types/provider-factory.type";
import { ReduxStoreProvider } from "./redux-store.provider";

type TReduxStoreModuleOptions = {
	store: Store;
};

@Global
@Module({})
export class ReduxStoreModule {
	public static forRoot(options?: TReduxStoreModuleOptions): TDynamicModule {
		const reduxStoreProvider: TProviderFactory = {
			construct: ReduxStoreProvider,
			useFactory: () => new ReduxStoreProvider(options.store),
		};

		return {
			construct: ReduxStoreModule,
			providers: [reduxStoreProvider],
			exports: [ReduxStoreProvider],
		};
	}
}
