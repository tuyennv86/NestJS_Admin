import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { CategoryType } from '../enum/Identifier.enum';

@Injectable()
export class CategoryTypevalidationPipe implements PipeTransform {
  readonly allowedCategoryType = [
    CategoryType.PRODUCT,
    CategoryType.NEWS
  ];

  transform(value: any) {
    if (!this.TypeValid(value)) {
      throw new BadRequestException(`"${value}" không là 1 trạng thái`);
    }
    return value;
  }

  private TypeValid(value: any) {
    const xid = this.allowedCategoryType.indexOf(value);
    return xid !== -1;
  }

}
