import { Module } from "../../../src/decorators/module.decorator";
import { ProjectsService } from "./projects.service";

@Module({
	providers: [ProjectsService],
})
export class ProjectsModule {}
