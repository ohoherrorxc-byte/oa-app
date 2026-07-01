import request from '@/router/axios';

export default class FloorLockApi {
  //群发消息列表
  static getList(data) {
    return request({
      url: '/api/oa-portal/groupLock/listGroupLock',
      method: 'post',
      data
    })
  }
  //详情
  static detailGroundLock(id) {
    return request({
      url: `/api/oa-portal/groupLock/detailGroundLock?id=${id}`,
      method: 'get',   
    })
  }
  //删除
  static deleteGroundLock(id) {
    return request({
      url: `/api/oa-portal/groupLock/deleteGroundLock?id=${id}`,
      method: 'get',   
    })
  }
  
  //保存
  static saveGroundLock(data){
    return request({
        url: `/api/oa-portal/groupLock/saveGroundLock`,
        method: 'post',   
        data
      })
  }
 
}