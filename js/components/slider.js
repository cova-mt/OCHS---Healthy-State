class ClSlider {
    // opts = {targetSize | showMarkers}
    constructor(id, cTime, opts) {
        this.slider = document.getElementById(id);
        if (!this.slider) { return }
        this.target = opts && opts.targetSize || null;
        this.markers = opts && opts.showMarkers || false;
        this.id = id;
        this.slides = this.slider.getElementsByClassName('slide');
        this.frame = this.slider.getElementsByClassName('frame')[0];
        this.cTime = cTime || null;
        this.sNum = 0;
        this.swipe = { start: 0, end: 0, distance: 0 };
        this.inter = null;
        this.cycling = false;
        this.focused = false;
        this.init();
    }

    init = () => {
        this.slider.style.setProperty('--length', this.slides.length);
        this.setUp();
        this.slider.classList.add('ready');
        this.cycle();
        let focusOut = () => {
            console.log('blur');
            this.focused = false;
        }
        let focusinStop = () => {
            console.log('focusin');
            this.focused = true;
            this.cycleStop();
        }
        let mouseoverStop = () => {
            console.log('mouseover');
            this.cycleStop();
        }
        let mouseleaveStart = () => {
            if (this.focused) return;
            console.log('mouseleave && not this.focused');
            this.cycle();
        }
        window.addEventListener('touchmove', e => {
            console.log('touchmove  ');
            if (!e.target.closest('#' + this.id)) { return }
            e.preventDefault();
            this.swipeShift(e);
        }, { passive: false })


        this.slider.addEventListener('click', this.handleClick);

        this.slider.addEventListener('mouseover', mouseoverStop);
        this.slider.addEventListener('mouseleave', mouseleaveStart);
        this.slider.addEventListener('focusout', focusOut);
        this.slider.addEventListener('focusin', focusinStop);
        this.slider.addEventListener('focusout', this.cycle);
        this.frame.addEventListener('touchstart', this.swipeStart);
        this.frame.addEventListener('touchend', this.swipeEnd);

        if (this.up != null) {
            const resizeOb = new ResizeObserver(this.setUp);
            resizeOb.observe(this.frame);
        }
        return 'ready';
    }
    setUp = () => {
        this.up = this.target == null ? 1 : Math.round(this.frame.clientWidth / this.target);
        this.buildMarkers();
        this.frame.firstElementChild.className = "frame-inner" + (this.up > 1 ? " multi" : "");
        this.slider.style.setProperty('--up', this.up);
    }
    buildMarkers() {
        if (!this.markers) { return };
        if (this.markers === true) {
            this.markers = document.createElement('DIV');
            this.markers.className = 'markers';
            this.frame.append(this.markers);
        }
        this.markers.innerHTML = '';
        for (let i = 0; i <= this.slides.length - this.up; i++) {
            let node = document.createElement('span');
            this.markers.appendChild(node);
            if (i == this.sNum) { node.className = 'active' }
            node.dataset.position = i;
        };
    }
    handleClick = e => {
        if (!!e.target.closest('.prev')) {
            this.sNum--;
            this.slide();
            return;
        }
        if (!!e.target.closest('.next')) {
            this.sNum++;
            this.slide();
            return;
        }
        if (!!e.target.closest('.markers')) {
            let pos = e.target.dataset.position;
            if (pos == null) { return }
            this.sNum = pos;
            this.slide()
        }
    }
    swipeShift = e => {
        this.swipe.distance = e == 0 ? 0 : this.swipe.start - e.changedTouches[0].clientX;
        this.frame.style.setProperty('--shift', (-1 * this.swipe.distance) + 'px');

    }
    swipeStart = e => {
        console.log('swipeStart');
        this.swipe.start = e.touches[0].clientX;
        this.frame.classList.add('drag');
        this.cycleStop();
    }
    swipeEnd = e => {
        console.log('swipend');
        this.swipe.end = e.changedTouches[0].clientX;
        this.swipe.distance = this.swipe.start - this.swipe.end;
        if (this.swipe.distance > 75) { this.sNum++ }
        else if (this.swipe.distance < -75) { this.sNum-- }
        else {
            this.swipeShift(0);
            this.cycle();
            return;
        }
        this.frame.classList.remove('drag');
        this.swipeShift(0);
        this.slide();
        this.cycle();
    }
    slide = () => {
        let total = this.up > 1 ? this.slides.length - (this.up - 1) : this.slides.length;
        let raw = this.sNum % total
        let position = raw < 0 ? total + raw : raw;
        this.frame.style.setProperty('--position', position);
        if (!this.markers) { return }
        [...this.markers.children].forEach((m, i) => m.className = i == position ? 'active' : '');
    }
    cycleStop = () => {
        window.clearInterval(this.inter);
        this.cycling = false;
    }
    cycle = () => {
        if (this.cycling) { return }
        this.inter = window.setInterval(() => {
            this.sNum++;
            this.slide();
        }, this.cTime);
        this.cycling = true;
    }
}

export default ClSlider;