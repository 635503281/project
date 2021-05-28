import * as server from '../../../services/index';

const requestFns = {
  uploadImg: async (_, params) => await server.uploadImg(params)
}

const actions = {
  ...requestFns
}

export default actions;