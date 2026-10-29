export function readContact(form) {
    const value = (name) => form.elements.namedItem(name)?.value.trim() ?? "";
    return {
        name: value("name"), phone: value("phone"), email: value("email"),
        contactMethod: value("contactMethod"),
        personalDataConsent: form.elements.namedItem("personalDataConsent").checked,
        marketingConsent: form.elements.namedItem("marketingConsent").checked,
    };
}