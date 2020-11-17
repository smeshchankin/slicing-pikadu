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

    const data = {
        users: [
            {
                id: '01',
                login: 'john',
                password: 'whois',
                displayName: 'John Galt'
            },
            {
                id: '02',
                login: 'jack',
                password: '1876-1916',
                displayName: 'Jack London'
            }
        ]
    };

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
