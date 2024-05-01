class ClFormValidator {
    constructor(fid) {
        this.form = document.getElementById(fid);
        if (!this.form) return;
        this.submitter = this.form.querySelector('[type=submit]');
        this.resetter = this.form.querySelector('[type=reset]');
        this.fields = [...this.form.getElementsByClassName('field')];
        this.fieldGroups = this.form.querySelectorAll('fieldset');
        this.invalids = [];
        this.init();
    }
    // DEFAULT ACTIONS
    beforeValidate = (data, form) => { console.log('before validate action') }
    submit = (data, form) => { form.submit() }
    // Methods
    checkForm = e => {
        e.preventDefault();
        const data = new FormData(this.form);
        this.beforeValidate(data, this.form);
        this.form.classList.add('checked');
        this.checkFieldGroups();
        const query = [...this.form.querySelectorAll('input:invalid, fieldset.invalid')];
        if (query.length > 0) {
            query.forEach(q => {
                if (this.invalids.find(inv => inv == q.parentElement)) { return }
                this.invalids.push(q.tagName == "fieldset" ? q : q.parentElement);
            });
            this.invalids.forEach(inv => {
                const info = inv.querySelector('.invalid-helper');
                const input = inv.querySelectorAll('input');
                input.forEach(i => i.setAttribute('aria-describedby', info.id));
            });
            return console.log('form validation was unsuccessful');
        }
        this.submit(data, this.form);
    }
    handleKeys = e => {
        switch (e.key) {
            case "enter":
                return this.checkForm();
            case "escape":
                return alert("escape key");
        }
    }
    watchClick = e => {
        let targ = e.target.closest('fieldset.invalid');
        if(!targ){return}
        window.requestAnimationFrame(()=>{
            debugger;
            let checked = targ.querySelector('input:checked');
            if(!checked){return}
            targ.classList.remove('invalid');
        })
    }
    resetForm = e => {
        this.form.classList.remove('checked');
        this.form.reset();
    }
    fieldHelpers = () => {
        const labelField = field => {
            const input = field.querySelector('input')
            if (!input) { return }
            const id = input.id;
            const info = field.getElementsByClassName('info-helper').length > 0 ? field.getElementsByClassName('info-helper')[0] : false;
            const invalid = field.getElementsByClassName('invalid-helper').length > 0 ? field.getElementsByClassName('invalid-helper')[0] : false;
            if (invalid) { invalid.id = id + '-invalid'; }
            if (info) {
                input.setAttribute('aria-describedby', id + '-info')
                info.id = id + '-info';
            }
        }
        this.fields.forEach(f => labelField(f));
    }
    fieldGroupHelpers = () => {
        const labelField = field => {
            const inputs = [...field.querySelectorAll('input')];
            const id = inputs[0].id;
            const info = field.getElementsByClassName('info-helper').length > 0 ? field.getElementsByClassName('info-helper')[0] : false;
            const invalid = field.getElementsByClassName('invalid-helper').length > 0 ? field.getElementsByClassName('invalid-helper')[0] : false;
            inputs.forEach((input, i) => { if (info) { input.setAttribute('aria-describedby', id + '-info') } });
            if (info) { info.id = id + '-info'; }
            if (invalid) { invalid.id = id + '-invalid'; }
        }
        this.fieldGroups.forEach(f => labelField(f));
    }
    checkFieldGroups = () => {
        this.fieldGroups.forEach(f => {
            if(!f.className.includes('req')){return}
            const checked = f.querySelector('input:checked');
            if(checked){return}
            f.classList.add('invalid');
        });
    }
    init = () => {
        this.fieldHelpers();
        this.fieldGroupHelpers();
        this.submitter.addEventListener("click", this.checkForm);
        this.form.addEventListener('keypress', this.handleKeys);
        this.form.addEventListener('click', this.watchClick);
        if (!this.resetter) return;
        this.resetter.addEventListener("click", this.resetForm);
    }
}
export default ClFormValidator;