<template>
  <div class="work-week-report-from-image">
<button class="save-table-btn" type="button" @click="saveTableData">保存</button>
<button class="export-pdf-btn" type="button" @click="exportPageToPdf">导出PDF</button>
  <div class="sheet">
    <h1 class="page-main-title">SOIMT月报</h1>
    <section class="report-outline-section">
    <h2
      class="section-overview-title section-overview-title--collapsible"
      role="button"
      tabindex="0"
      :aria-expanded="reportCollapsible.company ? 'true' : 'false'"
      aria-controls="report-section-company-body"
      @click="toggleReportSection('company')"
      @keydown.enter.prevent="toggleReportSection('company')"
      @keydown.space.prevent="toggleReportSection('company')"
    >
      <span class="section-overview-title__chevron" aria-hidden="true">{{ reportCollapsible.company ? '▼' : '▶' }}</span>
      <span class="section-overview-title__label">一.公司经营及主要项目概述</span>
    </h2>
    <div id="report-section-company-body" v-show="reportCollapsible.company" class="report-outline-section__body">
    <div class="company-overview-block">
      <div class="sales-wrap">
      <div class="sales-title sales-title--goals">
        <div>目标</div>
        <div class="sales-title--goals-detail">
          <p class="sales-title--goals-line">1.销售额4亿</p>
          <p class="sales-title--goals-line">2.To C 转型</p>
          <p class="sales-title--goals-line">3.三大项目</p>
        </div>
      </div>
      <div class="sales-title">
        <div>销售情况</div>
        <div class="unit">货币单位：人民币（万元）</div>
      </div>
      <table class="sales" aria-label="销售情况表">
        <colgroup>
          <col style="width: 26%">
          <col style="width: 14%">
          <col style="width: 17%">
          <col style="width: 12%">
          <col style="width: 10%">
          <col style="width: 5%">
          <col style="width: 6%">
          <col style="width: 10%">
        </colgroup>
        <thead>
          <tr>
            <th rowspan="2">序号</th>
            <th rowspan="2">产品大类</th>
            <th rowspan="2">主要产品</th>
            <th rowspan="2">2026年 全年计划</th>
            <th>今年至今</th>
            <th>本周</th>
            <th>全年计划完成率</th>
            <th rowspan="2">Comments</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" class="cell-input" value="一" /></td>
            <td><input type="text" class="cell-input" value="软件许可" /></td>
            <td><textarea class="cell-textarea" rows="2">iSmart网联服务</textarea></td>
            <td class="num"><input type="text" class="cell-input" value="13,529" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="66%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="二" /></td>
            <td><input type="text" class="cell-input" value="智能硬件" /></td>
            <td><input type="text" class="cell-input" value="娱乐主机、屏幕、TBOX等智能硬件" /></td>
            <td class="num"><input type="text" class="cell-input" value="21,026" /></td>
            <td class="num"><input type="text" class="cell-input" value="20,709" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="98%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="三" /></td>
            <td><input type="text" class="cell-input" value="软件开发" /></td>
            <td><input type="text" class="cell-input" value="车机软件开发" /></td>
            <td class="num"><input type="text" class="cell-input" value="6,445" /></td>
            <td class="num"><input type="text" class="cell-input" value="3,054" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="47%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr class="total">
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="合计" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td class="num"><input type="text" class="cell-input" value="41,040" /></td>
            <td class="num"><input type="text" class="cell-input" value="32,677" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="80%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
        </tbody>
      </table>
    </div>

      <div class="customer-wrap">
      <div class="customer-title">
        <div>客户销售情况</div>
        <div class="customer-title-right">
          <div class="unit">货币单位：人民币（万元）</div>
        </div>
      </div>
      <div class="customer-table-wrap">
        <div class="customer-row-tools">
          <button type="button" class="row-tool-btn" data-customer-row-action="add" aria-label="客户销售情况新增一行">+</button>
          <button type="button" class="row-tool-btn" data-customer-row-action="remove" aria-label="客户销售情况删除一行">-</button>
        </div>
        <table class="customer" aria-label="客户销售情况">
        <colgroup>
          <col style="width: 10%">
          <col style="width: 22%">
          <col style="width: 22%">
          <col style="width: 15%">
          <col style="width: 15%">
        </colgroup>
        <thead>
          <tr>
            <th>序号</th>
            <th>主要客户</th>
            <th>今年至今</th>
            <th>完成比例</th>
            <th>情况说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="1" /></td>
            <td><input type="text" class="cell-input" value="JSW/MGI" /></td>
            <td class="num"><input type="text" class="cell-input" value="18,062" /></td>
            <td class="num"><input type="text" class="cell-input" value="80%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="2" /></td>
            <td><input type="text" class="cell-input" value="SAIC-CP泰国" /></td>
            <td class="num"><input type="text" class="cell-input" value="3,261" /></td>
            <td class="num"><input type="text" class="cell-input" value="93%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="3" /></td>
            <td><input type="text" class="cell-input" value="SAIC Motor Europe" /></td>
            <td class="num"><input type="text" class="cell-input" value="4,456" /></td>
            <td class="num"><input type="text" class="cell-input" value="74%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="4" /></td>
            <td><input type="text" class="cell-input" value="MG UK" /></td>
            <td class="num"><input type="text" class="cell-input" value="3,030" /></td>
            <td class="num"><input type="text" class="cell-input" value="76%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="5" /></td>
            <td><input type="text" class="cell-input" value="上汽大通" /></td>
            <td class="num"><input type="text" class="cell-input" value="950" /></td>
            <td class="num"><input type="text" class="cell-input" value="95%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="6" /></td>
            <td><input type="text" class="cell-input" value="上汽乘用车/研发总院" /></td>
            <td class="num"><input type="text" class="cell-input" value="580" /></td>
            <td class="num"><input type="text" class="cell-input" value="15%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="7" /></td>
            <td><input type="text" class="cell-input" value="上汽乘用车/研发总院" /></td>
            <td class="num"><input type="text" class="cell-input" value="580" /></td>
            <td class="num"><input type="text" class="cell-input" value="15%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="8" /></td>
            <td><input type="text" class="cell-input" value="上汽乘用车/研发总院" /></td>
            <td class="num"><input type="text" class="cell-input" value="580" /></td>
            <td class="num"><input type="text" class="cell-input" value="15%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="9" /></td>
            <td><input type="text" class="cell-input" value="上汽乘用车/研发总院" /></td>
            <td class="num"><input type="text" class="cell-input" value="580" /></td>
            <td class="num"><input type="text" class="cell-input" value="15%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td class="num"><input type="text" class="cell-input" value="10" /></td>
            <td><input type="text" class="cell-input" value="上汽乘用车/研发总院" /></td>
            <td class="num"><input type="text" class="cell-input" value="580" /></td>
            <td class="num"><input type="text" class="cell-input" value="15%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
        </tbody>
        </table>
      </div>
    </div>

      <div class="toc-transform-wrap">
        <div class="sales-title"><div>To C转型</div></div>
        <div class="toc-transform-body">
          <div class="toc-table-block">
            <div class="sub-title">全球SIM卡管理</div>
            <div class="sim-traffic-report-embed">
              <iframe
                class="sim-traffic-report-embed__frame"
                title="流量报表 trafficReportv2"
                :src="trafficReportEmbedUrl"
              ></iframe>
              <p class="sim-traffic-report-embed__print-fallback">
                流量报表（打印/PDF 请用浏览器打开）：
                <span class="sim-traffic-report-embed__url">{{ trafficReportEmbedUrl }}</span>
              </p>
            </div>
            <table class="sim sim-card-management-table" aria-label="全球SIM卡管理">
              <thead>
                <tr>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" class="cell-input" value="较上月下降 3.1%" /></td>
                </tr>
                <tr>
                  <td><input type="text" class="cell-input" value="重点国家地区未出现大面积离线告警" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="toc-table-block">
            <div class="sub-title">三公网eSIMs</div>
            <table class="sim sim-three-public-esims-table" aria-label="三公网eSIMs">
              <thead>
                <tr>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" class="cell-input" value="" /></td>
                </tr>
                <tr>
                  <td><input type="text" class="cell-input" value="" /></td>
                </tr>
                <tr>
                  <td><input type="text" class="cell-input" value="" /></td>
                </tr>
                <tr>
                  <td><input type="text" class="cell-input" value="" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="project-wrap">
      <div class="project-title">三大重点项目</div>
      <table class="project" aria-label="三大重点项目表">
        <thead>
          <tr>
            <th>项目名称</th>
            <th>项目目标</th>
            <th>近期进展</th>
            <th>存在风险</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" class="cell-input" value="海外智能座舱平台升级" /></td>
            <td><input type="text" class="cell-input" value="完成多语言版本统一发布，提升海外交付效率" /></td>
            <td><input type="text" class="cell-input" value="已完成核心模块联调，正在进行灰度发布" /></td>
            <td><input type="text" class="cell-input" value="海外网络环境差异导致升级耗时波动" /></td>
            <td><input type="text" class="cell-input" value="推进中" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="数据中台二期建设" /></td>
            <td><input type="text" class="cell-input" value="打通销售与项目数据链路，实现统一指标看板" /></td>
            <td><input type="text" class="cell-input" value="数据模型已上线，报表接口完成80%" /></td>
            <td><input type="text" class="cell-input" value="历史数据口径不一致，清洗周期偏长" /></td>
            <td><input type="text" class="cell-input" value="正常" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="车机软件性能优化专项" /></td>
            <td><input type="text" class="cell-input" value="启动时间缩短15%，内存占用下降10%" /></td>
            <td><input type="text" class="cell-input" value="已完成首轮性能压测并输出优化清单" /></td>
            <td><input type="text" class="cell-input" value="第三方组件升级窗口较短" /></td>
            <td><input type="text" class="cell-input" value="关注" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="质量管理体系认证复审" /></td>
            <td><input type="text" class="cell-input" value="通过年度复审并完成问题闭环" /></td>
            <td><input type="text" class="cell-input" value="内部预审完成，整改项已关闭90%" /></td>
            <td><input type="text" class="cell-input" value="关键岗位文档更新进度需加快" /></td>
            <td><input type="text" class="cell-input" value="可控" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

    <div class="sheet-title">
      <div class="left">现金流量表</div>
      <div class="unit">货币单位：人民币（万元）</div>
    </div>

    <table aria-label="现金流量表">
      <colgroup>
        <col />
        <col />
        <col />
      </colgroup>
      <thead>
        <tr>
          <th>项目</th>
          <th>本年累计金额</th>
          <th>本期金额</th>
        </tr>
      </thead>
      <tbody>
        <tr class="section">
          <td><input type="text" class="cell-input" value="一、经营活动产生的现金流量：" /></td>
          <td class="amount"><input type="text" class="cell-input" value="" /></td>
          <td class="amount"><input type="text" class="cell-input" value="" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="销售商品、提供劳务收到的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="34,985.55" /></td>
          <td class="amount"><input type="text" class="cell-input" value="31,652.30" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="收到税费返还" /></td>
          <td class="amount"><input type="text" class="cell-input" value="1,962.89" /></td>
          <td class="amount"><input type="text" class="cell-input" value="1,461.92" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="收到其他与经营活动有关的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="184.31" /></td>
          <td class="amount"><input type="text" class="cell-input" value="195.59" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="购买商品、接受劳务支付的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="28,300.79" /></td>
          <td class="amount"><input type="text" class="cell-input" value="27,734.77" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="支付给职工以及为职工支付的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="4,056.25" /></td>
          <td class="amount"><input type="text" class="cell-input" value="3,582.01" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="支付的各项税费" /></td>
          <td class="amount"><input type="text" class="cell-input" value="606.81" /></td>
          <td class="amount"><input type="text" class="cell-input" value="433.22" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="支付其他与经营活动有关的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="2,522.71" /></td>
          <td class="amount"><input type="text" class="cell-input" value="963.73" /></td>
        </tr>
        <tr class="bold">
          <td><input type="text" class="cell-input" value="经营活动产生的现金流量净额" /></td>
          <td class="amount"><input type="text" class="cell-input" value="1,646.19" /></td>
          <td class="amount"><input type="text" class="cell-input" value="596.08" /></td>
        </tr>
        <tr class="section">
          <td><input type="text" class="cell-input" value="二、投资活动产生的现金流量：" /></td>
          <td class="amount"><input type="text" class="cell-input" value="" /></td>
          <td class="amount"><input type="text" class="cell-input" value="" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="购建固定资产、无形资产和其他长期资产支付的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="244.88" /></td>
          <td class="amount"><input type="text" class="cell-input" value="197.02" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="投资活动产生的现金流量净额" /></td>
          <td class="amount"><input type="text" class="cell-input" value="-244.88" /></td>
          <td class="amount"><input type="text" class="cell-input" value="-197.02" /></td>
        </tr>
        <tr class="section">
          <td><input type="text" class="cell-input" value="三、筹资活动产生的现金流量：" /></td>
          <td class="amount"><input type="text" class="cell-input" value="" /></td>
          <td class="amount"><input type="text" class="cell-input" value="" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="分配股利、利润或偿付利息支付的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="1,182.17" /></td>
          <td class="amount"><input type="text" class="cell-input" value="390.45" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="支付其他与筹资活动有关的现金" /></td>
          <td class="amount"><input type="text" class="cell-input" value="258.26" /></td>
          <td class="amount"><input type="text" class="cell-input" value="160.04" /></td>
        </tr>
        <tr class="bold">
          <td><input type="text" class="cell-input" value="筹资活动产生的现金流量净额" /></td>
          <td class="amount"><input type="text" class="cell-input" value="-1,440.43" /></td>
          <td class="amount"><input type="text" class="cell-input" value="-550.49" /></td>
        </tr>
        <tr class="bold">
          <td><input type="text" class="cell-input" value="四、汇率变动对现金及现金等价物的影响" /></td>
          <td class="amount"><input type="text" class="cell-input" value="35.54" /></td>
          <td class="amount"><input type="text" class="cell-input" value="16.82" /></td>
        </tr>
        <tr class="bold">
          <td><input type="text" class="cell-input" value="五、现金及现金等价物净增加额" /></td>
          <td class="amount"><input type="text" class="cell-input" value="-3.58" /></td>
          <td class="amount"><input type="text" class="cell-input" value="-134.61" /></td>
        </tr>
        <tr>
          <td><input type="text" class="cell-input" value="加：期初现金及现金等价物余额" /></td>
          <td class="amount"><input type="text" class="cell-input" value="7,247.30" /></td>
          <td class="amount"><input type="text" class="cell-input" value="7,381.91" /></td>
        </tr>
        <tr class="bold">
          <td><input type="text" class="cell-input" value="六、期末现金及现金等价物余额" /></td>
          <td class="amount"><input type="text" class="cell-input" value="7,243.72" /></td>
          <td class="amount"><input type="text" class="cell-input" value="7,247.30" /></td>
        </tr>
      </tbody>
    </table>

    <div class="hr-wrap">
      <div class="hr-title">人力资源报告</div>
      <div class="hr-panels">
        <div class="hr-left">
          <table class="hr" aria-label="人力资源报告表">
            <colgroup>
              <col style="width: 9%">
              <col style="width: 26%">
              <col style="width: 12%">
              <col style="width: 11%">
              <col style="width: 11%">
              <col style="width: 11%">
              <col style="width: 11%">
              <col style="width: 9%">
            </colgroup>
            <thead>
              <tr>
                <th rowspan="3">序号</th>
                <th rowspan="3">部门名称</th>
                <th colspan="1">2026年实际</th>
                <th class="group" colspan="4">2026年人员变化情况（+/-）</th>
                <th class="group" colspan="1">2026年预计</th>
              </tr>
              <tr>
                <th rowspan="2">人数</th>
                <th class="group">一季度</th>
                <th class="group">二季度</th>
                <th class="group">三季度</th>
                <th class="group">四季度</th>
                <th class="group" rowspan="2">年底人数</th>
              </tr>
              <tr>
                <th class="group">实际</th>
                <th class="group">实际</th>
                <th class="group">计划</th>
                <th class="group">计划</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="1" /></td>
                <td><input type="text" class="cell-input" value="管理层" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="2" /></td>
                <td><input type="text" class="cell-input" value="项目组" /></td>
                <td class="num"><input type="text" class="cell-input" value="8" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="8" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="3" /></td>
                <td><input type="text" class="cell-input" value="测试组" /></td>
                <td class="num"><input type="text" class="cell-input" value="6" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="6" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="4" /></td>
                <td><input type="text" class="cell-input" value="产品组" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="5" /></td>
                <td><input type="text" class="cell-input" value="系统组" /></td>
                <td class="num"><input type="text" class="cell-input" value="11" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="11" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="6" /></td>
                <td><input type="text" class="cell-input" value="产品中台及开发组" /></td>
                <td class="num"><input type="text" class="cell-input" value="7" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="7" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="7" /></td>
                <td><input type="text" class="cell-input" value="集成及体系认证组" /></td>
                <td class="num"><input type="text" class="cell-input" value="2" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="2" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="8" /></td>
                <td><input type="text" class="cell-input" value="综管组" /></td>
                <td class="num"><input type="text" class="cell-input" value="3" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="3" /></td>
              </tr>
              <tr class="total">
                <td colspan="2"><input type="text" class="cell-input" value="合计" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="hr-right is-hidden">
          <table class="hr-side" aria-label="人力资源指标汇总">
            <thead>
              <tr>
                <th>序号</th>
                <th>指标</th>
                <th>2026年预算</th>
                <th>2026年实际</th>
              </tr>
            </thead>
            <tbody>
              <tr class="total">
                <td><input type="text" class="cell-input" value="一" /></td>
                <td><input type="text" class="cell-input" value="全部人员期末人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="1" /></td>
                <td><input type="text" class="cell-input" value="其中：职工期末人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="2" /></td>
                <td><input type="text" class="cell-input" value="劳务派遣人员期末人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="3" /></td>
                <td><input type="text" class="cell-input" value="其他从业人员期末人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
              </tr>
              <tr class="total">
                <td><input type="text" class="cell-input" value="二" /></td>
                <td><input type="text" class="cell-input" value="全部人员平均人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="1" /></td>
                <td><input type="text" class="cell-input" value="其中：职工平均人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="2" /></td>
                <td><input type="text" class="cell-input" value="劳务派遣人员平均人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="3" /></td>
                <td><input type="text" class="cell-input" value="其他从业人员平均人数" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
                <td class="num"><input type="text" class="cell-input" value="0" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </section>

    <section class="report-outline-section">
    <h2
      class="section-overview-title section-overview-title--following section-overview-title--collapsible"
      role="button"
      tabindex="0"
      :aria-expanded="reportCollapsible.project ? 'true' : 'false'"
      aria-controls="report-section-project-body"
      @click="toggleReportSection('project')"
      @keydown.enter.prevent="toggleReportSection('project')"
      @keydown.space.prevent="toggleReportSection('project')"
    >
      <span class="section-overview-title__chevron" aria-hidden="true">{{ reportCollapsible.project ? '▼' : '▶' }}</span>
      <span class="section-overview-title__label">二.项目开发状态</span>
    </h2>
    <div id="report-section-project-body" v-show="reportCollapsible.project" class="report-outline-section__body">
    <div class="project-dev-status-block">
      <div class="sales-title">
        <div>项目健康度 (RYG)</div>
      </div>
      <div class="project-health-ryg-panel">
        <div class="project-health-ryg-hidden-inputs" aria-hidden="true">
          <input id="projectHealthRygGreen" type="text" value="66" tabindex="-1" />
          <input id="projectHealthRygYellow" type="text" value="3" tabindex="-1" />
          <input id="projectHealthRygRed" type="text" value="9" tabindex="-1" />
        </div>
        <div id="projectHealthRygChart" class="project-health-ryg-chart" role="img" aria-label="项目健康度饼图"></div>
      </div>

      <div class="r-project-list-wrap">
        <div class="sales-title"><div>预警项目列表</div></div>
        <div class="r-project-table-wrap">
          <div class="r-project-row-tools">
            <button type="button" class="row-tool-btn" data-r-project-row-action="add" aria-label="预警项目列表新增一行">+</button>
            <button type="button" class="row-tool-btn" data-r-project-row-action="remove" aria-label="预警项目列表删除一行">-</button>
          </div>
          <table class="project r-project-list" aria-label="预警项目列表">
          <colgroup>
            <col style="width: 34%">
            <col style="width: 22%">
            <col style="width: 44%">
          </colgroup>
          <thead>
            <tr>
              <th>项目名称</th>
              <th>SOP时间</th>
              <th>情况说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
            </tr>
            <tr>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
            </tr>
            <tr>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
            </tr>
            <tr>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
    </div>
    </div>
    </section>

    <section class="report-outline-section">
    <h2
      class="section-overview-title section-overview-title--following section-overview-title--collapsible"
      role="button"
      tabindex="0"
      :aria-expanded="reportCollapsible.hardware ? 'true' : 'false'"
      aria-controls="report-section-hardware-body"
      @click="toggleReportSection('hardware')"
      @keydown.enter.prevent="toggleReportSection('hardware')"
      @keydown.space.prevent="toggleReportSection('hardware')"
    >
      <span class="section-overview-title__chevron" aria-hidden="true">{{ reportCollapsible.hardware ? '▼' : '▶' }}</span>
      <span class="section-overview-title__label">三.硬件供货</span>
    </h2>
    <div id="report-section-hardware-body" v-show="reportCollapsible.hardware" class="report-outline-section__body">
    <div class="hardware-supply-block">
      <div class="hardware-supply-table-wrap">
        <table class="project hardware-supply" aria-label="硬件供货">
          <colgroup>
            <col style="width: 12%">
            <col style="width: 18%">
            <col style="width: 18%">
            <col style="width: 12%">
            <col style="width: 14%">
            <col style="width: 14%">
          </colgroup>
          <thead>
            <tr>
              <th>产品类型</th>
              <th>客户</th>
              <th>零件号</th>
              <th>订单数</th>
              <th>2026已交付</th>
              <th>金额</th>
            </tr>
          </thead>
          <tbody data-hardware-segment="FICM">
            <tr class="hardware-product-row">
              <td class="hardware-product-type-cell" rowspan="1">
                <div class="hardware-product-type-inner">
                  <input type="text" class="cell-input" value="FICM" readonly tabindex="-1" />
                  <div class="hardware-supply-inline-tools" role="group" aria-label="FICM 行操作">
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="FICM" data-hardware-row-action="add" aria-label="FICM 增行">+</button>
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="FICM" data-hardware-row-action="remove" aria-label="FICM 减行">-</button>
                  </div>
                </div>
              </td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
            </tr>
          </tbody>
          <tbody data-hardware-segment="TBOX">
            <tr class="hardware-product-row">
              <td class="hardware-product-type-cell" rowspan="1">
                <div class="hardware-product-type-inner">
                  <input type="text" class="cell-input" value="TBOX" readonly tabindex="-1" />
                  <div class="hardware-supply-inline-tools" role="group" aria-label="TBOX 行操作">
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="TBOX" data-hardware-row-action="add" aria-label="TBOX 增行">+</button>
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="TBOX" data-hardware-row-action="remove" aria-label="TBOX 减行">-</button>
                  </div>
                </div>
              </td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
            </tr>
          </tbody>
          <tbody data-hardware-segment="SCREEN">
            <tr class="hardware-product-row">
              <td class="hardware-product-type-cell" rowspan="1">
                <div class="hardware-product-type-inner">
                  <input type="text" class="cell-input" value="SCREEN" readonly tabindex="-1" />
                  <div class="hardware-supply-inline-tools" role="group" aria-label="SCREEN 行操作">
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="SCREEN" data-hardware-row-action="add" aria-label="SCREEN 增行">+</button>
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="SCREEN" data-hardware-row-action="remove" aria-label="SCREEN 减行">-</button>
                  </div>
                </div>
              </td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
            </tr>
          </tbody>
          <tbody data-hardware-segment="SIM卡">
            <tr class="hardware-product-row">
              <td class="hardware-product-type-cell" rowspan="1">
                <div class="hardware-product-type-inner">
                  <input type="text" class="cell-input" value="SIM卡" readonly tabindex="-1" />
                  <div class="hardware-supply-inline-tools" role="group" aria-label="SIM卡 行操作">
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="SIM卡" data-hardware-row-action="add" aria-label="SIM卡 增行">+</button>
                    <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="SIM卡" data-hardware-row-action="remove" aria-label="SIM卡 减行">-</button>
                  </div>
                </div>
              </td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
            </tr>
          </tbody>
          <tbody class="hardware-supply-total-tbody">
            <tr class="total">
              <td><input type="text" class="cell-input" value="总计" readonly tabindex="-1" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
              <td class="num"><input type="text" class="cell-input" value="" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="logistics-wrap">
      <div class="logistics-title">物料物流</div>
      <div class="logistics-grid-2">
        <div class="logistics-table-block">
          <div class="sub-title">交付计划</div>
          <table class="logistics" aria-label="物料物流-交付计划">
            <thead>
              <tr>
                <th>维度</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><input type="text" class="cell-input" value="客户交付计划（本月）" /></td><td class="num"><input type="text" class="cell-input" value="42" /></td></tr>
              <tr><td><input type="text" class="cell-input" value="客户交付计划（已完成）" /></td><td class="num"><input type="text" class="cell-input" value="31" /></td></tr>
              <tr><td><input type="text" class="cell-input" value="供应商交付计划（本月）" /></td><td class="num"><input type="text" class="cell-input" value="57" /></td></tr>
              <tr><td><input type="text" class="cell-input" value="供应商交付计划（已完成）" /></td><td class="num"><input type="text" class="cell-input" value="45" /></td></tr>
            </tbody>
          </table>
        </div>
        <div class="logistics-table-block">
          <div class="sub-title">预测统计</div>
          <table class="logistics" aria-label="物料物流-预测统计">
            <thead>
              <tr>
                <th>维度</th>
                <th>数量</th>
              </tr>
            </thead>
            <tbody>
              <tr><td><input type="text" class="cell-input" value="滚动预测覆盖周数" /></td><td class="num"><input type="text" class="cell-input" value="12" /></td></tr>
              <tr><td><input type="text" class="cell-input" value="重点物料缺口" /></td><td class="num"><input type="text" class="cell-input" value="3" /></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>
    </section>

  </div>
  </div>
