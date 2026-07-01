<template>
  <div
    class="work-week-report-from-image"
    v-loading="tableQueryLoading"
    element-loading-text="数据加载中..."
    element-loading-background="rgba(255, 255, 255, 0.72)"
  >
<button class="save-table-btn" type="button" @click="saveTableData">保存</button>
<button class="export-pdf-btn" type="button" @click="exportPageToPdf">导出PDF</button>
  <div class="sheet">
    <h1 class="page-main-title">SOIMT经营状态汇总</h1>
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
          <p class="sales-title--goals-line">1.年度销售额41,381万元</p>
          <div class="sales-title--goals-projects">
            <p class="sales-title--goals-projects-item">海外出行2026年预测收入41,381万元，包含开发费5,750万，软件许可和续费12,235万，智能硬件22,896万和整车台架500万。净利润预测3,505万元。</p>
          </div>
          <p class="sales-title--goals-line">2.To C 转型关键发力</p>
          <div class="sales-title--goals-projects">
            <p class="sales-title--goals-projects-item">通过iSmart用户的运营实现全域流量捕捉，通过手机/车机双触点的数字化裂变机制，同时建立全球合规的续费通道，推进后向增值服务与用户侧续费模式，实现服务场景穿透和客户转化，形成"十五五"期间关键发力。</p>
          </div>
          <p class="sales-title--goals-line">3.三大智能化重点项目推进</p>
          <div class="sales-title--goals-projects">
            <p class="sales-title--goals-projects-intro">为提升海外智能化产品力，与Google和Apple深度战略合作，推出三大项目</p>
            <p class="sales-title--goals-projects-item">1.MG Voice3.&amp;AA:接入Geminior GPT的Hybrid Agents 模型架构，完成从"被动执行"进化为"主动服务"的智能车载语音产品送代，打造海外第一梯队的智能语音交互体验。SOP:2026/12/25;</p>
            <p class="sales-title--goals-projects-item">2.MG Carplay Ultra:与苹果团队共同设计、定义并实现SAIC CarPlay，为MG用户提供统一、流畅且可定制的智舱互联互通终极体验。SOP:2027/4/30;</p>
            <p class="sales-title--goals-projects-item">3.MG Map 2.0 with Google API:接入全球最权威、最新、最智能的地图 Google POl库，让用户搜得准、按得快、搜得到。SOP:2026/12/30;</p>
          </div>
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
            <th>2026年预计</th>
            <th>今年至今</th>
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
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="20,709" /></td>
            <td class="num"><input type="text" class="cell-input" value="98%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="三" /></td>
            <td><input type="text" class="cell-input" value="软件开发" /></td>
            <td><input type="text" class="cell-input" value="车机软件开发" /></td>
            <td class="num"><input type="text" class="cell-input" value="6,445" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="3,054" /></td>
            <td class="num"><input type="text" class="cell-input" value="47%" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr class="total">
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="合计" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td class="num"><input type="text" class="cell-input" value="41,040" /></td>
            <td class="num"><input type="text" class="cell-input" value="8,914" /></td>
            <td class="num"><input type="text" class="cell-input" value="32,677" /></td>
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
        <div class="sales-title"><div>销售合同</div></div>
        <div class="customer-table-wrap toc-sales-contract-table-wrap">
          <table class="customer" aria-label="销售合同">
            <colgroup>
              <col style="width: 8%">
              <col style="width: 30%">
              <col style="width: 22%">
              <col style="width: 40%">
            </colgroup>
            <thead>
              <tr>
                <th>序号</th>
                <th>合同标题</th>
                <th>合同编号</th>
                <th>备注信息</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="1" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="2" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="3" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="4" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
              </tr>
              <tr>
                <td class="num"><input type="text" class="cell-input" value="5" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="sales-title"><div>To C转型</div></div>
        <div class="toc-transform-body">
          <div class="toc-table-block">
            <div class="sub-title">海外C端续费用户基数</div>
            <table class="project soimt-renewal" aria-label="SOIMT续费用户与上线计划表">
              <colgroup>
                <col class="soimt-renewal-col-region" />
                <col class="soimt-renewal-col-product" />
                <col class="soimt-renewal-col-product" />
                <col class="soimt-renewal-col-product" />
                <col class="soimt-renewal-col-plan" />
              </colgroup>
              <thead>
                <tr>
                  <th colspan="4" class="soimt-renewal-group-th">续费用户基数</th>
                  <th rowspan="2" class="soimt-renewal-plan-th">续费上线计划</th>
                </tr>
                <tr>
                  <th>Region</th>
                  <th>iSmart Full</th>
                  <th>iSmart Lite</th>
                  <th>iSmart Connect</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><input type="text" class="cell-input" data-field="region" value="" /></td>
                  <td class="num"><input type="text" class="cell-input" data-field="ismartFull" value="" /></td>
                  <td class="num"><input type="text" class="cell-input" data-field="ismartLite" value="" /></td>
                  <td class="num"><input type="text" class="cell-input" data-field="ismartConnect" value="" /></td>
                  <td><input type="text" class="cell-input" data-field="renewalLaunchPlan" value="" /></td>
                </tr>
              </tbody>
            </table>
            <table class="sim sim-card-management-table" aria-label="海外C端续费用户基数">
              <thead>
                <tr>
                  <th>全球运营商管理</th>
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
        </div>
      </div>

      <div class="project-wrap">
      <div class="project-title">SOIMT领域发展</div>
      <table class="project" aria-label="SOIMT领域发展表">
        <colgroup>
          <col class="soimt-col-domain" />
          <col class="soimt-col-key-focus" />
          <col class="soimt-col-owner" />
          <col class="soimt-col-annual-goal" />
          <col class="soimt-col-first-launch" />
          <col class="soimt-col-sop" />
          <col class="soimt-col-status" />
        </colgroup>
        <thead>
          <tr>
            <th>领域</th>
            <th class="soimt-key-focus-th">
              <span class="soimt-key-focus-th__label">重点领域</span>
              <button
                type="button"
                class="soimt-key-focus-sort-btn"
                :title="soimtKeyFocusSortActive ? '恢复表格行原始顺序' : '将「是」排在前面'"
                :aria-label="soimtKeyFocusSortActive ? '恢复重点领域表格原始行顺序' : '按重点领域排序：「是」在前'"
                :aria-pressed="soimtKeyFocusSortActive ? 'true' : 'false'"
                @click="sortSoimtProjectTableByKeyFocus"
              >{{ soimtKeyFocusSortActive ? '恢复' : '排序' }}</button>
            </th>
            <th>负责人</th>
            <th>年度发展目标及状态</th>
            <th>首发项目</th>
            <th>项目SOP</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input type="text" class="cell-input" value="MG东南亚" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="王倩倩" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="MG印度" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="左振龙" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="MG欧洲&amp;澳新" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="李震" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="MG全球" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="倪豪华" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="外部客户群" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="刘亿" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="质量保证" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="汪金华" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="自动化办公平台" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="王荀" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="iSMART售后运营" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="丁燕东" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="地图导航及LBS服务" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="吴志珍" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="AI服务" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="阮博" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="Vision Lab" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="鲍艺丹" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="APP" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="鲍艺丹" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="基础服务" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="胡人杰" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="生态应用服务" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="尹振飞" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="网络安全" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="贺飞鸣" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="业务中台" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="李世涛" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="数据驱动" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="符敦成" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="云架构" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="符敦成" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="运营商管理" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="展鹏" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="车端架构及软件开发" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="徐海根" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="零件交付&amp;质量&amp;认证" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="李亚召" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="硬件开发及实验" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="胡杰" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="互联软件" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="杨晰" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="版本轻轨小组" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="周明秀" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="自动化" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="张金超" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="测试敏捷小组" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="姚陈豪" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="实验室及车辆管理" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="曾杰" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="APP及云平台" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="张蕾" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="路试及综合管理" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="闫书磊" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="产教融合" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="闫书磊" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="售后及自研工具" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="闫书磊" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
          <tr>
            <td><input type="text" class="cell-input" value="数据合规及体系认证" /></td>
            <td class="soimt-key-focus-cell"><select class="cell-select soimt-key-focus-select" aria-label="重点领域"><option value=""></option><option value="是">是</option></select></td>
            <td><input type="text" class="cell-input" value="孙明宇" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
            <td><input type="text" class="cell-input" value="" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>

    <div class="sheet-title">
      <div class="left">现金流量表</div>
      <div class="unit">货币单位：人民币（万元）</div>
    </div>

    <div class="table-date-label">2026年4月30日</div>

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
              <col class="hr-col-dept" style="width: 27%" />
              <col style="width: 12%" />
              <col style="width: 12%" />
              <col style="width: 13%" />
              <col style="width: 12%" />
              <col style="width: 24%" />
            </colgroup>
            <thead>
              <tr>
                <th rowspan="2">部门</th>
                <th rowspan="2" class="num">正式员工数(含管理层)</th>
                <th rowspan="2" class="num">劳动派遣</th>
                <th colspan="2" class="hr-ai-digital-header">
                  <div class="hr-ai-digital-header__inner" role="presentation">
                    <span class="hr-ai-digital-header__title">AI数字员工（估）</span>
                  </div>
                </th>
                <th rowspan="2">备注</th>
              </tr>
              <tr>
                <th>AI工具</th>
                <th class="num">数字员工数（估）</th>
              </tr>
            </thead>
            <tbody data-hr-dept-index="0">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">管理层</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="管理层 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="0" data-hr-dept-row-action="add" aria-label="管理层 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="0" data-hr-dept-row-action="remove" aria-label="管理层 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="0" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="1">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">项目组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="项目组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="1" data-hr-dept-row-action="add" aria-label="项目组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="1" data-hr-dept-row-action="remove" aria-label="项目组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="8" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="2">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">测试组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="测试组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="2" data-hr-dept-row-action="add" aria-label="测试组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="2" data-hr-dept-row-action="remove" aria-label="测试组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="6" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="3">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">产品组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="产品组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="3" data-hr-dept-row-action="add" aria-label="产品组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="3" data-hr-dept-row-action="remove" aria-label="产品组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="4">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">供应链，硬件设计及软件系统组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="供应链，硬件设计及软件系统组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="4" data-hr-dept-row-action="add" aria-label="供应链，硬件设计及软件系统组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="4" data-hr-dept-row-action="remove" aria-label="供应链，硬件设计及软件系统组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="11" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="5">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">产品中台及开发组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="产品中台及开发组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="5" data-hr-dept-row-action="add" aria-label="产品中台及开发组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="5" data-hr-dept-row-action="remove" aria-label="产品中台及开发组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="7" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="6">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">集成及体系认证组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="集成及体系认证组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="6" data-hr-dept-row-action="add" aria-label="集成及体系认证组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="6" data-hr-dept-row-action="remove" aria-label="集成及体系认证组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="2" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody data-hr-dept-index="7">
              <tr class="hr-dept-leader">
                <td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="1">
                  <div class="hr-dept-inner">
                    <textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">综管组</textarea>
                    <div class="hardware-supply-inline-tools" role="group" aria-label="综管组 行操作">
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="7" data-hr-dept-row-action="add" aria-label="综管组 增行">+</button>
                      <button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="7" data-hr-dept-row-action="remove" aria-label="综管组 减行">-</button>
                    </div>
                  </div>
                </td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="3" /></td>
                <td class="num hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" /></td>
                <td class="hr-dept-rowspanned" rowspan="1"><input type="text" class="cell-input" value="" /></td>
              </tr>
            </tbody>
            <tbody class="hr-report-total-tbody">
              <tr class="total">
                <td><input type="text" class="cell-input" value="总数" readonly tabindex="-1" /></td>
                <td class="num"><input type="text" class="cell-input" value="43" readonly tabindex="-1" /></td>
                <td class="num"><input type="text" class="cell-input" value="" readonly tabindex="-1" /></td>
                <td><input type="text" class="cell-input" value="" /></td>
                <td class="num"><input type="text" class="cell-input" value="" readonly tabindex="-1" /></td>
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
      :aria-expanded="reportCollapsible.project ? 'true' : 'false'"
      aria-controls="report-section-project-body"
      @click="toggleReportSection('project')"
      @keydown.enter.prevent="toggleReportSection('project')"
      @keydown.space.prevent="toggleReportSection('project')"
    >
      <span class="section-overview-title__chevron" aria-hidden="true">{{ reportCollapsible.project ? '▼' : '▶' }}</span>
      <span class="section-overview-title__label">二.项目开发计划及版本火车</span>
    </h2>
    <div id="report-section-project-body" v-show="reportCollapsible.project" class="report-outline-section__body">
    <div class="project-dev-status-block">
      <div class="sales-title">
        <div>项目健康度</div>
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
        <div class="pms-state-report-embed">
          <iframe
            class="pms-state-report-embed__frame"
            title="预警项目列表"
            loading="eager"
            :src="pmsStateReportEmbedUrl"
          ></iframe>
          <p class="pms-state-report-embed__print-fallback">
            预警项目列表（打印/PDF 请用浏览器打开）：
            <span class="pms-state-report-embed__url">{{ pmsStateReportEmbedUrl }}</span>
          </p>
        </div>
        <div class="sales-title"><div>版本火车</div></div>
        <div class="pms-edition-train-embed">
          <iframe
            class="pms-edition-train-embed__frame"
            title="版本火车"
            loading="eager"
            :src="pmsEditionTrainEmbedUrl"
          ></iframe>
          <p class="pms-edition-train-embed__print-fallback">
            版本火车（打印/PDF 请用浏览器打开）：
            <span class="pms-edition-train-embed__url">{{ pmsEditionTrainEmbedUrl }}</span>
          </p>
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
            <col class="hardware-supply-col-type" />
            <col class="hardware-supply-col-equal" />
            <col class="hardware-supply-col-equal" />
            <col class="hardware-supply-col-equal" />
            <col class="hardware-supply-col-equal" />
            <col class="hardware-supply-col-equal" />
          </colgroup>
          <thead>
            <tr>
              <th>产品类型</th>
              <th>客户</th>
              <th>零件号</th>
              <th>订单数</th>
              <th>欠缴数量</th>
              <th>2026已交付</th>
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
              <td class="num"><input type="text" class="cell-input" value="" readonly tabindex="-1" /></td>
              <td class="num"><input type="text" class="cell-input" value="" readonly tabindex="-1" /></td>
              <td class="num"><input type="text" class="cell-input" value="" readonly tabindex="-1" /></td>
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
let echartsLib = null
const loadEcharts = () => {
  if (!echartsLib) echartsLib = import(/* webpackChunkName: "echarts" */ 'echarts')
  return echartsLib
}
import html2canvas from 'html2canvas';
import request from '@/router/axios';

