import store from '@/store';
import { fetchCozeChatAccessToken } from '@/api/coze';

var cozeWebChatClientInstance = null;

var cozeAccessTokenCache = {
  token: '',
  expiresAt: 0,
  sessionName: ''
};

/** 外网 CDN 仅作回退；默认同源加载 public/util/jsrsasign/jsrsasign-all-min.js */
var JSRSASIGN_CDN_FALLBACKS = [
  'https://cdn.staticfile.org/jsrsasign/10.9.0/jsrsasign-all-min.js',
  'https://cdn.jsdelivr.net/npm/jsrsasign@10.9.0/lib/jsrsasign-all-min.js',
  'https://unpkg.com/jsrsasign@10.9.0/lib/jsrsasign-all-min.js'
];

/**
 * 规范化 webpack publicPath（.env 里 BASE_URL=oa 时需变成 /oa/）
 */
function normalizeCozePublicPath(path) {
  var p = String(path == null ? '/' : path).trim();
  if (!p || p === '.') {
    p = '/';
  }
  if (p.charAt(0) !== '/') {
    p = '/' + p;
  }
  if (p.slice(-1) !== '/') {
    p += '/';
  }
  return p;
}

/** 同源静态资源绝对 URL（优先 __webpack_require__.p，避免 BASE_URL=oa 拼成 host+oa 无斜杠） */
function resolveCozePublicAssetUrl(relativePath) {
  var rel = String(relativePath || '').replace(/^\//, '');
  var publicPath = getHostWebpackPublicPath();
  if (!publicPath) {
    publicPath = normalizeCozePublicPath(process.env.BASE_URL || '/');
  } else {
    publicPath = normalizeCozePublicPath(publicPath);
  }
  if (typeof window === 'undefined' || !window.location) {
    return publicPath + rel;
  }
  try {
    return new URL(rel, window.location.origin + publicPath).href;
  } catch (e) {
    return window.location.origin + publicPath + rel;
  }
}

function cozeJsrsasignLocalUrl() {
  var fromEnv = process.env.VUE_APP_COZE_JSRSASIGN_URL;
  if (fromEnv != null && String(fromEnv).trim() !== '') {
    return String(fromEnv).trim();
  }
  return resolveCozePublicAssetUrl('util/jsrsasign/jsrsasign-all-min.js');
}

function getJsrsasignScriptCandidates() {
  var local = cozeJsrsasignLocalUrl();
  var list = [local];
  JSRSASIGN_CDN_FALLBACKS.forEach(function (url) {
    if (url !== local && list.indexOf(url) < 0) {
      list.push(url);
    }
  });
  return list;
}

/** jsrsasign 10.x 将 KEYUTIL 挂在 window.KEYUTIL，而非 KJUR.KEYUTIL */
function getJsrsasignKeyUtil() {
  if (typeof window === 'undefined') {
    return null;
  }
  if (window.KEYUTIL && typeof window.KEYUTIL.getKey === 'function') {
    return window.KEYUTIL;
  }
  if (
    window.KJUR &&
    window.KJUR.KEYUTIL &&
    typeof window.KJUR.KEYUTIL.getKey === 'function'
  ) {
    return window.KJUR.KEYUTIL;
  }
  return null;
}

function isJsrsasignReady() {
  return !!(
    typeof window !== 'undefined' &&
    getJsrsasignKeyUtil() &&
    window.KJUR &&
    window.KJUR.jws &&
    window.KJUR.jws.JWS &&
    typeof window.KJUR.jws.JWS.sign === 'function'
  );
}

function waitForJsrsasignReady(timeoutMs) {
  var limit = timeoutMs > 0 ? timeoutMs : 8000;
  return new Promise(function (resolve, reject) {
    if (isJsrsasignReady()) {
      resolve();
      return;
    }
    var start = Date.now();
    (function poll() {
      if (isJsrsasignReady()) {
        resolve();
        return;
      }
      if (Date.now() - start >= limit) {
        reject(
          new Error(
            '[Coze] jsrsasign 加载超时（KJUR 未就绪）。可配置 VUE_APP_COZE_JWT_TOKEN_API 走后端换票，避免前端加载签名库'
          )
        );
        return;
      }
      window.setTimeout(poll, 50);
    })();
  });
}

/**
 * 与流程基础信息标题一致：nick_name → realName → user_name
 * （参考 src/components/flow/baseInfo.vue initTitle / createUserName）
 */
function getCozeChatUserDisplayName() {
  var info = store.getters.userInfo;
  if (!info || typeof info !== 'object' || Array.isArray(info)) {
    return '';
  }
  var name = info.nick_name || info.realName || info.user_name;
  if (name == null) {
    return '';
  }
  name = String(name).trim();
  return name;
}

/** 仅以下展示名加载挂件（与流程标题用名一致）；admin 不区分大小写 */
function isCozeChatDisplayNameWhitelisted(name) {
  var n = String(name || '').trim();
  if (!n) {
    return false;
  }
  if (n === '范达' || n === '王荀' || n === '陆珉' || n === '武东海' || n === '管其春' || n === 'Brianlu') {
    return true;
  }
  return n.toLowerCase() === 'admin';
}

/**
 * 全局挂载 Coze 网页聊天（所有路由页面可见）。
 *
 * 默认 SDK：扣子 chat-app-sdk（国内 cn）CDN；覆盖请设 VUE_APP_COZE_SDK_URL（须为 .js URL）。
 *
 * 加载策略（尽量不影响其它页面与路由 chunk）：
 *   - 默认：等 window「load」后再用 requestIdleCallback（带 timeout）启动，避免与首屏、懒加载路由抢主线程与带宽。
 *   - VUE_APP_COZE_EAGER=1：仅用 setTimeout(0) 尽快启动（调试用）。
 *   - VUE_APP_COZE_INIT_DELAY_MS：在上述之后再额外延迟的毫秒数（非负整数）。
 *   - VUE_APP_COZE_DISABLE=1：不加载挂件。
 *
 * 白名单：仅当当前用户展示名（nick_name / realName / user_name）为「范达」「王荀」或 admin（不区分大小写）时
 * 才请求 SDK 并初始化；其它用户不加载，避免影响全站。
 *
 * 其它：VUE_APP_COZE_BOT_ID（必填）、VUE_APP_COZE_TITLE、VUE_APP_COZE_BASE_URL、
 * VUE_APP_COZE_Z_INDEX、VUE_APP_COZE_ICON、VUE_APP_COZE_USER_AVATAR、VUE_APP_COZE_ALLOW_HTTP=1。
 *   - VUE_APP_COZE_ICON：右下角悬浮球图标，支持 .gif / .webp（动图）或 .png，放 public 下相对路径或 https URL。
 *   - VUE_APP_COZE_USER_AVATAR：对话内用户头像（可选，默认 img/logo1.png；不设则与 ICON 无关，避免动图进聊天头）。
 *
 * 会话隔离（OAuth JWT，推荐）：
 *   - VUE_APP_COZE_AUTH=jwt，或配置下列任一组合即自动启用 JWT 模式。
 *   - 生产推荐：VUE_APP_COZE_JWT_TOKEN_API（OA 后端换票，私钥不落前端）。
 *   - 开发/联调：VUE_APP_COZE_JWT_APP_ID、VUE_APP_COZE_JWT_PUBLIC_KEY_ID、VUE_APP_COZE_JWT_PRIVATE_KEY（PEM，\n 可写为 \\n）。
 *   - JWT 本地签名库：默认同源 public/util/jsrsasign/jsrsasign-all-min.js；覆盖 VUE_APP_COZE_JSRSASIGN_URL。
 *   - VUE_APP_COZE_JWT_TTL：access_token 有效期秒数，默认 3600。
 *   - 兼容 PAT：未启用 JWT 时仍使用 VUE_APP_COZE_TOKEN。
 */
/** 扣子 chat-app-sdk 国内默认入口（分包与 index 同 CDN 目录，不占用本仓库 public） */
var COZE_CHAT_SDK_DEFAULT_CN =
  'https://lf-cdn.coze.cn/obj/unpkg/flow-platform/chat-app-sdk/1.2.0-beta.20/libs/cn/index.js';

function cozeSdkPublicUrl() {
  return COZE_CHAT_SDK_DEFAULT_CN;
}

function cozeInitDelayMs() {
  var raw = process.env.VUE_APP_COZE_INIT_DELAY_MS;
  if (raw == null || String(raw).trim() === '') {
    return 0;
  }
  var n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0;
}

function isCozeSdkScriptUrl(urlString) {
  var s = String(urlString).trim();
  if (!s) {
    return false;
  }
  try {
    var u = new URL(s, 'http://invalid.local/');
    var p = (u.pathname || '').toLowerCase();
    return p.length > 0 && p.endsWith('.js');
  } catch (e) {
    return /\.js(\?|#|$)/i.test(s);
  }
}

function resolveCozeSdkScriptUrl() {
  var fromEnv = process.env.VUE_APP_COZE_SDK_URL;
  if (fromEnv == null || String(fromEnv).trim() === '') {
    return cozeSdkPublicUrl();
  }
  var s = String(fromEnv).trim();
  if (!isCozeSdkScriptUrl(s)) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.warn(
        '[Coze] VUE_APP_COZE_SDK_URL 须为 .js 脚本 URL；已回退到默认 CDN'
      );
    }
    return cozeSdkPublicUrl();
  }
  return s;
}

