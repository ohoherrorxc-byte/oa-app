import request from '@/router/axios';

export default class MyFlowApi {
  static flowType() {
    return request({
      url: '/api/oa-system/dict/dictionary?code=flow',
      method: 'get',
    })
  }
  static deleteRedDot(processInstanceId,userId){
    return request({
      url: `/api/oa-flow/work/delete-redDot?processInstanceId=${processInstanceId}&userId=${userId}`,
      method: 'get',
    })
  }
  static getFlowTree(title){    
    return request({
      url: `/api/oa-flow/work/getFlowTree?flowName=${title}`,
      method: 'get',
    })
  } 
  static updateFlowUserStatus(businessId,userId,businessName){
    let url =  businessName?  `/api/oa-portal/flowUserStatus/updateFlowUserStatus?businessId=${businessId}&userId=${userId}&businessName=${businessName}`
               :`/api/oa-portal/flowUserStatus/updateFlowUserStatus?businessId=${businessId}&userId=${userId}`
    return request({
      url: url,
      method: 'get',
    })
  }
  static getFileStampList(businessId,userId,businessName){
    return request({
      url: `/api/oa-portal/file/getFileStampList?businessId=${businessId}&userId=${userId}&businessName=${businessName}`,
      method: 'get',
    })
  }
  static deleteFile(id){
    return request({
      url: `/api/oa-portal/file/deleteFile?id=${id}`,
      method: 'get',
    })
  }
} 

// =====================参数===========================

export const historyFlowList = (processInstanceId) => {
  return request({
    url: '/api/oa-flow/process/history-flow-list',
    method: 'get',
    params: {
      processInstanceId
    }
  })
}
//删除流程
export const deleteRowFlow = (params)=>{
  return request({
    url: '/api/oa-flow/work/delete-flow',
    method: 'get',
    params: params
  })
}
// =====================请假流程===========================

export const leaveProcess = (data) => {
  return request({
    url: '/api/oa-flow/process/leave/start-process',
    method: 'post',
    data
  })
}

export const leaveDetail = (businessId) => {
  return request({
    url: '/api/oa-flow/process/leave/detail',
    method: 'get',
    params: {
      businessId
    }
  })
}
export const startList = (params) => {
  return request({
    url: '/api/oa-flow/work/start-list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const claimList = (current, size, params) => {
  return request({
    url: '/api/oa-flow/work/claim-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const todoList = (current, size, params) => {
  return request({
    url: '/api/oa-flow/work/todo-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const sendList = (current, size, params) => {
  return request({
    url: '/api/oa-flow/work/send-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}


export const doneList = (current, size, params) => {
  return request({
    url: '/api/oa-flow/work/done-list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const claimTask = (taskId) => {
  return request({
    url: '/api/oa-flow/work/claim-task',
    method: 'post',
    params: {
      taskId
    }
  })
}


export const completeTask = (data) => {
  return request({
    url: '/api/oa-flow/work/complete-task',
    method: 'post',
    data
  })
}

//项目列表
export const contractProject = () => {
  return request({
    url: '/api/oa-portal/contractProject/selectList',
    method: 'get',
  })
}
//转发
export const retransmission = (data) => {
  return request({
    url: '/api/oa-flow/work/forward-task',
    method: 'post',
    data
  })
}
//加签
export const forwardTask = (data)=>{
  return request({
    url: `/api/oa-flow/addFlowApproval/forward-task`,
    method: 'post',
    data
  })
}
//阅读状态更新
export const readUpdate = (businessId) => {
  return request({
    url: `/api/oa-flow/work/change—read-status?businessId=${businessId}`,
    method: 'get',
  })
}
//收藏
export const collectTask = (data) => {
  return request({
    url: `/api/oa-flow/work/collect-task`,
    method: 'post',
    data
  })
}
//我的收藏
export const myCollect = ()=>{
  return request({
    url: `/api//oa-flow/work/list-collect-task`,
    method: 'get',
  })
}

export const getList = (data)=>{
  return request({
    url: `/api/oa-flow/work/list-task`,
    method: 'post',
    data
  })
}

export const getListQuery = (data)=>{
  return request({
    url: `/api/oa-flow/work/list-task-page`,
    method: 'post',
    data
  })
}

export const findTask = (params)=>{
  return request({
    url: `/api/oa-flow/work/find-task`,
    method: 'GET',
    params,
  })
}

export const  backTask = (params)=>{
  return request({
    url: `/api/oa-flow/work/back-task`,
    method: 'GET',
    params,
  })
}

export const listProcessDefName = ()=>{
  return request({
    url: `/api/oa-flow/work/listProcessDefName`,
    method: 'GET',
  })
}

export const flowTaskExport = (data)=>{
  return request({
    url: `/api/oa-flow/work/flow-task-export`,
    method: 'post',
    data,
    responseType: 'blob'
  })
}

