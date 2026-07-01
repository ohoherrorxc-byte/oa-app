import request from '@/router/axios';

export default class OtherApi {
    static addressList() {
        return request({
            url: '/api/oa-user/dict/addressList',
            method: 'post'
        })
    }

    static addressAdd(data) {
        return request({
            url: '/api/oa-user/dict/addressAdd',
            method: 'post',
            data
        })
    }

    static addressUpdate(data) {
        return request({
            url: '/api/oa-user/dict/addressUpdate',
            method: 'post',
            data
        })
    }
    static addressDelete(data) {
        return request({
            url: '/api/oa-user/dict/addressDelete',
            method: 'post',
            data
        })
    }
    static educationList() {
        return request({
            url: '/api/oa-user/dict/educationList',
            method: 'post',
        })
    }
    static educationAdd(data) {
        return request({
            url: '/api/oa-user/dict/educationAdd',
            method: 'post',
            data
        })
    }
    static educationUpdate(data) {
        return request({
            url: '/api/oa-user/dict/educationUpdate',
            method: 'post',
            data
        })
    }
    static educationDelete(data) {
        return request({
            url: '/api/oa-user/dict/educationDelete',
            method: 'post',
            data
        })
    }
    static fieldList() {
        return request({
            url: '/api/oa-user/dict/fieldList',
            method: 'post',
        })
    }
    static fieldAdd(data) {
        return request({
            url: '/api/oa-user/dict/fieldAdd',
            method: 'post',
            data
        })
    }
    static fieldUpdate(data) {
        return request({
            url: '/api/oa-user/dict/fieldUpdate',
            method: 'post',
            data
        })
    }
    static titleList() {
        return request({
            url: '/api/oa-user/dict/titleList',
            method: 'post',
        })
    }
    static titleAdd(data) {
        return request({
            url: '/api/oa-user/dict/titleAdd',
            method: 'post',
            data
        })
    }
    static titleUpdate(data) {
        return request({
            url: '/api//oa-user/dict/titleUpdate',
            method: 'post',
            data
        })
    }
}