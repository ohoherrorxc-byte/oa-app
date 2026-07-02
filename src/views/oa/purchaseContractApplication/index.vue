<template>
    <div>
        <suspense>
            <flow approvalName="一般通用采购合同评审" :detailId="businessId" :processInstanceId="processInstanceId" componentTag="purchaseContractApplication" :showBaseInfo="false" :showOtherInfo="false"></flow>
            <template #fallback>
                <flow-skeleton />
            </template>
        </suspense>
    </div>
</template>

<script>
// 异步加载 flow：第一次进入下载共享 flow chunk（webpackChunkName 固定为 "flow"），
// 后续所有 flow 页面命中浏览器缓存秒进；加载期间显示 skeleton 占位
import FlowSkeleton from '@/components/flow/FlowSkeleton'
export default {
    components: {
        flow: () => import(/* webpackChunkName: "flow" */ '@/components/flow/index'),
        FlowSkeleton
    },
    data() {
        return {
            processInstanceId: "",
        }
    },
    mounted() {
        this.processInstanceId = this.$route.query.processInstanceId
        this.businessId = this.$route.query.businessId
    },
    methods:{
    }
}
</script>
