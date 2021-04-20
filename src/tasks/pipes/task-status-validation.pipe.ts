import { PipeTransform, BadRequestException } from "@nestjs/common";
import { TaskStatus } from "../enum/task-status.enum";

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatus = [
        TaskStatus.DONE,
        TaskStatus.IN_PROGRESS,
        TaskStatus.OPEN
    ];
    transform(value: any) {
        value = value.toUpperCase();
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" không là 1 trạng thái`);
        }
        return value;
    }

    private isStatusValid(status: any) {
        const xid = this.allowedStatus.indexOf(status);
        return xid !== -1;
    }
}