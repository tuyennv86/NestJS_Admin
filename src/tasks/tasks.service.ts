import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository) {

    }

    async getAllTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        return this.taskRepository.getAllTasks(filterDto, user);
    }

    async gettaskById(id: number, user: User): Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
        if (!found) {
            throw new NotFoundException(`Không tìm thấy id "${id}" của bạn`);
        }
        return found;
    }

    async createTask(createTaskTdo: CreateTaskDto, user: User): Promise<Task> {
        return await this.taskRepository.createTask(createTaskTdo, user);
    }

    async deleteById(id: number, user: User): Promise<void> {
        const result = await this.taskRepository.delete({ id, userId: user.id });
        if (result.affected === 0) {
            throw new NotFoundException(`Không tìm thấy ${id} của bạn`);
        }
    }

    async updateTask(id: number, status: TaskStatus, createTaskTdo: CreateTaskDto, user: User): Promise<Task> {
        const task = await this.gettaskById(id, user);
        task.title = createTaskTdo.title;
        task.description = createTaskTdo.description;
        task.status = status;
        await task.save();
        return task;
    }

    async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
        const task = await this.gettaskById(id, user);
        task.status = status;
        await task.save()
        return task;
    }


}
