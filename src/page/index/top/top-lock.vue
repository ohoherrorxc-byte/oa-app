<template>
  <span>
    <i class="icon-suoping"
       @click="handleLock"></i>
    <el-dialog title="Please set screen lock password"
               :visible.sync="box"
               width="30%"
               @close="handleClose"
               append-to-body>
      <el-form :model="form"
               ref="form"
               label-width="80px">
        <el-form-item label="Password"
                      prop="passwd"
                      :rules="[{ required: true, message: 'Screen lock password cannot be blank.'}]">
          <el-input v-model="form.passwd"
                    placeholder="Please input password" />
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="handleSetLock">OK</el-button>
      </span>
    </el-dialog>
  </span>
</template>

<script>
import { validatenull } from "@/util/validate";
import { mapGetters } from "vuex";
export default {
  name: "top-lock",
  data() {
    return {
      box: false,
      form: {
        passwd: ""
      }
    };
  },
  created() {},
  mounted() {},
  computed: {
    ...mapGetters(["lockPasswd"])
  },
  props: [],
  methods: {
    handleSetLock() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$store.commit("SET_LOCK_PASSWD", this.form.passwd);
          this.handleLock();
        }
      });
    },
    handleLock() {
      if (validatenull(this.lockPasswd)) {
        this.box = true;
        return;
      }
      this.$store.commit("SET_LOCK");
      setTimeout(() => {
        this.$router.push({ path: "/lock" });
      }, 100);
    },
    handleClose() {
      this.$refs.form.clearValidate();
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
</style>
