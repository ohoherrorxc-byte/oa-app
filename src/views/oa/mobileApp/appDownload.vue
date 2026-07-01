<template>
  <div class="app-installation">
    <div class="container">
      <!-- 页面标题 -->
      <header class="page-header ">
        <h1 class="title header-container">ERP手机端安装说明</h1>
      </header>
      <!-- 隐私协议部分 -->
      <section class="privacy-section">
        <h2 class="section-title">1. 隐私政策</h2>
        <p class="section-desc">&emsp;&emsp;上汽海外出行科技有限公司尊重您的隐私权。本《隐私政策》说明我们在您使用本APP时如何收集、使用、保护、存储及传输您的个人信息。请仔细阅读。<a
          href="/oa/#/app_privacy" target="_blank">相关隐私政策链接</a></p>
      </section>
      <!-- 安卓安装部分 -->
      <section class="android-section">
        <h2 class="section-title">2. 安卓手机安装</h2>
        <p class="section-desc">扫描下面的二维码进行安装：</p>
        <div class="qrcode-container">
          <img
            src="@/assets/mobile_app/app_android.png"
            alt="安卓安装二维码"
            class="qrcode-image"
          >
        </div>
      </section>

      <!-- IOS安装部分 -->
      <section class="ios-section">
        <h2 class="section-title">3. IOS手机安装</h2>
        <p class="section-desc">需要先安装TestFlight，安装步骤如下：</p>

        <!-- 准备工作 -->
        <div class="step-block">
          <h3 class="step-title">3.1 准备工作</h3>
          <ul class="step-list">
            <li class="step-item">
              <strong>系统要求</strong>
              <ul class="nested-list">
                <li>确保设备系统为 iOS 14 或更高版本</li>
                <li>检查设备存储空间至少预留 200MB</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- TestFlight安装流程 -->
        <div class="step-block">
          <h3 class="step-title">3.2 TestFlight 安装流程</h3>
          <ol class="step-ol">
            <li class="step-li">
              <strong>获取 TestFlight</strong>
              <ul class="nested-list">
                <li>打开设备上的 <strong>App Store</strong></li>
                <li>在搜索栏输入 <strong>"TestFlight"</strong></li>
                <li>点击获取按钮完成下载安装（需使用 Apple ID 登录）</li>
              </ul>
              <div class="step-image-container">
                <img
                  src='@/assets/mobile_app/ios_01.png'
                  alt="TestFlight安装"
                  class="step-image"
                >
              </div>
            </li>
            <li class="step-li">
              <strong>验证安装</strong>
              <ul class="nested-list">
                <li>安装完成后，设备主屏幕会出现蓝色 TestFlight 图标</li>
                <li>首次启动需同意苹果测试协议</li>
              </ul>
              <div class="step-image-container">
                <img
                  src='@/assets/mobile_app/ios_02.png'
                  alt="TestFlight验证"
                  class="step-image"
                >
              </div>
            </li>
          </ol>
        </div>

        <!-- ERP应用安装步骤 -->
        <div class="step-block">
          <h3 class="step-title">3.3 ERP 应用安装步骤</h3>
          <ol class="step-ol">
            <li class="step-li">
              <strong>访问测试链接</strong>
              <ul class="nested-list">
                <li>打开 Safari 浏览器输入以下地址：<a href="https://testflight.apple.com/join/xD3aChIk" target="_blank">https://testflight.apple.com/join/xD3aChIk</a></li>
                <li>或点击邮件/微信中的邀请链接</li>
              </ul>
            </li>
            <li class="step-li">
              <strong>启动安装</strong>
              <ul class="nested-list">
                <li>在页面中点击 <strong>"在 TestFlight 中查看"</strong> 按钮</li>
                <li>系统自动跳转至 TestFlight 应用</li>
              </ul>
              <div class="step-image-container">
                <img
                  src='@/assets/mobile_app/ios_03.png'
                  alt="ERP应用安装1"
                  class="step-image"
                >
              </div>
            </li>
            <li class="step-li">
              <strong>确认安装</strong>
              <ul class="nested-list">
                <li>在 TestFlight 中点击 <strong>"安装"</strong> 按钮</li>
                <li>等待应用下载完成（约需 1-3 分钟）</li>
              </ul>
              <div class="step-image-container">
                <img
                  src='@/assets/mobile_app/ios_04.png'
                  alt="ERP应用安装2"
                  class="step-image"
                >
              </div>
            </li>
          </ol>
        </div>

        <!-- 注意事项 -->
        <div class="step-block">
          <h3 class="step-title">3.4 注意事项</h3>
          <ul class="step-list">
            <li class="step-item">
              <strong>版本说明</strong>
              <ul class="nested-list">
                <li>当前版本：1.0.1（Build 117）</li>
                <li>测试有效期：请在有效期内使用</li>
              </ul>
            </li>
            <li class="step-item">
              <strong>常见问题</strong>
              <ul class="nested-list">
                <li><strong>链接失效</strong>：请联系管理员获取新邀请链接</li>
                <li><strong>安装失败</strong>：检查网络连接或重启设备后重试</li>
                <li><strong>权限设置</strong>：进入「设置」-「TestFlight」开启必要权限</li>
              </ul>
            </li>
          </ul>
        </div>

        <!-- 卸载方法 -->
        <div class="step-block">
          <h3 class="step-title">3.5 卸载方法</h3>
          <p >长按应用图标选择「移除 App」即可彻底卸载</p>
        </div>
      </section>

      <!-- 底部信息 -->
      <footer class="page-footer">
        <p class="footer-text">© {{ currentYear }} 海外出行ERP项目组. 保留所有权利.</p>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  name: "AppInstallation",
  data() {
    return {
      currentYear: new Date().getFullYear(),
    }
  },
  mounted() {
    // 页面加载完成后的钩子函数
    console.log("安装说明页面已加载");
  }
}
</script>

