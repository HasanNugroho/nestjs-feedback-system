import { Body, Controller, Get, HttpStatus, Inject, NotFoundException, Param, ParseUUIDPipe, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FEEDBACK_SERVICE } from 'src/common/constant';
import { IFeedbackService } from './interfaces/feedback-service.interface';
import { CreateFeedbackDto } from './dtos/create-feedback.dto';
import { ApiResponse } from 'src/common/dtos/response.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Feedback } from './models/feedback.model';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/user/models/user.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UserRoles } from 'src/common/enums/role.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { PageMetaDto } from 'src/common/dtos/page-meta.dto';
import { FilterOptionDto } from './dtos/filter-option.dto';
import { UpdateStatusFeedbackDto } from './dtos/update-feedback.dto';

@ApiBearerAuth()
@Controller('api/feedback')
export class FeedbackController {
    constructor(
        @Inject(FEEDBACK_SERVICE)
        private readonly feedbackService: IFeedbackService
    ) { }

    @ApiOperation({ summary: 'Endpoint for create feedback' })
    @ApiCreatedResponse({
        description: 'Response success create feedback',
        type: Feedback,
    })
    @ApiBadRequestResponse({
        description: 'Bad request'
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: CreateFeedbackDto })
    @UseInterceptors(FilesInterceptor('files'))
    @Post()
    async create(
        @CurrentUser() user: User,
        @Body() payload: CreateFeedbackDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        try {
            const result = await this.feedbackService.create(user.id, payload, files);
            return new ApiResponse(HttpStatus.CREATED, true, 'create feedback successfully', result);
        } catch (error) {
            console.log(error.stack)
            throw error;
        }
    }

    @ApiOperation({ summary: 'Get paginated feedbacks (admin only)' })
    @ApiOkResponse({
        type: Feedback,
        isArray: true,
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters',
    })
    @Roles([UserRoles.ADMIN])
    @Get()
    async findAll(@Query() filter: FilterOptionDto) {
        try {
            const { feedback, totalCount } = await this.feedbackService.findAll(filter);
            return new ApiResponse(HttpStatus.OK, true, "Fetch feedback(s) successfully", feedback, new PageMetaDto(filter, totalCount));
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    @ApiOperation({ summary: 'Get feedback by id' })
    @ApiOkResponse({
        type: Feedback,
        isArray: false,
    })
    @ApiBadRequestResponse({
        description: 'Invalid query parameters',
    })
    @Get(':id')
    async findById(@Param('id', new ParseUUIDPipe()) id: string) {
        try {
            const feedback = await this.feedbackService.findById(id);
            if (!feedback) {
                throw new NotFoundException('feedback not found')
            }

            return new ApiResponse(HttpStatus.OK, true, "Fetch feedback(s) successfully", feedback);
        } catch (error) {
            console.error(error.stack);
            throw error;
        }
    }

    @ApiOperation({ summary: 'Update feedback status by ID' })
    @ApiBody({ type: UpdateStatusFeedbackDto })
    @ApiNotFoundResponse({
        description: "Not found",
    })
    @ApiBadRequestResponse({
        description: "Bad request",
    })
    @Put(':id')
    async update(@Param('id', new ParseUUIDPipe()) id: string, @Body() payload: UpdateStatusFeedbackDto) {
        const result = await this.feedbackService.updateStatus(id, payload);
        return new ApiResponse(HttpStatus.CREATED, true, "update feedback successfully", result)
    }
}
