<template>
  <basic-container>

    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="收款订单号：">
          <el-input v-model.trim="query.orderIdTbox" size="mini" clearable/>
        </el-form-item>

        <el-form-item label="收款状态：">
          <el-select v-model="query.statusTbox" style="width: 90%" placeholder="请选择" clearable>
            <el-option v-for="item in collectionStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="国家地区：">
          <el-select v-model="query.countryReginCode"  @change="changeValue($event)" placeholder="请选择" style="width: 90%" clearable>
            <el-option v-for="item in countryCodes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="searchChange" size="mini" icon="el-icon-search">查询</el-button>
          <el-button type="primary" v-on:click="createOrder" size="mini" icon="el-icon-plus">创建开票订单</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
<!--            <el-button type="primary"  icon="el-icon-circle-export-outline" size="mini" v-on:click="handleExport">导出-->
<!--            </el-button>-->
          </div>
        </el-col>
      </el-row>

      <!-- table 列表 -->
      <el-row>
        <el-table border :data="data" @selection-change="selectChange" style="width: 100%">
          <el-table-column prop="orderIdTbox" align="center" label="收款订单号" width="180">
          </el-table-column>
          <el-table-column prop="countryReginCode" align="center" label="国家地区" v-bind:formatter="countryCodesFormat">
          </el-table-column>
          <el-table-column prop="statusTbox" align="center" label="收款状态" v-bind:formatter="formatterData">
          </el-table-column>
          <el-table-column prop="tboxNum" align="center" label="TBOX数量" width="90">
          </el-table-column>
          <el-table-column prop="voiceNum" align="center" label="语音已统计数" width="100">
          </el-table-column>
          <el-table-column prop="weatherNum" align="center" label="天气已统计数" width="100">
          </el-table-column>
          <el-table-column prop="mapNum" align="center" label="地图已统计数" width="100">
          </el-table-column>
          <el-table-column prop="mapdataNum" align="center" label="图资已统计数" width="100">
          </el-table-column>
          <el-table-column align="center" label="操作" width="230">
            <template slot-scope="scope">
              <el-link :underline="false" @click="orderDetail(scope.row)" style="width: 70px">订单详情 </el-link>
              <el-link :underline="false" @click="vinDetail(scope.row)" style="width: 70px">VIN列表 </el-link>
              <el-link :underline="false" @click="payMentDetail(scope.row)" style="width: 70px">收付款详情 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
<!--      <el-row>-->
<!--        <el-col :span="24">-->
<!--          <div class="tool-box">-->
<!--           <p style="color: red;" v-show="isShow"> * {{ promptWords }} 车型存在多个预设供应商，请确认查询结果是否正确 </p>-->
<!--          </div>-->
<!--        </el-col>-->
<!--      </el-row>-->

      <!-- 分页 -->
      <el-row>
        <el-pagination
          background
          :page-sizes="[10, 20, 30, 50]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange"
          :total="page.total">
        </el-pagination>
      </el-row>
    </el-card>

  </basic-container>
</template>

