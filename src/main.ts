
import { createSSRApp } from "vue";
import { i18n } from '@/i18n';

import App from "./App.vue";
import '@/styles/index.css'

import Vant from 'vant';
import 'vant/lib/index.css';
import { Icon } from 'vant'

// 系统所需插件
import plugins from './plugins'

// 进行socket连接
import { useUserStore } from '@/stores/user';

// vconsole
// import Vconsole from 'vconsole'
// let vConsole = new Vconsole();
// export default vConsole


export function createApp() {
  const app = createSSRApp(App);

  app.use(i18n as any)
  app.use(Vant)
  app.use(Icon)
  app.use(plugins)


  // 页面加载时自动初始化WebSocket
  const userStore = useUserStore();
  userStore.initSocket();
  console.log('加载socket')
  return {
    app,
  };
}
