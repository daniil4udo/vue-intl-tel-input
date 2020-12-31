<template>
    <div>
        <!--  -->
        <div
            :id="fieldId"
            ref="refPhoneField"
            :class="[
                'field viti',
                { 'viti-mobile': isMobile }
            ]"
            :disabled="disabled"
        >
            <label
                v-if="label"
                class="label viti__label"
                v-text="label"
            />
            <div class="field-body">
                <div class="field has-addons">
                    <B-Dropdown
                        :id="dropdownId"
                        ref="refPhoneDropdown"
                        aria-role="list"
                        aria-label="List of countries"
                        role="list"
                        class="viti__dropdown"
                        scrollable
                        :position="dropdownOpenDirection"
                        :triggers="dropdownTriggers"
                        :max-height="dropdownHeight"
                        :disabled="disabled || disabledDropdown || (!isMounted || isFetching)"
                        :tabindex="dropdownTabIndex"
                        @input="onSelect"
                        @active-change="onActiveChange"
                    >
                        <template #trigger="{ active }" :aria-expanded="true">
                            <button
                                type="button"
                                :title="activeCountry.name_en + ': +' + activeCountry.dialCode"
                                :class="[
                                    'button viti__button is-outlined ',
                                    { 'is-loading': !isMounted || isFetching },
                                    valdationClass
                                ]"
                            >
                                <span>
                                    <template v-if="isMounted && !isFetching">
                                        <template v-if="!getBoolean(hideFlags, 'button')">
                                            <div
                                                v-if="getBoolean(emojiFlags, 'button') && activeCountry.emoji"
                                                class="viti__eflag"
                                            >
                                                <span v-text="activeCountry.emoji.flag" />
                                            </div>
                                            <div
                                                v-else
                                                :class="`viti__flag flag-${activeCountry.iso2.toLowerCase()}`"
                                            />
                                        </template>
                                        <div v-if="!getBoolean(hideCountryCode, 'button')" class="viti__country">
                                            <span
                                                class="viti__country-dial"
                                                v-text="`+${activeCountry.dialCode}`"
                                            />
                                        </div>
                                    </template>
                                    <!-- Dropdown Icon Slot -->
                                    <slot name="arrow-icon" :active="active">
                                        <small
                                            :class="[
                                                'viti__arrow',
                                                active ? 'is-open' : 'is-closed'
                                            ]"
                                            v-text="'↑'"
                                        />
                                    </slot>
                                </span>
                            </button>
                        </template>

                        <div class="field dropdown-item">
                            <div class="control has-icons-right is-clearfix is-expanded">
                                <input
                                    ref="refPhoneDropdownInput"
                                    v-model="dropdownSearch"
                                    type="text"
                                    class="input is-small viti__dropdown-input"
                                    :placeholder="dropdownPlaceholder"
                                    @focus="focus('focus-search', refPhoneDropdownInput, $event, true)"
                                    @blur="blur('blur-search', refPhoneDropdownInput, $event, true)"
                                >
                                <!-- TODO: add some svg to clear input -->
                                <span class="icon is-right is-clickable">
                                    <i class="mdi mdi-close-circle mdi-24px" />
                                </span>
                            </div>
                        </div>

                        <template v-for="(c, i) in fileredCountries">
                            <B-Dropdown-item
                                :key="`${i}-item`"
                                :value="c"
                                aria-role="listitem"
                                :aria-selected="`${activeCountry.iso2 === c.iso2}`"
                                role="listitem"
                                class="viti__dropdown-item"
                                :tabindex="-1"
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
                                            class="viti__eflag--dropdown"
                                        >
                                            <span v-text="c.emoji.flag" />
                                        </div>
                                        <div
                                            v-else
                                            :class="`viti__flag flag-${c.iso2.toLowerCase()}`"
                                        />
                                    </template>
                                    <div class="viti__country">
                                        <span
                                            v-if="!getBoolean(hideCountryCode, 'dropdown') && c.dialCode"
                                            class="viti__country-dial"
                                            v-text="`+${c.dialCode}`"
                                        />
                                        <!-- TODO: Add Intl.DisplayName support -->
                                        <small v-if="!getBoolean(hideCountryName, 'dropdown')" v-html="c.name" />
                                    </div>
                                </div>
                            </B-Dropdown-item>
                            <hr
                                v-if="c.lastPreffered"
                                :key="`${i}-divider`"
                                class="dropdown-divider"
                            >
                        </template>
                    </B-Dropdown>
                    <div
                        :class="[
                            'control viti__input has-icons-right',
                            { 'is-expanded': isExpanded }
                        ]"
                    >
                        <input
                            :id="inputId"
                            ref="refPhoneInput"
                            v-model="phone"
                            v-bind="$attrs"
                            type="tel"
                            :name="`${name}-${Date.now()}`"
                            :disabled="disabled"
                            :placeholder="newPlaceholder"
                            :autocomplete="autocomplete"
                            :tabindex="inputTabIndex"
                            :class="[
                                'input',
                                valdationClass
                            ]"
                            @input="onInput($event.target.value, $event)"
                            @focus="focus( 'focus', refPhoneInput, $event, true)"
                            @blur="blur( 'blur', refPhoneInput, $event, true)"
                            @keypress="onKeyPress($event)"
                        >
                        <slot name="validation-icon" :valid="isValid">
                            <span class="icon is-right has-text-danger">
                                <i class="mdi mdi-alert-circle mdi-24px" />
                            </span>
                        </slot>
                    </div>
                </div>
            </div>
            <p
                v-if="validationMessage"
                :class="[ 'help viti__error', valdationClass ]"
                v-text="validationMessage"
            />
        </div>
        <!--  -->
        <p>Active Country</p>
        <pre>{{ activeCountry }}</pre>
        <p>Phone Data</p>
        <pre>{{ phoneData }}</pre>
    </div>
