import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseContract/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getListAllP = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseContract/selectList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getMyList = (userId, current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseContract/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}

export const generalAdd = (params) => {
    return request({
      url: '/api/oa-portal/purchaseContract/saveOrUpdate',
      method: 'post',
      data: {
        ...params,
      }
    })
  }

  export const purchaseContractDelete = (ids, params) => {
    return request({
      url: '/api/oa-portal/purchaseContract/delete',
      method: 'get',
      params: {
        ...params,
        ids,
      }
    })
  }

  export const importExcel = (file) => {
    const formData = new FormData();
    formData.append('file',file);
    return request({
      url: '/api/oa-portal/purchaseContract/importPurchaseContract',
      method: 'post',
      data: formData
    })
  }

