import { List } from 'src/common/interface/list.interface';
import { Notice } from './notice.entity';

export interface Notices extends List {
    rows: Notice[];
}
