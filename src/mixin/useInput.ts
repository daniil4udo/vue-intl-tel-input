import PhoneNumber from 'awesome-phonenumber';
import { Component, Mixins, Watch } from 'vue-property-decorator';

import { INTL, VALID_CHAR } from '@/assets/constants';
import Dropdown from '@/mixin/useDropdown';
import { isDefined } from '@/utils/';

import { IPhoneObject, INumber } from '../components/models';
// import useCountries from '@/mixin/useCountries';

@Component
export default class Input extends Mixins(Dropdown) {
    public cursorPosition = 0;

    /**
     * V-MODEL
     * Do not modify. Important for v-model to work
     */
    public get phone(): string {
        return this.normalizeIntlInput(this.value.trim());
    }

    public set phone(value) {
        /**
         * Returns response.number to assign it to v-model (if being used)
         * Returns full response for cases @input is used
         * and parent wants to return the whole response.
         */
        this.$emit('input', value, this.phoneData);
    }
    /**
     * V-MODEL
     */

    public get isAllowedInternationalInput(): boolean {
        return !this.disabledDropdown;
    }

    public get parsedPlaceholder(): string {
        if (this.dynamicPlaceholder && this.activeCountry.iso2) {
            const mode = this.mode || 'international';

            return PhoneNumber.getExample(this.activeCountry.iso2, this.placeholderNumberType).getNumber(mode);
        }

        return this.inputPlaceholder;
    }

    public get phoneData(): IPhoneObject {
        return {
            ...new PhoneNumber(this.phone, this.activeCountry.iso2).toJSON(),
            isIntlInput: this.testInternational(this.phone),
            country: this.activeCountry,
        };
    }

    public get parsedMode(): keyof INumber {
        if (this.customRegExp) {
            return 'input';
        }

        if (this.mode) {
            // TODO: have mode validator. revisit later
            if (![ 'international', 'national' ].includes(this.mode)) {
                console.error('Invalid value of prop "mode"');
            }
            else {
                return this.mode;
            }
        }

        if (!this.phone || !this.phoneData.isIntlInput) {
            return 'national';
        }

        return 'international';
    }

    public get formattedPhone(): string {
        let key: keyof INumber = 'input';

        if (this.phoneData.valid) {
            key = this.parsedMode;
        }

        return this.phoneData.number[key] || '';
    }

    @Watch('phone', { immediate: true })
    onPhoneChanged(value: string, valuePrev: string) {
        if (value) {
            /**
             * Sanitizing input if validCharactersOnly id on
             * NOTE: has to be { immediate: true } in order this to work with v-model
             */
            if (this.validCharactersOnly && !this.testCharacters()) {
                value = value.replace(/[^()\-\+\d\s]+/gi, '');

                this.$nextTick(() => {
                    this.phone = value;
                });
            }

            // Reset the cursor to current position if it's not the last character.
            // if (this.cursorPosition < oldValue.length) {
            //     this.$nextTick(() => {
            //         // TODO: check for correct refs
            //         setCaretPosition(this.$refs.refPhoneInput.$refs.input, this.cursorPosition);
            //     });
            // }
        }
    }

    @Watch('phoneData.regionCode', { immediate: false })
    watchPhoneRegionCode(code: string) {
        if (isDefined(code) && this.isAllowedInternationalInput) {
            this.setActiveCountry(code);

            /**
             * In case user start input with +, format it base on this.mode
             */
            this.phone = this.formattedPhone;
        }
    }

    public normalizeIntlInput(phone = this.phone): string {
        return this.testInternational(phone)
            ? phone.replace(INTL, '+')
            : phone;
    }

    public testCharacters(phone = this.phone): boolean {
        return VALID_CHAR.test(phone);
    }

    public testCustomValidate(phone = this.phone): boolean {
        if (this.customRegExp instanceof RegExp) {
            return this.customRegExp.test(phone);
        }

        throw new TypeError(`[testCustomValidate]: phone in customRegExp has to be a RegExp. Got ${typeof this.customRegExp}`);
    }

    public testInternational(phone = this.phone): boolean {
        if (typeof phone === 'string') {
            return INTL.test(phone);
        }

        throw new TypeError(`[testInternational]: phone in testInternational has to be as string. Got ${typeof phone}`);
    }
}
