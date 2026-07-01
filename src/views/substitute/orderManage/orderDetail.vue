<template>
  <div>
    <div class="fr" v-if="!disabled">
      <span class="add-icon" @click="addRow">+</span>
      <span class="add-icon" @click="openPartsDialog">选择零件</span>
      <!-- <span class="dec-icon" @click="deleteChooseRow">―</span> -->
      <!-- <img @click="copyChoose" class="mt3" src="@/assets/svg/copy.svg" width="24" alt=""> -->
    </div>

    <!-- 零件选择弹窗 -->
    <el-dialog
      title="选择零件"
      :visible.sync="partsDialogVisible"
      width="800px"
      append-to-body
    >
      <el-form :inline="true" class="search-form">
        <el-form-item label="零件号">
          <el-input v-model="partsSearchParams.partsNo" placeholder="请输入零件号" clearable @keyup.enter.native="searchParts"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchParts">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table
        :data="filteredPartsList"
        @selection-change="handlePartSelectionChange"
        border
        ref="partsTable"
        max-height="400"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column prop="partsName" label="零件名称"></el-table-column>
        <el-table-column prop="partsNo" label="零件编号"></el-table-column>
        <el-table-column prop="externalPartNo" label="外部零件号"></el-table-column>
        <el-table-column prop="supplierName" label="供应商名称"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="partsDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmPartsSelection">确认</el-button>
      </span>
    </el-dialog>
    <table style="width: 100%" border>
      <thead>
        <tr>
          <th rowspan="4"><span></span></th>
          <th rowspan="4"><span class="red">*</span>零件名称</th>
          <th rowspan="4"><span class="red">*</span>零件号</th>
          <th rowspan="4"><span class="red">*</span>要求到货日期</th>
          <th rowspan="4"><span class="red">*</span>需求数量</th>
          <!-- <th rowspan="4">项目名称</th> -->
          <th rowspan="4">收货仓名称</th>
          <th rowspan="4">收货联系人</th>
          <th rowspan="4">联系人电话</th>
          <th rowspan="4">收货地址</th>
          <th rowspan="4">备注</th>
          <th rowspan="4">订单编号</th>
          <th rowspan="4" v-if="formData.orderType === 1">
           阶段
          </th>
          <th rowspan="2" v-if="!isDetail">操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in tableData" :key="index">
          <td>
            <el-checkbox v-model="item.checked"></el-checkbox>
          </td>
          <td>
            <div>
              <el-select
                :disabled="isDetail"
                @change="changePart(item)"
                v-model="item.partsNumber"
                filterable
                clearable
              >
                <el-option
                  v-for="part in partList"
                  :key="part.id"
                  :label="part.partsName"
                  :value="part.partsNo"
                ></el-option>
              </el-select>
              <el-input
                v-if="
                  !isSame(item.partsName, item.oldPartsName) &&
                  !isDetail &&
                  isUpdateFlow
                "
                type="textarea"
                placeholder="零件名称变更原因"
                v-model="item.partsNameRemark"
              ></el-input>
              <div class="font12 red" v-if="isDetail && item.partsNameRemark">
                变更原因：{{ item.partsNameRemark }}
              </div>
            </div>
          </td>
          <td>
            <div>
              <el-select
                :disabled="isDetail"
                @change="changePart(item)"
                v-model="item.partsNumber"
                filterable
                clearable
              >
                <el-option
                  v-for="part in partList"
                  :key="part.id"
                  :label="part.partsNo"
                  :value="part.partsNo"
                ></el-option>
              </el-select>
              <!-- <el-input
                v-model="item.partsNumber"
                :disabled="isDetail"
              ></el-input> -->
              <el-input
                v-if="
                  !isSame(item.partsName, item.oldPartsName) &&
                  !isDetail &&
                  isUpdateFlow
                "
                type="textarea"
                placeholder="零件号变更原因"
                v-model="item.partsNumberRemark"
              ></el-input>
              <div class="font12 red" v-if="isDetail && item.partsNumberRemark">
                变更原因：{{ item.partsNumberRemark }}
              </div>
            </div>
          </td>
          <td>
            <el-date-picker
              style="width: 100%"
              value-format="yyyy-MM-dd HH:mm:ss"
              clearable
              :disabled="isDetail"
              v-model="item.needDate"
              type="date"
            ></el-date-picker>
            <el-input
              v-if="
                !isSame(item.needDate, item.oldNeedDate) &&
                !isDetail &&
                isUpdateFlow
              "
              type="textarea"
              placeholder="零件号变更原因"
              v-model="item.needDateRemark"
            ></el-input>
            <div class="font12 red" v-if="isDetail && item.needDateRemark">
              变更原因：{{ item.needDateRemark }}
            </div>
          </td>
          <td>
            <div>
              <el-input v-model="item.needNumber" :disabled="isDetail">
              </el-input>
              <el-input
                v-if="
                  !isSame(item.needNumber, item.oldNeedNumber) &&
                  !isDetail &&
                  isUpdateFlow
                "
                type="textarea"
                placeholder="需求数量变更原因"
                v-model="item.needNumberRemark"
              ></el-input>
              <div class="font12 red" v-if="isDetail && item.needNumberRemark">
                变更原因：{{ item.needNumberRemark }}
              </div>
            </div>
          </td>
          <!-- <td> <el-select v-model="item.projectNo" clearable filterable @change="projectRow(item)">
                            <el-option v-for="project in projectList" :key="project.id" :label="project.projectName"
                                :value="project.projectNo"></el-option>
                        </el-select>
                    </td> -->
          <td>
            <el-select
              @change="getRow(item)"
              :disabled="isDetail"
              style="width: 100%"
              clearable
              v-model="item.storageName"
            >
              <el-option
                v-for="self in storeList"
                :label="self.storeName"
                :value="self.storeName"
                :key="self.storeName"
              >
              </el-option>
            </el-select>
            <el-input
              v-if="
                !isSame(item.storageName, item.oldStorageName) &&
                !isDetail &&
                isUpdateFlow
              "
              type="textarea"
              placeholder="收货仓变更原因"
              v-model="item.storageNameRemark"
            ></el-input>
            <div class="font12 red" v-if="isDetail && item.storageNameRemark">
              变更原因：{{ item.storageNameRemark }}
            </div>
          </td>
          <td>
            <el-input
              :disabled="isDetail"
              v-model="item.takeOverConnect"
              clearable
            ></el-input>
          </td>
          <td>
            <el-input
              :disabled="isDetail"
              v-model="item.connectNumber"
              clearable
            >
            </el-input>
          </td>
          <td>
            <el-input :disabled="isDetail" v-model="item.address" clearable>
            </el-input>
          </td>
          <td>
            <el-input
              :disabled="isDetail"
              type="textarea"
              v-model="item.remark"
              clearable
            >
            </el-input>
            <el-input
              v-if="
                !isSame(item.remark, item.oldRemark) &&
                !isDetail &&
                isUpdateFlow
              "
              type="textarea"
              placeholder="备注变更原因"
              v-model="item.remarkUpdate"
            ></el-input>
            <div class="font12 red" v-if="isDetail && item.remarkUpdate">
              变更原因：{{ item.remarkUpdate }}
            </div>
          </td>
          <td class="font12">{{ item.orderPartNo }}</td>
          <td v-if="formData.orderType === 1">
            <el-input :disabled="isDetail" v-model="item.stage"></el-input>
          </td>
          <td
            @click="delRow(index)"
            v-if="!(isUpdateFlow && formData.id) && !isDetail"
          >
            <i class="el-icon-remove-outline"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
   
