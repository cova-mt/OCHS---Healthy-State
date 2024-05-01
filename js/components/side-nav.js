class SideNavManager {
    constructor(id) {
        this.nav = document.getElementById(id);
        if (!this.nav) { return }
        this.id = id;
        this.subGroups = this.nav.getElementsByClassName('sub-group');
        this.uls = this.nav.getElementsByTagName('ul');
        this.lis = this.nav.getElementsByTagName('li');
        this.anchors = this.nav.querySelectorAll('li > a');
        this.lockEvent = new CustomEvent('lock', { detail: 'side-nav' });
        this.unlockEvent = new CustomEvent('unlock', { detail: 'side-nav' });
        this.headerLockEvent = new Event('headerLock');
        this.headerUnlockEvent = new Event('headerUnlock');
        this.init();
    }
    setAtts = () => {
        // all li elements get role of none
        for (const ul of this.uls) { ul.role = 'none' }
        for (const li of this.lis) { li.role = 'none' }
        for (const a of this.anchors) { a.role = 'menuitem' }
    }
    createOpenButton = link => {
        const button = document.createElement('BUTTON');
        link.after(button);
        return button;
    }
    prepSubGroups = () => {
        let i = 1;
        for (const group of this.subGroups) {
            group.id = this.id - 'sgn-' + i;
            const prev = group.previousElementSibling;
            const str = prev.textContent.replace(/\s\s+/g, ' ').trim();
            // get or make open button
            const openBtn = prev.tagName == "A" ? this.createOpenButton(prev) : prev;
            openBtn.classList.add('sub-open');
            openBtn.ariaLabel = "open " + str + " subnav"
            openBtn.ariaExpanded = false;
            openBtn.ariaHasPopup = true;
            openBtn.setAttribute('aria-controls', group.id);
            // make back button
            const closeBtn = document.createElement('BUTTON');
            closeBtn.className = 'sub-close';
            closeBtn.ariaLabel = "close " + str + " subnav"
            closeBtn.ariaHasPopup = true;
            closeBtn.ariaExpanded = false;
            closeBtn.setAttribute('aria-controls', group.id);
            closeBtn.textContent = 'Back';

            // attach label and closeButton
            group.role = 'none';
            group.prepend(closeBtn);
            i++;
        }
    }
    nextFrame = cb => new Promise(resolve => {
        cb();
        window.requestAnimationFrame(resolve);
    });
    toggleDrawer = () => {
        const buttons = document.querySelectorAll(`[aria-controls="${this.id}"]`);
        const isOpen = this.nav.classList.toggle('open');
        buttons.forEach(b => { b.ariaExpanded = isOpen });
        // fire events to keep jank down:
        const f1 = this.nextFrame(() => document.body.dispatchEvent(this.headerLockEvent));
        const f2 = this.nextFrame(() => document.body.dispatchEvent(isOpen ? this.lockEvent : this.unlockEvent));
        const f3 = this.nextFrame(() => document.body.dispatchEvent(this.headerUnlockEvent));
        f1.then(f2).then(f3);
        return

    }
    toggleMenu = ref => {
        const menuId = ref.getAttribute('aria-controls');
        if (menuId == this.id) return this.toggleDrawer()
        const isOpen = !(ref.ariaExpanded === 'true');
        console.log(ref, isOpen);
        const buttons = document.querySelectorAll(`[aria-controls="${menuId}"]`);
        buttons.forEach(b => { b.ariaExpanded = isOpen });
        if (this.nav.scrollTop > 0) { this.nav.scrollTo(0, 0); }
    }
    watchClick = e => {
        let el = e.target.closest(`#${this.id}-close-trigger, .sub-open, .sub-close`);
        if (el) { return this.toggleMenu(el) };
        el = e.target.closest(`#${this.id}`);
        if (el) { return }
        if (this.nav.classList.contains('open')) { this.toggleDrawer() }
    }
    init = () => {
        this.setAtts();
        this.prepSubGroups();
        this.nav.addEventListener('click', this.watchClick);
        document.getElementById(`${this.id}-open-trigger`).addEventListener('click', this.toggleDrawer);
    }
}
class SideNavActive {
    constructor(id, activeCB) {
        this.nav = document.getElementById(id);
        if (!this.nav) { return }
        this.navLinks = [...this.nav.getElementsByTagName('a')];
        this.hrefs = this.navLinks.map(l => l.getAttribute('href'));
        this.current = window.location.pathname;
        this.activeItem = this.findActive();
        this.postActiveCallback = activeCB;
        this.setActiveClasses();

    }
    findActive = () => {
        if (this.current == '/') { return }
        let index = this.hrefs.findIndex(h => h.includes(this.current));
        if (index == -1) return null;
        return this.navLinks[index];
    }
    setActiveClasses = () => {
        if (!this.activeItem) { return }
        this.activeItem.classList.add('active');
        const activeTop = this.activeItem.closest('.top-item');
        activeTop.firstElementChild.classList.add('active');
        if (!this.postActiveCallback) { return }
        this.postActiveCallback(activeTop.querySelector('button'));
    }
}

export { SideNavManager, SideNavActive };