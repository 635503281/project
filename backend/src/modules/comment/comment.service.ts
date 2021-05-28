import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Comment } from './comment.entity';
import { COMMENT_MODEL } from './comment.providers';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comments } from './comment.interface';
import { Search } from './dto/search.dto';
import { Op } from 'sequelize';
import { IdsSearch } from '../user/dto/idsSearch.dto';
import { IObject } from 'src/common/interface/interface';

@Injectable()
export class CommentService {
    constructor(@Inject(COMMENT_MODEL) private readonly commentModel: typeof Comment) {}

    // 创建
    async create(createCommentDto: CreateCommentDto): Promise<Comment> {
        return this.commentModel.create(createCommentDto);
    }

    // 更新
    async update(updateCommentDto: UpdateCommentDto): Promise<Comment> {
        return (await this.findOneSelf(updateCommentDto.id)).update(updateCommentDto);
    }

    // 删除
    async remove(id: number): Promise<void> {
        (await this.findOneSelf(id)).destroy();
    }

    // 带一个关联查询单个
    async findOne(id: number, include: string = 'creator'): Promise<Comment> {
        const find: any = await this.commentModel.findByPk(id, {
            include: include, // 带上预先加载的关联查询
        });
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 不带关联查询单个
    async findOneSelf(id: number): Promise<Comment> {
        const find: any = await this.commentModel.findByPk(id);
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 查询comment列表 带上 creator关联 和 当前user是否赞同字段
    async findAll(search: Search): Promise<Comments> {
        const { page, limit, order, parent_id, id, user_id } = search;
        const newSearch: any = {
            limit,
            offset: Math.max(page - 1, 0) * limit,
            where: { topic_id: id, replied_comment_id: parent_id || null },
            include: [
                'creator',
                {
                    association: 'approvars',
                    as: 'is_approved',
                    through: {
                        where: { user_id },
                        attributes: ['user_id'],
                    },
                },
            ],
        };
        //排序
        if (order) {
            let newOrder: string = 'DESC';
            if (order.toLocaleUpperCase() === 'ASC') {
                newOrder = 'ASC';
            }
            newSearch.order = [['created_at', newOrder]];
        }

        let res = await this.commentModel.findAndCountAll(newSearch);
        //处理当前用户是否赞同
        res.rows = res.rows.map((f: any) => {
            f.dataValues.is_approved = Boolean(f.approvars.length);
            delete f.dataValues.approvars;
            return f;
        });

        return res;
    }

    // 带条件查询多个
    async find(search: IObject): Promise<Array<Comment>> {
        return this.commentModel.findAll({
            where: search,
        });
    }

    // 查找user的post ids
    async findUserPostIds(search: IdsSearch) {
        const { page, limit, user_id } = search;
        const newSearch: any = {
            limit,
            offset: Math.max(page - 1, 0) * limit,
            where: { user_id, parent_id: null },
            order: [['created_at', 'DESC']],
        };
        const list: Array<any> = await this.commentModel.findAll(newSearch);
        let ids: number[] = list.map(l => l.dataValues.topic_id);
        ids = Array.from(new Set(ids)).filter(id => id);
        return { rows: ids };
    }
}
