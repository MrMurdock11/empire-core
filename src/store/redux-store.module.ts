import { Module } from "..";
import { ReduxStore } from "./redux-store";

@Module({
	providers: [ReduxStore],
	exports: [ReduxStore],
})
export class ReduxStoreModule {}
