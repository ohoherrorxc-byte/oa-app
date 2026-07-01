/*
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-03-27 09:54:21
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-10-08 14:43:35
 * @FilePath: \icarx-ui\src\api\contract\bomMaint.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import request from '@/router/axios';

export const selectPage = (current, size, params) => {
  return request({
    url: '/api/oa-portal/bomMaint/selectPage',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

export const selectList = (params) => {
  return request({
    url: '/api/oa-portal/bomMaint/selectList',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const delBom = (param) => {
  return request({
    url: '/api/oa-portal/bomMaint/delete',
    method: 'get',
    params: {
      ids:param
    }
  })
}

export const saveOrUpdateBom = (params) => {
  return request({
    url: '/api/oa-portal/bomMaint/saveOrUpdate',
    method: 'post',
    data: {
      ...params,
    }
  })
}

export const BomDetail = (param) => {
  return request({
    url: '/api/oa-portal/bomMaint/detail',
    method: 'get',
    params: {
      id:param
    }
  })
}

export const getOptions = (params) => {
  return request({
    url: '/api/oa-system/dict/dictionary',
    method: 'get',
    params: {
      ...params,
    }
  })
}

export const getCostBom = (params) => {
  return request({
    url: '/api/oa-portal/bomMaint/getTotalPartsMaintCost',
    method: 'post',
    data: {
      ...params,
    }
  })
}

// 创建人列表
export const userList = (tenantId) => {
  return request({
    url: '/api/oa-user/user-list',
    method: 'get',
    params: {
      tenantId
    }
  })
}

// 工程车VIN明细
export const getVinByBomId = (params) => {
  return request({
    url: '/api/oa-portal/bomMaint/getVinByBomId',
    method: 'get',
    params
  })
}
// 根据bomId获取工程车列表
export const getEngineVehicleVinByBomId = (params) => {
  return request({
    url: '/api/oa-portal/engineVehicleVin/getEngineVehicleVinByBomId',
    method: 'get',
    params
  })
}
// 工程车新增
export const engineVehicleVinSave = (params) => {
  return request({
    url: '/api/oa-portal/engineVehicleVin/save',
    method: 'post',
    data:params
  })
}
// 工程车删除
export const engineVehicleVinDelete = (params) => {
  return request({
    url: '/api/oa-portal/engineVehicleVin/delete',
    method: 'get',
    params
  })
}
// 工程车新增
export const refreshLicenseNum = (params) => {
  return request({
    url: '/api/oa-portal/bomMaint/refreshLicenseNum',
    method: 'get',
    params
  })
}
export const getUnitPriceById = (params) => {
  return request({
    url: '/api/oa-portal/partsMaint/getUnitPriceById',
    method: 'get',
    params
  })
}
// 出货量新增/编辑
export const saveOrUpdate = (data) => {
  return request({
    url: '/api/oa-portal/hardwareShipment/saveOrUpdate',
    method: 'post',
    data
  })
}
// 出货量列表
export const hardwareShipmentSelectList = (params) => {
  return request({
    url: '/api/oa-portal/hardwareShipment/selectList',
    method: 'get',
    params
  })
}

export const exportList = () => {
  return request({
    url: '/api/oa-portal/bomMaint/export',
    method: 'get',
    responseType: 'blob'
  })
}

export const getBlongPartsLog = (bomId) => {
  return request({
    url: `/api/oa-portal/bomMaint/getBlongPartsLog?bomId=${bomId}`,
    method: 'get',   
  })
}