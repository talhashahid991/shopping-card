import { Injectable, CanActivate, ExecutionContext, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {} //no reflector in constructor

  canActivate(context: ExecutionContext): boolean { //return type not mentioned
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;  //|| { userType: 'shopkeep' }; // Default user for testing;
    if (!user) {
      throw new NotFoundException('authorised user not found'); // or handle the error as needed
    }
    return roles.includes(user.userType); //returning true if their conditions met
  }
}
