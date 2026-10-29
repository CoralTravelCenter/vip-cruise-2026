/** +7 показан отдельно; код страны удаляется только из полного номера. */
export function formatPhoneInput(value) {
    let digits = value.replace(/\D/g, "");
    if (digits.length > 10 && /^[78]/.test(digits)) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    return [digits.slice(0, 3), digits.slice(3, 6)].filter(Boolean).join(" ")
        + (digits.length > 6 ? `-${digits.slice(6, 8)}` : "")
        + (digits.length > 8 ? `-${digits.slice(8, 10)}` : "");
}