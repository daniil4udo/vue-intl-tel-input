<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <example-component
            title="Example component"
            active
            :todos="todos"
            :meta="meta"
        />
    </div>
</template>

<script lang="ts">
    import { defineComponent, ref } from '@vue/composition-api';

    import { ITodo, IMeta } from '@/components/models';

    import ExampleComponent from './components/CompositionComponent.vue';

    export default defineComponent({
        name: 'App',
        components: {
            ExampleComponent,
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
            return { todos, meta };
        },
    });
</script>

<style lang="scss">
#app {
    margin-top: 60px;
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
    text-align: center;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
</style>
