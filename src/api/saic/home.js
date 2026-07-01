import request from '@/router/axios';

export const getList = (params) => {
  return request({
    url: '/api/oa-portal/license/home/list',
    method: 'post',
    params: {
      ...params,
    }
  })
}


