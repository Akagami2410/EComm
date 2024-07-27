window.addEventListener("DOMContentLoaded", async () => {
  getSpecifiedData();
  // Execute the slider script after dynamically loading the images

  setTimeout(() => {
    let images = [],
      arrows = [];
    let prevImg = { val: "" },
      nextImg = { val: "" },
      currentImg;

    let promise = new Promise((resolve) => {
      images = document.querySelectorAll(".product-image");
      updImgClasses(images[0]);
      resolve();
    });
    promise.then(() => {
      arrows = [
        {
          element: document.querySelector(".arrow.arrow_prev"),
          curImgTempClassname: "slide_prev-left",
          newImgTempClassname: "slide_current-right",
          newImg: nextImg,
          unusedImg: prevImg,
        },
        {
          element: document.querySelector(".arrow.arrow_next"),
          curImgTempClassname: "slide_prev-right",
          newImgTempClassname: "slide_current-left",
          newImg: prevImg,
          unusedImg: nextImg,
        },
      ];
      arrows.forEach((item) => {
        item.element.addEventListener("click", () => {
          arrowClickHandler(item);
        });
      });
    });

    function updImgClasses(curImg) {
      currentImg = curImg;
      currentImg.setAttribute("class", "product-image slide_current");
      switch (curImg) {
        case images[0]:
          prevImg.val = images[images.length - 1];
          nextImg.val = curImg.nextElementSibling;
          break;
        case images[images.length - 1]:
          prevImg.val = curImg.previousElementSibling;
          nextImg.val = images[0];
          break;
        default:
          prevImg.val = curImg.previousElementSibling;
          nextImg.val = curImg.nextElementSibling;
      }
      prevImg.val.setAttribute("class", "product-image slide_next-left");
      nextImg.val.setAttribute("class", "product-image slide_next-right");
    }

    function arrowClickHandler(thisArrow) {
      document.querySelectorAll(".arrow").forEach((item) => {
        item.classList.add("arrow_disabled");
      });
      currentImg.classList.add(thisArrow.curImgTempClassname);
      thisArrow.newImg.val.classList.add(thisArrow.newImgTempClassname);
      setTimeout(() => {
        currentImg.classList = "";
        thisArrow.unusedImg.val.setAttribute("class", "product-image");
        updImgClasses(thisArrow.newImg.val);
        document.querySelectorAll(".arrow").forEach((item) => {
          item.classList.remove("arrow_disabled");
        });
      }, 500);
    }
  }, 900);

  const checkOut = document.querySelector(".checkout");
  checkOut.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "/checkout.html";
  });
});
