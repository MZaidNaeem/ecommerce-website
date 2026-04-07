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











$(document).ready(function () {

    $.ajax({
        url: "https://fakestoreapi.com/products?limit=5",
        method: "GET",
        success: function (data) {

            let container = $(".dynamic-products");

            data.forEach(product => {

                let productCard = `
                <div class="product">
                    <a href="">
                        <div class="product-img">
                            <img class="img-1" src="${product.image}" alt="">
                            <img  class="img-2" src="${product.image}" alt="">
                        </div>
                    </a>

                    <div class="product-hover-option">
                        <button class="product-quick-view show-model"
                            data-title="${product.title}"
                            data-desc="${product.description}"
                            data-img="${product.image}"
                            data-rating="${product.rating.rate}">
                            Quick View
                        </button>
                    </div>

                    <a href="">
                        <div>${product.title}</div>
                        <div>RS. ${(product.price * 280).toFixed(2)}</div>
                    </a>
                </div>
                `;

                container.append(productCard);
            });
        }
    });

});

$(document).on("click", ".show-model", function () {

    $("#modal-title").text($(this).data("title"));
    $("#modal-desc").text($(this).data("desc"));
    $("#modal-img").attr("src", $(this).data("img"));
    $("#modal-rating").text("Rating: " + $(this).data("rating"));

    $("#quickViewModal").fadeIn();
});

$(".close-btn").click(function () {
    $("#quickViewModal").fadeOut();
});

$(window).click(function (e) {
    if ($(e.target).is("#quickViewModal")) {
        $("#quickViewModal").fadeOut();
    }
});