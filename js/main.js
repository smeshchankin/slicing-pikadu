(function() {
    const elems = {
        menu: {
            layout: document.querySelector('.sidebar'),
            button: document.querySelector('#menuToggle')
        }
    };

    elems.menu.button.addEventListener('click', function(event) {
        event.preventDefault();
        elems.menu.layout.classList.toggle('visible');
    });
}());
