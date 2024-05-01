class ClCollapsable {
    constructor(selector) {
        this.list = [...document.querySelectorAll(selector)];
        this.observer = null;
        this.init();
    }
    init = () => {
        if (this.list.length == 0) { return }
        let obs = new ResizeObserver(this.handleResize);
        this.list.forEach(li => {
            obs.observe(li);
            let toggle = () => { li.classList.toggle('open'); }
            li.firstElementChild.addEventListener('click', toggle);
        });
        this.observer = obs;
    }
    handleResize = entries => {
        entries.forEach(e => {
            let height = e.target.lastElementChild.scrollHeight;
            e.target.style.setProperty('--content-height', height + 'px');
        });
    }

}

export default ClCollapsable