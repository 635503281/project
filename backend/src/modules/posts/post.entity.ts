import { Table, Model, Column, DataType, HasMany, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Table({ tableName: 'posts' })
export class Post extends Model {
    @Column({
        type: DataType.TEXT,
        unique: true,
        allowNull: false,
    })
    title: string; // 标题

    @Column({
        type: DataType.TEXT,
        defaultValue: '',
    })
    content: string; // 内容

    @Column({
        type: DataType.STRING,
        defaultValue: '',
    })
    tag: string; // 标签

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    approval_count: number; // 赞同数

    // @Column({
    //     type: DataType.BOOLEAN,
    //     defaultValue: false,
    // })
    // is_approved: Boolean; // 是否赞同

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    read_count: number; // 浏览数

    @Column({
        type: DataType.INTEGER,
        defaultValue: 0,
    })
    reply_count: number; // 回答数

    //用user_id关联
    @BelongsTo(() => User, {
        foreignKey: 'user_id', //Posts表的外键
        targetKey: 'user_id', //User中要关联的键(默认user中的主键)
        onDelete: 'CASCADE', //删除时将数据也删除
    })
    creator: User;

    @HasMany(() => Comment, 'topic_id')
    comments: Comment[];

    /**
     * otherKey与foreignKey都必须有，两个都要检查外键
     * foreignKey-- 关联表中，自己的外键
     * otherKey -- 关联表中，关联目标表的外键
     * sourceKey -- 自己要关联的键
     * targetKey -- 关联目标表要关联的键
     */
    @BelongsToMany(() => User, {
        through: 'post-user',
        foreignKey: 'post_id',
        otherKey: 'user_id',
        sourceKey: 'id',
        targetKey: 'user_id',
    })
    approvars: User[];
}
