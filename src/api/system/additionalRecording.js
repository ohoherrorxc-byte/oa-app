import request from '@/router/axios';

export const sendStatisticDate = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/sendStatisticDate',
    method: 'get',
    params
  })
}

export const updatePayBillExchangeRateData = (params) => {
  return request({
    url: '/api/oa-portal/makeUp/updatePayBillExchangeRateData',
    method: 'get',
    params
  })
}
export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/makeUp/importShipmentDate',
    method: 'post',
    data: formData
  })
}
export const invoicePayExport = () =>{
  return request({
    url: `/api/oa-portal/flowTable/invoicePayExport`,
    method: 'get',
    responseType: 'blob'
  })
}
export const yongYinExport = () =>{
  return request({
    url: `/api/oa-flow/custom/approval/yongYinExport`,
    method: 'get',
    responseType: 'blob'
  })
}
