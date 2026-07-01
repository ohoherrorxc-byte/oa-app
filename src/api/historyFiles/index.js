import request from '@/router/axios';

export default class HistoryFilesApi {
  static getOldFile(approvalCode) {
    return request({
      url: `/api/oa-portal/oldFile/getOldFile?approvalCode=${approvalCode}`,
      method: 'get',
    })
  }
}