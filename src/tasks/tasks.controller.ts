import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger, Put } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enum/task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../auth/entities/user.entity';
import { GetUser } from '../auth/jwt/get-user.decorater';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";

@ApiTags("Tasks")
@Controller('tasks')
@ApiBearerAuth()
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private taskService: TasksService) { }

    @Get() // Lay theo UserId đăng nhập - phân quyền theo userId đăng nhập
    async getTask(@Query(ValidationPipe) filterDto: GetTaskFilterDto, @GetUser() user: User): Promise<Task[]> {
        this.logger.verbose(`Lay danh theo user : ${user.username} . Tieu chi tim :${JSON.stringify(filterDto)}`);
        return await this.taskService.getAllTasks(filterDto, user);
    }


    @Get('/:id')// lay theo id
    async getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<Task> {
        return await this.taskService.gettaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return await this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    async deleteTask(@Param('id', ParseIntPipe) id: number, @GetUser() user: User): Promise<void> {
        return await this.taskService.deleteById(id, user);
    }

    @Put('/:id')
    async updateTask(@Param('id', ParseIntPipe) id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @Body() createTaskDto: CreateTaskDto, @GetUser() user: User): Promise<Task> {
        return await this.taskService.updateTask(id, status, createTaskDto, user);
    }

    @Patch('/:id/status')
    async updateTaskStatus(@Param('id') id: number, @Body('status', TaskStatusValidationPipe) status: TaskStatus, @GetUser() user: User): Promise<Task> {
        return await this.taskService.updateTaskStatus(id, status, user);
    }

}