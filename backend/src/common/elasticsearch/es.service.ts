import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ESService {
    constructor(private readonly elasticsearchService: ElasticsearchService) {}

    // 添加、修改、删除数据
    async bulk(params: any) {
        return await this.elasticsearchService.bulk(params);
    }

    // 查询数据
    async search(params: any) {
        return await this.elasticsearchService.search(params);
    }
}
