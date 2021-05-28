import { Table, Model, Column, DataType, HasMany, BelongsToMany } from 'sequelize-typescript';
import { Post } from '../posts/post.entity';
import { Comment } from '../comment/comment.entity';
import { Notice } from '../notices/notice.entity';

@Table({ tableName: 'user' })
export class User extends Model {
    @Column({
        primaryKey: true,
        type: DataType.INTEGER,
        unique: true,
        allowNull: false,
    })
    user_id: number; //关联wps的用户id

    @Column({
        type: DataType.STRING,
        defaultValue: '',
    })
    nickname: string; //关联wps用户名称

    @Column({
        type: DataType.STRING,
        defaultValue: '',
    })
    avatar: string; //关联wps用户图像

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    topic_total: number; //共发布问题数

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    comment_topic_total: number; //回答问题数

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    topic_approval_total: number; //获得认同数

    @HasMany(() => Post, 'user_id')
    posts: Post[];

    @HasMany(() => Comment, 'user_id')
    comments: Comment[];

    @HasMany(() => Comment, 'replied_user_id')
    repliedComments: Comment[];

    @HasMany(() => Notice, 'user_id')
    notices: Notice[];

    /**
     * otherKey与foreignKey都必须有，两个都要检查外键
     * foreignKey-- 关联表中，自己的外键
     * otherKey -- 关联表中，关联目标表的外键
     * sourceKey -- 自己要关联的键
     * targetKey -- 关联目标表要关联的键
     */
    @BelongsToMany(() => Post, {
        through: 'post-user',
        foreignKey: 'user_id',
        otherKey: 'post_id',
        sourceKey: 'user_id',
        targetKey: 'id',
    })
    approvedPosts: Post[]; //赞同的post

    @BelongsToMany(() => Comment, {
        through: 'comment-user',
        foreignKey: 'user_id',
        otherKey: 'comment_id',
    })
    approvedComments: Comment[]; //赞同的comment
}
