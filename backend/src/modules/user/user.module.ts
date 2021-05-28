import { Module, HttpModule, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { userProviders } from './user.providers';
import { UserController } from './user.controller';
import { PostsModule } from '../posts/posts.module';
import { CommentModule } from '../comment/comment.module';

@Module({
    imports: [HttpModule, forwardRef(() => CommentModule), forwardRef(() => PostsModule)],
    controllers: [UserController],
    providers: [UserService, ...userProviders],
    exports: [UserService],
})
export class UserModule {}
