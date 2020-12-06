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
                signup: '.login-signup',
                logout: '.exit-button'
            }
        },
        edit: {
            layout: '.edit-container',
            button: '.edit-button',
            username: '.edit-username',
            photo: '.edit-photo'
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

    const regExpEmailValidate = /^\w+@\w+\.\w{2,}$/;

    const setUsers = {
        user: null,
        login(email, password, handler) {
            if (!regExpEmailValidate.test(email)) {
                alert('Invalid email');
                return;
            }
            const user = this.getUser(email);
            if (user && user.password === password) {
                this.authorizedUser(user);
                handler();
            } else {
                alert('User / password are incorrect');
            }
        },
        logout(handler) {
            this.authorizedUser(null);
            handler();
        },
        signup(emailElem, passwordElem, handler) {
            if (!emailElem.reportValidity() || !passwordElem.reportValidity()) {
                return;
            }
            if (!regExpEmailValidate.test(emailElem.value)) {
                alert('Invalid email');
                return;
            }

            if (this.getUser(emailElem.value)) {
                alert('User with email ' + emailElem.value + ' already exists');
            } else {
                const user = {
                    email: emailElem.value,
                    password: passwordElem.value,
                    displayName: this.extractNameFromEmail(emailElem.value)
                };
                data.users.push(user);
                this.authorizedUser(user);
                handler();
            }
        },
        edit(userName, userPhoto, handler) {
            if (userName) {
                this.user.displayName = userName;
            }
            if (userPhoto) {
                this.user.photo = userPhoto;
            }
            handler();
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
        elems.login.form.reset();
    });

    elems.login.button.signup.addEventListener('click', event => {
        event.preventDefault();

        const emailElem = elems.login.email;
        const passElem = elems.login.password;
        setUsers.signup(emailElem, passElem, toggleAuth);
        elems.login.form.reset();
    });

    elems.login.button.logout.addEventListener('click', event => {
        event.preventDefault();

        setUsers.logout(toggleAuth);
    });

    elems.edit.button.addEventListener('click', event => {
        event.preventDefault();
        elems.edit.layout.classList.toggle('visible');
    });

    elems.edit.layout.addEventListener('submit', event => {
        event.preventDefault();

        const user = elems.edit.username.value;
        const photo = elems.edit.photo.value;
        setUsers.edit(user, photo, toggleAuth);
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
            elems.user.layout.style.display = 'block';
            elems.user.name.textContent = user.displayName;
        } else {
            elems.login.layout.style.display = 'block';
            elems.user.layout.style.display = 'none';
        }
    }
}());
