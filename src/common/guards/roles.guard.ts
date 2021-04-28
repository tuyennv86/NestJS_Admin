
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    // const requset = context.switchToHttp().getRequest();

    // const data = context.switchToRpc().getData();
    // console.log(data);
    // console.log('--------------------------------------');

    // console.log(context.getHandler());
    const request = context.switchToHttp().getRequest<Request | any>();
    console.log(request.user);

    return true;
  }
}
