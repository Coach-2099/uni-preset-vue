import { createI18n } from 'vue-i18n';
// import { App } from 'vue';
import zh from './zh';
import en from './en';

const langDefault = uni.getLocale()

console.log('langDefault', langDefault)

// 语言库
const messages = {
  'en': en,
  'zh-Hans': zh
}

const i18n = createI18n({
	locale: langDefault || 'en-US',		//默认显示的语言 
	messages
})

export { i18n };