</template>

<script>
// P0: echarts 改异步按需加载
import html2canvas from 'html2canvas';
import request from '@/router/axios';

const AUTO_SAVE_INTERVAL_MS = 5000;
let autoSaveTimerId = null;

export default {
  name: 'WorkWeekReportFromImage',
  data() {
    return {
      reportCollapsible: {
        company: true,
        project: true,
        hardware: true
      },
      trafficReportEmbedUrl: 'https://web-operations-ui.soimt.com/#/trafficReportv2'
    };
  },
  methods: {
    toggleReportSection(key) {
      const open = !this.reportCollapsible[key];
      this.reportCollapsible = { ...this.reportCollapsible, [key]: open };
      if (key === 'project' && open) {
        this.$nextTick(() => {
          if (typeof this._projectHealthChartResize === 'function') {
            this._projectHealthChartResize();
          }
        });
      }
    },
    async saveTableData() {
      if (typeof this._saveTableDataToApi === 'function') {
        await this._saveTableDataToApi(false);
      }
    },
    async exportPageToPdf() {
      const sheetEl = this.$el.querySelector('.sheet');
      if (!sheetEl) return;
      const scopeAttr = this.$el && this.$el.getAttributeNames
        ? this.$el.getAttributeNames().find((name) => name.startsWith('data-v-'))
        : '';
      const scopeAttrHtml = scopeAttr ? ` ${scopeAttr}` : '';

      const setScopeOnNode = (node) => {
        if (!scopeAttr || !node || node.nodeType !== 1) return;
        node.setAttribute(scopeAttr, '');
      };

      const printNode = sheetEl.cloneNode(true);
      const sourceFields = sheetEl.querySelectorAll('input, textarea, select');
      const targetFields = printNode.querySelectorAll('input, textarea, select');

      sourceFields.forEach((sourceField, index) => {
        const targetField = targetFields[index];
        if (!targetField) return;

        if (sourceField.tagName === 'TEXTAREA') {
          targetField.value = sourceField.value;
          targetField.textContent = sourceField.value;
          return;
        }

        if (sourceField.tagName === 'SELECT') {
          targetField.value = sourceField.value;
          return;
        }

        targetField.value = sourceField.value;
        targetField.setAttribute('value', sourceField.value);
      });

      if (this._projectHealthChart) {
        try {
          if (typeof this._projectHealthChartResize === 'function') {
            this._projectHealthChartResize();
          }
          const dataUrl = this._projectHealthChart.getDataURL({
            type: 'png',
            pixelRatio: 2,
            backgroundColor: '#fff'
          });
          const chartBox = printNode.querySelector('#projectHealthRygChart');
          if (chartBox) {
            chartBox.innerHTML = '';
            const img = document.createElement('img');
            img.setAttribute('alt', '项目健康度饼图');
            img.className = 'project-health-ryg-chart-print-img';
            img.style.cssText = 'width:100%;height:auto;display:block;';
            img.src = dataUrl;
            setScopeOnNode(img);
            chartBox.appendChild(img);
          }
        } catch (e) {
          /* 打印仍使用克隆中的其它内容 */
        }
      }

      const embedPrint = printNode.querySelector('.sim-traffic-report-embed');
      const liveIframe = sheetEl.querySelector('iframe.sim-traffic-report-embed__frame');
      if (embedPrint && liveIframe) {
        const frameClone = embedPrint.querySelector('iframe.sim-traffic-report-embed__frame');
        let replaced = false;
        try {
          const iWin = liveIframe.contentWindow;
          const iDoc = liveIframe.contentDocument || (iWin && iWin.document);
          const docBody = iDoc && iDoc.body;
          if (docBody && (docBody.scrollHeight > 0 || docBody.textContent)) {
            const scale = Math.min(1, 1000 / Math.max(docBody.scrollWidth || docBody.offsetWidth || 1, 1));
            const canvas = await html2canvas(docBody, {
              logging: false,
              useCORS: true,
              allowTaint: true,
              scale
            });
            const shot = canvas.toDataURL('image/png');
            if (frameClone && frameClone.parentNode) {
              const img = document.createElement('img');
              img.setAttribute('alt', '流量报表');
              img.className = 'sim-traffic-report-embed__snapshot';
              img.style.cssText = 'width:100%;height:auto;display:block;';
              img.src = shot;
              setScopeOnNode(img);
              frameClone.parentNode.replaceChild(img, frameClone);
              replaced = true;
            }
          }
        } catch (e) {
          replaced = false;
        }
        const fb = embedPrint.querySelector('.sim-traffic-report-embed__print-fallback');
        if (replaced) {
          if (fb) fb.remove();
        } else if (frameClone && frameClone.parentNode) {
          frameClone.parentNode.removeChild(frameClone);
          if (fb) {
            fb.style.display = 'block';
            fb.style.margin = '0';
            fb.style.padding = '10px';
            fb.style.fontSize = '12px';
            fb.style.color = '#111';
            fb.style.lineHeight = '1.45';
            setScopeOnNode(fb);
          }
        }
      }

      const inlineStyles = Array.from(document.querySelectorAll('style'))
        .map((style) => style.outerHTML || '')
        .join('\n');
      const linkedStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
        .map((link) => link.outerHTML || '')
        .join('\n');

      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.setAttribute('aria-hidden', 'true');
      document.body.appendChild(iframe);

      const doc = iframe.contentWindow && iframe.contentWindow.document;
      if (!doc) {
        document.body.removeChild(iframe);
        return;
      }

      const printHtml = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>工作周报导出</title>
    ${linkedStyles}
    ${inlineStyles}
  </head>
  <body>
    <div class="work-week-report-from-image"${scopeAttrHtml}>${printNode.outerHTML}</div>
  </body>
</html>`;

      const waitStylesReadyAndPrint = () => {
        const win = iframe.contentWindow;
        const frameDoc = win && win.document;
        if (!win || !frameDoc) return;

        const cssLinks = Array.from(frameDoc.querySelectorAll('link[rel="stylesheet"]'));
        if (cssLinks.length === 0) {
          setTimeout(() => {
            win.focus();
            win.print();
          }, 400);
          return;
        }

        let loaded = 0;
        const finish = () => {
          loaded += 1;
          if (loaded < cssLinks.length) return;
          setTimeout(() => {
            win.focus();
            win.print();
          }, 400);
        };

        cssLinks.forEach((link) => {
          link.addEventListener('load', finish, { once: true });
          link.addEventListener('error', finish, { once: true });
        });

        // Fallback: avoid hanging if some stylesheets never fire events.
        setTimeout(() => {
          win.focus();
          win.print();
        }, 1200);
      };

      iframe.onload = waitStylesReadyAndPrint;
      doc.open();
      doc.write(printHtml);
      doc.close();

      const cleanup = () => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      };
      iframe.contentWindow && iframe.contentWindow.addEventListener('afterprint', cleanup, { once: true });
      setTimeout(cleanup, 5000);
    }
  },
  async mounted() {
    const vm = this;
    let isSaving = false;
    let lastSavedPayload = '';
    let tableInfoNewVersion = 0;
    const scopeAttr = this.$el && this.$el.getAttributeNames
      ? this.$el.getAttributeNames().find((name) => name.startsWith('data-v-'))
      : null;

    function applyScopeAttr(root) {
      if (!scopeAttr || !root || root.nodeType !== 1) return;
      root.setAttribute(scopeAttr, '');
      root.querySelectorAll('*').forEach((node) => {
        node.setAttribute(scopeAttr, '');
      });
    }



    function getCurrentWeekRange() {
      const today = new Date();
      const day = today.getDay();
      const diffToMonday = today.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(new Date().setDate(diffToMonday));
      const sunday = new Date(new Date().setDate(diffToMonday + 6));
      const formatDate = (date) => {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
      };
      return {
        startDate: formatDate(monday),
        endDate: formatDate(sunday)
      };
    }

    function asText(value) {
      if (value === null || value === undefined) return '';
      return String(value);
    }

    function firstNonNull(...values) {
      for (let i = 0; i < values.length; i += 1) {
        if (values[i] !== null && values[i] !== undefined) {
          return values[i];
        }
      }
      return '';
    }

    function getCellValue(row, cellIndex) {
      if (!row || !row.cells || !row.cells[cellIndex]) return '';
      const cell = row.cells[cellIndex];
      const field = cell.querySelector('input, textarea, select');
      if (field) return asText(field.value).trim();
      return asText(cell.textContent).trim();
    }

    function getTableRows(ariaLabel) {
      const table = vm.$el.querySelector(`table[aria-label="${ariaLabel}"]`);
      if (!table || !table.tBodies || !table.tBodies[0]) return [];
      return Array.from(table.tBodies[0].rows || []);
    }

    /** 预警项目列表：限定在区块内取表，避免与其它表 aria-label 冲突或 query 顺序问题 */
    function getRProjectAlertTableRows() {
      const wrap = vm.$el.querySelector('.r-project-list-wrap');
      const table = wrap
        ? wrap.querySelector('table[aria-label="预警项目列表"]')
        : vm.$el.querySelector('table[aria-label="预警项目列表"]');
      if (!table || !table.tBodies || !table.tBodies[0]) return [];
      return Array.from(table.tBodies[0].rows || []);
    }

    /** 接口可能使用 rProjectList / r_project_list / alertProjectList 等键 */
    function pickRProjectListFromTableData(data) {
      if (!data || typeof data !== 'object') return undefined;
      const candidates = [
        data.rProjectList,
        data.rprojectList,
        data.r_project_list,
        data.alertProjectList,
        data.warningProjectList,
        data.alert_project_list
      ];
      for (let i = 0; i < candidates.length; i += 1) {
        const c = candidates[i];
        if (Array.isArray(c)) return c;
      }
      return undefined;
    }

    const HARDWARE_SUPPLY_SEGMENTS = ['FICM', 'TBOX', 'SCREEN', 'SIM卡'];

    function getHardwareSupplyTable() {
      return vm.$el.querySelector('table[aria-label="硬件供货"]');
    }

    function getHardwareSupplyPayloadRows() {
      const table = getHardwareSupplyTable();
      if (!table || !table.tBodies) return { dataRows: [], totalRow: null };
      const dataRows = [];
      let totalRow = null;
      Array.from(table.tBodies).forEach((tb) => {
        if (tb.classList.contains('hardware-supply-total-tbody')) {
          const tr = tb.querySelector('tr.total');
          if (tr) totalRow = tr;
          return;
        }
        Array.from(tb.rows || []).forEach((tr) => {
          dataRows.push(tr);
        });
      });
      return { dataRows, totalRow };
    }

    function mapHardwareSupplyDataRow(row) {
      if (row.classList.contains('hardware-product-cont')) {
        const tb = row.closest('tbody[data-hardware-segment]');
        const seg = tb ? asText(tb.getAttribute('data-hardware-segment')).trim() : '';
        return {
          productType: seg,
          customer: getCellValue(row, 0),
          partNo: getCellValue(row, 1),
          orderCount: getCellValue(row, 2),
          delivered2026: getCellValue(row, 3),
          amount: getCellValue(row, 4)
        };
      }
      return {
        productType: getCellValue(row, 0),
        customer: getCellValue(row, 1),
        partNo: getCellValue(row, 2),
        orderCount: getCellValue(row, 3),
        delivered2026: getCellValue(row, 4),
        amount: getCellValue(row, 5)
      };
    }

    function collectTablePayload() {
      const projectProgressList = getTableRows('三大重点项目表').map((row) => ({
        projectName: getCellValue(row, 0),
        projectGoal: getCellValue(row, 1),
        recentProgress: getCellValue(row, 2),
        risk: getCellValue(row, 3),
        status: getCellValue(row, 4)
      }));

      const cashFlowList = getTableRows('现金流量表').map((row) => ({
        item: getCellValue(row, 0),
        currentAmount: getCellValue(row, 1),
        previousAmount: getCellValue(row, 2)
      }));

      const salesStatusList = getTableRows('销售情况表').map((row) => ({
        serialNo: getCellValue(row, 0),
        productCategory: getCellValue(row, 1),
        mainProduct: getCellValue(row, 2),
        annualPlan2026: getCellValue(row, 3),
        actualToDate: getCellValue(row, 4),
        currentWeek: getCellValue(row, 5),
        annualPlanCompletionRate: getCellValue(row, 6),
        comments: getCellValue(row, 7)
      }));

      const customerSalesProgressTop10List = getTableRows('客户销售情况').map((row) => ({
        serialNo: getCellValue(row, 0),
        majorCustomer: getCellValue(row, 1),
        amountToDate2026: getCellValue(row, 2),
        completionRate: getCellValue(row, 3),
        note: getCellValue(row, 4)
      }));

      const humanResourceReportList = getTableRows('人力资源报告表').map((row) => ({
        serialNo: getCellValue(row, 0),
        departmentName: getCellValue(row, 1),
        actualHeadcount2026: getCellValue(row, 2),
        q1ChangeActual: getCellValue(row, 3),
        q2ChangeActual: getCellValue(row, 4),
        q3ChangePlan: getCellValue(row, 5),
        q4ChangePlan: getCellValue(row, 6),
        yearEndHeadcount2026: getCellValue(row, 7)
      }));

      const humanResourceSummaryList = getTableRows('人力资源指标汇总').map((row) => ({
        serialNo: getCellValue(row, 0),
        metric: getCellValue(row, 1),
        budget2026: getCellValue(row, 2),
        actual2026: getCellValue(row, 3)
      }));

      const logisticsDeliveryPlanList = getTableRows('物料物流-交付计划').map((row) => ({
        dimension: getCellValue(row, 0),
        quantity: getCellValue(row, 1)
      }));

      const logisticsForecastStatsList = getTableRows('物料物流-预测统计').map((row) => ({
        dimension: getCellValue(row, 0),
        quantity: getCellValue(row, 1)
      }));

      const simCardManagementList = getTableRows('全球SIM卡管理').map((row) => ({
        indicator: '',
        value: '',
        description: getCellValue(row, 0)
      }));

      const PUBLIC_ESIMS_SPLIT_INDEX = 2;
      const threePublicEsimsRows = getTableRows('三公网eSIMs');
      const mapSimMetricRow = (row) => ({
        indicator: '',
        value: '',
        description: getCellValue(row, 0)
      });
      const threePublicEsimsMapped = threePublicEsimsRows.map(mapSimMetricRow);
      const threePublicNetworksList = threePublicEsimsMapped.slice(0, PUBLIC_ESIMS_SPLIT_INDEX);
      const esimsList = threePublicEsimsMapped.slice(PUBLIC_ESIMS_SPLIT_INDEX);

      function parseRygCountInput(selector) {
        const el = vm.$el.querySelector(selector);
        if (!el) return 0;
        const n = parseInt(String(el.value).replace(/\D/g, ''), 10);
        return Number.isFinite(n) && n >= 0 ? n : 0;
      }

      const projectHealthRygStat = {
        GREEN: parseRygCountInput('#projectHealthRygGreen'),
        YELLOW: parseRygCountInput('#projectHealthRygYellow'),
        RED: parseRygCountInput('#projectHealthRygRed')
      };

      const rProjectList = getRProjectAlertTableRows().map((row) => ({
        projectName: getCellValue(row, 0),
        sopTime: getCellValue(row, 1),
        description: getCellValue(row, 2)
      }));

      const hardwarePayload = getHardwareSupplyPayloadRows();
      const hardwareDataRows = hardwarePayload.dataRows;
      const hardwareTotalRow = hardwarePayload.totalRow;
      const hardwareSupplyList = hardwareDataRows.map((row) => mapHardwareSupplyDataRow(row));
      const hardwareSupplyTotal = hardwareTotalRow
        ? {
            productType: getCellValue(hardwareTotalRow, 0),
            customer: getCellValue(hardwareTotalRow, 1),
            partNo: getCellValue(hardwareTotalRow, 2),
            orderCount: getCellValue(hardwareTotalRow, 3),
            delivered2026: getCellValue(hardwareTotalRow, 4),
            amount: getCellValue(hardwareTotalRow, 5)
          }
        : null;

      return {
        projectProgressList,
        cashFlowList,
        salesStatusList,
        customerSalesProgressTop10List,
        humanResourceReportList,
        humanResourceSummaryList,
        logisticsDeliveryPlanList,
        logisticsForecastStatsList,
        simCardManagementList,
        threePublicNetworksList,
        esimsList,
        projectHealthRygStat,
        rProjectList,
        /** 部分后端 JavaBean 对 rProject 首字母序列化为 rprojectList，与 rProjectList 不同名导致绑定为 null */
        rprojectList: rProjectList,
        hardwareSupplyList,
        hardwareSupplyTotal
      };
    }

    function buildTableInfoNewSaveRequestBody() {
      const { startDate, endDate } = getCurrentWeekRange();
      const tableData = {
        version: tableInfoNewVersion,
        ...collectTablePayload()
      };
      return {
        startDate,
        endDate,
        version: tableInfoNewVersion,
        tableData
      };
    }

    function applyTableInfoNewVersionFromResponse(root) {
      if (!root || typeof root !== 'object') return;
      const v = firstNonNull(root.version, root.tableData && root.tableData.version, null);
      if (v === null || v === undefined) return;
      const n = Number(v);
      if (Number.isFinite(n) && n >= 0) {
        tableInfoNewVersion = n;
      }
    }

    async function saveTableDataToApi(isAuto = true) {
      if (isSaving) return;
      const body = buildTableInfoNewSaveRequestBody();
      const payloadSnapshot = JSON.stringify(body);
      if (isAuto && payloadSnapshot === lastSavedPayload) {
        return;
      }

      isSaving = true;
      try {
        const res = await request({
          url: '/api/oa-portal/workReport/tableInfoNew/save',
          method: 'post',
          data: body
        });
        const savedRoot = res && res.data && (res.data.data !== undefined && res.data.data !== null ? res.data.data : res.data);
        applyTableInfoNewVersionFromResponse(savedRoot);
        // 必须用保存后的 version 再序列化一次，否则 apply 已把 tableInfoNewVersion 改成服务端值，
        // 与本次发送前的 payloadSnapshot 不一致，定时自动保存会每轮都认为「有变更」而反复请求。
        lastSavedPayload = JSON.stringify(buildTableInfoNewSaveRequestBody());
        if (vm.$message && typeof vm.$message.success === 'function') {
          if (isAuto) {
            vm.$message.success('自动保存成功');
          } else {
            vm.$message.success('保存成功');
          }
        }
      } catch (error) {
        // Auto-save is best-effort, UI should stay editable even if save fails.
      } finally {
        isSaving = false;
      }
    }

    function startAutoSave() {
      if (autoSaveTimerId) {
        clearInterval(autoSaveTimerId);
      }
      autoSaveTimerId = setInterval(() => {
        saveTableDataToApi(true);
      }, AUTO_SAVE_INTERVAL_MS);
    }

    function renderRowsByAriaLabel(ariaLabel, rows, rowToCells) {
      if (!Array.isArray(rows) || rows.length === 0) return;
      const table = vm.$el.querySelector(`table[aria-label="${ariaLabel}"]`);
      if (!table || !table.tBodies || !table.tBodies[0]) return;
      const tbody = table.tBodies[0];
      const html = rows.map((row) => {
        const cells = rowToCells(row) || [];
        const tds = cells.map((cell) => {
          const className = cell.className ? ` class="${cell.className}"` : '';
          const value = asText(firstNonNull(cell.value, '')).replace(/"/g, '&quot;');
          const readOnly = cell.readOnly ? ' readonly tabindex="-1"' : '';
          return `<td${className}><input type="text" class="cell-input"${readOnly} value="${value}" /></td>`;
        }).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      if (html) {
        tbody.innerHTML = html;
        applyScopeAttr(tbody);
      }
    }

    function renderHardwareSupplyFromData(data) {
      if (!Array.isArray(data.hardwareSupplyList)) return;
      const table = getHardwareSupplyTable();
      if (!table) return;
      const list = data.hardwareSupplyList;
      const ht = data.hardwareSupplyTotal && typeof data.hardwareSupplyTotal === 'object' ? data.hardwareSupplyTotal : null;
      const esc = (v) => asText(v).replace(/"/g, '&quot;');
      const escAttr = (v) => asText(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      const normType = (row) => asText(firstNonNull(row.productType, row.product_type)).trim();

      const tdHtml = (value, colIndex, isTotalRow, readOnlyCell) => {
        const numCls = colIndex >= 3 ? ' class="num"' : '';
        let ro = '';
        if (isTotalRow && colIndex === 0) ro = ' readonly tabindex="-1"';
        else if (readOnlyCell) ro = ' readonly tabindex="-1"';
        return `<td${numCls}><input type="text" class="cell-input"${ro} value="${esc(value)}" /></td>`;
      };

      const rowVals = (row) => ([
        firstNonNull(row.productType, row.product_type, ''),
        firstNonNull(row.customer, row.customerName, ''),
        firstNonNull(row.partNo, row.partNumber, row.part_code, ''),
        firstNonNull(row.orderCount, row.orders, ''),
        firstNonNull(row.delivered2026, row.delivered, ''),
        firstNonNull(row.amount, '')
      ]);

      function buildSegmentTbodyHtml(segmentLabel) {
        let rowsFor = list.filter((row) => normType(row) === segmentLabel);
        if (rowsFor.length === 0) {
          rowsFor = [{ productType: segmentLabel }];
        }
        const n = rowsFor.length;
        const firstVals = rowVals(rowsFor[0]);
        const inlineTools =
          `<div class="hardware-supply-inline-tools" role="group" aria-label="${escAttr(segmentLabel)} 行操作">` +
          `<button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="${escAttr(segmentLabel)}" data-hardware-row-action="add" aria-label="${escAttr(segmentLabel)} 增行">+</button>` +
          `<button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hardware-segment="${escAttr(segmentLabel)}" data-hardware-row-action="remove" aria-label="${escAttr(segmentLabel)} 减行">-</button>` +
          `</div>`;
        const leaderTds =
          `<td class="hardware-product-type-cell" rowspan="${n}"><div class="hardware-product-type-inner"><input type="text" class="cell-input" readonly tabindex="-1" value="${esc(segmentLabel)}" />${inlineTools}</div></td>` +
          firstVals
            .slice(1)
            .map((v, j) => tdHtml(v, j + 1, false, false))
            .join('');
        const contHtml = rowsFor
          .slice(1)
          .map((row) => {
            const vals = rowVals(row);
            const tds = vals
              .slice(1)
              .map((v, j) => tdHtml(v, j + 1, false, false))
              .join('');
            return `<tr class="hardware-product-row hardware-product-cont">${tds}</tr>`;
          })
          .join('');
        const inner = `<tr class="hardware-product-row">${leaderTds}</tr>${contHtml}`;
        return `<tbody data-hardware-segment="${escAttr(segmentLabel)}">${inner}</tbody>`;
      }

      const segmentsHtml = HARDWARE_SUPPLY_SEGMENTS.map((seg) => buildSegmentTbodyHtml(seg)).join('');

      const tVals = [
        firstNonNull(ht && ht.productType, '总计'),
        ht ? firstNonNull(ht.customer, '') : '',
        ht ? firstNonNull(ht.partNo, ht.partNumber, '') : '',
        ht ? firstNonNull(ht.orderCount, ht.orders, '') : '',
        ht ? firstNonNull(ht.delivered2026, ht.delivered, '') : '',
        ht ? firstNonNull(ht.amount, '') : ''
      ];
      const totalInner = `<tr class="total">${tVals.map((v, i) => tdHtml(v, i, true, false)).join('')}</tr>`;
      const totalTbody = `<tbody class="hardware-supply-total-tbody">${totalInner}</tbody>`;

      Array.from(table.querySelectorAll('tbody')).forEach((tb) => tb.remove());
      table.insertAdjacentHTML('beforeend', segmentsHtml + totalTbody);
      applyScopeAttr(table);
    }

    async function loadTableDataFromApi() {
      try {
        const { startDate, endDate } = getCurrentWeekRange();
        const res = await request({
          url: '/api/oa-portal/workReport/tableInfoNew',
          method: 'post',
          data: { startDate, endDate }
        });
        const raw = (res && res.data && (res.data.data !== undefined && res.data.data !== null ? res.data.data : res.data)) || null;
        if (!raw || typeof raw !== 'object') return;

        applyTableInfoNewVersionFromResponse(raw);

        const data = raw.tableData && typeof raw.tableData === 'object' ? raw.tableData : raw;
        if (!data || typeof data !== 'object') return;

        renderRowsByAriaLabel('三大重点项目表', data.projectProgressList, (row) => ([
          { value: asText(row.projectName) },
          { value: asText(row.projectGoal) },
          { value: asText(row.recentProgress) },
          { value: asText(row.risk) },
          { value: asText(row.status) }
        ]));

        renderRowsByAriaLabel('现金流量表', data.cashFlowList, (row) => ([
          { value: asText(row.item) },
          { className: 'amount', value: asText(row.currentAmount) },
          { className: 'amount', value: asText(row.previousAmount) }
        ]));

        renderRowsByAriaLabel('销售情况表', data.salesStatusList, (row) => ([
          { value: asText(row.serialNo) },
          { value: asText(row.productCategory) },
          { value: asText(row.mainProduct) },
          { className: 'num', value: asText(row.annualPlan2026) },
          { className: 'num', value: asText(row.actualToDate) },
          { className: 'num', value: asText(row.currentWeek) },
          { className: 'num', value: asText(row.annualPlanCompletionRate) },
          { value: asText(firstNonNull(row.comments, row.comment)) }
        ]));

        renderRowsByAriaLabel('客户销售情况', data.customerSalesProgressTop10List, (row) => ([
          { className: 'num', value: asText(firstNonNull(row.serialNo, row.serialNO, row.no, row.index)) },
          { value: asText(firstNonNull(row.majorCustomer, row.mainCustomer, row.customerName, row.customer)) },
          { className: 'num', value: asText(firstNonNull(row.amountToDate2026, row.thisYearToDate, row.amountToDate, row.ytdAmount)) },
          { className: 'num', value: asText(firstNonNull(row.completionRate, row.completeRate, row.finishRate, row.progressRate)) },
          { value: asText(firstNonNull(row.note, row.remark, row.description)) }
        ]));

        renderRowsByAriaLabel('人力资源报告表', data.humanResourceReportList, (row) => ([
          { className: 'num', value: asText(row.serialNo) },
          { value: asText(row.departmentName) },
          { className: 'num', value: asText(row.actualHeadcount2026) },
          { className: 'num', value: asText(row.q1ChangeActual) },
          { className: 'num', value: asText(row.q2ChangeActual) },
          { className: 'num', value: asText(row.q3ChangePlan) },
          { className: 'num', value: asText(row.q4ChangePlan) },
          { className: 'num', value: asText(row.yearEndHeadcount2026) }
        ]));

        renderRowsByAriaLabel('人力资源指标汇总', data.humanResourceSummaryList, (row) => ([
          { className: 'num', value: asText(row.serialNo) },
          { value: asText(row.metric) },
          { className: 'num', value: asText(row.budget2026) },
          { className: 'num', value: asText(row.actual2026) }
        ]));

        renderRowsByAriaLabel('物料物流-交付计划', data.logisticsDeliveryPlanList, (row) => ([
          { value: asText(row.dimension) },
          { className: 'num', value: asText(row.quantity) }
        ]));

        renderRowsByAriaLabel('物料物流-预测统计', data.logisticsForecastStatsList, (row) => ([
          { value: asText(row.dimension) },
          { className: 'num', value: asText(row.quantity) }
        ]));

        renderRowsByAriaLabel('全球SIM卡管理', data.simCardManagementList, (row) => {
          const desc = asText(firstNonNull(row.description, row.remark, row.comment, ''));
          const ind = asText(firstNonNull(row.indicator, ''));
          const val = asText(firstNonNull(row.value, ''));
          const merged = desc || [ind, val].filter((s) => s && String(s).trim()).join('，');
          return [{ value: merged }];
        });

        const threePublicEsimsLoadRows = [
          ...(Array.isArray(data.threePublicNetworksList) ? data.threePublicNetworksList : []),
          ...(Array.isArray(data.esimsList) ? data.esimsList : [])
        ];
        renderRowsByAriaLabel('三公网eSIMs', threePublicEsimsLoadRows, (row) => {
          const desc = asText(firstNonNull(row.description, row.remark, row.comment, ''));
          const ind = asText(firstNonNull(row.indicator, ''));
          const val = asText(firstNonNull(row.value, ''));
          const merged = desc || [ind, val].filter((s) => s && String(s).trim()).join('，');
          return [{ value: merged }];
        });

        renderHardwareSupplyFromData(data);

        const rProjectRowsFromApi = pickRProjectListFromTableData(data);
        if (rProjectRowsFromApi !== undefined) {
          renderRowsByAriaLabel('预警项目列表', rProjectRowsFromApi, (row) => ([
            { value: asText(firstNonNull(row.projectName, row.project_name)) },
            { value: asText(firstNonNull(row.sopTime, row.sopDate, row.sop_time)) },
            { value: asText(firstNonNull(row.description, row.note, row.remark, row.situation)) }
          ]));
        }

        const ryg = data.projectHealthRygStat;
        if (ryg && typeof ryg === 'object' && vm.$el) {
          const g = vm.$el.querySelector('#projectHealthRygGreen');
          const y = vm.$el.querySelector('#projectHealthRygYellow');
          const rEl = vm.$el.querySelector('#projectHealthRygRed');
          if (g && (ryg.GREEN != null || ryg.green != null)) g.value = asText(firstNonNull(ryg.GREEN, ryg.green));
          if (y && (ryg.YELLOW != null || ryg.yellow != null)) y.value = asText(firstNonNull(ryg.YELLOW, ryg.yellow));
          if (rEl && (ryg.RED != null || ryg.red != null)) rEl.value = asText(firstNonNull(ryg.RED, ryg.red));
        }
      } catch (error) {
        // Keep default page test data when API is unavailable or empty.
      }
    }

    function autoResizeTextarea(textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    function initEditableCells() {
      const editableTextCells = document.querySelectorAll('tbody td:not(.num):not(.amount) .cell-input');
      editableTextCells.forEach((input) => {
        if (input.tagName !== 'INPUT') return;
        const table = input.closest('table');
        const td = input.closest('td');
        const tableLabel = table && table.getAttribute('aria-label');
        const isCustomerTableCell = tableLabel === '客户销售情况';
        if (isCustomerTableCell) return;
        const isHrDepartmentCell = table
          && tableLabel === '人力资源报告表'
          && td
          && td.cellIndex === 1;
        if (isHrDepartmentCell) return;
        if (input.readOnly) return;
        const textarea = document.createElement('textarea');
        textarea.className = 'cell-textarea';
        textarea.rows = 1;
        textarea.value = input.value || '';
        textarea.setAttribute('aria-label', input.getAttribute('aria-label') || '可编辑文本');
        applyScopeAttr(textarea);
        input.replaceWith(textarea);
        autoResizeTextarea(textarea);
        textarea.addEventListener('input', () => autoResizeTextarea(textarea));
      });
    }

    function clearRowFields(row) {
      const fields = row.querySelectorAll('input, textarea, select');
      fields.forEach((field) => {
        if (field.readOnly) return;
        if (field.tagName === 'SELECT') {
          field.selectedIndex = 0;
          return;
        }
        if (field.type === 'checkbox' || field.type === 'radio') {
          field.checked = false;
          return;
        }
        field.value = '';
        if (field.tagName === 'TEXTAREA') {
          autoResizeTextarea(field);
        }
      });
    }

    function getTodayLabel() {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      return `${yyyy}年${mm}月${dd}日`;
    }

    function initTableDateLabels() {
      const todayLabel = getTodayLabel();
      const tables = document.querySelectorAll('.sheet table');
      tables.forEach((table) => {
        const aria = (table.getAttribute('aria-label') || '').trim();
        if (aria === '预警项目列表') return;
        if (aria === '硬件供货') return;
        const wrap = table.parentElement;
        if (wrap && wrap.classList.contains('table-tool-wrap')) {
          const bar = wrap.querySelector(':scope > .table-tool-wrap-bar');
          if (bar) {
            let label = bar.querySelector('.table-date-label');
            if (label) {
              label.textContent = todayLabel;
              return;
            }
            label = document.createElement('div');
            label.className = 'table-date-label';
            label.textContent = todayLabel;
            applyScopeAttr(label);
            bar.insertBefore(label, bar.firstChild);
            return;
          }
        }
        const prev = table.previousElementSibling;
        if (prev && prev.classList.contains('table-date-label')) {
          prev.textContent = todayLabel;
          return;
        }
        const dateLabel = document.createElement('div');
        dateLabel.className = 'table-date-label';
        dateLabel.textContent = todayLabel;
        applyScopeAttr(dateLabel);
        table.parentNode.insertBefore(dateLabel, table);
      });
    }

    function initTableRowTools() {
      const tables = document.querySelectorAll('.sheet table');
      const excludedTableLabels = new Set([
        '现金流量表',
        '销售情况表',
        '客户销售情况',
        '预警项目列表',
        '硬件供货'
      ]);
      tables.forEach((table) => {
        const tableLabel = (table.getAttribute('aria-label') || '').trim();
        if (excludedTableLabels.has(tableLabel)) return;
        if (!table.tBodies || table.tBodies.length === 0) return;
        const tbody = table.tBodies[0];
        if (!tbody || tbody.rows.length === 0) return;

        const wrap = document.createElement('div');
        wrap.className = 'table-tool-wrap';
        applyScopeAttr(wrap);
        table.parentNode.insertBefore(wrap, table);

        const bar = document.createElement('div');
        bar.className = 'table-tool-wrap-bar';
        applyScopeAttr(bar);
        wrap.appendChild(bar);

        const tools = document.createElement('div');
        tools.className = 'table-row-tools';
        applyScopeAttr(tools);

        const addBtn = document.createElement('button');
        addBtn.type = 'button';
        addBtn.className = 'row-tool-btn';
        addBtn.textContent = '+';
        addBtn.setAttribute('aria-label', '新增一行');
        applyScopeAttr(addBtn);

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'row-tool-btn';
        removeBtn.textContent = '-';
        removeBtn.setAttribute('aria-label', '删除一行');
        applyScopeAttr(removeBtn);

        addBtn.addEventListener('click', () => {
          const sourceRow = [...tbody.rows].reverse().find((row) => !row.classList.contains('total')) || tbody.rows[tbody.rows.length - 1];
          if (!sourceRow) return;
          const newRow = sourceRow.cloneNode(true);
          clearRowFields(newRow);
          applyScopeAttr(newRow);
          tbody.appendChild(newRow);
        });

        removeBtn.addEventListener('click', () => {
          const removableRows = [...tbody.rows].filter((row) => !row.classList.contains('total'));
          if (removableRows.length <= 1) return;
          removableRows[removableRows.length - 1].remove();
        });

        tools.appendChild(addBtn);
        tools.appendChild(removeBtn);
        bar.appendChild(tools);
        wrap.appendChild(table);
      });
    }

    function initCustomerTableRowTools() {
      const table = document.querySelector('table[aria-label="客户销售情况"]');
      if (!table || !table.tBodies || !table.tBodies[0]) return;
      const tbody = table.tBodies[0];
      const addBtn = document.querySelector('[data-customer-row-action="add"]');
      const removeBtn = document.querySelector('[data-customer-row-action="remove"]');
      if (!addBtn || !removeBtn) return;

      addBtn.addEventListener('click', () => {
        const sourceRow = tbody.rows[tbody.rows.length - 1];
        if (!sourceRow) return;
        const newRow = sourceRow.cloneNode(true);
        clearRowFields(newRow);
        applyScopeAttr(newRow);
        tbody.appendChild(newRow);
      });

      removeBtn.addEventListener('click', () => {
        if (tbody.rows.length <= 1) return;
        tbody.rows[tbody.rows.length - 1].remove();
      });
    }

    function initRProjectTableRowTools() {
      const block = vm.$el.querySelector('.r-project-list-wrap');
      if (!block || block.dataset.rProjectRowToolsBound === '1') return;
      block.dataset.rProjectRowToolsBound = '1';
      const table = block.querySelector('table[aria-label="预警项目列表"]');
      if (!table || !table.tBodies || !table.tBodies[0]) return;
      const tbody = table.tBodies[0];
      const addBtn = block.querySelector('[data-r-project-row-action="add"]');
      const removeBtn = block.querySelector('[data-r-project-row-action="remove"]');
      if (!addBtn || !removeBtn) return;

      addBtn.addEventListener('click', () => {
        const sourceRow = tbody.rows[tbody.rows.length - 1];
        if (!sourceRow) return;
        const newRow = sourceRow.cloneNode(true);
        clearRowFields(newRow);
        applyScopeAttr(newRow);
        tbody.appendChild(newRow);
      });

      removeBtn.addEventListener('click', () => {
        if (tbody.rows.length <= 1) return;
        tbody.rows[tbody.rows.length - 1].remove();
      });
    }

    function hardwareSupplySegmentAddRow(tbody) {
      const leader = tbody.querySelector('tr.hardware-product-row:not(.hardware-product-cont)');
      const rowspanCell =
        tbody.querySelector('td.hardware-product-type-cell') || (leader && leader.cells[0]) || null;
      const productRows = [...tbody.querySelectorAll('tr.hardware-product-row')];
      if (!leader || !rowspanCell || !productRows.length) return;
      const lastProductRow = productRows[productRows.length - 1];
      let newRow;
      if (productRows.length === 1) {
        newRow = leader.cloneNode(true);
        newRow.classList.add('hardware-product-cont');
        const typeTd = newRow.querySelector('td.hardware-product-type-cell');
        if (typeTd) typeTd.remove();
        clearRowFields(newRow);
      } else {
        newRow = lastProductRow.cloneNode(true);
        clearRowFields(newRow);
      }
      applyScopeAttr(newRow);
      tbody.appendChild(newRow);
      const prev = parseInt(rowspanCell.getAttribute('rowspan') || '1', 10);
      rowspanCell.setAttribute('rowspan', String(prev + 1));
    }

    function hardwareSupplySegmentRemoveRow(tbody) {
      const leader = tbody.querySelector('tr.hardware-product-row:not(.hardware-product-cont)');
      const rowspanCell =
        tbody.querySelector('td.hardware-product-type-cell') || (leader && leader.cells[0]) || null;
      const productRows = [...tbody.querySelectorAll('tr.hardware-product-row')];
      if (!leader || !rowspanCell || productRows.length <= 1) return;
      productRows[productRows.length - 1].remove();
      const prev = parseInt(rowspanCell.getAttribute('rowspan') || '1', 10);
      rowspanCell.setAttribute('rowspan', String(Math.max(1, prev - 1)));
    }

    function initHardwareSupplyRowTools() {
      const block = vm.$el.querySelector('.hardware-supply-block');
      if (!block || block.dataset.hwSegmentToolsBound === '1') return;
      block.dataset.hwSegmentToolsBound = '1';
      block.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-hardware-row-action][data-hardware-segment]');
        if (!btn || !block.contains(btn)) return;
        const segment = btn.getAttribute('data-hardware-segment');
        const action = btn.getAttribute('data-hardware-row-action');
        const table = block.querySelector('table[aria-label="硬件供货"]');
        if (!table || !segment) return;
        const tbody = Array.from(table.querySelectorAll('tbody[data-hardware-segment]')).find(
          (tb) => tb.getAttribute('data-hardware-segment') === segment
        );
        if (!tbody) return;
        if (action === 'add') {
          hardwareSupplySegmentAddRow(tbody);
        } else if (action === 'remove') {
          hardwareSupplySegmentRemoveRow(tbody);
        }
      });
    }

    async function initProjectHealthRygChart() {
      const chartDom = vm.$el.querySelector('#projectHealthRygChart');
      if (!chartDom) return;

      if (vm._projectHealthChart) {
        vm._projectHealthChart.dispose();
        vm._projectHealthChart = null;
      }
      if (vm._projectHealthChartResize) {
        window.removeEventListener('resize', vm._projectHealthChartResize);
        vm._projectHealthChartResize = null;
      }

      const chart = (await import(/* webpackChunkName: "echarts" */ 'echarts')).init(chartDom);
      vm._projectHealthChart = chart;

      function readCounts() {
        const gEl = vm.$el.querySelector('#projectHealthRygGreen');
        const yEl = vm.$el.querySelector('#projectHealthRygYellow');
        const rEl = vm.$el.querySelector('#projectHealthRygRed');
        const parse = (el) => {
          if (!el) return 0;
          const n = parseInt(String(el.value).replace(/\D/g, ''), 10);
          return Number.isFinite(n) && n >= 0 ? n : 0;
        };
        return { g: parse(gEl), y: parse(yEl), r: parse(rEl) };
      }

      function applyChart() {
        const { g, y, r } = readCounts();
        const total = g + y + r;
        const data = [
          { name: '正常', value: g, itemStyle: { color: '#10b981' } },
          { name: '警告', value: y, itemStyle: { color: '#f59e0b' } },
          { name: '异常', value: r, itemStyle: { color: '#ef4444' } }
        ];
        chart.setOption({
          tooltip: { trigger: 'item' },
          legend: { bottom: '2%', left: 'center', textStyle: { fontSize: 11 } },
          graphic: [
            {
              type: 'text',
              left: 'center',
              top: '38%',
              z: 10,
              style: {
                text: String(total),
                fill: '#1d3f60',
                font: 'bold 28px "Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif',
                textAlign: 'center',
                textVerticalAlign: 'middle'
              }
            },
            {
              type: 'text',
              left: 'center',
              top: '46%',
              z: 10,
              style: {
                text: '项目总数',
                fill: '#2f587f',
                font: '600 13px "Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif',
                textAlign: 'center',
                textVerticalAlign: 'middle'
              }
            }
          ],
          series: [{
            name: '项目状态',
            type: 'pie',
            center: ['50%', '44%'],
            radius: ['45%', '72%'],
            avoidLabelOverlap: false,
            itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
            label: { show: false },
            data
          }]
        });
      }

      vm._refreshProjectHealthRygChart = applyChart;
      applyChart();

      vm._projectHealthChartResize = () => {
        chart.resize();
      };
      window.addEventListener('resize', vm._projectHealthChartResize);
      vm.$nextTick(() => chart.resize());
    }

    async function initPage() {
      await loadTableDataFromApi();
      initEditableCells();
      // P0: 异步加载 echarts，单独 chunk
      await initProjectHealthRygChart();
      initTableRowTools();
      initTableDateLabels();
      initCustomerTableRowTools();
      initRProjectTableRowTools();
      initHardwareSupplyRowTools();
      lastSavedPayload = JSON.stringify(buildTableInfoNewSaveRequestBody());
      startAutoSave();
    }
    this._saveTableDataToApi = saveTableDataToApi;
    await initPage();
  },
  beforeDestroy() {
    if (autoSaveTimerId) {
      clearInterval(autoSaveTimerId);
      autoSaveTimerId = null;
    }
    if (this._projectHealthChartResize) {
      window.removeEventListener('resize', this._projectHealthChartResize);
      this._projectHealthChartResize = null;
    }
    if (this._projectHealthChart) {
      this._projectHealthChart.dispose();
      this._projectHealthChart = null;
    }
    this._refreshProjectHealthRygChart = null;
  }
};
</script>

<style scoped>
.work-week-report-from-image {
      --blue-header: #4f86b7;
      --blue-section: #b8c2d3;
      --row-bg: #d4d9e4;
      --line: #eef1f6;
      --text: #111;
      --table-font: clamp(13px, 1.2vw, 16px);
      --title-font: clamp(18px, 1.8vw, 24px);
      --cell-py: clamp(6px, 0.9vw, 10px);
      --cell-px: clamp(6px, 0.8vw, 10px);
    }

    * {
      box-sizing: border-box;
    }
    .work-week-report-from-image {
      margin: 0;
      background: #f4f6fa;
      font-family: "Microsoft YaHei", "PingFang SC", "Noto Sans SC", sans-serif;
      color: var(--text);
      display: flex;
      justify-content: center;
      padding: 16px;
    }

    .sheet {
      width: 100%;
      max-width: 1120px;
      background: #fff;
      border: 1px solid var(--line);
      overflow-x: auto;
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(30, 30, 30, 0.06);
      padding-bottom: 10px;
    }

    .page-main-title {
      margin: 0;
      padding: 16px 12px 14px;
      font-size: clamp(22px, 2.4vw, 32px);
      font-weight: 800;
      letter-spacing: 0.08em;
      text-align: center;
      color: #0d2d4a;
      line-height: 1.2;
    }

    .section-overview-title {
      margin: 0 0 12px;
      padding: 0 10px;
      font-size: clamp(20px, 2.05vw, 28px);
      font-weight: 700;
      color: #1d3f60;
      line-height: 1.35;
      text-align: left;
    }

    .section-overview-title--following {
      margin-top: 28px;
    }

    .report-outline-section {
      margin: 0;
    }

    .section-overview-title--collapsible {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      user-select: none;
      border-radius: 4px;
      padding: 4px 10px;
      margin-left: -2px;
      margin-right: -2px;
      transition: background-color 0.15s ease;
    }

    .section-overview-title--collapsible:hover {
      background: rgba(79, 134, 183, 0.08);
    }

    .section-overview-title--collapsible:focus {
      outline: 2px solid #4f86b7;
      outline-offset: 2px;
    }

    .section-overview-title__chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.1em;
      font-size: 0.72em;
      line-height: 1;
      color: #4f86b7;
      flex-shrink: 0;
    }

    .section-overview-title__label {
      flex: 1;
      min-width: 0;
    }

    .report-outline-section__body {
      margin: 0;
    }

    .hardware-supply-block + .logistics-wrap {
      margin-top: 14px;
    }

    .hardware-supply-block {
      padding: 0 10px 8px;
      margin-bottom: 4px;
    }

    .hardware-type-section + .hardware-type-section {
      margin-top: 18px;
    }

    .hardware-type-fixed {
      margin-bottom: 8px;
    }

    .hardware-total-section {
      margin-top: 22px;
    }

    .project-dev-status-block {
      padding: 0 10px 4px;
      margin-bottom: 4px;
    }

    .project-health-ryg-panel {
      position: relative;
      margin-bottom: 18px;
    }

    .project-health-ryg-hidden-inputs {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
      pointer-events: none;
    }

    .project-health-ryg-hidden-inputs input {
      position: absolute;
      opacity: 0;
      width: 1px;
      height: 1px;
    }

    .project-health-ryg-chart {
      width: 100%;
      height: 280px;
      min-height: 220px;
    }

    .r-project-list-wrap {
      margin-top: 8px;
    }

    .r-project-list-wrap .sales-title {
      margin-bottom: 10px;
    }

    .r-project-table-wrap {
      position: relative;
    }

    .r-project-row-tools {
      display: inline-flex;
      gap: 6px;
    }

    .r-project-table-wrap .r-project-row-tools {
      position: absolute;
      top: 0;
      right: 6px;
      z-index: 2;
    }

    table.r-project-list th,
    table.r-project-list td {
      vertical-align: top;
    }

    .company-overview-block {
      padding: 0 10px 4px;
      margin-bottom: 6px;
    }

    .company-overview-block > .sales-wrap {
      margin-top: 0;
    }

    .company-overview-block > .customer-wrap {
      margin-top: 22px;
    }

    .company-overview-block > .toc-transform-wrap {
      margin-top: 22px;
    }

    .company-overview-block > .project-wrap {
      margin-top: 24px;
    }

    .toc-transform-body {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .sim-traffic-report-embed {
      margin: 6px 0 12px;
      width: 100%;
      border: 1px solid #c5d3e0;
      border-radius: 6px;
      overflow: hidden;
      background: #f8fafc;
    }

    .sim-traffic-report-embed__frame {
      display: block;
      width: 100%;
      height: min(720px, 72vh);
      min-height: 420px;
      border: 0;
    }

    .sim-traffic-report-embed__print-fallback {
      display: none;
      margin: 0;
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.45;
      color: #1d3f60;
      word-break: break-all;
    }

    .sim-traffic-report-embed__url {
      font-weight: 600;
    }

    .project-health-ryg-chart-print-img,
    .sim-traffic-report-embed__snapshot {
      max-width: 100%;
      vertical-align: top;
    }

    .export-pdf-btn {
      position: fixed;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      z-index: 1000;
      border: 1px solid #2f6fa8;
      background: #4f86b7;
      color: #fff;
      font-size: 14px;
      line-height: 1;
      padding: 10px 14px;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .export-pdf-btn:hover {
      background: #3f78aa;
    }

    .export-pdf-btn:active {
      transform: translateY(1px);
    }

    .save-table-btn {
      position: fixed;
      top: calc(50% - 52px);
      right: 16px;
      z-index: 1000;
      border: 1px solid #2f6fa8;
      background: #4f86b7;
      color: #fff;
      font-size: 14px;
      line-height: 1;
      padding: 10px 14px;
      border-radius: 6px;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    .save-table-btn:hover {
      background: #3f78aa;
    }

    .save-table-btn:active {
      transform: translateY(1px);
    }

    .sheet-title {
      display: grid;
      grid-template-columns: 1fr auto;
      font-size: var(--title-font);
      line-height: 1.2;
      padding: 8px 10px;
      gap: 8px;
      margin: 0 0 10px;
      color: #1d3f60;
      font-weight: 700;
      background: #eef5fb;
      border-left: 5px solid var(--blue-header);
      border-radius: 4px;
    }

    .sheet-title .left {
      color: #1d3f60;
    }

    .sheet-title .unit {
      text-align: right;
      font-size: clamp(14px, 1.5vw, 20px);
      color: #2f587f;
      white-space: nowrap;
      font-weight: 600;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    th,
    td {
      border: 2px solid var(--line);
      padding: var(--cell-py) var(--cell-px);
      background: var(--row-bg);
      font-size: var(--table-font);
      line-height: 1.25;
      vertical-align: middle;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
      text-align: left;
      padding-top: 8px;
      padding-bottom: 8px;
    }

    .cell-input,
    .cell-textarea {
      width: 100%;
      min-width: 2em;
      max-width: 100%;
      border: none;
      background: transparent;
      font: inherit;
      font-size: inherit;
      color: inherit;
      padding: 0;
      margin: 0;
      box-sizing: border-box;
      line-height: inherit;
      vertical-align: middle;
    }

    .cell-textarea {
      display: block;
      resize: none;
      min-height: 2.4em;
      overflow: hidden;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .cell-input:focus,
    .cell-textarea:focus {
      outline: 2px solid #2f6fa8;
      outline-offset: 1px;
      border-radius: 2px;
    }

    .table-tool-wrap {
      margin-top: 4px;
    }

    .table-tool-wrap-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin: 0 0 2px;
    }

    .table-date-label {
      font-size: 13px;
      line-height: 1.2;
      color: #2f587f;
      font-weight: 600;
      margin: 0;
      text-align: left;
      flex-shrink: 0;
    }

    .table-row-tools {
      display: flex;
      justify-content: flex-end;
      gap: 6px;
      margin: 0;
      flex-shrink: 0;
    }

    .row-tool-btn {
      width: 24px;
      height: 24px;
      border: 1px solid #2f6fa8;
      border-radius: 4px;
      background: #4f86b7;
      color: #fff;
      font-size: 16px;
      line-height: 1;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .row-tool-btn:hover {
      background: #3f78aa;
    }

    td.amount .cell-input,
    td.num .cell-input,
    td.amount .cell-textarea,
    td.num .cell-textarea {
      text-align: right;
    }

    td.amount {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    tr.section td {
      background: var(--blue-section);
      font-weight: 700;
    }

    tr.section td.amount {
      background: var(--blue-section);
    }

    tr.bold td:first-child {
      font-weight: 700;
    }

    .sales-wrap {
      margin-top: 24px;
    }

    .sales-title.sales-title--goals {
      flex-direction: column;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 8px;
    }

    .sales-title--goals-detail {
      width: 100%;
    }

    .sales-title--goals-line {
      margin: 0;
      font-size: clamp(14px, 1.5vw, 20px);
      color: #2f587f;
      font-weight: 600;
      line-height: 1.5;
    }

    .sales-title--goals-line + .sales-title--goals-line {
      margin-top: 4px;
    }

    .sales-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: #1d3f60;
      gap: 8px;
      flex-wrap: wrap;
      font-weight: 700;
      background: #eef5fb;
      border-left: 5px solid var(--blue-header);
      border-radius: 4px;
      padding: 8px 10px;
    }

    .sales-title .unit {
      font-size: clamp(14px, 1.5vw, 20px);
      color: #2f587f;
      white-space: nowrap;
      font-weight: 600;
    }

    table.sales {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    table.sales th,
    table.sales td {
      border: 3px solid #1e1e1e;
      background: #fff;
      color: #111;
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      min-height: clamp(34px, 2.8vw, 42px);
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.sales th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.sales td.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: normal;
    }

    table.sales .cell-input,
    table.sales .cell-textarea {
      font-size: var(--table-font);
      line-height: 1.25;
    }

    table.sales .cell-textarea {
      min-height: 1.25em;
    }

    table.sales tr.total td {
      font-weight: 700;
    }

    table.sales col {
      width: auto !important;
    }

    .customer-wrap {
      margin-top: 24px;
    }

    .customer-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: #1d3f60;
      gap: 8px;
      flex-wrap: wrap;
      font-weight: 700;
      background: #eef5fb;
      border-left: 5px solid var(--blue-header);
      border-radius: 4px;
      padding: 8px 10px;
    }

    .customer-title .unit {
      font-size: clamp(14px, 1.5vw, 20px);
      color: #2f587f;
      white-space: nowrap;
      font-weight: 600;
    }

    .customer-title-right {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-left: auto;
    }

    .customer-row-tools {
      display: inline-flex;
      gap: 6px;
    }

    .customer-table-wrap {
      position: relative;
    }

    .customer-table-wrap .customer-row-tools {
      position: absolute;
      top: 0;
      right: 6px;
      z-index: 2;
    }

    table.customer {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    table.customer th,
    table.customer td {
      border: 3px solid #1e1e1e;
      background: #fff;
      color: #111;
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.customer th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.customer td.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: normal;
    }

    table.customer col {
      width: auto !important;
    }

    .hr-wrap {
      margin-top: 24px;
    }

    .hr-panels {
      display: grid;
      grid-template-columns: 2fr 1.2fr;
      gap: 10px;
      align-items: stretch;
    }

    .hr-title {
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: #1d3f60;
      font-weight: 700;
      background: #eef5fb;
      border-left: 5px solid var(--blue-header);
      border-radius: 4px;
      padding: 8px 10px;
    }

    table.hr {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    table.hr th,
    table.hr td {
      border: 3px solid #1e1e1e;
      background: #fff;
      color: #111;
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.2;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.hr thead th.group {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.hr th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.hr td.num,
    table.hr th.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr td:nth-child(2),
    table.hr th:nth-child(2) {
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr td.num .cell-input,
    table.hr td.num .cell-textarea {
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr tr.total td {
      font-weight: 700;
    }

    .hr-right {
      display: flex;
    }

    .hr-right.is-hidden {
      display: none !important;
    }

    table.hr-side {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
      height: 100%;
    }

    table.hr-side th,
    table.hr-side td {
      border: 3px solid #1e1e1e;
      background: #fff;
      color: #245b8f;
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.2;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.hr-side th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.hr-side td.num,
    table.hr-side th.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr-side td.num .cell-input,
    table.hr-side td.num .cell-textarea {
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr-side tr.total td {
      font-weight: 700;
    }

    .project-wrap {
      margin-top: 24px;
    }

    .project-title {
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: #1d3f60;
      font-weight: 700;
      background: #eef5fb;
      border-left: 5px solid var(--blue-header);
      border-radius: 4px;
      padding: 8px 10px;
    }

    table.project {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    table.project th,
    table.project td {
      border: 3px solid #1e1e1e;
      background: #fff;
      color: #111;
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.project th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.project tr.total td {
      font-weight: 700;
    }

    table.project td.hardware-product-type-cell {
      vertical-align: middle;
      text-align: center;
    }

    table.project td.hardware-product-type-cell .cell-input {
      text-align: center;
      font-weight: 700;
    }

    .hardware-product-type-inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
    }

    .hardware-supply-inline-tools {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }

    .row-tool-btn--hardware-inline {
      width: 18px;
      height: 18px;
      font-size: 11px;
      font-weight: 600;
      border-radius: 3px;
      border: 1px solid #c5d3e0;
      background: #f4f7fa;
      color: #7a8fa3;
    }

    .row-tool-btn--hardware-inline:hover {
      background: #e9f0f7;
      color: #5a6f82;
      border-color: #a8bad0;
    }

    .logistics-wrap {
      margin-top: 24px;
    }

    .logistics-title {
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: #1d3f60;
      font-weight: 700;
      background: #eef5fb;
      border-left: 5px solid var(--blue-header);
      border-radius: 4px;
      padding: 8px 10px;
    }

    .logistics-grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      align-items: start;
    }

    .logistics-table-block {
      min-width: 0;
    }

    .sub-title {
      font-size: clamp(14px, 1.3vw, 18px);
      color: #2f587f;
      font-weight: 700;
      margin: 0 0 6px;
    }

    table.logistics,
    table.sim {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    table.logistics th,
    table.logistics td,
    table.sim th,
    table.sim td {
      border: 3px solid #1e1e1e;
      background: #fff;
      color: #111;
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.logistics th,
    table.sim th {
      background: var(--blue-header);
      color: #fff;
      font-weight: 700;
    }

    table.logistics td.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      .sheet-title,
      .sheet-title .unit,
      .sales-title,
      .sales-title .unit,
      .customer-title,
      .customer-title .unit,
      .hr-title {
        font-size: 18px;
      }

      .section-overview-title {
        font-size: 20px;
      }

      th,
      td,
      table.sales th,
      table.sales td,
      table.customer th,
      table.customer td,
      table.hr th,
      table.hr td,
      table.hr-side th,
      table.hr-side td,
      table.project th,
      table.project td,
      table.logistics th,
      table.logistics td,
      table.sim th,
      table.sim td {
        font-size: 13px;
        padding: 6px 6px;
      }

      .hr-panels {
        grid-template-columns: 1fr;
      }

      .logistics-grid-2 {
        grid-template-columns: 1fr;
      }

      .project-health-ryg-chart {
        height: 240px;
        min-height: 200px;
      }
    }

    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    @media print {
      html,
    .work-week-report-from-image {
        width: 210mm;
        background: #fff !important;
      }
    .work-week-report-from-image {
        margin: 0;
        padding: 0;
        display: block;
        color: #000;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }

      .sheet {
        max-width: none;
        width: 100%;
        border: none;
        border-radius: 0;
        box-shadow: none;
        overflow: visible;
        padding-bottom: 0;
      }

      .export-pdf-btn {
        display: none !important;
      }

      .save-table-btn {
        display: none !important;
      }

      .report-outline-section__body {
        display: block !important;
      }

      iframe.sim-traffic-report-embed__frame {
        display: none !important;
      }

      .sim-traffic-report-embed__snapshot {
        display: block !important;
        max-height: 90mm;
        width: 100% !important;
        object-fit: contain;
      }

      .project-health-ryg-chart-print-img {
        display: block !important;
        max-height: 58mm;
        width: 100% !important;
        object-fit: contain;
      }

      .sim-traffic-report-embed__print-fallback {
        display: block !important;
      }

      .sim-traffic-report-embed {
        border: 1px solid #000;
        page-break-inside: avoid;
      }

      .hardware-supply-inline-tools {
        display: none !important;
      }

      .table-tool-wrap-bar {
        margin-bottom: 0.8mm;
      }

      .table-row-tools {
        display: flex !important;
        margin-bottom: 0 !important;
      }

      .row-tool-btn {
        border: 1px solid #000 !important;
        background: #fff !important;
        color: #000 !important;
        width: 5.5mm;
        height: 5.5mm;
        font-size: 11pt;
      }

      .page-main-title {
        font-size: 18pt !important;
        padding: 0 0 3mm;
        margin: 0 0 4mm;
        page-break-after: avoid;
        break-after: avoid-page;
      }

      .section-overview-title {
        font-size: 14pt !important;
        text-align: left;
        padding: 0 0 2mm;
        margin: 0 0 3mm;
        page-break-after: avoid;
        break-after: avoid-page;
      }

      .section-overview-title--following {
        margin-top: 5mm !important;
      }

      .hardware-supply-block + .logistics-wrap {
        margin-top: 2mm;
      }

      .project-health-ryg-chart {
        height: 55mm;
        min-height: 50mm;
      }

      .sheet-title,
      .sales-title,
      .customer-title,
      .hr-title {
        font-size: 13pt !important;
        margin-bottom: 4mm;
      }

      .sheet-title {
        padding: 0 0 2mm 0;
      }

      table,
      table.sales,
      table.customer,
      table.hr,
      table.hr-side,
      table.project,
      table.logistics,
      table.sim {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
        margin-bottom: 6mm;
        page-break-inside: auto;
      }

      thead {
        display: table-header-group;
      }

      tfoot {
        display: table-footer-group;
      }

      tr,
      tbody {
        page-break-inside: auto;
        break-inside: auto;
      }

      td,
      th {
        page-break-inside: auto;
        break-inside: auto;
      }

      th,
      td,
      table.sales th,
      table.sales td,
      table.customer th,
      table.customer td,
      table.hr th,
      table.hr td,
      table.hr-side th,
      table.hr-side td,
      table.project th,
      table.project td,
      table.logistics th,
      table.logistics td,
      table.sim th,
      table.sim td {
        font-size: 10.5pt !important;
        line-height: 1.25;
        padding: 1.8mm 1.6mm;
        color: #000 !important;
      }

      .sales-title,
      .customer-title,
      .hr-title,
      .project-title,
      .logistics-title {
        margin-bottom: 2mm;
        page-break-after: avoid;
        break-after: avoid-page;
      }

      .sub-title {
        margin-bottom: 1.2mm;
        page-break-after: avoid;
        break-after: avoid-page;
      }

      .company-overview-block,
      .sales-wrap,
      .customer-wrap,
      .hr-wrap,
      .project-wrap,
      .project-dev-status-block,
      .hardware-supply-block,
      .logistics-wrap,
      .toc-transform-wrap {
        margin-top: 0;
        margin-bottom: 2mm;
        page-break-inside: auto;
        break-inside: auto;
      }

      .hr-wrap {
        page-break-before: auto;
      }

      .project-wrap,
      .logistics-wrap,
      .toc-transform-wrap {
        page-break-before: auto;
      }

      .hr-panels {
        grid-template-columns: 1fr;
        gap: 4mm;
      }

      .logistics-grid-2 {
        grid-template-columns: 1fr 1fr;
        gap: 2mm;
      }

      .logistics-grid-2 > .logistics-table-block {
        page-break-inside: avoid;
        break-inside: avoid;
      }

      table.logistics,
      table.sim {
        page-break-inside: auto;
        break-inside: auto;
      }

      .cell-input,
      .cell-textarea {
        border: none !important;
        outline: none !important;
        box-shadow: none !important;
        background: transparent !important;
        color: #000 !important;
        -webkit-print-color-adjust: exact;
        print-color-adjust: exact;
      }
    }
</style>
