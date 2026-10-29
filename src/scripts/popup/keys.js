export const FIELD_ERRORS = {
    name: "Введите имя",
    phone: "Введите номер телефона",
    email: "Введите корректный email",
    contactMethod: "Выберите способ связи",
    personalDataConsent: "Подтвердите согласие на обработку персональных данных",
    marketingConsent: "Подтвердите согласие на получение новостей и предложений",
};

export const CONTACT_METHODS = ["call", "max", "telegram", "whatsapp", "email"];
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const instances = new WeakMap();