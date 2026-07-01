<template>
  <el-dialog
    title="新建客户订单"
    :visible.sync="dialogFormVisible"
    :append-to-body="true"
  >
    <el-form :model="form" :rules="rules" ref="ruleForm"  :disabled="isDetail">
      <el-form-item label="零件号" prop="partsNumber" :label-width="formLabelWidth">
        <el-select
          v-model="form.partsNumber"
          :placeholder="$t('stock.pleaseSelectPartsNo')"
          filterable
          @change="getTableList"
        >
          <el-option
            v-for="item in partsMaintListList"
            :key="item.partsNo"
            :label="item.partsNo"
            :value="item.partsNo"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="零件名称" :label-width="formLabelWidth">
        <el-input v-model="form.partsName"></el-input>
      </el-form-item>
      <el-form-item
        label="需求属性"
        prop="requireAttr"
        :label-width="formLabelWidth"
      >
        <el-select v-model="form.requireAttr" style="width: 100%">
          <el-option value="订单" label="订单"></el-option>
          <el-option value="预测" label="预测"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户名称" :label-width="formLabelWidth">
        <el-input v-model="form.customName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        prop="customNeedNumber"
        label="客户要求数量"
        :label-width="formLabelWidth"
      >
        <el-input v-model="form.customNeedNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item
        label="客户要求到SOIMT仓库时间"
        :label-width="formLabelWidth"
        prop="arrivalSomitWarehouseDate"
      >
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="form.arrivalSomitWarehouseDate"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目名称" :label-width="formLabelWidth">
        <el-input v-model="form.projectName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="零件英文名称" :label-width="formLabelWidth">
        <el-input v-model="form.englishName" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="PO" :label-width="formLabelWidth">
        <el-input v-model="form.po" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="历史零件号" :label-width="formLabelWidth">
        <el-input v-model="form.oldPartsNumber" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="交付地点" :label-width="formLabelWidth">
        <el-input v-model="form.payPlace" autocomplete="off"></el-input>
      </el-form-item>
      <!-- <el-form-item label="ETA LCB" :label-width="formLabelWidth">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="form.etaLcb"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="ETD SH" :label-width="formLabelWidth">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="form.etdSh"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="预测释放时间" :label-width="formLabelWidth">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="form.forecastReleaseTime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单释放时间" :label-width="formLabelWidth">
        <el-date-picker
          style="width: 100%"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          v-model="form.orderReleaseTime"
          type="date"
          placeholder="选择日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单释放是否超交期" :label-width="formLabelWidth">
        <el-radio-group v-model="form.isOrderOverdue">
          <el-radio label="是">是</el-radio>
          <el-radio label="否">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="订单是否释放给供应商" :label-width="formLabelWidth">
        <el-radio-group v-model="form.isOrderReleasedToSupplier">
          <el-radio label="是">是</el-radio>
          <el-radio label="否">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="备注" :label-width="formLabelWidth">
        <el-input
          type="textarea"
          v-model="form.remark"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="附件" :label-width="formLabelWidth">
        <upload
          :fileList="form.fileList"
          btnName="上传"
          @handleRequest="handleRequest"
          :multiple="true"
          :showFileList="true"
        ></upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" v-if="!isDetail" @click="insertOrder">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import upload from "@/components/upload/index";
import { getPartsMaintList } from "@/api/base";
import CustomerOrderApi from "@/api/customerOrder/index";
import { getList } from "@/api/system/menu";
export default {
  components: { upload },
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: "150px",
      isDetail:false,
      form: {
        fileList: [],
        partsNo: null,
        partsName: null,
        requireAttr: null,
        customName: null,
        customNeedNumber: null,
        arrivalSomitWarehouseDate: null,
        projectName: null,
        englishName: null,
        po: null,
        oldPartsNumber: null,
        payPlace: null,
        etaLcb: null,
        etdSh: null,
        forecastReleaseTime: null,
        orderReleaseTime: null,
        isOrderOverdue: null,
        isOrderReleasedToSupplier: null,
        remark: null,
      },
      rules: {
        partsNumber: [
          { required: true, message: "请选择零件号", trigger: "change" },
        ],
        requireAttr: [
          { required: true, message: "请选择需求属性", trigger: "change" },
        ],
        customNeedNumber: [
          { required: true, message: "请输入客户要求数量", trigger: "change" },
        ],
        arrivalSomitWarehouseDate: [
          {
            required: true,
            message: "请选择客户要求到SOIMT仓库时间",
            trigger: "change",
          },
        ],
      },
      partsMaintListList: [],
    };
  },
  mounted() {
    getPartsMaintList().then((res) => {
      this.partsMaintListList = res.data.data;
    });
  },
  methods: {
    getTableList(v) {
      let one = this.partsMaintListList.find((ele) => {
        return ele.partsNo === v;
      });
      if (one) {
        this.form.partsName = one.partsName;
        this.form.englishName = one.englishName;
        this.form.projectName = one.projectName;
      }
    },
    getClean() {
      this.form = {
        fileList: [],
        partsNo: null,
        partsName: null,
        requireAttr: null,
        customName: null,
        customNeedNumber: null,
        arrivalSomitWarehouseDate: null,
        projectName: null,
        englishName: null,
        po: null,
        oldPartsNumber: null,
        payPlace: null,
        etaLcb: null,
        etdSh: null,
        forecastReleaseTime: null,
        orderReleaseTime: null,
        isOrderOverdue: null,
        isOrderReleasedToSupplier: null,
        remark: null,
      };
    },
    async getDetail(row) {
      if (row.id) {
        let res = await CustomerOrderApi.detail(row.id);
        if (res.data.code === 200 || res.data.code === 0) {
          this.form = res.data.data;
        }
      }
    },
    handleRequest(row, arr) {
      this.form.fileList = arr;
    },
    async insertOrder() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await CustomerOrderApi.add(this.form);
          if (res.data.code === 200 || res.data.code === 0) {
            this.dialogFormVisible = false;
            this.$message.success("已新增");
            this.$emit("getList");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
