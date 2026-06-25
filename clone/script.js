//aos animation
AOS.init({
    duration: 1000,
    once: false
});

//cursor move
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

//cursor active
const menuItems = document.querySelectorAll(".menu a , .contact_btn, .contact_button");
menuItems.forEach(item => {

    item.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });

    item.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});
