import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { Request } from 'express'

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    return this.validateRequest(request)
  }
  validateRequest(req: Request) {
    return true
  }
}
