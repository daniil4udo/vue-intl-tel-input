<template>
    <div>
        <B-Field
            ref="refPhoneField"
            class="iti"
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
                                v-if="getBoolean(emojiFlags, 'button')"
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
                                    v-if="getBoolean(emojiFlags, 'dropdown')"
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
                                    v-if="!getBoolean(hideCountryCode, 'dropdown')"
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
                @keypress.native="onKeyPress"
            />
        </B-Field>
        <p>activeCountry</p>
        <pre>{{ activeCountry }}</pre>
        <strong>parsedPlaceholder - {{ parsedPlaceholder }}</strong>
        <p>phoneObject</p>
        <pre>{{ phoneObject }}</pre>
    </div>
</template>

<script lang="ts">
    import { BButton } from 'buefy/src/components/button';
    import { BDropdown, BDropdownItem } from 'buefy/src/components/dropdown';
    import { BField } from 'buefy/src/components/field';
    import { BInput } from 'buefy/src/components/input';
    import { Component, Mixins, Ref } from 'vue-property-decorator';

    import useInput from '@/mixin/useInput';
    import { getBoolean } from '@/utils/';

    import { ICountry } from './models';

    @Component({
        name: 'DmcPhoneInput',
        components: {
            BField, BInput, BButton, BDropdown, BDropdownItem,
        },
    })
    export default class DmcPhoneInput extends Mixins(useInput) {
        isMounted = false;

        @Ref() readonly refPhoneField: BField;
        @Ref() readonly refPhoneDropdown: BDropdown;
        @Ref() readonly refPhoneDropdownInput: HTMLInputElement;
        @Ref() readonly refPhoneInput: BField;

        get isValid() {
            return (this.phone !== '') && this.phoneObject.valid && this.allowedPhoneTypes.includes(this.phoneObject.type);
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
            if (this.phone === '' || this.isValid) {
                return '';
            }

            return this.customInvalidMsg(this.phoneObject);
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
            // 1. if already have PHONE passed from the parent - parse it
            if (this.phone && this.phoneObject.isIntlInput) {
                // all Phone-related logic has been executed and assign to the this.phoneObject
                if (this.phoneObject.regionCode) {
                    return this.phoneObject.regionCode;
                }
            }
            // 2. if phone is empty, but have DEFAULT COUNTRY
            if (this.defaultCountry) {
                return this.defaultCountry;
            }
            // 3. if don't have DEFAULT COUNTRY but fetch country is allowed - FETCH
            if (this.fetchCountry) {
                const ISO2 = await this.fetchISO();

                return ISO2;
            }
            // 4. if don't have get fallback country from preffered or just a first option
            return this.preferredCountries[0] || this.sortedCountries[0].iso2;
        }

        async onSelect(c: ICountry) {
            this.setActiveCountry(c);

            await this.$nextTick(() => {
                // emit country change event for the actual country select
                this.$emit('country-changed', c);
                this.$emit('input', this.phoneText, this.phoneObject);

                this.focusInput();
            });

            return c;
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

        onInput(e) {
            if (this.validCharactersOnly && !this.testCharacters()) {
                return;
            }
            if (this.customRegExp && !this.testCustomValidate()) {
                return;
            }

            // TODO: Set custm HTML5 validation error msg
            // refPhoneInput.value.$refs.input.setCustomValidity(this.phoneObject.valid ? '' : this.invalidMsg);

            // Returns response.number to assign it to v-model (if being used)
            // Returns full response for cases @input is used
            // and parent wants to return the whole response.
            this.$nextTick(() => {
                this.$emit('input', this.phoneText, this.phoneObject);
            });

            // TODO: Bind native event
            // Keep the current cursor position just in case the input reformatted
            // and it gets moved to the last character.
            // if ($event && $event.target) {
            //     this.cursorPosition.value = $event.target.selectionStart;
            // }
        }

        onActiveChange(state, prevModel) {
            if (state === true) {
                // this.activeCountry.model = '';
                this.dropdownSearch = '';
                this.focusDropdownInput();

                this.setDropdownPosition(this.refPhoneDropdown.$el);
            }
        }

        focusInput() {
            this.$nextTick(() => {
                this.refPhoneInput.focus();
            });
        }

        focusDropdownInput() {
            this.$nextTick(() => {
                this.refPhoneDropdownInput.focus();
            });
        }

        focusDropdown() {
            this.$nextTick(() => {
                this.refPhoneDropdown.focus();
            });
        }

        selectInput() {
            this.$nextTick(() => {
                // Accesing Buefy's input ref
                this.refPhoneInput.$refs.input.select();
            });
        }

        getBoolean(prop, key: string): boolean {
            return getBoolean(prop, key);
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
