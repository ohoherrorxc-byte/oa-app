import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const getFunctionAndParts = (params) => {
  return request({
    url: '/api/oa-portal/partsFunction/getFunctionAndParts',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getListByParentId=(parentId)=>{
  return request({
    url: `/api/oa-portal/partsFunction/getListByParentId?parentId=${parentId}`,
    method: 'get',
  })
 
}

export const getCurrency = (params) => {
  return request({
    url: '/api/oa-system/dict/dictionary',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const delParts = (param) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}

export const saveOrUpdateParts = (params) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const getOptions = (params) => {
  return request({
    url: '/api/oa-portal/partsFunction/getListByParentId',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getExchangeRate = (params) => {
  return request({
    url: '/api/oa-portal/exchangeRate/selectByCurrencyCode',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getVehicleDetialList = (params) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/selectList',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getAllList = (params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/partsSubMaint/importSubPartsMaint',
    method: 'post',
    data: formData
  })
}

export const saveActive = (params) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/isActive',
    method: 'get',
    params: {
      ...params,
    }
  })
}
// 导出
export const exportList = (params) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/export',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
export const getPartsDetails = (params) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/detail',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const subList = () => {
  return request({
    url: '/api/oa-portal/partsSubMaint/subList',
    method: 'get',
  })
}

export const getPartsCopy = (params)=>{
  return request({
    url: '/api/oa-portal/partsSubMaint/getPartsCopy',
    method: 'get',
    params: {
      ...params
    }
  })
}
export const exchangeRate = (params) => {
  return request({
    url: '/api/oa-portal/exchangeRate/getPriceByExchangeRate',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getPartsNoById = (params) => {
  return request({
    url: '/api/oa-portal/partsSubMaint/getPartsNoById',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const deleteVehicle = (params) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/delete',
    method: 'get',
    params: {
      ...params,
    }
  })
}

