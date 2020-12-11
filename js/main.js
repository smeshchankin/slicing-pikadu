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
            name: '.user-name',
            avatar: '.user-avatar'
        },
        posts: '.posts'
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

    const setPosts = {
        allPosts: [
            {
                title: 'Post\'s title',
                text: [
                    `Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Qui culpa, asperiores quia voluptatum earum ipsam possimus eius beatae ex
                    nam cumque est iure, ducimus totam assumenda, a obcaecati consequuntur.
                    Debitis aliquid maiores tempora, quaerat, quis similique id laboriosam
                    delectus natus fugiat omnis eaque ab quisquam dignissimos minima beatae
                    quos esse. Delectus cupiditate quas tempora minima laborum optio explicabo
                    dolorum eligendi possimus animi minus, totam quod unde numquam veniam in nam
                    voluptatibus error vel itaque hic?`,
                    `Accusantium quam quod porro blanditiis quas voluptates non nisi repellendus,
                    similique dignissimos aperiam tempora praesentium consequatur fugit a veritatis
                    asperiores id architecto voluptatem doloremque delectus ad. Quos, quo. Tenetur
                    similique dolores delectus tempora molestiae? Sed aspernatur nisi eligendi
                    officiis amet laudantium excepturi non possimus illo sapiente, fugit nam
                    voluptas modi voluptatum magni nobis ratione officia rem facilis animi culpa
                    minima dignissimos?`,
                    `Rerum aspernatur reiciendis expedita tempore esse distinctio nulla ratione
                    at quod deserunt amet sequi architecto hic deleniti vero sed, fuga, non
                    labore. Non commodi, rerum minus libero eum tempora reprehenderit voluptates,
                    dolorem id fuga fugiat atque aperiam. Vitae doloribus at dolores eligendi
                    quasi inventore quidem aut dolorum enim! Facere, aut. Quas, tempora ipsum!
                    Minus, tempora labore ullam placeat quis consectetur voluptatem laudantium.
                    Fuga, architecto.`
                ],
                tags: ['latest', 'new', 'hot', 'my', 'fortuity'],
                author: 'thispersondoesnotexist',
                date: '5 min ago'
            }
        ]
    };

    const showAllPosts = () => {
        elems.posts.innerHTML = 'Post number 1';
    };

    const init = () => {
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
            elems.edit.username.value = setUsers.user.displayName;
            elems.edit.photo.value = setUsers.user.photo || '';
        });
    
        elems.edit.layout.addEventListener('submit', event => {
            event.preventDefault();
    
            const user = elems.edit.username.value;
            const photo = elems.edit.photo.value;
            setUsers.edit(user, photo, toggleAuth);
            elems.edit.layout.classList.remove('visible');
        });
    
        showAllPosts();
        toggleAuth();
    };

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
            elems.user.avatar.src = user.photo || elems.user.avatar.src;
        } else {
            elems.login.layout.style.display = 'block';
            elems.user.layout.style.display = 'none';
        }
    }

    document.addEventListener('DOMContentLoaded', init);
}());
