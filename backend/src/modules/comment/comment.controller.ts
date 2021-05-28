import { Controller, ParseIntPipe, Get, Post, Put, Delete, Query, Body, Param, Session, Inject, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { Search } from './dto/search.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PostsService } from '../posts/posts.service';
import { UserService } from '../user/user.service';
import { updateModelCount } from 'src/common/common';

@Controller('comment')
export class CommentController {
    constructor(
        private readonly commentService: CommentService,
        @Inject(forwardRef(() => PostsService)) private readonly postService: PostsService,
        @Inject(forwardRef(() => UserService)) private readonly userService: UserService,
    ) {}

    // 查询列表 带上 creator关联 和 当前user是否赞同字段
    @Get('/list')
    async findAll(@Query() search: Search, @Session() session) {
        // user_id是为了查询改comment是否被当前user赞同
        const userID: number = session.get('userID');
        return this.commentService.findAll({ user_id: userID, ...search });
    }

    // 获取单个带上creator关联
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return this.commentService.findOne(id);
    }

    // 创建
    @Post()
    async create(@Body() createCommentDto: CreateCommentDto, @Session() session) {
        const userID: number = session.get('userID');
        const create: any = await this.commentService.create({ ...createCommentDto, user_id: userID });

        //顶层comment更新post评论数
        if (!create.dataValues.parent_id) {
            const postId: number = create.dataValues.topic_id;
            const findModel: any = await this.postService.findOneSelf(postId);
            await updateModelCount('add', 'reply_count', findModel);

            //更新comment属于的user回答数(同一个post多次回答只算一次)
            const list: Array<any> = await this.commentService.find({
                topic_id: create.dataValues.topic_id,
                parent_id: null,
                user_id: userID,
            });
            if (list.length === 1) {
                const userModel: any = await this.userService.findOne(userID);
                await updateModelCount('add', 'comment_topic_total', userModel);
            }
        }

        return create;
    }

    // 更新
    @Put(':id')
    async update(@Body() updateCommentDto: UpdateCommentDto) {
        return this.commentService.update(updateCommentDto);
    }

    // 删除
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const commentModel: any = await this.commentService.findOneSelf(id);
        const comment: any = commentModel.dataValues;
        await commentModel.destroy();

        //顶层comment更新post评论数
        if (!comment.parent_id) {
            const postId: number = comment.topic_id;
            const findModel: any = await this.postService.findOneSelf(postId);
            await updateModelCount('reduce', 'reply_count', findModel);

            //更新comment属于的user回答数, 多次回复全部删除才减一
            if (comment.user_id) {
                const list: Array<any> = await this.commentService.find({ topic_id: postId, parent_id: null, user_id: comment.user_id });
                if (!list.length) {
                    const userModel: any = await this.userService.findOne(comment.user_id);
                    await updateModelCount('reduce', 'comment_topic_total', userModel);
                }
            }
        }
    }

    /**
     * 赞同
     * @param id
     */
    @Post(':id/approve')
    async approve(@Param('id', ParseIntPipe) id: number, @Session() session) {
        const userID: number = session.get('userID');
        const findModel: any = await this.commentService.findOneSelf(id);
        const comment_user_id: number = findModel.dataValues.user_id;

        const userModel: any = await this.userService.findOne(userID);
        //更新comment的赞同数 和 赞同人
        await findModel.addApprovar(userModel);
        const res = await updateModelCount('add', 'approve_count', findModel);

        //comment属于的user的赞同数也要更新
        await updateModelCount('add', 'topic_approval_total', await this.userService.findOne(comment_user_id));

        return res;
    }

    /**
     * 取消赞同
     * @param id
     */
    @Delete(':id/approve')
    async cancelApprove(@Param('id', ParseIntPipe) id: number, @Session() session) {
        const userID: number = session.get('userID');
        const findModel: any = await this.commentService.findOneSelf(id);
        const comment_user_id: number = findModel.dataValues.user_id;

        const userModel: any = await this.userService.findOne(userID);
        //更新comment的赞同数 和 赞同人
        await findModel.removeApprovar(userModel);
        const res = await updateModelCount('reduce', 'approve_count', findModel);

        //comment属于的user的赞同数也要更新
        await updateModelCount('reduce', 'topic_approval_total', await this.userService.findOne(comment_user_id));

        return res;
    }
}
