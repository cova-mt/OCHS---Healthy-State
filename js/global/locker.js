class ScrollLocker {
    constructor() {
        this.body = document.body;
        this.dataIds = [];
        this.isLocked = false;
        this.offset = 0;
        this.listen();
    }
    getIdList = () => {
        return this.dataIds = !this.body.dataset.lockId ? [] : this.body.dataset.lockId.split(' ');
    }
    setIdList = () => {
        return this.body.dataset.lockId = this.dataIds.join(' ');
    }
    getScrolled = () => {
        return this.body.className.includes('scrolled');
    }
    setAppHeight = () => {
        this.body.style.setProperty('--ios-height', window.innerHeight + 'px');
    };
    lock = (id) => {
        this.getIdList();
        this.dataIds.push(id);
        this.setIdList();
        if (this.dataIds.length > 1) { return true }
        this.offset = window.scrollY;
        this.isLocked = true;
        this.body.classList.add('locked');
        this.body.style.setProperty('--lock-offset', '-' + this.offset + 'px');
        setTimeout(this.setAppHeight, 200);
    }
    unlock = (id) => {
        this.getIdList();
        this.dataIds = id == '*' ? [] : this.dataIds.filter(i => i !== id);
        this.setIdList();
        if (this.dataIds.length > 0) { return false };
        this.isLocked = false;
        this.body.classList.remove('locked');
        window.scroll({ top: this.offset, behavior: 'instant' });
        return false;
    }
    listen = e => {
        const handleLock = e => this.lock(e.detail);
        const handleUnlock = e => this.unlock(e.detail);
        document.body.addEventListener('lock', handleLock);
        document.body.addEventListener('unlock', handleUnlock);
    }
}
export default ScrollLocker;