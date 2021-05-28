import { Sequelize } from 'sequelize-typescript';
import { Dialect } from 'sequelize/types';
import { databaseConfig } from '../../constants/config';
import { Post } from '../../modules/posts/post.entity';
import { User } from '../../modules/user/user.entity';
import { Comment } from '../../modules/comment/comment.entity';
import { Notice } from '../../modules/notices/notice.entity';

export const databaseProviders = [
    {
        provide: databaseConfig.provide,
        useFactory: async () => {
            const sequelize = new Sequelize(databaseConfig.database, databaseConfig.username, databaseConfig.password, {
                host: databaseConfig.host,
                dialect: databaseConfig.dialect as Dialect,
                port: databaseConfig.port,
                pool: {
                    max: 5,
                    idle: 30,
                },
                define: {
                    charset: 'utf8mb4',
                    collate: 'utf8mb4_general_ci',
                    underscored: true,
                    createdAt: 'created_at',
                    updatedAt: 'updated_at',
                },
            });
            const models = [Post, User, Comment, Notice];

            await sequelize.addModels(models);

            await sequelize.sync({ force: false });

            return sequelize;
        },
    },
];
