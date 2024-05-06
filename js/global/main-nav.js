class NavManager {
    constructor() {
        this.nav = document.getElementById('main-nav');
        if (!this.nav) { return }
        this.id = 'main-nav';
        this.header = document.getElementById('site-header');
        this.openBtn = document.getElementById('mobile-open-trigger');
        this.closeBtn = document.getElementById('mobile-close-trigger');
        this.topItems = [...this.nav.getElementsByClassName('top-item')];
        this.subGroups = this.nav.getElementsByClassName('sub-group');
        this.uls = this.nav.querySelectorAll('ul');
        this.lis = this.nav.getElementsByTagName('li');
        this.anchors = this.nav.querySelectorAll('li > a');
        this.lockEvent = new CustomEvent('lock', { detail: 'main-nav' });
        this.unlockEvent = new CustomEvent('unlock', { detail: 'main-nav' });
        this.headerLockEvent = new Event('headerLock');
        this.headerUnlockEvent = new Event('headerUnlock');
        this.init();
    }
    setAtts = () => {
        // assign all roles;
        for (const ul of this.uls) { ul.role = 'none' }
        for (const li of this.lis) { li.role = 'none' }
        for (const a of this.anchors) { a.role = 'menuitem' }
        // assign main button aria states
        [this.openBtn, this.closeBtn].forEach(b => {
            b.ariaExpanded = false;
            b.ariaHasPopup = true;
        });
    }
    createOpenButton = link => {
        const button = document.createElement('BUTTON');
        link.after(button);
        return button;
    }
    setFlyoutHeight = () => {
        this.topItems.forEach(li => {
            const sList = li.querySelector('.sub-list');
            if (!sList) { return }
            console.log('li', li);
            const subListHeight = sList.scrollHeight;
            li.style.setProperty('--sub-height', subListHeight + 'px');


        });
    }
    watchFlyoutOffset = () => {
        const setFlyoutOffset = () => {
            const flyouts = this.nav.querySelectorAll('.top-item > .sub-group');
            flyouts.forEach(flyout => {
                const rect = flyout.getBoundingClientRect();
                const right = window.innerWidth - rect.right;
                const offset = Math.min(rect.left, right);
                if (offset >= 0) return;
                flyout.style.setProperty('--flyout-offset', offset + 'px');
            });
        }
        const resizeObserver = new ResizeObserver(setFlyoutOffset);
        resizeObserver.observe(document.body);
    }
    addAnimIndex = () => {
        this.topItems.forEach(group => {
            const groupUls = group.querySelectorAll('.sub-list.container > li > .sub-group > ul');
            groupUls.forEach((ul, i) => {
                ul.style.setProperty("--animIndex", i + 1);
            });
            this.uls.forEach(ul => {
                [...ul.children].forEach((li, i) => {
                    li.style.setProperty("--liAnimIndex", i + 1)
                });
            });
        });
    }
    prepSubGroups = () => {
        let i = 1;
        for (const group of this.subGroups) {
            group.id = 'sgn-' + i;
            const prev = group.previousElementSibling;
            const str = prev.textContent.replace(/\s\s+/g, ' ').trim();
            // get or make open button
            const openBtn = prev.tagName == "A" ? this.createOpenButton(prev) : prev;
            openBtn.classList.add('sub-open');
            openBtn.ariaLabel = "open " + str + " subnav";
            openBtn.ariaExpanded = false;
            openBtn.ariaHasPopup, true;
            openBtn.setAttribute('aria-controls', group.id);
            // make back button
            const closeBtn = document.createElement('BUTTON');
            closeBtn.className = 'sub-close';
            closeBtn.ariaLabel = "close " + str + " subnav";
            closeBtn.ariaHasPopup, true;
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
        const buttons = [this.openBtn, this.closeBtn];
        const isOpen = !(buttons[0].ariaExpanded === 'true');
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
        const isOpen = !(ref.ariaExpanded === 'true');
        console.log(ref, isOpen);
        this.closeSiblings(ref);
        const buttons = document.querySelectorAll(`[aria-controls="${menuId}"]`);
        buttons.forEach(b => { b.ariaExpanded = isOpen });
        if (this.nav.scrollTop > 0) { this.nav.scrollTo(0, 0); }
    }
    closeSiblings = ref => {
        const rootList = ref.closest('.top-list, .sub-list');
        if (!rootList) { return }
        const allOpen = rootList.querySelectorAll('button[aria-expanded=true]');
        for (const open of allOpen) { open.ariaExpanded = "false" }
    }
    closeParent = ref => {
        ref.ariaExpanded = false;
        const ul = document.getElementById(ref.getAttribute('aria-controls'));
        const btn = ul.previousElementSibling;
        this.toggleParentLock(btn, true);
        btn.ariaExpanded = false;
        btn.focus();
        if (btn.id == 'mobile-close-trigger') this.toggleDrawer();
    }
    watchClick = e => {
        let el = e.target.closest('.sub-open, .sub-close');
        if (el) { return this.toggleMenu(el) };
        el = e.target.closest('#header-nav-group');
        if (el) { return }
        if (this.openBtn.ariaExpanded == 'true') { this.toggleDrawer() }
    }
    moveFocusDesktop = (ref, dir) => {
        const li = ref.parentElement;
        if (li.tagName !== 'LI') { return }
        const isTop = li.parentElement == this.uls[0];
        var next, localNext, style, isHidden;
        switch (dir) {
            case 'up':
                next = li.previousElementSibling;
                style = next && window.getComputedStyle(next);
                isHidden = style && style.getPropertyValue('display') == 'none';
                if (!next || isHidden) {
                    if (isTop) { return }
                    const parent = li.closest('[class*=nav-list');
                    this.toggleMenu(parent.previousElementSibling);
                    localNext = parent.parentElement.querySelector('button');
                }
                break;
            case 'down':
                const hasChildren = (ref.tagName == 'BUTTON') && li.querySelector('[class*=nav-list');
                if (hasChildren) {
                    this.toggleMenu(ref);
                    next = hasChildren.children[1];
                    break;
                }
                if (isTop && !hasChildren) { return }
                next = li.nextElementSibling;
                if (!next) {
                    next = li.parentElement.children[0];
                }
                break;
            case 'right':
                localNext = ref.nextElementSibling;
                if (!localNext || localNext.tagName == 'UL') {
                    if (!isTop) { return }
                    localNext = null;
                    next = li.nextElementSibling;
                    if (!next) {
                        next = li.parentElement.children[1];
                    }
                }
                break;
            case 'left':
                localNext = ref.previousElementSibling;
                style = localNext && window.getComputedStyle(localNext);
                isHidden = style && style.getPropertyValue('display') == 'none';
                if (!localNext || isHidden) {
                    if (!isTop) { return }
                    localNext = li.previousElementSibling.querySelector('a + button');
                    if (localNext && localNext.parentElement != li.previousElementSibling) { localNext = false };
                    next = !localNext ? li.previousElementSibling : false;
                    if (!localNext && (!next || next.className == 'back')) {
                        next = li.parentElement.lastElementChild;
                    }
                }
                break;
        }
        if (localNext) { return localNext.focus(); }
        if (next) { return next.firstElementChild.focus(); }
    }
    moveFocusMobile = (ref, dir) => {
        const isTopTrigger = ref.className == 'top-nav-trigger';
        var li, next, localNext, isTop;
        if (!isTopTrigger) {
            li = ref.parentElement;
            if (li.tagName !== 'LI') { return }
            isTop = li.parentElement == this.uls[0];
        }
        switch (dir) {
            case 'up':
                if (isTopTrigger) { return }
                next = li.previousElementSibling;
                if (!next) { next = li.parentElement.lastElementChild; }
                break;
            case 'down':
                if (isTopTrigger) { return }
                next = li.nextElementSibling;
                if (!next) { next = li.parentElement.children[0]; }
                break;
            case 'right':
                if (ref.className.includes('nav-trigger')) {
                    this.toggleMenu(ref);
                    next = ref.nextElementSibling.firstElementChild;
                    break;
                }
                localNext = ref.nextElementSibling;
                break;
            case 'left':
                if (isTopTrigger) { return }
                localNext = ref.previousElementSibling;
                if (!localNext) {
                    localNext = li.parentElement.previousElementSibling;
                    this.toggleMenu(localNext);
                }
                break;
        }
        if (localNext) { return localNext.focus(); }
        if (next) { return next.firstElementChild.focus(); }
    }
    watchKeys = e => {
        const focused = document.activeElement;
        const op = window.innerWidth > 991 ? this.moveFocusDesktop : this.moveFocusMobile;
        switch (e.code) {
            case 'Escape':
                if (this.open.ariaExpanded !== 'true') return;
                const list = focused.closest('[class*=nav-list]');
                const back = list.getElementsByClassName('nav-back')[0];
                return this.closeParent(back);
            case 'ArrowUp':
                return op(focused, 'up');
            case 'ArrowDown':
                return op(focused, 'down');
            case 'ArrowRight':
                return op(focused, 'right');
            case 'ArrowLeft':
                return op(focused, 'left');
            default:
                break;
        }
    }
    init = () => {
        this.setAtts();
        this.prepSubGroups();
        this.addAnimIndex();
        this.setFlyoutHeight();
        this.watchFlyoutOffset();
        this.nav.addEventListener('click', this.watchClick);
        this.openBtn.addEventListener('click', this.toggleDrawer);
        this.closeBtn.addEventListener('click', this.toggleDrawer);
        this.header.addEventListener('keyup', this.watchKeys);
        this.header.addEventListener('keydown', e => {
            if (e.code.includes('Arrow')) { e.preventDefault() }
        });

    }
}

export default NavManager;