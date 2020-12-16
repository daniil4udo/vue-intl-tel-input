<template>
    <div>
        isRegionlessNanp – {{ dmcTel.isRegionlessNanp }}
        <B-Field
            ref="refPhoneField"
            class="iti"
            :type="validationClasses.class"
            :message="validationClasses.message"
            label="Phone Input"
            :disabled="disabled"
            expanded
        >
            <B-Dropdown
                ref="refPhoneDropdown"
                aria-role="list"
                class="iti__dropdown"
                scrollable
                :position="dmcTel.dropdownOpenDirection"
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
                        v-model="dmcTel.dropdownSearch"
                        class="iti__dropdown-input"
                        size="is-small"
                        :placeholder="dropdownPlaceholder"
                        icon-right="close-circle"
                        icon-right-clickable
                        @icon-right-click="dmcTel.dropdownSearch = ''"
                    />
                </B-Field>

                <template v-for="(c, i) in dmcTel.fileredCountriesModel">
                    <B-Dropdown-item
                        :key="`${i}-item`"
                        :value="c"
                        aria-role="listitem"
                        :class="{
                            preffered: c.preferred,
                            'is-active': dmcTel.activeCountry.iso2 === c.iso2
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
                :name="name"
                :disabled="disabled"
                :placeholder="dmcTel.parsedPlaceholder"
                expanded
                @input="onInput"
                @keypress.native="onKeyPress"
            />
        </B-Field>
        <p>dmcTel.activeCountry</p>
        <pre>{{ dmcTel.activeCountry }}</pre>
        <strong>parsedPlaceholder - {{ dmcTel.parsedPlaceholder }}</strong>
        <p>dmcTel.phoneObject</p>
        <pre>{{ dmcTel.phoneObject }}</pre>
    </div>
</template>

<script lang="ts">
    import { defineComponent, PropType, ref, Ref, computed, onMounted, SetupContext, ComponentRenderProxy } from '@vue/composition-api';
    import PhoneNumber from 'awesome-phonenumber';

    import useDropdownProps from '@/mixin/useDropdownProps';
    import useInput from '@/mixin/useInput';
    import useInputProps from '@/mixin/useInputProps';

    import { IProps, ICountry, AllowedPhoneNumberTypes } from './models';

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
            allowedPhoneTypes: {
                type: (Array as unknown) as PropType<AllowedPhoneNumberTypes>,
                default: () => [ 'mobile', 'fixed-line', 'fixed-line-or-mobile' ],
                validator: (value: string[]) => [ 'fixed-line', 'mobile', 'fixed-line-or-mobile', 'toll-free', 'premium-rate', 'shared-cost', 'voip', 'personal-number', 'pager', 'uan', 'voicemail', 'unknown' ].some(v => value.includes(v)),
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
            const refPhoneField: Ref<ComponentRenderProxy<HTMLElement>> = ref(null);
            const refPhoneDropdown: Ref<ComponentRenderProxy<HTMLElement>> = ref(null);
            const refPhoneDropdownInput: Ref<ComponentRenderProxy<HTMLElement>> = ref(null);
            const refPhoneInput: Ref<ComponentRenderProxy<HTMLElement>> = ref(null);

            /**
             * Dropdown setup
             */
            // useInput inherits countries, dropdown and input
            const dmcTel = useInput(props, ctx);

            /**
             * Computed
             */
            const isValid = computed(() => dmcTel.phone.value !== '' && dmcTel.phoneObject.value.valid && props.allowedPhoneTypes.includes(dmcTel.phoneObject.value.type));
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

                dmcTel.selectCountry(country);

                // TODO: Sanitize if number looks like Intl but we are no allowing intl
            });

            /**
             * Methods
             */
            async function initCountry() {
                // 1. if already have PHONE passed from the parent - parse it
                if (dmcTel.phone.value && dmcTel.phoneObject.value.isIntlInput) {
                    const activeCountry = new PhoneNumber(dmcTel.phone.value);

                    if (activeCountry.isValid()) {
                        // Most possible scenario tha we gonna get intl phone fro mthe parent
                        // so we'l replace it with national format instead
                        dmcTel.phone.value = activeCountry.getNumber('national');

                        // return dmcTel.selectCountry(activeCountry.getRegionCode());
                        return activeCountry.getRegionCode();
                    }
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
                return props.preferredCountries[0] || dmcTel.sortedCountries.value[0].iso2;
            }

            async function onSelect(c: ICountry) {
                // Move countries, that has been selected to the top of the list
                // Like a recently chosen
                if (!dmcTel.preferredISOs.value.includes(c.iso2)) {
                    dmcTel.preferredISOs.value.push(c.iso2);
                }

                const country = dmcTel.selectCountry(c);

                await ctx.root.$nextTick(() => {
                    // emit country change event for the actual country select
                    ctx.emit('country-changed', country);
                    ctx.emit('input', dmcTel.phoneText.value, dmcTel.phoneObject.value);

                    focusInput();
                });

                return country;
            }
            function onKeyPress($event: KeyboardEvent) {
                const { key } = $event;
                const { value: prevValue } = $event.target as HTMLInputElement;
                const newValue = `${prevValue}${key}`;

                const isValidCharactersOnly = props.validCharactersOnly && !dmcTel.testCharacters(key);
                const isCustomValidate = props.customRegExp && !dmcTel.testCustomValidate(key);
                const intlCheck = !dmcTel.isAllowedInternationalInput.value && dmcTel.isInternationalInput(newValue);

                if (isValidCharactersOnly || isCustomValidate || intlCheck) {
                    $event.preventDefault();
                }
            }
            function onInput(e) {
                if (props.validCharactersOnly && !dmcTel.testCharacters()) {
                    return;
                }
                if (props.customRegExp && !dmcTel.testCustomValidate()) {
                    return;
                }

                // TODO: Set custm HTML5 validation error msg
                // refPhoneInput.value.$refs.input.setCustomValidity(dmcTel.phoneObject.value.valid ? '' : props.invalidMsg);

                // Returns response.number to assign it to v-model (if being used)
                // Returns full response for cases @input is used
                // and parent wants to return the whole response.
                ctx.root.$nextTick(() => {
                    ctx.emit('input', dmcTel.phoneText.value, dmcTel.phoneObject.value);
                });

                // TODO: Bind native event
                // Keep the current cursor position just in case the input reformatted
                // and it gets moved to the last character.
                // if ($event && $event.target) {
                //     dmcTel.cursorPosition.value = $event.target.selectionStart;
                // }
            }
            function onActiveChange(state, prevModel) {
                if (state === true) {
                    // dmcTel.activeCountry.model = '';
                    dmcTel.dropdownSearch.value = '';
                    focusDropdownInput();

                    if (refPhoneDropdown.value.$el instanceof HTMLElement) {
                        dmcTel.setDropdownPosition(refPhoneDropdown.value.$el);
                    }
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
                    refPhoneInput.value.$refs.input.select();
                });
            }

            return {
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

                // Methods
                onActiveChange,
                onSelect,
                onKeyPress,
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
