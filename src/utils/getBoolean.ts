import get from 'lodash/get';

export function getBoolean(prop, key: string): boolean {
    return typeof prop === 'boolean'
        ? prop
        : get(prop, key, false);
}
