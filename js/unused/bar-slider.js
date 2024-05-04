class ClBarSlider {
    constructor(id) {
        this.slider = document.getElementById(id);
        if (!this.slider) return console.error(`there is no bar slider with the id: ${id}`);
        this.ul = this.slider.querySelector('[data-position]');
        this.articleBox = this.slider.querySelector('.article-group');
        this.currentEl = this.slider.querySelector('.current');
        this.rotationTime = 5;
        this.currentPosition = 1;
        this.maxPostions = 4;
        this.allStop = false;
        this.counter = 0;
        this.init();
    }
    callback = () => {
        this.ul.style.setProperty('--bar-width', this.ul.offsetWidth + 'px');
        this.ul.style.setProperty('--bar-height', this.ul.offsetHeight + 'px');
    }
    cycle = () => {
        this.currentPosition >= this.maxPostions ? this.currentPosition = 1 : this.currentPosition++;
        this.ul.dataset.position = this.currentPosition;
        this.currentEl.textContent = this.currentPosition;
    }
    interval = (cb, secs) => {
        const limit = secs * 60; // est frame rate of 60fps
        const runner = () => {
            this.counter = (this.counter < limit) ? this.counter + 1 : 0;
            let percent = String((this.counter / limit) * 100) + '%';
            this.currentEl.style.setProperty('--timer', percent);
            (this.counter === 0) && cb();
            if (this.allStop) return;
            window.requestAnimationFrame(runner);
        }
        runner();
    }
    stop = () => {
        this.allStop = true;
    }
    start = () => {
        if (this.allStop == false) return; // prevents multiple cycles
        this.allStop = false;
        this.interval(this.cycle, this.rotationTime);
    }
    handleFocus = (e) => {
        this.stop();
        const target = e.target.closest('article');
        const group = target.parentElement;
        this.currentPosition = [...group.children].indexOf(target) + 1;
        this.ul.dataset.position = this.currentPosition;
        this.currentEl.textContent = this.currentPosition;
        this.counter = 0;
    }
    handleSelect = e => {
        const target = e.target.closest('li');
        if (!target) return;
        this.currentPosition = [...this.ul.children].indexOf(target) + 1;
        console.log('clicked', this.currentPosition);
        this.counter = 0;
        this.ul.dataset.position = this.currentPosition;
        this.currentEl.textContent = this.currentPosition;
    }
    init = () => {
        const resizeObserver = new ResizeObserver(this.callback);
        resizeObserver.observe(this.ul);
        this.articleBox.addEventListener('mouseenter', this.stop);
        this.articleBox.addEventListener('mouseleave', this.start);
        this.articleBox.addEventListener('focusin', this.handleFocus);
        this.articleBox.addEventListener('focusout', this.start);
        this.ul.addEventListener('click', this.handleSelect);
    }
}
export default ClBarSlider;