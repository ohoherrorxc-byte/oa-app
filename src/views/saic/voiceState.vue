<template>
  <basic-container>

    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">
<!--        <el-form-item label="供  应  商  ：" >-->
<!--          <el-select v-model="query.supplierNameVoice" placeholder="全部" style="width: 90%" clearable>-->
<!--            <el-option v-for="item in voiceOptions"-->
<!--                       :key="item.supplierName"-->
<!--                       :label="item.supplierName"-->
<!--                       :value="item.supplierName">-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->
        <el-form-item label="国家地区：">
          <el-select v-model="query.countryReginCode"  @change="changeValue($event)" placeholder="请选择" style="width: 90%" clearable>
            <el-option v-for="item in countryCodes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车系车型：">
          <template >
            <series-model v-model="seriesModels" :region="regionCode"></series-model>
          </template>
        </el-form-item>

        <el-form-item label="车辆是否统计：">
          <el-select v-model="query.needStatisticsVoice"  placeholder="请选择" style="width: 90%" clearable>
            <el-option v-for="item in statisticals"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车型是否统计：">
          <el-select v-model="query.modelNeedStatisticsVoice"  placeholder="请选择" style="width: 90%" clearable>
            <el-option v-for="item in statisticals"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="TBOX激活时间：">
          <el-col :span="11" >
<!--            <el-date-picker-->
<!--              v-model="query.startActivationDate"-->
<!--              format="yyyy-MM-dd HH:mm:ss"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="开始日期">-->
<!--            </el-date-picker>-->

            <el-date-picker
              v-model="query.startActivationDate"
              format="yyyy-MM-dd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="开始日期">
            </el-date-picker>
          </el-col>
          <el-col class="line" :span="2"> - </el-col>
          <el-col :span="11">
<!--            <el-date-picker-->
<!--              v-model="query.endActivationDate"-->
<!--              format="yyyy-MM-dd HH:mm:ss"-->
<!--              type="datetime"-->
<!--              value-format="yyyy-MM-dd HH:mm:ss"-->
<!--              placeholder="结束日期">-->
<!--            </el-date-picker>-->
            <el-date-picker
              v-model="query.endActivationDate"
              format="yyyy-MM-dd"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="结束日期">
            </el-date-picker>
          </el-col>
        </el-form-item>

        <el-form-item label="付款状态："  style="margin-left: 42px;">
          <el-select v-model="query.statusVoice" placeholder="请选择" style="width: 90%" clearable>
            <el-option v-for="item in paymentStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款状态：">
          <el-select v-model="query.statusTbox" placeholder="请选择"  style="width: 90%" clearable>
            <el-option v-for="item in collectionStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="VIN：">
          <el-input v-model.trim="query.vin"  size="mini"/>
        </el-form-item>
        <el-form-item label="付款订单号：">
          <el-input v-model.trim="query.orderIdVoice" size="mini"/>
        </el-form-item>
        <el-form-item label="是否网联：">
          <el-select v-model="query.modelType" style="width: 90%" clearable>
            <el-option v-for="item in modelTypes"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="AVN是否激活：">
          <el-select v-model="query.avnActive" style="width: 90%" clearable>
            <el-option v-for="item in avnActive"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="searchChange" size="mini" icon="el-icon-search">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
            <el-button type="primary"  icon="el-icon-download" size="mini" v-on:click="handleExport">导出
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- table 列表 -->
      <el-row>
        <el-table border :data="data" @selection-change="selectChange" style="width: 100%">
<!--          <el-table-column type="selection" width="55"> </el-table-column>-->
          <el-table-column prop="vin" align="center" label="VIN" width="180">
          </el-table-column>