</template>

<script lang="ts">
    import PhoneNumber from 'awesome-phonenumber';

    import { BDropdown, BDropdownItem } from '@/components/buefy';
    import Input from '@/mixin/useInput';
    import { isDefined, getBoolean, fetchISO, getDropdownPosition, getBowserLocale } from '@/utils/';
    import { Component, Mixins, Ref, Watch } from '@/utils/decorators';

    import { ICountry } from './models';

    @Component({
        name: 'VueIntlTelInput',
        components: {
              BDropdown, BDropdownItem,
        },
    })
    export default class VueIntlTelInput extends Mixins(Input) {
        isMounted = false;
        // Flag that shows loading if we are trying to fetch country ISO from https://ip2c.org/s
        isFetching = true;
        // Check if current browser / platfor is mobile
        isMobile = /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        // Shorthand for binding imported method
        getBoolean = getBoolean.bind(this) // short hand to make method available in template

        @Ref() readonly refPhoneField: HTMLDivElement;
        @Ref() readonly refPhoneDropdown: BDropdown;
        @Ref() readonly refPhoneDropdownInput: HTMLInputElement;
        @Ref() readonly refPhoneInput: HTMLInputElement;

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
             * In order to detec country we need at leas 1 number ater the +
             */
            if (this.phone && this.testInternational(this.phone) && this.phone.length > 1) {
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
            return this.preferredCountries[0] || getBowserLocale() || this.fileredCountries[0].iso2;
        }

        onSelect(c: ICountry) {
            this.setActiveCountry(c);
            this.focus('focus', this.refPhoneInput);

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

        onInput(s: string, e?: InputEvent) {
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

                this.focus('focus-search', this.refPhoneDropdownInput);
                this.$emit('dropdown-active-change', state);
            }
        }

        focus(emitName = 'focus', el: HTMLInputElement, e?: FocusEvent, emit?: boolean) {
            this.$nextTick(() => {
                el.focus();

                if (isDefined(emit)) {
                    this.$emit(emitName, el, e);
                }
            });
        }

        // TODO: fires twice
        blur(emitName = 'blur', el: HTMLInputElement, e?: FocusEvent) {
            this.$nextTick(() => {
                this.$emit(emitName, el, e);
            });
        }

        async selectInput() {
            await this.$nextTick(() => {
                // Accesing Buefy's input ref
                this.refPhoneInput.select();
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
