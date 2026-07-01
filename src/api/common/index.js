import request from '@/router/axios';

export const getUserList = ()=> {
    return request({
      url: '/api/oa-portal/conference/userList',
      method: 'get',
    })
  }