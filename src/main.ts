import { createSSRApp } from "vue";
import { i18n } from '@/i18n';

import App from "./App.vue";
import '@/styles/index.css'

import Vant from 'vant';
import 'vant/lib/index.css';
import { Icon } from 'vant'

// 系统所需插件
import plugins from './plugins'

export function createApp() {
  const app = createSSRApp(App);

  app.use(i18n)
  app.use(Vant)
  app.use(Icon)
  app.use(plugins)

  return {
    app,
  };
}
