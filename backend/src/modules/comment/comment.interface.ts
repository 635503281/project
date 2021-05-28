import { List } from 'src/common/interface/list.interface';
import { Comment } from './comment.entity';

export interface Comments extends List {
    rows: Comment[];
}
