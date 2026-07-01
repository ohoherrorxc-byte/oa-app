<template>
    <basic-container v-if="bomDialogFormVisible">
      <el-dialog destroy-on-close :visible.sync="bomDialogFormVisible" append-to-body @close="editDialogClose"
        :close-on-click-modal="false" width="90%">
        <template slot="title">
          <div style="font-size: 15px">{{ dialogTitle }}</div>
        </template>
        <el-form v-if="!isLuInfo || isShowDetail" :model="editForm" :rules="editFormRules" ref="editFormRef"
          class="demo-ruleForm">
          <el-row type="flex" justify="space-between" class="flexWrap">
            <el-col :span="10">
              <el-form-item prop="bomType" label="BOM类型" label-width="100px">
                <el-select v-model="editForm.bomType" :placeholder="isShowDetail ? '' : 'BOM类型'" :disabled="isShowDetail"
                  clearable filterable @change="bomTypeChange">
                  <el-option :label="item.label" :value="item.value" v-for="item in bomType" :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="isLicense">
              <el-form-item prop="licenseChildType" label="Licesne类型" label-width="100px">
                <el-select v-model="editForm.licenseChildType" :placeholder="isShowDetail ? '' : 'Licesne类型'"
                  :disabled="isShowDetail" clearable filterable @change="changeLicense">
                  <el-option :label="item.dictValue" :value="item.dictValue" v-for="item in licesneList"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="bomName" label="BOM名称" label-width="100px">
                <!-- :disabled="isShowDetail" -->
                <el-input v-model="editForm.bomName" autocomplete="off" :placeholder="' '"
                :disabled="isShowDetail||editForm.bomType==='license'"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="countryReginCode" label="国家/地区" label-width="100px">
                <el-select @change="changeAreaList" v-model="editForm.countryReginCode" :placeholder="isShowDetail ? '' : '国家/地区'"
                  :disabled="isShowDetail" clearable filterable>
                  <el-option v-for="item in areaList" :key="item.dictKey" :label="item.dictValue"
                    :value="item.dictKey"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item prop="saleContractId" label="所属合同" label-width="100px">
                <div class="flex-center">
                  <el-select v-model="editForm.saleContractId" :placeholder="isShowDetail ? '' : '所属合同'"
                    :disabled="isShowDetail" clearable filterable>
                    <el-option v-for="item in saleContractList" :key="item.id" :label="item.titleName"
                      :value="item.id"></el-option>
                  </el-select>
                  <p @click="toPath" class="detailLink" v-if="editForm.saleContractId">{{ $t('commonContent.viewDetails') }}</p>
                </div>
              </el-form-item>
            </el-col>    
            <el-col :span="10">
              <el-form-item prop="vehicleBrand" label="品牌" label-width="100px">
                <el-select v-model="editForm.vehicleBrand" :placeholder="isShowDetail ? '' : '品牌'" :disabled="isShowDetail"
                  clearable filterable>
                  <el-option :label="item.dictValue" :value="item.dictValue" v-for="item in vehicleBrandList"
                    :key="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-collapse v-model="collapseActiveNames">
            <el-collapse-item v-for="itemBom in bomList" :title="itemBom.title" :name="itemBom.name"
              v-if="showItem(itemBom) || !isShowDetail">
              <el-row v-for="subItemBom in itemBom.children"
                v-if="(!isShowDetail || (editForma[subItemBom.formKey] && editForma[subItemBom.formKey][0].id)) && (!subItemBom.showSomeType || subItemBom.showSomeType.includes(editForm.licenseChildType))">
                <el-form-item :prop="subItemBom.formKey">
                  <label slot="label">{{ subItemBom.labelValue }}</label>
                  <span class="addClass" @click="addRow(subItemBom.formKey)"
                    v-if="!isShowDetail && itemBom.canAdd">+添加</span>
                  <br />
                  <el-row v-for="(item, index) in editForma[subItemBom.formKey]" :key="index" type="flex"
                    justify="space-between">
                    <el-col :span="9">
                      <el-cascader
                        :disabled="isShowDetail || (subItemBom.showBomType && !subItemBom.showBomType.includes(editForm.licenseChildType)&&(!subItemBom.bomType||!subItemBom.bomType.includes(editForm.bomType)))"
                        v-model="item.id" :options="options[subItemBom.formKey]" :props="defaultPropsS"
                        :placeholder="isShowDetail ? '无' : '无'"
                        @change="handleChange(item.id, subItemBom.formKey, index, item)" clearable>
                        <template slot-scope="{ node, data }">
                          <span @click="clickPart(item, data, index, subItemBom.formKey)" class="
                              ">{{ data.label }}</span>
                        </template>
                      </el-cascader>
                    </el-col>
                    <el-col :span="5">
                      <label class="unit-price-label" v-if="index === 0">零件号</label>
                      <el-input class="unit-price" placeholder="零件号" v-model="item.partsNo" disabled>
                      </el-input>
                    </el-col>
                    <el-col :span="4">
                      <label class="unit-price-label" v-if="index === 0">品类</label>
                      <el-input autosize type="textarea" class="unit-price" placeholder="品类" v-model="item.categorys"
                        disabled>
                      </el-input>
                    </el-col>
                    <el-col :span="4">
                      <label class="unit-price-label" v-if="index === 0">成本价(人民币)</label>
                      <el-input class="unit-price" placeholder="成本价" v-model="item.unitPrice" disabled>
                        <template slot="append">元</template>
                      </el-input>
                      <span class="deleteClass" @click="delRow(subItemBom.formKey, index)"
                        v-if="!isShowDetail && index != 0">-删除</span>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-row>
              <el-row v-if="itemBom.title === '分摊费用' && (!isShowDetail || (editForm.tbBomOtherCostList&&editForm.tbBomOtherCostList[0].id))">
                <el-form-item prop="tbBomOtherCostList">
                  <label slot="label">其他分摊成本:</label>
                  <span class="addClass" @click="addother" v-if="!isShowDetail">+添加</span>
                  <br />
                  <el-row v-for="(item, index) in editForm.tbBomOtherCostList" :key="index">
                    <el-col :span="12">
                      <el-form-item>
                        <el-input v-model="item.otherCostName" autocomplete="off" placeholder="其他分摊成本名称" style="width: 90%"
                          @input="getCost" :disabled="isShowDetail" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12">
                      <el-form-item>
                        <el-input v-model="item.otherCostValue" autocomplete="off" placeholder="其他成本值" style="width: 90%"
                          @input="getCost" :disabled="isShowDetail" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <span class="delClass" @click="Delother(index)" v-if="!isShowDetail && index != 0">删除</span>
                  </el-row>
                </el-form-item>
              </el-row>
              <el-row v-if="itemBom.title === '分摊费用' && (!isShowDetail || editForm.tbBomDevelopCostList[0].id)">
                <el-form-item prop="tbBomDevelopCostList">
                  <label slot="label">固定开发费用:</label>
                  <span class="addClass" @click="addBomDevelop" v-if="!isShowDetail">+添加</span>
                  <br />
                  <el-row v-for="(item, index) in editForm.tbBomDevelopCostList" :key="index">
                    <el-col :span="12">
                      <el-form-item>
                        <el-input v-model="item.costName" autocomplete="off" placeholder="费用名称" style="width: 90%"
                          :disabled="isShowDetail" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input v-model="item.costTotal" autocomplete="off" placeholder="总分摊费用" style="width: 90%"
                          @input="getCostUnit(item)" :disabled="isShowDetail" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-checkbox v-model="item.share" :disabled="isShowDetail"
                          @change="getCostUnit(item)">是否分摊</el-checkbox>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="item.share">
                      <el-form-item>
                        <el-input v-model="item.shareNumber" autocomplete="off" placeholder="分摊数量" style="width: 90%"
                          @input="getCostUnit(item)" :disabled="isShowDetail" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-show="item.share">
                      <el-form-item>
                        <el-input v-model="item.costUnit" autocomplete="off" placeholder="分摊成本" style="width: 90%"
                          :disabled="isShowDetail" clearable></el-input>
                      </el-form-item>
                    </el-col>
                    <span class="delClass" @click="DelBomDevelop(index)" v-if="!isShowDetail && index != 0">-删除</span>
                  </el-row>
                </el-form-item>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="结算方式" name="结算方式" v-if="settlementMethod">
              <el-row>
                <el-col :span="24" v-if="!isShowDetail || editForm.costCny">
                  <el-form-item prop="costCny">
                    <label slot="label">成本(CNY,含税):</label>
                    <el-input disabled v-model="editForm.costCny" autocomplete="off" style="width: 90%"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="!isShowDetail || editForm.currency">
                  <el-form-item prop="currency">
                    <label slot="label">币种:</label>
                    <br />
                    <el-select v-model="editForm.currency" :placeholder="isShowDetail ? '' : '币种'" style="width: 90%"
                      :disabled="isShowDetail" clearable @change="getRate">
                      <el-option v-for="item in CurrencyList" :key="item.dictKey" :label="item.dictValue"
                        :value="item.dictKey"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="!isShowDetail || editForm.exchangeRateMethod">
                  <el-form-item prop="exchangeRateMethod">
                    <label slot="label">汇率计算方式:</label>
                    <br />
                    <el-select v-model="editForm.exchangeRateMethod" :placeholder="isShowDetail ? '' : '汇率计算方式'"
                      style="width: 90%" :disabled="isShowDetail" clearable @change="getExchangeRateMethod">
                      <el-option v-for="item in exchangeRateList" :key="item.id" :label="item.name"
                        :value="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12" v-if="!isShowDetail || editForma.exchangeRate">
                  <el-form-item prop="exchangeRate">
                    <label slot="label">汇率:</label>
                    <br />
                    <el-input v-model="editForm.exchangeRate" autocomplete="off" :placeholder="isShowDetail ? '' : '汇率'"
                      style="width: 65%" :disabled="userInfo.content.role_id !== '1650066294260449282'
                        "></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12" v-if="!isShowDetail || editForma.cost">
                  <el-form-item prop="cost">
                    <label slot="label">折算成本价(外币):</label>
                    <br />
                    <el-input v-model="editForm.cost" autocomplete="off" :placeholder="isShowDetail ? '' : '折算成本价(外币)'"
                      style="width: 90%" :disabled="isShowDetail"></el-input>
                  </el-form-item>
                </el-col>
                <el-col v-show="isWarning && !isShowDetail" :span="24" style="color: red">汇率变动超过了5％</el-col>
              </el-row>
  
              <el-row v-if="!isShowDetail || editForm.createTime">
                <el-form-item prop="createTime">
                  <label slot="label">创建时间:</label>
                  <br />
                  <el-date-picker v-model="editForm.createTime" style="width: 90%" type="date" format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd" :disabled="true"></el-date-picker>
                </el-form-item>
              </el-row>
              <el-row v-if="!isShowDetail || editForm.createUserName">
                <el-form-item prop="createUser">
                  <label slot="label">创建人:</label>
                  <br />
                  <el-input v-model="editForm.createUserName" autocomplete="off" style="width: 90%"
                    disabled="true"></el-input>
                </el-form-item>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="关联车型" name="BOM变更记录">
              <el-row>
                <el-col :span="24">
                  <div class="flex  pb5">
                    <div class="flex-1">车系</div>
                    <div class="flex-1">车型</div>
                    <span class="addClass" @click="addCarModel" v-if="isEdit">+添加</span>
                  </div>
                  <div v-for="(item, index) in editForm.serialsModelNameList" class="flex pt5 border-top">
                    <div class="flex-1">
                      {{ item.serialName }}
                    </div>
                    <div class="flex-1">
                      <div v-for="self in item.modelNameList" class="column-list pb5">
                        <div class="flex-between">
                          <div>{{ self.modelName }}</div>
                          <div class="addClass" style="color: red;" @click="deleteCarModel(self)"
                            v-if="isEdit && editForm.serialsModelNameList.length > 0">-删除</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="零件变更记录" name="零件变更记录">
              <el-row>
                <el-col :span="24">
                  <div v-for="item in partsLogList">
                    {{ item.recordContent }}
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="BOM变更记录" name="BOM变更记录">
              <el-row>
                <el-col :span="24">
                  <div v-for="item in bomLogList">
                    {{ item.recordContent }}
                  </div>
                </el-col>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <el-form v-if="isLuInfo && !isShowDetail" :model="editForm" :rules="editFormRules" ref="editFormRef"
          class="demo-ruleForm">
          <el-row>
            <el-form-item prop="cost">
              <label slot="label">cost(不含税):</label>
              <el-input disabled v-model="editForm.cost" autocomplete="off" style="width: 90%"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="externalQuotation">
              <label slot="label">对外报价:</label>
              <br />
              <el-input v-model="editForm.externalQuotation" autocomplete="off" :placeholder="isShowDetail ? '' : '对外报价'"
                style="width: 90%" :disabled="isShowDetail"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="priceValidDate">
              <label slot="label">报价有效期:</label>
              <br />
              <el-date-picker v-model="editForm.priceValidDate" style="width: 90%" type="date" format="yyyy-MM-dd"
                value-format="yyyy-MM-dd" :disabled="isShowDetail"
                :placeholder="isShowDetail ? '' : '报价有效期'"></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item>
                <label slot="label">合同单价:</label>
                <el-input @input="contractUnitPriceFn" v-model="editForm.contractUnitPrice" autocomplete="off"
                  :placeholder="isShowDetail ? '' : '合同单价'" style="width: 90%" :disabled="isShowDetail"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item>
                <label slot="label">数量:</label>
                <br />
                <el-input v-model="editForm.licenseNum" disabled style="width: 90%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="contractPrice">
                <label slot="label">合同价格:</label>
                <br />
                <el-input v-model="editForm.contractPrice" autocomplete="off" :placeholder="isShowDetail ? '' : '合同价格'"
                  style="width: 90%" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col span="12">
              <el-form-item prop="isIncludeTax">
                <label slot="label">是否含税:</label>
                <br />
                <el-select v-model="editForm.isIncludeTax" :placeholder="isShowDetail ? '' : '是否含税'" style="width: 90%"
                  :disabled="isShowDetail" clearable>
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-if="editForm.isIncludeTax === '1'">
              <el-form-item prop="taxRate">
                <label slot="label">税率:</label>
                <br />
                <el-input v-model="editForm.taxRate" autocomplete="off" :placeholder="isShowDetail ? '' : '税率'"
                  style="width: 90%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <template #footer v-if="!isShowDetail">
          <span class="dialog-footer">
            <el-button @click="bomDialogFormVisible = false" size="mini" icon="el-icon-circle-close">取消</el-button>
            <el-button type="primary" @click="addBom" size="mini" icon="el-icon-circle-check">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </basic-container>
  </template>
  
  <script>
  import constData from "@/config/constData";
  import bomListFn from '../bomMaint'
  import {
    selectPage,
    delBom,
    saveOrUpdateBom,
    BomDetail,
    getOptions,
    getCostBom,
    refreshLicenseNum,
    userList,
    getUnitPriceById,
    exportList,
    getBlongPartsLog
  } from "@/api/contract/bomMaint";
  import { modifyRecord } from '@/api/public/index'
  import {
    getFunctionAndParts, getExchangeRate,
    getCurrency, getPartsNoById, deleteVehicle
  } from "@/api/contract/partsMaint";
  import dictionaryApi from '@/api/dictionary'
  import { getSalesContractList } from "@/api/contract/salesContractNew";
  import { download } from "@/util/excel";

  export default {
    components: {   
    },
    data() {
      return {
        licesneList: [],
        bomList: [],
        showBomDialog:false,
        vehicleBrandList: [],
        bomType: constData.bomType,
        exchangeRateList: constData.exchangeRateList,
        collapseActiveNames: [],
        maintainRecords: false,
        bomId: null,
        activationNumberRef: false,
        shipmentRef: false,
        saleContractList: [],
        editFormRules: {
          bomName: [
            { required: false, message: "请输入bom名称", trigger: "blur" },
          ],
          countryReginCode: [
            { required: true, message: "请输入国家/地区", trigger: "change" },
          ],
          bomType: [
            { required: true, message: "请输入BOM类型", trigger: "change" },
          ],
          licenseChildType: [
            { required: true, message: "请选择Licesne类型", trigger: "change" },
          ],
          vehicleBrand: [
            { required: true, message: "请选择品牌", trigger: "change" },
          ],
          saleContractId: [
            { required: true, message: "请选择所属合同", trigger: "change" },
          ],
        },
        isEdit: false,
        exchangeRate: null,
        isWarning: false,
        userLists: [],
        userInfo: JSON.parse(localStorage.getItem("saber-userInfo")),
        tableData: [],
        queryInfo: {
          query: "",
          pageNum: 1,
          pageSize: 10,
          total: 0,
        },
        query: {
          bomName: "",
          countryReginCode: "",
          createUser: "",
        },
        bomDialogFormVisible: false,
        dialogTitle: "",
        isShowDetail: false,
        editForma: {
        },
        partsLogList: [],
        bomLogList: [],
        editForm: {
          id: "",
          bomName: "",
          saleContractId: "",
          bomType: "",
          licenseNum: "",
          contractUnitPrice: "",
          countryReginCode: "",
          status: "",
          costCny: "",
          cost: "",
          remark: "",
          priceValidDate: "",
          createTime: "",
          createUser: "",
          createUserName: "",
          licenseChildType: "",
          vehicleBrand: '',
          tbBomOtherCostList: [
            {
              otherCostName: "",
              otherCostValue: "",
            },
          ],
          tbBomDevelopCostList: [
            {
              costName: "",
              costTotal: "",
              share: false,
              otherCostValue: "",
              costUnit: "",
              shareNumber: "",
            },
          ],
          partsIdList: {},
          quotationValidDate: "",
          externalQuotation: "",
          contractPrice: "",
          orderAmount: "",
          currency: "",
          exchangeRateMethod: 1,
          exchangeRate: "",
          RMBAmount: "",
        },
        selectItems: [],
        options: {
          Navigation: [],
          TTS: [],
          Weather: [],
          appStore: [],
          TBOX: [],
          host: [],
          screen: [],
          monitor: [],
          robot: [],
          APP: [],
          TSP: [],
          OTA: [],
          Online: [],
          terrace: [],
          manual: [],
          operator: [],
        },
        detailId: null,
        defaultPropsS: {
          children: "children",
          label: "label",
          id: "value",
          value: "value",
        },
        areaList: [],
        isLuInfo:
          (JSON.parse(localStorage.getItem("saber-userInfo")).content.role_id ==
            "1645256529365778434" || JSON.parse(localStorage.getItem("saber-userInfo")).content.role_id == "1752667919503982593")
            ? true
            : false,
        ExchangeRate: "",
        CurrencyList: [],
      };
    },
    computed: {
      settlementMethod() {
        if (
          !this.isShowDetail ||
          this.editForm.costCny ||
          this.editForm.currency ||
          this.editForm.exchangeRateMethod ||
          this.editForm.exchangeRate ||
          this.editForm.cost
        )
          return true;
        return false;
      },
      isLicense() {
        return this.editForm.bomType === 'license' || this.editForm.bomType === 'other'
      }
    },
    methods: {
      showItem(item) {
        let row = this.bomList.find(ele => {
          return ele.name === item.name
        })
        if (row) {
          let keys = row.children.map(ele => ele.formKey)
          for (let key of keys) {
            if (this.editForma[key][0].id) {
              return true;
            }
          }
        }
        return false
      },
      refleshDetail(){
        this.getPartsIdList()
        this.showBomDialog = false
      },
      init() {
        let keys = ['Navigation', 'TTS', 'Weather', 'APP', 'TSP', 'OTA', 'Online', 'terrace', 'TBOX', 'host',
          'monitor', 'screen', 'robot', 'manual', 'appStore', 'ECOLOGICAL_PACK', 'operator']
        for (let row of keys) {
          this.$set(this.editForma, row, [])
          this.editForma[row].push({ id: '', partsNo: "", categorys: '' })
        }
        this.editForm.partsIdList = this.editForma
      },
      changeAreaList(){
        let row = this.areaList.find(ele=>{
          return this.editForm.countryReginCode === ele.dictKey
        })
        if(row){
          this.editForm.countryRegin = row.dictValue
        }
      },
      addCarModel() {   
        this.$refs.bomMaintDialog.vehicleModelDialogFormVisible = true
        this.$refs.bomMaintDialog.resetForm()
        this.$refs.bomMaintDialog.initData(this.editForm)
      },
      async deleteCarModel(item) {
        let res = await deleteVehicle({ modelId: item.modelId, bomId: this.detailId })
        if(res.data.code===0||res.data.code===200){
          this.getPartsIdList()
        }
      },
      // 导出
      handleExport() {
        this.$confirm("确定导出数据？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            return exportList();
          })
          .then((res) => {
            download(res);
          });
      },
      toPath() {
        if (this.editForm.saleContractId) {
          let url = `/?businessId=${this.editForm.saleContractId}`
          window.open(this.$router.resolve({ path: url }).href, '_blank')
        }
      },
      shipmentRefClose(val) {
        this.shipmentRef = false;
        if (val === "refresh") {
          this.getBomMaintList({});
        }
      },
      contractUnitPriceFn(val) {
        this.editForm.contractPrice = val * this.editForm.licenseNum;
      },
      // bom维护刷新license数量接口
      activationsNumber() {
        refreshLicenseNum().then((res) => {
          if (res.data.code == 0) {
            this.searchChange();
            this.$message.success("激活数刷新成功");
          }
        });
      },
      //获取创建人列表
      getUserList() {
        userList(this.userInfo.content.tenant_id).then((res) => {
          this.userLists = res.data.data;
        });
      },
      getBomMaintList(params = {}) {
        selectPage(
          this.queryInfo.pageNum,
          this.queryInfo.pageSize,
          Object.assign(params, this.query)
        ).then((res) => {
          this.tableData = res.data.data.records;
          this.queryInfo.total = res.data.data.total;
        });
      },
      async getLicesneList() {
        let res = await dictionaryApi.getDictionary('license_child_type')
        this.licesneList = res.data.data
      },
      getRate(params) {
        this.editForm.currency = params;
        this.getExchangeRate(0);
      },
      getExchangeRateMethod(params) {
        this.editForm.exchangeRateMethod = params;
        this.getExchangeRate(0);
      },
      getExchangeRate(isInit) {
        let currencyCode = this.editForm.currency;
        let exchangeRateMethod = this.editForm.exchangeRateMethod;
        let createTime = this.editForm.createTime;
        if (!currencyCode || !exchangeRateMethod) return false;
        getExchangeRate({
          currencyCode,
          exchangeRateMethod,
          createTime,
        }).then((res) => {
          this.editForm.exchangeRate = res.data.data.middleRate;
          if (this.exchangeRate) {
            const exchangeRate =
              (this.editForm.exchangeRate - this.exchangeRate) /
              this.editForm.exchangeRate;
            this.isWarning = Math.abs(exchangeRate) > 0.05 ? true : false;
          }
          if (isInit == 0) {
            this.getCost();
          }
        });
      },
      getOptionsList(params) {
        getOptions(params).then((res) => {
          this.areaList = res.data.data;
        });
      },
      getFunctionAndParts(params) {
        getFunctionAndParts(params).then((res) => {
          res.data.data.unshift({
            children: [],
            label: "无",
            value: "",
          });
        //   const codeValue = {
        //     "Map_Navigation":'Navigation',
        //     "VR_TTS":"TTS",
        //     "Weather":"Weather",
        //     "APP":"APP",
        //     "TSP":"TSP",
        //     "OTA":"OTA",
        //     "Online_Music":"Online",
        //     "platform":"terrace",
        //     "TBOX":"TBOX",
        //     "MAIN_ENGINE":"host",
        //     "DISPLAY_SCREEN":"screen",
        //     "SCREEN_POWER":"monitor",
        //     "ROBOT":"robot",
        //     "MANUAL":"manual",
        //   }
          if (params.code == "Map_Navigation") {
            this.options.Navigation = res.data.data;
          }
          if (params.code == "VR_TTS") {
            this.options.TTS = res.data.data;
          }
          if (params.code == "Weather") {
            this.options.Weather = res.data.data;
          }
          if (params.code == "APP") {
            this.options.APP = res.data.data;
          }
          if (params.code == "TSP") {
            this.options.TSP = res.data.data;
          }
          if (params.code == "OTA") {
            this.options.OTA = res.data.data;
          }
          if (params.code == "Online_Music") {
            this.options.Online = res.data.data;
          }
          if (params.code == "platform") {
            this.options.terrace = res.data.data;
          }
          if (params.code == "TBOX") {
            this.options.TBOX = res.data.data;
          }
          if (params.code == "MAIN_ENGINE") {
            this.options.host = res.data.data;
          }
          if (params.code == "DISPLAY_SCREEN") {
            this.options.screen = res.data.data;
          }
          if (params.code == "SCREEN_POWER") {
            this.options.monitor = res.data.data;
          }
          if (params.code == "ROBOT") {
            this.options.robot = res.data.data;
          }
          if (params.code == "MANUAL") {
            this.options.manual = res.data.data;
          }
          if (params.code == "OPERATOR") {
            this.options.operator = res.data.data;
          }
          if (params.code == "APP_STORE") {
            this.options.appStore = res.data.data;
          }
          if (params.code === 'ECOLOGICAL_PACK') {
            this.options['ECOLOGICAL_PACK'] = res.data.data
          }
  
        });
      },
      handleDeleteData(row, type) {
        if (type === "delete") {
          this.$confirm("确定将该条数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            delBom(row.id)
              .then((res) => {
                if (res.data.code == 0) {
                  this.$message.success("删除成功");
                }
              })
              .finally(() => {
                this.getBomMaintList({});
              });
          });
        } else {
          if (!this.selectItems.length) {
            this.$message.error("至少选择一条数据!");
            return;
          }
          this.$confirm("确定将选择数据删除?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }).then(() => {
            let ids = this.selectItems.map((bomMaint) => bomMaint.id);
            ids = ids.join(",");
            delBom(ids)
              .then((res) => {
                if (res.data.code == 0) {
                  this.$message.success("删除成功");
                }
              })
              .finally(() => {
                this.selectItems = [];
                this.getBomMaintList({});
              });
          });
        }
      },
  
      handleOpenDialog(row, type) {
        this.isShowDetail = false;
        this.collapseActiveNames = [];
        this.isEdit = false
        this.detailId = row.id
        switch (type) {
          case "detail":
            this.isShowDetail = true;
            this.dialogTitle = this.isLuInfo == true ? "报价查看" : "BOM查看";
            this.collapseActiveNames = this.bomList.map(ele => ele.name)
            this.resetEditForm();
            this.getPartsIdList(row);
            break;
          case "edit":
            this.collapseActiveNames = this.bomList.map(ele => ele.name)
            this.dialogTitle = this.isLuInfo == true ? "报价查看" : "BOM编辑";
            this.isAdd = false;
            this.isEdit = true
            this.resetEditForm();
            this.getPartsIdList(row);
            break;
          case "create":
            this.dialogTitle = this.isLuInfo == true ? "新增报价" : "BOM新增";
            this.isAdd = true;
            this.resetEditForm();
            break;
        }
        this.bomDialogFormVisible = true;
      },
      resetEditForm() {
        this.editForm.id = "";
        this.editForm.bomName = "";
        this.editForm.saleContractId = "";
        this.editForm.bomType = "";
        this.editForm.vehicleBrand = ''
        this.editForm.licenseChildType = ''
        this.editForm.licenseNum = "";
        this.editForm.contractUnitPrice = "";
        this.editForm.countryReginCode = "";
        this.editForm.status = "";
        this.editForm.costCny = "";
        this.editForm.cost = "";
        this.editForm.remark = "";
        this.editForm.priceValidDate = "";
        this.editForm.createTime = "";
        this.editForm.createUser = "";
        this.editForm.createUserName = this.userInfo.content.user_name;
        let keys = ['Navigation', 'TTS', 'Weather', 'APP', 'TSP', 'OTA', 'Online', 'terrace', 'TBOX', 'host',
          'monitor', 'screen', 'robot', 'manual', 'appStore', 'ECOLOGICAL_PACK', 'operator']
        for (let row of keys) {
          this.$set(this.editForma, row, [])
          this.editForma[row].push({ id: '', unitPrice: "", partsNo: "", categorys: '', })
        }
        this.editForm.partsIdList = this.editForma
        this.editForm.tbBomOtherCostList = [
          {
            otherCostName: "",
            otherCostValue: "",
          },
        ];
        this.editForm.tbBomDevelopCostList = [
          {
            costName: "",
            costTotal: "",
            share: false,
            otherCostValue: "",
            costUnit: "",
            shareNumber: "",
          },
        ];
        this.editForm.quotationValidDate = "";
        this.editForm.externalQuotation = "";
        this.editForm.contractPrice = "";
        this.editForm.currency = this.CurrencyList[0].dictKey;
        this.getExchangeRate(1);
        this.editForm.exchangeRate = "";
        this.editForm.orderAmount = "";
      },
      setRowValue(row) {
        console.log('isEdit')
        // this.editForm = row
        this.editForm.id = row.id;
        this.editForm.bomName = row.bomName;
        this.editForm.saleContractId = row.saleContractId;
        this.editForm.bomType = row.bomType;
        this.editForm.licenseNum = row.licenseNum;
        this.editForm.contractUnitPrice = row.contractUnitPrice;
        this.editForm.countryReginCode = row.countryReginCode;
        this.editForm.status = row.status;
        this.editForm.costCny = row.costCny;
        this.editForm.remark = row.remark;
        this.editForm.priceValidDate = row.priceValidDate;
        this.editForm.createTime = row.createTime;
        this.editForm.createUser = row.createUser;
        this.editForm.createUserName = row.createUserName || "";
        this.editForm.quotationValidDate = row.quotationValidDate;
        this.editForm.externalQuotation = row.externalQuotation;
        this.editForm.contractPrice = row.contractPrice;
        this.editForm.currency = row.currency;
        this.editForm.exchangeRateMethod = row.exchangeRateMethod;
        this.exchangeRate = this.editForm.exchangeRate = row.exchangeRate;
        this.editForm.cost = row.cost ? row.cost : row.costCny;
        this.editForm.orderAmount = row.orderAmount;
        this.editForm.serialsModelNameList = row.serialsModelNameList
        this.editForm.licenseChildType = row.licenseChildType
        this.editForm.vehicleBrand = row.vehicleBrand
        
      },
      addBom() {
        this.$refs["editFormRef"].validate((valid, object) => {
          console.log(object);
          if (valid) {
            this.submitForm();
          } else {
            this.$message.error(Object.values(object)[0][0].message);
            return false;
          }
        });
      },
      submitForm() {
        console.log('submitForm')
        if (this.isAdd) {
          this.editForm.createUser = this.userInfo.content.user_id;
         
          saveOrUpdateBom(this.editForm)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: "新增成功",
                  type: "success",
                });
                this.bomDialogFormVisible = false;
              } else {
                this.$message.error(res.data.msg);
              }
              this.getBomMaintList({});
            })
            .catch((err) => this.$message.error(`新增失败,${err.data.msg}`))
            .finally(() => {
              this.getBomMaintList({});
  
            });
        } else {
          if (this.isLuInfo == true) {
            this.editForm.status = "2";
          }
          console.log(this.editForm)
          this.editForm.updateUser = this.userInfo.content.user_id;
          saveOrUpdateBom(this.editForm)
            .then((res) => {
              if (res.data.code == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success",
                });
                this.bomDialogFormVisible = false;
              } else {
                this.$message.error(res.data.msg);
              }
              this.getBomMaintList({});
            })
            .catch((err) => this.$message.error(`修改失败,${err.data.msg}`))
            .finally(() => {
              this.getBomMaintList({});
              // this.bomDialogFormVisible = false;
            });
        }
      },
      // 表格多选
      handleSelectionChange(val) {
        this.selectItems = val;
      },
      addRow(key) {
        // console.log(key)
        this.editForma[key].push({
          id: "", partsNo: "", categorys: '', unitPrice: ""
  
        });
        this.editForm.partsIdList = this.editForma
      },
      bomTypeChange() {
        if (!this.isLicense) {
          this.editForm.licenseChildType = ''
        }  
        this.editFormRules.bomName[0].required = true
        if (this.editForm.bomType === 'license') {
          this.collapseActiveNames = []
          this.editFormRules.bomName[0].required = false
        } else if (this.editForm.bomType === 'hardware') {
          this.collapseActiveNames = ['硬件','运营商']
          this.resetTerraceData()
        } else if (this.editForm.bomType === 'other') {
          this.collapseActiveNames = ['运营商']
        }
      },
      changeLicense() {
        this.collapseActiveNames = ['License', '云平台', '移动端', '运营商', "分摊费用"]
        if (this.editForm.licenseChildType === 'Full') {
          this.editForma.terrace[0].id = 28
          this.editForm.partsIdList['terrace'][0].id = 28;
        } else if (this.editForm.licenseChildType === 'Lite' || this.editForm.licenseChildType === 'Connect') {
          this.editForma.terrace[0].id = 29
          this.editForm.partsIdList['terrace'][0].id = 29;
        } else if (this.editForm.licenseChildType === 'Nav') {
          this.editForma.terrace[0].id = null
          this.editForm.partsIdList['terrace'][0].id = null;
          this.editForma['terrace'][0].unitPrice = null
          this.editForma['terrace'][0].categorys = null
          this.editForma['terrace'][0].partsNo = null
        } else {
          this.resetTerraceData()
        }
  
        if (this.editForma.terrace[0].id) {
          getUnitPriceById({ id: this.editForma.terrace[0].id }).then((res) => {
            this.editForma['terrace'][0].unitPrice = res.data.data;
          });
          getPartsNoById({ id: this.editForma.terrace[0].id }).then(res => {
            console.log(res.data)
            if (res.data.code === 200 || res.data.code === 0) {
              this.editForma['terrace'][0].categorys = res.data.data.categoryName
              this.editForma['terrace'][0].partsNo = res.data.data.partsNo
            }
          })
        } else {
          this.editForma['terrace'][0].unitPrice = null;
        }
  
        this.getCost()
      },
      resetTerraceData() {
        this.editForma.terrace[0].id = null
        this.editForm.partsIdList['terrace'][0].id = null;
        this.editForma['terrace'][0].unitPrice = null
        this.editForma['terrace'][0].categorys = null
        this.editForma['terrace'][0].partsNo = null
      },
      addother() {
        this.editForm.tbBomOtherCostList.push({
          otherCostName: "",
          otherCostValue: "",
        });
      },
      Delother(index) {
        this.editForm.tbBomOtherCostList.splice(index, 1);
        this.getCost();
      },
      addBomDevelop() {
        this.editForm.tbBomDevelopCostList.push({
          costName: "",
          costTotal: "",
          share: false,
          otherCostValue: "",
          costUnit: "",
          shareNumber: "",
        });
      },
      DelBomDevelop(index) {
        this.editForm.tbBomDevelopCostList.splice(index, 1);
        this.getCost();
      },
      delRow(key, index) {
        this.editForma[key].splice(index, 1);
        this.editForm.partsIdList[key].splice(index, 1);
        this.getCost();
      },
      clickPart(item, data, index, key) {
        console.log('clickPart')
        if (!data.children) {
          if (this.editForma[key][index].partsNo === undefined) {
            this.$set(this.editForma[key][index], 'partsNo', data.partsNo)
          } else {
            this.editForma[key][index].partsNo = data.partsNo
          }
          if (this.editForma[key][index].categorys === undefined) {
            this.$set(this.editForma[key][index], 'categorys', data.categorys)
          } else {
            this.editForma[key][index].categorys = data.categorys
          }
          this.$forceUpdate()
        }
  
      },
      // 下拉框选中事件
      handleChange(val, name, index, item) {
        console.log(val)
        console.log(name)
        // select控件的option绑定的值为节点的id,我们将值绑定在要添加的元素的父id
        if (val && val.length && val.length >= 1) {
          this.editForm.partsIdList[name][index].id =
            val[val.length - 1] == "NULL" ? "0" : val[val.length - 1];
        } else if (val.length === 0) {
          this.editForm.partsIdList[name][index].id = "";
          this.editForma[name][index].unitPrice = null
          this.editForma[name][index].partsNo = null
          this.editForma[name][index].categorys = null
        } else {
          this.editForm.partsIdList[name][index].id = val == "NULL" ? "0" : val;
        }
        let id = this.editForm.partsIdList[name][index].id;
        console.log("id-->" + (id == ""));
        if (id == null || id == undefined || id == "") {
        } else {
          getUnitPriceById({ id }).then((res) => {
            this.editForma[name][index].unitPrice = res.data.data;
          });
        }
        this.getCost();
      },
      // 编辑回显
      getPartsIdList(row) {
        this.loading = this.$loading({
          target: ".el-dialog",
          lock: true,
          text: "Loading",
          spinner: "el-icon-loading",
          background: "rgba(250, 250, 250, 0.7)",
        });
        BomDetail(this.detailId).then((res) => {
          let data = res.data.data;
          this.setRowValue(data);
          let objKeyValue = {
            "Map+Navigation": 'Navigation',
            "VR+TTS": "TTS",
            "Weather": 'Weather',
            "应用商店": 'appStore',
            "TSP": "TSP",
            "APP": "APP",
            "OTA": "OTA",
            "Online Music": "Online",
            "terrace": "terrace",
            "TBOX": "TBOX",
            "主机": "host",
            "屏幕供电模块": 'monitor',
            "显示屏": 'screen',
            "机器人": "robot",
            "手册": "manual",
            "运营商": "operator",
            "生态扩展包": "ECOLOGICAL_PACK"
          }
          for (let key in data.partsIdList) {
            if (data.partsIdList[key] && data.partsIdList[key].length > 0) {
              this.editForma[objKeyValue[key]] = JSON.parse(JSON.stringify(data.partsIdList[key]))
              this.editForm.partsIdList[objKeyValue[key]] = JSON.parse(JSON.stringify(data.partsIdList[key]))
            }
          }
          if (data.tbBomOtherCostList && data.tbBomOtherCostList.length > 0) {
            this.editForm.tbBomOtherCostList = data.tbBomOtherCostList;
          }
          if (data.tbBomDevelopCostList && data.tbBomDevelopCostList.length > 0) {
            this.editForm.tbBomDevelopCostList = data.tbBomDevelopCostList;
          }
          this.exchangeRate = this.editForm.exchangeRate = data.exchangeRate;
          this.$nextTick(() => {
            this.loading.close();
          });
        });
        this.getLogDetail(this.detailId)
        this.getmodifyRecord(this.detailId)
      },
      async getLogDetail(id) {
        let res = await getBlongPartsLog(id)
        if (res.data.code === 0 || res.data.code === 200) {
          this.partsLogList = res.data.data
        }
      },
      async getmodifyRecord(id) {
        let res = await modifyRecord({ id: id, type: 'BOM_MAINT' })
        if (res.data.code === 0 || res.data.code === 200) {
          this.bomLogList = res.data.data
        }
      },
      regionFormatter(row) {
        switch (row.countryReginCode) {
          case 1:
            return "欧盟";
          case 2:
            return "英国";
          case 3:
            return "泰国";
          case 4:
            return "印度";
          case 6:
            return "印尼";
          case 7:
            return "澳新";
          case 8:
            return "中东";
          case 9:
            return "南美";
          case 10:
            return "土耳其";
          case 11:
            return "以色列";
          case 12:
            return "香港";
          case 13:
            return "墨西哥";
          case 14:
            return "新加坡";
          case 15:
            return "马来西亚";
          case 16:
            return "台湾";
          case 17:
            return "俄罗斯";
          case 18:
            return "白俄罗斯";
          case 19:
            return "南非";
          case 20:
            return "埃及";
          default:
            return "Unknown";
        }
      },
      isIncludeTax(row) {
        switch (row.isIncludeTax) {
          case 0:
            return "否";
          case 1:
            return "是";
          default:
            return "-";
        }
      },
      statusFormatter(row) {
        switch (row.status) {
          case 1:
            return "待确认";
          case 2:
            return "生效中";
          case 3:
            return "零件已变更";
          case 4:
            return "报价已过期";
          default:
            return "Unknown";
        }
      },
      handleCurrentChange(currentPage) {
        this.queryInfo.pageNum = currentPage;
        this.getBomMaintList({});
      },
      handleSizeChange(pageSize) {
        this.queryInfo.pageSize = pageSize;
        this.getBomMaintList({});
      },
      getCost() {
        let list = {
          partsIdList: this.editForm.partsIdList,
          tbBomOtherCostList: this.editForm.tbBomOtherCostList,
          tbBomDevelopCostList: this.editForm.tbBomDevelopCostList,
          exchangeRate: this.editForm.exchangeRate,
        };
        getCostBom(list).then((res) => {
          if (res.data.code == 0) {
            this.editForm.costCny = res.data.data.costCny;
            this.editForm.cost = res.data.data.cost;
          }
        });
      },
      // 计算单件分摊成本
      getCostUnit(item) {
        if (!item.share) {
          item.costUnit = "";
          item.shareNumber = "";
          this.getCost();
        }
        if (item.share && item.costTotal && item.shareNumber) {
          item.costUnit = (item.costTotal / item.shareNumber).toFixed(2);
          this.getCost();
        }
      },
      searchChange() {
        this.queryInfo.pageNum = 1;
        this.getBomMaintList(this.query);
      },
      ResetChange() {
        this.$refs["query"].resetFields();
        this.queryInfo.pageNum = 1;
        this.getBomMaintList({});
      },
      getCurrency(params, key) {
        getCurrency(params).then((res) => {
          if (key === 'CurrencyList') {
            this.CurrencyList = res.data.data;
          } else if (key === 'vehicleBrandList') {
            this.vehicleBrandList = res.data.data
          }
  
        });
      },
      getSalesContractList(params) {
        getSalesContractList(params).then((res) => {
          this.saleContractList = res.data.data;
          this.saleContractList.unshift({
            titleName:'签署中',
            id:-1
          })
        });
      },
      activationNumberFn(row) {
        this.bomId = row.id;
        this.activationNumberRef = true;
      },
    },
    created() {
      this.bomList = bomListFn(this)
      this.init()
      this.getLicesneList()
      this.getUserList();
      this.getBomMaintList({});
      let codeArr = ["Map_Navigation", "VR_TTS", "Weather", "APP", "TSP", "OTA", "Online_Music", "platform", "TBOX", "MAIN_ENGINE",
        "DISPLAY_SCREEN", "SCREEN_POWER", 'ROBOT', "MANUAL", "OPERATOR", "APP_STORE", 'ECOLOGICAL_PACK']
      for (let code of codeArr) {
        this.getFunctionAndParts({ code: code });
      }
      this.getOptionsList({ code: "COUNTRY_REGIN" });
      this.getCurrency({ code: "CURRENCY" }, 'CurrencyList');
      this.getCurrency({ code: "VEHICLE_BRAND" }, 'vehicleBrandList');
      this.getSalesContractList();
    },
  };
  </script>
  
  <style scoped>
  .addClass {
    float: right;
    right: 300px;
    color: #203b71;
    cursor: pointer;
  }
  
  .flex-1 {
    flex: 1
  }
  
  .border-top {
    border-top: 1px solid #EBEEF5;
  }
  
  .column-list {
    display: flex;
    flex-direction: column;
  }
  .flexWrap{
    flex-wrap: wrap;
  }
  .flex-between{
    display: flex;
   
    justify-content: space-between;
    align-items: center;
  }
  
  .el-col {
    position: relative;
  }
  
  .deleteClass {
    position: absolute;
    right: 0;
    color: #203b71;
    cursor: pointer;
  }
  
  .unit-price {
    width: 80%;
  }
  
  .unit-price-label {
    position: absolute;
    top: -30px;
  }
  
  .delClass {
    position: absolute;
    right: 0;
    color: #203b71;
    cursor: pointer;
  }
  
  .right {
    float: right;
  }
  
  .red {
    color: red;
  }
  </style>
  