function cozeApiBaseURL() {
  var raw = process.env.VUE_APP_COZE_BASE_URL;
  if (raw != null && String(raw).trim() !== '') {
    return String(raw).trim().replace(/\/+$/, '');
  }
  return 'https://api.coze.cn';
}

/** JWT payload 的 aud，与 Coze 官方 SDK 一致为 API 域名 */
function cozeJwtAudience() {
  try {
    return new URL(cozeApiBaseURL()).host;
  } catch (e) {
    return 'api.coze.cn';
  }
}

/**
 * 业务侧用户唯一标识，用于 JWT session_name 与 userInfo.id，实现会话隔离。
 */
function getCozeChatSessionName() {
  var info = store.getters.userInfo;
  if (!info || typeof info !== 'object' || Array.isArray(info)) {
    return '';
  }
  var id =
    info.user_id != null
      ? info.user_id
      : info.userId != null
      ? info.userId
      : info.id;
  if (id == null || String(id).trim() === '') {
    return '';
  }
  return String(id).trim();
}

function isCozeJwtAuthEnabled() {
  if (String(process.env.VUE_APP_COZE_AUTH || '').trim().toLowerCase() === 'jwt') {
    return true;
  }
  if (String(process.env.VUE_APP_COZE_JWT_TOKEN_API || '').trim() !== '') {
    return true;
  }
  var appId = String(process.env.VUE_APP_COZE_JWT_APP_ID || '').trim();
  var keyId = String(process.env.VUE_APP_COZE_JWT_PUBLIC_KEY_ID || '').trim();
  var privateKey = String(process.env.VUE_APP_COZE_JWT_PRIVATE_KEY || '').trim();
  return !!(appId && keyId && privateKey);
}

