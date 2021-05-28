import { Controller, Get, Post, Body, Delete, Param, ParseIntPipe, Query, Session } from '@nestjs/common';
import { NoticesService } from './notices.service';
import { Search } from './dto/search.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';

@Controller('notices')
export class NoticesController {
    constructor(private readonly noticesService: NoticesService) {}

    @Get()
    findAll(@Query() search: Search) {
        return this.noticesService.findAll(search);
    }

    @Post()
    create(@Body() createNoticeDto: CreateNoticeDto, @Session() session) {
        const userID: number = session.get('userID');
        return this.noticesService.create({ ...createNoticeDto, user_id: userID });
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return this.noticesService.remove(id);
    }
}
