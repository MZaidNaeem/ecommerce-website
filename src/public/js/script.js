// navbar side bar opening and closing options


// main side bar openning
const menuIcon = document.querySelector('.menu-icon');
const mainLinks = document.querySelector('.main-links');

menuIcon.addEventListener('click', () => {
    mainLinks.classList.toggle('active');

});



// few link sidebar opening on clicking on main side baar options
document.querySelectorAll('.more-option').forEach(icon => {
    icon.addEventListener('click', function () {
        const parent = this.closest('.first-link');
        const drawer = parent.querySelector('.sm-tb-hover-detail');

        drawer.classList.add('active');
    });
});


// many link sidebar opening on clicking on main side baar options


document.querySelectorAll('.more-option').forEach(icon => {
    icon.addEventListener('click', function () {
        const parent = this.closest('.first-link');
        const drawer = parent.querySelector('.sm-tb-full-screen');

        drawer.classList.add('active');
    });
});

// many link sidebar more option
document.querySelectorAll('.more-option').forEach(icon => {
    icon.addEventListener('click', function () {
        const parent = this.closest('.column-container');
        const drawer = parent.querySelector('.column');

        drawer.classList.add('active');
    });
});

// closing of sidebar on clicking on a cross icons

document.querySelectorAll('.closing-button').forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
        const drawer = this.closest('.closing-True');
        drawer.classList.remove('active');
    });
});


// closing of sidebar on clicing on any link
document.querySelectorAll('.main-links a').forEach(link => {
    link.addEventListener('click', () => {

        mainLinks.classList.remove('active');

        document.querySelectorAll(
            '.sm-tb-hover-detail.active, .sm-tb-full-screen.active, .column.active'
        ).forEach(el => {
            el.classList.remove('active');
        });

    });
});



// footer section toggle on samll screen
const footerTriggers = document.querySelectorAll('.footer-child-box span');

footerTriggers.forEach(trigger => {
    trigger.addEventListener('click', function () {
        if (window.innerWidth < 768) {
            const parent = this.parentElement;
            parent.classList.toggle('active');
        }
    });
});