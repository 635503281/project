import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { commentProviders } from './comment.providers';
import { PostsModule } from '../posts/posts.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [forwardRef(() => PostsModule), forwardRef(() => UserModule)],
    providers: [CommentService, ...commentProviders],
    controllers: [CommentController],
    exports: [CommentService],
})
export class CommentModule {}
