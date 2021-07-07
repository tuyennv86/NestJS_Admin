import { UserRole } from './../enum/user-role.enum';
import { PipeTransform, BadRequestException } from '@nestjs/common';


export class UserRoleValidationPipe implements PipeTransform {

  readonly allowedUserRole = [
    UserRole.Admin, UserRole.General, UserRole.Manager
  ];

  transform(value: any) {
    // value = value.toUpperCase();
    if (!this.isUserRoleValid(value)) {
      throw new BadRequestException(`"${value}" không phải là quyền của user`);
    }
    return value;
  }

  private isUserRoleValid(userRole: any) {
    const xid = this.allowedUserRole.indexOf(userRole);
    return xid !== -1;
  }
}
