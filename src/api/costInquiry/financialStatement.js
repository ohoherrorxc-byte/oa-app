import request from '@/router/axios';

export default class CostInquiryApi {
    static getCostList() {
        return request({
            url: '/api/oa-portal/costCenter/list',
            method: 'get',
        })
    }
    static getList(data) {
        return request({
            url: '/api/oa-portal/flowTable/getFlowWithMoney',
            method: 'post',
            data
        })
    }
    static exportReport(data) {
        return request({
            url: '/api/oa-portal/flowTable/flowWithMoneyExport',
            method: 'get',
            responseType: 'blob',
            // data
        })
    }
    static exportReportDetail(data) {
        return request({
            url: '/api/oa-portal/flowTable/flowWithCodeExport',
            method: 'get',
            responseType: 'blob',
            // data
        })
    }
} 