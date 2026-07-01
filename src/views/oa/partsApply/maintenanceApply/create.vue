<template>
  <basic-container>
    <p class="table-title">
      <span></span>盘点信息
    </p>
    <el-form :disabled="disabled" ref="form" :model="form" label-width="100px" :rules="rules">
      <el-form-item label="盘点说明" prop="checkRemark">
        <el-input type="textarea" v-model="form.checkRemark"></el-input>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import PartsApplyApi from "@/api/partsApply/index";
import { getPlace, getPartCategories } from "../util";
export default {
  data() {
    return {
      categoriesList: [],
      placeList: [],
      form: {
        checkRemark: "",
      },
      rules: {
        checkRemark: [
          { required: true, message: "请输入盘点说明", trigger: "blur" },
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
    };
  },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.init();
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
  },
  methods: {
    async init() {
      this.categoriesList = await getPartCategories();
      this.placeList = await getPlace();
    },
    async getDetail() {
      let res = await PartsApplyApi.details(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.propertyList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.propertyList = this.form.propertyList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      console.log(this.form);
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (valid) {
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}
@media (min-width: 768px) {
  .el-form-item {
    width: 48%;
  }
}

.fullscreenL {
  overflow: scroll;
}

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w-100 {
  width: 100%;
}

.dec-icon {
  color: #979797;
  background-color: #eaeaea;
  padding: 3px 6px;
  border-radius: 2px;
  margin-right: 20px;
}

.exitFull {
  position: absolute;
  padding: 20px;
  color: transparent;
  z-index: 1000;
}

.exitFull:hover {
  color: #fff;
  background-color: #000;
}

.botton-row {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.table-now {
}


.button-bottom {
    width: 100%;
    text-align: center;
}

.add-icon {
    color: #1D76FF;
    background-color: #DEEBFF;
    padding: 3px 6px;
    margin-right: 10px;
    border-radius: 2px;
}

.dec-icon {
    color: #979797;
    background-color: #EAEAEA;
    padding: 3px 6px;
    border-radius: 2px;
    margin-right: 20px;
}
</style>