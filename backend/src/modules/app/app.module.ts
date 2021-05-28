import { Module } from '@nestjs/common';
import { NoticesModule } from '../notices/notices.module';
import { PostsModule } from '../posts/posts.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from 'src/common/database/database.module';
import { PictureModule } from '../upload/picture/picture.module';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comment/comment.module';

@Module({
    imports: [DatabaseModule, PostsModule, NoticesModule, PictureModule, UserModule, CommentModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
