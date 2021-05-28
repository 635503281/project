import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { esConfig } from '../../constants/config';
import { ESService } from './es.service';

@Module({
    imports: [
        ElasticsearchModule.registerAsync({
            useFactory: () => ({
                node: esConfig.url,
            }),
        }),
    ],
    providers: [ESService],
    exports: [ESService],
})
export class ESModule {}
