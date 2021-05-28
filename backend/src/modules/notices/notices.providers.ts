import { Notice } from './notice.entity';

export const NOTICE_MODEL = 'NOTICE_MODEL';

export const noticeProviders = [
    {
        provide: NOTICE_MODEL,
        useValue: Notice,
    },
];