function cozeJwtTtlSeconds() {
  var raw = process.env.VUE_APP_COZE_JWT_TTL;
  if (raw == null || String(raw).trim() === '') {
    return 3600;
  }
  var n = Number(raw);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 3600;
}

function normalizeCozePrivateKeyPem(pem) {
  var s = String(pem || '').trim();
  if (!s) {
    return '';
  }
  return s.replace(/\\n/g, '\n');
}

function cozeJwtOauthConfigFromEnv() {
  return {
    appId: String(process.env.VUE_APP_COZE_JWT_APP_ID || '').trim(),
    publicKeyId: String(process.env.VUE_APP_COZE_JWT_PUBLIC_KEY_ID || '').trim(),
    privateKeyPem: normalizeCozePrivateKeyPem(process.env.VUE_APP_COZE_JWT_PRIVATE_KEY),
    audience: cozeJwtAudience(),
    ttl: cozeJwtTtlSeconds()
  };
}

function canSignCozeJwtLocally() {
  var cfg = cozeJwtOauthConfigFromEnv();
  return !!(cfg.appId && cfg.publicKeyId && cfg.privateKeyPem);
}

function randomCozeJti() {
  return (
    Math.random().toString(36).slice(2) +
    Date.now().toString(36) +
    Math.random().toString(36).slice(2)
  );
}

