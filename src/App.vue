<template>
    <div id="app" class="container">
        <example-component
            title="Example component"
            active
            :todos="todos"
            :meta="meta"
        />
        <DmcTelInput
            v-model="phone"
            :enabled-country-name="false"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api';

    import ExampleComponent from '@/components/CompositionComponent.vue';
    import DmcTelInput from '@/components/DmcTelInput';
    import { ITodo, IMeta } from '@/components/models';

    export default defineComponent({
        name: 'App',
        components: {
            ExampleComponent,
            DmcTelInput,
        },
        setup() {
            const todos = ref<ITodo[]>([
                {
                    id: 1,
                    content: 'ct1',
                },
                {
                    id: 2,
                    content: 'ct2',
                },
                {
                    id: 3,
                    content: 'ct3',
                },
                {
                    id: 4,
                    content: 'ct4',
                },
                {
                    id: 5,
                    content: 'ct5',
                },
            ]);
            const meta = ref<IMeta>({
                totalCount: 1200,
            });

            const phone = ref('');

            return { todos, meta, phone };
        },
    });
</script>

<style lang="scss">
    //
</style>
