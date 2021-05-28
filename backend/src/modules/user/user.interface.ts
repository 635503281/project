// 用户静态信息
export interface IStatistics {
    user_id: number;
    topic_approval_total: number;
    comment_topic_total: number;
    topic_total: number;
}

// 获取post_id数组的类型
export type TPostIdsType = 'Publish' | 'Answer' | 'Approve';

export interface Ids {
    rows: Array<number>;
}
