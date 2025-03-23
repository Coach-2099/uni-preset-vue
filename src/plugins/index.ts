import { isFunction } from '@vue/shared'
import { type App } from 'vue'

const modules = import.meta.glob('./modules/**/*.ts', { eager: true })

export default {
    install: (app: App) => {
        Object.values(modules).forEach((module) => {
            const fun = (module as { default: unknown }).default
            if (isFunction(fun)) {
                fun(app)
            }
        })
    }
}
