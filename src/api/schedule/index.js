import request from '@/router/axios';

export default class scheduleApi {
  static getList(params) {
    return request({
      url: '/api/oa-portal/schedule/pageList',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static getTabList(data) {
    return request({
      url: '/api/oa-portal/schedule/scheduleList',
      method: 'post',
      data
    })
  }

  static add(data) {
    return request({
      url: '/api/oa-portal/schedule/save',
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: '/api/oa-portal/schedule/update',
      method: 'post',
      data
    })
  }

  static detail(params) {
    return request({
      url: '/api/oa-portal/schedule/detail',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static updateFinishStatus(data) {
    return request({
      url: '/api/oa-portal/schedule/finishSchedule',
      method: 'post',
      data
    })
  }

  static importantSchedule(data) {
    return request({
      url: '/api/oa-portal/schedule/importantSchedule',
      method: 'post',
      data
    })
  }

  static deleteRow(id) {
    return request({
      url: `/api/oa-portal/schedule/deleteSchedule?id=${id}`,
      method: 'get'
    })
  }

  static tabulationList(){
    return request({
        url: `/api/oa-portal/schedule/tabulationList`,
        method: 'get'
      })
  }

  static saveTabulation(data){
    return request({
        url: '/api/oa-portal/schedule/saveTabulation',
        method: 'post',
        data
      })
  }

  static updateTabulation(data){
    return request({
        url: '/api/oa-portal/schedule/updateTabulation',
        method: 'post',
        data
      })
  }

  static deleteTabulation(id){
    return request({
        url: `/api/oa-portal/schedule/deleteTabulation?id=${id}`,
        method: 'get'
      })
  }

  static gateTabulationList(data) {
    return request({
        url: '/api/oa-portal/schedule/gateTabulationList',
        method: 'post',
        data
      })
  }

  static getUserList() {
    return request({
      url: '/api/oa-portal/conference/userList',
      method: 'get',
    })
  }

  static todaySchedule(data) {
    return request({
      url: '/api/oa-portal/schedule/todaySchedule',
      method: 'post',
      data
    })
  }

  static suggestGroupList(data){
    return request({
      url: '/api/oa-portal/schedule/suggestGroupList',
      method: 'post',
      data
    })
  }

  static scheduleGroupList(data) {
    return request({
      url: '/api/oa-portal/schedule/scheduleGroupList',
      method: 'post',
      data
    })
  }

  static getUserInfoList() {
    return request({
      url: '/api/oa-user/getUserList',
      method: 'get',
    })
  }
}


