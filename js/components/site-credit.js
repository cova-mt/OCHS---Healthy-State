import { TweenMax } from "/js/vendor/greensock/TweenMax.js";

const siteCredit = () => {
    const e = document.querySelector(".site-credit-animated");
    e.addEventListener("mouseenter", function () {
        TweenMax.to(".site-credit-animated .created .words", 0.3, { x: -300 }),
            TweenMax.to(".site-credit-animated .created .swipe", 0.3, { y: 0 }),
            TweenMax.to(".site-credit-animated .created .placeholder", 0.5, { opacity: 0, delay: 0.3 }),
            TweenMax.to(".site-credit-animated .created .swipe", 0.5, { width: 2, delay: 0.3 }),
            TweenMax.to(".site-credit-animated .created .swipe", 0.4, { x: 233, opacity: 0, delay: 0.9 }),
            TweenMax.to(".site-credit-animated .logo-shapes rect", 0.4, { "stroke-dashoffset": 0 }),
            TweenMax.to(".site-credit-animated .logo-shapes circle", 0.4, { "stroke-dashoffset": 0 }),
            TweenMax.to(".site-credit-animated .logo-shapes circle:first-of-type", 0.6, { x: 15, y: -9, scale: 1.03, delay: 0.5 }),
            TweenMax.to(".site-credit-animated .logo-shapes circle:last-of-type", 0.6, { x: -26.5, y: 11, scale: 1.03, delay: 0.5 }),
            TweenMax.to(".site-credit-animated .logo-shapes circle", 0.8, { "stroke-width": 7, delay: 0.8 }),
            TweenMax.to(".site-credit-animated .logo-shapes circle", 0.6, { "stroke-width": 9, opacity: 0, delay: 1 }),
            TweenMax.to(".site-credit-animated .logo-shapes rect", 0.5, { opacity: 0, delay: 1 }),
            TweenMax.to(".site-credit-animated #mask2v2 rect", 0.4, { width: 234, delay: 0.9 }),
            TweenMax.to(".site-credit-animated .reveal", 0.5, { opacity: 1, delay: 0.9 }),
            TweenMax.to(".site-credit-animated .logic", 0.5, { opacity: 1, delay: 1.2 });
    }),
        e.addEventListener("mouseleave", function () {
            TweenMax.killAll(),
                TweenMax.to(".site-credit-animated .created .words", 0.3, { x: 0 }),
                TweenMax.to(".site-credit-animated .created .swipe", 0, { y: -105, x: 0, width: 233, opacity: 1 }),
                TweenMax.to(".site-credit-animated .created .placeholder", 0.3, { opacity: 1, delay: 0.3 }),
                TweenMax.to(".site-credit-animated .logo-shapes rect", 0, { "stroke-width": 2, "stroke-dashoffset": 237.6, x: 0, y: 0, opacity: 1 }),
                TweenMax.to(".site-credit-animated .logo-shapes circle", 0, {
                    "stroke-width": 2,
                    "stroke-dashoffset": 186.6,
                    x: 0,
                    y: 0,
                    opacity: 1,
                }),
                TweenMax.to(".site-credit-animated #mask2v2 rect", 0, { width: 0 }),
                TweenMax.to(".site-credit-animated .reveal", 0.5, { opacity: 0 }),
                TweenMax.to(".site-credit-animated .logic", 0.5, { opacity: 0 });
        });
};
export default siteCredit;
