import { IsNumber, Min } from "class-validator";

export class PaginationDto {
    @IsNumber()
    @Min(0)
    page: number;

    @Min(0)
    @IsNumber()
    limit: number;
}