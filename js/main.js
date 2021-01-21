(function() {
    const auth = {
        _config: {
            apiKey: "AIzaSyDNrUZDJ1Ou73dO2OMOyPvFpjjTtKtg4R4",
            authDomain: "pika-du.firebaseapp.com",
            projectId: "pika-du",
            storageBucket: "pika-du.appspot.com",
            messagingSenderId: "977058256524",
            appId: "1:977058256524:web:6a148d0ffb8c12ff964da9"
        },
        init() {
            firebase.initializeApp(this._config);
        },
        login(email, password, errorHandler) {
            firebase.auth()
                .signInWithEmailAndPassword(email, password)
                .catch(err => this._errHandler(err, 'Login', errorHandler));
        },
        logout(handler, errorHandler) {
            firebase.auth()
                .signOut()
                .then(handler)
                .catch(err => this._errHandler(err, 'Logout', errorHandler));
        },
        register(email, password, handler, errorHandler) {
            firebase.auth()
                .createUserWithEmailAndPassword(email, password)
                .then(data => handler(data))
                .catch(err => this._errHandler(err, 'Register', errorHandler));
        },
        reset(email, handler, errorHandler) {
            firebase.auth().sendPasswordResetEmail(email)
                .then(handler)
                .catch(err => this._errHandler(err, 'Reset', errorHandler));
        },
        getUser() {
            return firebase.auth().currentUser;
        },
        onChange(handler) {
            firebase.auth().onAuthStateChanged(user => handler(user));
        },
        _errHandler(err, type, handler) {
            const { code, message } = err;
            if (handler) {
                handler(code, message);
            }
            console.err(type + ' error: code =', code, ', message =', message);
        }
    };

    auth.init();

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
                logout: '.exit-button',
                forget: '.login-forget'
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
        posts: '.posts',
        button: {
            newPost: '.button-publish-post',
            form: '.add-post'
        }
    });

    const regExpEmailValidate = /^\w+@\w+\.\w{2,}$/;
    const DEFAULT_PHOTO = elems.user.avatar.src;

    const setUsers = {
        user: null,
        users: [],
        initUser(handler) {
            auth.onChange((user) => {
                this.user = user ? user : null
                if (handler) {
                    handler();
                }
            });
        },
        login(email, password, handler) {
            if (!regExpEmailValidate.test(email)) {
                alert('Invalid email');
                return;
            }

            auth.login(email, password, function(code) {
                if (code === 'auth/wrong-password') {
                    alert('Wrong password');
                } else if (code === 'auth/user-not-found') {
                    alert('Wrong login');
                }
            });

            const user = this.getUser(email);
            if (user && user.password === password) {
                this.authorizedUser(user);
                handler();
            } else {
                alert('User / password are incorrect');
            }
        },
        logout(handler) {
            auth.logout(() => {
                this.authorizedUser(null);
                    handler();
            }, (code, message) => {
                alert('Sign out error: code =', code, ', message =', message);
            });
        },
        signup(emailElem, passwordElem, handler) {
            if (!emailElem.reportValidity() || !passwordElem.reportValidity()) {
                return;
            }
            if (!regExpEmailValidate.test(emailElem.value)) {
                alert('Invalid email');
                return;
            }

            auth.register(emailElem.value, passwordElem.value,
                () => this.edit(email.substring(0, email.indexOf('@')), null, handler),
                (code) => {
                    if (code === 'auth/weak-password') {
                        alert('Weak password');
                    } else if (code === 'auth/email-already-in-use') {
                        alert('User already exists');
                    }
                }
            );

            if (this.getUser(emailElem.value)) {
                alert('User with email ' + emailElem.value + ' already exists');
            } else {
                const user = {
                    email: emailElem.value,
                    password: passwordElem.value,
                    displayName: this.extractNameFromEmail(emailElem.value)
                };
                this.users.push(user);
                this.authorizedUser(user);
                handler();
            }
        },
        edit(displayName, photoURL, handler) {
            const user = auth.getUser();

            if (displayName) {
                this.user.displayName = displayName;
                const profile = { displayName };

                if (photoURL) {
                    this.user.photo = photoURL;
                    profile.photoURL = photoURL;
                }

                user.updateProfile(profile).then(handler);
            }
        },
        sendForget(email) {
            auth.reset(email, () => alert('Email was sent'));
        },
        getUser(email) {
            return this.users.find(u => u.email === email);
        },
        authorizedUser(user) {
            this.user = user;
        },
        extractNameFromEmail(email) {
            return email && email.split('@')[0];
        }
    };

    class Post {
        constructor({ title, text, tags, author } = {}) {
            this.id = `postID${(+new Date()).toString(16)}`;
            this.title = title;
            this.text = text;
            this.tags = tags;
            this.author = author;
            this.date = new Date().toLocaleString();
            this.likes = 0;
            this.comments = 0;
        }

        validate() {
            this.errors = [];
            if (this.title.length <= 5) {
                this.errors.push('Too short title');
            }
            if (this.text.length <= 5) {
                this.errors.push('Too short text');
            }

            return this.errors.length;
        }

        render() {
            return `
            <section id="post_${this.id}" class="post">
                <div class="post-body">
                    <h2 class="post-title">${this.title}</h2>
                    ${this.text.map(p => `<p class="post-text">${p}</p>`).join('')}
                    <div class="tags">${this.tags.map(tag => `<a href="#" class="tag">#${tag}</a>`).join('')}
                </div>
                <div class="post-footer">
                    <div class="post-buttons">
                        <button class="post-button likes">
                            <svg class="icon icon-likes">
                                <use xlink:href="img/icons.svg#like"></use>
                            </svg>
                            <span class="button-counter">${this.likes}</span>
                        </button>
                        <button class="post-button comments">
                            <svg class="icon icon-comments">
                                <use xlink:href="img/icons.svg#message"></use>
                            </svg>
                            <span class="button-counter">${this.comments}</span>
                        </button>
                        <button class="post-button save">
                            <svg class="icon icon-save">
                                <use xlink:href="img/icons.svg#save"></use>
                            </svg>
                        </button>
                        <button class="post-button share">
                            <svg class="icon icon-share">
                                <use xlink:href="img/icons.svg#share"></use>
                            </svg>
                        </button>
                    </div>

                    <div class="post-author">
                        <div class="author-about">
                            <a href="http://thispersondoesnotexist.com" class="author-username">${this.author}</a>
                            <span class="post-time">${this.date}</span>
                        </div>
                        <a href="#" class="author-link"><img src="img/avatar.jpg" alt="avatar" class="author-avatar"></a>
                    </div>
                </div>
            </section>
            `;
        }
    }

    const setPosts = {
        _posts: [],
        validate: function(title, text) {
            let msg = '';
            if (title.length <= 5) {
                msg += 'Too short title\n';
            }
            if (text.length <= 5) {
                msg += 'Too short text\n';
            }

            if (msg) {
                alert(msg);
                return false;
            }

            return true;
        },
        add: function(post, handler) {
            setPosts._posts.push(post);
            save(this._posts);
            handler();
        },
        getAll: function(handler) {
            onUpdate((snapshort) => {
                this._posts = snapshot || [];
                handler();
            });
        },
        showAll: function(elem) {
            return function() {
                let postsHTML = '';
                this._posts.forEach(post => postsHTML += post.render());
                elem.innerHTML = postsHTML;
            }
        },
        save(posts) {
            firebase.database().ref('posts').set(posts);
        },
        onUpdate(handler) {
            firebase.database().ref('posts').on('value', snapshot => handler(snapshot.val()));
        }
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

        elems.login.button.forget.addEventListener('click', event => {
            event.preventDefault();

            setUsers.sendForget(elems.login.email.value);
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

        elems.button.newPost.addEventListener('click', event => {
            event.preventDefault();
            showAddPost();
        });

        elems.button.form.addEventListener('submit', function(event) {
            event.preventDefault();

            let { title, text, tags } = this.elements;
            title = title.value;
            text = text.value.split('\n');
            tags = tags.value.split(',').map(tag => tag.trim());

            const post = new Post({ title, text, tags, author: setUsers.user.displayName });
            if (post.validate()) {
                setPosts.add(post, setPosts.showAll(elems.posts));
                hideAddPost();
                this.reset();
            } else {
                alert(post.errors.join('\n'));
            }
        });

        setUsers.initUser(toggleAuth);
        setPosts.getAll(setPosts.showAll(elems.posts));
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
            elems.user.avatar.src = user.photo || DEFAULT_PHOTO;
            elems.button.newPost.classList.add('visible');
        } else {
            elems.login.layout.style.display = 'block';
            elems.user.layout.style.display = 'none';
            elems.button.newPost.classList.remove('visible');
            elems.button.form.classList.remove('visible');
            elems.posts.classList.add('visible');
        }
    }

    function showAddPost() {
        elems.button.form.classList.add('visible');
        elems.posts.classList.remove('visible');
    }

    function hideAddPost() {
        elems.button.form.classList.remove('visible');
        elems.posts.classList.add('visible');
    }

    document.addEventListener('DOMContentLoaded', init);
}());
