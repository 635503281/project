import Vue from 'vue';
import {
  Dialog,
  Checkbox,
  CheckboxGroup,
  Notification,
  InfiniteScroll,
  Pagination
} from 'element-ui';

const components = [
  Dialog,
  Checkbox,
  CheckboxGroup,
  InfiniteScroll,
  Pagination
]

components.forEach(comp => Vue.use(comp));

Vue.prototype.$notify = Notification;