const AUTO_SAVE_INTERVAL_MS = 5000;
let autoSaveTimerId = null;

/** SOIMT领域发展：接口 projectProgressList 无有效数据时用于页面展示的写死行 */
const SOIMT_DOMAIN_DEVELOPMENT_DEFAULT_ROWS = [
  { domain: 'MG东南亚', owner: '王倩倩' },
  { domain: 'MG印度', owner: '左振龙' },
  { domain: 'MG欧洲&澳新', owner: '李震' },
  { domain: 'MG全球', owner: '倪豪华' },
  { domain: '外部客户群', owner: '刘亿' },
  { domain: '质量保证', owner: '汪金华' },
  { domain: '自动化办公平台', owner: '王荀' },
  { domain: 'iSMART售后运营', owner: '丁燕东' },
  { domain: '地图导航及LBS服务', owner: '吴志珍' },
  { domain: 'AI服务', owner: '阮博' },
  { domain: 'Vision Lab', owner: '鲍艺丹' },
  { domain: 'APP', owner: '鲍艺丹' },
  { domain: '基础服务', owner: '胡人杰' },
  { domain: '生态应用服务', owner: '尹振飞' },
  { domain: '网络安全', owner: '贺飞鸣' },
  { domain: '业务中台', owner: '李世涛' },
  { domain: '数据驱动', owner: '符敦成' },
  { domain: '云架构', owner: '符敦成' },
  { domain: '运营商管理', owner: '展鹏' },
  { domain: '车端架构及软件开发', owner: '徐海根' },
  { domain: '零件交付&质量&认证', owner: '李亚召' },
  { domain: '硬件开发及实验', owner: '胡杰' },
  { domain: '互联软件', owner: '杨晰' },
  { domain: '版本轻轨小组', owner: '周明秀' },
  { domain: '自动化', owner: '张金超' },
  { domain: '测试敏捷小组', owner: '姚陈豪' },
  { domain: '实验室及车辆管理', owner: '曾杰' },
  { domain: 'APP及云平台', owner: '张蕾' },
  { domain: '路试及综合管理', owner: '闫书磊' },
  { domain: '产教融合', owner: '闫书磊' },
  { domain: '售后及自研工具', owner: '闫书磊' },
  { domain: '数据合规及体系认证', owner: '孙明宇' }
];

/** 人力资源报告：部门列固定（与保存/接口行顺序一致：前 8 行各部门，末行为总数） */
const HR_REPORT_FIXED_DEPARTMENTS = [
  '管理层',
  '项目组',
  '测试组',
  '产品组',
  '供应链，硬件设计及软件系统组',
  '产品中台及开发组',
  '集成及体系认证组',
  '综管组',
  '总数'
];

/** 接口缺省时页面展示用（与行顺序一致） */
const HR_REPORT_UI_DEFAULTS = [
  { formalEmployeeCount: '0', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '8', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '6', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '11', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '7', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '2', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '3', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] },
  { formalEmployeeCount: '43', laborDispatch: '', remark: '', aiToolRows: [{ aiTool: '', digitalEmployeeCount: '' }] }
];

