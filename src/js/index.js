const primaryNav = document.querySelector(".primary-navigation");
const navToggle = document.querySelector(".primary-nav-toggle");

navToggle.addEventListener("click", () => {
    const visivility = primaryNav.getAttribute("data-visible");
    if (visivility === "false") {
        primaryNav.setAttribute("data-visible", true);
        navToggle.setAttribute("aria-expanded", true);
    }
    else {
        primaryNav.setAttribute("data-visible", false);
        navToggle.setAttribute("aria-expanded", false);
    }
});