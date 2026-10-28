import {hostReactAppReady} from "./utils/hostReactAppReady.js";

export default async function init() {
    await hostReactAppReady();
    const coralPictures = document.querySelectorAll("coral-pictorial");
    console.log(coralPictures);
    coralPictures.forEach((picture) => {
        const shadow = picture.shadowRoot;
        const visual = shadow.querySelector(".layer.visual");
        visual.style.aspectRatio = "unset";
    })
}