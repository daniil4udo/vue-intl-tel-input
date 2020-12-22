<template>
    <div>
        isRegionlessNanp – {{ isRegionlessNanp }}
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
                :position="dropdownOpenDirection"
                :max-height="400"
                :disabled="disabled || disabledDropdown || isFetchingCode"
                :tabindex="dropdownTabIndex"
                @input="onSelect"
                @active-change="onActiveChange"
            >
                <b-button
                    slot="trigger"
                    slot-scope="{ active }"
                    :loading="isFetchingCode"
                    :class="[
                        'button is-outlined',
                        'iti__button',
                        validationClasses.class
                    ]"
                    type="button"
                >
                    <template v-if="!isFetchingCode">
                        <template v-if="!getBoolean(hideFlags, 'button')">
                            <div
                                v-if="getBoolean(emojiFlags, 'button')"
                                class="iti__eflag"
                            >
                                <span v-text="activeCountry.emoji" />
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
                </b-button>

                <B-Field class="dropdown-item">
                    <B-Input
                        ref="refPhoneDropdownInput"
                        v-model="dropdownSearch"
                        class="iti__dropdown-input"
                        size="is-small"
                        :placeholder="dropdownPlaceholder"
                        icon-right="close-circle"
                        icon-right-clickable
                        @icon-right-click="dropdownSearch = ''"
                    />
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
                    >
                        <div class="media">
                            <template v-if="!getBoolean(hideFlags, 'dropdown')">
                                <div
                                    v-if="getBoolean(emojiFlags, 'dropdown')"
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
                                    v-if="!getBoolean(hideCountryCode, 'dropdown')"
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
                ref="refPhoneInput"
                v-model="phone"
                class="iti__input"
                :tabindex="inputTabIndex"
                v-bind="$attrs"
                type="tel"
                :name="name"
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
    import PhoneNumber from 'awesome-phonenumber';
    import { Component, Mixins, Ref } from 'vue-property-decorator';

    import Input from '@/mixin/useInput';

    import { ICountry } from './models';

    @Component({
        name: 'DmcPhoneInput',
    })
    export default class DmcPhoneInput extends Mixins(Input) {
        @Ref() readonly refPhoneField;
        @Ref() readonly refPhoneDropdown;
        @Ref() readonly refPhoneDropdownInput;
        @Ref() readonly refPhoneInput;

        get isValid() {
            return this.phone !== '' && this.phoneObject.valid && this.allowedPhoneTypes.includes(this.phoneObject.type);
        }

        get validationClasses() {
            if (this.phone === '') {
                return {
                    class: '',
                    message: '',
                };
            }

            return this.isValid
                ? { class: 'is-success', message: '' }
                : { class: 'is-danger', message: `Invalid phone number for ${this.activeCountry.enname}` };
        }

        async mounted() {
            // Fetch only if explicitly said it &
            // if we have no value passign from the parent
            const country = await this.initCountry();

            this.selectCountry(country);

            // TODO: Sanitize if number looks like Intl but we are no allowing intl
        }

        async initCountry() {
            // 1. if already have PHONE passed from the parent - parse it
            if (this.phone && this.phoneObject.isIntlInput) {
                const activeCountry = new PhoneNumber(this.phone);

                if (activeCountry.isValid()) {
                    // Most possible scenario tha we gonna get intl phone fro mthe parent
                    // so we'l replace it with national format instead
                    this.phone = activeCountry.getNumber('national');

                    // return this.selectCountry(activeCountry.getRegionCode());
                    return activeCountry.getRegionCode();
                }
            }
            // 2. if phone is empty, but have DEFAULT COUNTRY
            if (this.defaultCountry) {
                return this.defaultCountry;
            }
            // 3. if don't have DEFAULT COUNTRY but fetch country is allowed - FETCH
            if (this.fetchCountry) {
                const ISO2 = await this.fetchCountryCode();

                return ISO2;
            }
            // 4. if don't have get fallback country from preffered or just a first option
            return this.preferredCountries[0] || this.sortedCountries[0].iso2;
        }

        async onSelect(c: ICountry) {
            // Move countries, that has been selected to the top of the list
            // Like a recently chosen
            if (!this.preferredCountries.includes(c.iso2)) {
                this.preferredCountries.push(c.iso2);
            }

            const country = this.selectCountry(c);

            await this.$nextTick(() => {
                // emit country change event for the actual country select
                this.$emit('country-changed', country);
                this.$emit('input', this.phoneText, this.phoneObject);

                this.focusInput();
            });

            return country;
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

                if (this.refPhoneDropdown.$el instanceof HTMLElement) {
                    this.setDropdownPosition(this.refPhoneDropdown.$el);
                }
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
    }
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
