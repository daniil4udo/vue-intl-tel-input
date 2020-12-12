export default {
    props: {
        value: [ String, Number, Boolean, Function, Object, Array ],
    },
    data() {
        return {
            proxyValue: this.value,
        };
    },
    computed: {
        computedValue: {
            get() {
                return this.proxyValue;
            },
            set(value) {
                this.proxyValue = value;
                this.$emit('input', value);
            },
        },
    },
    watch: {
        /**
        * When v-model change, set internal value.
        */
        value(value) {
            this.proxyValue = value;
        },
    },
    methods: {
        focus() {
            // MacOS FireFox and Safari do not focus when clicked
            this.$refs.dmcPhoneInput.focus();
        },
    },
};
