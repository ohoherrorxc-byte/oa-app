import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/contractSupplier/importSupplier',
    method: 'post',
    data: formData
  })
}

export const delSupplier = (param) => {
  return request({
    url: '/api/oa-portal/contractSupplier/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}
export const saveOrUpdateSuppliers = (params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/saveOrUpdate',
    method: 'POST',
    data: {
      ...params,
    }
  })
}
export const getSupplierExchangeRateHis = (params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/getSupplierExchangeRateHis',
    method: 'get',
   params
  })
}

export const getContractSupplierList = (params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getDetail = (params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/detail',
    method: 'get',
    params: {
      ...params,
    }
  })
}

