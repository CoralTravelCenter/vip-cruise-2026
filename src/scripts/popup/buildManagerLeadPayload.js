export function buildManagerLeadPayload({contact, subject, to, submittedAt = new Date()}) {
    const pad = (value) => String(value).padStart(2, "0");
    return {
        subject, to, format: "html", plaintext: "КРУИЗ",
        lead: {
            segment: "Elite",
            submittedAt: `${pad(submittedAt.getDate())}.${pad(submittedAt.getMonth() + 1)}.${submittedAt.getFullYear()} ${pad(submittedAt.getHours())}:${pad(submittedAt.getMinutes())}`,
            name: contact.name.trim(),
            ...(contact.contactMethod === "email"
                ? {email: contact.email.trim()}
                : {phone: `+7 ${contact.phone.trim()}`}),
            contactMethod: contact.contactMethod,
        },
    };
}