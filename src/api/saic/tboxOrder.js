import request from '@/router/axios';

export const getList = (current, size, params) => {
  return request({
    url: '/api/oa-portal/tboxOrder/list',
    method: 'get',
    params: {
      ...params,
      current,
      size,
    }
  })
}

// export const getDetail = (id) => {
//   return request({
//     url: '/api/oa-portal/tboxOrder/detail',
//     method: 'get',
//     params: {
//       id
//     }
//   })
// }

// export const remove = (ids) => {
//   return request({
//     url: '/api/oa-portal/tboxOrder/remove',
//     method: 'post',
//     params: {
//       ids,
//     }
//   })
// }

// export const add = (row) => {
//   return request({
//     url: '/api/oa-portal/tboxOrder/submit',
//     method: 'post',
//     data: row
//   })
// }
//
// export const update = (row) => {
//   return request({
//     url: '/api/oa-portal/tboxOrder/submit',
//     method: 'post',
//     data: row
//   })
// }

// export const getVoiceSupplier = (licenseSupplier) => {
//   return request({
//     url: '/api/oa-portal/tboxOrder/getSupplier',
//     method: 'get',
//     params: {
//       licenseSupplier,
//     }
//   })
// }

// export const exportList = (current, size, params) => {
//   return request({
//     url: '/api/oa-portal/tboxOrder/export',
//     method: 'get',
//     params: {
//       ...params
//     },
//     responseType: 'blob'
//   })
// }
