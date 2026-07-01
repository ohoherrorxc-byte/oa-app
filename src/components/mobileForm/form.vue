<template>
  <el-drawer :visible.sync="drawer" :modal="false" size="100%">
    <div class="drawer">
      <div class="flex-space">
        <el-link
          :type="current === 1 ?'': 'primary'"
          :underline="false"
          :disabled="current === 1"
          @click="page('up')"
        >上一页</el-link>
        <el-link
          :type="current === optionList.length?'': 'primary'"
          :disabled="current === optionList.length"
          :underline="false"
          @click="page('down')"
        >下一页</el-link>
      </div>
      <div>序号 ： {{ current}}</div>

        <div v-for="(item,index) in optionList" :key="item.prop">
          <avue-form v-model="formList[index]" :option="item" v-show="index + 1 === current" ref="form">
          </avue-form>
        </div>

      <div class="flex">
        <el-button type="primary" icon="el-icon-plus" @click="add"></el-button>
        <el-button type="primary" icon="el-icon-minus" @click="del"></el-button>
        <el-button type="primary" icon="el-icon-check" @click="submit"></el-button>
      </div>
    </div>
  </el-drawer>
</template>
<script>

export default {
  props: {
    formList: {
      default: () => [],
    },
    option: {
      default: () => [],
    },
    current: {
      default: 1,
    },
  },
  data() {
    return {
      drawer: false,
      form: {
        submitBtn: false,
        emptyBtn: false,
      },
      validateCount:1,
    };
  },
  computed: {
    optionList() {
      return this.option.map((element) => {
        return {
          ...this.form,
          ...element,
        };
      });
    },
    currentForm() {
      return this.formList[this.current - 1];
    },
  },

  methods: {
    show() {
      this.drawer = true;
    },
    page(p) {
      if (p === "up") {
        this.current--;
      }
      if (p === "down") {
        this.current++;
      }
    },
    add() {
      this.option.push(this.option[0]);
      this.current = this.optionList.length;
    },
    del() {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.option.splice(this.current - 1, 1);
        this.formList.splice(this.current - 1, 1);
        this.$emit("submit", this.formList);
        let current = this.current === 1 ? 1 : this.current - 1;
        this.current = current;
        this.$message({
          type: "success",
          message: "删除成功!",
        });
        if (this.option.length === 0) {
          this.drawer = false;
        }
      });
    },
    submit() {
      for (var i = 0; i < this.$refs.form.length; i++) {
         this.$refs.form[i].validate((valid) => {
         if (!valid) {
              this.$message({
                type: "warning",
                message: '序号'+i+'存在必填项为空！',
              });

              this.validateCount+=1;
            }
            else{
              this.validateCount=0;
            }
        });
     }

     if(this.validateCount==0){
        this.$emit("submit", this.formList);
        this.drawer = false;
     }
    },
  },
};
</script>
<style scoped lang="scss">
.drawer {
  margin: 1rem;
}
</style>
