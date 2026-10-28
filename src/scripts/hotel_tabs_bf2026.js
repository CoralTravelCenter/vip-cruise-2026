import {scrollHotelTabs} from "./hotel_tabs_logic/hotel_tabs_scroll.js";
import {resetListHotels} from "./hotel_tabs_logic/resetListHotels.js";

export default function init() {
    scrollHotelTabs();
    resetListHotels();
}
