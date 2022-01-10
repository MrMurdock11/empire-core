import "reflect-metadata";
import { Injectable } from "../decorators/injectable.decorator";
import { Command } from "../decorators/command.decorator";
import { Module } from "../decorators/module.decorator";
import { Factory, useCommander } from "../factory";
import { ICommand } from "../interfaces/command.interface";
import { createStore } from "redux";
import { AppState, rootReducer } from "./store/index";
import { ReduxStoreProvider } from "../store/redux-store.provider";
import { ReduxStoreModule } from "../store/redux-store.module";
import { setStatus } from "./store/App/App.actions";

// #region permissions module

@Injectable
class PermissionsService {
	hello = () => console.log("hello");
}

@Module({
	providers: [PermissionsService],
	exports: [PermissionsService],
})
class PermissionsModule {}

// #endregion

// #region users module

@Injectable
class UsersService {
	constructor(
		private readonly _permissions: PermissionsService,
		private readonly _store: ReduxStoreProvider<AppState>
	) {}

	run = () => {
		console.log(this._store.state.app.status);
		this._store.dispatch(setStatus("loading"));
		console.log(this._store.state.app.status);
		this._store.dispatch(setStatus("failed"));
		console.log(this._store.state.app.status);
	};
}

@Injectable
class AddUserUseCase {
	constructor(private readonly _service: UsersService) {}

	run = () => this._service.run();
}

@Command()
class AddUserCommand implements ICommand {
	constructor(private readonly _useCase: AddUserUseCase) {}

	execute(): void {
		this._useCase.run();
	}
}

@Module({
	imports: [PermissionsModule],
	commands: [AddUserCommand],
	providers: [AddUserUseCase, UsersService],
})
class UsersModule {}

// #endregion

// #region graph module

@Command()
class AddNodeCommand implements ICommand {
	execute(request?: any): void {
		throw new Error("Method not implemented.");
	}
}

@Injectable
class AddNodeUseCase {}

@Injectable
class GraphsService {}

@Module({
	commands: [AddNodeCommand],
	providers: [GraphsService, AddNodeUseCase],
})
class GraphsModule {}

// #endregion

const store = createStore(rootReducer);

@Module({
	imports: [UsersModule, GraphsModule, ReduxStoreModule.forRoot({ store })],
})
class AppModule {}

Factory.create(AppModule, store);

const { commander } = useCommander();
commander.execute<AddUserCommand>(AddUserCommand);
