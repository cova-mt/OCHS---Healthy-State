class ClSearchOverlay {
    constructor() {
        this.open = document.getElementById('site-search-open');
        this.close = document.getElementById('site-search-close');
        this.overlay = document.getElementById('search-overlay');
        this.isOpen = false;
        // this.lockEvent = new CustomEvent("lock", { detail: { type: "search", isOpen: this.isOpen } });
        this.lockEvent = new CustomEvent("lock", { detail: "search" });
        this.unlockEvent = new CustomEvent("unlock", { detail: "search" });
        this.init();
    }
    toggle = () => {
        this.isOpen = !this.isOpen
        this.overlay.dataset.open = this.isOpen;
        this.open.setAttribute('aria-expanded', this.isOpen);
        this.close.setAttribute('aria-expanded', this.isOpen);
        const event = this.isOpen ? this.lockEvent : this.unlockEvent;
        document.body.dispatchEvent(event);
        const focusTarget = this.isOpen ? this.close : this.open;
        focusTarget.focus();
    }

    handleKeyPress = e => {
        if (!this.isOpen) { return }
        if (e.key === 'Escape') this.toggle();
    }
    init = () => {
        this.open.addEventListener('click', this.toggle);
        this.close.addEventListener('click', this.toggle);
        document.body.addEventListener('keyup', this.handleKeyPress);
    }
}
export default ClSearchOverlay;