export default {
  name: 'WorkWeekReportFromImage',
  data() {
    return {
      reportCollapsible: {
        company: true,
        project: true,
        hardware: true
      },
      trafficReportEmbedUrl: 'https://web-operations-ui.soimt.com/#/trafficReportv2',
      pmsStateReportEmbedUrl: 'https://pms.soimt.cn/KPMS/Module/ProjectManage/StateReport/Index.html?status=R',
      pmsEditionTrainEmbedUrl: 'https://pms.soimt.cn/KPMS/Module/ProjectManage/DomainItems/EditionTrainDashboard.html',
      /** 周报 tableInfoNewTwo 查询未完成前为 true，避免接口慢或未返回时页面像「已就绪」 */
      tableQueryLoading: true,
      /** 重点领域列：用户点击「排序」后为 true，点击「恢复」后为 false */
      soimtKeyFocusSortActive: false
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
    resetSoimtKeyFocusSortState() {
      this._soimtKeyFocusSortRestoreRows = null;
      this.soimtKeyFocusSortActive = false;
    },
    sortSoimtProjectTableByKeyFocus() {
      const root = this.$el;
      if (!root) return;
      const table = root.querySelector('table[aria-label="SOIMT领域发展表"]');
      if (!table || !table.tBodies || !table.tBodies[0]) return;
      const tbody = table.tBodies[0];
      const saved = this._soimtKeyFocusSortRestoreRows;
      if (Array.isArray(saved) && saved.length > 0) {
        saved.forEach((tr) => {
          if (tr && tr.parentNode === tbody) {
            tbody.appendChild(tr);
          }
        });
        this.resetSoimtKeyFocusSortState();
        return;
      }
      const rows = Array.from(tbody.rows || []);
      this._soimtKeyFocusSortRestoreRows = rows.slice();
      const keyIdx = 1;
      const rowIsYes = (tr) => {
        const cell = tr.cells[keyIdx];
        if (!cell) return false;
        const sel = cell.querySelector('select.soimt-key-focus-select');
        if (sel) return String(sel.value).trim() === '是';
        const field = cell.querySelector('input, textarea');
        return field ? String(field.value).trim() === '是' : false;
      };
      rows.sort((a, b) => {
        const av = rowIsYes(a) ? 1 : 0;
        const bv = rowIsYes(b) ? 1 : 0;
        return bv - av;
      });
      rows.forEach((tr) => tbody.appendChild(tr));
      this.soimtKeyFocusSortActive = true;
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

      const pmsEmbedPrint = printNode.querySelector('.pms-state-report-embed');
      const pmsLiveIframe = sheetEl.querySelector('iframe.pms-state-report-embed__frame');
      if (pmsEmbedPrint && pmsLiveIframe) {
        const pmsFrameClone = pmsEmbedPrint.querySelector('iframe.pms-state-report-embed__frame');
        let pmsReplaced = false;
        try {
          const pWin = pmsLiveIframe.contentWindow;
          const pDoc = pmsLiveIframe.contentDocument || (pWin && pWin.document);
          const pBody = pDoc && pDoc.body;
          if (pBody && (pBody.scrollHeight > 0 || pBody.textContent)) {
            const pScale = Math.min(1, 1000 / Math.max(pBody.scrollWidth || pBody.offsetWidth || 1, 1));
            const pCanvas = await html2canvas(pBody, {
              logging: false,
              useCORS: true,
              allowTaint: true,
              scale: pScale
            });
            const pShot = pCanvas.toDataURL('image/png');
            if (pmsFrameClone && pmsFrameClone.parentNode) {
              const pImg = document.createElement('img');
              pImg.setAttribute('alt', '预警项目列表');
              pImg.className = 'pms-state-report-embed__snapshot';
              pImg.style.cssText = 'width:100%;height:auto;display:block;';
              pImg.src = pShot;
              setScopeOnNode(pImg);
              pmsFrameClone.parentNode.replaceChild(pImg, pmsFrameClone);
              pmsReplaced = true;
            }
          }
        } catch (e) {
          pmsReplaced = false;
        }
        const pmsFb = pmsEmbedPrint.querySelector('.pms-state-report-embed__print-fallback');
        if (pmsReplaced) {
          if (pmsFb) pmsFb.remove();
        } else if (pmsFrameClone && pmsFrameClone.parentNode) {
          pmsFrameClone.parentNode.removeChild(pmsFrameClone);
          if (pmsFb) {
            pmsFb.style.display = 'block';
            pmsFb.style.margin = '0';
            pmsFb.style.padding = '10px';
            pmsFb.style.fontSize = '12px';
            pmsFb.style.color = '#111';
            pmsFb.style.lineHeight = '1.45';
            setScopeOnNode(pmsFb);
          }
        }
      }

      const editionTrainEmbedPrint = printNode.querySelector('.pms-edition-train-embed');
      const editionTrainLiveIframe = sheetEl.querySelector('iframe.pms-edition-train-embed__frame');
      if (editionTrainEmbedPrint && editionTrainLiveIframe) {
        const editionTrainFrameClone = editionTrainEmbedPrint.querySelector('iframe.pms-edition-train-embed__frame');
        let editionTrainReplaced = false;
        try {
          const etWin = editionTrainLiveIframe.contentWindow;
          const etDoc = editionTrainLiveIframe.contentDocument || (etWin && etWin.document);
          const etBody = etDoc && etDoc.body;
          if (etBody && (etBody.scrollHeight > 0 || etBody.textContent)) {
            const etScale = Math.min(1, 1000 / Math.max(etBody.scrollWidth || etBody.offsetWidth || 1, 1));
            const etCanvas = await html2canvas(etBody, {
              logging: false,
              useCORS: true,
              allowTaint: true,
              scale: etScale
            });
            const etShot = etCanvas.toDataURL('image/png');
            if (editionTrainFrameClone && editionTrainFrameClone.parentNode) {
              const etImg = document.createElement('img');
              etImg.setAttribute('alt', '版本火车');
              etImg.className = 'pms-edition-train-embed__snapshot';
              etImg.style.cssText = 'width:100%;height:auto;display:block;';
              etImg.src = etShot;
              setScopeOnNode(etImg);
              editionTrainFrameClone.parentNode.replaceChild(etImg, editionTrainFrameClone);
              editionTrainReplaced = true;
            }
          }
        } catch (e) {
          editionTrainReplaced = false;
        }
        const etFb = editionTrainEmbedPrint.querySelector('.pms-edition-train-embed__print-fallback');
        if (editionTrainReplaced) {
          if (etFb) etFb.remove();
        } else if (editionTrainFrameClone && editionTrainFrameClone.parentNode) {
          editionTrainFrameClone.parentNode.removeChild(editionTrainFrameClone);
          if (etFb) {
            etFb.style.display = 'block';
            etFb.style.margin = '0';
            etFb.style.padding = '10px';
            etFb.style.fontSize = '12px';
            etFb.style.color = '#111';
            etFb.style.lineHeight = '1.45';
            setScopeOnNode(etFb);
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

    function getRowFieldValue(row, fieldName, fallbackCellIndex) {
      if (row && fieldName) {
        const byField = row.querySelector(`[data-field="${fieldName}"]`);
        if (byField && 'value' in byField) {
          return asText(byField.value).trim();
        }
      }
      return getCellValue(row, fallbackCellIndex);
    }

    function collectSoimtRenewalUserBaseList() {
      return getTableRows('SOIMT续费用户与上线计划表').map((row) => ({
        region: getRowFieldValue(row, 'region', 0),
        ismartFull: getRowFieldValue(row, 'ismartFull', 1),
        ismartLite: getRowFieldValue(row, 'ismartLite', 2),
        ismartConnect: getRowFieldValue(row, 'ismartConnect', 3),
        renewalLaunchPlan: getRowFieldValue(row, 'renewalLaunchPlan', 4)
      }));
    }

    function getTableRows(ariaLabel) {
      const table = vm.$el.querySelector(`table[aria-label="${ariaLabel}"]`);
      if (!table || !table.tBodies || !table.tBodies[0]) return [];
      return Array.from(table.tBodies[0].rows || []);
    }

    function collectHumanResourceReportList() {
      const table = vm.$el.querySelector('table[aria-label="人力资源报告表"]');
      if (!table) return [];
      const out = [];
      for (let i = 0; i < 8; i += 1) {
        const tb = table.querySelector(`tbody[data-hr-dept-index="${i}"]`);
        if (!tb) continue;
        const leader = tb.querySelector('tr.hr-dept-leader');
        if (!leader) continue;
        const aiToolRows = [];
        const walk = [...tb.querySelectorAll('tr.hr-dept-leader, tr.hr-dept-ai-cont')];
        walk.forEach((tr) => {
          if (tr.classList.contains('hr-dept-leader')) {
            aiToolRows.push({
              aiTool: getCellValue(tr, 3),
              digitalEmployeeCount: getCellValue(tr, 4)
            });
          } else {
            aiToolRows.push({
              aiTool: getCellValue(tr, 0),
              digitalEmployeeCount: getCellValue(tr, 1)
            });
          }
        });
        out.push({
          department: HR_REPORT_FIXED_DEPARTMENTS[i] || '',
          formalEmployeeCount: getCellValue(leader, 1),
          laborDispatch: getCellValue(leader, 2),
          remark: getCellValue(leader, 5),
          aiToolRows
        });
      }
      const totalTb = table.querySelector('tbody.hr-report-total-tbody');
      const totalTr = totalTb && totalTb.querySelector('tr');
      if (totalTr && totalTr.cells && totalTr.cells.length >= 6) {
        out.push({
          department: HR_REPORT_FIXED_DEPARTMENTS[8] || '总数',
          formalEmployeeCount: getCellValue(totalTr, 1),
          laborDispatch: getCellValue(totalTr, 2),
          remark: getCellValue(totalTr, 5),
          aiToolRows: [
            {
              aiTool: getCellValue(totalTr, 3),
              digitalEmployeeCount: getCellValue(totalTr, 4)
            }
          ]
        });
      }
      return out;
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

    const HARDWARE_SUPPLY_SEGMENTS = ['FICM', 'TBOX', 'SCREEN', 'SIM卡'];

    function getHardwareSupplyTable() {
      return vm.$el.querySelector('table[aria-label="硬件供货"]');
    }

    function parseHardwareNumericInput(raw) {
      const s = String(raw == null ? '' : raw)
        .trim()
        .replace(/,/g, '');
      if (s === '' || s === '-') return 0;
      const n = parseFloat(s);
      return Number.isFinite(n) ? n : 0;
    }

    function formatHardwareTotalSum(n) {
      if (!Number.isFinite(n)) return '0';
      const rounded = Math.round(n * 1e6) / 1e6;
      if (Math.abs(rounded - Math.round(rounded)) < 1e-9) return String(Math.round(rounded));
      return String(rounded);
    }

    /** 硬件供货：总计行三列（订单数、欠缴数量、2026已交付）为各数据行之和 */
    function updateHardwareSupplyTotals() {
      const { dataRows, totalRow } = getHardwareSupplyPayloadRows();
      if (!totalRow || !totalRow.cells || totalRow.cells.length < 6) return;
      let sumOrder = 0;
      let sumArrears = 0;
      let sumDelivered = 0;
      dataRows.forEach((tr) => {
        if (!tr || !tr.cells || !tr.cells.length) return;
        if (tr.classList.contains('hardware-product-cont')) {
          sumOrder += parseHardwareNumericInput(getCellValue(tr, 2));
          sumArrears += parseHardwareNumericInput(getCellValue(tr, 3));
          sumDelivered += parseHardwareNumericInput(getCellValue(tr, 4));
        } else {
          sumOrder += parseHardwareNumericInput(getCellValue(tr, 3));
          sumArrears += parseHardwareNumericInput(getCellValue(tr, 4));
          sumDelivered += parseHardwareNumericInput(getCellValue(tr, 5));
        }
      });
      const setNum = (cellIndex, text) => {
        const cell = totalRow.cells[cellIndex];
        const inp = cell && cell.querySelector('input.cell-input');
        if (inp) inp.value = text;
      };
      setNum(3, formatHardwareTotalSum(sumOrder));
      setNum(4, formatHardwareTotalSum(sumArrears));
      setNum(5, formatHardwareTotalSum(sumDelivered));
    }

    /** 人力资源报告：总数行三列（正式员工数、劳动派遣、数字员工数估）为前 8 个部门之和 */
    function updateHumanResourceReportTotals() {
      const table = vm.$el.querySelector('table[aria-label="人力资源报告表"]');
      if (!table) return;
      let sumFormal = 0;
      let sumLabor = 0;
      let sumDigital = 0;
      for (let i = 0; i < 8; i += 1) {
        const tb = table.querySelector(`tbody[data-hr-dept-index="${i}"]`);
        if (!tb) continue;
        const leader = tb.querySelector('tr.hr-dept-leader');
        if (leader) {
          sumFormal += parseHardwareNumericInput(getCellValue(leader, 1));
          sumLabor += parseHardwareNumericInput(getCellValue(leader, 2));
        }
        [...tb.querySelectorAll('tr.hr-dept-leader, tr.hr-dept-ai-cont')].forEach((tr) => {
          if (tr.classList.contains('hr-dept-leader')) {
            sumDigital += parseHardwareNumericInput(getCellValue(tr, 4));
          } else {
            sumDigital += parseHardwareNumericInput(getCellValue(tr, 1));
          }
        });
      }
      const totalTb = table.querySelector('tbody.hr-report-total-tbody');
      const totalTr = totalTb && totalTb.querySelector('tr.total');
      if (!totalTr || !totalTr.cells || totalTr.cells.length < 6) return;
      const setNum = (cellIndex, text) => {
        const cell = totalTr.cells[cellIndex];
        const inp = cell && cell.querySelector('input.cell-input');
        if (inp) inp.value = text;
      };
      setNum(1, formatHardwareTotalSum(sumFormal));
      setNum(2, formatHardwareTotalSum(sumLabor));
      setNum(4, formatHardwareTotalSum(sumDigital));
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
          arrearsQuantity: getCellValue(row, 3),
          delivered2026: getCellValue(row, 4)
        };
      }
      return {
        productType: getCellValue(row, 0),
        customer: getCellValue(row, 1),
        partNo: getCellValue(row, 2),
        orderCount: getCellValue(row, 3),
        arrearsQuantity: getCellValue(row, 4),
        delivered2026: getCellValue(row, 5)
      };
    }

    function collectTablePayload() {
      updateHardwareSupplyTotals();
      updateHumanResourceReportTotals();
      const soimtRenewalUserBaseList = collectSoimtRenewalUserBaseList();

      const projectProgressList = getTableRows('SOIMT领域发展表').map((row) => ({
        domain: getCellValue(row, 0),
        keyFocusArea: getCellValue(row, 1),
        owner: getCellValue(row, 2),
        annualGoalStatus: getCellValue(row, 3),
        firstLaunchProject: getCellValue(row, 4),
        projectSop: getCellValue(row, 5),
        status: getCellValue(row, 6)
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
        currentWeek: getCellValue(row, 4),
        actualToDate: getCellValue(row, 5),
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

      const salesContractList = getTableRows('销售合同').map((row) => ({
        serialNo: getCellValue(row, 0),
        contractTitle: getCellValue(row, 1),
        contractNo: getCellValue(row, 2),
        remark: getCellValue(row, 3)
      }));

      const humanResourceReportList = collectHumanResourceReportList();

      const humanResourceSummaryList = [];

      const logisticsDeliveryPlanList = getTableRows('物料物流-交付计划').map((row) => ({
        dimension: getCellValue(row, 0),
        quantity: getCellValue(row, 1)
      }));

      const logisticsForecastStatsList = getTableRows('物料物流-预测统计').map((row) => ({
        dimension: getCellValue(row, 0),
        quantity: getCellValue(row, 1)
      }));

      const simCardManagementList = getTableRows('海外C端续费用户基数').map((row) => ({
        indicator: '',
        value: '',
        description: getCellValue(row, 0)
      }));

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
            arrearsQuantity: getCellValue(hardwareTotalRow, 4),
            delivered2026: getCellValue(hardwareTotalRow, 5)
          }
        : null;

      return {
        soimtRenewalUserBaseList,
        projectProgressList,
        cashFlowList,
        salesStatusList,
        customerSalesProgressTop10List,
        salesContractList,
        humanResourceReportList,
        humanResourceSummaryList,
        logisticsDeliveryPlanList,
        logisticsForecastStatsList,
        simCardManagementList,
        threePublicNetworksList: [],
        esimsList: [],
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
          url: '/api/oa-portal/workReport/tableInfoNewFour/save',
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
          if (cell && cell.select) {
            const raw = asText(firstNonNull(cell.value, '')).trim();
            const selYes = raw === '是' ? ' selected' : '';
            const selBlank = raw === '是' ? '' : ' selected';
            const tdCls = cell.className ? ` class="${cell.className}"` : ' class="soimt-key-focus-cell"';
            return (
              `<td${tdCls}><select class="cell-select soimt-key-focus-select" aria-label="重点领域">` +
              `<option value=""${selBlank}></option>` +
              `<option value="是"${selYes}>是</option>` +
              `</select></td>`
            );
          }
          const className = cell.className ? ` class="${cell.className}"` : '';
          const value = asText(firstNonNull(cell.value, '')).replace(/"/g, '&quot;');
          const readOnly = cell.readOnly ? ' readonly tabindex="-1"' : '';
          const dataFieldAttr = cell.field
            ? ` data-field="${asText(cell.field).replace(/"/g, '')}"`
            : '';
          return `<td${className}><input type="text" class="cell-input"${dataFieldAttr}${readOnly} value="${value}" /></td>`;
        }).join('');
        return `<tr>${tds}</tr>`;
      }).join('');
      if (html) {
        tbody.innerHTML = html;
        applyScopeAttr(tbody);
      }
    }

    function mergeHrDeptRowFromApi(index, apiList) {
      const def = HR_REPORT_UI_DEFAULTS[index] || HR_REPORT_UI_DEFAULTS[0];
      const r = apiList && apiList[index] && typeof apiList[index] === 'object' ? apiList[index] : {};
      const lines =
        Array.isArray(r.aiToolRows) && r.aiToolRows.length > 0
          ? r.aiToolRows.map((line) => ({
            aiTool: asText(line && line.aiTool != null ? line.aiTool : ''),
            digitalEmployeeCount: asText(
              line && line.digitalEmployeeCount != null ? line.digitalEmployeeCount : ''
            )
          }))
          : [{ aiTool: '', digitalEmployeeCount: '' }];
      const formal =
        r.formalEmployeeCount != null && String(asText(r.formalEmployeeCount)).trim() !== ''
          ? asText(r.formalEmployeeCount)
          : def.formalEmployeeCount;
      const labor =
        r.laborDispatch != null && String(asText(r.laborDispatch)).trim() !== ''
          ? asText(r.laborDispatch)
          : def.laborDispatch;
      const remark =
        r.remark != null && String(asText(r.remark)).trim() !== '' ? asText(r.remark) : def.remark;
      return { formalEmployeeCount: formal, laborDispatch: labor, remark, aiToolRows: lines };
    }

    function renderHumanResourceReportTable(apiList) {
      const table = vm.$el.querySelector('table[aria-label="人力资源报告表"]');
      if (!table) return;
      Array.from(table.querySelectorAll('tbody')).forEach((tb) => tb.remove());
      const esc = (v) => asText(v).replace(/"/g, '&quot;');
      const escAttr = (v) => asText(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      const escBody = (v) =>
        asText(v)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      const list = Array.isArray(apiList) ? apiList : [];
      for (let i = 0; i < 8; i += 1) {
        const fixedDept = HR_REPORT_FIXED_DEPARTMENTS[i];
        const merged = mergeHrDeptRowFromApi(i, list);
        const lines = merged.aiToolRows;
        const n = lines.length;
        const toolsHtml =
          `<div class="hardware-supply-inline-tools" role="group" aria-label="${escAttr(fixedDept)} 行操作">` +
          `<button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="${i}" data-hr-dept-row-action="add" aria-label="${escAttr(fixedDept)} 增行">+</button>` +
          `<button type="button" class="row-tool-btn row-tool-btn--hardware-inline" data-hr-dept-index="${i}" data-hr-dept-row-action="remove" aria-label="${escAttr(fixedDept)} 减行">-</button>` +
          `</div>`;
        let rowsHtml =
          `<tr class="hr-dept-leader">` +
          `<td class="hr-dept-rowspanned hr-dept-leader-cell" rowspan="${n}">` +
          `<div class="hr-dept-inner">` +
          `<textarea class="cell-textarea hr-dept-name-field" readonly tabindex="-1" rows="1">${escBody(fixedDept)}</textarea>` +
          `${toolsHtml}</div></td>` +
          `<td class="num hr-dept-rowspanned" rowspan="${n}"><input type="text" class="cell-input" value="${esc(merged.formalEmployeeCount)}" /></td>` +
          `<td class="num hr-dept-rowspanned" rowspan="${n}"><input type="text" class="cell-input" value="${esc(merged.laborDispatch)}" /></td>` +
          `<td><input type="text" class="cell-input" value="${esc(lines[0].aiTool)}" /></td>` +
          `<td class="num"><input type="text" class="cell-input" value="${esc(lines[0].digitalEmployeeCount)}" /></td>` +
          `<td class="hr-dept-rowspanned" rowspan="${n}"><input type="text" class="cell-input" value="${esc(merged.remark)}" /></td>` +
          `</tr>`;
        for (let j = 1; j < n; j += 1) {
          rowsHtml +=
            `<tr class="hr-dept-ai-cont">` +
            `<td><input type="text" class="cell-input" value="${esc(lines[j].aiTool)}" /></td>` +
            `<td class="num"><input type="text" class="cell-input" value="${esc(lines[j].digitalEmployeeCount)}" /></td>` +
            `</tr>`;
        }
        const tb = document.createElement('tbody');
        tb.setAttribute('data-hr-dept-index', String(i));
        tb.innerHTML = rowsHtml;
        table.appendChild(tb);
        applyScopeAttr(tb);
      }
      const totalDept = HR_REPORT_FIXED_DEPARTMENTS[8];
      const totalMerged = mergeHrDeptRowFromApi(8, list);
      const tl = totalMerged.aiToolRows;
      const totalTb = document.createElement('tbody');
      totalTb.className = 'hr-report-total-tbody';
      totalTb.innerHTML =
        `<tr class="total">` +
        `<td><input type="text" class="cell-input" readonly tabindex="-1" value="${esc(totalDept)}" /></td>` +
        `<td class="num"><input type="text" class="cell-input" readonly tabindex="-1" value="${esc(totalMerged.formalEmployeeCount)}" /></td>` +
        `<td class="num"><input type="text" class="cell-input" readonly tabindex="-1" value="${esc(totalMerged.laborDispatch)}" /></td>` +
        `<td><input type="text" class="cell-input" value="${esc(tl[0].aiTool)}" /></td>` +
        `<td class="num"><input type="text" class="cell-input" readonly tabindex="-1" value="${esc(tl[0].digitalEmployeeCount)}" /></td>` +
        `<td><input type="text" class="cell-input" value="${esc(totalMerged.remark)}" /></td>` +
        `</tr>`;
      table.appendChild(totalTb);
      applyScopeAttr(totalTb);
      updateHumanResourceReportTotals();
      vm.$nextTick(() => {
        const sheet = vm.$el && vm.$el.querySelector('.sheet');
        if (!sheet) return;
        sheet.querySelectorAll('textarea.hr-dept-name-field').forEach((ta) => {
          autoResizeTextarea(ta);
        });
      });
    }

    function hrReportDeptAddRow(tbody) {
      const leader = tbody.querySelector('tr.hr-dept-leader');
      const rowspanCells = tbody.querySelectorAll('td.hr-dept-rowspanned');
      if (!leader || !rowspanCells.length) return;
      const allRows = [...tbody.querySelectorAll('tr.hr-dept-leader, tr.hr-dept-ai-cont')];
      const lastRow = allRows[allRows.length - 1];
      let newRow;
      if (allRows.length === 1) {
        newRow = document.createElement('tr');
        newRow.className = 'hr-dept-ai-cont';
        newRow.innerHTML =
          '<td><input type="text" class="cell-input" value="" /></td>' +
          '<td class="num"><input type="text" class="cell-input" value="" /></td>';
        applyScopeAttr(newRow);
      } else {
        newRow = lastRow.cloneNode(true);
        clearRowFields(newRow);
        applyScopeAttr(newRow);
      }
      tbody.appendChild(newRow);
      const newN = allRows.length + 1;
      rowspanCells.forEach((td) => td.setAttribute('rowspan', String(newN)));
    }

    function hrReportDeptRemoveRow(tbody) {
      const allRows = [...tbody.querySelectorAll('tr.hr-dept-leader, tr.hr-dept-ai-cont')];
      if (allRows.length <= 1) return;
      allRows[allRows.length - 1].remove();
      const rowspanCells = tbody.querySelectorAll('td.hr-dept-rowspanned');
      const newN = allRows.length - 1;
      rowspanCells.forEach((td) => td.setAttribute('rowspan', String(Math.max(1, newN))));
    }

    function initHrReportDeptRowTools() {
      const wrap = vm.$el.querySelector('.hr-wrap');
      if (!wrap || wrap.dataset.hrDeptRowToolsBound === '1') return;
      wrap.dataset.hrDeptRowToolsBound = '1';
      wrap.addEventListener('input', (e) => {
        const t = e.target;
        if (!t || t.tagName !== 'INPUT' || !t.classList.contains('cell-input')) return;
        if (!wrap.contains(t)) return;
        if (t.closest('.hr-report-total-tbody')) return;
        const table = t.closest('table[aria-label="人力资源报告表"]');
        if (!table) return;
        updateHumanResourceReportTotals();
      });
      wrap.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-hr-dept-row-action]');
        if (!btn || !wrap.contains(btn)) return;
        const action = btn.getAttribute('data-hr-dept-row-action');
        const idx = btn.getAttribute('data-hr-dept-index');
        const table = wrap.querySelector('table[aria-label="人力资源报告表"]');
        if (!table || idx == null) return;
        const tbody = table.querySelector(`tbody[data-hr-dept-index="${idx}"]`);
        if (!tbody) return;
        if (action === 'add') {
          hrReportDeptAddRow(tbody);
          updateHumanResourceReportTotals();
        } else if (action === 'remove') {
          hrReportDeptRemoveRow(tbody);
          updateHumanResourceReportTotals();
        }
      });
      updateHumanResourceReportTotals();
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
        const totalNumericReadonly = isTotalRow && colIndex >= 3 && colIndex <= 5;
        let ro = '';
        if (isTotalRow && colIndex === 0) ro = ' readonly tabindex="-1"';
        else if (readOnlyCell || totalNumericReadonly) ro = ' readonly tabindex="-1"';
        return `<td${numCls}><input type="text" class="cell-input"${ro} value="${esc(value)}" /></td>`;
      };

      const rowVals = (row) => ([
        firstNonNull(row.productType, row.product_type, ''),
        firstNonNull(row.customer, row.customerName, ''),
        firstNonNull(row.partNo, row.partNumber, row.part_code, ''),
        firstNonNull(row.orderCount, row.orders, ''),
        firstNonNull(row.arrearsQuantity, row.arrearsQty, row.owedQuantity, row.oweQty, ''),
        firstNonNull(row.delivered2026, row.delivered, '')
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
        ht ? firstNonNull(ht.arrearsQuantity, ht.arrearsQty, ht.owedQuantity, ht.oweQty, '') : '',
        ht ? firstNonNull(ht.delivered2026, ht.delivered, '') : ''
      ];
      const totalInner = `<tr class="total">${tVals.map((v, i) => tdHtml(v, i, true, false)).join('')}</tr>`;
      const totalTbody = `<tbody class="hardware-supply-total-tbody">${totalInner}</tbody>`;

      Array.from(table.querySelectorAll('tbody')).forEach((tb) => tb.remove());
      table.insertAdjacentHTML('beforeend', segmentsHtml + totalTbody);
      applyScopeAttr(table);
      updateHardwareSupplyTotals();
    }

    function projectProgressListHasMeaningfulData(list) {
      if (!Array.isArray(list) || list.length === 0) return false;
      return list.some((row) => {
        if (!row || typeof row !== 'object') return false;
        const parts = [
          row.domain,
          row.projectName,
          row.keyFocusArea,
          row.owner,
          row.ownerName,
          row.responsiblePerson,
          row.annualGoalStatus,
          row.projectGoal,
          row.yearGoalStatus,
          row.firstLaunchProject,
          row.firstProject,
          row.recentProgress,
          row.projectSop,
          row.sopTime,
          row.sop,
          row.risk,
          row.status
        ];
        return parts.some((p) => p != null && String(p).trim() !== '');
      });
    }

    function isKeyFocusAreaYes(row) {
      if (!row || typeof row !== 'object') return false;
      return asText(row.keyFocusArea).trim() === '是';
    }

    function sortProjectProgressListForDisplay(list) {
      if (!Array.isArray(list)) return [];
      return [...list].sort((a, b) => {
        const av = isKeyFocusAreaYes(a) ? 1 : 0;
        const bv = isKeyFocusAreaYes(b) ? 1 : 0;
        return bv - av;
      });
    }

    async function loadTableDataFromApi() {
      vm.tableQueryLoading = true;
      try {
        const { startDate, endDate } = getCurrentWeekRange();
        const res = await request({
          url: '/api/oa-portal/workReport/tableInfoNewFour',
          method: 'post',
          data: { startDate, endDate }
        });
        const raw = (res && res.data && (res.data.data !== undefined && res.data.data !== null ? res.data.data : res.data)) || null;
        if (!raw || typeof raw !== 'object') return;

        applyTableInfoNewVersionFromResponse(raw);

        const data = raw.tableData && typeof raw.tableData === 'object' ? raw.tableData : raw;
        if (!data || typeof data !== 'object') return;

        renderRowsByAriaLabel('SOIMT续费用户与上线计划表', data.soimtRenewalUserBaseList, (row) => ([
          { field: 'region', value: asText(firstNonNull(row.region, row.area, row.regionName)) },
          {
            field: 'ismartFull',
            className: 'num',
            value: asText(firstNonNull(row.ismartFull, row.iSmartFull, row.smartFull))
          },
          {
            field: 'ismartLite',
            className: 'num',
            value: asText(firstNonNull(row.ismartLite, row.iSmartLite, row.smartLite))
          },
          {
            field: 'ismartConnect',
            className: 'num',
            value: asText(firstNonNull(row.ismartConnect, row.iSmartConnect, row.smartConnect))
          },
          {
            field: 'renewalLaunchPlan',
            value: asText(firstNonNull(row.renewalLaunchPlan, row.renewalPlan, row.launchPlan, row.renewalOnlinePlan))
          }
        ]));

        const rawSoimtList = projectProgressListHasMeaningfulData(data.projectProgressList)
          ? data.projectProgressList
          : SOIMT_DOMAIN_DEVELOPMENT_DEFAULT_ROWS;
        const soimtProjectRows = sortProjectProgressListForDisplay(rawSoimtList);
        renderRowsByAriaLabel('SOIMT领域发展表', soimtProjectRows, (row) => ([
          { value: asText(firstNonNull(row.domain, row.projectName)) },
          { select: true, value: asText(row.keyFocusArea) },
          { value: asText(firstNonNull(row.owner, row.ownerName, row.responsiblePerson)) },
          { value: asText(firstNonNull(row.annualGoalStatus, row.projectGoal, row.yearGoalStatus)) },
          { value: asText(firstNonNull(row.firstLaunchProject, row.firstProject, row.recentProgress)) },
          { value: asText(firstNonNull(row.projectSop, row.sopTime, row.sop, row.risk)) },
          { value: asText(row.status) }
        ]));
        if (typeof vm.resetSoimtKeyFocusSortState === 'function') {
          vm.resetSoimtKeyFocusSortState();
        }

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
          { className: 'num', value: asText(row.currentWeek) },
          { className: 'num', value: asText(row.actualToDate) },
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

        renderRowsByAriaLabel('销售合同', data.salesContractList, (row) => ([
          { className: 'num', value: asText(firstNonNull(row.serialNo, row.serialNO, row.no, row.index)) },
          { value: asText(firstNonNull(row.contractTitle, row.title, row.contractName, row.contractTitleCn)) },
          { value: asText(firstNonNull(row.contractNo, row.contractNumber, row.code, row.contractCode)) },
          { value: asText(firstNonNull(row.remark, row.note, row.description, row.remarkInfo, row.comments)) }
        ]));

        const apiHrList = Array.isArray(data.humanResourceReportList) ? data.humanResourceReportList : [];
        renderHumanResourceReportTable(apiHrList);

        renderRowsByAriaLabel('物料物流-交付计划', data.logisticsDeliveryPlanList, (row) => ([
          { value: asText(row.dimension) },
          { className: 'num', value: asText(row.quantity) }
        ]));

        renderRowsByAriaLabel('物料物流-预测统计', data.logisticsForecastStatsList, (row) => ([
          { value: asText(row.dimension) },
          { className: 'num', value: asText(row.quantity) }
        ]));

        renderRowsByAriaLabel('海外C端续费用户基数', data.simCardManagementList, (row) => {
          const desc = asText(firstNonNull(row.description, row.remark, row.comment, ''));
          const ind = asText(firstNonNull(row.indicator, ''));
          const val = asText(firstNonNull(row.value, ''));
          const merged = desc || [ind, val].filter((s) => s && String(s).trim()).join('，');
          return [{ value: merged }];
        });

        renderHardwareSupplyFromData(data);

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
      } finally {
        vm.tableQueryLoading = false;
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
        const tr = td && td.closest('tr');
        const isHrDepartmentCell =
          table
          && tableLabel === '人力资源报告表'
          && td
          && td.cellIndex === 0
          && tr
          && tr.classList.contains('hr-dept-leader');
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
        if (aria === '硬件供货') return;
        if (aria === '现金流量表') return;
        if (aria === '销售合同') {
          let prev = table.previousElementSibling;
          if (prev && prev.classList.contains('sales-contract-date-bar')) {
            const lbl = prev.querySelector('.table-date-label');
            if (lbl) lbl.textContent = todayLabel;
            return;
          }
          if (prev && prev.classList.contains('table-date-label')) {
            prev.remove();
            prev = null;
          }
          const dateBar = document.createElement('div');
          dateBar.className = 'sales-contract-date-bar';
          applyScopeAttr(dateBar);
          const dateLabel = document.createElement('div');
          dateLabel.className = 'table-date-label';
          dateLabel.textContent = todayLabel;
          applyScopeAttr(dateLabel);
          const note = document.createElement('span');
          note.className = 'sales-contract-date-note';
          note.textContent = '本月新增';
          applyScopeAttr(note);
          dateBar.appendChild(dateLabel);
          dateBar.appendChild(note);
          table.parentNode.insertBefore(dateBar, table);
          return;
        }
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
        '硬件供货',
        '销售合同'
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
      const table = block.querySelector('table[aria-label="预警项目列表"]');
      if (!table || !table.tBodies || !table.tBodies[0]) return;
      const tbody = table.tBodies[0];
      const addBtn = block.querySelector('[data-r-project-row-action="add"]');
      const removeBtn = block.querySelector('[data-r-project-row-action="remove"]');
      if (!addBtn || !removeBtn) return;
      block.dataset.rProjectRowToolsBound = '1';

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
      block.addEventListener('input', (e) => {
        const t = e.target;
        if (!t || t.tagName !== 'INPUT' || !t.classList.contains('cell-input')) return;
        if (!block.contains(t)) return;
        if (t.closest('.hardware-supply-total-tbody')) return;
        const table = t.closest('table[aria-label="硬件供货"]');
        if (!table) return;
        updateHardwareSupplyTotals();
      });
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
          updateHardwareSupplyTotals();
        } else if (action === 'remove') {
          hardwareSupplySegmentRemoveRow(tbody);
          updateHardwareSupplyTotals();
        }
      });
      updateHardwareSupplyTotals();
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

      const chart = (await loadEcharts()).init(chartDom);
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
          legend: { show: false },
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
            avoidLabelOverlap: true,
            itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
            label: {
              show: true,
              position: 'outside',
              formatter: (p) => {
                const v = Number(p.value);
                if (!Number.isFinite(v) || v <= 0) return '';
                return String(v);
              },
              fontSize: 13,
              fontWeight: 600,
              color: '#1d3f60'
            },
            labelLine: {
              show: true,
              length: 10,
              length2: 8,
              lineStyle: { color: '#94a3b8' }
            },
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

    function syncLayoutAfterTableData() {
      vm.$nextTick(() => {
        vm.$nextTick(() => {
          const sheet = vm.$el && vm.$el.querySelector('.sheet');
          if (sheet) {
            sheet.querySelectorAll('textarea.cell-textarea').forEach((textarea) => {
              autoResizeTextarea(textarea);
            });
          }
          if (typeof vm._projectHealthChartResize === 'function') {
            vm._projectHealthChartResize();
          }
          if (typeof vm._refreshProjectHealthRygChart === 'function') {
            vm._refreshProjectHealthRygChart();
          }
        });
      });
    }

    async function initPage() {
      await loadTableDataFromApi();
      initEditableCells();
      // P0: 异步加载 echarts
      await initProjectHealthRygChart();
      initTableRowTools();
      initTableDateLabels();
      initCustomerTableRowTools();
      initRProjectTableRowTools();
      initHardwareSupplyRowTools();
      initHrReportDeptRowTools();
      lastSavedPayload = JSON.stringify(buildTableInfoNewSaveRequestBody());
      startAutoSave();
      syncLayoutAfterTableData();
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
      --blue-header-top: #6a9bc9;
      --blue-header: #4a7eb8;
      --blue-header-hover-top: #7aa8d4;
      --blue-header-hover: #3f72a8;
      --blue-section: #dfe6ef;
      --row-bg: #fafbfc;
      --line: #e8ecf1;
      --table-edge: #c5d0dc;
      --text: #1e293b;
      --text-muted: #475569;
      --accent-soft: rgba(74, 126, 184, 0.12);
      --sheet-shadow: 0 4px 28px rgba(15, 23, 42, 0.07), 0 1px 3px rgba(15, 23, 42, 0.04);
      --table-font: clamp(13px, 1.15vw, 15px);
      --title-font: clamp(17px, 1.65vw, 22px);
      --cell-py: clamp(7px, 0.95vw, 11px);
      --cell-px: clamp(8px, 0.85vw, 12px);
    }

    * {
      box-sizing: border-box;
    }
    .work-week-report-from-image {
      margin: 0;
      width: 100%;
      min-height: min-content;
      background: linear-gradient(165deg, #e8edf4 0%, #f4f6f9 38%, #eef1f7 100%);
      font-family: system-ui, -apple-system, "Segoe UI", "PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif;
      color: var(--text);
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 20px 16px 28px;
      box-sizing: border-box;
      -webkit-font-smoothing: antialiased;
    }

    .sheet {
      width: 100%;
      max-width: 1120px;
      background: #fff;
      border: 1px solid rgba(148, 163, 184, 0.35);
      overflow-x: auto;
      overflow-y: visible;
      border-radius: 12px;
      box-shadow: var(--sheet-shadow);
      padding-bottom: 14px;
      min-height: min-content;
    }

    .page-main-title {
      margin: 0;
      padding: 22px 16px 18px;
      font-size: clamp(21px, 2.1vw, 28px);
      font-weight: 700;
      letter-spacing: 0.04em;
      text-align: center;
      color: #0f172a;
      line-height: 1.25;
      border-bottom: 1px solid var(--line);
      background: linear-gradient(180deg, #fff 0%, #fafbfc 100%);
    }

    .section-overview-title {
      margin: 0 0 12px;
      padding: 0 10px;
      font-size: clamp(18px, 1.85vw, 24px);
      font-weight: 700;
      color: #0f172a;
      line-height: 1.35;
      text-align: left;
      letter-spacing: 0.01em;
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
      background: var(--accent-soft);
    }

    .section-overview-title--collapsible:focus {
      outline: 2px solid rgba(74, 126, 184, 0.45);
      outline-offset: 2px;
    }

    .section-overview-title__chevron {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.1em;
      font-size: 0.72em;
      line-height: 1;
      color: var(--blue-header);
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

    .r-project-list-wrap .pms-state-report-embed + .sales-title {
      margin-top: 18px;
    }

    .pms-state-report-embed,
    .pms-edition-train-embed {
      margin: 6px 0 12px;
      width: 100%;
      border: 1px solid var(--table-edge);
      border-radius: 10px;
      overflow: hidden;
      background: #f8fafc;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
    }

    .pms-state-report-embed__frame,
    .pms-edition-train-embed__frame {
      display: block;
      width: 100%;
      /* 接近整屏：按视口高度，仅预留顶栏/标签/标题与留白 */
      height: calc(100vh - 100px);
      height: calc(100dvh - 100px);
      min-height: 1080px;
      border: 0;
    }

    .pms-state-report-embed__print-fallback,
    .pms-edition-train-embed__print-fallback {
      display: none;
      margin: 0;
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.45;
      color: var(--text);
      word-break: break-all;
    }

    .pms-state-report-embed__url,
    .pms-edition-train-embed__url {
      font-weight: 600;
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

    .toc-sales-contract-table-wrap {
      margin-bottom: 16px;
    }

    .sim-traffic-report-embed {
      margin: 6px 0 12px;
      width: 100%;
      border: 1px solid var(--table-edge);
      border-radius: 10px;
      overflow: hidden;
      background: #f8fafc;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.05);
    }

    .sim-traffic-report-embed__frame {
      display: block;
      width: 100%;
      height: min(1400px, calc(100vh - 220px));
      height: min(1400px, calc(100dvh - 220px));
      min-height: 520px;
      border: 0;
    }

    .sim-traffic-report-embed__print-fallback {
      display: none;
      margin: 0;
      padding: 10px 12px;
      font-size: 12px;
      line-height: 1.45;
      color: var(--text);
      word-break: break-all;
    }

    .sim-traffic-report-embed__url {
      font-weight: 600;
    }

    .project-health-ryg-chart-print-img,
    .sim-traffic-report-embed__snapshot,
    .pms-state-report-embed__snapshot,
    .pms-edition-train-embed__snapshot {
      max-width: 100%;
      vertical-align: top;
    }

    .export-pdf-btn {
      position: fixed;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      z-index: 1000;
      border: 1px solid rgba(15, 23, 42, 0.12);
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-size: 13px;
      line-height: 1;
      font-weight: 600;
      letter-spacing: 0.04em;
      padding: 11px 16px;
      border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18), 0 1px 2px rgba(255, 255, 255, 0.15) inset;
      transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
    }

    .export-pdf-btn:hover {
      background: linear-gradient(180deg, var(--blue-header-hover-top) 0%, var(--blue-header-hover) 100%);
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22), 0 1px 2px rgba(255, 255, 255, 0.18) inset;
    }

    .export-pdf-btn:active {
      transform: translateY(calc(-50% + 1px));
    }

    .save-table-btn {
      position: fixed;
      top: calc(50% - 52px);
      right: 16px;
      z-index: 1000;
      border: 1px solid rgba(15, 23, 42, 0.12);
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-size: 13px;
      line-height: 1;
      font-weight: 600;
      letter-spacing: 0.04em;
      padding: 11px 16px;
      border-radius: 999px;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.18), 0 1px 2px rgba(255, 255, 255, 0.15) inset;
      transition: background 0.18s ease, box-shadow 0.18s ease, transform 0.12s ease;
    }

    .save-table-btn:hover {
      background: linear-gradient(180deg, var(--blue-header-hover-top) 0%, var(--blue-header-hover) 100%);
      box-shadow: 0 6px 18px rgba(15, 23, 42, 0.22), 0 1px 2px rgba(255, 255, 255, 0.18) inset;
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
      color: var(--text);
      font-weight: 700;
      background: linear-gradient(105deg, #f0f4f8 0%, #fafbfc 52%, #f1f5f9 100%);
      border-left: 4px solid var(--blue-header);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    }

    .sheet-title .left {
      color: var(--text);
    }

    .sheet-title .unit {
      text-align: right;
      font-size: clamp(14px, 1.5vw, 20px);
      color: var(--text-muted);
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
      border: 1px solid var(--line);
      padding: var(--cell-py) var(--cell-px);
      background: var(--row-bg);
      font-size: var(--table-font);
      line-height: 1.25;
      vertical-align: middle;
      white-space: normal;
      overflow-wrap: anywhere;
    }

    th {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      text-align: left;
      padding-top: 8px;
      padding-bottom: 8px;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
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
      outline: 2px solid rgba(74, 126, 184, 0.35);
      outline-offset: 1px;
      border-radius: 4px;
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
      color: var(--text-muted);
      font-weight: 600;
      margin: 0;
      text-align: left;
      flex-shrink: 0;
    }

    .sales-contract-date-bar {
      display: inline-flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 10px;
      margin: 0 0 6px;
      font-size: 13px;
      line-height: 1.35;
      font-weight: 600;
      letter-spacing: 0.02em;
      color: var(--text-muted);
      -webkit-font-smoothing: antialiased;
    }

    .sales-contract-date-bar .table-date-label {
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
      color: inherit;
      font-variant-numeric: tabular-nums;
    }

    .sales-contract-date-note {
      font-size: inherit;
      line-height: inherit;
      font-weight: inherit;
      letter-spacing: inherit;
      display: inline-flex;
      align-items: center;
      padding: 2px 10px;
      border-radius: 999px;
      color: var(--blue-header);
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(241, 245, 249, 0.95) 100%);
      border: 1px solid rgba(74, 126, 184, 0.28);
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
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
      border: 1px solid var(--blue-header);
      border-radius: 6px;
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-size: 16px;
      line-height: 1;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 0.15s ease, border-color 0.15s ease;
    }

    .row-tool-btn:hover {
      background: linear-gradient(180deg, var(--blue-header-hover-top) 0%, var(--blue-header-hover) 100%);
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
      color: var(--text-muted);
      font-weight: 600;
      line-height: 1.5;
    }

    .sales-title--goals-line + .sales-title--goals-line {
      margin-top: 4px;
    }

    .sales-title--goals-projects {
      margin-top: 8px;
      margin-bottom: 8px;
      padding-left: 1.2em;
    }

    .sales-title--goals-projects-intro {
      margin: 0 0 6px;
      font-size: clamp(12px, 1.15vw, 15px);
      color: #64748b;
      font-weight: 500;
      line-height: 1.6;
    }

    .sales-title--goals-projects-item {
      margin: 0;
      font-size: clamp(11px, 1.05vw, 14px);
      color: #64748b;
      font-weight: 400;
      line-height: 1.65;
      text-align: justify;
    }

    .sales-title--goals-projects-item + .sales-title--goals-projects-item {
      margin-top: 6px;
    }

    .sales-title {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: var(--text);
      gap: 8px;
      flex-wrap: wrap;
      font-weight: 700;
      background: linear-gradient(105deg, #f0f4f8 0%, #fafbfc 52%, #f1f5f9 100%);
      border-left: 4px solid var(--blue-header);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 8px 10px;
    }

    .sales-title .unit {
      font-size: clamp(14px, 1.5vw, 20px);
      color: var(--text-muted);
      white-space: nowrap;
      font-weight: 600;
    }

    table.sales {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    table.sales th,
    table.sales td {
      border: 1px solid var(--table-edge);
      background: #fff;
      color: var(--text);
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      min-height: clamp(34px, 2.8vw, 42px);
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.sales th {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
    }

    table.sales td.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: normal;
    }

    table.sales th:first-child,
    table.sales td:first-child {
      text-align: center;
    }

    table.sales th:first-child .cell-input,
    table.sales td:first-child .cell-input,
    table.sales th:first-child .cell-textarea,
    table.sales td:first-child .cell-textarea {
      text-align: center;
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

    /* 序号列：原为 3rem，再缩 50% 以腾出横向空间（colgroup 会被本规则覆盖） */
    table.sales col:first-child {
      width: 1.5rem !important;
    }

    table.sales col:not(:first-child) {
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
      color: var(--text);
      gap: 8px;
      flex-wrap: wrap;
      font-weight: 700;
      background: linear-gradient(105deg, #f0f4f8 0%, #fafbfc 52%, #f1f5f9 100%);
      border-left: 4px solid var(--blue-header);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 8px 10px;
    }

    .customer-title .unit {
      font-size: clamp(14px, 1.5vw, 20px);
      color: var(--text-muted);
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
      table-layout: fixed;
    }

    table.customer th,
    table.customer td {
      border: 1px solid var(--table-edge);
      background: #fff;
      color: var(--text);
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.customer th {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
    }

    table.customer td.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: normal;
    }

    table.customer th:first-child,
    table.customer td:first-child {
      text-align: center;
    }

    table.customer th:first-child .cell-input,
    table.customer td:first-child .cell-input {
      text-align: center;
    }

    /* 客户销售情况、销售合同：序号列与 table.sales 一致 */
    table.customer col:first-child {
      width: 1.5rem !important;
    }

    table.customer col:not(:first-child) {
      width: auto !important;
    }

    .hr-wrap {
      margin-top: 24px;
    }

    .hr-panels {
      display: block;
    }

    .hr-title {
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: var(--text);
      font-weight: 700;
      background: linear-gradient(105deg, #f0f4f8 0%, #fafbfc 52%, #f1f5f9 100%);
      border-left: 4px solid var(--blue-header);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 8px 10px;
    }

    table.hr {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    table.hr th,
    table.hr td {
      border: 1px solid var(--table-edge);
      background: #fff;
      color: var(--text);
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.2;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.hr thead th.group {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
    }

    table.hr th {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
    }

    table.hr td.num,
    table.hr th.num {
      text-align: right;
      font-variant-numeric: tabular-nums;
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr thead th {
      text-align: center;
    }

    table.hr thead th.num {
      text-align: center;
    }

    table.hr th.hr-ai-digital-header {
      padding: 8px 10px;
      vertical-align: middle;
    }

    .hr-ai-digital-header__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 2.6em;
      margin: 0 auto;
      max-width: 11em;
      padding: 6px 10px;
      box-sizing: border-box;
      /* 上下分隔：浅线贴在表头底色上，避免高亮纯白条 */
      border-top: 1px solid rgba(255, 255, 255, 0.22);
      border-bottom: 1px solid rgba(255, 255, 255, 0.22);
    }

    .hr-ai-digital-header__title {
      font-weight: 700;
      line-height: 1.25;
      white-space: nowrap;
    }

    table.hr td:nth-child(2) {
      white-space: nowrap;
      word-break: keep-all;
    }

    table.hr thead th:nth-child(2).num {
      white-space: normal;
      word-break: break-word;
      line-height: 1.25;
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
      border: 1px solid var(--table-edge);
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
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
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
      color: var(--text);
      font-weight: 700;
      background: linear-gradient(105deg, #f0f4f8 0%, #fafbfc 52%, #f1f5f9 100%);
      border-left: 4px solid var(--blue-header);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
      padding: 8px 10px;
    }

    table.project {
      width: 100%;
      border-collapse: collapse;
      table-layout: auto;
    }

    table.project.hardware-supply {
      table-layout: fixed;
    }

    table.project.hardware-supply col.hardware-supply-col-type {
      width: 10%;
    }

    table.project.hardware-supply col.hardware-supply-col-equal {
      width: 18%;
    }

    table.project[aria-label="SOIMT续费用户与上线计划表"] {
      table-layout: fixed;
      margin-bottom: 14px;
    }

    table.project[aria-label="SOIMT续费用户与上线计划表"] col.soimt-renewal-col-region {
      width: 18%;
    }

    table.project[aria-label="SOIMT续费用户与上线计划表"] col.soimt-renewal-col-product {
      width: 20.5%;
    }

    table.project[aria-label="SOIMT续费用户与上线计划表"] col.soimt-renewal-col-plan {
      visibility: collapse;
      width: 0;
      max-width: 0;
      padding: 0;
      border: none;
    }

    table.project[aria-label="SOIMT续费用户与上线计划表"] th.soimt-renewal-plan-th,
    table.project[aria-label="SOIMT续费用户与上线计划表"] tbody td:last-child {
      display: none;
    }

    table.project[aria-label="SOIMT领域发展表"] {
      table-layout: fixed;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-domain {
      width: 15%;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-key-focus {
      width: 8%;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-owner {
      width: 6%;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-annual-goal {
      width: 34%;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-first-launch {
      width: 12%;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-sop {
      width: 12%;
    }

    table.project[aria-label="SOIMT领域发展表"] col.soimt-col-status {
      width: 13%;
    }

    table.project[aria-label="SOIMT领域发展表"] td:nth-child(3) .cell-input,
    table.project[aria-label="SOIMT领域发展表"] th:nth-child(3) {
      min-width: 0;
    }

    table.project th,
    table.project td {
      border: 1px solid var(--table-edge);
      background: #fff;
      color: var(--text);
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.project[aria-label="SOIMT续费用户与上线计划表"] th.soimt-renewal-group-th,
    table.project[aria-label="SOIMT续费用户与上线计划表"] th.soimt-renewal-plan-th {
      text-align: center;
      vertical-align: middle;
    }

    table.project th {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
    }

    table.project th.soimt-key-focus-th {
      text-align: center;
      vertical-align: middle;
      white-space: normal;
    }

    .soimt-key-focus-th__label {
      display: block;
      margin-bottom: 4px;
      line-height: 1.2;
    }

    .soimt-key-focus-sort-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      padding: 2px 8px;
      font-size: 11px;
      line-height: 1.2;
      color: var(--text);
      background: #fff;
      border: 1px solid rgba(255, 255, 255, 0.9);
      border-radius: 3px;
      cursor: pointer;
      font-weight: 600;
    }

    .soimt-key-focus-sort-btn:hover {
      background: #eef5fb;
    }

    .soimt-key-focus-sort-btn:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 1px;
    }

    table.project td.soimt-key-focus-cell {
      text-align: center;
      vertical-align: middle;
      white-space: nowrap;
      padding: 6px 10px;
    }

    table.project[aria-label="SOIMT领域发展表"] .soimt-key-focus-select {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      min-height: 30px;
      margin: 0 auto;
      display: block;
      font: inherit;
      font-size: inherit;
      font-weight: 600;
      color: var(--text);
      text-align: center;
      text-align-last: center;
      padding: 6px 28px 6px 10px;
      cursor: pointer;
      box-sizing: border-box;
      line-height: 1.2;
      border: 1px solid rgba(74, 126, 184, 0.45);
      border-radius: 6px;
      background-color: #f0f7fc;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' fill='%231d3f60'%3E%3Cpath d='M2.5 4h7L6 8.5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 8px center;
      background-size: 10px 10px;
      appearance: none;
      -webkit-appearance: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
    }

    table.project[aria-label="SOIMT领域发展表"] .soimt-key-focus-select:hover {
      border-color: var(--blue-header);
      background-color: #e8f0fa;
    }

    table.project[aria-label="SOIMT领域发展表"] .soimt-key-focus-select:focus {
      outline: none;
      border-color: var(--blue-header);
      box-shadow: 0 0 0 2px rgba(74, 126, 184, 0.28);
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

    .hr-dept-inner {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      justify-content: flex-start;
      gap: 6px;
      min-width: 0;
      min-height: 30px;
    }

    .hr-dept-inner textarea.hr-dept-name-field {
      flex: 1;
      min-width: 0;
      width: 100%;
      display: block;
      text-align: left;
      line-height: 1.35;
      white-space: pre-wrap;
      word-break: break-word;
      overflow: hidden;
      resize: none;
      font: inherit;
      font-size: inherit;
      color: inherit;
      border: none;
      background: transparent;
      padding: 2px 0 0;
      margin: 0;
      box-sizing: border-box;
      min-height: 1.35em;
    }

    .hr-dept-inner .hardware-supply-inline-tools {
      flex-shrink: 0;
      margin-top: 2px;
    }

    table.hr tbody[data-hr-dept-index] tr.hr-dept-leader > td,
    table.hr tbody[data-hr-dept-index] tr.hr-dept-ai-cont > td {
      vertical-align: middle;
    }

    table.hr tbody[data-hr-dept-index] tr.hr-dept-leader > td.hr-dept-leader-cell {
      vertical-align: top;
    }

    table.hr tbody[data-hr-dept-index] tr.hr-dept-leader .cell-input,
    table.hr tbody[data-hr-dept-index] tr.hr-dept-ai-cont .cell-input {
      min-height: 30px;
      line-height: 30px;
    }

    table.hr tbody[data-hr-dept-index] tr.hr-dept-leader td:nth-child(6) .cell-textarea {
      min-height: 30px;
      line-height: 1.35;
    }

    .hardware-supply-inline-tools {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 3px;
    }

    .row-tool-btn--hardware-inline {
      width: 20px;
      height: 20px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 6px;
      border: 1px solid var(--table-edge);
      background: #fff;
      color: var(--text-muted);
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06);
      transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
    }

    .row-tool-btn--hardware-inline:hover {
      background: #f1f5f9;
      color: var(--text);
      border-color: #94a3b8;
    }

    .logistics-wrap {
      margin-top: 24px;
    }

    .logistics-title {
      font-size: var(--title-font);
      line-height: 1.1;
      margin: 0 0 10px;
      color: var(--text);
      font-weight: 700;
      background: linear-gradient(105deg, #f0f4f8 0%, #fafbfc 52%, #f1f5f9 100%);
      border-left: 4px solid var(--blue-header);
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
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
      color: var(--text-muted);
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
      border: 1px solid var(--table-edge);
      background: #fff;
      color: var(--text);
      font-size: var(--table-font);
      padding: var(--cell-py) var(--cell-px);
      line-height: 1.25;
      text-align: left;
      vertical-align: middle;
      word-break: break-word;
    }

    table.logistics th,
    table.sim th {
      background: linear-gradient(180deg, var(--blue-header-top) 0%, var(--blue-header) 100%);
      color: #fff;
      font-weight: 700;
      letter-spacing: 0.02em;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.12);
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

      .soimt-key-focus-sort-btn {
        display: none !important;
      }

      .report-outline-section__body {
        display: block !important;
      }

      iframe.sim-traffic-report-embed__frame,
      iframe.pms-state-report-embed__frame,
      iframe.pms-edition-train-embed__frame {
        display: none !important;
      }

      .sim-traffic-report-embed__snapshot,
      .pms-state-report-embed__snapshot,
      .pms-edition-train-embed__snapshot {
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

      .sim-traffic-report-embed__print-fallback,
      .pms-state-report-embed__print-fallback,
      .pms-edition-train-embed__print-fallback {
        display: block !important;
      }

      .sim-traffic-report-embed,
      .pms-state-report-embed,
      .pms-edition-train-embed {
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
