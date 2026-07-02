import {getToken} from '@/util/auth';
import website from '@/config/website';
import Vue from 'vue'

export function generateFormReqHeader(rule) {
    // 兜底：flow/index.vue 的两处调用都把后端字段直接传进来（可能 undefined / 字符串 / 对象数组），
    // 一旦不是数组就 throw 会把整个流程页炸白。这里兼容三种合理输入：
    //   1) undefined / null → 返回空数组（表单为空但页面仍渲染）
    //   2) 已经是数组 → 走原逻辑
    //   3) JSON 字符串 → 解析后判断
    let tmpRule = []
    if (Array.isArray(rule)) {
        tmpRule = [...rule]
    } else if (typeof rule === 'string' && rule.trim()) {
        try {
            const parsed = JSON.parse(rule)
            if (Array.isArray(parsed)) tmpRule = parsed
        } catch (e) {
            console.warn('[form-auth] rule 字段不是合法 JSON，按空表单处理:', rule)
        }
    } else if (rule && Array.isArray(rule)) {
        tmpRule = [...rule]
    } else {
        console.warn('[form-auth] rule 字段不是数组（可能是 formCreate.parseJson 已返回 undefined），按空表单处理')
    }

    tmpRule.forEach((item) => {
        if (!item || typeof item !== 'object') return
        if(item.type==='upload'){
            //上传类型设置默认值
            if(!item.props || !item.props.uploadType){
                item.props = item.props || {}
                Vue.set(item.props,'uploadType','image')
            }
            Vue.set(item.props,'headers',{'Blade-Auth': `bearer ${getToken()}`,'Authorization':`Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`})
            item.props.onSuccess = (res, file)=>{
                file.url = res.data.link
                console.log(arguments)
            }
        }else if(item.effect&&item.effect.fetch){
            item.effect.fetch.headers['Blade-Auth'] = `bearer ${getToken()}`
            item.effect.fetch.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
        }
    })
    return tmpRule
}