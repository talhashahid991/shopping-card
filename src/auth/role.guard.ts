import { SetMetadata } from '@nestjs/common';

export enum Role {
    ShopKeep = 'shopkeep',
    Customer = 'customer',
  }
  
//creating decorator for role
  export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);