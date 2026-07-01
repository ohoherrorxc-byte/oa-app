import request from '@/router/axios';

export default class AssetsManageApi {
  static getList(data) {
    return request({
      url: '/api/oa-portal/assetManagement/assetPageList',
      method: 'POST',
      data
    })
  }
  static getListReport(data) {
    return request({
      url: '/api/oa-portal/assetManagement/assetExcelPageList',
      method: 'POST',
      data
    })
  }

  static getInventoryList(data) {
    return request({
      url: '/api/oa-portal/assetManagement/assetInventoryPageList',
      method: 'POST',
      data
    })
  }

  static inventoryAdd(data) {
    return request({
      url: '/api/oa-portal/assetManagement/assetInventorySave',
      method: 'post',
      data: data
    })
  }
  //台账新增和更新
  static assetSave(data) {
    return request({
      url: data.id?"/api/oa-portal/assetManagement/assetUpdate":'/api/oa-portal/assetManagement/assetSave',
      method: 'post',
      data: data
    })
  }
  //台账导出
  static exportAsset(data) {
    return request({
      url: '/api/oa-portal/assetManagement/exportAsset',
      method: 'post',
      responseType: 'blob',
      data
    })
  }
  //台账模板导出
  static exportAssetTemplate() {
    return request({
      url: '/api/oa-portal/assetManagement/exportAssetTemplate',
      method: 'get',
      responseType: 'blob',
    })
  }
  //盘点模板导出
  static exportAssetInventoryTemplate() {
    return request({
      url: '/api/oa-portal/assetManagement/exportAssetInventoryTemplate',
      method: 'get',
      responseType: 'blob',
    })
  }
  //盘点导出
  static exportInventoryAsset(params) {
    // console.log(params)
    return request({
      url: '/api/oa-portal/assetManagement/exportAssetInventory',
      method: 'get',
      responseType: 'blob',
      params
    })
  }
  static getDetailInventory() {

  }
  static getDetails(id) {
    return request({
      url: `/api/oa-portal/assetManagement/assetDetail?id=${id}`,
      method: 'get',    
    })
  }
  //导出我的资产
  static exportMyAsset(params) {
    return request({
      url: '/api/oa-portal/assetManagement/exportMine',
      method: 'get',
      responseType: 'blob',
      params
    })
  }
//导出报表
  static exportReport(params) {
    return request({
      url: '/api/oa-portal/assetManagement/exportAssetExcel',
      method: 'get',
      responseType: 'blob',
      params
    })
  }

  static getDictionary(code) {
    return request({
      url: `/api/oa-system/dict-biz/dictionary?code=${code}`,
      method: 'get',
    })
  }
  //台账删除
  static deleteLedger(ids){
    return request({
      url: `/api/oa-portal/assetManagement/deletePropertyById?ids=${ids}`,
      method: 'get',
    })
  }
  //盘点删除
  static deleteInventory(ids){
    return request({
      url: `/api/oa-portal/assetManagement/deleteInventoryById?ids=${ids}`,
      method: 'get',
    })
  }
  static updateInventoryStatusByIds(ids){
    return request({
      url: `/api/oa-portal/assetManagement/updateInventoryStatusByIds?ids=${ids}`,
      method: 'get',
    })
  }
}