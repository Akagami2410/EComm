if (window.location.pathname === "/index.html") {
  var tl = gsap.timeline();
  tl.to(".middle .image", {
    clipPath: "xywh(0% 0% 98% 100%)",
    duration: 0.8,
    ease: "linear",
  });

  tl.to(".middle .image", {
    clipPath: "xywh(0% 10% 98% 100%)",
    ease: "power4.out",
  });
  tl.to(".middle", { y: "-12%", delay: 0.4 });
  tl.set(".headers", { opacity: 1 });
  tl.to(".navy", { y: 0, delay: 0.4 }, "-=0.8");
  tl.to(".ctgry", { opacity: 1, delay: 1 });

  const cart = document.querySelector(".cart-icon");
  cart.addEventListener("click", () => {
    console.log("cart icon clicked");
    HandleCartClosingOpening();
  });
} else if (window.location.pathname === "/checkout.html") {
} else {
  const cart = document.querySelector(".cart-icon");
  cart.addEventListener("click", () => {
    console.log("cart icon clicked");
    HandleCartClosingOpening();
  });
}

const showCartNumber = () => {
  if (sessionStorage.length > 1) {
    for (let i = 0; i < sessionStorage.length; i++) {
      // const key = sessionStorage.key(i)
      if (i === 0) {
        continue;
      }
      var currentPage = location.pathname.split("/").pop();

      if (currentPage === "checkout.html") {
      } else {
        document.querySelector(".cart-item-count").style.display = "flex";
        document.querySelector(".cart-item-count").innerText = i;
      }
    }
  } else {
    document.querySelector(".cart-item-count").style.display = "none";
    document.querySelector(".cart-item-count").innerText = 0;
  }
};

DisplayCart(document.querySelector(".cart-products"));
showCartNumber();
