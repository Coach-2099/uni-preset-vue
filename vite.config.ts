import { resolve } from 'node:path';
import process from 'node:process';
import { ConfigEnv, defineConfig, loadEnv } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import tailwindcss from '@tailwindcss/postcss' // 修改导入来源


const postcssPlugin = [
  autoprefixer(),
  // @ts-ignore 忽略类型检查，因为当前类型定义可能不支持 config 属性
  tailwindcss({ config: './tailwind.config.js' }) // 添加配置文件路径
]

const viteConfig = defineConfig(({ mode }: ConfigEnv) => {
    const env = loadEnv(mode, process.cwd()); // 修改这里，直接使用 mode
    console.log('当前代理配置:', {
        运行模式: mode,
        目标地址: env.VITE_APP_BASE_URL,
        代理规则: {
            '/api': `-> ${env.VITE_APP_BASE_URL}`
        }
    });

    return {
        plugins: [uni()],
        css: {
            postcss: {
                plugins: postcssPlugin.filter(plugin => plugin) as any[] // 过滤掉可能的 void 值
            }
        },
        server: {
            port: 8088,
            // hmr: true, // 启用热更新
            hmr: { overlay: false }, // 启用热更新
            proxy: {
                '/api': {
                    target: env.VITE_APP_BASE_URL, // 目标服务器地址
                    changeOrigin: true, // 是否修改请求头中的 Origin 字段
                    rewrite: (path) => path.replace(/^\/api/, ''),
                },
            }
        },
        devSever: {
            hmr: {
                overlay: false
            },
        },
		esbuild: {
			drop: ["console","debugger"]
		}
    };
});


export default viteConfig
