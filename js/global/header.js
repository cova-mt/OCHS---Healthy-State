import ScrollObserver from './scroll-observer.js';
class Header {
    constructor() {
        this.header = document.getElementById('site-header');
        this.main = document.querySelector('main');
        this.body = document.body;
        this.lastRatio = 0;
        this.lastOp = '';
        this.blockToggle = false;
        this.listen();
    }
    createOb = threshold => new ScrollObserver(threshold);
    getOp = entry => entry.isIntersecting ? 'remove' : 'add';

    toggleBackground(minimum) {
        const min = minimum ?? 50;
        let hasBg = false;
        const bgcb = e => {
            if (this.blockToggle) return
            const shouldHaveBg = window.scrollY > min;
            if (shouldHaveBg === hasBg) return;
            const op = shouldHaveBg ? 'add' : 'remove';
            this.header.classList[op]('bg');
            hasBg = shouldHaveBg;
        }
        document.body.addEventListener('bodyScroll', bgcb);
    }
    toggleSlim(refEl, threshold) {
        const ob = this.createOb(threshold);
        const cb = entry => { this.header.classList[this.getOp(entry)]('slim'); }
        ob.track(refEl, cb);
        ob.start();
    }
    toggleHide(minimum) {
        const min = minimum ?? 200;
        let isHidden = false;
        const cb = e => {
            if (this.blockToggle) return
            if (window.scrollY < min && !isHidden) return;
            const { current, last } = e.detail;
            const newState = current > last;
            if (isHidden === newState) return;
            isHidden = newState;
            return console.log(
                'Header is Hidden: ',
                this.header.classList.toggle('hide')
            );
        }
        document.body.addEventListener('bodyScroll', cb);
    }
    trackHeaderHeight() {
        const cb = () => {
            window.requestAnimationFrame(() => {
                // console.log('set header height', this.header.clientHeight);
                document.documentElement.style.setProperty('--header-height', this.header.clientHeight + 'px')
            });
        };
        const ob = new ResizeObserver(cb);
        ob.observe(this.header);
    }
    trackViewportHeight() {
        const cb = () => {
            window.requestAnimationFrame(() => {
                document.documentElement.style.setProperty('--vp-height', window.innerHeight + 'px');
            });
        };
        const ob = new ResizeObserver(cb);
        ob.observe(document.documentElement);
    }
    listen = () => {
        document.body.addEventListener('headerLock', () => this.blockToggle = true);
        document.body.addEventListener('headerUnlock', () => this.blockToggle = false);
    }
}

export default Header;