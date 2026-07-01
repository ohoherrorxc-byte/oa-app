import request from '@/router/axios';

export default class photoWallApi {
  static getList(params) {
    return request({
      url: '/api/oa-portal/photoWall/albumPageList',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static add(data) {
    return request({
      url: '/api/oa-portal/photoWall/albumSave',
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: '/api/oa-portal/photoWall/albumUpdate',
      method: 'post',
      data
    })
  }

  static detail(params) {
    return request({
      url: '/api/oa-portal/photoWall/albumDetail',
      method: 'get',
      params: {
        ...params,
      }
    })
  }
  static albumDetailByName(params){
    return request({
      url: '/api/oa-portal/photoWall/albumDetailByName',
      method: 'get',
      params: {
        ...params,
      }
    })
  }
  static deleteRow(params){
    return request({
      url: `/api/oa-portal/photoWall/albumDelete?id=${params}`,
      method: 'get'
    })
  }

}


