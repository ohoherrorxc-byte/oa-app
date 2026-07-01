import request from '@/router/axios';

export default class meetingApi {
  static getList(params) {
    return request({
      url: '/api/oa-portal/conference/pageList',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static getTabList(data) {
    return request({
      url: '/api/oa-portal/conference/list',
      method: 'post',
      data
    })
  }

  static add(data) {
    return request({
      url: '/api/oa-portal/conference/save',
      method: 'post',
      data
    })
  }

  static update(data) {
    return request({
      url: '/api/oa-portal/conference/update',
      method: 'post',
      data
    })
  }

  static detail(params) {
    return request({
      url: '/api/oa-portal/conference/detail',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static updateStatus(data) {
    return request({
      url: '/api/oa-portal/conference/updateStatus',
      method: 'post',
      data
    })
  }
  static sendPost(data) {
    return request({
      url: '/api/oa-portal/conference/sendEmail',
      method: 'post',
      data
    })
  }

  static meeingUse(params) {
    return request({
      url: '/api/oa-portal/conference/roomUseTime',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static saveOverview(data) {
    return request({
      url: '/api/oa-portal/conference/saveOverview',
      method: 'post',
      data
    })
  }

  static overviewDetail(params) {
    return request({
      url: '/api/oa-portal/conference/overviewDetail',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static getUserList() {
    return request({
      url: '/api/oa-portal/conference/userList',
      method: 'get',
    })
  }

  static getUserAttend(params){
    return request({
      url: '/api/oa-portal/conference/joinUserList',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static saveConferenceFile(data){
    return request({
      url: '/api/oa-portal/conference/saveConferenceFile',
      method: 'post',
      data
    })
  }

  static listConferenceFile(params){
    return request({
      url: '/api/oa-portal/conference/listConferenceFile',
      method: 'get',
      params: {
        ...params,
      }
    })
  }

  static deleteConferenceFile(params){
    return request({
      url: '/api/oa-portal/conference/deleteConferenceFile',
      method: 'get',
      params: {
        ...params,
      }
    })
  }
}


