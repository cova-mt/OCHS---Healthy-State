class ClAccessibe {
    constructor() {
        if (window.location.origin.includes('localhost')) { return }
        this.opts = {
            statementLink: '',
            footerHtml: '',
            hideMobile: false,
            hideTrigger: false,
            disableBgProcess: false,
            language: 'en',
            position: 'right',
            leadColor: '#146FF8',
            triggerColor: '#146FF8',
            triggerRadius: '50%',
            triggerPositionX: 'right',
            triggerPositionY: 'bottom',
            triggerIcon: 'people',
            triggerSize: 'bottom',
            triggerOffsetX: 20,
            triggerOffsetY: 20,
            hideTrigger: true,
            mobile: {
                triggerSize: 'small',
                triggerPositionX: 'right',
                triggerPositionY: 'bottom',
                triggerOffsetX: 10,
                triggerOffsetY: 10,
                triggerRadius: '20'
            }
        }
        if (window.acsbJS) {
            this.handleAcsb();
        } else {
            window.addEventListener('load', this.handleAcsb);
        }
    }
    handleAcsb = () => {
        window.acsbJS.init(this.opts)
        window.removeEventListener('load', this.handleAcsb);
    }
}
export default ClAccessibe;