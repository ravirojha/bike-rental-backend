import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { verifyJwtToken } from '../utils'

export default class AdminGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.jwt;
    const user = await verifyJwtToken(token);
    if (user) {
      request.user = user;
      if (user.isManager) {
        console.log(user,'=============')
        return true;
      } else throw new ForbiddenException();
    } else throw new UnauthorizedException();
  }
}
