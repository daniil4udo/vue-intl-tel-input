<template>
    <div>
        <B-Field
            ref="refPhoneField"
            class="iti"
            :type="validationClasses.class"
            :message="validationClasses.message"
            label="Phone Input"
            :disabled="disabled"
            expanded
        >
            <!-- <B-Autocomplete
                ref="refPhoneDropdown"
                v-model="dmcTel.activeCountry.model"
                :data="fileredCountriesModel"
                :tabindex="dropdownTabIndex"
                :placeholder="dropdownPlaceholder"
                keep-first
                :open-on-focus="true"
                clearable
                :disabled="disabled || disabledDropdown"
                :custom-formatter="dmcTel.getCountryFormat"
                @select="onSelect"
            >
                <template slot-scope="props">
                    <div class="media">
                        <template v-if="!hideFlags">
                            <div v-if="emojiFlags" class="flag">
                                <span v-text="props.option.emoji" />
                            </div>
                            <div v-else :class="`iti__flag iti__${props.option.iso2.toLowerCase()}`" />
                        </template>
                        <div class="country">
                            <span v-if="!hideCountryCode" class="dial-code">
                                +{{ props.option.dialCode }}
                            </span>
                            <small v-if="!hideCountryName" v-html="props.option.name" />
                        </div>
                    </div>
                </template>
            </B-Autocomplete> -->
            <B-Dropdown
                ref="refPhoneDropdown"
                aria-role="list"
                class="iti__dropdown"
                scrollable
                :max-height="400"
                :disabled="disabled || disabledDropdown || dmcTel.isFetchCountryCode"
                :tabindex="dropdownTabIndex"
                @input="onSelect"
                @active-change="onActiveChange"
            >
                <b-button
                    slot="trigger"
                    slot-scope="{ active }"
                    :loading="dmcTel.isFetchCountryCode"
                    :class="[
                        'button is-outlined',
                        'iti__button',
                        validationClasses.class
                    ]"
                    type="button"
                >
                    <template v-if="!dmcTel.isFetchCountryCode">
                        <template v-if="!dmcTel.getBoolean(hideFlags, 'button')">
                            <div
                                v-if="dmcTel.getBoolean(emojiFlags, 'button')"
                                class="iti__eflag"
                            >
                                <span v-text="dmcTel.activeCountry.emoji" />
                            </div>
                            <div
                                v-else
                                :class="`iti__flag flag-${dmcTel.activeCountry.iso2.toLowerCase()}`"
                            />
                        </template>
                        <div v-if="!dmcTel.getBoolean(hideCountryCode, 'button')" class="iti__country">
                            <span
                                class="iti__country-dial"
                                v-text="`+${dmcTel.activeCountry.dialCode}`"
                            />
                        </div>
                    </template>
                    <small
                        :class="[
                            'iti__arrow',
                            active ? 'is-open' : 'is-closed'
                        ]"
                        v-text="'↑'"
                    />
                </b-button>

                <B-Field class="dropdown-item">
                    <B-Input
                        ref="refPhoneDropdownInput"
                        v-model="dropDownInputModel"
                        class="iti__dropdown-input"
                        size="is-small"
                        :placeholder="dropdownPlaceholder"
                        icon-right="close-circle"
                        icon-right-clickable
                        @icon-right-click="dropDownInputModel = ''"
                    />
                </B-Field>

                <template v-for="(c, i) in fileredCountriesModel">
                    <B-Dropdown-item
                        :key="`${i}-item`"
                        :value="c"
                        aria-role="listitem"
                        :class="{
                            preffered: c.preferred
                        }"
                    >
                        <div class="media">
                            <template v-if="!dmcTel.getBoolean(hideFlags, 'dropdown')">
                                <div
                                    v-if="dmcTel.getBoolean(emojiFlags, 'dropdown')"
                                    class="iti__eflag"
                                >
                                    <span v-text="c.emoji" />
                                </div>
                                <div
                                    v-else
                                    :class="`iti__flag flag-${c.iso2.toLowerCase()}`"
                                />
                            </template>
                            <div class="iti__country">
                                <span
                                    v-if="!dmcTel.getBoolean(hideCountryCode, 'dropdown')"
                                    class="iti__country-dial"
                                    v-text="`+${c.dialCode}`"
                                />
                                <small v-if="!dmcTel.getBoolean(hideCountryName, 'dropdown')" v-html="c.name" />
                            </div>
                        </div>
                    </B-Dropdown-item>
                    <hr
                        v-if="c.lastPreffered"
                        :key="`${i}-line`"
                        class="dropdown-divider"
                    >
                </template>
            </B-Dropdown>
            <B-Input
                ref="refPhoneInput"
                v-model="dmcTel.phone"
                class="iti__input"
                :tabindex="inputTabIndex"
                v-bind="$attrs"
                type="tel"
                :disabled="disabled"
                :placeholder="dmcTel.parsedPlaceholder"
                expanded
                @input="onInput"
            />
        </B-Field>
        dmcTel.selectedCountry {{ dmcTel.selectedCountry }}
        dmcTel.phoneText {{ dmcTel.phoneText }}
        <pre>{{ dmcTel.activeCountry }}</pre>
        <strong>parsedPlaceholder - {{ dmcTel.parsedPlaceholder }}</strong>
        <pre>{{ dmcTel.phoneObject }}</pre>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, computed, onMounted, SetupContext } from '@vue/composition-api';
    import PhoneNumber from 'awesome-phonenumber';
    import toLower from 'lodash/toLower';

    // import useCountries from '@/mixin/useCountries';
    // import useDropdow from '@/mixin/useDropdown';
    import useDropdownProps from '@/mixin/useDropdownProps';
    import useInput from '@/mixin/useInput';
    import useInputProps from '@/mixin/useInputProps';

    import { IProps, ICountry } from './models';

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
                default: () => 'national',
            },
            required: {
                type: (Boolean as unknown) as PropType<boolean>,
                default: () => false,
            },
            name: {
                type: (String as unknown) as PropType<string>,
                default: () => 'dmc-phone-input',
            },
            invalidMsg: {
                type: (String as unknown) as PropType<string>,
                default: () => 'Hell, no!',
            },
            disabled: {
                type: (Boolean as unknown) as PropType<boolean>,
                default: () => false,
            },
        },
        setup(props: IProps, ctx: SetupContext) {
            /**
             * Tempalte refs
             */
            const refPhoneField = ref(null);
            const refPhoneDropdown = ref(null);
            const refPhoneDropdownInput = ref(null);
            const refPhoneInput = ref(null);

            /**
             * Dropdown setup
             */
            // useInput inherits countries, dropdown and input
            const dropDownInputModel = ref('');
            const dmcTel = useInput(props, ctx);

            /**
             * Computed
             */
            const fileredCountriesModel = computed(() => dmcTel.sortedCountries.value.filter(option => {
                const hasVal = str => String.prototype.includes.call(toLower(str), toLower(dropDownInputModel.value));

                return hasVal(option.name) || hasVal(option.dialCode);
            }));
            const isValid = computed(() => dmcTel.phoneObject.value.valid && !!dmcTel.activeCountry.model);
            const validationClasses = computed(() => {
                if (dmcTel.phone.value === '') {
                    return {
                        class: '',
                        message: '',
                    };
                }

                return isValid.value
                    ? { class: 'is-success', message: '' }
                    : { class: 'is-danger', message: `Invalid phone number for ${dmcTel.activeCountry.enname}` };
            });

            /**
             * Lifecycle
             */
            onMounted(async () => {
                // Fetch only if explicitly said it &
                // if we have no value passign from the parent
                const country = await initCountry();

                return dmcTel.selectCountry(country);
            });

            /**
             * Methods
             */
            async function initCountry() {
                // 1. if already have PHONE passed from the parent - parse it
                if (dmcTel.phone.value && dmcTel.isInternationalInput(dmcTel.phone.value)) {
                    const activeCountry = new PhoneNumber(dmcTel.phone.value);

                    // Most possible scenario tha we gonna get intl phone fro mthe parent
                    // so we'l replace it with national format instead
                    dmcTel.phone.value = activeCountry.getNumber('national');

                    // return dmcTel.selectCountry(activeCountry.getRegionCode());
                    return activeCountry.getRegionCode();
                }
                // 2. if phone is empty, but have DEFAULT COUNTRY
                if (props.defaultCountry) {
                    return props.defaultCountry;
                }
                // 3. if don't have DEFAULT COUNTRY but fetch country is allowed - FETCH
                if (props.fetchCountry) {
                    const ISO2 = await dmcTel.fetchCountryCode();

                    return ISO2;
                }
                // 4. if don't have get fallback country from preffered or just a first option
                const fallbackCountry = props.preferredCountries[0] || dmcTel.sortedCountries.value[0];

                // return dmcTel.selectCountry(fallbackCountry);
                return fallbackCountry;
            }

            function onSelect(country: ICountry | string) {
                const parsedCountry = dmcTel.selectCountry(country);

                // Move countries, that has been selected to the top of the list
                // Like a recently chosen
                dmcTel.preferredISOs.value.push(parsedCountry.iso2);

                ctx.root.$nextTick(() => {
                    // emit country change event for the actual country select
                    ctx.emit('country-changed', parsedCountry);
                    ctx.emit('input', dmcTel.phoneText.value, dmcTel.phoneObject.value);

                    focusInput();
                });

                return parsedCountry;
            }
            function onInput(e, $event = window.event) {
                if (props.validCharactersOnly && !dmcTel.testCharacters()) {
                    return;
                }
                if (props.customRegExp && !dmcTel.testCustomValidate()) {
                    return;
                }

                // Set custm HTML5 validation error msg
                // refPhoneInput.value.$refs.input.setCustomValidity(dmcTel.phoneObject.value.valid ? '' : props.invalidMsg);

                // Returns response.number to assign it to v-model (if being used)
                // Returns full response for cases @input is used
                // and parent wants to return the whole response.
                ctx.root.$nextTick(() => {
                    ctx.emit('input', dmcTel.phoneText.value, dmcTel.phoneObject.value);
                });

                // Keep the current cursor position just in case the input reformatted
                // and it gets moved to the last character.
                if (e && e.target) {
                    dmcTel.cursorPosition.value = e.target.selectionStart;
                }
            }
            function onActiveChange(state) {
                if (state === true) {
                    // dmcTel.activeCountry.model = '';
                    dropDownInputModel.value = '';
                    focusDropdownInput();
                }
            }

            function focusInput() {
                ctx.root.$nextTick(() => {
                    refPhoneInput.value.focus();
                });
            }
            function focusDropdownInput() {
                ctx.root.$nextTick(() => {
                    refPhoneDropdownInput.value.focus();
                });
            }
            function focusDropdown() {
                ctx.root.$nextTick(() => {
                    refPhoneDropdown.value.focus();
                });
            }
            function selectInput() {
                ctx.root.$nextTick(() => {
                    // Accesing Buefy's input ref
                    refPhoneInput.value.$refs.dmcTel.select();
                });
            }

            return {
                dropDownInputModel,
                // Setup mixins
                dmcTel,

                // Tempalte refs
                refPhoneField,
                refPhoneDropdown,
                refPhoneDropdownInput,
                refPhoneInput,

                // Computed
                isValid,
                validationClasses,
                fileredCountriesModel,

                // Methods
                onActiveChange,
                onSelect,
                onInput,
                focusDropdown,
                focusDropdownInput,
                focusInput,
                selectInput,
            };
        },
    });
</script>

<style lang="scss">
    @import '~@/assets/scss/styles.scss';

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
