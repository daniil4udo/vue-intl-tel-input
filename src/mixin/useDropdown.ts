import { ref, Ref } from '@vue/composition-api';

// TScompute
type DropdowPosition = 'auto' | 'top' | 'bottom'

export default function (props) {
    /**
     * Data
     */
    const selectedCountry = ref('');
    const dropdownOpenDirection: Ref<DropdowPosition> = ref('auto');

    function setDropdownPosition() {
        const spaceBelow = window.innerHeight - this.$el.getBoundingClientRect().bottom;
        const hasEnoughSpaceBelow = spaceBelow > 200;

        if (hasEnoughSpaceBelow) {
            dropdownOpenDirection.value = 'bottom';
        }
        else {
            dropdownOpenDirection.value = 'top';
        }
    }

    return {
        selectedCountry,
        dropdownOpenDirection,

        setDropdownPosition,
    };
}
