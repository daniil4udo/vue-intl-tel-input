export function setCaretPosition(ctrl: HTMLInputElement, pos: number) {
    // Modern browsers
    if (ctrl.setSelectionRange) {
        ctrl.focus();
        ctrl.setSelectionRange(pos, pos);
    }
}
