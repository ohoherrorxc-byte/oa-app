<template>
    <div class="">
        <div>
            <div class="title-to mb10" @click="foldToMe=!foldToMe">
                <i v-if="foldToMe" class="el-icon-arrow-down pr5"></i>
                <i v-else class="el-icon-arrow-up pr5"></i>
                <span>To Me</span>
            </div>
            <subScheduleCard v-show="!foldToMe" listType="toMe"></subScheduleCard>
            <div class="title-from mb10"  @click="foleFromMe=!foleFromMe">
                <i v-if="foleFromMe" class="el-icon-arrow-down pr5"></i>
                <i v-else class="el-icon-arrow-up pr5"></i>
                <span>From Me</span>
            </div>
            <subScheduleCard v-show="!foleFromMe" listType="fromMe"></subScheduleCard>
        </div>
    </div>
</template>

<script>
import subScheduleCard from './subScheduleCard'
export default {
    components: { subScheduleCard },
    data() {
        return {
            foldToMe: false,
            foleFromMe: false,
            list: [ ]
        }
    },
    methods: {

    }
}
</script>

<style class="scss">
.isEmpty {
    width: 60%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.font20 {
    font-size: 20px;
}
.title-to{
    background-color: #f0f9eb;
    color: #67C23A;
    font-size: 14px;
    padding: 15px 30px;
}
.title-from{
    background-color: #fdf6ec;
    color: #E6A23C;
    font-size: 14px;
    padding: 15px 30px;
}
</style>