function appendJsrsasignScript(src) {
  return new Promise(function (resolve, reject) {
    var s = document.createElement('script');
    s.src = src;
    s.async = false;
    s.setAttribute('data-coze-jsrsasign', '1');
    s.setAttribute('data-coze-jsrsasign-src', src);
    s.onload = function () {
      waitForJsrsasignReady(8000).then(resolve).catch(reject);
    };
    s.onerror = function () {
      reject(
        new Error(
          'jsrsasign script error (请确认该 URL 在浏览器可打开): ' + src
        )
      );
    };
    document.head.appendChild(s);
  });
}

function loadJsrsasignScript() {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('[Coze] 非浏览器环境，无法加载 jsrsasign'));
  }
  if (isJsrsasignReady()) {
    return Promise.resolve();
  }

  var existing = document.querySelector('script[data-coze-jsrsasign="1"]');
  if (existing) {
    return waitForJsrsasignReady(8000).catch(function () {
      var failedSrc = existing.getAttribute('data-coze-jsrsasign-src') || existing.src;
      if (existing.parentNode) {
        existing.parentNode.removeChild(existing);
      }
      return loadJsrsasignFromCandidates(
        getJsrsasignScriptCandidates().filter(function (url) {
          return url !== failedSrc;
        })
      );
    });
  }

  return loadJsrsasignFromCandidates(getJsrsasignScriptCandidates());
}

function loadJsrsasignFromCandidates(urls) {
  var list = urls && urls.length ? urls.slice() : getJsrsasignScriptCandidates();
  if (!list.length) {
    return Promise.reject(new Error('[Coze] 无可用 jsrsasign 脚本地址'));
  }
  var url = list.shift();
  return appendJsrsasignScript(url).catch(function (err) {
    if (!list.length) {
      return Promise.reject(
        new Error(
          '[Coze] jsrsasign 加载失败（已尝试同源与 CDN）。请确认 public/util/jsrsasign/jsrsasign-all-min.js 存在，或配置 VUE_APP_COZE_JWT_TOKEN_API：' +
          (err && err.message ? err.message : err)
        )
      );
    }
    return loadJsrsasignFromCandidates(list);
  });
}

function parseCozeJwtPrivateKey(pem) {
  if (!isJsrsasignReady()) {
    throw new Error('[Coze] jsrsasign 未加载完成，请刷新页面或配置后端换票接口');
  }
  var keyUtil = getJsrsasignKeyUtil();
  var normalized = normalizeCozePrivateKeyPem(pem);
  if (!normalized) {
    throw new Error('[Coze] VUE_APP_COZE_JWT_PRIVATE_KEY 为空');
  }
  if (
    normalized.indexOf('BEGIN PRIVATE KEY') < 0 &&
    normalized.indexOf('BEGIN RSA PRIVATE KEY') < 0
  ) {
    throw new Error(
      '[Coze] 私钥须为 PEM：-----BEGIN PRIVATE KEY----- 或 -----BEGIN RSA PRIVATE KEY-----（不支持 PGP / 加密私钥）'
    );
  }
  try {
    var keyObj = keyUtil.getKey(normalized);
    if (!keyObj) {
      throw new Error('KEYUTIL.getKey 返回空');
    }
    return keyObj;
  } catch (e) {
    var detail = e && e.message ? e.message : String(e);
    if (/not supported argument/i.test(detail)) {
      throw new Error(
        '[Coze] 私钥无法解析（init failed: not supported argument）。请从扣子 OAuth 应用复制 PKCS#8 私钥，.env 中用 \\n 写换行，勿用公钥或 PGP 格式。'
      );
    }
    throw new Error('[Coze] 私钥解析失败：' + detail);
  }
}

