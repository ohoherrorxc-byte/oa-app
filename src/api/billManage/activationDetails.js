import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/contractLicense/list',
    method: 'post',
    data: {
      param: {
        ...params,
      },
      query:{current,size}
    }
  })
}

export const getDetail = (id) => {
  return request({
    url: '/api/oa-portal/license/detail',
    method: 'get',
    params: {
      id
    }
  })
}

export const remove = (ids) => {
  return request({
    url: '/api/oa-portal/license/remove',
    method: 'post',
    params: {
      ids,
    }
  })
}

export const add = (row) => {
  return request({
    url: '/api/oa-portal/license/submit',
    method: 'post',
    data: row
  })
}

export const update = (row) => {
  return request({
    url: '/api/oa-portal/license/submit',
    method: 'post',
    data: row
  })
}

export const updateBatch = (vinList, status, orderId, updateType, supplierName) => {
  return request({
    url: '/api/oa-portal/license/update-batch',
    method: 'post',
    params: {
      vinList,
      status,
      orderId,
      updateType,
      supplierName
    }
  })
}

export const getTree = (params) => {
  return request({
    url: '/api/oa-portal/contractLicense/series-model-tree',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const exportExcelAll = (param) => {
  return request({
    url: '/api/oa-portal/contractLicense/export',
    method: 'POST',
    data: {
      param
    },
    responseType: 'blob'
  })
}


export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    // url: '/api/oa-portal/makeUp/importShipmentDate',
    url:"/api/oa-portal/contractLicense/updateLicense",
    method: 'post',
    data: formData
  })
}
export const importExcelAdd = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    // url: '/api/oa-portal/makeUp/importShipmentDate',
    url:"/api/oa-portal/contractLicense/addLicense",
    method: 'post',
    data: formData
  })
}


export const getLicenseCountAndYear = () => {
  return request({
    url: '/api/oa-portal/contractLicense/getLicenseCountAndYear',
    method: 'get'
  })
}

export const getLicenseCountAndMonth = (param) => {
  return request({
    url: '/api/oa-portal/contractLicense/getLicenseCountAndMonth',
    method: 'get',
    params: {
      ...param,
    }
  })
}

export const getLicenseCountAndMonthByYear = (param) => {
  return request({
    url: '/api/oa-portal/contractLicense/getLicenseCountAndMonthByYear',
    method: 'get',
    params: {
      ...param,
    }
  })
}

export const getCustomerInvoiceList = (param) => {
  return request({
    url: '/api/oa-portal/invoice/getCustomerInvoiceList',
    method: 'get',
  })
}

export const exportActivationDetails = (param) => {
  return request({
    url: '/api/oa-portal/invoice/exportCustomerInvoiceList',
    method: 'get',

    responseType: 'blob'
  })
}

export const exportLicenseExcelAll = (param) => {
  return request({
    url: '/api/oa-portal/licenseInfo/exportLicense',
    method: 'POST',
    data: {
      param
    },
    responseType: 'blob'
  })
}

export const getInvoiceListByInvoiceNoList = (param) => {
  const list = Array.isArray(param && param.invoiceNoList)
    ? param.invoiceNoList.filter((item) => item !== undefined && item !== null && item !== '')
    : []
  const invoiceNoList = list.join(',')
  return request({
    url: '/api/oa-portal/invoice/getInvoiceListByInvoiceNoList',
    method: 'post',
    // 兼容后端按 @RequestParam Map<String, Object> 接收参数的场景
    params: {
      invoiceNoList
    },
    data: {
      invoiceNoList: list
    }
  })
}

