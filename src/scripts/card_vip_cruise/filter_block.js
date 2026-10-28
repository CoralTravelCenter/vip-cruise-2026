function filter_country(country) {
    document.dispatchEvent(new CustomEvent('prefer-region', { detail: { regionName: country } }))
}

export function filter_block() {
    document.addEventListener('click', function(event) {
        const button = event.target.closest('coral-button[data-country-s-button]');

        if (button) {
            const target = document.querySelector('.hotel_tabs_bf2026');
            const country = button.getAttribute('data-country-s-button');
            filter_country(country);
            target.scrollIntoView({
                behavior: "smooth",
                block: 'start'
            });
        }
    });
}