function signCozeOauthJwt(sessionName) {
  var cfg = cozeJwtOauthConfigFromEnv();
  if (!cfg.appId || !cfg.publicKeyId || !cfg.privateKeyPem) {
    return Promise.reject(new Error('[Coze] JWT 本地签名缺少 OAuth 应用配置'));
  }
  return loadJsrsasignScript().then(function () {
    var keyObj = parseCozeJwtPrivateKey(cfg.privateKeyPem);
    var now = Math.floor(Date.now() / 1000);
    var sHeader = JSON.stringify({
      alg: 'RS256',
      typ: 'JWT',
      kid: cfg.publicKeyId
    });
    var sPayload = JSON.stringify({
      iss: cfg.appId,
      aud: cfg.audience,
      iat: now,
      exp: now + cfg.ttl,
      jti: randomCozeJti(),
      session_name: String(sessionName)
    });
    try {
      // 与 Coze 官方 SDK / jsrsasign 示例一致：alg 传 null，密钥传 KEYUTIL 解析后的对象
      return window.KJUR.jws.JWS.sign(null, sHeader, sPayload, keyObj);
    } catch (e) {
      var msg = e && e.message ? e.message : String(e);
      if (/not supported argument/i.test(msg)) {
        throw new Error(
          '[Coze] JWT RS256 签名失败，请检查私钥是否为扣子 OAuth 应用生成的未加密 PEM'
        );
      }
      throw e;
    }
  });
}

function parseCozeOAuthTokenResponse(body) {
  if (!body || typeof body !== 'object') {
    return null;
  }
  var data = body.data != null ? body.data : body;
  if (!data || typeof data !== 'object') {
    return null;
  }
  var accessToken = data.access_token || data.accessToken;
  if (!accessToken) {
    return null;
  }
  var expiresIn = data.expires_in != null ? data.expires_in : data.expiresIn;
  var ttl = Number(expiresIn);
  return {
    access_token: String(accessToken),
    expires_in: Number.isFinite(ttl) && ttl > 0 ? Math.floor(ttl) : cozeJwtTtlSeconds()
  };
}

function exchangeCozeSignedJwtForAccessToken(signedJwt, ttl) {
  var cfg = cozeJwtOauthConfigFromEnv();
  var apiBase = cozeApiBaseURL();
  return fetch(apiBase + '/api/permission/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + signedJwt
    },
    body: JSON.stringify({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      duration_seconds: ttl,
      client_id: cfg.appId
    })
  }).then(function (res) {
    return res.json().then(function (json) {
      if (!res.ok) {
        var msg =
          (json && (json.msg || json.message || json.error)) ||
          'Coze OAuth token HTTP ' + res.status;
        throw new Error(msg);
      }
      var parsed = parseCozeOAuthTokenResponse(json);
      if (!parsed) {
        throw new Error('[Coze] OAuth 响应缺少 access_token');
      }
      return parsed;
    });
  });
}

