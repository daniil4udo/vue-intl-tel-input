<template>
    <div id="app" class="container">
        App - {{ phone }}
        <DmcTelInput
            v-model="phone"
            :disabled-dropdown="false"

            mode="national"
            :emoji-flags="true"
            :autocomplete="'off'"
        />
    </div>
</template>

<script lang="ts">
    import DmcTelInput from '@/components/DmcTelInput.vue';
    import { Component, Vue } from '@/utils/decorators';

    // import isEmojiUnicodeSupportedByBrowser from '@/utils/emoji/support/';

    @Component({
        name: 'App',
        components: {
            DmcTelInput,
        },
    })
    export default class Input extends Vue {
        phone = '+'
    }
</script>

<style lang="scss">
    //
    @import '~@/assets/scss/styles.scss';
</style>
