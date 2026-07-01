import request from '@/router/axios';

export default class PayrollManagementApi {
    //年度职工工资性收入管理数据删除
    static annualWorkerSalaryDelete(ids) {
        return request({
            url: `/api/oa-portal/salary/annualWorkerSalaryDelete?ids=${ids}`,
            method: 'get',     
        })
    }
    //年度职工工资性收入详情
    static annualWorkerSalaryDetail(id) {
        return request({
            url: `/api/oa-portal/salary/annualWorkerSalaryDetail?id=${id}`,
            method: 'get',

        })
    }
    //年度职工工资性收入列表
    static annualWorkerSalaryPage(data) {
        return request({
            url: '/api/oa-portal/salary/annualWorkerSalaryPage',
            method: 'post',
            data
        })
    }
    //年度职工工资性收入编辑
    static annualWorkerSalaryUpdate(data) {
        return request({
            url: '/api/oa-portal/salary/annualWorkerSalaryUpdate',
            method: 'post',
            data
        })
    }
    //年度职工工资性收入管理页面模板导出
    static exportAnnualWorkerSalary() {
        return request({
            url: '/api/oa-portal/salary/exportAnnualWorkerSalary',
            method: 'get',
            responseType: 'blob'
        })
    }
    //工资管理页面模板导出
    static exportSalaryTemplate() {
        return request({
            url: '/api/oa-portal/salary/exportSalaryTemplate',
            method: 'get',
            responseType: 'blob'
        })
    }
    //年终奖页面模板导出
    static exportYearEndBonusTemplate() {
        return request({
            url: '/api/oa-portal/salary/exportYearEndBonusTemplate',
            method: 'get',
            responseType: 'blob'
        })
    }
    //年度职工工资性收入管理页面导入
    static importAnnualWorkerSalary(data) {
        return request({
            url: '/api/oa-portal/salary/importAnnualWorkerSalary',
            method: 'post',
            data
        })
    }
    //工资管理页面导入
    static importSalary(data) {
        return request({
            url: '/api/oa-portal/salary/importSalary',
            method: 'post',
            data
        })
    }
    //年终奖管理页面导入
    static importYearEndBonus(data) {
        return request({
            url: '/api/oa-portal/salary/importYearEndBonus',
            method: 'post',
            data
        })
    }
    //工资管理数据删除
    static salaryInfoDelete(ids) {
        return request({
            url: `/api/oa-portal/salary/salaryInfoDelete?ids=${ids}`,
            method: 'get',

        })
    }
    //工资详情
    static salaryInfoDetail(id) {
        return request({
            url: `/api/oa-portal/salary/salaryInfoDetail?id=${id}`,
            method: 'get',

        })
    }
    //工资列表
    static salaryInfoPage(data) {
        return request({
            url: '/api/oa-portal/salary/salaryInfoPage',
            method: 'post',
            data
        })
    }
    //工资编辑
    static salaryInfoUpdate(data) {
        return request({
            url: '/api/oa-portal/salary/salaryInfoUpdate',
            method: 'post',
            data
        })
    }
    //年终奖详情
    static yearEndBonusDetail(id) {
        return request({
            url: `/api/oa-portal/salary/yearEndBonusDetail?id=${id}`,
            method: 'get',
        })
    }
    //年终奖管理数据删除
    static yearEndBonusInfoDelete(ids) {
        return request({
            url: `/api/oa-portal/salary/yearEndBonusInfoDelete?ids=${ids}`,
            method: 'get',
        })
    }
    //年终奖列表
    static yearEndBonusPage(data) {
        return request({
            url: '/api/oa-portal/salary/yearEndBonusPage',
            method: 'post',
            data
        })
    }
    //年终奖编辑
    static yearEndBonusUpdate(data) {
        return request({
            url: '/api/oa-portal/salary/yearEndBonusUpdate',
            method: 'post',
            data
        })
    }
}