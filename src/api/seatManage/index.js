import request from '@/router/axios';

export default class seatManageApi {
  static getList(params) {
    return request({
      url: '/api/oa-portal/workSeat/getListByFloor',
      method: 'get',
      params: {
        ...params,
      }
    })
  }
  static save(data) {
    return request({
      url: '/api/oa-portal/workSeat/save',
      method: 'post',
      data
    })
  }
 static downFile(){
  return request({
    url:'/api/oa-portal/workSeat/export',
    method: 'get',
    responseType: 'blob'
  })
 }
 static deleteById(ids){
  return request({
    url:`/api/oa-portal/workSeat/deleteById?ids=${ids}`,
    method: 'get',
  })
 }
}