<style scoped>
/* 基础样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
}

.container {
  width: 65%;
  margin: 3vh auto;
}

.header-container {
  margin-top: 10vh;
  margin-bottom: 3vh;
  text-align: center;
}

body {
  background-color: #f5f7fa;
  color: #666;
  line-height: 1.6;
}

.app-installation {
  padding: 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 页面标题样式 */
.page-header {
  background-color: #165DFF;
  color: white;
  padding: 40px 20px;
  text-align: center;
  position: relative;
}

.page-header::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 10px;
  /*background: linear-gradient(135deg, transparent 50%, #fff 50%);*/
  background-size: 20px 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 10px;
}

.step-block {
  color: #666;
}

.subtitle {
  font-size: 16px;
  opacity: 0.9;
  max-width: 700px;
  margin: 0 auto;
}

/* 部分样式 */
.section-title {
  font-size: 22px;
  color: #165DFF;
  padding: 25px 20px 15px;
  border-bottom: 1px solid #eee;
  margin: 0 20px;
}

.section-desc {
  padding: 15px 20px;
  color: #666;
  font-size: 16px;
}

/* 步骤块样式 */
.step-block {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.step-block:last-child {
  border-bottom: none;
}

.step-title {
  font-size: 18px;
  color: #666;
  margin-bottom: 15px;
  padding-left: 10px;
  position: relative;
}

.step-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 20px;
  background-color: #165DFF;
  border-radius: 2px;
}

.step-list, .step-ol {
  padding-left: 30px;
  margin-bottom: 20px;
}

.step-item {
  margin-bottom: 15px;
  position: relative;
}

.step-ol {
  list-style-type: decimal;
}

.step-li {
  margin-bottom: 15px;
}

.nested-list {
  padding-left: 20px;
  margin-top: 5px;
  list-style-type: disc;
}

.step-image-container {
  margin: 20px 0;
  text-align: center;
}

.step-image {
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease;
}

.step-image:hover {
  transform: scale(1.02);
}

/* 安卓二维码样式 */
.qrcode-container {
  text-align: center;
  padding: 20px 0;
}

.qrcode-image {
  width: 200px;
  height: 200px;
  border: 5px solid #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* 卸载说明样式 */
.uninstall-desc {
  font-size: 16px;
  color: #555;
  padding: 15px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

/* 页脚样式 */
.page-footer {
  text-align: center;
  padding: 20px;
  background-color: #f8f9fa;
  color: #888;
  font-size: 14px;
}

a {
  color: #0066cc; /* 统一为蓝色 */
  text-decoration: none; /* 去掉下划线 */
}

a:hover {
  text-decoration: underline; /* 悬停时显示下划线 */
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 24px;
  }

  .section-title {
    font-size: 20px;
  }

  .step-title {
    font-size: 16px;
  }

  .container {
    margin: 0 10px;
  }

  .page-header {
    padding: 30px 15px;
  }
}
</style>
