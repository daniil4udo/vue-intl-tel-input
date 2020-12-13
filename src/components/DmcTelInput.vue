<template>
    <div>
        dropdown.selectedCountry {{ dropdown.selectedCountry }}
        input.phoneText {{ input.phoneText }}
        <!-- <pre>{{ activeCountry }}</pre> -->
        <strong>parsedPlaceholder - {{ input.parsedPlaceholder }}</strong>
        <pre>{{ input.phoneObject }}</pre>
        <B-Field
            ref="dmcPhoneField"
            label="Phone Input"
            :disabled="disabled"
            expanded
        >
            <B-Autocomplete
                ref="dmcPhoneDropdown"
                v-model="dropdown.selectedCountry"
                :data="filteredDataObj"
                :tabindex="dropdownTabIndex"
                :placeholder="dropdownPlaceholder"
                keep-first
                :open-on-focus="true"
                clearable
                :disabled="disabled || disabledDialCode"
                :custom-formatter="countries.getCountryFormat"
                @select="onSelect"
            >
                <template slot-scope="props">
                    <div class="media">
                        <div v-if="!disableFlags" class="flag">
                            <span v-text="props.option.emoji" />
                        </div>
                        <div class="country">
                            <span v-if="!disableCountryCode" class="dial-code">
                                +{{ props.option.dialCode }}
                            </span>
                            <small v-if="!disableCountryName" v-html="props.option.name" />
                        </div>
                    </div>
                </template>
            </B-Autocomplete>
            <B-Input
                ref="dmcPhoneInput"
                v-model="input.proxyPhone"
                :tabindex="inputTabIndex"
                v-bind="$attrs"
                :disabled="disabled"
                :placeholder="input.parsedPlaceholder"
                maxlength="30"
                expanded
                @input="onInput"
            />
        </B-Field>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, reactive, computed, watch } from '@vue/composition-api';
    import isNil from 'lodash/isNil';
    import toLower from 'lodash/toLower';

    import { ICountry } from '@/assets/all-countries';
    import useCountries from '@/mixin/useCountries';
    import useDropdow from '@/mixin/useDropdown';
    import useDropdownProps from '@/mixin/useDropdownProps';
    import useInput from '@/mixin/useInput';
    import useInputProps from '@/mixin/useInputProps';

    export default defineComponent({
        props: {
            ...useDropdownProps,
            ...useInputProps,
            value: {
                type: (String as unknown) as PropType<string>,
                default: () => '',
            },
            mode: {
                type: (String as unknown) as PropType<string>,
                validator: prop => [ 'international', 'national', '' ].includes(String(prop)),
                default: () => '',
            },
            required: {
                type: (Boolean as unknown) as PropType<boolean>,
                default: () => false,
            },
            name: {
                type: (String as unknown) as PropType<string>,
                default: () => 'dmc-phone-input',
            },
            disabled: {
                type: (Boolean as unknown) as PropType<boolean>,
                default: () => false,
            },
        },
        setup(props, ctx) {
            /**
             * Data
             */
            const activeCountry: Partial<ICountry> = reactive({ iso2: props.defaultCountry });

            /**
             * Tempalte refs
             */
            const dmcPhoneField = ref(null);
            const dmcPhoneDropdown = ref(null);
            const dmcPhoneInput = ref(null);

            /**
             * Dropdown setup
             */
            const countries = useCountries(props);
            const dropdown = useDropdow(props);
            const input = useInput(props, ctx, activeCountry as ICountry);

            /**
             * Computed
             */
            const filteredDataObj = computed(() => countries.sortedCountries.value.filter(option => {
                const hasVal = str => String.prototype.includes.call(str, toLower(dropdown.selectedCountry.value));

                return hasVal(option.name) || hasVal(option.dialCode);
            }));

            /**
             * Watchers
             */
            watch(activeCountry, (value: ICountry) => {
                dropdown.selectedCountry.value = countries.getCountryFormat(value);

                ctx.root.$nextTick(() => {
                    if (!isNil(value)) {
                        // emit country change event for the actual country select
                        ctx.emit('country-changed', value);

                        focus();

                        if (input.proxyPhone.value !== '') {
                            select();
                        }
                    }
                });
            });

            /**
             * Methods
             */
            function onSelect(option: Partial<ICountry>) {
                Object.assign(activeCountry, option);

                if (!option?.preferred) {
                    activeCountry.preferred = false;
                }

                return activeCountry;
            }
            function onInput(e) {
                if (props.validCharactersOnly && !input.testCharacters()) {
                    return;
                }
                if (props.customValidate && !input.testCustomValidate()) {
                    return;
                }

                // Set custm HTML5 validation error msg
                // dmcPhoneInput.value.$refs.input.setCustomValidity(input.phoneObject.value.valid ? '' : this.invalidMsg);

                // Returns response.number to assign it to v-model (if being used)
                // Returns full response for cases @input is used
                // and parent wants to return the whole response.
                ctx.emit('input', input.phoneText.value, input.phoneObject.value);

                // Keep the current cursor position just in case the input reformatted
                // and it gets moved to the last character.
                if (e && e.target) {
                    input.cursorPosition.value = e.target.selectionStart;
                }
            }
            function focus() {
                dmcPhoneInput.value.focus();
            }
            function select() {
                // Accesing Buefy's input ref
                dmcPhoneInput.value.$refs.input.select();
            }
            async function fetchCountryCode() {
                try {
                    const response = await fetch('https://ip2c.org/s');
                    const responseText = await response.text();
                    const result = (responseText || '').toString();
                    if (result && result[0] === '1') return result.substr(2, 2);
                }
                catch (err) {
                    return new Error('Error while fetching country code');
                }
            }

            return {
                // Setup mixins
                countries,
                dropdown,
                input,

                // Data
                activeCountry,

                // Tempalte refs
                dmcPhoneField,
                dmcPhoneDropdown,
                dmcPhoneInput,

                // Computed
                filteredDataObj,

                // Methods
                onSelect,
                onInput,
                fetchCountryCode,
            };
        },
    });
</script>

<style lang="scss">
@import '~@/assets/styles.scss';

/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    appearance: none;
    margin: 0;
}

/* Firefox */
input[type='number'] {
    appearance: textfield;
}
</style>
