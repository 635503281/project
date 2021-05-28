import { List } from "src/common/interface/list.interface";

export interface Post {
  
}

export interface Posts extends List{
  rows: Post[]
}
