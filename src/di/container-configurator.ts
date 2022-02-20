import { inject, injectable } from "inversify";
import { IContainer } from "@di/container.interface";
import { DIContainer } from "__inversify-constants__";

@injectable()
export class ContainerConfigurator {
	@inject(DIContainer)
	private readonly _container: IContainer;
}
