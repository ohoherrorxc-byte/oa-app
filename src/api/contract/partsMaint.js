import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/partsMaint/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 导出
export const exportReport = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/exportUnpaidPart',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}
//更新历史欠款
export const updatePartsUnPaid = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/updatePartsUnPaid',
    method: 'get',
    params: {
      ...params
    },
  })
}
export const getSubMaintDetail = (id)=>{
  return request({
    url: `/api/oa-portal/partsSubMaint/getSubMaint?id=${id}`,
    method: 'get',
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
    url: '/api/oa-portal/partsMaint/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}

export const saveOrUpdateParts = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const getSubMaintList = ()=>{
  return request({
    url: '/api/oa-portal/partsMaint/subList',
    method: 'get',
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
    url: '/api/oa-portal/partsMaint/importPartsMaint',
    method: 'post',
    data: formData
  })
}

export const saveActive = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/isActive',
    method: 'get',
    params: {
      ...params,
    }
  })
}
// 导出
export const exportList = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/export',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}

export const getPartsCopy = (params)=>{
  return request({
    url: '/api/oa-portal/partsMaint/getPartsCopy',
    method: 'get',
    params: {
      ...params
    }
  })
}

export const getPartsDetails = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/detail',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getPartsNoPrice = (params)=>{
  return request({
    url: '/api/oa-portal/partsMaint/getPartsNoPrice',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const subList = () => {
  return request({
    url: '/api/oa-portal/partsMaint/subList',
    method: 'get',
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
    url: '/api/oa-portal/partsMaint/getPartsNoById',
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

