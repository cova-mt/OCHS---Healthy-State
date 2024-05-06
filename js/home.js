import Slider from './components/slider.js';
// page sliders
new Slider('videoSlider', 0, { showMarkers: true });
new Slider('partnerCarousel', 0, { targetSize: 220 });

// manage priority area card heights for hover effect
const paCardDetails = document.querySelectorAll('.priority-card .collapsed-inner');
const setMinHeight = (card) => {
    const dets = card.closest('.details');
    const h = card.scrollHeight - dets.firstElementChild.clientHeight;
    dets.style.setProperty('--ch', `${h}px`);
}
const setAllpMinHeigh = () => { paCardDetails.forEach(setMinHeight) };
const RO = new ResizeObserver(setAllpMinHeigh);
RO.observe(document.querySelector('.priority-grid'));

