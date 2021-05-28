import { Module, forwardRef } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { postsProviders } from './posts.providers';
import { ESModule } from 'src/common/elasticsearch/es.module';
import { UserModule } from '../user/user.module';

@Module({
    imports: [ESModule, forwardRef(() => UserModule)],
    controllers: [PostsController],
    providers: [PostsService, ...postsProviders],
    exports: [PostsService],
})
export class PostsModule {}