function fetchCozeAccessTokenFromBackend(sessionName) {
  var api = String(process.env.VUE_APP_COZE_JWT_TOKEN_API || '').trim();
  if (!api) {
    return Promise.resolve(null);
  }
  return fetchCozeChatAccessToken(sessionName)
    .then(function (res) {
      return parseCozeOAuthTokenResponse(res.data);
    })
    .catch(function (err) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('[Coze] 后端换票失败，将尝试本地 JWT 签名', err);
      }
      return null;
    });
}

function acquireCozeJwtAccessToken(sessionName, forceRefresh) {
  if (!sessionName) {
    return Promise.reject(new Error('[Coze] 缺少 session_name（用户未登录）'));
  }
  var nowSec = Math.floor(Date.now() / 1000);
  if (
    !forceRefresh &&
    cozeAccessTokenCache.token &&
    cozeAccessTokenCache.sessionName === sessionName &&
    cozeAccessTokenCache.expiresAt > nowSec + 60
  ) {
    return Promise.resolve(cozeAccessTokenCache.token);
  }

  function cacheAndReturn(tokenResp) {
    var skew = 60;
    cozeAccessTokenCache = {
      token: tokenResp.access_token,
      expiresAt: nowSec + (tokenResp.expires_in || cozeJwtTtlSeconds()) - skew,
      sessionName: sessionName
    };
    return cozeAccessTokenCache.token;
  }

  return fetchCozeAccessTokenFromBackend(sessionName).then(function (fromApi) {
    if (fromApi && fromApi.access_token) {
      return cacheAndReturn(fromApi);
    }
    if (!canSignCozeJwtLocally()) {
      throw new Error(
        '[Coze] JWT 模式需配置 VUE_APP_COZE_JWT_TOKEN_API 或 JWT OAuth 三元组'
      );
    }
    return signCozeOauthJwt(sessionName)
      .then(function (signedJwt) {
        return exchangeCozeSignedJwtForAccessToken(signedJwt, cozeJwtTtlSeconds());
      })
      .then(cacheAndReturn);
  });
}

function clearCozeAccessTokenCache() {
  cozeAccessTokenCache = { token: '', expiresAt: 0, sessionName: '' };
}

/**
 * 销毁挂件（退出登录时调用，避免下一用户沿用上一用户会话）。
 */
export function destroyCozeWebChat() {
  clearCozeAccessTokenCache();
  if (cozeWebChatClientInstance && typeof cozeWebChatClientInstance.destroy === 'function') {
    try {
      cozeWebChatClientInstance.destroy();
    } catch (e) {
      /* ignore */
    }
  }
  cozeWebChatClientInstance = null;
}

function isSecureContextForMedia() {
  if (typeof window === 'undefined' || !window.location) {
    return true;
  }
  if (typeof window.isSecureContext === 'boolean') {
    return window.isSecureContext;
  }
  return window.location.protocol === 'https:';
}

function cozeAllowHttpInsecureContext() {
  return String(process.env.VUE_APP_COZE_ALLOW_HTTP || '').trim() === '1';
}

function getCozeSdkGlobal() {
  return window.CozeWebSDK || window.CozeWebSDKmain;
}

/** 宿主 Vue 应用的 webpack publicPath；Coze 脚本执行后可能被改写，须在 onload 后恢复以免影响其它 chunk */
function getHostWebpackPublicPath() {
  try {
    if (typeof __webpack_require__ !== 'undefined' && __webpack_require__.p) {
      return String(__webpack_require__.p);
    }
  } catch (e) {
    /* ignore */
  }
  if (typeof window !== 'undefined' && window.__webpack_public_path__) {
    return String(window.__webpack_public_path__);
  }
  return undefined;
}

function setHostWebpackPublicPath(p) {
  if (p === undefined || p === null) {
    return;
  }
  try {
    if (typeof __webpack_require__ !== 'undefined') {
      __webpack_require__.p = p;
    }
  } catch (e) {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.__webpack_public_path__ = p;
  }
}

