<template>
    <div>
        dropdown.selectedCountry {{ dropdown.selectedCountry }}
        input.phoneText {{ input.phoneText }}
        <pre>{{ activeCountry }}</pre>
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
                placeholder="🇦🇪 +971"
                keep-first
                :open-on-focus="true"
                clearable
                :disabled="disabled || disabledDialCode"
                :custom-formatter="dropdown.getCountryNameTitle"
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
                v-model="input.phone"
                :tabindex="inputTabIndex"
                v-bind="$attrs"
                :disabled="disabled"
                placeholder="052 204 8185"
                maxlength="30"
                expanded
                @input="onInput"
            />
        </B-Field>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, reactive, computed } from '@vue/composition-api';
    import toLower from 'lodash/toLower';

    import { ICountry } from '@/assets/all-countries';
    import CheckRadioMixin from '@/mixin/dmcWidgetMixin';
    import useDropdow from '@/mixin/useDropdown';
    import useDropdownProps from '@/mixin/useDropdownProps';
    import useInput from '@/mixin/useInput';
    import useInputProps from '@/mixin/useInputProps';

    export default defineComponent({
        mixins: [
            CheckRadioMixin,
            // Props
        ],
        props: {
            ...useDropdownProps,
            ...useInputProps,
            value: {
                type: (String as unknown) as PropType<string>,
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
            const activeCountry: Partial<ICountry> = reactive({ iso2: '' });

            /**
             * Tempalte refs
             */
            const dmcPhoneField = ref(null);
            const dmcPhoneDropdown = ref(null);
            const dmcPhoneInput = ref(null);

            /**
             * Dropdown setup
             */
            const dropdown = useDropdow(props);
            const input = useInput(props, ctx, activeCountry as ICountry);

            /**
             * Computed
             */
            const filteredDataObj = computed(() => dropdown.sortedCountries.value.filter(option => {
                const hasVal = str => String.prototype.includes.call(str, toLower(dropdown.selectedCountry.value));

                return hasVal(option.name) || hasVal(option.dialCode);
            }));

            /**
             * Methods
             */
            function onSelect(option: Partial<ICountry>) {
                Object.assign(activeCountry, option);

                if (!option?.preferred) {
                    activeCountry.preferred = false;
                }
                ctx.root.$nextTick(() => {
                    dmcPhoneInput.value.focus();
                });

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
                // dmcPhoneInput.setCustomValidity(input.input.phoneObject.value.valid ? '' : this.invalidMsg);

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

            return {
                // Setup mixins
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
            };
        },
    });
</script>

<style lang="scss">
    @import '~@/assets/styles.scss';
</style>
