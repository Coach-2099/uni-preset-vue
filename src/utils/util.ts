import { isObject } from "@vue/shared";
import * as CryptoJS from "crypto-js";
import { format } from 'date-fns'

/**
 * @description 获取元素节点信息（在组件中的元素必须要传ctx）
 * @param  { String } selector 选择器 '.app' | '#app'
 * @param  { Boolean } all 是否多选
 * @param  { ctx } context 当前组件实例
 */
export const getRect = (selector : string, all = false, context ?: any) => {
	return new Promise((resolve, reject) => {
		let query = uni.createSelectorQuery();
		if (context) {
			query = uni.createSelectorQuery().in(context);
		}
		query[all ? "selectAll" : "select"](selector)
			.boundingClientRect(function (rect) {
				if (all && Array.isArray(rect) && rect.length) {
					return resolve(rect);
				}
				if (!all && rect) {
					return resolve(rect);
				}
				reject("找不到元素");
			})
			.exec();
	});
};

/**
 * @description 获取当前页面实例
 */
export function currentPage() {
	const pages = getCurrentPages();
	const currentPage = pages[pages.length - 1];
	return currentPage || {};
}

/**
 * @description 后台选择链接专用跳转
 */
interface Link {
	path : string;
	name ?: string;
	type : string;
	isTab : boolean;
	query ?: Record<string, any>;
}

export enum LinkTypeEnum {
	"SHOP_PAGES" = "shop",
	"CUSTOM_LINK" = "custom",
}

export function navigateTo(
	link : Link,
	navigateType : "navigateTo" | "reLaunch" | "switchTab" = "navigateTo"
) {
	const url = link.query
		? `${link.path}?${objectToQuery(link.query)}`
		: link.path;
	navigateType == "navigateTo" && uni.navigateTo({ url });
	navigateType == "reLaunch" && uni.reLaunch({ url });
	navigateType == "switchTab" && uni.switchTab({ url });
}

/**
 * @description 是否为空
 * @param {unknown} value
 * @return {Boolean}
 */
export const isEmpty = (value : unknown) => {
	return value == null && typeof value == "undefined";
};

/**
 * @description 对象格式化为Query语法
 * @param { Object } params
 * @return {string} Query语法
 */
export function objectToQuery(params : Record<string, any>) : string {
	let query = "";
	for (const props of Object.keys(params)) {
		const value = params[props];
		const part = encodeURIComponent(props) + "=";
		if (!isEmpty(value)) {
			if (isObject(value)) {
				for (const key of Object.keys(value)) {
					if (!isEmpty(value[key])) {
						const params = props + "[" + key + "]";
						const subPart = encodeURIComponent(params) + "=";
						query += subPart + encodeURIComponent(value[key]) + "&";
					}
				}
			} else {
				query += part + encodeURIComponent(value) + "&";
			}
		}
	}
	return query.slice(0, -1);
}

/**
 * @description 格式化输出价格
 * @param  { string } price 价格
 * @param  { string } take 小数点操作
 * @param  { string } prec 小数位补
 */
export function formatPrice({ price, take = "all", prec = undefined } : any) {
	let [integer, decimals = ""] = (price + "").split(".");

	// 小数位补
	if (prec !== undefined) {
		const LEN = decimals.length;
		for (let i = prec - LEN; i > 0; --i) decimals += "0";
		decimals = decimals.substr(0, prec);
	}

	switch (take) {
		case "int":
			return integer;
		case "dec":
			return decimals;
		case "all":
			return integer + "." + decimals;
	}
}

/**
 * @description 组合异步任务
 * @param  { string } task 异步任务
 */

export function series(...task : Array<(_arg : any) => any>) {
	return function () : Promise<any> {
		return new Promise((resolve, reject) => {
			const iteratorTask = task.values();
			const next = (res ?: any) => {
				const nextTask = iteratorTask.next();
				if (nextTask.done) {
					resolve(res);
				} else {
					Promise.resolve(nextTask.value(res)).then(next).catch(reject);
				}
			};
			next();
		});
	};
}

/**
 * @description 添加单位
 * @param {String | Number} value 值 100
 * @param {String} unit 单位 px em rem
 */
