<template>
    <basic-container>
        <el-tabs v-model="activeName" @tab-click="handleClick" >
            <el-tab-pane :label="$t('addressBook.allPersonnel')" name="first">
                <el-row>
                    <el-col :span="5">
                        <addressTree :deepPerson="false"  @getList="getList"></addressTree>
                    </el-col>
                    <el-col :span="18" class="ml10">
                        <list ref="listRef" directSuperiorId="" departmentId=""></list>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane :label="$t('addressBook.sameDepartment')" name="second">
                <list ref="listRef1" directSuperiorId="" :departmentId="userInfo.dept_id"></list>
            </el-tab-pane>
            <el-tab-pane :label="$t('addressBook.mySubordinates')" name="third">
                <list ref="listRef2" departmentId="" :directSuperiorId="userInfo.user_id"></list>
            </el-tab-pane>
        </el-tabs>
    </basic-container>
</template>

<script>
import addressTree from '@/components/addressTree/index'
import list from './components/list.vue'
import { mapGetters } from 'vuex'
export default {
    components: { addressTree, list },
    data() {
        return {
            activeName: 'first'
        }
    },
    computed: {
        ...mapGetters(["userInfo"]),
    },
    mounted(){
        this.getList()
    },
    methods: {
        getList(id) {
          
            this.$refs.listRef.getList(id,'reset')
        },
        handleClick(){
            if(this.activeName==='first'){
                this.$refs.listRef.getList()
            }else if(this.activeName==='second'){
                this.$refs.listRef1.getList()
            }else if(this.activeName==='third'){
                this.$refs.listRef2.getList()
            }
           
        }
    }
}
</script>