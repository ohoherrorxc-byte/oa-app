<template>
    <div>
        <div v-for="item in list" class="">
            <div class="">
                <div class="main-title">
                    <div @click="updateFold(item)" class="font12">
                        <i v-if="item.fold" class="el-icon-arrow-down pr5"></i>
                        <i v-else class="el-icon-arrow-up pr5"></i>
                        <span>{{ item.tabulationName }}</span>
                    </div>
                    <el-dropdown v-if="!isToday&&item.tabulationId!==1">
                        <div class="el-icon-more"></div>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native="reName(item)">
                                <el-button type="text" class="text-edit" icon="el-icon-edit">重命名</el-button>
                            </el-dropdown-item>
                            <el-dropdown-item @click.native="deleteRow(item)">
                                <el-button type="text" class="text-delete" icon="el-icon-delete">删 除</el-button>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div v-for="subItem in item.scheduleList" :style="styleLine(subItem)" class="mb20 sub-item" v-if="!item.fold">
                    <div @click="toEdit(subItem)">
                        <div class="pb5 sub-title">
                            <span>{{ subItem.schedule }}</span>
                        </div>
                        <div class="text-desc" :style="[styleDelay(subItem)]">
                           <span> {{subItem.formatTimer}}</span>
                            <img class="ml10" v-if="subItem.remindTime" width="16" src="@/assets/svg/meeting/mention.svg" alt="">
                        </div>
                    </div>
                    <div class="button-row">
                        <svg  @click="changeChoose(subItem)" t="1695014481554" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6792" width="20" height="20"><path d="M820.113403 204.239638c-169.888272-169.918971-446.339558-169.918971-616.22783 0-169.921018 169.890318-169.921018 446.339558 0 616.22783 169.888272 169.921018 446.339558 169.921018 616.22783 0C990.035444 650.579195 990.035444 374.130979 820.113403 204.239638zM769.710456 398.811078 477.206566 710.212364c-1.832741 1.704828-3.759627 2.842745-5.183046 3.664459-1.579985 1.043772-2.685155 1.928932-4.297886 2.592035-3.697205 1.579985-7.614421 2.368954-11.722996 2.368954-3.76065 0-7.458879-0.694825-11.06194-2.085498l-3.476171-2.02103c-1.865487-0.980327-3.886517-2.023076-5.815449-3.729951l0-0.063445c-0.125867-0.094144-0.252757-0.220011-0.3776-0.346901l-0.980327-0.946558L268.257673 546.042327c-5.752004-5.626137-9.005095-13.20986-9.069563-21.268396-0.030699-8.119935 3.034103-15.737426 8.721639-21.519106 11.376095-11.502985 31.318286-11.598152 42.819225-0.252757l144.45195 142.30096 270.475178-287.952224c10.965749-11.661597 31.126928-12.294001 42.757826-1.359974 5.909593 5.593392 9.322319 13.115716 9.543354 21.23565C778.178315 385.285017 775.271102 392.96493 769.710456 398.811078z"
                             :fill="subItem.fillChoose" p-id="6793"></path></svg>
                        <svg  v-if="!isToday" @click="changeCollect(subItem)"  t="1695015485595" class="icon ml10" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5502" width="20" height="20"><path d="M335.008 916.629333c-35.914667 22.314667-82.88 10.773333-104.693333-25.557333a77.333333 77.333333 0 0 1-8.96-57.429333l46.485333-198.24a13.141333 13.141333 0 0 0-4.021333-12.864l-152.16-132.586667c-31.605333-27.52-35.253333-75.648-8.234667-107.733333a75.68 75.68 0 0 1 51.733333-26.752L354.848 339.2c4.352-0.362667 8.245333-3.232 10.026667-7.594667l76.938666-188.170666c16.032-39.2 60.618667-57.92 99.52-41.461334a76.309333 76.309333 0 0 1 40.832 41.461334l76.938667 188.16c1.781333 4.373333 5.674667 7.253333 10.026667 7.605333l199.712 16.277333c41.877333 3.413333 72.885333 40.458667 69.568 82.517334a76.938667 76.938667 0 0 1-26.08 51.978666l-152.16 132.586667c-3.541333 3.082667-5.141333 8.074667-4.021334 12.853333l46.485334 198.24c9.621333 41.013333-15.36 82.336-56.138667 92.224a75.285333 75.285333 0 0 1-57.525333-9.237333l-170.976-106.24a11.296 11.296 0 0 0-12.010667 0l-170.986667 106.24z" 
                            :fill="subItem.fillCollect" p-id="5503"></path></svg>
                            <!-- #FFC076 -->
                        <i v-else @click="addToday(subItem)" class="right-add el-icon-plus ml10"></i>
                    </div>
                </div>
            </div>
        </div>
        <addListDialog ref="addListDialog" @getList="getList" :row="row" title="修改列表名称"></addListDialog>
        <editSchedule @getList="getList" ref="editSchedule" :row="curScheduleRow"></editSchedule>
    </div>
