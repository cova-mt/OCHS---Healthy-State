import ScrollObserver from '/js/global/scroll-observer';

class BodyScrollTracker {
    constructor() {
        this.proxy = null;
        this.observer = null;
        this.eventDetail = { current: 0, last: 0 };
        this.scrollEvent = new CustomEvent('bodyScroll', { detail: this.eventDetail });
        this.init();
    }
    setObserver = () => {
        if (this.observer !== null) return;
        const top = this.proxy.clientHeight;
        const observer = new ScrollObserver(null, { steps: 300, rootMargin: `${top}px 0px -100% 0px` });
        observer.track(this.proxy, this.callback);
        observer.start();
        this.observer = observer;
        console.log('body scroll tracker set');
    }
    setProxy = () => {
        const hasProxy = document.getElementById('body-scroll-tracker');
        if (hasProxy) {
            this.proxy = hasProxy;
            window.requestAnimationFrame(this.setObserver);
        } else {
            const newProxy = document.createElement('div');
            newProxy.id = 'body-scroll-tracker';
            newProxy.role = 'none';
            this.proxy = newProxy;
            document.body.appendChild(newProxy);
            const checkDom = () => window.requestAnimationFrame(() => {
                this.proxy.clientHeight > 0 ? this.setObserver() : checkDom();
            });
            checkDom();
        }
    }
    callback = entry => {
        this.eventDetail.last = this.eventDetail.current
        this.eventDetail.current = entry.intersectionRatio.toFixed(4);
        document.body.dispatchEvent(this.scrollEvent);
    }
    debounce = (cb) => {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(cb, 500);
        }
    }
    handleResize = () => {
        if (!this.observer || this.blockCreate) return;
        !!this.observer.unobserve && this.observer.unobserve(this.proxy);
        this.observer.disconnect();
        console.log('reset body scroll tracker');
        this.observer = null;
        window.requestAnimationFrame(this.setProxy);
    }
    init = () => {
        this.setProxy();
        const debounceResize = this.debounce(this.handleResize);
        window.addEventListener('resize', debounceResize);
    }
}

export default BodyScrollTracker;