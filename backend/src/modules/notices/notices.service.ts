import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Notice } from './notice.entity';
import { Notices } from './notices.interface';
import { NOTICE_MODEL } from './notices.providers';
import { Search } from './dto/search.dto';
import { CreateNoticeDto } from './dto/create-notice.dto';
@Injectable()
export class NoticesService {
    constructor(@Inject(NOTICE_MODEL) private readonly noticeModel: typeof Notice) {}

    // 查找notice列表
    async findAll(search: Search): Promise<Notices> {
        const { page, limit } = search;
        const newSearch: any = {
            limit,
            offset: Math.max(page - 1, 0) * limit,
        };
        return this.noticeModel.findAndCountAll(newSearch);
    }

    // 创建
    async create(createNoticeDto: CreateNoticeDto): Promise<Notice> {
        return this.noticeModel.create(createNoticeDto);
    }

    // 查找单个
    async findOne(id: number): Promise<Notice> {
        const find: any = await this.noticeModel.findByPk(id);
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 删除
    async remove(id: number): Promise<void> {
        (await this.findOne(id)).destroy();
    }
}
