class ClExpandOne {
    constructor(targId, propStr) {
        this.trigger = document.querySelector(`[aria-controls=${targId}]`);
        if (!this.trigger) return;
        this.target = document.getElementById(targId);
        this.propStr = propStr || 'open-height';
        this.isOpen = (String(this.target.dataset.open) === 'true') || false;
        this.onChange = false;
        this.headerLockEvent = new Event('headerLock');
        this.headerUnlockEvent = new Event('headerUnlock');
        this.init();
    }
    toggle = () => {
        document.body.dispatchEvent(this.headerLockEvent);
        window.requestAnimationFrame(() => {
            this.isOpen = !this.isOpen;
            this.trigger.setAttribute('aria-expanded', this.isOpen);
            this.target.dataset.open = this.isOpen;
            this.beforeChange && this.beforeChange();
        });
    }
    setHeight = () => {
        const height = this.target.scrollHeight;
        this.target.style.setProperty('--' + this.propStr, height + 'px');
    }
    handleTransitionEnd = () => {
        this.afterChange && this.afterChange();
        window.requestAnimationFrame(() => {
            document.body.dispatchEvent(this.headerUnlockEvent);
        });
    }
    init = () => {
        this.setHeight();
        this.trigger.addEventListener('click', this.toggle);
        this.target.addEventListener('transitionend', this.handleTransitionEnd);
        const obs = new ResizeObserver(this.setHeight);
        obs.observe(this.target);
    }

}
export default ClExpandOne;