export function addLeadingZero(val: number) {
    const valStr = val.toString();
    if (valStr.length === 1) {
        return '0' + valStr;
    } else {
        return valStr;
    }
} 