<script>
    import {getList} from "@/api/saic/tboxOrder.js" ;
    import {mapGetters} from "vuex";
    import SeriesModel from "@/views/saic/series-model";
    import constData from "@/config/constData";
    import {findByvalue} from "@/util/util";

    export default {
        components: {SeriesModel},
        data() {
            return {
                // 列表查询数据
                query: {
                    orderIdTbox: '',
                    statusTbox:'',
                    countryReginCode:''
                },
                seriesModel: "EH32-X1 51 STD",
                loading: true,
                //table中数据
                data: [],
                multiSelection: [],
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0
                },
                //收款状态
                collectionStatuss:constData.orderStatus,
                countryCodes:[
                    // {
                    //     name: '全部',
                    //     value: ''
                    // },
                    // {
                    //     name: '欧盟',
                    //     value: '3G02'
                    // },
                    // {
                    //     name: '英国',
                    //     value: '3G08'
                    // },
                    // {
                    //     name: '泰国',
                    //     value: '3G05'
                    // },
                    // {
                    //     name: '印度',
                    //     value: '3G07'
                    // },
                    // {
                    //     name: '印尼',
                    //     value: '3G16'
                    // },
                    // {
                    //     name: '澳洲设计标准',
                    //     value: '3F02'
                    // }
                ],
                licenseSupplier: 2,
                voiceOptions:[],
                needStatisticsDialogVisible:false,
                promptWords:'',
                // isShow:false,
                regionCode: ""
            }
        },
        created() {
            // this.onLoad(this.page,this.query);
            // this.getVoiceOptions();
           this.countryCodes = constData.countryList ;
        },
        computed: {
            ...mapGetters(["userInfo", "permission"]),
            ids() {
                let ids = [];
                this.multiSelection.forEach(ele => {
                    ids.push(ele.id);
                });
                return ids.join(",");
            },
        },
        methods: {
            onLoad(page ,params={}) {
                this.loading = true;
                // this.isShow = false;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    // debugger
                    this.data = res.data.data.records;
                    for (let i in this.data) {
                        if(this.data[i].prompt != '' && this.data[i].prompt != null){
                            let tempPromp = '';
                            for (let j=0; j <this.data[i].prompt.length; j++) {
                                tempPromp += `${this.data[i].prompt[j]}\/`;
                            }
                            // this.isShow = true;
                            this.promptWords = tempPromp.substring(0,tempPromp.length-1);
                            break;
                        }
                    }
                    this.page.total = res.data.data.total;
                });
                this.loading = false;
            },
            changeValue(value){
                // debugger
                this.regionCode = value;
            },
            searchChange() {
                // debugger
                // if((this.query.countryReginCode == null || this.query.countryReginCode.length ==0)
                //     && (this.query.vin == null || this.query.vin.length == 0)
                //     && (this.query.orderIdVoice == null || this.query.orderIdVoice.length == 0)){
                //     this.$message({type: "warning", message: '国家地区 / VIN / 付款订单号 必须选择其中一项'});
                //     return;
                // }
                this.page.currentPage = 1;
                this.onLoad(this.page, this.query);
            },

            createOrder(){
                // debugger
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: '创建开票订单',
                        src: '/saic/license-order-add'
                    }, ''),
                    query: ''
                })
            },

            selectChange(val) {
                this.multiSelection = val;
            },
            currentChange(currentPage) {
                this.page.currentPage = currentPage;
                this.onLoad(this.page, this.query);
            },
            sizeChange(pageSize) {
                this.page.pageSize = pageSize;
                this.onLoad(this.page, this.query);
            },
            countryCodesFormat(row,column) {
                const daterc = row[column.property];
                if(daterc) {
                    // if(daterc == '3G02'){
                    //     return "欧盟";
                    // }else if(daterc == '3F02'){
                    //     return "英国";
                    // }else if(daterc == '3G05'){
                    //     return "泰国";
                    // }else if(daterc == '3G07'){
                    //     return "印度";
                    // }else if(daterc == '3G16'){
                    //     return "印尼";
                    // }else if(daterc == '3G08'){
                    //     return "澳洲设计标准";
                    // }
                    for(let i=0;i<this.countryCodes.length;i++){
                        if(daterc == this.countryCodes[i].value){
                            return this.countryCodes[i].label;
                        }
                    }
                }
            },
            formatterData(row,column) {
                const daterc = row[column.property];
                return findByvalue(constData.orderStatus, parseInt(daterc));
            },
            orderDetail(row){
                // debugger
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: 'TBOX订单详情',
                        src: '/saic/license-order-detail'
                    }, ''),
                    query: {
                        orderIdTbox: row.orderIdTbox
                        // ,countryReginCode: row.countryReginCode,
                        // statusTbox:row.statusTbox
                    }
                })
            },
            vinDetail(row){
                debugger
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: 'TBOX订单查询',
                        src: '/saic/license'
                    }, ''),
                    query: {
                        orderIdTbox: row.orderIdTbox
                        // countryReginCode: row.countryReginCode,
                        // statusTbox:row.statusTbox
                    }
                })
            },
            payMentDetail(row){
                debugger
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: 'TBOX订单对各供应商付款明细',
                        src: '/saic/tboxpaidList'
                    }, ''),
                    query: {
                        orderIdTbox: row.orderIdTbox
                        // countryReginCode: row.countryReginCode,
                        // statusTbox:(row.statusTbox).toString()
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
  .el-pagination {
    position: relative;
    text-align: right;
    padding: 25px 0 20px 20px;
  }
  .el-form .el-select{
    width: 100%;
  }
</style>
