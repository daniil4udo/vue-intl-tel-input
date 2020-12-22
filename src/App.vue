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

    @Component({
        name: 'App',
        components: {
            DmcTelInput,
        },
    })
    export default class Input extends Vue {
        phone = '' as string
    }
</script>

<style lang="scss">
    //
</style>
