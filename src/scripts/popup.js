import {hostReactAppReady} from "./utils/hostReactAppReady.js";
import {FIELD_ERRORS, instances} from "./popup/keys.js";
import {formatPhoneInput} from "./popup/formatPhoneInput.js";
import {validateContact} from "./popup/validateContact.js";
import {buildManagerLeadPayload} from "./popup/buildManagerLeadPayload.js";
import {readContact} from "./popup/readContact.js";

export default async function init() {
    await hostReactAppReady();
    if (!document.getElementById("coral-popup-kapsula")) {
        const template = document.querySelector("#form-template");
        if (!template) {return;}
        document.body.append(template.content.cloneNode(true));
    }
    await customElements.whenDefined("coral-popup");

    return initPopupForm({
        triggerSelector: "#form-trigger",
        endpoint: "https://postman.trip-mate.ru/cruise-manager-lead-mail",
        subject: "Заявка - круизы",
        to: "tourist.cruise@coral.ru",
    });

    /** Инициализировать после вставки popup.html и регистрации coral-popup. */
    function initPopupForm({
                               popup = document.getElementById("coral-popup-kapsula"),
                               triggerSelector = "[data-popup-form-open]",
                               endpoint = "",
                               subject = "",
                               to = "",
                               fetchImpl = globalThis.fetch.bind(globalThis),
                           } = {}) {
        if (!popup) throw new Error("Не найден coral-popup-kapsula");
        if (instances.has(popup)) return instances.get(popup);
        if (typeof popup.show !== "function") throw new Error("Сначала зарегистрируйте coral-popup с методом show()");
        const form = popup.querySelector("[data-kapsula-popup-form]");
        if (!form) throw new Error("Не найдена форма попапа");
        const success = popup.querySelector("[data-kapsula-popup-success]");
        const submitButton = form.querySelector('[type="submit"]');
        const submitError = form.querySelector("[data-kapsula-popup-submit-error]");
        let pending = false;
        let destroyed = false;
        let requestController;

        function setState(state) {
            popup.dataset.state = state;
            success.hidden = state !== "success";
        }
        function setSubmitError(message = "") {
            submitError.textContent = message;
            submitError.hidden = !message;
        }
        function setPending(value) {
            pending = value;
            form.dataset.pending = String(value);
            form.setAttribute("aria-busy", String(value));
            submitButton.disabled = value;
        }
        function setFieldError(name, message = "") {
            const control = form.elements.namedItem(name);
            const wrapper = name === "contactMethod"
                ? form.querySelector("fieldset")
                : control?.closest(".kapsula-popup-form__field");
            if (wrapper) {
                if (message) wrapper.dataset.invalid = "true";
                else delete wrapper.dataset.invalid;
                wrapper.querySelectorAll("input").forEach((input) => input.setAttribute("aria-invalid", String(Boolean(message))));
            }
            const error = form.querySelector(`[data-field-error="${name}"]`);
            if (error) error.textContent = message;
        }
        function renderContact() {
            const field = form.elements.namedItem("contactMethod").value === "email" ? "email" : "phone";
            const container = form.querySelector("[data-kapsula-contact-field]");
            if (container.dataset.field === field) return;
            const template = form.querySelector(`[data-kapsula-${field}-template]`);
            container.replaceChildren(template.content.cloneNode(true));
            container.dataset.field = field;
        }
        function open() {
            if (destroyed) return;
            // Не переключаем экран во время уже отправляемого запроса.
            if (!pending) {
                setState("form");
                setSubmitError();
            }
            popup.show();
        }
        function onTrigger(event) {
            if (!(event.target instanceof Element) || !event.target.closest(triggerSelector)) return;
            event.preventDefault();
            open();
        }
        function onInput(event) {
            const input = event.target;
            if (!(input instanceof HTMLInputElement)) return;
            if (input.name === "phone") input.value = formatPhoneInput(input.value);
            if (input.name in FIELD_ERRORS) setFieldError(input.name);
        }
        function onChange(event) {
            if (!(event.target instanceof HTMLInputElement)) return;
            if (event.target.name === "contactMethod") renderContact();
            if (event.target.name in FIELD_ERRORS) setFieldError(event.target.name);
        }
        async function onSubmit(event) {
            event.preventDefault();
            if (pending || destroyed) return;
            const contact = readContact(form);
            const errors = validateContact(contact);
            Object.keys(FIELD_ERRORS).forEach((name) => setFieldError(name, errors[name]));
            if (Object.keys(errors).length) return;
            setSubmitError();
            requestController = new AbortController();
            setPending(true);
            try {
                if (!endpoint || !subject || !to) throw new Error("Настройте endpoint, subject и to");
                const response = await fetchImpl(endpoint, {
                    method: "POST",
                    headers: {Accept: "application/json", "Content-Type": "application/json"},
                    body: JSON.stringify(buildManagerLeadPayload({contact, subject, to})),
                    signal: requestController.signal,
                });
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                if ((response.headers.get("content-type") ?? "").includes("application/json")) await response.json();
                if (!destroyed) setState("success");
            } catch (error) {
                if (!destroyed) setSubmitError("Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.");
            } finally {
                if (!destroyed) setPending(false);
            }
        }

        setState("form");
        setPending(false);
        renderContact();
        Object.keys(FIELD_ERRORS).forEach((name) => setFieldError(name));
        form.addEventListener("input", onInput);
        form.addEventListener("change", onChange);
        form.addEventListener("submit", onSubmit);
        document.addEventListener("click", onTrigger);
        const api = {
            open,
            destroy() {
                destroyed = true;
                requestController?.abort();
                setPending(false);
                form.removeEventListener("input", onInput);
                form.removeEventListener("change", onChange);
                form.removeEventListener("submit", onSubmit);
                document.removeEventListener("click", onTrigger);
                instances.delete(popup);
            },
        };
        instances.set(popup, api);
        return api;
    }
}