function loadScript(src) {
  return new Promise(function (resolve, reject) {
    var savedPublicPath = getHostWebpackPublicPath();
    var existing = document.querySelector('script[data-coze-web-sdk="1"]');
    if (existing) {
      if (getCozeSdkGlobal()) {
        setHostWebpackPublicPath(savedPublicPath);
        resolve();
        return;
      }
      existing.addEventListener('load', function () {
        setHostWebpackPublicPath(savedPublicPath);
        resolve();
      });
      existing.addEventListener('error', function () {
        setHostWebpackPublicPath(savedPublicPath);
        reject(new Error('Coze SDK load failed'));
      });
      return;
    }
    var s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.setAttribute('data-coze-web-sdk', '1');
    s.onload = function () {
      setHostWebpackPublicPath(savedPublicPath);
      resolve();
    };
    s.onerror = function () {
      setHostWebpackPublicPath(savedPublicPath);
      reject(new Error('Coze SDK load failed'));
    };
    document.body.appendChild(s);
  });
}

function cozeChatZIndex() {
  var raw = process.env.VUE_APP_COZE_Z_INDEX;
  if (raw == null || raw === '') {
    return 10000000;
  }
  var n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : 10000000;
}

var COZE_DEFAULT_ENTRY_ICON = 'img/logo1.png';
var COZE_DEFAULT_USER_AVATAR = 'img/logo1.png';

function resolveCozeIconUrl(raw, fallbackRelative) {
  if (raw == null || String(raw).trim() === '') {
    raw = fallbackRelative;
  } else {
    raw = String(raw).trim();
  }
  if (/^https?:\/\//i.test(raw)) {
    return raw;
  }
  if (typeof window === 'undefined' || !window.location) {
    return raw;
  }
  try {
    return new URL(raw, resolveCozePublicAssetUrl('')).href;
  } catch (e) {
    return resolveCozePublicAssetUrl(raw);
  }
}

/** 悬浮球入口图标（可用 GIF/WebP 动图） */
function cozeEntryIconUrl() {
  return resolveCozeIconUrl(
    process.env.VUE_APP_COZE_ICON,
    COZE_DEFAULT_ENTRY_ICON
  );
}

/** 聊天窗口内用户头像（建议静态图；未配置时用 logo1.png，不用动图） */
function cozeUserAvatarUrl() {
  return resolveCozeIconUrl(
    process.env.VUE_APP_COZE_USER_AVATAR,
    COZE_DEFAULT_USER_AVATAR
  );
}

/**
 * 在文档 load 之后、浏览器空闲时再执行，减少对路由懒加载与其它请求的争抢。
 */
function scheduleCozeSdkNonBlocking(task) {
  if (typeof window === 'undefined') {
    return;
  }
  if (String(process.env.VUE_APP_COZE_EAGER || '').trim() === '1') {
    window.setTimeout(task, 0);
    return;
  }

  var extra = cozeInitDelayMs();

  function runWithOptionalDelay() {
    if (extra > 0) {
      window.setTimeout(task, extra);
      return;
    }
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(
        function () {
          window.setTimeout(task, 0);
        },
        { timeout: 8000 }
      );
    } else {
      window.setTimeout(task, 2000);
    }
  }

  if (document.readyState === 'complete') {
    runWithOptionalDelay();
  } else {
    window.addEventListener('load', function onLoad() {
      window.removeEventListener('load', onLoad);
      runWithOptionalDelay();
    });
  }
}

function resolveCozeAuthToken(sessionName, useJwt) {
  if (useJwt) {
    return acquireCozeJwtAccessToken(sessionName, false);
  }
  var pat = process.env.VUE_APP_COZE_TOKEN || '';
  if (!pat) {
    return Promise.reject(new Error('[Coze] 未配置 VUE_APP_COZE_TOKEN'));
  }
  return Promise.resolve(pat);
}

function createCozeWebChatClient(SDK, options) {
  destroyCozeWebChat();
  cozeWebChatClientInstance = new SDK.WebChatClient(options);
  return cozeWebChatClientInstance;
}

