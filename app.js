const translate = document.querySelectorAll(".translate");
const big_title = document.querySelector(".big-title");
const header = document.querySelector("header");
const shadow = document.querySelector(".shadow");
const content = document.querySelector(".content");
const section = document.querySelector("section");
const image_container = document.querySelector(".imgContainer");
const opacity = document.querySelectorAll(".opacity");
const logo = document.querySelector(".logo");
const bignavlist = document.querySelector(".bignavlist");
const border = document.querySelector(".border");

let header_height = header.offsetHeight;
let section_height = section.offsetHeight;

//Paralax Effect
window.addEventListener('scroll', () => {
    let scroll = window.pageYOffset;
    let sectionY = section.getBoundingClientRect();

    translate.forEach(element => {
        let speed = element.dataset.speed;
        element.style.transform = `translateY(${scroll * speed}px)`;
    });

    opacity.forEach(element => {
        element.style.opacity = scroll / (sectionY.top + section_height);
    })

    big_title.style.opacity = - scroll / (header_height / 2) + 1;
    shadow.style.height = `${scroll * 0.5 + 300}px`;

    logo.style.opacity = - scroll / (header_height / 1.5) + 1;
    bignavlist.style.opacity = - scroll / (header_height / 1.5) + 1;

/*  content.style.transform = `translateY(${scroll / (section_height + sectionY.top) * 50 - 50}px)`; */    
    image_container.style.transform = `translateY(${scroll / (section_height + sectionY.top) * -50 + 50}px)`;

    border.style.width = `${scroll / (sectionY.top + section_height) * 30}%`;
});



//Navigation Hamburger Menu
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.navlinks');
    const navLinks = document.querySelectorAll('.navlinks li');

    //Toggles Nav
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        //Animates Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = ''
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 5 + .50}s`;
            }
        });

        //Burger Animation
        burger.classList.toggle('toggle');
    });
}

navSlide();