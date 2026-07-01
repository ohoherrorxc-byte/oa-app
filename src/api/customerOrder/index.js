import request from '@/router/axios';

export default class CustomerOrderApi {
  static exportCustomerOrder(data) {
    return request({
      url: '/api/oa-portal/customPartsOrderInfo/export',
      method: 'post',
      responseType: 'blob',
      data
    })
  }
  static exportCustomerOrderSummary(data) {
    return request({
      url: '/api/oa-portal/customPartsOrderInfo/exportCustomerOrderSummary',
      method: 'post',
      responseType: 'blob',
      data
    })
  } 
  static add(data) {
    return request({
      url: '/api/oa-portal/customPartsOrderInfo/addOrder',
      method: 'post',
      data
    })
  }
  static getWeekList(data) {
    return request({
      url: '/api/oa-portal/customPartsOrderInfo/weekSearch',
      method: 'post',
      data
    })
  }
  
  static detail(id){
    return request({
      url: `/api/oa-portal/customPartsOrderInfo/detail?id=${id}`,
      method: 'get',
    })
  }

  static selectPage = (data) => {
    return request({
      url: '/api/oa-portal/customPartsOrderInfo/selectPage',
      method: 'post',
      data
    })
  }

  static getSummaryTable = (data) => {
    return request({
      url: '/api/oa-portal/customPartsOrderInfo/getSummaryTable',
      method: 'post',
      data
    })
  }
  static submitMonthDesc = (data) => {
    return request({
      url: '/api/oa-portal/customPartsOrderMonthInfo/saveOrUpdate',
      method: 'post',
      data
    })
  }
  static detailDesc = (id) => {
    return request({
      url: `/api/oa-portal/customPartsOrderMonthInfo/detail?id=${id}`,
      method: 'get',  
    })
  }
} 