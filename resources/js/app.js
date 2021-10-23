require('./bootstrap');

import { createApp, h } from 'vue';
import { createInertiaApp } from '@inertiajs/inertia-vue3';
import { InertiaProgress } from '@inertiajs/progress';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'ScolCours';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => require(`./Pages/${name}.vue`),
    setup({ el, app, props, plugin }) {
        const vueApp = createApp(
            { render: () => h(app, props) })
            .use(plugin)
            .mixin({ methods: { route } })

        vueApp.directive('highlight', {
            beforeMount(el, binding, vnode) {
                el.style.background = binding.value
            }
        })

        return vueApp.mount(el)
       },
});

InertiaProgress.init({ color: '#4B5563' });
