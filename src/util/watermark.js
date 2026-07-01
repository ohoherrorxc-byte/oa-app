import {
	getFormatDate
} from './util'
'use strict';
let watermark = {};
watermark.set = (remove) => {
	let userInfo = localStorage.getItem("saber-userInfo")  
    let jsonUser = JSON.parse(userInfo)
    console.log(jsonUser)
    if(!jsonUser||!jsonUser.content||!jsonUser.content.nick_name){
        return
    }
	const watermarkText = `${jsonUser.content.nick_name} ${getFormatDate()}`;
	// 创建水印容器
	const watermarkContainer = document.createElement("div");
	watermarkContainer.id = 'watermarkContainer'
	watermarkContainer.style.position = "fixed";
	watermarkContainer.style.top = "0";
	watermarkContainer.style.left = "0";
	watermarkContainer.style.width = "100%";
	watermarkContainer.style.height = "100%";
	watermarkContainer.style.pointerEvents = "none";
	watermarkContainer.style.zIndex = "9999";

	// 获取页面宽度和高度
	const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	const pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

	// 每行水印的间距和行数
	const rowSpacing = 180; // 每行间距
	const rowCount = 15; // 行数

	// 每列水印的间距和列数
	const columnSpacing = 220; // 每列间距
	const columnCount = 20; // 列数

	for (let i = 0; i < rowCount; i++) {
		for (let j = 0; j < columnCount; j++) {
			// 创建水印元素
			const watermark = document.createElement("div");
			watermark.id = "custom-watermark-" + i + "-" + j;
			watermark.style.position = "absolute";
			watermark.style.top = i * rowSpacing + "px";
			watermark.style.left = j * columnSpacing + "px";
			watermark.style.width = "auto";
			watermark.style.height = "auto";
			watermark.style.fontFamily = "Arial, sans-serif";
			watermark.style.fontSize = "16px";
			watermark.style.opacity = "0.1";
			watermark.style.color = "#000000";
			// watermark.style.color = "red";
			watermark.style.transform = "rotate(-25deg)";
			watermark.style.transformOrigin = "50% 50%";
			watermark.style.whiteSpace = "nowrap";

			// 设置水印的文本内容
			const watermarkTextNode = document.createTextNode(watermarkText);

			// 将文本节点添加到水印元素中
			watermark.appendChild(watermarkTextNode);

			// 将水印元素添加到水印容器中
			watermarkContainer.appendChild(watermark);
		}
	}
	// console.log(arr.length)
	let arr = document.querySelectorAll('#watermarkContainer')
	if(arr.length===0&&!remove){
		document.body.appendChild(watermarkContainer)
	}
	if(remove){	
		// console.log(arr.length)
		for(const index in arr){
			let item = arr[index]
			let parent = item.parentElement
            if(parent){
                parent.removeChild(item)
            }
			
		}
	}
	

}
export default watermark;