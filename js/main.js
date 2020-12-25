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
        posts: '.posts',
        button: {
            newPost: '.button-publish-post',
            form: '.add-post'
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

    const setPosts = {
        addPost: function(title, text, tags, handler) {
            const post = {
                title,
                text,
                tags,
                author: setUsers.user.displayName,
                date: new Date().toLocaleDateString(),
                likes: 0,
                comments: 0
            };
            setPosts.allPosts.push(post);
            handler();
        },
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
                date: '5 min ago',
                likes: 26,
                comments: 157
            },
            {
                title: 'Post #2',
                text: [
                    'This is an example of a short text',
                    'Also we have the second paragrahp'
                ],
                tags: ['hot', 'my'],
                author: 'thispersondoesnotexist',
                date: '30 min ago',
                likes: 53,
                comments: 202
            }
        ]
    };

    const showAllPosts = () => {
        let postsHTML = '';
        setPosts.allPosts.forEach(post => {
            const { title, text, tags, likes, comments, author, date } = post;
            postsHTML += `
            <section class="post">
                <div class="post-body">
                    <h2 class="post-title">${title}</h2>
                    ${text.map(p => `<p class="post-text">${p}</p>`).join('')}
                    <div class="tags">${tags.map(tag => `<a href="#" class="tag">#${tag}</a>`).join('')}
                </div>
                <div class="post-footer">
                    <div class="post-buttons">
                        <button class="post-button likes">
                            <svg class="icon icon-likes">
                                <use xlink:href="img/icons.svg#like"></use>
                            </svg>
                            <span class="button-counter">${likes}</span>
                        </button>
                        <button class="post-button comments">
                            <svg class="icon icon-comments">
                                <use xlink:href="img/icons.svg#message"></use>
                            </svg>
                            <span class="button-counter">${comments}</span>
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
                            <a href="http://thispersondoesnotexist.com" class="author-username">${author}</a>
                            <span class="post-time">${date}</span>
                        </div>
                        <a href="#" class="author-link"><img src="img/avatar.jpg" alt="avatar" class="author-avatar"></a>
                    </div>
                </div>
            </section>
            `;
        });

        elems.posts.innerHTML = postsHTML;
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

        elems.button.newPost.addEventListener('click', event => {
            event.preventDefault();
            showAddPost();
        });

        elems.button.form.addEventListener('submit', function(event) {
            event.preventDefault();

            let { title, text, tags } = this.elements;
            title = title.value;
            text = text.value;

            if (!validatePost(title, text)) {
                return;
            }

            setPosts.addPost(title, text.split('\n'), tags.value.split(','), showAllPosts);
            hideAddPost();
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

    function validatePost(title, text) {
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
    }

    document.addEventListener('DOMContentLoaded', init);
}());
