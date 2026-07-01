import request from '@/router/axios';

export default class FormEditorApi {
  static formSave(data) {
    return request({
      url: '/api/oa-flow/custom/form/save',
      method: 'post',
      data
    })
  }
  
  static detail(id) {
    return request({
      url: `/api/oa-flow/custom/form/getByFlowId?flowId=${id}`,
      method: 'get',

    })
  }

  static getFlowList(){
    return request({
      url:'/api/oa-flow/custom/form/getFlowList',
      method: 'get',
    })
  }
}