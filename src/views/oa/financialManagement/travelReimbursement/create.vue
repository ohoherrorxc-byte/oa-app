<template>
    <div>
        <basic-container>
            <p class="pb10">{{ $t('travelReimbursement.applyInfo') }}</p>
            <avue-form ref="formBaseInfo" :option="option" v-model="form">
                <template slot="tripApplyId">
                    <div class="flex">
                        <el-select v-if="!disabled" :filterable="true" v-model="form.tripApplyId" @change="changeTripApply"
                            :disabled="disabled">
                            <el-option v-for="item in tripList" :label="item.titleName" :value="item.id"></el-option>
                        </el-select>
                        <div v-else class="font12">{{ form.tripApply }}</div>
                        <p v-if="!isPdfDown" @click="toPath" class="detailLink">{{ $t('travelReimbursement.viewDetails') }}</p>
                    </div>
                </template>
                <template slot="payee">
                    <autoAddress placeholder="" ref="autoAddress" :initList="initList" class="w-100" @getPerson="getPerson"
                        :initData="form.payee" :disabled="disabled" :multiple="false">
                    </autoAddress>
                </template>
                <template slot="estimatedTotalAmount">
                      <div  class="font12">{{ form.estimatedTotalAmount }}</div>
                </template>
                <template slot="bankName">
                      <div  class="font12">{{ form.bankName }}</div>
                </template>
                <template slot="bankAccount">
                    <div class="font12">{{ form.bankAccount }}</div>
                </template>
            </avue-form>
        </basic-container>
        <basic-container>
            <p class="pb10">{{ $t('travelReimbursement.budgetInfo') }}</p>
            <avue-form :option="optionBudget" ref="formBudgetInfo" v-model="form">
                <template slot="subjectName">
                    <elSelectTree :value="{ name: form.subjectName }" v-if="!disabled" @getValue="getSubjetRow"
                        :options="subjectList" :accordion="false" :props="deptProps"></elSelectTree>
                    <!-- <avue-input-tree v-if="!disabled" :disabled="disabled" :defaultExpandAll="true" ref="tree"
                        :check-strictly="true" node-key="id" v-model="form.subjectId" placeholder="请选择内容" :dic="subjectList"
                        :props="deptProps" @change="getSubjetRow"></avue-input-tree> -->
                    <div v-else class="font12">{{ form.subjectName }}</div>
                    <!-- <el-input autosize v-else type="textarea" disabled v-model="form.subjectName" /> -->
                </template>
                <template slot="subjectCode">
                    <div class="font12">{{ form.subjectCode }}</div>
                </template>
                <!-- <template slot="costName">
                    <el-select v-model="form.costName" @change="getCostItem" :disabled="disabled">
                        <el-option v-for="item in costList" :label="item.costName" :value="item.costName"></el-option>
                    </el-select>
                </template> -->
            </avue-form>
        </basic-container>
        <el-form ref="form" :model="form" :rules="rules" :disabled="disabled">
            <basic-container>
                <span>{{ $t('travelReimbursement.trafficCostInfo') }}</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow('utilList')">+</span>
                    </div>
                    <el-table :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }" ref="multipleTable" :data="form.utilList"
                        @selection-change="handleSelectionChange" class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" :label="$t('travelReimbursement.serialNumber')">
                        </el-table-column>
                        <el-table-column property="startPlace" :label="$t('travelReimbursement.startPlace')" align="center" :width="isPdfDown ? 60 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.startPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'utilList.' + scope.$index + '.startPlace'" :rules="rules.startPlace">
                                    <el-input v-if="!disabled" v-model="scope.row.startPlace"></el-input>
                                    <div v-else>{{ scope.row.startPlace }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endPlace" label="目的地" align="center" :width="isPdfDown ? 60 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.endPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'utilList.' + scope.$index + '.endPlace'" :rules="rules.endPlace">
                                    <el-input v-if="!disabled" v-model="scope.row.endPlace"></el-input>
                                    <div v-else>{{ scope.row.endPlace }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="startTime" label="开始日期" align="center" :width="isPdfDown ? 60 : 140">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.startTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item class="w-100" :prop="'utilList.' + scope.$index + '.startTime'"
                                    :rules="rules.startTime">
                                    <el-date-picker v-if="!disabled" class="w-100" value-format="yyyy-MM-dd hh:mm:ss"
                                        v-model="scope.row.startTime" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <div v-else>{{ scope.row.startTime }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endTime" label="结束日期" align="center" :width="isPdfDown ? 60 : 140">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.endTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'utilList.' + scope.$index + '.endTime'" :rules="rules.endTime">
                                    <el-date-picker v-if="!disabled" class="w-100" value-format="yyyy-MM-dd hh:mm:ss"
                                        v-model="scope.row.endTime" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <div v-else>{{ scope.row.endTime }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="utilType" label="交通类型" align="center" :width="isPdfDown ? 70 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.utilType') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'utilList.' + scope.$index + '.utilType'"
                                    :rules="rules.utilType">
                                    <el-select v-if="!disabled" clearable v-model="scope.row.utilType">
                                        <el-option label="飞机" value="飞机"></el-option>
                                        <el-option label="火车" value="火车"></el-option>
                                        <el-option label="出租车" value="出租车"></el-option>
                                        <el-option label="巴士" value="巴士"></el-option>
                                        <el-option label="其他" value="其他"></el-option>
                                    </el-select>
                                    <div v-else>{{ scope.row.utilType }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('travelReimbursement.other')" align="center" :width="isPdfDown ? 50 : 120">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'utilList.' + scope.$index + '.other'"
                                    :rules="rules.other">
                                    <el-input v-if="!disabled" v-model="scope.row.other"></el-input>
                                    <div v-else>{{ scope.row.other }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="amount" :label="$t('travelReimbursement.amount')" align="center" :width="isPdfDown ? 50 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.amount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'utilList.' + scope.$index + '.amount'"
                                    :rules="rules.amount">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.amount"
                                        @blur="getRMB(scope.row, scope.$index, 'utilList')"></el-input>
                                    <div v-else>{{ scope.row.amount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="currency" label="币种" align="center" :width="isPdfDown ? 50 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.currency') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'utilList.' + scope.$index + '.currency'"
                                    :rules="rules.currency">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.currency"></el-input>
                                    <div v-else>{{ scope.row.currency }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="exchangeRate" :label="$t('travelReimbursement.exchangeRate')" align="center" :width="isPdfDown ? 50 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.exchangeRate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'utilList.' + scope.$index + '.exchangeRate'"
                                    :rules="rules.exchangeRate">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.exchangeRate"
                                        @blur="getRMB(scope.row, scope.$index, 'utilList')"></el-input>
                                    <div v-else>{{ scope.row.exchangeRate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="rmbAmount" :label="$t('travelReimbursement.rmbAmount')" align="center" :width="isPdfDown ? 60 : 120">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input v-if="!disabled" disabled v-model="scope.row.rmbAmount"></el-input>
                                    <div v-else>{{ scope.row.rmbAmount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="reason" label="报销事由" align="center" :width="isPdfDown ? 70 : 120">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.reason') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'utilList.' + scope.$index + '.reason'"
                                    :rules="rules.reason">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.reason"></el-input>
                                    <div v-else>{{ scope.row.reason }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row, 'utilList')"
                                        style="color:red">{{ $t('travelReimbursement.delete') }}</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <div class="form-all">
                    <el-form-item :label="$t('travelReimbursement.totalAmount')">
                        {{ getToTal('utilList').amount }}
                    </el-form-item>
                    <el-form-item :label="$t('travelReimbursement.amountInWords')"> {{ getToTal('utilList').amountChinese }}</el-form-item>
                </div>
            </basic-container>
            <basic-container>
                <span>{{ $t('travelReimbursement.accommodationCostInfo') }}</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow('hotelList')">+</span>
                    </div>
                    <el-table :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }" ref="multipleTable"
                        :data="form.hotelList" @selection-change="handleSelectionChange" class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('travelReimbursement.serialNumber')">
                        </el-table-column>
                        <el-table-column property="hotelName" label="酒店名称" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.hotelName') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'hotelList.' + scope.$index + '.hotelName'" :rules="rules.hotelName">
                                    <el-input v-if="!disabled" v-model="scope.row.hotelName"></el-input>
                                    <div v-else>{{ scope.row.hotelName }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="startTime" label="开始日期" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.startTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'hotelList.' + scope.$index + '.startTime'" :rules="rules.startTime">
                                    <el-date-picker v-if="!disabled" class="w-100" value-format="yyyy-MM-dd hh:mm:ss"
                                        v-model="scope.row.startTime" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <div v-else>{{ scope.row.startTime }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="endTime" label="结束日期" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.endTime') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'hotelList.' + scope.$index + '.endTime'" :rules="rules.endTime">
                                    <el-date-picker v-if="!disabled" class="w-100" value-format="yyyy-MM-dd hh:mm:ss"
                                        v-model="scope.row.endTime" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <div v-else>{{ scope.row.endTime }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="amount" label="金额" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.amount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'hotelList.' + scope.$index + '.amount'"
                                    :rules="rules.amount">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.amount"
                                        @blur="getRMB(scope.row, scope.$index, 'hotelList')"></el-input>
                                    <div v-else>{{ scope.row.amount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column label="币种" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.currency') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'hotelList.' + scope.$index + '.currency'"
                                    :rules="rules.currency">
                                    <el-input v-if="!disabled" v-model="scope.row.currency"></el-input>
                                    <div v-else>{{ scope.row.currency }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="exchangeRate" label="汇率" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.exchangeRate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'hotelList.' + scope.$index + '.exchangeRate'"
                                    :rules="rules.exchangeRate">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.exchangeRate"
                                        @blur="getRMB(scope.row, scope.$index, 'hotelList')"></el-input>
                                    <div v-else>{{ scope.row.exchangeRate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="rmbAmount" :label="$t('travelReimbursement.rmbAmount')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.rmbAmount" disabled></el-input>
                                    <div v-else>{{ scope.row.rmbAmount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('travelReimbursement.operation')" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row, 'hotelList')"
                                        style="color:red">{{ $t('travelReimbursement.delete') }}</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <div class="form-all">
                    <el-form-item :label="$t('travelReimbursement.totalAmount')">
                        {{ getToTal('hotelList').amount }}
                    </el-form-item>
                    <el-form-item :label="$t('travelReimbursement.amountInWords')"> {{ getToTal('hotelList').amountChinese }}</el-form-item>
                </div>
            </basic-container>
            <basic-container>
                <span>{{ $t('travelReimbursement.subsidyCostInfo') }}</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow('perkList')">+</span>
                    </div>
                    <el-table :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }" ref="multipleTable" :data="form.perkList"
                        @selection-change="handleSelectionChange" class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('travelReimbursement.serialNumber')">
                        </el-table-column>
                        <el-table-column property="perkPlace" :label="$t('travelReimbursement.subsidyPlace')" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.subsidyPlace') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'perkList.' + scope.$index + '.perkPlace'" :rules="rules.perkPlace">
                                    <el-select v-if="!disabled" v-model="scope.row.perkPlace">
                                        <el-option label="境外" value="境外"></el-option>
                                        <el-option label="境内" value="境内"></el-option>
                                    </el-select>
                                    <div v-else>{{ scope.row.perkPlace }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="projectType" :label="$t('travelReimbursement.projectType')" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.projectType') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'perkList.' + scope.$index + '.projectType'"
                                    :rules="rules.projectType">
                                    <el-input v-if="!disabled" v-model="scope.row.projectType"></el-input>
                                    <div v-else>{{ scope.row.projectType }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="amount" :label="$t('travelReimbursement.amount')" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.amount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'perkList.' + scope.$index + '.amount'" :rules="rules.amount">
                                    <el-input v-if="!disabled" v-model="scope.row.amount"
                                        @blur="getRMB(scope.row, scope.$index, 'perkList')"></el-input>
                                    <div v-else>{{ scope.row.amount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="currency" :label="$t('travelReimbursement.currency')" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.currency') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'perkList.' + scope.$index + '.currency'" :rules="rules.currency">
                                    <el-input v-if="!disabled" v-model="scope.row.currency"></el-input>
                                    <div v-else>{{ scope.row.currency }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="exchangeRate" :label="$t('travelReimbursement.exchangeRate')" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.exchangeRate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'perkList.' + scope.$index + '.exchangeRate'"
                                    :rules="rules.exchangeRate">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.exchangeRate"
                                        @blur="getRMB(scope.row, scope.$index, 'perkList')"></el-input>
                                    <div v-else>{{ scope.row.exchangeRate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('travelReimbursement.rmbAmount')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'perkList.' + scope.$index + '.rmbAmount'"
                                    :rules="rules.rmbAmount">
                                    <el-input v-if="!disabled" disabled v-model="scope.row.rmbAmount"></el-input>
                                    <div v-else>{{ scope.row.rmbAmount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="reason" :label="$t('travelReimbursement.reason')" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.reason') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'perkList.' + scope.$index + '.reason'"
                                    :rules="rules.reason">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.reason"></el-input>
                                    <div v-else>{{ scope.row.reason }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('travelReimbursement.operation')" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row, 'perkList')"
                                        style="color:red">{{ $t('travelReimbursement.delete') }}</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <div class="form-all">
                    <el-form-item :label="$t('travelReimbursement.totalAmount')"> {{ getToTal('perkList').amount }}</el-form-item>
                    <el-form-item :label="$t('travelReimbursement.amountInWords')"> {{ getToTal('perkList').amountChinese }}</el-form-item>
                </div>
            </basic-container>
            <basic-container>
                <span>{{ $t('travelReimbursement.otherCostInfo') }}</span>
                <el-form-item label-width="0" style="width: 100%;">
                    <div class="fr" v-if="!disabled">
                        <span class="add-icon" @click="addRow('otherList')">+</span>
                    </div>
                    <el-table :class="{ 'w-720': isPdfDown, 'w-100': !isPdfDown }" ref="multipleTable"
                        :data="form.otherList" @selection-change="handleSelectionChange" class="mb20 table-now">
                        <el-table-column prop="chooseStatus" type="index" width="50" :label="$t('travelReimbursement.serialNumber')">
                        </el-table-column>
                        <el-table-column property="time" label="费用日期" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.costDate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'otherList.' + scope.$index + '.time'" :rules="rules.time">
                                    <el-date-picker v-if="!disabled" class="w-100" value-format="yyyy-MM-dd hh:mm:ss"
                                        v-model="scope.row.time" type="date" placeholder="选择日期">
                                    </el-date-picker>
                                    <div v-else>{{ scope.row.time }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="projectName" label="费用项目" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.costProject') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'otherList.' + scope.$index + '.projectName'"
                                    :rules="rules.projectName">
                                    <el-input v-if="!disabled" v-model="scope.row.projectName"></el-input>
                                    <div v-else>{{ scope.row.projectName }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="amount" label="金额" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.amount') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'otherList.' + scope.$index + '.amount'" :rules="rules.amount">
                                    <el-input v-if="!disabled" v-model="scope.row.amount"
                                        @blur="getRMB(scope.row, scope.$index, 'otherList')"></el-input>
                                    <div v-else>{{ scope.row.amount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="currency" label="币种" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.currency') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item :prop="'otherList.' + scope.$index + '.currency'" :rules="rules.currency">
                                    <el-input v-if="!disabled" v-model="scope.row.currency"></el-input>
                                    <div v-else>{{ scope.row.currency }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="exchangeRate" label="汇率" align="center">
                            <template slot="header" slot-scope="{row}">
                                {{ $t('travelReimbursement.exchangeRate') }}
                                <span class="red">*</span>
                            </template>
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.exchangeRate"
                                        @blur="getRMB(scope.row, scope.$index, 'otherList')"></el-input>
                                    <div v-else>{{ scope.row.exchangeRate }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('travelReimbursement.rmbAmount')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;" :prop="'otherList.' + scope.$index + '.rmbAmount'"
                                    :rules="rules.rmbAmount">
                                    <el-input v-if="!disabled" disabled v-model="scope.row.rmbAmount"></el-input>
                                    <div v-else>{{ scope.row.rmbAmount }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column property="reason" :label="$t('travelReimbursement.reason')" align="center">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-input v-if="!disabled" clearable v-model="scope.row.reason"></el-input>
                                    <div v-else>{{ scope.row.reason }}</div>
                                </el-form-item>
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('travelReimbursement.operation')" align="center" v-if="!disabled">
                            <template slot-scope="scope">
                                <el-form-item style="width: 100%;">
                                    <el-button type="text" @click="deleteRow(scope.row, 'otherList')"
                                        style="color:red">{{ $t('travelReimbursement.delete') }}</el-button>
                                </el-form-item>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <div class="form-all">
                    <el-form-item :label="$t('travelReimbursement.totalAmount')"> {{ getToTal('otherList').amount }}</el-form-item>
                    <el-form-item :label="$t('travelReimbursement.amountInWords')"> {{ getToTal('otherList').amountChinese }}</el-form-item>
                </div>
            </basic-container>
        </el-form>
    </div>
</template>

<script>
import { numberToTraditionalChinese } from '@/util/util'
import { mixins } from "../Mixin";
import { mapGetters } from 'vuex';
import FinancialManagementApi from '@/api/financialManagement';
export default {
    mixins: [mixins],
    data() {
        return {
            isEdit: false,
            allTotalAmount: 0,
            tripList: [],
            form: {
                utilList: [],
                otherList: [],
                perkList: [],
                hotelList: []
            },
            amountObj: {
                utilListAmount: 0,
                otherListAmount: 0,
                perkListAmount: 0,
                hotelListAmount: 0,
            },
            subjectList: [],
            formPay: {},
            deptProps: {
                label: "subjectName",
                value: "id",
                children: "childList",
            },
            searchForm: {
                currentPage: 1,
                pageSize: 10000,
            },
            option: {
                column: [
                    {
                        type: "input",
                        label: this.$t('travelReimbursement.relatedTripApply'),
                        span: 12,
                        filterable: true,
                        prop: "tripApplyId",
                        rules: [
                            {
                                required: true,
                                message: this.$t('travelReimbursement.relatedTripApplyRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                          label: this.$t('travelReimbursement.payee'),
                        span: 12,
                        // disabled: true,
                        prop: "payee",
                        rules: [
                            {
                                required: true,
                                  message: this.$t('travelReimbursement.payeeRequired'),
                            },
                        ],
                    },
                    {
                       type: "input",
                       label: "出差申请预计费用",
                       span: 12,
                       prop: "estimatedTotalAmount",
                       disabled: true
                    },
                    {
                        type: "input",
                        label: this.$t('travelReimbursement.payeeBank'),
                        span: 12,
                        prop: "bankName",
                        disabled: true
                    },
                    {
                        type: "input",
                          label: this.$t('travelReimbursement.payeeAccount'),
                        span: 12,
                        prop: "bankAccount",
                        disabled: true
                    },
                ],
                labelPosition: "right",
                labelWidth: 160,
                gutter: 0,
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
                emptyText: this.$t('travelReimbursement.clear'),
                menuPosition: "center",
                detail: false,
                tabs: false,
                disabled: this.disabled,
                labelSuffix: " ",
            },
            optionBudget: {
                column: [
                    {
                        type: "input",
                        label: this.$t('travelReimbursement.budgetSubject'),
                        span: 12,
                        prop: "subjectName",
                        rules: [
                            {
                                required: true,
                                message: this.$t('travelReimbursement.budgetSubjectRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        label: this.$t('travelReimbursement.costCenter'),
                        span: 12,
                        prop: "costName",
                        disabled: true,
                        rules: [
                            {
                                required: true,
                                message: this.$t('travelReimbursement.costCenterRequired'),
                            },
                        ],
                    },
                    {
                        type: "input",
                        disabled: true,
                        label: this.$t('travelReimbursement.subjectCode'),
                        span: 12,
                        prop: "subjectCode",
                    },
                    {
                        type: 'textarea',
                        label: this.$t('travelReimbursement.budgetInfo'),
                        disabled: true,
                        span: 12,
                        prop: "budgetInfo",
                    },

                ],
                menuBtn: true,
                submitBtn: false,
                emptyBtn: false,
            },
            rules: {
                startTime: [
                    { required: true, message: this.$t('travelReimbursement.startTimeRequired'), trigger: 'change' }
                ],
                endTime: [
                    { required: true, message: this.$t('travelReimbursement.endTimeRequired'), trigger: 'change' }
                ],

                utilType: [
                    { required: true, message: this.$t('travelReimbursement.utilTypeRequired'), trigger: 'change' }
                ],
                startPlace: [
                    { required: true, message: this.$t('travelReimbursement.startPlaceRequired'), trigger: 'blur' }
                ],
                endPlace: [
                    { required: true, message: this.$t('travelReimbursement.endPlaceRequired'), trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: this.$t('travelReimbursement.amountRequired'), trigger: 'blur' }
                ],
                currency: [
                    { required: true, message: this.$t('travelReimbursement.currencyRequired'), trigger: 'blur' }
                ],
                exchangeRate: [
                    { required: true, message: this.$t('travelReimbursement.exchangeRateRequired'), trigger: 'blur' }
                ],
                reason: [
                    { required: true, message: this.$t('travelReimbursement.reasonRequired'), trigger: 'blur' }
                ],
                hotelName: [
                    { required: true, message: this.$t('travelReimbursement.hotelNameRequired'), trigger: 'blur' }
                ],
                perkPlace: [
                    { required: true, message: this.$t('travelReimbursement.perkPlaceRequired'), trigger: 'blur' }
                ],
                projectType: [
                    { required: true, message: this.$t('travelReimbursement.projectTypeRequired'), trigger: 'change' }
                ],
                time: [
                    { required: true, message: this.$t('travelReimbursement.costDateRequired'), trigger: 'change' }
                ],
                projectName: [
                    { required: true, message: this.$t('travelReimbursement.costProjectRequired'), trigger: 'blur' }
                ],
            },
        }
    },
    props: {
        slotForm: {
            type: Object,
            default: {}
        },
        isPdfDown: {
            type: Boolean,
            default: false
        }
    },
    mounted() {

    },
    computed: {
        ...mapGetters(['userInfo']),
        disabled() {
            return this.businessId && !this.$route.query.isEdit;
        },
    },
    methods: {
        getPerson(data) {
            this.form.payeeId = data.id
            this.form.payee = data.realName
        },
        toPath() {
            if (this.form.tripApplyId) {
                let url = `/onBusinessTrip?businessId=${this.form.tripApplyId}`
                window.open(this.$router.resolve({ path: url }).href, '_blank')
                // this.$router.push(`/onBusinessTrip?businessId=${this.form.tripApplyId}`)
            }
        },
        changeTripApply(v) {
            let row = this.tripList.find(ele => {
                return ele.id === v
            })
            console.log(v)
            //this.form.payee = row.tripUser
            //this.form.payeeId = row.tripUserId
            this.form.subjectName = row.subjectName
            this.form.subjectId = row.subjectId
            this.form.costName = row.costName
            this.form.costId = row.costId
            this.form.subjectCode = row.subjectCode
            this.form.tripApply = row.titleName
            this.form.estimatedTotalAmount = row.estimatedTotalAmount
            this.getFeeDetail()
            //   console.log(row)
            //   console.log(this.form)
        },
        deleteRow(row, key) {
            this.form[key] = this.form[key].filter(ele => {
                return ele !== row
            })
        },
        async getDetail() {
            let res = await FinancialManagementApi.travelReimbursementDetails(this.businessId);
            if (res.data.code === 200) {
                this.form = res.data.data;
                this.getFeeDetail()
                this.$emit("getFormData", this.form);
            }
        },
        addRow(key) {
            this.form[key].push({})
        },
        getRMB(row, index, key) {
            if (row.amount && row.exchangeRate) {
                row.rmbAmount = (Number(row.amount) * Number(row.exchangeRate)).toFixed(2)
            }
            this.$set(this.form[key], index, row)
        },
        getToTal(key) {
            var arr = this.form[key].map(ele => Number(ele.rmbAmount) || 0)
            var sum = arr.reduce(function (a, b) { return a + b }, 0)
            this.amountObj[key + 'Amount'] = sum
            this.allTotalAmount = Number(this.amountObj.utilListAmount) + Number(this.amountObj.otherListAmount) + Number(this.amountObj.perkListAmount) + Number(this.amountObj.hotelListAmount)
            this.$emit('allTotalAmount', this.allTotalAmount)
            return { amount: this.$formatAmt(sum), amountChinese: numberToTraditionalChinese(sum) }
        },
        testForm() {
            if (!this.slotForm.applyReason) {
                this.$message.error(this.$t('travelReimbursement.applyReasonRequired'))
                return false
            }
            return new Promise((resolve) => {
                this.$refs.formBaseInfo.validate((valid, done, msg) => {
                    msg &&
                        this.$message({
                            message: Object.values(msg)[0][0].message,
                            type: "warning",
                        });
                    this.$refs.formBudgetInfo.validate((validBudget, done, msg1) => {
                        msg1 &&
                            this.$message({
                                message: Object.values(msg1)[0][0].message,
                                type: "warning",
                            });
                        this.$refs.form.validate((validForm, msg2, done) => {
                            !validForm && msg2 &&
                                this.$message({
                                    message: Object.values(msg2)[0][0].message,
                                    type: "warning",
                                });
                            resolve(valid && validForm && validBudget);
                        })
                    })

                    done();
                });
            });

        }
    }
}

</script>

<style lang="scss" scoped> .form-all {
     display: flex;
     flex-wrap: wrap;

     .el-form-item {
         width: 50%;
     }
 }

 .add-icon {
     color: #1D76FF;
     background-color: #DEEBFF;
     padding: 3px 6px;
     margin-right: 10px;
     border-radius: 2px;
 }

 .w-100 {
     width: 100%;
 }
</style>
