import VueCompositionApi from '@vue/composition-api'; // <-- Make the import
import Vue from 'vue';

import App from './App.vue';

Vue.config.productionTip = false;

Vue.use(VueCompositionApi); // <-- Tell Vue to use it

new Vue({
    render: h => h(App),
}).$mount('#app');
