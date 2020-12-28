import PhoneNumber from 'awesome-phonenumber';

import { INTL, VALID_CHAR } from '@/assets/constants';
import Dropdown from '@/mixin/useDropdown';
import { isDefined } from '@/utils/';
import { Component, Mixins, Watch } from '@/utils/decorators';

import { IPhoneObject, INumber, ParseMode } from '../components/models';

@Component
export default class Input extends Mixins(Dropdown) {
    public cursorPosition = 0;

    /**
     * V-MODEL
     * Do not modify. Important for v-model to work
     */
    public get phone(): string {
        return String(this.value).trim();
        // return this.normalizeIntlInput(String(this.value).trim());
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

    /**
     * NOTE: awesome-phonenumber has odd behaviour
     * if you type number like 00380 (which is also an international input)
     * number.international shows correct parse phone - +38097
     * but regionCode satays as previous country
     * hence we need to replace all possible variations to +
     */
    public get regionCode() {
        const { international = '' } = this.phoneData.number;

        /**
         * Readon for fallback to the regionCode
         * is that parsed 'number' object comes later
         * then detection of the region code
         */
        return PhoneNumber.call(null, international).getRegionCode() || this.phoneData.regionCode;
    }

    public get parsedPlaceholder(): string {
        if (this.dynamicPlaceholder && this.activeCountry.iso2) {
            const mode: ParseMode = this.mode || 'national';

            return PhoneNumber.getExample(this.activeCountry.iso2, this.placeholderNumberType).getNumber(mode);
        }

        return this.inputPlaceholder;
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

        if (this.automaticFormatting && this.phoneData.valid) {
            key = this.parsedMode;
        }

        return this.phoneData.number[key] || this.phone;
    }

    public get phoneData(): IPhoneObject {
        const parserPhone = new PhoneNumber(this.phone, this.activeCountry.iso2).toJSON();

        return {
            ...parserPhone,
            isIntlInput: this.testInternational(this.phone),
            country: this.activeCountry,
        };
    }

    @Watch('phone', { immediate: true })
    onPhoneChanged(value: string, valuePrev: string) {
        if (value) {
            /**
             * Sanitizing input if validCharactersOnly id on
             * NOTE: has to be { immediate: true } in order this to work with v-model
             */
            if (this.validCharactersOnly && !this.testCharacters()) {
                value = this.normalizeInput(value);

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

    @Watch('regionCode', { immediate: false })
    watchPhoneRegionCode(code: string) {
        if (isDefined(code) && !this.disabledDropdown) {
            this.setActiveCountry(code);

            /**
             * In case user start input with +, format it base on this.mode
             */
            this.phone = this.formattedPhone;
        }
    }

    public testCharacters(phone = this.phone): boolean {
        return VALID_CHAR.test(phone);
    }

    public normalizeInput(phone = this.phone): string {
        return phone.replace(/[^()\-\+\d\s]+/gi, '');
    }

    public testInternational(phone = this.phone): boolean {
        return INTL.test(phone);
    }

    public normalizeIntlInput(phone = this.phone): string {
        return this.testInternational(phone)
            ? phone.replace(INTL, '+')
            : phone;
    }

    public testCustomValidate(phone = this.phone): boolean {
        if (this.customRegExp instanceof RegExp) {
            return this.customRegExp.test(phone);
        }

        throw new TypeError(`[testCustomValidate]: phone in customRegExp has to be a RegExp. Got ${typeof this.customRegExp}`);
    }
}