<!--          <el-table-column prop="supplierType" align="center" label="供应商类型">-->
<!--          </el-table-column>-->
<!--          <el-table-column prop="supplierNameVoice" align="center" label="供应商">-->
<!--          </el-table-column>-->
          <el-table-column prop="countryReginCode" align="center" label="国家地区" v-bind:formatter="countryCodesFormat">
          </el-table-column>
          <el-table-column prop="seriesName" align="center" label="车系">
          </el-table-column>
          <el-table-column prop="modelName" align="center" label="车型" width="130">
          </el-table-column>
          <el-table-column prop="activationTime" align="center" label="TBOX激活时间" width="150"/>
          <el-table-column prop="avnActivateTime" align="center" label="AVN激活时间" width="150"/>
          <el-table-column prop="statusVoiceName" align="center" label="付款状态" >
          </el-table-column>
          <el-table-column prop="statusTboxName" align="center" label="收款状态" >
          </el-table-column>
          <el-table-column prop="orderIdVoice" align="center" label="付款订单号" width="100" v-bind:formatter="formatterData">
          </el-table-column>
          <el-table-column prop="modelTypeName" align="center" label="是否网联" width="110">
          </el-table-column>
          <el-table-column prop="needStatisticsVoice" align="center" label="车辆是否统计">
            <template slot-scope="scope">
              <div>
                <div v-if="(scope.row.isTestVehicle ==1)">
                  <el-tooltip content="工程车" placement="top">
                     <el-switch disabled="true" :value="scope.row.isTestVehicle" ></el-switch>
                  </el-tooltip>
                </div>
                <div v-if="(scope.row.isTestVehicle ==0) && (scope.row.needStatisticsVoice == 0)
                                 && (scope.row.statusVoice ==1 || scope.row.statusVoice ==2)">
                  <el-switch :value="!!scope.row.needStatisticsVoice"
                    @change="changSwitchState($event,scope.row,scope.$index)"></el-switch>
                </div>
                <div v-if="(scope.row.isTestVehicle ==0) && (scope.row.needStatisticsVoice == 1)
                                 && (scope.row.statusVoice ==1 || scope.row.statusVoice ==2)">
                  <el-switch
                    :value ="!!scope.row.needStatisticsVoice"
                    @change="changSwitchState($event,scope.row,scope.$index)"></el-switch>
                </div>
                <div v-if="(scope.row.isTestVehicle ==0) && (scope.row.needStatisticsVoice == 0)
                                 && (scope.row.statusVoice !=1 && scope.row.statusVoice !=2)">
                  <el-switch v-model="!!scope.row.needStatisticsVoice" disabled/>
                </div>
                <div v-if="(scope.row.isTestVehicle ==0) && (scope.row.needStatisticsVoice == 1)
                                && (scope.row.statusVoice !=1 && scope.row.statusVoice !=2)">
                  <el-switch v-model="!!scope.row.needStatisticsVoice" disabled/>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="modelNeedStatisticsVoice" align="center" label="车型是否统计"
                           :formatter="booleanFormatter">
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
           <p style="color: red;" v-show="isShow"> * 查询结果中车型存在多个预设供应商，请确认查询结果是否正确 </p>
          </div>
        </el-col>
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

    <!-- 弹框2 -->
    <el-dialog
      title="修改统计" :append-to-body="true"
      :visible.sync="needStatisticsDialogVisible"
      width="30%"
      @close="resetForm()"
      center>
      <div>车辆: {{voiceState.vin}} 是否取消统计/加入统计？</div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="needStatisticsCancel">取 消</el-button>
        <el-button type="primary" @click="needStatisticsClick">确 定</el-button>
      </span>
    </el-dialog>
  </basic-container>
</template>

