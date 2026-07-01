import request from '@/router/axios';

export default class MessageApi {
  //群发消息列表
  static getList(data) {
    return request({
      url: '/api/oa-portal/massMessage/listMassMessage',
      method: 'post',
      data
    })
  }
  //群发消息设置详情
  static detailMassMessage(id) {
    return request({
      url: `/api/oa-portal/massMessage/detailMassMessage?id=${id}`,
      method: 'get',   
    })
  }
  //删除群发消息设置
  static deleteMassMessage(id) {
    return request({
      url: `/api/oa-portal/massMessage/deleteMassMessage?id=${id}`,
      method: 'get',   
    })
  }
  //开屏保存
  static listSpreadTail(){
    return request({
        url: `/api/oa-portal/massMessage/listSpreadTail`,
        method: 'get',   
      })
  }
  //保存群发消息设置
  static saveMassMessage(data){
    return request({
        url: `/api/oa-portal/massMessage/saveMassMessage`,
        method: 'post',   
        data
      })
  }
  //开屏保存
  static saveSpreadTail(data){
    return request({
        url: `/api/oa-portal/massMessage/saveSpreadTail`,
        method: 'post',   
        data
      })
  }
  static messageType(){
    return request({
        url: `/api/oa-system/dict-biz/dictionary?code=messageAccount`,
        method: 'get',   
      })
  }
}