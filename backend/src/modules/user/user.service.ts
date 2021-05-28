import { Injectable, HttpService, Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { USER_INFO_URL } from 'src/constants/constant';
import { OkRes, NoRes } from 'src/common/common';
import { IObject } from 'src/common/interface/interface';
import { User } from './user.entity';
import { USER_MODEL } from './user.providers';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IStatistics, TPostIdsType, Ids } from './user.interface';
import { IdsSearch } from './dto/idsSearch.dto';
import { PostsService } from '../posts/posts.service';
import { CommentService } from '../comment/comment.service';
import { IncludeOptions } from 'sequelize';

@Injectable()
export class UserService {
    constructor(
        @Inject(USER_MODEL) private readonly userModel: typeof User,
        private readonly httpService: HttpService,
        @Inject(forwardRef(() => CommentService)) private readonly commentService: CommentService,
        @Inject(forwardRef(() => PostsService)) private readonly postsService: PostsService,
    ) {}

    // 获取用户信息
    async getUserInfo(cookie): Promise<any> {
        try {
            const { data } = await this.httpService.get(USER_INFO_URL, { headers: { cookie } }).toPromise();
            const object: IObject = { avatar: data.avatar, nickname: data.name, user_id: data.id };
            return new OkRes('object', object);
        } catch (e) {
            if (e.response) {
                const { status, data } = e.response;
                // 未登录
                if (status === 403 && data.result == 'userNotLogin') {
                    return new NoRes(data.result);
                }
            }

            throw e;
        }
    }

    // 获取用户的提问信息
    async getStatistics(userId): Promise<IStatistics> {
        const find: any = await this.findOne(userId);
        if (!find) {
            throw new NotFoundException();
        }
        const { user_id, topic_approval_total, comment_topic_total, topic_total } = find.dataValues;
        const statistics: IStatistics = {
            user_id,
            topic_approval_total,
            comment_topic_total,
            topic_total,
        };
        return statistics;
    }

    // 获取用户的各种类型的post_id
    async getPostIds(type: TPostIdsType, search: IdsSearch): Promise<Ids> {
        if (type === 'Publish') {
            return this.postsService.findUserPostIds(search);
        } else if (type === 'Answer') {
            return this.commentService.findUserPostIds(search);
        } else if (type === 'Approve') {
            const { user_id, limit, page } = search;
            let { approvedPosts } = (await this.userModel.findByPk(user_id, {
                include: {
                    association: 'approvedPosts',
                    order: [['created_at', 'DESC']],
                },
            })) as any;
            approvedPosts = approvedPosts.slice((page - 1) * limit, page * limit);
            const ids: Array<number> = approvedPosts.map((a: any) => a.dataValues.id);
            return { rows: ids };
        }
    }

    // 通过user_id查找
    async findUser(user_id: number): Promise<User> {
        const find = await this.userModel.findOne({ where: { user_id } });
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 通过user_id(主键)查找
    async findOne(id: number): Promise<User> {
        const find = await this.userModel.findByPk(id);
        if (!find) {
            throw new NotFoundException();
        }
        return find;
    }

    // 新建
    async create(createUserDto: CreateUserDto): Promise<User> {
        return this.userModel.create(createUserDto);
    }

    // 更新
    async update(updateUserDto: UpdateUserDto): Promise<User> {
        return (await this.findOne(updateUserDto.user_id)).update(updateUserDto);
    }

    // 删除
    async remove(user_id: number): Promise<void> {
        (await this.findOne(user_id)).destroy();
    }
}
