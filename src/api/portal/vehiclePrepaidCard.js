import request from '@/router/axios';

//列表
export const list = (current, size, params) => {
  return request({
    url: '/api/oa-portal/prepaidCard/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

//获取账户余额
export const getFleetUserBalanceById = (fleetUserId) => {
  return request({
    url: '/api/oa-portal/prepaidCard/getFleetUserBalanceById',
    method: 'get',
    params: {
      fleetUserId
    }
  })
}

//获取客户预付卡列表
export const getUserPrepaidCardNoList = (excludeBindVinFlag) => {
  return request({
    url: '/api/oa-portal/prepaidCard/getUserPrepaidCardNoList',
    method: 'get',
    params:{
      excludeBindVinFlag
    }
  })
}

//获取客户预付卡信息
export const getUserCardByNo = (chargingCardNo, params) => {
  return request({
    url: '/api/oa-portal/prepaidCard/getUserCardByNo',
    method: 'get' ,
    params: {
      ...params,
      chargingCardNo
    }
  })
}

//批量配额
export const batchQuota = (vehiclePrepaidCards) => {
  return request({
    url: '/api/oa-portal/prepaidCard/batchQuota',
    method: 'post',
    data: vehiclePrepaidCards
  })
}

//批量绑车
export const batchBindVehicle = (vehiclePrepaidCards) => {
  return request({
    url: '/api/oa-portal/prepaidCard/batchBindVehicle',
    method: 'post',
    data: vehiclePrepaidCards
  })
}

//批量绑卡
export const batchBindCard = (vehiclePrepaidCards) => {
  return request({
    url: '/api/oa-portal/prepaidCard/batchBindCard',
    method: 'post',
    data: vehiclePrepaidCards
  })
}

//挂失
export const reportLoss = (row ) => {
  return request({
    url: '/api/oa-portal/prepaidCard/reportLoss',
    method: 'post',
    data: row
  })
}

//解绑VIN
export const unbindVin = (row ) => {
  return request({
    url: '/api/oa-portal/prepaidCard/unbindVin',
    method: 'post',
    data: row
  })
}

//解绑点卡
export const unbindCard = (row ) => {
  return request({
    url: '/api/oa-portal/prepaidCard/unbindCard',
    method: 'post',
    data: row
  })
}

//导出批量配额模板
export const exportBatchQuotaTemplateExcel =(() =>{
  return request({
    url: '/api/oa-portal/prepaidCard/exportBatchQuotaTemplate',
    method: 'get' ,
    params: {
    },
    responseType: 'blob'
  })
})

//批量配额模板数据上传
export const readBatchQuotaData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/oa-portal/prepaidCard/readBatchQuotaData',
    method: 'post',
    data: formData
  })
}

//导出批量绑车模板
export const exportBatchBindVinTemplateExcel =(() =>{
  return request({
    url: '/api/oa-portal/prepaidCard/exportBatchBindVinTemplate',
    method: 'get' ,
    params: {
    },
    responseType: 'blob'
  })
})

//批量绑车模板数据上传
export const readBatchBindVinData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/oa-portal/prepaidCard/readBatchBindVinData',
    method: 'post',
    data: formData
  })
}

//导出批量绑卡模板
export const exportBatchBindCardTemplateExcel =(() =>{
  return request({
    url: '/api/oa-portal/prepaidCard/exportBatchBindCardTemplate',
    method: 'get' ,
    params: {
    },
    responseType: 'blob'
  })
})

//批量绑卡模板数据上传
export const readBatchBindCardData = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/oa-portal/prepaidCard/readBatchBindCardData',
    method: 'post',
    data: formData
  })
}

//验证账户
export const verifyAccountPassword = (row ) => {
  return request({
    url: '/api/oa-portal/fleetuserblade/verifyAccountPassword',
    method: 'post',
    data: row
  })
}

//获取账户余额
export const updatePlugChargeStatus = (vin,plugChargeFlag) => {
  return request({
    url: '/api/oa-portal/prepaidCard/updatePlugChargeStatus',
    method: 'get',
    params: {
      vin,
      plugChargeFlag
    }
  })
}

//检查卡状态
export const checkCardStatus = (cards) => {
  const formData = new FormData();
  formData.append('cards', cards);
  return request({
    url: '/api/oa-portal/prepaidCard/check-card-status',
    method: 'post',
    data: formData,
  })
}

