<template>
    <div id="app" class="container">
        App - {{ phone }}
        <DmcTelInput
            v-model="phone"
            :disabled-dropdown="false"
            mode="national"
            :emoji-flags="true"
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
        phone = ''
    }
</script>

<style lang="scss">
    //
    @import '~@/assets/scss/styles.scss';
</style>
