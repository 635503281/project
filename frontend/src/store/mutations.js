import {LOGIN_URL} from '@/const/index';

const jumpLoginMutation = {
  JUMP_LOGIN () {
    // console.error('未登录');
    location.href = `${LOGIN_URL}${self.location.href}`;
  }
}

export default {
  ...jumpLoginMutation
}
