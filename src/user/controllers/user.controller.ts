import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse } from '@nestjs/swagger';
import { USER_SERVICE } from 'src/common/constant';
import { IUserService } from '../interfaces/user-service.interface';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UuidParamDto } from 'src/common/dtos/uuid-param.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { ApiResponse } from 'src/common/dtos/response.dto';
import { ResponseUserDto } from '../dtos/response-user.dto';


@Controller('api/users')
export class UserController {
    constructor(
        @Inject(USER_SERVICE)
        private readonly userService: IUserService
    ) { }

    @ApiOperation({ summary: 'Endpoint untuk create user' })
    @ApiCreatedResponse({
        description: "Response success create user",
        type: ResponseUserDto,
        isArray: false,
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @ApiConflictResponse({
        description: "Email or username already exists",
    })
    @Post()
    async create(@Body() payload: CreateUserDto) {
        try {
            const result = await this.userService.create(payload);
            return new ApiResponse(HttpStatus.CREATED, true, "create user successfully", result)
        } catch (error) {
            throw error;
        }
    }

    @ApiOperation({ summary: 'Get user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Get(':id')
    async getById(@Param() id: UuidParamDto) {
        const user = await this.userService.findById(id.id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return new ApiResponse(HttpStatus.CREATED, true, "fetch user(s) successfully", user);
    }

    @ApiOperation({ summary: 'Update user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @Put(':id')
    async update(@Param() id: UuidParamDto, @Body() userData: UpdateUserDto) {
        const result = await this.userService.update(id.id, userData);
        return new ApiResponse(HttpStatus.CREATED, true, "update user successfully", result)
    }

    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Delete(':id')
    async delete(@Param() id: UuidParamDto) {
        const result = await this.userService.delete(id.id);
        return new ApiResponse(HttpStatus.CREATED, true, "delete user successfully", result)
    }
}
