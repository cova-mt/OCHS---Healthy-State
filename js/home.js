import Slider from './components/slider.js';
import SO from './global/scroll-observer.js';

// page sliders
new Slider('videoSlider', 0, { showMarkers: true });
new Slider('partnerCarousel', 5000, { targetSize: 220 });

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

// page scroll observer
const HPSO = new SO(.9, { rootMargin: '0px 0px -5% 0px' });
const scrollCB = ({ target, isIntersecting }) => {
    target.dataset.in = isIntersecting;
}
// all slides:
const slides = document.querySelectorAll('.slide');
slides.forEach(s => HPSO.track(s, scrollCB));
// other sections:
HPSO.track(document.querySelector('.intro-path-box'), scrollCB);
HPSO.track(document.querySelector('.strat-path'), scrollCB);
HPSO.track(document.querySelector('.form-path'), scrollCB);
HPSO.start();