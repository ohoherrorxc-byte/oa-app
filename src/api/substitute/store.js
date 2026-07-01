import request from '@/router/axios';

// 倉庫生成规则保存
export const saveOrUpdate = (data) => {
  return request({
    url: '/api/oa-portal/store/saveOrUpdate',
    method: 'post',
    data
  })
}
// 倉庫詳情
export const detail = (params) => {
  return request({
    url: '/api/oa-portal/store/detail',
    method: 'get',
    params
  })
}
