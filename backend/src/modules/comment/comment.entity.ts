import { Table, Model, Column, DataType, BelongsTo, BelongsToMany, ForeignKey } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Post } from '../posts/post.entity';

@Table({ tableName: 'comment' })
export class Comment extends Model {
    @Column({
        type: DataType.TEXT,
        defaultValue: '',
    })
    content: string; // 评论内容

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    approve_count: number; // 赞同数

    // @Column({
    //     type: DataType.BOOLEAN,
    //     defaultValue: false,
    // })
    // is_approved: Boolean; // 是否赞同

    @BelongsToMany(() => User, {
        through: 'comment-user',
        foreignKey: 'comment_id',
        otherKey: 'user_id',
    })
    approvars: User[]; //赞同的user

    //创建者用user_id关联
    @BelongsTo(() => User, {
        // as: 'creator', // 设置别名， 关联查询时，使用别名{include: 'creator'},返回的也是别名字段
        foreignKey: 'user_id', //Comment表的外键
        targetKey: 'user_id', //User中要关联的键(默认user中的主键)
        onDelete: 'CASCADE', //删除时将数据也删除
    })
    creator: User;

    //关联Post
    @BelongsTo(() => Post, {
        foreignKey: 'topic_id', //Comment表的外键
        targetKey: 'id', //Posts中要关联的键(默认Posts中的主键)
        onDelete: 'CASCADE', //删除时将数据也删除
    })
    post: Post;

    //关联自身
    @BelongsTo(() => Comment, {
        foreignKey: 'parent_id', //Comment表的外键 顶层的comment_id
        onDelete: 'CASCADE', //删除时将数据也删除
    })
    parent: Comment;

    //关联回复者
    @BelongsTo(() => User, {
        foreignKey: 'replied_user_id', //Comment表的外键
        targetKey: 'user_id', //User中要关联的键(默认user中的主键)
    })
    repliyer: User;

    //关联回复的comment
    @BelongsTo(() => Comment, {
        foreignKey: 'replied_comment_id', //Comment表的外键 父级的commnet_id
    })
    repliedComment: Comment;
}
