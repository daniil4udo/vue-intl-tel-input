<template>
    <div id="app" class="container">
        <DmcTelInput
            v-model="phone"
            :enabled-country-name="false"
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
        phone = '+3800973008444' as string

        mounted() {
            // console.log(isEmojiUnicodeSupportedByBrowser('⚠️', 'flag'));
        }
    }
</script>

<style lang="scss">
    //
</style>