</template>

<script>
import addListDialog from './addListDialog'
import editSchedule from './editSchedule'
import scheduleApi from '@/api/schedule/index'
import { yearMonthDayWeek } from '@/util/util'
export default {
    props: {
        isToday: {
            type: Boolean,
            default: false
        }
    },
    components: { addListDialog, editSchedule },
    data() {
        return {
            list: [
            ],
            row: {},
            curScheduleRow: null,
            isChoose: false,
            collectImg: require('@/assets/svg/schedule/no_collect.svg')
        }
    },
    mounted(){
        this.getList()
    },
    methods: {
        //获取行程接口
       async getList() {
        console.log('触发')
            let obj = {
                todayStatus:null,
                scheduleStatus:null,
                scheduleType:null
            } 
            let Api = this.isToday ? scheduleApi.suggestGroupList:scheduleApi.scheduleGroupList
            let res = await Api(obj)
            if(res.data.code===0){     
                this.list = res.data.data
                this.initList()
            }     
        },
        initList(){
            this.list.map(ele=>{
                this.$set(ele,'fold',false)
                ele.scheduleList&&ele.scheduleList.map(subEle=>{
                    let tempColor = subEle.scheduleStatus ?"#5E91DE":"#E9E9E9"
                    this.$set(subEle,'fillChoose',tempColor)
                    let tempCollect = subEle.importantStatus ?"#FFC076":"#E9E9E9"
                    this.$set(subEle,'fillCollect',tempCollect)
                    this.$set(subEle,'formatTimer',yearMonthDayWeek(subEle.endTime))
                    let isDelay = new Date(subEle.endTime) < new Date()
                    this.$set(subEle, 'isDelay', isDelay)
                })
            })
        },
        styleLine(item){
            return {
                'text-decoration':item.scheduleStatus ?'line-through':''
            }
        },
        styleDelay(item){
            return {
                color:item.isDelay?'#a80000':''
            }
        },
        updateFold(item) {
            this.list.map(ele => {
                if (ele === item) {
                    ele.fold = !ele.fold
                }
            })
       
        },
        updateFinishStatus() { },
        deleteRow(item) {
            this.$confirm('此操作将永久删除该列表, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                let res = await scheduleApi.deleteTabulation(item.tabulationId)
                console.log(res)
                if (res.data.code === 0) {
                    this.$message.success('列表已删除')
                    this.getList()
                }
            }).catch(() => {
                console.log('quxiao')
            });
        },
        reName(item) {
            this.row = item
            this.$refs.addListDialog.dialogVisibleAddList = true
        },
      async changeCollect(subItem) {
          let obj = {
            id:subItem.id,                   
            importantStatus:subItem.importantStatus?0:1          
          }
          let res = await scheduleApi.importantSchedule(obj)
          if(res.data.code===0){
            this.getList()
          }
        },      
       async changeChoose(subItem) {
        let obj = {
            id:subItem.id,                   
            scheduleStatus:subItem.scheduleStatus?0:1          
          }
          let res = await scheduleApi.updateFinishStatus(obj)
          if(res.data.code===0){
            this.getList()
          }
        },
        async addToday(item) {
            let obj = {
                id:item.id,
                todayStatus:1
            }        
            let res =await scheduleApi.todaySchedule(obj)
            if(res.data.code===0){
                this.getList()
                this.$emit('addItemToday', item)
            }         
        },
        toEdit(subItem) {
            if (this.isToday) {
                return
            } 
            this.curScheduleRow = subItem
            console.log(this.curScheduleRow)
            this.$refs.editSchedule.drawer = true
        },

    }
}
</script>

<style>
.title {
    color: #000;
    font-weight: 500;
}

.font12 {
    font-size: 12px;
}

.main-title {
    background-color: rgba(229, 239, 255, 1);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(57, 93, 148, 1);
    padding: 6px;
    margin-bottom: 13px;
}

.right-add {
    color: #6294DF
}

.sub-title {
    font-weight: 600;
}

.sub-item {
    border-radius: 13px 13px 13px 13px;
    border: 1px solid #9E9E9E;
    padding: 12px 20px;
    display: flex;
    align-items: center;
}

.button-row {
    display: flex;
    margin-left: auto;
    align-items: center;
}

.text-desc {
    color: rgba(158, 158, 158, 1);
    display: flex;
    align-items: center;
}

.chooseImg {
    widows: 20px;
    height: 20px;
}

.text-delete {
    color: #FF0000;
}

.text-edit {
    color: #407CD7;
}</style>