<script>
import { subList } from "@/api/contract/partsSubMaint";
import { getProjectList } from "@/api/contract/contractProject";
import substituteOrderManageApi from "../../../api/substitute/orderManage";
export default {
  data() {
    return {
      projectList: [],
      isDetail: false,
      subPartList: [],
      tableData: [
        {
          partsNumber: "",
          partsName: "",
          externalPartNo: null,
          chineseName: null,
          childrenFunctionName: null,
          needDate: null,
          needNumber: null,
          stage: "",
          checked: false,
          oldPartsNumber: "",
          oldPartsName: "",
          oldExternalPartNo: null,
          oldChineseName: null,
          oldChildrenFunctionName: null,
          oldNeedDate: null,
          oldNeedNumber: null,
          oldStage: "",
          oldStorageName: null,
          oldRemark: null,
          storageName: null,
          remark: null,
        },
      ],
      partList: [],
      mainPartList: [],
      partsDialogVisible: false,
      selectedParts: [],
      partsSearchParams: {
        partsNo: ''
      },
      storeList: [],
    };
  },
  props: {
    formData: {
      type: Object,
      default: {},
    },
    isUpdateFlow: {
      type: Boolean,
      default: false,
    },
    isDetailFlow: {
      default: false,
      type: Boolean,
    },
  },
  watch: {
    "formData.deliverDtos"() {
      // console.log(this.formData);
      this.tableData = this.formData.deliverDtos || [];
      this.tableData.map((ele) => {
        ele.oldChildrenFunctionName = ele.oldChildrenFunctionName
          ? ele.oldChildrenFunctionName
          : ele.childrenFunctionName;
        ele.oldPartsName = ele.oldPartsName ? ele.oldPartsName : ele.partsName;
        ele.oldNeedDate = ele.oldNeedDate ? ele.oldNeedDate : ele.needDate;
        ele.oldPartsNumber = ele.oldPartsNumber
          ? ele.oldPartsNumber
          : ele.partsNumber;
        ele.oldStage = ele.oldStage ? ele.oldStage : ele.stage;
        ele.oldExternalPartNo = ele.oldExternalPartNo
          ? ele.oldExternalPartNo
          : ele.externalPartNo;
        ele.oldChineseName = ele.oldChineseName
          ? ele.oldChineseName
          : ele.chineseName;
        ele.oldNeedNumber = ele.oldNeedNumber
          ? ele.oldNeedNumber
          : ele.needNumber;
        ele.oldRemark = ele.oldRemark ? ele.oldRemark : ele.remark;
        ele.oldStorageName = ele.oldStorageName
          ? ele.oldStorageName
          : ele.storageName;
      });
    },
    "formData.supplierNo"(newVal) {
      this.filterPartsBySupplier(newVal);
    },
    isDetailFlow(val) {
      this.isDetail = val;
    },
  },
  computed: {
    filteredPartsList() {
      if (!this.partsSearchParams.partsNo) {
        return this.partList;
      }
      return this.partList.filter(part =>
        part.partsNo && part.partsNo.toLowerCase().includes(this.partsSearchParams.partsNo.toLowerCase())
      );
    }
  },
  mounted() {
    this.getContractProjectList();
    this.getPartList();
    this.getStoreList();
    this.getSubList();
  },
  methods: {
    async getPartList() {
      let res = await substituteOrderManageApi.partsMaintList();
      this.partList = res.data.data || [];
      this.mainPartList = [...this.partList];
    },
    async filterPartsBySupplier(supplierNo) {
      if (!supplierNo) {
        await this.getPartList();
        await this.getSubList();
        return;
      }
      let res = await substituteOrderManageApi.partsMaintListBySupplier(supplierNo);
      if (res.data.code === 200 || res.data.code === 0) {
        this.partList = res.data.data || [];
      }
    },
    async getSubList() {
      let res = await subList();
      if (res.data.code === 200 || res.data.code === 0) {
        this.subPartList = res.data.data;
      }
    },
    async setPartList(val) {
      if (this.mainPartList.length === 0) {
        await this.getPartList();
      }
      if (this.subPartList.length === 0) {
        await this.getSubList();
      }
      if (val === "是") {
        this.partList = this.mainPartList;
      } else if (val === "否") {
        this.partList = this.subPartList;
      }
      // 如果有供应商编号，进一步过滤
      if (this.formData.supplierNo) {
        await this.filterPartsBySupplier(this.formData.supplierNo);
      }
      // console.log(this.partList)
      // console.log('partList222')
    },
    isSame(row, oldRow) {
      return row === oldRow;
    },
    copyChoose() {},
    async getStoreList() {
      let res = await substituteOrderManageApi.storeList();
      this.storeList = res.data.data.records;
    },
    getRow(item) {
      let row = this.storeList.find((ele) => {
        return ele.storeName === item.storageName;
      });
      if (row) {
        item.address = row.storeAddress;
        item.connectNumber = row.phone;
        item.takeOverConnect = row.principal;
      }
    },
    changePart(item) {
      let row = this.partList.find((ele) => {
        return ele.partsNo === item.partsNumber;
      });
      // console.log(row)
      // console.log(item);
      item.chineseName = row.chineseName;
      item.externalPartNo = row.externalPartNo;
      item.childrenFunctionName = row.childrenFunctionName;
      item.childenFuncionName = row.childrenFunctionName;
      item.childrenFunction = row.childrenFunction;
      item.partsName = row.partsName;
    },
    addRow() {
      this.tableData.push({
        partsNumber: "",
        partsName: "",
        needDate: null,
        needNumber: null,
        externalPartNo: null,
        chineseName: null,
        storageName: null,
        childrenFunctionName: null,
        stage: "",
        checked: false,
        remark: null,
        oldChildrenFunctionName: null,
        oldPartsName: null,
        oldPartsNumber: null,
        oldNeedDate: null,
        oldNeedNumber: null,
        oldExternalPartNo: null,
        oldStorageName: null,
        oldChineseName: null,
        oldStage: null,
        oldRemark: null,
      });
    },
    delRow(index) {
      this.tableData.splice(index, 1);
    },
    getContractProjectList() {
      getProjectList().then((res) => {
        this.projectList = res.data.data;
      });
    },
    test() {
      let obj = {
        partsNumber: "零件号",
        partsName: "零件名称",
        needDate: "要求到货日期",
        needNumber: "需求数量",
      };
      // if (this.formData.orderType === 1) {
      //   obj = { ...obj, stage: "阶段" };
      // }
      console.log(this.tableData);
      for (let i = 0; i < this.tableData.length; i++) {
        let ele = this.tableData[i];
        // console.log(ele);
        for (let key in obj) {
          if (!ele[key]) {
            this.$message.error(`请填写${obj[key]}`);
            return false;
          }
        }
      }
      return true;
    },
    projectRow(item) {
      let row = this.projectList.find((ele) => {
        return ele.projectNo === item.projectNo;
      });
      if (row) {
        item.projectName = row.projectName;
      }
    },
    openPartsDialog() {
      this.selectedParts = [];
      this.partsSearchParams.partsNo = '';
      this.partsDialogVisible = true;
    },
    searchParts() {
      this.$forceUpdate();
    },
    handlePartSelectionChange(selection) {
      this.selectedParts = selection;
    },
    confirmPartsSelection() {
      if (this.selectedParts.length === 0) {
        this.$message.warning('请至少选择一条零件数据');
        return;
      }
      this.selectedParts.forEach(part => {
        this.tableData.push({
          partsNumber: part.partsNo,
          partsName: part.partsName,
          externalPartNo: part.externalPartNo,
          chineseName: part.chineseName,
          childrenFunctionName: part.childrenFunctionName,
          childenFuncionName: part.childrenFunctionName,
          childrenFunction: part.childrenFunction,
          needDate: null,
          needNumber: null,
          storageName: null,
          stage: "",
          checked: false,
          remark: null,
          oldChildrenFunctionName: null,
          oldPartsName: null,
          oldPartsNumber: null,
          oldNeedDate: null,
          oldNeedNumber: null,
          oldExternalPartNo: null,
          oldStorageName: null,
          oldChineseName: null,
          oldStage: null,
          oldRemark: null,
        });
      });
      this.partsDialogVisible = false;
    },
  },
};
</script>

<style scoped lang="scss">
tr {
  text-align: center;
}

table {
  border: 1px solid #dcdfe6;
  color: #606266;
}
.red {
  color: #f56c6c;
}
.search-form {
  margin-bottom: 10px;
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>