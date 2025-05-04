import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiCreatedResponse, ApiBadRequestResponse, ApiNotFoundResponse, ApiConflictResponse, ApiOkResponse } from '@nestjs/swagger';
import { Inject } from '@nestjs/common';
import { USER_SERVICE } from 'src/common/constant';
import { IUserService } from './interfaces/user-service.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { ApiResponse } from 'src/common/dtos/response.dto';
import { ResponseUserDto } from './dtos/response-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from './models/user.model';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { PaginationOptionsDto } from 'src/common/dtos/page-option.dto';


@Public()
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
    async findById(@Param('id', new ParseUUIDPipe()) id: string) {
        const user = await this.userService.findById(id);
        if (!user) {
            throw new NotFoundException("User not found");
        }
        return new ApiResponse(HttpStatus.CREATED, true, "fetch user(s) successfully", user);
    }


    @ApiOperation({ summary: 'Get paginated users' })
    @ApiOkResponse({
        type: User,
        isArray: true,
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters',
    })
    @Get()
    async findAll(@Query() filter: PaginationOptionsDto) {
        try {
            const { users, totalCount } = await this.userService.findAll(filter);
            return new ApiResponse(HttpStatus.OK, true, "Fetch user(s) successfully", users, new PageMetaDto(filter, totalCount));
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    @ApiOperation({ summary: 'Update user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @Put(':id')
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() payload: UpdateUserDto) {
        const result = await this.userService.update(id, payload);
        return new ApiResponse(HttpStatus.CREATED, true, "update user successfully", result)
    }


    @ApiOperation({ summary: 'Delete user by ID' })
    @ApiNotFoundResponse({
        description: "User not found",
    })
    @Delete(':id')
    async delete(@Param('id', new ParseUUIDPipe()) id: string) {
        const result = await this.userService.delete(id);
        return new ApiResponse(HttpStatus.CREATED, true, "delete user successfully", result)
    }
}
