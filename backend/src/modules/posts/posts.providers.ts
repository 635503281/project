import { Post } from './post.entity';

export const POST_MODEL = 'POST_MODEL';
export const POSTS_MODEL = 'POSTS_MODEL';

export const postsProviders = [
  {
    provide: POSTS_MODEL,
    useValue: Post,
  }
];