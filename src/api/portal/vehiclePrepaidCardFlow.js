import request from '@/router/axios';

//列表
export const list = (current, size, params) => {
  return request({
    url: '/api/oa-portal/prepaidCardFlow/list',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

//列表（点卡二维码扫描用）
export const listForScan = (current, size, params) => {
  return request({
    url: '/api/oa-portal/prepaidCardFlow/list-for-scan',
    method: 'get',
    params: {
      ...params,
      current,
      size
    }
  })
}

//导出
export const exportExcel =((params) =>{
  return request({
    url: '/api/oa-portal/prepaidCardFlow/export',
    method: 'get' ,
    params: {
      ...params
    },
    responseType: 'blob'
  })
})

//导出
export const exportDistributeExcel =((params) =>{
  return request({
    url: '/api/oa-portal/prepaidCardFlow/exportDistributeRecord',
    method: 'get' ,
    params: {
      ...params
    },
    responseType: 'blob'
  })
})


