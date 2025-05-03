
import { Reflector } from '@nestjs/core';
import { UserRoles } from 'src/common/enums/role.enum';

export const Roles = Reflector.createDecorator<UserRoles[]>();
