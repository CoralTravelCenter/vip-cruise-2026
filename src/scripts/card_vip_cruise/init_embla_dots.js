import EmblaCarousel from 'embla-carousel';
import { addDotButtonAndClickHandlers } from '../embla_carousel/embla-buttons.js';

export function init_embla_dots() {
    const containerNode = document.querySelector('#embla-viewport');
    const viewportNode = containerNode.parentElement;
    const mobileMedia = window.matchMedia('(max-width: 767px)');
    let emblaApi;
    const dotsNode = document.querySelector('.embla__dots');

    const updateCarousel = () => {
        if (mobileMedia.matches) {
            emblaApi = EmblaCarousel(viewportNode, {
                container: containerNode,
                align: 'start'
            })
            addDotButtonAndClickHandlers(emblaApi, dotsNode);
        } else {
            emblaApi?.destroy()
            emblaApi = undefined
            dotsNode.replaceChildren()
        }
    }

    mobileMedia.addEventListener('change', updateCarousel);
    updateCarousel();
}