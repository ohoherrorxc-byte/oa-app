import request from '@/router/axios';

export default class UserApi {
  static add(data) {
    return request({
      url: '/api/oa-user/v2.0/submit',
      method: 'post',
      data
    })
  }
  static update(data) {
    return request({
      url: '/api/oa-user/v2.0/update',
      method: 'post',
      data
    })
  }
  static checkCode() {
    return request({
      url: '/api/oa-user/v2.0/checkCode',
      method: 'get',
    })
  }
  static contractSupplier(name) {
    return request({
      url: `/api/oa-portal/contractSupplier/list?supplierName=${name}&supplierType=1`,
      method: 'get',
    })
  }
  static contractSupplierAll(name) {
    return request({
      url: `/api/oa-portal/contractSupplier/list?supplierName=${name}`,
      method: 'get',
    })
  }
  static getDetails(id) {
    return request({
      url: `/api/oa-user/v2.0/detail?id=${id}`,
      method: 'get',
    })
  }

  static getDepartment() {
    return request({
      url: `/api/oa-system/dept/v2.0/listAll`,
      method: 'get',
    })
  }

  static getPost() {
    return request({
      url: `/api/oa-system/post/v2.0/select?tenantId=629965`,
      method: 'get',
    })
  }

  static getRole() {
    return request({
      url: `/api/oa-system/role/v2.0/tree?tenantId=629965`,
      method: 'get',
    })
  }

  static userAllList(data){
    return request({
      url: `/api/oa-user/v2.0/userAllList`,
      method: 'post',
      data
    })
  }
}

export const getList = (current, size, params, deptId) => {
  return request({
    url: '/api/oa-user/v2.0/page',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      deptId,
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-user/v2.0/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-user/v2.0/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-user/v2.0/update',
    method: 'post',
    data: row
  })
}


export const getUser = (id) => {
  return request({
    url: '/api/oa-user/v2.0/detail',
    method: 'get',
    params: {
      id,
    }
  })
}


export const resetPassword = (userIds) => {
  return request({
    url: '/api/oa-user/v2.0/reset-password',
    method: 'post',
    params: {
      userIds,
    }
  })
}


export const grant = (userIds, roleIds) => {
  return request({
    url: '/api/oa-user/v2.0/grant',
    method: 'post',
    params: {
      userIds,
      roleIds,
    }
  })
}
