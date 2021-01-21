<template>
    <div>
        <div
            :id="fieldId"
            ref="refPhoneField"
            :disabled="disabled"
            :class="[
                'field viti',
                { 'viti-mobile': isMobile }
            ]"
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
                        :disabled="disabled || disabledDropdown || !isMounted"
                        :tabindex="dropdownTabIndex"
                        @input="onSelect"
                        @active-change="onActiveChange"
                    >
                        <template #trigger="{ active }" :aria-expanded="true">
                            <button
                                type="button"
                                :title="`${activeCountry.name_en}: ${activeCountry.dialCode}`"
                                :class="[
                                    'button viti__button is-outlined ',
                                    { 'is-loading': !isMounted },
                                    valdationClass
                                ]"
                            >
                                <span>
                                    <template v-if="isMounted">
                                        <template v-if="!getBool(hideFlags, 'button')">
                                            <div
                                                v-if="getBool(emojiFlags, 'button') && activeCountry.emoji"
                                                class="viti__eflag"
                                            >
                                                <span v-text="activeCountry.emoji.flag" />
                                            </div>
                                            <div
                                                v-else
                                                :class="[
                                                    // If css flags enabled, render css img only after first pixel intersecting
                                                    `viti__fl${isLazyFlags ? '-lazy' : ''}`,
                                                    `fl-${activeCountry.iso2.toLowerCase()}`
                                                ]"
                                            />
                                        </template>
                                        <div v-if="!getBool(hideCountryCode, 'button')" class="viti__country">
                                            <span class="viti__country-dial" v-text="`+${activeCountry.dialCode}`" />
                                        </div>
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
                                    </template>
                                    <!-- Flag Placeholder -->
                                    <div v-else class="viti__fl-lazy" />
                                </span>
                            </button>
                        </template>

                        <div class="field dropdown-content dropdown-item">
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
                                <!-- <span class="icon is-small is-right is-clickable" @click="dropdownSearch = ''">
                                    <img
                                        svg-inline
                                        src="../assets/img/x-circle.svg"
                                        alt="✕"
                                    >
                                </span> -->
                            </div>
                        </div>

                        <template v-for="(c, i) in fileredCountriez">
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
                                    <!-- Country flag -->
                                    <template v-if="!getBool(hideFlags, 'dropdown')">
                                        <!-- Emoji -->
                                        <div
                                            v-if="getBool(emojiFlags, 'dropdown') && c.emoji"
                                            class="viti__eflag--dropdown"
                                        >
                                            <span v-text="c.emoji.flag" />
                                        </div>
                                        <!-- Css flag -->
                                        <div
                                            v-else
                                            :class="[
                                                // Id css flags enabled, render css img only after first pixel intersecting
                                                `viti__fl${isLazyFlags ? '-lazy' : ''}`,
                                                `fl-${c.iso2.toLowerCase()}`
                                            ]"
                                        />
                                    </template>
                                    <div class="viti__country">
                                        <!-- Country dial code -->
                                        <span
                                            v-if="!getBool(hideCountryCode, 'dropdown') && c.dialCode"
                                            class="viti__country-dial"
                                            v-text="`+${c.dialCode}`"
                                        />
                                        <!-- Contry name -->
                                        <!-- TODO: Add Intl.DisplayName support -->
                                        <small v-if="!getBool(hideCountryName, 'dropdown')" v-html="c.name" />
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
                            v-model="phoneValue"
                            v-bind="$attrs"
                            type="tel"
                            :name="`${name}-${Date.now()}`"
                            :disabled="disabled"
                            :placeholder="newPlaceholder"
                            :autocomplete="autocomplete"
                            :tabindex="inputTabIndex"
                            :class="[ 'input', valdationClass ]"
                            @input="onInput($event.target.value, $event)"
                            @focus="focus( 'focus', refPhoneInput, $event, true)"
                            @blur="blur( 'blur', refPhoneInput, $event, true)"
                            @keypress="onKeyPress($event)"
                        >
                        <slot name="validation-icon" :valid="isValid">
                            <span v-if="valdationClass" :class="[ 'icon is-right', valdationClass ]">
                                <!-- cannot use dynamic path :( -->
                                <img
                                    v-if="validationReason"
                                    svg-inline
                                    class="has-text-danger"
                                    src="../assets/img/x.svg"
                                >
                                <img
                                    v-else
                                    svg-inline
                                    class="has-text-success"
                                    src="../assets/img/check.svg"
                                >
                            </span>
                        </slot>
                    </div>
                </div>
            </div>
            <!-- Validation Error message -->
            <p :class="[ 'help viti__error', valdationClass ]">
                <component
                    :is="validationComponent"
                    v-if="validationComponent"
                    :name="errorAnimation"
                >
                    <slot
                        name="validation-message"
                        :phone-data="phoneData"
                        :reason="validationReason"
                    >
                        <span v-if="validationReason" v-text="`Phone Number Error: ${validationMessage}`" />
                    </slot>
                </component>
            </p>
        </div>
        <!--  -->
        <p>Active Country</p>
        <pre>{{ activeCountry }}</pre>
        <p>Phone Data</p>
        <pre>{{ phoneData }}</pre>
        <!--  -->
    </div>
</template>

<script lang="ts">
    import PhoneNumber from 'awesome-phonenumber';
    import { Component, Mixins, Ref, Watch } from 'vue-property-decorator';

    import { emojiFlagsSupport } from '@/assets/all-countries';
    import { VALIDATION_MESSAGES } from '@/assets/constants';
    import { BDropdown, BDropdownItem } from '@/components/buefy';
    import Input from '@/mixin/useInput';
    import { isDefined, getBool, fetchISO, getDropdownPosition, getBowserLocale } from '@/utils';

    import { ICountry } from './types';

    @Component({
        name: 'VueIntlTelInput',
        components: {
              BDropdown, BDropdownItem,
        },
    })
    export default class VueIntlTelInput extends Mixins(Input) {
        /**
         * FLAGS
         * Flag that shows loading if we are trying to fetch country ISO from https://ip2c.org/s
         * And if flag loaded (in case using flags sprites instead of emoji)
         */
        isMounted = false;
        isLoadedFlags = false;

        // Check if current browser / platfor is mobile
        isMobile = /Android.+Mobile|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        // IntersectionObserver
        isLazyFlags = !getBool(this.emojiFlags, 'dropdown') || !getBool(this.emojiFlags, 'dropdown');
        observer = null as IntersectionObserver;

        @Ref() readonly refPhoneField: HTMLDivElement;
        @Ref() readonly refPhoneDropdown: BDropdown;
        @Ref() readonly refPhoneDropdownInput: HTMLInputElement;
        @Ref() readonly refPhoneInput: HTMLInputElement;

        get isValid() {
            return (this.phoneValue !== '')
                && this.phoneData.valid
                && this.activeCountry.iso2 === this.regionCode
                && this.allowedPhoneTypes.includes(this.phoneData.type);
        }

        get valdationClass() {
            // TODO: make some simple validation in utils
            if (this.phoneValue === '') {
                return '';
            }

            return this.validationMessage
                ? 'is-danger'
                : 'is-success';
        }

        get validationComponent() {
            return (this.errorAnimation && typeof this.errorAnimation === 'string')
                ? 'transition'
                : 'template';
        }

        get validationReason() {
            // TODO: make some simple validation in utils

            /**
             * 1. Don't trigger validation if input is empty
             */
            if (this.phoneValue === '' || this.isValid) {
                return null;
            }

            /**
             * 2. If active country id not equal to parsed one
             * while international inputs are restricted
             */
            if (this.disabledDropdown && (isDefined(this.regionCode) && this.activeCountry.iso2 !== this.regionCode)) {
                return 'no-country-change';
            }

            /**
             * 3. If current phone type doesnt match to any of allowed ones
             */
            if (this.phoneData.type && this.phoneData.type !== 'unknown' && !this.allowedPhoneTypes.includes(this.phoneData.type)) {
                return 'invalid-phone-type';
            }

            /**
             * 4. Generic
             */
            if (this.phoneData && this.phoneData.possibility && this.phoneData.country.name_en) {
                return this.phoneData.possibility;
            }

            // Most probable scenario that at this pooint we dont have country setted yet
            return 'unknown';
        }

        get validationMessage() {
            return VALIDATION_MESSAGES[this.validationReason];
        }

        @Watch('isValid', { immediate: true })
        watchPhoneValidity(value = false) {
            if (value) {
                this.phoneValue = this.formattedPhone;
            }

            this.$nextTick(() => {
                this.$emit('validate', this.validationReason, this.phoneData);
            });
        }

        created() {
            if (this.defaultCountry && this.autoCountry) {
                console.warn(`[VueIntlTelInput]: Do not use 'fetch-country' and 'default-country' options in the same time`);
            }

            this.processCountriesData();

            if ((getBool(this.hideFlags, 'button') && getBool(this.emojiFlags, 'button')) || (getBool(this.hideFlags, 'dropdown') && getBool(this.emojiFlags, 'dropdown'))) {
                throw new Error(`[VueIntlTelInput]: Do not use 'hide-flags' and 'emoji-flags' options in the same time`);
            }

            if (!getBool(this.hideFlags, 'button') || !getBool(this.hideFlags, 'dropdown')) {
                if ((getBool(this.emojiFlags, 'button') && getBool(this.emojiFlags, 'dropdown')) && !emojiFlagsSupport) {
                    // TODO: make computed to avoid modifying props
                    // this.emojiFlags = false;
                }

                if (!getBool(this.emojiFlags, 'button') || !getBool(this.emojiFlags, 'dropdown')) {
                    import(/* webpackChunkName: "flags-sprite" */ '@/assets/scss/sprite.scss')
                        .then(() => {
                            this.isLoadedFlags = true;
                        });
                }
            }

            /**
             * Find proper country base on initial inputs
             * Allow set country only on mout (if dropdown is disabled)
             */
            this.initCountry()
                .then(country => {
                    this.setActiveCountry(country);
                })
                .finally(() => {
                    // Have this flag to avoid FOUC
                    this.isMounted = true;
                });
        }

        mounted() {
            /**
             * No need to fire IO if user want to displat emoji flags
             * If at least on prop doesnt ask for emoji - then load css flags
             */
            if (this.isLazyFlags) {
                // Init IntersectionObserver for lazyload flag sprites sprite
                this.initObserver()
                    .then(() => {
                        this.observer.observe(this.refPhoneField);
                    });
            }
        }

        destroyed() {
            if (isDefined(this.observer)) {
                this.observer.disconnect();
                this.observer = null;
            }
        }

        async initCountry() {
            /**
             * 1. if already have PHONE passed from the parent - parse it
             * In order to detec country we need at leas 1 number ater the +
             */
            if (this.phoneValue && this.testInternational(this.phoneValue) && this.phoneValue.length > 1) {
                /**
                 * We could have used phone watcher
                 * But we have to set country regardles disabled options
                 * so better keep logic separated
                 */
                const code = PhoneNumber.call(null, this.phoneValue).getRegionCode();

                /**
                 * KNOWN BUG of AWESOME-PHONE
                 * if you type 009752
                 * country not changing but phone parses correctly
                 */

                if (isDefined(code)) {
                    return Promise.resolve(code);
                }
            }

            /**
             * 2. if phone is empty, but have DEFAULT COUNTRY
             */
            if (this.defaultCountry) {
                return Promise.resolve(this.defaultCountry);
            }

            /**
             * 3. if don't have DEFAULT COUNTRY but fetch country is allowed - FETCH
             */
            if (this.autoCountry) {
                return fetchISO();
            }

            /**
             * 4. if don't have get fallback country from preffered or just a first option
             */
            return Promise.resolve(getBowserLocale() || this.countriez[0].iso2);
        }

        async initObserver() {
            if (!('IntersectionObserver' in window) || !('IntersectionObserverEntry' in window) || !('intersectionRatio' in window.IntersectionObserverEntry.prototype)) {
                this.isLazyFlags = false;
            }

            const options: IntersectionObserverInit = {
                /**
                 * IMPORTANT
                 * always include 0 in the threshold. FF doesnt behave well without it
                 */
                threshold: [ 0 ], // as soon as even one pixel is visible, the callback will be run)
            };

            const handleIntersectionEvent: IntersectionObserverCallback = (entries: IntersectionObserverEntry[]) => {
                /**
                 * IMPORTANT:
                 * Intersection observer on init return all entries with all the states
                 * All next calls only changed state
                 *
                 * NOTE:
                 * Assuming that entries array has only 1 entry
                 * so no sense to loop through it
                 */
                if (entries[0].isIntersecting) {
                    this.isLazyFlags = false;

                    this.$nextTick(() => {
                        this.observer.unobserve(this.refPhoneField);
                    });
                }
            };

            this.observer = new IntersectionObserver(handleIntersectionEvent, options);
        }

        onSelect(c: ICountry) {
            this.setActiveCountry(c);
            this.focus('focus', this.refPhoneInput);

            // emit country change event for the actual country select
            this.$emit('update:phone', this.phoneValue, this.phoneData);
        }

        onKeyPress(e: KeyboardEvent) {
            const { key } = e;

            const isValidCharactersOnly = this.validCharactersOnly && !this.testCharacters(key);
            const isCustomValidate = this.customRegexp && !this.testCustomValidate(key);

            if (isValidCharactersOnly || isCustomValidate) {
                e.preventDefault();
            }
        }

        onInput(s: string, e?: InputEvent) {
            // TODO: Set custm HTML5 validation error msg
            // refPhoneInput.value.setCustomValidity(this.phoneData.valid ? '' : this.invalidMsg);

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

        focus(emitName = 'focus', el: HTMLInputElement, e?: FocusEvent, emit = false) {
            this.$nextTick(() => {
                el.focus();

                if (emit === true) {
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

        // short hand to make method available in template
        getBool = getBool.bind(this);
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
