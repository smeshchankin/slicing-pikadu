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
                email: 'john@gmail.com',
                password: 'whois',
                displayName: 'John Galt'
            },
            {
                id: '02',
                email: 'jack@gmail.com',
                password: '1876-1916',
                displayName: 'Jack London'
            }
        ]
    };

    const setUsers = {
        user: null,
        login(email, password) {
        },
        logout() {
        },
        signup(email, password) {
            if (this.getUser(email)) {
                alert('User with email ' + email + ' already exists');
            } else {
                data.users.push({ email, password, displayName: email });
            }
        },
        getUser(email) {
            return data.users.find(u => u.email === email);
        }
    };

    elems.menu.button.addEventListener('click', function(event) {
        event.preventDefault();
        elems.menu.layout.classList.toggle('visible');
    });

    elems.login.form.addEventListener('click', event => {
        event.preventDefault();

        const email = elems.login.email.value;
        const pass = elems.login.password.value;
        setUsers.login(email, pass);
    });

    elems.login.button.signup.addEventListener('click', event => {
        event.preventDefault();

        const email = elems.login.email.value;
        const pass = elems.login.password.value;
        setUsers.signup(email, pass);
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
