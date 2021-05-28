import { User } from './user.entity';

export const USER_MODEL = 'USER_MODEL';

export const userProviders = [
    {
        provide: USER_MODEL,
        useValue: User,
    },
];
