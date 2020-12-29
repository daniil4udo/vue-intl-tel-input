<template>
    <div>
        regionCode - {{ regionCode }}
        <B-Field
            :id="fieldId"
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
                :id="dropdownId"
                ref="refPhoneDropdown"
                aria-role="list"
                class="iti__dropdown"
                scrollable
                :position="dropdownOpenDirection"
                :max-height="400"
                :disabled="disabled || disabledDropdown || (!isMounted || isFetching)"
                :tabindex="dropdownTabIndex"
                @input="onSelect"
                @active-change="onActiveChange"
            >
                <B-Button
                    slot="trigger"
                    slot-scope="{ active }"
                    :loading="!isMounted || isFetching"
                    :class="[
                        'button is-outlined',
                        'iti__button',
                        valdationClass
                    ]"
                    type="button"
                >
                    <template v-if="isMounted && !isFetching">
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
                    <div class="control has-icons-right is-clearfix is-expanded">
                        <input
                            ref="refPhoneDropdownInput"
                            v-model="dropdownSearch"
                            class="input is-small iti__dropdown-input"
                            :placeholder="dropdownPlaceholder"
                            type="text"
                            @focus="focusDropdownInput"
                            @blur="blurDropdownInput"
                        >
                        <!-- TODO: add some svg to clear input -->
                    </div>
                </B-Field>

                <template v-for="(c, i) in fileredCountries">
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
                                <small v-if="!getBoolean(hideCountryName, 'dropdown')" v-html="c.name" />
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
                :id="inputId"
                ref="refPhoneInput"
                v-model="phone"
                v-bind="$attrs"
                expanded
                type="tel"
                class="iti__input"
                :autocomplete="autocomplete"
                :tabindex="inputTabIndex"
                :name="`${name}-${Date.now()}`"
                :disabled="disabled"
                :placeholder="newPlaceholder"
                @input="onInput"
                @focus="focusInput"
                @blur="blurInput"
                @keypress.native="onKeyPress"
            />
        </B-Field>
        <p>activeCountry</p>
        <pre>{{ activeCountry }}</pre>
        <strong>newPlaceholder - {{ newPlaceholder }}</strong>
        <p>phoneData</p>
        <pre>{{ phoneData }}</pre>
    </div>
</template>

<script lang="ts">
    import PhoneNumber from 'awesome-phonenumber';

    import { BButton, BDropdown, BDropdownItem, BField, BInput } from '@/components/buefy';
    import Dropdown from '@/mixin/useDropdown';
    import Input from '@/mixin/useInput';
    import { isDefined, getBoolean, fetchISO, getDropdownPosition, isMobile } from '@/utils/';
    import { Component, Mixins, Ref, Watch } from '@/utils/decorators';

    import { ICountry } from './models';

    @Component({
        name: 'VueIntlTelInput',
        components: {
            BField, BInput, BButton, BDropdown, BDropdownItem,
        },
    })
    export default class VueIntlTelInput extends Mixins(Dropdown, Input) {
        isMounted = false;
        // Flag that shows loading if we are trying to fetch country ISO from https://ip2c.org/s
        isFetching = true;
        // Check if current browser / platfor is mobile
        isAnyMobile = isMobile.any();
        // Shorthand for binding imported method
        getBoolean = getBoolean.bind(this) // short hand to make method available in template

        @Ref() readonly refPhoneField: BField;
        @Ref() readonly refPhoneDropdown: BDropdown;
        @Ref() readonly refPhoneDropdownInput: HTMLInputElement;
        @Ref() readonly refPhoneInput: BInput;

        get isValid() {
            return (this.phone !== '')
                && this.phoneData.valid
                && this.activeCountry.iso2 === this.regionCode
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
            if (this.disabledDropdown && (isDefined(this.regionCode) && this.activeCountry.iso2 !== this.regionCode)) {
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

        mounted() {
            if (this.defaultCountry && this.fetchCountry) {
                throw new Error(`[VueIntlTelInput]: Do not use 'fetch-country' and 'default-country' options in the same time`);
            }

            if (this.hideFlags && this.emojiFlags) {
                throw new Error(`[VueIntlTelInput]: Do not use 'hide-flags' and 'emoji-flags' options in the same time`);
            }

            if (!this.hideFlags) {
                if (this.emojiFlags && !this.isEmojiFlagSupported) {
                    // TODO: make computed to avoid modifying props
                    this.emojiFlags = false;
                }
                else if (!this.emojiFlags) {
                    import(/* webpackChunkName: "flags-sprite" */ '@/assets/scss/sprite.scss');
                }
            }

            // Allow set country only on mout (if dropdown disabled)
            this.initCountry()
                .then(country => {
                    this.setActiveCountry(country);
                })
                .finally(() => {
                    // Have this flag to avoid FOUC
                    this.isFetching = false;
                    this.isMounted = true;
                });
        }

        async initCountry() {
            /**
             * 1. if already have PHONE passed from the parent - parse it
             */
            if (this.phone && this.testInternational(this.phone)) {
                /**
                 * We could have used phone watcher
                 * But we have to set country regardles disabled options
                 * so better keep logic separated
                 */
                const code = PhoneNumber.call(null, this.phone).getRegionCode();

                /**
                 * KNOWN BUG of AWESOME-PHONE
                 * if you type 009752
                 * country not changing but phone parses correctly
                 */

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
                return fetchISO();
            }

            /**
             * 4. if don't have get fallback country from preffered or just a first option
             */
            return this.preferredCountries[0] || this.fileredCountries[0].iso2;
        }

        onSelect(c: ICountry) {
            this.setActiveCountry(c);
            this.focusInput();

            // emit country change event for the actual country select
            this.$emit('input', this.phone, this.phoneData);
        }

        onKeyPress(e: KeyboardEvent) {
            const { key } = e;

            const isValidCharactersOnly = this.validCharactersOnly && !this.testCharacters(key);
            const isCustomValidate = this.customRegExp && !this.testCustomValidate(key);

            if (isValidCharactersOnly || isCustomValidate) {
                e.preventDefault();
            }
        }

        onInput(s: string, e: InputEvent) {
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
                this.dropdownOpenDirection = getDropdownPosition(this.refPhoneDropdown.$el);

                this.focusDropdownInput();
                this.$emit('dropdown-active-change', state);
            }
        }

        focusInput() {
            this.$nextTick(() => {
                this.refPhoneInput.focus();
                this.$emit('focus-input');
            });
        }

        blurInput() {
            this.$nextTick(() => {
                this.$emit('blur-input');
            });
        }

        focusDropdownInput() {
            this.$nextTick(() => {
                this.refPhoneDropdownInput.focus();
                this.$emit('focus-dropdown-input');
            });
        }

        // TODO: fires twice
        blurDropdownInput() {
            this.$nextTick(() => {
                this.$emit('blur-dropdown-input');
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
