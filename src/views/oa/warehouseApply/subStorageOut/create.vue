<template>
    <basic-container>
        <el-row>
            <el-form label-width="120px">
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.number')">
                        {{ form.stockOutNo }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.date')">
                        {{ form.stockOutDate }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('commonContent.batchNo')">
                        {{ form.batchNo }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('commonContent.status')">
                        {{ form.status === 0 ? $t('commonContent.draft') :
                            $t('commonContent.submitted') }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.ladingNo')">
                        {{ form.ladingNo }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('commonContent.queryWebsite')">
                        <el-link type="primary" :href="form.queryWebsite" target="_blank">{{ form.queryWebsite }}</el-link>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.departureTime')">
                        {{ form.departureTime }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.arrivalTime')">
                        {{ form.arrivalTime }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.purpose')">
                        {{ useToFn(form.useTo) }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('stockOut.tradeMode')">
                        {{ form.tradeMode }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('commonContent.invoiceNo')">
                        {{ form.invoiceNo }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('commonContent.approvalStage')">
                        {{ form.approvalStage }}
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item :label="$t('commonContent.remark')">
                        {{ form.remark }}
                    </el-form-item>
                </el-col>
            </el-form>
        </el-row>
        <el-table :data="form.detailList" border class="mt10">
            <el-table-column prop="partsNo" :label="$t('parts.number')"></el-table-column>
            <el-table-column prop="partsName" :label="$t('parts.name')" show-overflow-tooltip width="200"></el-table-column>
            <el-table-column prop="stockInNo" :label="$t('stockIn.number')"></el-table-column>
            <el-table-column prop="intoTime" :label="$t('stockIn.date')"></el-table-column>
            <el-table-column prop="storeName" :label="$t('commonContent.warehouse')"></el-table-column>
            <el-table-column prop="goodsShelvesNo" :label="$t('stockIn.receiptNumber')"></el-table-column>
            <el-table-column prop="seriesName" :label="$t('parts.series')"></el-table-column>
            <el-table-column prop="country" :label="$t('commonContent.country')"></el-table-column>
            <el-table-column prop="quantity" :label="$t('stockOut.quantity')"></el-table-column>
        </el-table>
    </basic-container>
</template>

<script>
import WarehouseApplyApi from "@/api/warehouseApply/index";
import { getOptions } from "@/api/base";
export default {
    data() {
        return {
            form: {

            },
            useToList: []
        }
    },
    mounted() {
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
        this.init();
    },
    methods: {
        init() {
            getOptions({ code: "useTo" }).then((res) => {
                this.useToList = res.data.data;
            });
        },
        async getDetail() {
            let res = await WarehouseApplyApi.financeCategoryStockOutApplyDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.$emit("getFormData", this.form);
            }
        },
        useToFn(val) {
            const dict = this.useToList.find((item) => item.dictKey == val);
            return dict ? dict.dictValue : "";
        }
    }
}
</script>