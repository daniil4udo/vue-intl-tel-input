import { PropType } from '@vue/composition-api';

export interface IInputProps {
    inputTabIndex?: PropType<number>;
    customValidate?: PropType<RegExp>;
    validCharactersOnly?: PropType<boolean>;
    placeholder?: PropType<string>;
    dynamicPlaceholder?: PropType<boolean>;
}

export default {
    // props: {
    inputTabIndex: {
        type: (Number as unknown) as PropType<number>,
        default: () => 0,
    },
    customValidate: {
        type: (RegExp as unknown) as PropType<RegExp>,
        default: () => new RegExp(''),
    },
    validCharactersOnly: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => true,
    },
    inputPlaceholder: {
        type: (String as unknown) as PropType<string>,
        default: () => '5x xxx xxxx',
    },
    dynamicPlaceholder: {
        type: (Boolean as unknown) as PropType<boolean>,
        default: () => true,
    },
    // },
};
