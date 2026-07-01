import request from '@/router/axios';
// 字典接口
export const getOptions = (params) => {
  return request({
    url: '/api/oa-system/dict/dictionary',
    method: 'get',
    params: {
      ...params,
    }
  })
}
// 字典接口
export const getDictionary = (params) => {
  return request({
    url: '/api/oa-system/dict-biz/dictionary',
    method: 'get',
    params: {
      ...params,
    }
  })
}
// 车型列表
export const getVehicleDetialList = (params) => {
  return request({
    url: '/api/oa-portal/vehicleModelManage/selectList',
    method: 'get',
    params: {
      ...params,
    }
  })
}
// 零件列表
export const getPartsMaintList = () => {
  return request({
    url: '/api/oa-portal/partsMaint/selectlist',
    method: 'get',
  })
}
// 子零件列表
export const getSubPartsMaintList = () => {
  return request({
    url: '/api/oa-portal/partsMaint/listPartsCategory',
    method: 'get',
   
  })
}
// 供应商列表
export const getContractSupplier = () => {
  return request({
    url: '/api/oa-portal/contractSupplier/list',
    method: 'get',
   
  })
}