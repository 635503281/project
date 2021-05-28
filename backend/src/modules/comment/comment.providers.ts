import { Comment } from './comment.entity';

export const COMMENT_MODEL = 'COMMENT_MODEL';

export const commentProviders = [
    {
        provide: COMMENT_MODEL,
        useValue: Comment,
    },
];
