<template>
    <div id="app" class="container">
        <VueIntlTelInput
            v-model="phone"
            :emoji-flags="{ button: false, dropdown: true, }"
            :dropdown-id="null"
            :dropdown-tab-index="0"
            :dropdown-placeholder="'Search by country name, code or ISO'"
            :dropdown-height="500"
            :dropdown-triggers="[ 'click' ]"
            :hide-country-code="false"
            :hide-country-name="false"
            :hide-flags="false"
            :disabled-dropdown="false"

            :auto-country="true"

            :default-country="'AE'"
            :ignored-countries="['gb']"
            :preferred-countries="p"

            :autocomplete="'tel'"
            :input-id="null"
            :input-tab-index="1"
            :custom-regexp="null"
            :valid-characters-only="true"
            :input-placeholder="'5x xxx xxxx'"
            :placeholder-number-type="'mobile'"
            :dynamic-placeholder="true"
            :field-id="'vue-tel-input'"
            :mode="'national'"
            :automatic-formatting="true"
            :allowed-phone-types="[ 'mobile', 'fixed-line', 'fixed-line-or-mobile' ]"
            required
            :name="'vue-intl-tel-input'"
            :label="'International Phone Input'"
            :disabled="false"
            is-expanded
            :error-animation="'fade'"
        />

        <button @click="onClick">
            Click
        </button>
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
        phone = '+380(9asd7)3008444';
        p = [ 'ua' ];

        onClick() {
            this.p = [ 'us' ];
        }
    }
</script>

<style lang="scss">
    @import '~bulma/sass/base/minireset'; // <- for sure will be available
    @import '~@/assets/scss/styles.scss';
    @import '~bulma/sass/base/generic'; // <- can be removed
</style>
