<template>
    <div>
        <div v-for="item in list" class="pb20 ">
            <el-card shadow="always">
                <div class="row-card">
                    <div>
                        <div class="title"  @click="toDetail(item.id)">
                            {{ item.conferenceName }}
                        </div>
                        <div class="text-desc">
                            <span>{{ item.startTime }} - {{ item.endTime }}</span>
                            <span class="pl10">{{ item.room }}</span>
                            <span class="pl10">{{ getMeetingType(item) }}</span>
                        </div>
                    </div>
                    <div class="button-right">
                        <slot name="myButton" :row="item"></slot>
                    </div>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        list: {
            type: Array,
            default: []
        }
    },
    data() {
        return {

        }
    },
    methods: {

        toDetail(id) {
            this.$emit('toDetail', 'add', id, 'isDetail')
        },
        getMeetingType(item) {
            let obj = {
                0: "外审",
                1: "总经理办公会议",
                2: '公司会议',
                3: "部门会议",
                4: "外部会议",
                5: "教学培训",
                6: "招聘面试"
            }
            return obj[item.conferenceType]
        }
    }
}
</script>

<style>
.title {
    color: #000;
    font-weight: 500;
}

.text-desc {
    color: #676767;
}
</style>