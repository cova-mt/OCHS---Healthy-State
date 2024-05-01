class ScrollObserver {
    constructor(threshold, options) {
        this.opts = options || {}
        const steps = (options && options.steps) ? this.buildThresholds(options.steps) : false;
        this.opts.threshold = threshold || steps || 1;
        this.callbacks = [];
        this.targets = [];
        this.observer = null;
    }
    buildThresholds = steps => {
        let t = [];
        for (let i = 0; i < steps; i++) { t.push(i / steps) }
        return t;
    }
    start = () => {
        this.observer = new IntersectionObserver(this.callbackLoop, this.opts)
        this.targets.forEach(t => this.observer.observe(t));
        return this.observer;
    };

    track = (target, callback) => {
        this.targets.push(target);
        this.callbacks.push(callback);
    }
    callbackLoop = (entries, observer) => {
        entries.forEach(entry => {
            const index = this.targets.findIndex(t => entry.target == t);
            this.callbacks[index](entry);
        })
    }
    disconnect = () => {
        this.observer.disconnect();
    }
}
export default ScrollObserver;