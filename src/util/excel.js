/**
 * 以blob形式下载excel文件，避免window.open弹框
 * @param rsp
 */
export function download(rsp) {
  var blob = new Blob([rsp.data], {type: 'application/vnd.ms-excel;charset=utf-8'})
  var url = window.URL.createObjectURL(blob);
  var tempLink = document.createElement("a");
  var contentDisposition = rsp.headers["content-disposition"];

  tempLink.style.display = "none";
  tempLink.download = decodeURI(contentDisposition.substring(contentDisposition.indexOf('=')+1));
  tempLink.href = url;

  document.body.appendChild(tempLink);
  tempLink.click();
  document.body.removeChild(tempLink);
  window.URL.revokeObjectURL(url);
}
