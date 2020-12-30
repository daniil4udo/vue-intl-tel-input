<template>
    <div id="app" class="container">
        <VueIntlTelInput
            v-model="phone"
            :disabled-dropdown="false"
            mode="national"
            :is-expanded="true"
            :emoji-flags="false"
            :maxlength="22"
            :autocomplete="'off'"
            :preferred-countries="['AE']"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    import VueIntlTelInput from '@/components/vue-intl-tel-input.vue';

    @Component({
        name: 'App',
        components: {
            VueIntlTelInput,
        },
    })
    export default class Input extends Vue {
        phone = '+380(9asd7)3008444'
    }
</script>

<style lang="scss">
    @import '~bulma/sass/base/minireset'; // <- for sure will be available
    @import '~@/assets/scss/styles.scss';
    @import '~bulma/sass/base/generic'; // <- can be removed
</style>
