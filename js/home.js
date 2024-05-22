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
const HPSO = new SO(.5, { rootMargin: '0px 0px -5% 0px' });
const scrollCB = ({ target, isIntersecting }) => {
    target.dataset.in = isIntersecting;
}
// paths:
HPSO.track(document.querySelector('.hp-hero'), scrollCB);
HPSO.track(document.querySelector('.intro'), scrollCB);
HPSO.track(document.querySelector('.intro-path-box'), scrollCB);
HPSO.track(document.querySelector('.strat-path-box'), scrollCB);
const videopaths = document.querySelectorAll('.testimonial-path-box');
videopaths.forEach(s => HPSO.track(s, scrollCB));
HPSO.track(document.querySelector('.form-path-box'), scrollCB);
HPSO.start();

// arrow scroll
const priorityGrid = document.querySelector('.priority-grid');
const handleClick = e => {
    let target = e.target.closest('a');
    if (target) return;
    target = e.target.closest('.priority-card');
    target.classList.add('expanded');
}
priorityGrid.addEventListener('click', handleClick);


// path math:
const watchPathLength = (className, prop, parent) => {
    const path = document.querySelector(className);
    const p = !!parent ? document.querySelector(parent) : path.parentElement;
    const setLength = () => {
        let length = path.clientWidth;
        if (path.children[0].tagName === 'polyline') length += path.clientHeight;
        p.style.setProperty("--" + prop, length + 'px');
    }
    const RO = new ResizeObserver(setLength);
    RO.observe(p);
}

watchPathLength('.intro-path2', 'l1l');
watchPathLength('.strat-path2', 'l2l');
watchPathLength('.testimonial-path1', 'l1l', '#videoSlider');
watchPathLength('.form-path2', 'l2l');