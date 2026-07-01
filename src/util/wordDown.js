import { saveAs } from "file-saver";
import htmlDocx from 'html-docx-js/dist/html-docx';

export function exportHtmlToDocx(htmlContent, fileName = 'exported-document.docx') {
  // 处理HTML元素里面的图片
  // 构建包含 HTML 内容的完整 HTML 文档字符串
  const fullHtmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <style>
            table {
              border-collapse: collapse;
              table-layout: fixed;word-break: break-all; word-wrap: break-word;
            }  
           </style>
          </head>
          <body>
          <div>
            ${htmlContent}
          </div>
          </body>
        </html>
      `;
  // console.log(htmlDocx)
  // 使用 html-docx-js 将 HTML 转换为 Word 文档的 Blob 对象
  const converted = htmlDocx.asBlob(fullHtmlContent);
  // 使用 file-saver 保存 Blob 对象为 Word 文档文件
  saveAs(converted, fileName);

}

