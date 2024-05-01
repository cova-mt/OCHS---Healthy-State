class ClGoogleTranslate {
    constructor() {
        this.trigger = document.querySelector('#la-gov-bar .lang');
        this.group = document.getElementById('gt-container');
        this.isOpen = false;
        this.init();
    }
    initGT = () => {
        new google.translate.TranslateElement(
            {
                pageLanguage: 'en',
                includedLanguages: 'de,el,en,es,fr,it,ja,ko,la,tl,vi,zh-CN,zh-TW,ar',
                gaTrack: true,
                gaId: 'UA-3632381-1'
            },
            'gt-element'
        );
    }
    handleGT = () => {
        try {
            this.initGT();
        } catch (error) {
            window.handleGT = this.initGT;
        }
    }
    toggleMenu = () => {
        this.isOpen = !this.isOpen;
        this.group.dataset.open = this.isOpen;
    }
    closeOutside = e => {
        if (!this.isOpen) return;
        if (e.target.closest('#gt-container, #la-gov-bar .lang')) return;
        this.toggleMenu();
    }
    init = () => {
        this.trigger.addEventListener('click', this.toggleMenu);
        document.body.addEventListener('click', this.closeOutside);
        this.handleGT();
    }
}
export default ClGoogleTranslate;