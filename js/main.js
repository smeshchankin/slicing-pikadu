(function() {
    let menuToggle = document.querySelector('#menuToggle');
    let menu = document.querySelector('.sidebar');

    menuToggle.addEventListener('click', function(event) {
        event.preventDefault();
        menu.classList.toggle('visible');
    });
}());
