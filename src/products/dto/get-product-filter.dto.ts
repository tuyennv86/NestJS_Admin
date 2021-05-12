import { IsIn, IsNotEmpty, IsOptional } from "class-validator";
import { IsPublic } from "src/common/enum/Identifier.enum";

export class GetProductFilterDto {

    @IsOptional()
    @IsIn([IsPublic.All, IsPublic.Approved, IsPublic.NotApproved])
    isPublished: IsPublic;

    @IsNotEmpty()
    id: number;

}