<script>
    import {getList, add, update, getVoiceSupplier, exportList} from "@/api/saic/voiceState.js" ;
    import {download} from "@/util/excel";
    import {mapGetters} from "vuex";
    import SeriesModel from "@/views/saic/series-model";
    import constData from "@/config/constData";
    import {findByvalue} from "@/util/util";

    export default {
        components: {SeriesModel},
        data() {
            return {
                // 是否显示
                formVisible: false,
                // 是否查看
                viewMode: false,
                // dialog标题
                dialogTitle: '',
                // 列表查询数据
                query: {
                    supplierNameVoice: '',
                    countryReginCode:'',
                    needStatisticsVoice: 1,
                    modelNeedStatisticsVoice: 1,
                    startActivationDate:'',
                    endActivationDate:'',
                    statusVoice:'',
                    statusTbox:'',
                    orderIdTbox:'',
                    vin:'',
                    orderIdVoice:'',
                    modelType: '',
                    seriesModel:'',
                    avnActive:''
                },
                seriesModels: { model: ""  },
                loading: true,
                //table中数据
                data: [],
                multiSelection: [],
                page: {
                    pageSize: 10,
                    currentPage: 1,
                    total: 0,
                    elementuiKey: 0
                },
                voiceState:{
                    vin:'',
                    needStatisticsVoice:''
                },
                supplierTypeOptions:[
                    {
                        name: '语音1',
                        value: ''
                    },
                    {
                        name: '语音2',
                        value: '1'
                    },
                    {
                        name: '语音3',
                        value: '2'
                    },
                    {
                        name: '语音4',
                        value: '3'
                    }
                ],
                //收款状态
                collectionStatuss:constData.orderStatus,
                //付款状态
                paymentStatuss:constData.billStatus,
                modelTypes:[
                    {
                        name: '网联',
                        value: 0
                    },
                    {
                        name: 'Color Radio Lite',
                        value: 1
                    },
                    {
                        name: 'Color Radio',
                        value: 2
                    },
                    { name:'待确认',   value: 3 }
                ],
              avnActive:[
                {
                  name: '否',
                  value: 0
                },
                {
                  name: '是',
                  value: 1
                }
              ],
                statisticals:[
                  // {
                  //     name: '全部',
                  //     value: ''
                  // },
                  {
                      name: '是',
                      value: 1
                  },
                  {
                      name: '否',
                      value: 0
                  }
               ],
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
                isShow:false,
                regionCode: ""
            }
        },
        created() {
            // this.query.countryReginCode = this.$route.query.countryReginCode;
            // this.query.supplierNameVoice = this.$route.query.supplierName;
            // this.query.statusVoice = this.$route.query.orderStatus;
            this.countryCodes = constData.countryList ;
            // this.query.orderIdVoice = this.$route.query.orderNumber;
            //应袁总2023.04.24口头要求带过来订单号后查询数据
            // if(this.query.countryReginCode){
            //     this.onLoad(this.page, this.query);
            // }
            this.getVoiceOptions();
        /*},
        activated(){*/
        },
        activated(){
            this.countryCodes = constData.countryList ;
            this.query.orderIdVoice = this.$route.query.orderNumber;
            //TODO
            // this.onLoad(this.page, this.query);
            if (this.query.orderIdVoice) {
              this.query.needStatisticsVoice = this.query.modelNeedStatisticsVoice = null
              this.onLoad(this.page, this.query)
            }
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
                this.isShow = false;
                getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
                    debugger
                    this.data = res.data.data.records;
                    for (let i in this.data) {
                        if(this.data[i].prompt != '' && this.data[i].prompt != null){
                            let tempPromp = '';
                            for (let j=0; j <this.data[i].prompt.length; j++) {
                                tempPromp += `${this.data[i].prompt[j]}\/`;
                            }
                            this.isShow = false;
                            this.promptWords = tempPromp.substring(0,tempPromp.length-1);
                            break;
                        }
                    }
                    this.page.total = res.data.data.total;
                });
                this.loading = false;
            },
            getVoiceOptions(){
                // this.voiceOptions.push({supplierName:'全部',id:''});
                getVoiceSupplier(this.licenseSupplier).then(res =>{
                    let obj = res.data.data;
                    for (let i=0; i < obj.length; i++) {
                    // for (let i in obj) {
                        this.voiceOptions.push(obj[i]);
                    }
                    this.voiceOptions.push({supplierName: '空', id: ''});
                });
            },
            changeValue(value){
                // debugger
                this.regionCode = value;
            },
            searchChange() {
                debugger
                // 获取车系下车型
                // this.query.seriesModel.data[0].series
                // this.query.seriesModel.data[0].model
                // if(this.query.seriesModel.model){
                //     let seriesModel = this.query.seriesModel.model;
                //     this.query.seriesModel= seriesModel;
                // }
                // this.seriesModel.model ? query.seriesModel = this.seriesModel.model : ''
                this.query.seriesModel = this.seriesModels.model;
                if((this.query.countryReginCode == null || this.query.countryReginCode.length ==0)
                    && (this.query.vin == null || this.query.vin.length == 0)
                    && (this.query.orderIdVoice == null || this.query.orderIdVoice.length == 0)){
                    this.$message({type: "warning", message: '国家地区 / VIN / 付款订单号 必须选择其中一项'});
                    return;
                }
                this.page.currentPage = 1;
                this.page.elementuiKey= 1;
                this.onLoad(this.page, this.query);
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
            // scope.row.needStatisticsVoice
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
                const statusVoice = row['statusVoice'];
                // if(daterc == '-1') {
                //     return '';
                //     //出口确认、待收票 不存在订单号
                // }else
                    if (!(statusVoice == 3 || statusVoice == 4 || statusVoice == 5 || statusVoice == 6)) {
                    return '';
                }else {
                    return daterc;
                }
            },
            booleanFormatter(row, column) {
              return findByvalue(constData.booleanValue, row.modelNeedStatisticsVoice)
            },
            changSwitchState($event,row,index){
                debugger
                // this.needStatisticsDialogVisible =true;
                this.voiceState.vin = row.vin;
                this.voiceState.needStatisticsVoice = row.needStatisticsVoice;
                let tips = '车辆：'+ this.voiceState.vin;
                if(this.voiceState.needStatisticsVoice == -1 || this.voiceState.needStatisticsVoice == 0){
                    tips+='是否加入统计';
                }else {
                    tips+='是否取消统计';
                }
                this.$confirm(tips, "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                    debugger
                    if(this.voiceState.needStatisticsVoice == -1 || this.voiceState.needStatisticsVoice ==0){
                        this.voiceState.needStatisticsVoice=1;
                    }else {
                        this.voiceState.needStatisticsVoice=0;
                    }
                    update(this.voiceState).then(res => {
                        if(res.data.success){
                            this.$message({type: "success", message: "提交成功!"});
                            this.resetForm();
                        }else{
                            this.$message({type: "error", message: res.data.msg});
                        }
                        // debugger
                        this.onLoad(this.page,this.query);
                    });
                }).then((res)=>{
                    this.onLoad(this.page,this.query);
                })
            },
            handleShow(row){
                // this.needStatisticsdialogTitle ="提示";
                this.needStatisticsDialogVisible =true;
                this.voiceState.vin = row.vin;
                this.voiceState.needStatisticsVoice=row.needStatisticsVoice;
            },
            needStatisticsCancel(){
                this.needStatisticsDialogVisible =false;
                this.voiceState={};
            },
            needStatisticsClick(){
                debugger
                this.needStatisticsDialogVisible = false;
                if(this.voiceState.needStatisticsVoice == -1 || this.voiceState.needStatisticsVoice ==0){
                    this.voiceState.needStatisticsVoice=1;
                }else {
                    this.voiceState.needStatisticsVoice=0;
                }
                this.voiceState.needStatisticsVoice = this.voiceState.needStatisticsVoice - 0;
                update(this.voiceState).then(res => {
                    if(res.data.success){
                        this.$message({type: "success", message: "提交成功!"});
                        this.resetForm();
                    }else{
                        this.$message({type: "error", message: res.data.msg});
                    }
                    // debugger
                    this.onLoad(this.page,this.query);
                })
            },
            initSelectObj(){
            },
            resetForm(formName){
                // this.$refs[formName].clearValidate();
                this.voiceState={};
            },
            handleExport() {
                if((this.query.countryReginCode == null || this.query.countryReginCode.length ==0)
                    && (this.query.vin == null || this.query.vin.length == 0)
                    && (this.query.orderIdVoice == null || this.query.orderIdVoice.length == 0)){
                    this.$message({type: "warning", message: '国家地区 / VIN / 付款订单号 必须选择其中一项'});
                    return;
                }
                this.$confirm("是否确定导出数据？", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                      this.query.seriesModel = this.seriesModels.model;
                      return exportList(this.query);
                }).then((res)=>{
                      download(res);
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
