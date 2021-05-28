import { Body, Controller, Get, Post, Put, Delete, Param, ParseIntPipe, Query, Session, forwardRef, Inject } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';
import { Search } from './dto/search.dto';
import { UserService } from '../user/user.service';
import { updateModelCount } from 'src/common/common';

@Controller('posts')
export class PostsController {
    constructor(private readonly postsServices: PostsService, @Inject(forwardRef(() => UserService)) private readonly userService: UserService) {}

    // 查询post列表
    @Get()
    async findAll(@Query() search: Search) {
        return this.postsServices.findAll(search);
    }

    // 获取单个post， 带上creator 和 该用户是否赞同字段
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number, @Session() session) {
        const userID: number = session.get('userID');
        const findModel: any = await this.postsServices.findOneApproved(id, userID);
        // 将浏览数 + 1
        return updateModelCount('add', 'read_count', findModel);
    }

    // 创建post
    @Post()
    async create(@Body() createPostsDto: CreatePostDto, @Session() session) {
        const userID: number = session.get('userID');
        const res = await this.postsServices.create({ ...createPostsDto, user_id: userID });

        //post属于的user的发布问题数更新
        const userModel: any = await this.userService.findOne(userID);
        await updateModelCount('add', 'topic_total', userModel);

        return res;
    }

    // 更新post
    @Put(':id')
    async update(@Body() updatePostDto: UpdatePostDto) {
        return this.postsServices.update(updatePostDto);
    }

    // 删除post
    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        const find: any = await this.postsServices.findOneSelf(id);

        //post属于的user的发布问题数更新
        if (find.dataValues.user_id) {
            const userModel: any = await this.userService.findOne(find.dataValues.user_id);
            await updateModelCount('reduce', 'topic_total', userModel);
        }

        find.destroy();
    }

    /**
     * 赞同
     */
    @Post(':id/approval')
    async approve(@Param('id', ParseIntPipe) id: number, @Session() session) {
        const userID: number = session.get('userID');
        const findModel: any = await this.postsServices.findOneSelf(id);
        const post_user_id: number = findModel.dataValues.user_id;

        const userModel: any = await this.userService.findOne(userID);
        //post的赞同数更新 赞同人更新
        await findModel.addApprovar(userModel);
        const res = await updateModelCount('add', 'approval_count', findModel);

        //post属于的user的赞同数也要更新
        await updateModelCount('add', 'topic_approval_total', await this.userService.findOne(post_user_id));

        return res;
    }

    /**
     * 取消赞同
     */
    @Delete(':id/approval')
    async cancelApprove(@Param('id', ParseIntPipe) id: number, @Session() session) {
        const userID: number = session.get('userID');
        const findModel: any = await this.postsServices.findOneSelf(id);
        const post_user_id: number = findModel.dataValues.user_id;

        const userModel: any = await this.userService.findOne(userID);
        //post的赞同数更新 赞同人更新
        await findModel.removeApprovar(userModel);
        const res = await updateModelCount('reduce', 'approval_count', findModel);

        //post属于的user的赞同数也要更新
        await updateModelCount('reduce', 'topic_approval_total', await this.userService.findOne(post_user_id));

        return res;
    }

    /**
     * 根据ids获取post信息
     * @param ids
     */
    @Get('/batch')
    getTopicPosts(@Query('ids') ids: string) {
        const idList: number[] = ids.split(',').map(id => parseInt(id));
        return this.postsServices.findUserPosts(idList);
    }

    /**
     * 关注
     */
    @Post(':id/follow')
    async follow(@Param('id', ParseIntPipe) id: number) {
        const find: any = await this.postsServices.findOneSelf(id);
        // const post: PostEntity = find.dataValues;

        return find;
    }

    /**
     * 取消关注
     */
    @Delete(':id/follow')
    async cancelFollow(@Param('id', ParseIntPipe) id: number) {
        const find: any = await this.postsServices.findOneSelf(id);
        // const post: PostEntity = find.dataValues;
        return find;
    }
}
