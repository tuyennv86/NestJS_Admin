import { Task } from "../entities/task.entity";
import { Repository, EntityRepository } from "typeorm";
import { CreateTaskDto } from "../dto/create-task.dto";
import { TaskStatus } from "../enum/task-status.enum";
import { GetTaskFilterDto } from "../dto/get-task-filter.dto";
import { User } from "../../auth/entities/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task>{

    private logger = new Logger('TaskRepository');

    async getAllTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId =:userId', { userId: user.id });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }
        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Loi tim theo user : ${user.username}, Tieu chi tim : ${JSON.stringify(filterDto)}`, error.stack);
            throw new InternalServerErrorException();
        }

    }

    async createTask(createTaskTdo: CreateTaskDto, user: User): Promise<Task> {
        const { title, description } = createTaskTdo;
        const task = new Task();
        task.title = title;
        task.description = description;
        task.status = TaskStatus.OPEN;
        task.user = user;
        await task.save();
        //delete task.user;
        return task;
    }

}