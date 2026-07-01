import request from '@/router/axios';

export default class PartsManageApi {
    //基本信息列表
    static basicList(data) {
        return request({
            url: `/api/oa-portal/partsManagement/basicList`,
            method: 'post',
            data
        })
    }
    static basicSave(data) {
        return request({
            url: '/api/oa-portal/partsManagement/basicSave',
            method: 'post',
            data
        })
    }
    static basicDetail(id) {
        return request({
            url: `/api/oa-portal/partsManagement/basicDetail?id=${id}`,
            method: 'get',
        })
    }

    static basicExport(data) {
        return request({
            url: `/api/oa-portal/partsManagement/basicExport`,
            method: 'post',
            data,
            responseType: 'blob'
        })
    }
    static exportPartsInventoryTemplate(){
        return request({
            url: `/api/oa-portal/partsManagement/exportPartsInventoryTemplate`,
            method: 'get',
            responseType: 'blob'
        })
    }
    static getInventoryList(data){
        return request({
            url: `/api/oa-portal/partsManagement/partsInventoryPageList`,
            method: 'post',
           data
        })
    }
    //基本信息下载模板
    static basicExportTemplate() {
        return request({
            url: `/api/oa-portal/partsManagement/basicExportTemplate`,
            method: 'get',
            responseType: 'blob'
        })
    }
    static basicImport() {
        return request({
            url: `/api/oa-portal/partsManagement/basicImport`,
            method: 'get',
            responseType: 'blob'
        })
    }
    static basicDelete(ids) {
        return request({
            url: `/api/oa-portal/partsManagement/basicDelete?ids=${ids}`,
            method: 'get',
        })
    }
    //领用信息列表
    static useInfoList(data) {
        return request({
            url: `/api/oa-portal/partsManagement/useInfoList`,
            method: 'post',
            data
        })
    }
    //领用信息新增
    static useInfoSave() {
        return request({
            url: `/api/oa-portal/partsManagement/useInfoSave`,
            method: 'get',
        })
    }
    //领用信息导出
    static useInfoExport(data) {
        return request({
            url: `/api/oa-portal/partsManagement/useInfoExport`,
            method: 'post',
            data,
            responseType: 'blob',
        })
    }
    //领用信息删除
    static useInfoDelete(ids) {
        return request({
            url: `/api/oa-portal/partsManagement/useInfoDelete?ids=${ids}`,
            method: 'get',
        })
    }
    //归还信息列表
    static returnList(data) {
        return request({
            url: `/api/oa-portal/partsManagement/returnList`,
            method: 'post',
            data
        })
    }
    //归还信息新增
    static returnSave() {
        return request({
            url: `/api/oa-portal/partsManagement/returnSave`,
            method: 'get',
        })
    }
    //归还信息导出
    static returnExport(data) {
        return request({
            url: `/api/oa-portal/partsManagement/returnExport`,
            method: 'post',
            responseType: 'blob',
            data
        })
    }
    //归还信息导出
    static returnDelete(ids) {
        return request({
            url: `/api/oa-portal/partsManagement/returnDelete?ids=${ids}`,
            method: 'get',
        })
    }
    //报废信息列表
    static scrapList(data) {
        return request({
            url: `/api/oa-portal/partsManagement/scrapList`,
            method: 'post',
            data
        })
    }
    //报废信息新增
    static scrapSave() {
        return request({
            url: `/api/oa-portal/partsManagement/scrapSave`,
            method: 'get',
        })
    }
    //报废信息导出
    static scrapExport(data) {
        return request({
            url: `/api/oa-portal/partsManagement/scrapExport`,
            method: 'post',
            responseType: 'blob',
            data
        })
    }
    //报废信息删除
    static scrapDelete(ids) {
        return request({
            url: `/api/oa-portal/partsManagement/scrapDelete?ids=${ids}`,
            method: 'get',
        })
    }
    //deprecated 批量盘点
    static branchInventory(userId,ids){
        return request({
            url: `/api/oa-portal/partsManagement/branchInventory?ids=${ids}&userId=${userId}`,
            method: 'get',
        })
    }
    static getInventoryCheck(inventoryIds,partIds,userId){
      return request({
        url: `/api/oa-portal/partsManagement/batchInventoryCheck?inventoryIds=${inventoryIds}&partIds=${partIds}&userId=${userId}`,
        method: 'get',
      })
    }

    static exportInventorPart(data){
        return request({
            url: '/api/oa-portal/partsManagement/exportInventorPart',
            method: 'post',
            responseType: 'blob',
            data
          })
    }

    static exportInventorPartsTotal() {
      return request({
        url: `/api/oa-portal/partsManagement/exportInventorPartsTotal`,
        method: 'get',
      })
    }

  static exportTestPartInventoryInOutTimeTotal() {
    return request({
      url: `/api/oa-portal/partsManagement/getTestPartInventoryInOutTimeTotal`,
      method: 'get',
    })
  }
}
