<template>
  <div class="wrapper bg-gray-100 text-gray-800 font-sans text-base">
    <!-- 页面标题 -->
    <header class="text-center py-8">
      <div class="container">
        <h1 class="text-3xl font-bold mb-5 header-container">隐私政策</h1>
        <p class="max-w-2xl mx-auto">
          &emsp;&emsp;上汽海外出行科技有限公司（以下称为“我们”）尊重您的隐私权。本《隐私政策》说明我们在您使用本APP时如何收集、使用、保护、存储及传输您的个人信息。请仔细阅读。
        </p>
        <p class="max-w-2xl mx-auto mt-2">
          &emsp;&emsp;<strong>个人信息</strong>指以电子或其他方式记录的能单独或结合其他信息识别您身份的信息。本政策中涉及您个人信息权益的内容已加粗，请特别注意。
        </p>
      </div>
    </header>

    <!-- 隐私政策内容 -->
    <main class="container pb-12">
      <!-- 目录导航 -->
      <div class="my-8">
        <h2 class="text-xl font-semibold mb-4">目录</h2>
        <ul class="list-none space-y-2">
          <li v-for="(section, index) in sections" :key="index">
            <a :href="`#section-${index + 1}`" class="text-blue-600 hover:underline">
              {{ index + 1 }}. {{ section.title }}
            </a>
            <p></p>
          </li>
        </ul>
      </div>

      <!-- 政策详情 -->
      <div v-for="(section, index) in sections" :key="index" :id="'section-' + (index + 1)" class="mb-8">
        <h2 class="text-xl font-semibold mb-4">{{ index + 1 }}. {{ section.title }}</h2>
        <div class="prose" v-html="section.content"></div>
      </div>

      <!-- 底部声明 -->
      <div>

      </div>
      <div class="text-center text-gray-500 text-sm bottom-container">
        <p>更新日期：2025年06月15日</p>
        <p>生效日期：2025年06月20日</p>
        <p>上汽海外出行科技有限公司 版权所有 © 2025</p>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PrivacyPolicy',
  data() {
    return {
      sections: [
        {
          title: '我们如何收集您的个人信息',
          content: `
            在您使用本APP的过程中，我们会出于本隐私政策所述的以下目的，收集和使用您在主动提供或因使用功能或接受服务过程中产生的个人信息。
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>注册与登录</strong>：当您注册、登录本APP时，您需要提供手机号码、设置密码或通过第三方账号（上汽统一身份认证平台等，若有相关授权登录功能）进行登录。这些信息用于创建您的账号，保障您的账号安全以及识别您的身份，以便为您提供服务。若您不提供此类信息，可能无法注册、登录本APP并使用相关服务。</li>
              <li><strong>位置信息</strong>：为实现打卡功能，我们会收集您的位置信息。当您进行打卡操作时，我们会获取您打卡时的具体位置（经纬度信息）。本APP获取位置信息的方式主要通过手机的GPS定位系统，同时可能结合基站定位和WiFi定位等技术，以更精准地确定您的位置。获取位置信息的目的仅用于记录您的打卡位置，以便公司准确统计您的考勤情况。您可以在手机设置中随时关闭位置信息授权，但关闭后可能无法正常使用打卡功能。</li>
              <li><strong>设备信息</strong>：为保障本APP的稳定运行和功能实现，我们可能会收集您的设备信息，包括设备型号、操作系统版本、设备唯一识别码（IMEI/androidID/DEVICE_ID/IDFA等）、网络状态等，这些信息有助于我们为您提供更好的服务，保证本APP的安全，优化本APP性能以及排查故障。</li>
            </ul>`
        },
        {
          title: '我们如何使用您的个人信息',
          content: `
            我们将个人信息用于：
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>打卡服务</strong>：我们使用您的位置信息用于打卡位置记录，生成您的考勤数据，以便公司进行考勤管理和统计分析。同时，根据您的打卡设置，我们可能会在预设的打卡时间向您发送打卡提醒通知，确保您不会错过打卡时间，此过程中会使用您的手机号码或本APP内消息推送功能（若您已开启）。</li>
              <li><strong>APP优化</strong>：我们会对收集到的设备信息、使用情况等数据进行分析，以了解本APP的运行状况，优化本APP的性能、功能和用户体验。例如，通过分析设备信息，我们可以适配更多类型的手机设备，提升本APP的兼容性；通过分析使用情况，我们可以优化功能布局，使您更便捷地使用本APP。</li>
              <li><strong>安全保障</strong>：我们会利用收集的信息来保障本APP及您账号的安全，预防、发现、调查欺诈、侵权、危害安全、非法或违反与我们的协议、政策或规则的行为，以保护您、我们及其他用户的合法权益。</li>
            </ul>`
        },
        {
          title: '我们如何存储和保护您的个人信息',
          content: `
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>存储</strong>：我们将在中华人民共和国境内存储您的个人信息。我们仅在为实现本隐私政策所述目的所必需的期间内保留您的个人信息，法律法规另有规定的除外。例如，对于考勤打卡数据，我们会按照公司相关规定保留一定的时间用于考勤统计和存档，超过保存期限后，我们会对相关数据进行删除或匿名化处理。</li>
              <li><strong>保护</strong>：我们采取了一系列合理的物理、电子和管理方面的安全措施来保护您的个人信息，防止信息被未经授权访问、披露、使用、修改、损坏或丢失。例如，我们对敏感信息进行加密存储，对访问个人信息的权限进行严格控制，定期对系统进行安全评估和漏洞修复等。尽管我们采取了上述安全措施，但请您理解，由于技术的限制以及可能存在的各种恶意手段，在互联网行业，即便竭尽所能加强安全措施，也不可能始终保证信息的百分之百安全。您需要了解，您接入我们的服务所用的系统和通讯网络，有可能因我们可控范围外的因素而出现问题。</li>
            </ul>`
        },
        {
          title: '我们如何共享、转让和公开披露您的个人信息',
          content: `
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>共享</strong>：我们不会将您的个人信息共享给任何第三方，除非获得您的明确同意或法律法规另有规定。在某些情况下，我们可能会与关联公司共享您的个人信息，以便为您提供更全面的服务或共同开展某些业务活动，但我们会确保关联公司遵守本隐私政策以及相关法律法规对个人信息保护的要求。</li>
              <li><strong>转让</strong>：我们不会将您的个人信息转让给任何第三方，除非事先获得您的明确同意或根据法律法规的要求，或因公司合并、分立、破产、清算等原因需要进行个人信息转让。在进行个人信息转让时，我们会要求接收方遵守本隐私政策以及相关法律法规对个人信息保护的要求。</li>
              <li><strong>公开披露</strong>：我们仅会在获得您的明确同意或基于法律法规的要求、诉讼争议解决需要，或行政、司法机关依法提出要求的情况下，才会公开披露您的个人信息。</li>
            </ul>`
        },
        {
          title: '征得授权同意的例外',
          content: `
            根据法律法规的规定，在以下情形中，我们收集、使用、共享、转让、公开披露您的个人信息无需征得您的授权同意：
            <ul class="list-disc pl-5 space-y-2">
              <li>与国家安全、国防安全直接相关；</li>
              <li>与公共安全、公共卫生、重大公共利益直接相关；</li>
              <li>与犯罪侦查、起诉、审判和判决执行等直接相关；</li>
              <li>维护您或其他个人的生命、财产等重大合法权益但难以获得本人同意；</li>
              <li>您自行向社会公众公开的个人信息；</li>
              <li>从合法公开披露的信息中收集的个人信息，如合法的新闻报道、政府信息公开等；</li>
              <li>根据您的要求签订或履行合同所必需；</li>
              <li>维护产品或服务安全稳定运行所必需，例如发现、处置产品或服务的故障；</li>
              <li>法律法规规定的其他情形。</li>
            </ul>`
        },
        {
          title: '您如何管理您的个人信息',
          content: `
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>访问与修改</strong>：您有权访问、更正或删除您在本APP中提供的个人信息。您可以通过本APP内的设置功能或相关操作入口，对您的个人信息进行查询、修改。如果您需要删除某些个人信息，在符合法律法规和本APP规定的情况下，您可以通过相应操作进行删除。若您无法通过上述方式实现对个人信息的管理，您可以联系我们的客服人员，我们将协助您处理。</li>
              <li><strong>撤回同意</strong>：您可以通过设备的系统设置或本APP内的相关设置，随时撤回对某些权限的同意，如位置信息权限。撤回同意后，我们将不再基于该权限收集您的个人信息，同时可能会影响相关功能的正常使用。</li>
              <li><strong>注销账号</strong>：如果您希望注销您的本APP账号，您可以在本APP内的设置中找到注销账号的入口，按照提示进行操作。注销账号后，我们将按照法律法规的要求对您的个人信息进行删除或匿名化处理，您将无法再使用本APP的相关服务。</li>
            </ul>`
        },
        {
          title: '未成年人个人信息保护',
          content: `
            本APP的服务主要面向成年人。如果您是未成年人，在使用本APP前，请您的监护人仔细阅读本隐私政策，并在征得监护人同意的情况下使用本APP。我们不会主动收集未成年人的个人信息，若我们发现收集了未成年人的个人信息，我们会尽快删除相关信息。
          `
        },
        {
          title: '本政策如何变更',
          content: `
            我们可能会根据业务的发展、法律法规及监管政策的变化等原因适时修订本隐私政策。未经您明确同意，我们不会削减您依据本隐私政策所应享有的权利。我们会在本APP显著位置发布更新后的隐私政策，并以弹窗、推送通知等方式提醒您。若您在本隐私政策修订后继续使用本APP，即视为您同意修订后的隐私政策。
          `
        },
        {
          title: '如何联系我们',
          content: `
            如果您对本隐私政策或我们对您个人信息的处理有任何疑问、意见或建议，或者您在使用本APP过程中发现个人信息可能被泄露，您可以通过以下方式联系我们：
            <ul class="list-disc pl-5 space-y-2">
              <li>邮箱：<a href="mailto:SOIMT-OA@saicmotor.com" class="text-blue-600 hover:underline">SOIMT-OA@saicmotor.com</a></li>
              <li>电话：<a href="tel:13917790620" class="text-blue-600 hover:underline">+86 139 1779 0620</a></li>
            </ul>`
        }
      ]
    };
  }
};
</script>

<style scoped>
body {
  background: #F7F7F7;
  font-size: 15px;
}

h1 {
  margin: 30px 0 20px;
}

h2 {
  font-size: 16px;
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

.my-8{
  margin-top: 6vh;
  margin-bottom: 6vh;
}

.bottom-container{
  margin-top: 8vh;
  margin-bottom: 15vh;
}

.prose {
  max-width: none;
  line-height: 1.6;
}

.prose ul {
  margin-bottom: 1rem;
}

.prose a {
  color: #2563eb;
  text-decoration: none;
}

.prose a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .container {
    width: 85%;
  }
  .prose {
    font-size: 14px;
  }
}
</style>
