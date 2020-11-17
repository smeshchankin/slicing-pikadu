(function() {
    const elems = applySelector({
        menu: {
            layout: '.sidebar',
            button: '#menuToggle'
        },
        login: {
            layout: '.login',
            form: '.login-form',
            email: '.login-email',
            password: '.login-password',
            button: {
                signup: '.login-signup'
            }
        }
    });
    console.log(elems);

    elems.menu.button.addEventListener('click', function(event) {
        event.preventDefault();
        elems.menu.layout.classList.toggle('visible');
    });

    function applySelector(obj) {
        const res = {};
        Object.keys(obj).forEach(key => {
            const val = obj[key];
            res[key] = typeof val === 'object' && val !== null
                ? applySelector(val) : document.querySelector(val);
        });
        return res;
    }
}());
