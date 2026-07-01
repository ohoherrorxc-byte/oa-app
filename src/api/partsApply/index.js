import request from '@/router/axios';

export default class PartsApplyApi {
  //详情
  static details(businessId) {
    return request({
      url: `/api/oa-flow/operation/part/detail?businessId=${businessId}`,
      method: 'get',
    })
  }

  //零件名列表
  static getBasicList(data) {
    return request({
      url: `/api/oa-portal/partsManagement/getBasicList`,
      method: 'post',
      data
    })
  }

  static getScrapByFile() {
    return request({
      url: `/api/oa-portal/partsManagement/getScrapByFile`,
      method: 'post',

    })
  }

  // transfer详情
  static transferDetails(businessId) {
    return request({
      url: `/api/oa-flow/application/testingPartEquipment/transfer/detail?businessId=${businessId}`,
      method: 'get',
    })
  }

  // 领用详情
  static usingDetails(businessId) {
    return request({
      url: `/api/oa-flow/application/testingPartEquipment/using/detail?businessId=${businessId}`,
      method: 'get',
    })
  }

  // 报废详情
  static scrapDetails(businessId) {
    return request({
      url: `/api/oa-flow/application/testingPartEquipment/scrap/detail?businessId=${businessId}`,
      method: 'get',
    })
  }

  // 归还详情
  static returnDetails(businessId) {
    return request({
      url: `/api/oa-flow/application/testingPartEquipment/return/detail?businessId=${businessId}`,
      method: 'get',
    })
  }

  // 入库详情
  static stockInDetails(businessId) {
    return request({
      url: `/api/oa-flow/application/testingPartEquipment/stockIn/detail?businessId=${businessId}`,
      method: 'get',
    })
  }
}