function runCozeWebChatInit() {
  var botId = process.env.VUE_APP_COZE_BOT_ID || '';
  var useJwt = isCozeJwtAuthEnabled();
  var patToken = process.env.VUE_APP_COZE_TOKEN || '';
  var title = process.env.VUE_APP_COZE_TITLE || '海外出行智能助手';
  var chatZIndex = cozeChatZIndex();
  var entryIcon = cozeEntryIconUrl();
  var userAvatar = cozeUserAvatarUrl();

  if (!botId) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[Coze] 未配置 VUE_APP_COZE_BOT_ID，跳过聊天挂件');
    }
    return;
  }
  if (!useJwt && !patToken) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info(
        '[Coze] 未配置 JWT 鉴权且未配置 VUE_APP_COZE_TOKEN，跳过聊天挂件'
      );
    }
    return;
  }

  var displayName = getCozeChatUserDisplayName();
  if (!isCozeChatDisplayNameWhitelisted(displayName)) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[Coze] 当前用户不在白名单，跳过挂件');
    }
    return;
  }

  var sessionName = getCozeChatSessionName();
  if (useJwt && !sessionName) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[Coze] JWT 模式需要已登录用户 user_id，跳过挂件');
    }
    return;
  }

  var userId = sessionName || 'guest';

  resolveCozeAuthToken(sessionName, useJwt)
    .then(function (accessToken) {
      return loadScript(resolveCozeSdkScriptUrl()).then(function () {
        return { accessToken: accessToken };
      });
    })
    .then(function (ctx) {
      var SDK = getCozeSdkGlobal();
      if (!SDK || !SDK.WebChatClient) {
        // eslint-disable-next-line no-console
        console.warn('[Coze] WebChatClient 未找到，请检查 SDK 版本与文档');
        return;
      }
      if (!ctx.accessToken || typeof ctx.accessToken !== 'string') {
        throw new Error('[Coze] access_token 无效，请检查 JWT 换票或后端接口返回');
      }
      var uiBase = { zIndex: chatZIndex, icon: entryIcon };
      var apiBase = cozeApiBaseURL();
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.info(
          '[Coze] 已初始化 WebChatClient，baseURL=%s，auth=%s，session=%s',
          apiBase,
          useJwt ? 'jwt' : 'pat',
          useJwt ? sessionName : userId
        );
      }
      createCozeWebChatClient(SDK, {
        config: {
          baseURL: apiBase,
          bot_id: botId,
          custom_variables: {
            user_name: displayName || '用户',
            // 其他需要透传的参数都可以在这里加键值对
            user_id: String(userId)
          },
          botInfo: {
            parameters: {
              user_name: displayName || '用户',
              user_id: String(userId)
            }
          }
        },
        ui: {
          base: uiBase
        },
        userInfo: {
          id: String(userId),
          url: userAvatar,
          nickname: displayName || '用户'
        },
        componentProps: {
          title: title
        },
        auth: {
          type: 'token',
          token: ctx.accessToken,
          onRefreshToken: function () {
            if (!useJwt) {
              return patToken;
            }
            return acquireCozeJwtAccessToken(sessionName, true).catch(function (err) {
              // eslint-disable-next-line no-console
              console.warn('[Coze] onRefreshToken 失败', err);
              return ctx.accessToken;
            });
          }
        }
      });
    })
    .catch(function (err) {
      // eslint-disable-next-line no-console
      console.warn('[Coze]', err);
    });
}

export function initCozeWebChat() {
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  if (String(process.env.VUE_APP_COZE_DISABLE || '').trim() === '1') {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.info('[Coze] VUE_APP_COZE_DISABLE=1，跳过挂件');
    }
    return Promise.resolve();
  }

  scheduleCozeSdkNonBlocking(function () {
    runCozeWebChatInit();
  });

  return Promise.resolve();
}
