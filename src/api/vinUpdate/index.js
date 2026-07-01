import request from '@/router/axios';

export default class vinUpdateApi {
    static selectLicenseList(data) {
        return request({
            url: '/api/oa-portal/licenseChangeVin/selectLicenseList',
            method: 'post',
            data
        })
    }
    static importVinList(row) {
        return request({
            url: '/api/oa-portal/licenseChangeVin/selectLicenseList',
            method: 'post',
            data
        })
    }
    static exportRow(id) {
        return request({
            url: `/api/oa-portal/licenseChangeVin/export?id=${id}`,
            method: 'get',
            responseType: 'blob'
        })
    }
}