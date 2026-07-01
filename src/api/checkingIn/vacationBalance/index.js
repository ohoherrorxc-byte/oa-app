import request from '@/router/axios';

export default class VacationBalanceApi {
    static selectYearHolidayPage(params) {
        return request({
            url: `/api/oa-portal/holiday/selectYearHolidayPage`,
            method: 'get',
            params
        })
    }
    static selectCompensatoryLeavePage(params){
        return request({
            url: `/api/oa-portal/holiday/selectCompensatoryLeavePage`,
            method: 'get',
            params
        })
    }
    static batchUpdateYearHoliday(data){
        return request({
            url: `/api/oa-portal/holiday/batchUpdateYearHoliday`,
            method: 'post',
            data
        })
    }

    static batchUpdateCompensatoryLeave(data){
        return request({
            url: `/api/oa-portal/holiday/batchUpdateCompensatoryLeave`,
            method: 'post',
            data
        })
    }

    static exportYearHoliday(year){
        return request({
            url: `/api/oa-portal/holiday/exportYearHoliday?year=${year}`,
            method: 'get',
            responseType: 'blob'
        })
    }

    static exportCompensatoryLeave(year){
        return request({
            url: `/api/oa-portal/holiday/exportCompensatoryLeave?year=${year}`,
            method: 'get',
            responseType: 'blob'
        })
    }
  static selectChildrenHolidayPage(params) {
    return request({
      url: `/api/oa-portal/childrenHoliday/selectChildrenHolidayPage`,
      method: 'get',
      params
    })
  }
  static batchUpdateChildrenHoliday(data){
    return request({
      url: `/api/oa-portal/childrenHoliday/batchUpdateChildrenHoliday`,
      method: 'post',
      data
    })
  }
  static exportChildrenHoliday(){
    return request({
      url: `/api/oa-portal/childrenHoliday/exportChildrenHoliday`,
      method: 'get',
      responseType: 'blob'
    })
  }
}