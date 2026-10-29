import {CONTACT_METHODS, EMAIL_PATTERN, FIELD_ERRORS} from "./keys.js";

export function validateContact(contact) {
    const errors = {};
    if (contact.name.trim().length < 2) errors.name = FIELD_ERRORS.name;
    if (!CONTACT_METHODS.includes(contact.contactMethod)) errors.contactMethod = FIELD_ERRORS.contactMethod;
    if (contact.contactMethod === "email") {
        if (!EMAIL_PATTERN.test(contact.email.trim())) errors.email = FIELD_ERRORS.email;
    } else if (contact.phone.replace(/\D/g, "").length !== 10) {
        errors.phone = FIELD_ERRORS.phone;
    }
    if (!contact.personalDataConsent) errors.personalDataConsent = FIELD_ERRORS.personalDataConsent;
    if (!contact.marketingConsent) errors.marketingConsent = FIELD_ERRORS.marketingConsent;
    return errors;
}