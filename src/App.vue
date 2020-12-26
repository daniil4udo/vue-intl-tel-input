<template>
    <div id="app" class="container">
        App - {{ phone }}
        <DmcTelInput
            v-model="phone"
            :disabled-dropdown="false"
            :enabled-country-name="false"
            :mode="'national'"
            :emoji-flags="false"
            :preferred-countries="['AE']"
        />
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    import DmcTelInput from '@/components/DmcTelInput.vue';
    // import isEmojiUnicodeSupportedByBrowser from '@/utils/emoji/support/';

    @Component({
        name: 'App',
        components: {
            DmcTelInput,
        },
    })
    export default class Input extends Vue {
        phone = '+380' as string

        mounted() {
            // console.log(isEmojiUnicodeSupportedByBrowser('⚠️', 'flag'));
        }
    }
</script>

<style lang="scss">
    //
    @import '~@/assets/scss/styles.scss';
</style>