export const addUnit = (value : string | number, unit = "rpx") => {
	return !Object.is(Number(value), NaN) ? `${value}${unit}` : value;
};

/**
 * 自动适配不同的后端架构
 * 1. 例如 /act/oa/task ,在微服务架构保持不变,在单体架构编程 /admin/oa/task
 * 2. 特殊 /gen/xxx ,在微服务架构、单体架构编程 都需保持不变
 *
 * @param originUrl 原始路径
 */
export const adaptationUrl = (originUrl ?: string) => {
	// 微服务架构 不做路径转换,为空不做路径转换
	const isMicro = import.meta.env.VITE_IS_MICRO;
	if (isEmpty(isMicro) || isMicro === "true") {
		return originUrl;
	}

	// 验证码服务
	if (originUrl?.startsWith("/code/")) {
		return `/admin${originUrl}`;
	}

	// 如果是代码生成服务，不做路径转换
	if (originUrl?.startsWith("/gen")) {
		return originUrl;
	}
	// 转为 /admin 路由前缀的请求
	return `/admin/${originUrl?.split("/").splice(2).join("/")}`;
};

/**
 *加密处理
 */
export function encryption(src : string, keyWord : string) {
	const key = CryptoJS.enc.Utf8.parse(keyWord);
	// 加密
	const encrypted = CryptoJS.AES.encrypt(src, key, {
		iv: key,
		mode: CryptoJS.mode.CFB,
		padding: CryptoJS.pad.NoPadding,
	});
	return encrypted.toString();
}

/**
 *加密处理
 */
export function encryptionBase64(rawStr : string) {
	let wordArray = CryptoJS.enc.Utf8.parse(rawStr);
	return CryptoJS.enc.Base64.stringify(wordArray);
}

/**
 * 获取URL参数
 * @param url 可选参数，默认使用当前页面的URL
 * @returns 包含所有参数的键值对对象
 */
export function getUrlParams(url ?: string) : Record<string, string> {
	const params : Record<string, string> = {};
	const search = url ? url.split('?')[1] : window.location.hash.split("?")[1];

	if (!search) return params;

	new URLSearchParams(search).forEach((value, key) => {
		params[key] = decodeURIComponent(value);
	});

	return params;
}

/**
 * 向下舍去
 * @param {number} value 
 * @param {number} decimals 
 * @return 
 */
export function roundDown(value : number, decimals : number) {
	return Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

//formart iso date
export function formatISODate(date : string) {
	date = date.replace(/-/g, "/")
	return format(new Date(date), 'Pp')
}

//自定义格式
export function formatDate(date : string, p : string) {
	date = date.replace(/-/g, "/")
	return format(new Date(date), p)
}

/* 电子邮箱 */
export function isEmail(value : string) {
	const reg = new RegExp('^([-_A-Za-z0-9.]+)@([_A-Za-z0-9]+\\.)+[A-Za-z0-9]{2,3}$');
	if (!reg.test(value)) {
		return false
	}
	return true
}

export function formartRose(value : any) {
	const num = Number(value)
	if (isNaN(num)) return '0.00%'

	// 添加正负号并格式化为百分比
	return `${num > 0 ? '+' : ''}${num}%`
}

// 安全处理 HTML 内容，防止 XSS 攻击
export function sanitizeHTML(html : string) {
	if (!html) return '';

	// 创建一个新的 div 元素
	const doc = document.createElement('div');

	// 设置其 HTML 内容
	doc.innerHTML = html;

	// 移除潜在的危险元素
	const scripts = doc.querySelectorAll('script, iframe, object, embed, form');
	scripts.forEach(script => script.remove());

	// 移除以 on 开头的属性（例如 onclick）
	const allElements = doc.getElementsByTagName('*');
	for (let i = 0; i < allElements.length; i++) {
		const attributes = allElements[i].attributes;
		for (let j = 0; j < attributes.length; j++) {
			const name = attributes[j].name;
			if (name.startsWith('on')) {
				allElements[i].removeAttribute(name);
			}
		}
	}

	return doc.innerHTML;
};