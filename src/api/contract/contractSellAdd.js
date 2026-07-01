import request from '@/router/axios';
import website from "@/config/website";

export const generalAdd = (params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseContract/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const SellAdd = (params) => {
  return request({
    url: '/api/oa-portal/saleContract/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const BOMAdd = (params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseContract/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const SaleOrderAdd = (params) => {
  return request({
    url: '/api/oa-portal/saleOrder/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}
// 一般订单保存：
export const PurchaseOrderAdd = (params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}
// bom订单保存：
export const bomPurchaseOrderAdd = (params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseOrder/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}
// license订单保存:
export const licensePurchaseOrderAdd = (params) => {
  return request({
    url: '/api/oa-portal/licensePurchaseOrder/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}
// 一般订单详情：
export const purchaseOrderDetail = (params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/detail',
    method: 'get',
    params
  })
}
// bom订单详情:
export const bomPurchaseOrderDetail = (params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseOrder/detail',
    method: 'get',
    params
  })
}
// license订单详情:
export const licensePurchaseOrderDetail = (params) => {
  return request({
    url: '/api/oa-portal/licensePurchaseOrder/detail',
    method: 'get',
    params
  })
}

export const payReceiveRecordAdd = (params) => {
  return request({
    url: '/api/oa-portal/payReceiveRecord/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const InvoicedAdd = (params) => {
  return request({
    url: '/api/oa-portal/invoice/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const RemindAdd = (params) => {
  return request({
    url: '/api/oa-portal/contractRemind/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const contractStatisticsAdd = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/saveOrUpdateSaleTarget',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const SellGetDetail = (id, params) => {
  return request({
    url: '/api/oa-portal/saleContract/detail',
    method: 'get',
    params: {
      ...params,
      id
    }
  })
}

export const SaleOrderGetDetail = (id, params) => {
  return request({
    url: '/api/oa-portal/saleOrder/detail',
    method: 'get',
    params: {
      ...params,
      id
    }
  })
}

export const PurchaseOrderGetDetail = (id, params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/detail',
    method: 'get',
    params: {
      ...params,
      id
    }
  })
}

export const BOMGetDetail = (id, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseContract/detail',
    method: 'get',
    params: {
      ...params,
      id,
    }
  })
}

export const GeneralGetDetail = (id, params) => {
  return request({
    url: '/api/oa-portal/purchaseContract/detail',
    method: 'get',
    params: {
      ...params,
      id,
    }
  })
}

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

export const getAllList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/contractSupplier/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const SaleOrderGetList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/saleOrder/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const SaleOrderGetMyList = (userId, current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}

export const PurchaseOrderGetList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// bom订单列表：
export const bomPurchaseOrder = (current, size, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseOrder/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 一般订单列表：
export const purchaseOrder = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// license订单：
export const licensePurchaseOrder = (current, size, params) => {
  return request({
    url: '/api/oa-portal/licensePurchaseOrder/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 我的请求-一般订单列表:
export const myPurchaseOrder = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 我的请求-bom订单列表：
export const myBomPurchaseOrder = (current, size, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseOrder/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 我的请求-license订单列表：
export const myLicensePurchaseOrder = (current, size, params) => {
  return request({
    url: '/api/oa-portal/licensePurchaseOrder/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// bom订单列表：(无分页)
export const bomPurchaseOrderList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseOrder/selectList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// 一般订单列表：(无分页)
export const purchaseOrderList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/selectList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}
// license订单：(无分页)
export const licensePurchaseOrderList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/licensePurchaseOrder/selectList',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const PurchaseOrderGetMyList = (userId, current, size, params) => {
  return request({
    url: '/api/oa-portal/saleOrder/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}

export const BOMGetList = (params) => {
    return request({
      url: '/api/oa-portal/purchaseContractDetail/list',
      method: 'get',
      params: {
        ...params,
      }
    })
}

export const payReceiveRecordList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/payReceiveRecord/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const InvoicegetList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/invoice/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const InvoicegetMyList = (userId, current, size, params) => {
  return request({
    url: '/api/oa-portal/invoice/selectMyRequestPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
      userId
    }
  })
}

export const RemindgetList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/contractRemind/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const saleContractDelete = (ids, params) => {
  return request({
    url: '/api/oa-portal/saleContract/delete',
    method: 'get',
    params: {
      ...params,
      ids,
    }
  })
}

export const saleOrderDelete = (ids, params) => {
  return request({
    url: '/api/oa-portal/saleOrder/delete',
    method: 'get',
    params: {
      ...params,
      ids,
    }
  })
}

export const purchaseContractDelete = (ids, params) => {
  return request({
    url: '/api/oa-portal/bomPurchaseContract/delete',
    method: 'get',
    params: {
      ...params,
      ids,
    }
  })
}
// 一般订单删除：/purchaseOrder/delete
export const purchaseOrderDelete = (ids) => {
  return request({
    url: '/api/oa-portal/purchaseOrder/delete',
    method: 'get',
    params: {
      ids,
    }
  })
}
// bom订单删除：
export const bomPurchaseOrderDelete = (ids) => {
  return request({
    url: '/api/oa-portal/bomPurchaseOrder/delete',
    method: 'get',
    params: {
      ids,
    }
  })
}
// license订单删除：
export const licensePurchaseOrderDelete = (ids) => {
  return request({
    url: '/api/oa-portal/licensePurchaseOrder/delete',
    method: 'get',
    params: {
      ids,
    }
  })
}

export const upload = (file, fileName) => {
  const directory = 'license/tbox/xlsx/';
  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', directory + fileName);
  return request({
    headers: {
      "Content-Type": "multipart/form-data"
    },
    url: '/api/oa-resource/oss/endpoint/put-file-attach-by-name',
    method: 'post',
    data: formData
  })
}

export const importExcel = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/bomPurchaseContract/importBomPurchaseContract',
    method: 'post',
    data: formData
  })
}

export const importExcelIMp = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/purchaseOrder/importPurchaseOrder',
    method: 'post',
    data: formData
  })
}

export const importExcelsaleContract = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/saleContract/importSaleContract',
    method: 'post',
    data: formData
  })
}

export const importExcelsaleOrder = (file) => {
  const formData = new FormData();
  formData.append('file',file);
  return request({
    url: '/api/oa-portal/saleOrder/importSaleOrder',
    method: 'post',
    data: formData
  })
}

export const contractStatistics = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/getContractStatistic',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const contractBoard = (params) => {
  return request({
    url: '/api/oa-portal/contractStatistics/getContractBoard',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getLicenseList = (params) => {
  return request({
    url: '/api/oa-portal/contractLicense/list',
    method: 'get',
    params: {
      ...params,
    }
  })
}
export const contractCustomer = () => {
  return request({
    url: '/api/oa-portal/contractCustomer/selectList',
    method: 'get',
  })
}
export const importSaleContractWord = (params) => {
  return request({
    url: '/api/oa-portal/saleContract/importSaleContractWord',
    method: 'post',
    params
  })
}
export const importPurchaseContractWord = (params) => {
  return request({
    url: '/api/oa-portal/purchaseContract/importPurchaseContractWord',
    method: 'post',
    params
  })
}

export const exportExcelAll = (params) => {
  return request({
    url: '/api/oa-portal/saleContract/export',
    method: 'get',
    params: {
      ...params
    },
    responseType: 'blob'
  })
}

