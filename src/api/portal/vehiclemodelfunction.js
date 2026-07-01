import request from '@/router/axios';

//列表
export const list = (current, size, params) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/list',
    method: 'get',
    params: {
      ...params,
      current,
      size

    }
  })
}

//车型车系列表
export const vModelSeriesList = () => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/vModelSeriesList',
    method: 'get',
    params: {
    }
  })
}

//车型功能列表
export const vModelFuncSummary = () => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/summary',
    method: 'get',
    params: {
    }
  })
}

//根据车型ID获取车型功能列表
export const getVModelFunListByModelId = (modelId) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/getVModelFunListByModelId',
    method: 'get',
    params: {
      modelId
    }
  })
}

//提交
export const submit = (vModelFunc) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/submit',
    method: 'post',
    data: vModelFunc
  })
}

//逻辑删除
export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

//逻辑删除
export const removeByModelId = (modelId) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/removeByModelId',
    method: 'post',
    params: {
      modelId,
    }
  })
}

//逻辑更新
export const update = (vehicleModelFunction) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/update',
    method: 'post',
    data: vehicleModelFunction
  })
}

//逻辑删除
export const changeStatus = (modelId,status) => {
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/changeStatus',
    method: 'post',
    params: {
      modelId,
      status
    }
  })
}

//导出车型功能
export const exportExcel =((funcCodeNum,seriesName,vin) =>{
  return request({
    url: '/api/oa-portal/vehicle/service/model/function/export-vModelFunc',
    method: 'get' ,
    params: {
      funcCodeNum,
      seriesName,
      vin
    },
    responseType: 'blob'
  })
})
