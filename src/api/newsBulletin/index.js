import request from '@/router/axios';

export default class newsApi {

  //新闻列表
  static List({
    current,
    size,
    ...data
  }) {
    return request({
      url: `/api/oa-portal/companyNews/companyNewsPage?current=${current}&size=${size}`,
      method: 'post',
      data
    })
  }

  //新闻编辑
  static Save(data) {
    return request({
      url: '/api/oa-portal/companyNews/saveCompanyNews',
      method: 'post',
      data
    })
  }

  //新闻删除
  static Delete(params) {
    return request({
      url: '/api/oa-portal/companyNews/deleteCompanyNews',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  //新闻详情
  static Info(params) {
    return request({
      url: '/api/oa-portal/companyNews/companyNewsDetail',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static getUserDetail(params) {
    return request({
      url: '/api/oa-user/v2.0/detail',
      method: 'get',
      params: {
        ...params,
      }
    })
  }



}
