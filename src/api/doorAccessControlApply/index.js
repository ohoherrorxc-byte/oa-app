import request from '@/router/axios';


/**
 * 获取门禁权限申请单详情
 * @param {string} businessId - 业务 ID（必填）
 * @returns {Promise} - 请求 Promise 实例
 */
export const getDetail = (businessId) => {
  return request({
    url: '/api/oa-flow/doorAccessControl/detail',
    method: 'get',
    params: { businessId },
  }).catch((error) => {
    console.error('获取门禁权限申请单详情失败：', error);
    throw error; // 重新抛出错误，让调用方处理
  });
};

/**
 * 获取门禁列表数据的请求函数（无需参数）
 * @returns {Promise} - 返回一个 Promise，resolve 时得到后端响应数据，reject 时包含错误信息
 */
export const getDoorList = (params, code) => {
  return request({
    url: '/api/oa-flow/doorAccessControl/doorList',
    method: 'get',
    params: {
      ...params,
      code,
    }
  }).catch((error) => {
    console.error('获取门禁列表失败：', error);
    throw error; // 重新抛出错误，让调用方处理
  });
};





