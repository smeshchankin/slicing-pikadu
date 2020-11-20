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
        },
        user: {
            layout: '.user',
            name: '.user-name'
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
        login(email, password, handler) {
            const user = this.getUser(email);
            if (user && user.password === password) {
                this.authorizedUser(user);
                handler();
            } else {
                alert('User / password are incorrect');
            }
        },
        logout() {
        },
        signup(email, password, handler) {
            if (email == null || email.trim() === '') {
                alert('Please input email address');
                return;
            }
            if (password == null || password === '') {
                alert('Please input password');
                return;
            }

            if (this.getUser(email)) {
                alert('User with email ' + email + ' already exists');
            } else {
                const user = { email, password, displayName: this.extractNameFromEmail(email) };
                data.users.push(user);
                this.authorizedUser(user);
                handler();
            }
        },
        getUser(email) {
            return data.users.find(u => u.email === email);
        },
        authorizedUser(user) {
            this.user = user;
        },
        extractNameFromEmail(email) {
            return email && email.split('@')[0];
        }
    };

    elems.menu.button.addEventListener('click', function(event) {
        event.preventDefault();
        elems.menu.layout.classList.toggle('visible');
    });

    elems.login.form.addEventListener('submit', event => {
        event.preventDefault();

        const email = elems.login.email.value;
        const pass = elems.login.password.value;
        setUsers.login(email, pass, toggleAuth);
    });

    elems.login.button.signup.addEventListener('click', event => {
        event.preventDefault();

        const email = elems.login.email.value;
        const pass = elems.login.password.value;
        setUsers.signup(email, pass, toggleAuth);
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

    function toggleAuth() {
        const user = setUsers.user;
        if (user) {
            elems.login.layout.style.display = 'none';
            elems.user.layout.style.display = 'flex';
            elems.user.name.textContent = user.displayName;
        } else {
            elems.login.layout.style.display = 'flex';
            elems.user.layout.style.display = 'none';
        }
    }
}());
