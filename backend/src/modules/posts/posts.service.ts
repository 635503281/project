import { Injectable, Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './post.entity';
import { Posts } from './posts.interface';
import { POSTS_MODEL } from './posts.providers';
import { Search } from './dto/search.dto';
import { Op } from 'sequelize';
import { ESService } from 'src/common/elasticsearch/es.service';
import { IdsSearch } from '../user/dto/idsSearch.dto';
import { User } from '../user/user.entity';

// 排序
enum Order {
    time = 'created_at',
    read = 'read_count',
    reply = 'reply_count',
}

@Injectable()
export class PostsService {
    constructor(@Inject(POSTS_MODEL) private readonly postsModel: typeof Post, private readonly esService: ESService) {}

    // 创建
    async create(createPostDto: CreatePostDto): Promise<Post> {
        return this.postsModel.create(createPostDto);
    }

    // 更新
    async update(updatePostDto: UpdatePostDto): Promise<Post> {
        return (await this.findOneSelf(updatePostDto.id)).update(updatePostDto);
    }

    // 删除
    async remove(id: number): Promise<void> {
        (await this.findOneSelf(id)).destroy();
    }

    //查找带一个关联
    async findOne(id: number, include: string = 'creator'): Promise<Post> {
        const find: any = await this.postsModel.findByPk(id, {
            include: include, // 带上预先加载的关联查询
        });
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 查找带creator 和 Approvars 关联
    async findOneApproved(id: number, user_id: number): Promise<Post> {
        const find: any = await this.postsModel.findByPk(id, {
            include: [
                'creator',
                {
                    association: 'approvars',
                    through: {
                        where: { user_id },
                        attributes: ['user_id'],
                    },
                },
            ],
        });

        if (!find) {
            throw new NotFoundException();
        }
        find.dataValues.is_approved = Boolean(find.approvars.length);
        delete find.dataValues.approvars;
        return find;
    }

    // 不带关联的查询
    async findOneSelf(id: number): Promise<Post> {
        const find: any = await this.postsModel.findByPk(id);
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 查找post的列表(从elasticsearch中查询)
    async findAll(search: Search): Promise<Posts> {
        const { page, limit, keyword, tag, order, recent } = search;
        let sort: any = {};
        const must: Array<any> = [];
        const should: Array<any> = [];
        // 排序
        if (order && Order[order]) {
            sort = { [Order[order]]: { order: 'desc' } };
        }
        /**
         * 包含匹配使用 wildcard: { tag: `*${tag}*` }
         * 精准匹配使用 term: { tag: tag }
         */
        if (tag) {
            must.push({ wildcard: { tag: `*${tag}*` } });
        }
        // 分词匹配title、content
        if (keyword) {
            should.push({ match: { title: keyword } });
            should.push({ match: { content: keyword } });
            must.push({ bool: { should } });
        }
        // 查询的天数
        if (recent) {
            must.push({
                range: {
                    created_at: {
                        gte: `now-${recent}d/d`, // 当前时间的上一天, 四舍五入到最近的一天
                        lt: `now`,
                    },
                },
            });
        }
        const esRes: any = await this.esService.search({
            index: 'posts',
            body: {
                from: Math.max(page - 1, 0) * limit,
                size: limit,
                sort: [sort],
                query: { bool: { must } },
                // 高亮
                highlight: {
                    require_field_match: false,
                    fields: {
                        title: {
                            // 高亮只匹配自己的，避免匹配tag对其影响
                            highlight_query: {
                                bool: {
                                    must: [{ match: { title: keyword || '' } }],
                                },
                            },
                        },
                        content: {},
                    },
                },
            },
        });

        // 处理统一返回数据格式
        let { hits, total } = esRes.body.hits;
        total = total.value || 0;
        hits = hits.map(h => {
            delete h._source._meta;
            h.highlight && (h._source.highlight = h.highlight);
            return h._source;
        });
        const res: Posts = { count: total, rows: hits };
        return res;

        // const { page, limit, keyword, tag, order } = search;
        // const newSearch: any = {
        //     limit,
        //     offset: Math.max(page - 1, 0) * limit,
        //     where: {},
        // };
        // order && Order[order] && (newSearch.order = [[Order[order], 'DESC']]);
        // tag && (newSearch.where.tag = { [Op.like]: `%${tag}%` });
        // keyword && (newSearch.where.title = { [Op.like]: `%${keyword}%` });
        // return this.postsModel.findAndCountAll(newSearch);
    }

    // 查找user的post ids
    async findUserPostIds(search: IdsSearch) {
        const { page, limit, user_id } = search;
        const newSearch: any = {
            limit,
            offset: Math.max(page - 1, 0) * limit,
            where: { user_id },
            order: [['created_at', 'DESC']],
        };
        const list: Array<any> = await this.postsModel.findAll(newSearch);
        const ids: number[] = list.map(l => l.dataValues.id);
        return { rows: ids };
    }

    // 根据ids 查找post
    async findUserPosts(ids: number[]) {
        return this.postsModel.findAndCountAll({
            where: { id: { [Op.or]: ids } },
            order: [['created_at', 'DESC']],
        });
    }
}
