import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { verifyJwtToken } from "../utils";

export default class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.jwt;
    const user = await verifyJwtToken(token);
    if (user) {
      request.user = user;
      request.token = token;
      return true;
    } else throw new UnauthorizedException();
  }
}
