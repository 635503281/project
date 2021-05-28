import { Table, Model, Column, DataType, BelongsTo } from 'sequelize-typescript';
import { User } from '../user/user.entity';

@Table({ tableName: 'notices' })
export class Notice extends Model {
    @Column({
        type: DataType.TEXT,
        unique: true,
        allowNull: false,
    })
    title: string; // 标题

    @Column({
        type: DataType.STRING,
        defaultValue: '',
    })
    url: string; // 内容地址

    //用user_id关联
    @BelongsTo(() => User, {
        foreignKey: 'user_id', //Notices表的外键
        targetKey: 'user_id', //User中要关联的键(默认user中的主键)
        onDelete: 'CASCADE', //删除时将数据也删除
    })
    creator: User;
}
