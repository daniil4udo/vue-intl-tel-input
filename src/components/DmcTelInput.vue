<template>
    <div>
        formattedPhone - {{ formattedPhone }}
        <B-Field
            ref="refPhoneField"
            :class="[
                'iti',
                isAnyMobile && 'iti-mobile'
            ]"
            :type="valdationClass"
            :message="validationMessage"
            :label="label"
            :disabled="disabled"
            expanded
        >
            <B-Dropdown
                ref="refPhoneDropdown"
                aria-role="list"
                class="iti__dropdown"
                scrollable
                :position="dropdownOpenDirection"
                :max-height="400"
                :disabled="disabled || disabledDropdown || (!isMounted || isFetchingCode)"
                :tabindex="dropdownTabIndex"
                @input="onSelect"
                @active-change="onActiveChange"
            >
                <B-Button
                    slot="trigger"
                    slot-scope="{ active }"
                    :loading="!isMounted || isFetchingCode"
                    :class="[
                        'button is-outlined',
                        'iti__button',
                        valdationClass
                    ]"
                    type="button"
                >
                    <template v-if="isMounted && !isFetchingCode">
                        <template v-if="!getBoolean(hideFlags, 'button')">
                            <div
                                v-if="getBoolean(emojiFlags, 'button') && activeCountry.emoji"
                                class="iti__eflag"
                            >
                                <span v-text="activeCountry.emoji.flag" />
                            </div>
                            <div
                                v-else
                                :class="`iti__flag flag-${activeCountry.iso2.toLowerCase()}`"
                            />
                        </template>
                        <div v-if="!getBoolean(hideCountryCode, 'button')" class="iti__country">
                            <span
                                class="iti__country-dial"
                                v-text="`+${activeCountry.dialCode}`"
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
                </B-Button>

                <B-Field class="dropdown-item">
                    <div class="control has-icons-right">
                        <input
                            ref="refPhoneDropdownInput"
                            v-model="dropdownSearch"
                            class="input is-small iti__dropdown-input"
                            :placeholder="dropdownPlaceholder"
                            type="text"
                        >
                        <!-- TODO: add some svg to clear input -->
                    </div>
                </B-Field>

                <template v-for="(c, i) in fileredCountriesModel">
                    <B-Dropdown-item
                        :key="`${i}-item`"
                        :value="c"
                        aria-role="listitem"
                        :class="{
                            preffered: c.preferred,
                            'is-active': activeCountry.iso2 === c.iso2
                        }"
                        :data-iso="c.iso2"
                        :data-dial-code="c.dialCode"
                    >
                        <div class="media">
                            <template v-if="!getBoolean(hideFlags, 'dropdown')">
                                <div
                                    v-if="getBoolean(emojiFlags, 'dropdown') && c.emoji"
                                    class="iti__eflag--dropdown"
                                >
                                    <span v-text="c.emoji.flag" />
                                </div>
                                <div
                                    v-else
                                    :class="`iti__flag flag-${c.iso2.toLowerCase()}`"
                                />
                            </template>
                            <div class="iti__country">
                                <span
                                    v-if="!getBoolean(hideCountryCode, 'dropdown') && c.dialCode"
                                    class="iti__country-dial"
                                    v-text="`+${c.dialCode}`"
                                />
                                <small v-if="!getBoolean(hideCountryName, 'dropdown')" v-html="c.name_en" />
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
                v-model="phone"
                class="iti__input"
                :tabindex="inputTabIndex"
                v-bind="$attrs"
                type="tel"
                :name="`${name}-${Date.now()}`"
                :disabled="disabled"
                :placeholder="parsedPlaceholder"
                expanded
                @input="onInput"
            />
        </B-Field>
        <p>activeCountry</p>
        <pre>{{ activeCountry }}</pre>
        <strong>parsedPlaceholder - {{ parsedPlaceholder }}</strong>
        <p>phoneData</p>
        <pre>{{ phoneData }}</pre>
    </div>
</template>

