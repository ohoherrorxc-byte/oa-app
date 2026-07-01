import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const delVehicleModel = (param) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/deleteBatch',
    method: 'get',
    params: {
      ids: param
    }
  })
}

export const saveOrUpdateVehicleModel = (params) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}
export const saveOrUpdateVehicleModelNew = (params) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/saveBatch',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const selectLists = (params) => {
  return request({
    url: '/api/oa-portal/contractLicenseSeries/selectList',
    method: 'get',
    params: {
      ...params,
    }
  })
}
export const exportList = () => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/export',
    method: 'get',
    responseType: 'blob'
  })
}

export const syncModelType = () => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/syncModelType',
    method: 'get',
  })
}

export const getSeriesName = (params) => {

  return request({
    url: '/api/oa-portal/contractLicenseSeries/getSeriesName',
    method: 'post',
    params: {
      ...params,
    }
  })
}
export const getBomByModelIdAndCountryCode = (params) => {

  return request({
    url: '/api/oa-portal/bomMaint/getBomByModelIdAndCountryCode',
    method: 'get',
    params: {
      ...params,
    }
  })
}
