import { DropdowPosition } from '../components/types';

/**
 * Buefy specific - dynamicly changes position of the dropdown depending on how close it to the bottom of the page
 * @param el {HTMLElement}
 * @param minOffset {Number}
 */
export function getDropdownPosition(el: HTMLElement, minOffset = 200): DropdowPosition {
    const spaceBelow = window.innerHeight - el.getBoundingClientRect().bottom;

    return spaceBelow > minOffset
        ? 'is-bottom-right'
        : 'is-top-right';
}