<script lang="ts">
    import PhoneNumber from 'awesome-phonenumber';
    import { BButton } from 'buefy/src/components/button';
    import { BDropdown, BDropdownItem } from 'buefy/src/components/dropdown';
    import { BField } from 'buefy/src/components/field';
    import { BInput } from 'buefy/src/components/input';
    import { isMobile } from 'buefy/src/utils/helpers';
    import { Component, Mixins, Ref, Watch } from 'vue-property-decorator';

    import useInput from '@/mixin/useInput';
    import { isDefined, getBoolean, fetchISO, getDropdownPosition } from '@/utils/';

    import { ICountry } from './models';

    @Component({
        name: 'DmcPhoneInput',
        components: {
            BField, BInput, BButton, BDropdown, BDropdownItem,
        },
    })
    export default class DmcPhoneInput extends Mixins(useInput) {
        isMounted = false;
        isAnyMobile = isMobile.any();
        getBoolean = getBoolean.bind(this) // short hand to make method available in template

        @Ref() readonly refPhoneField: BField;
        @Ref() readonly refPhoneDropdown: BDropdown;
        @Ref() readonly refPhoneDropdownInput: HTMLInputElement;
        @Ref() readonly refPhoneInput: BField;

        get isValid() {
            return (this.phone !== '')
                && this.phoneData.valid
                && this.activeCountry.iso2 === this.phoneData.regionCode
                && this.allowedPhoneTypes.includes(this.phoneData.type);
        }

        get valdationClass() {
            // TODO: make some simple validation in utils
            if (this.phone === '') {
                return '';
            }

            return this.validationMessage
                ? 'is-danger'
                : 'is-success';
        }

        get validationMessage() {
            // TODO: make some simple validation in utils

            /**
             * 1. Don't trigger validation if input is empty
             */
            if (this.phone === '' || this.isValid) {
                return '';
            }

            /**
             * 2. If active country id not equal to parsed one
             * while international inputs are restricted
             */
            if (!this.isAllowedInternationalInput && this.activeCountry.iso2 !== this.phoneData.regionCode) {
                return `Phone number error: country change is not allowed`;
            }

            /**
             * 3. If current phone type doesnt match to any of allowed ones
             */
            if (this.phoneData.type && this.phoneData.type !== 'unknown' && !this.allowedPhoneTypes.includes(this.phoneData.type)) {
                return `Phone number error: ${this.phoneData.type.replaceAll('-', ' ')} is not allowed phone type.`;
            }

            /**
             * 4. Generic
             */
            return this.customInvalidMsg(this.phoneData);
        }

        @Watch('isValid', { immediate: true })
        watchPhoneValidity(value = false) {
            if (value) {
                this.phone = this.formattedPhone;
            }

            this.$nextTick(() => {
                this.$emit('validate', value, this.phoneData);
            });
        }

        async mounted() {
            if (this.defaultCountry && this.fetchCountry) {
                throw new Error(`[DmcTelInput]: Do not use 'fetch-country' and 'default-country' options in the same time`);
            }

            if (this.hideFlags && this.emojiFlags) {
                throw new Error(`[DmcTelInput]: Do not use 'hide-flags' and 'emoji-flags' options in the same time`);
            }

            if (!this.hideFlags) {
                if (this.emojiFlags && !this.isEmojiFlagSupported) {
                    // TODO: make computed to avoid modifying props
                    this.emojiFlags = false;
                }
                else if (!this.emojiFlags) {
                    await import(/* webpackChunkName: "flags-sprite" */ '@/assets/scss/sprite.scss');
                }
            }

            // Allow set country only on mout (if dropdown disabled)
            const country = await this.initCountry();
            this.setActiveCountry(country);

            // Have this flag to avoid FOUC
            this.isMounted = true;
        }

        async initCountry() {
            /**
             * 1. if already have PHONE passed from the parent - parse it
             */
            if (this.phone && this.isInternationalInput(this.phone)) {
                /**
                 * We could have used phone watcher
                 * But we have to set country regardles disabled options
                 * so better keep logic separated
                 */
                const code = PhoneNumber.call(null, this.phone).getRegionCode();

                if (isDefined(code)) {
                    return code;
                }
            }
            /**
             * 2. if phone is empty, but have DEFAULT COUNTRY
             */
            if (this.defaultCountry) {
                return this.defaultCountry;
            }
            /**
             * 3. if don't have DEFAULT COUNTRY but fetch country is allowed - FETCH
             */
            if (this.fetchCountry) {
                this.isFetchingCode = true;
                const ISO2 = await fetchISO();
                this.isFetchingCode = false;

                return ISO2;
            }
            /**
             * 4. if don't have get fallback country from preffered or just a first option
             */
            return this.preferredCountries[0] || this.sortedCountries[0].iso2;
        }

        async onSelect(c: ICountry) {
            this.setActiveCountry(c);

            // emit country change event for the actual country select
            this.$emit('input', this.phone, this.phoneData);
            await this.focusInput();
        }

        onKeyPress($event: KeyboardEvent) {
            const { key } = $event;
            const { value: prevValue } = $event.target as HTMLInputElement;
            const newValue = `${prevValue}${key}`;

            const isValidCharactersOnly = this.validCharactersOnly && !this.testCharacters(key);
            const isCustomValidate = this.customRegExp && !this.testCustomValidate(key);
            const intlCheck = !this.isAllowedInternationalInput && this.isInternationalInput(newValue);

            if (isValidCharactersOnly || isCustomValidate || intlCheck) {
                $event.preventDefault();
            }
        }

        onInput(e: string) {
            // TODO: Set custm HTML5 validation error msg
            // refPhoneInput.value.$refs.input.setCustomValidity(this.phoneData.valid ? '' : this.invalidMsg);

            // TODO: Bind native event
            // Keep the current cursor position just in case the input reformatted
            // and it gets moved to the last character.
            // if ($event && $event.target) {
            //     this.cursorPositio = $event.target.selectionStart;
            // }
        }

        onActiveChange(state: boolean) {
            if (state === true) {
                // this.activeCountry.model = '';
                this.dropdownSearch = '';
                this.focusDropdownInput();

                this.dropdownOpenDirection = getDropdownPosition(this.refPhoneDropdown.$el);
            }
        }

        async focusInput() {
            await this.$nextTick(() => {
                this.refPhoneInput.focus();
            });
        }

        async focusDropdownInput() {
            await this.$nextTick(() => {
                this.refPhoneDropdownInput.focus();
            });
        }

        async focusDropdown() {
            await this.$nextTick(() => {
                this.refPhoneDropdown.focus();
            });
        }

        async selectInput() {
            await this.$nextTick(() => {
                // Accesing Buefy's input ref
                this.refPhoneInput.$refs.input.select();
            });
        }
    }
</script>

<style lang="scss" scoped>
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
