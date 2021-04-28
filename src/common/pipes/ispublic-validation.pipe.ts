import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { IsPublic } from '../enum/Identifier.enum';

@Injectable()
export class IspublicValidationPipe implements PipeTransform {

  readonly allowedPublic = [
    IsPublic.Approved,
    IsPublic.NotApproved
  ];

  transform(value: any) {
    if (!this.isPublicValid(value)) {
      throw new BadRequestException(`"${value}" không là 1 trạng thái`);
    }
    return value;
  }

  private isPublicValid(value: any) {
    const xid = this.allowedPublic.indexOf(value);
    return xid !== -1;
  }
}
