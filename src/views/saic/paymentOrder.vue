<template>
  <basic-container>

    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
        <el-form-item label="付款订单号：">
          <el-input v-model.trim="query.orderNumber" size="mini"/>
        </el-form-item>

        <el-form-item label="付款状态：">
          <el-select v-model="query.orderStatus" style="width: 90%" clearable>
            <el-option v-for="item in paymentStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="国家地区：">
          <el-select v-model="query.countryReginCode" placeholder="请选择" style="width: 90%" clearable>
            <el-option v-for="item in countryCodes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商类型:">
          <el-select v-model="query.orderType" @change="changeSupplyValue($event)" v-bind:disabled="editable" placeholder="请选择"
                     style="width: 100%">
            <el-option
              v-for="item in supplierTypeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="供应商名称:" >
          <el-select v-model="query.supplierName" placeholder="请选择" v-bind:disabled="editable" style="width: 100%" clearable>
            <el-option
              v-for="item in supplierNames"
              :key="item.value"
              :label="item.supplierName"
              :value="item.supplierName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" v-on:click="searchChange" size="mini" icon="el-icon-search">查询</el-button>
          <el-button type="primary" v-on:click="createOrder" size="mini" icon="el-icon-plus">创建付款订单</el-button>
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
          <el-table-column prop="orderNumber" align="center" label="付款订单号" width="180">
          </el-table-column>
          <el-table-column prop="orderType" align="center" label="供应商类型" width="110" v-bind:formatter="supplierTypeFormatterData">
          </el-table-column>
          <el-table-column prop="supplierName" align="center" label="供应商" width="90">
          </el-table-column>
          <el-table-column prop="countryReginCode" align="center" label="国家地区" v-bind:formatter="countryCodesFormat">
          </el-table-column>
          <el-table-column prop="orderStatus" align="center" label="付款状态" v-bind:formatter="formatterData">
          </el-table-column>
          <el-table-column align="center" label="操作" width="230">
            <template slot-scope="scope">
              <el-link :underline="false" @click="orderDetail(scope.row)" style="width: 70px">订单详情 </el-link>
              <el-link :underline="false" @click="vinDetail(scope.row)" style="width: 70px">VIN列表 </el-link>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <!-- 分页 -->
      <el-row>
        <el-pagination
          background
          :key="page.elementuiKey"
          :current-page.sync="page.currentPage"
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
    import {getList,getSupplier} from "@/api/saic/paymentOrder.js" ;
    import {mapGetters} from "vuex";
    import constData from "@/config/constData";
    import {findByvalue} from "@/util/util";

    export default {
        // components: {SeriesModel},
        data() {
            return {
                // 列表查询数据
                query: {
                    orderNumber: '',
                    orderStatus:'',
                    countryReginCode:'',
                    orderType:'',
                    supplierName:''
                },
                loading: true,
                //table中数据
                data: [],
                multiSelection: [],
                supplierNames:[],
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,
                    elementuiKey: 0
                },
                //付款状态
                paymentStatuss: constData.billStatus,
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
                supplierTypeOptions: [
                    {
                        name: '全部',
                        value: ''
                    },
                    {
                        name: '天气',
                        value: 1
                    },
                    {
                        name: '语音',
                        value: 2
                    },
                    {
                        name: '地图导航',
                        value: 3
                    },
                    {
                      name: '地图图资',
                      value: 4
                    }
                ],
                licenseSupplier: 2
                // promptWords:'',
            }
        },
        created() {
            this.countryCodes = constData.countryList ;
            // this.onLoad(this.page,this.query);
            // this.getVoiceOptions();
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
                    this.page.total = res.data.data.total;
                });
                this.loading = false;
            },
            searchChange() {
                // debugger
                this.page.currentPage = 1;
                this.page.elementuiKey= 1;
                this.onLoad(this.page, this.query);
            },
            changeSupplyValue(obj) {
                this.query.supplierId={}
                this.supplierNames = [];
                this.query.supplierName='';
                debugger
                getSupplier(obj).then(res => {
                    let obj = res.data.data;
                    for (let j = 0; j < obj.length; j++) {
                        this.supplierNames.push(obj[j]);
                    }
                });
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
            supplierTypeFormatterData(row,column) {
                const daterc = row[column.property];
                if(daterc === 1) {
                    return '天气';
                }else if(daterc === 2){
                    return "语音";
                } else if(daterc === 3){
                    return '地图导航';
                } else if(daterc === 4){
                  return '地图图资';
                } else {
                    return '';
                }
            },
            countryCodesFormat(row,column) {
                const daterc = row[column.property];
                if(daterc) {
                    for(let i=0;i<this.countryCodes.length;i++){
                        if(daterc == this.countryCodes[i].value){
                            return this.countryCodes[i].label;
                        }
                    }
                }
            },
            formatterData(row,column) {
                const daterc = row[column.property];
                return findByvalue(constData.billStatus, parseInt(daterc))
            },
            createOrder(){
                // debugger
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: '创建付款订单',
                        src: '/saic/license-bill-add'
                    }, ''),
                    query: ''
                })
            },
            orderDetail(row){
                // debugger
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: '付款订单详情',
                        src: '/saic/license-bill-detail'
                    }, ''),
                    query: {
                        orderId: row.orderNumber
                    }
                })
            },
            vinDetail(row){
                let url = '';
                if(row.orderType == 1){
                    url = '/saic/weatherState';
                }else if(row.orderType == 2){
                    url = '/saic/voiceState';
                }else if(row.orderType == 3 || row.orderType == 4){
                    url = '/saic/mapstates';
                }
                this.$router.push({
                    path: this.$router.$avueRouter.getPath({
                        name: '状态查询',
                        src: url
                    }, ''),
                    query: {
                        // orderIdTbox: row.orderType,
                        // countryReginCode: row.countryReginCode,
                        // supplierName:row.supplierName,
                        // orderStatus:row.orderStatus
                        orderType:row.orderType,
                        orderNumber:row.orderNumber
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
