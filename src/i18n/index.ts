import { createI18n } from 'vue-i18n';
// import { App } from 'vue';
import zh from './zh';
import en from './en';
import ja from './ja';
import ko from './ko';

const storedLang = uni.getStorageSync('language');
const langDefault = storedLang || uni.getLocale() || 'en'; // 优先读取本地存储


console.log('langDefault', langDefault)

// 语言库
const messages = {
  'en': en,
  'zh-Hans': zh,
  'ja': ja,
  'ko': ko
}

const i18n = createI18n({
	legacy: false,
  globalInjection: true, // 允许模板中使用$t
	locale: langDefault,		//默认显示的语言 
	messages
})

export { i18n };