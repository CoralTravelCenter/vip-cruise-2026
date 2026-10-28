import {hostReactAppReady} from "./utils/hostReactAppReady.js";

export default async function init() {
    await hostReactAppReady();
    const mediaAsset = window.matchMedia("(min-width: 1072px)").matches;
    console.log(mediaAsset);
    if (mediaAsset) {
        const coralPictures = document.querySelectorAll("coral-pictorial");
        coralPictures.forEach((picture) => {
            const shadow = picture.shadowRoot;
            const visual = shadow.querySelector(".layer.visual");
            visual.style.aspectRatio = "unset";
        })
    }
}