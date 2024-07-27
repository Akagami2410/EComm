function Filter(element) {
  if (element.id === "7") {
    const selected =
      element.nextElementSibling.firstElementChild.firstElementChild;
    if (element.checked) {
      selected.classList.remove("unselected");
      // getFilteredData()
    } else {
      selected.classList.add("unselected");
    }
  }
  const queryParams = new URLSearchParams(window.location.search);
  const hasQueryParams = queryParams.toString() !== "";

  if (hasQueryParams) {
    element.setAttribute("query", queryParams.get("categ"));
  }
  getFilteredProducts(element);
}

const ShowFilterOptions = (e) => {
  e.preventDefault();
  console.log("clicked");
  const tl = gsap.timeline();

  tl.to(".overlay-div", { display: "flex" });
  tl.to(".filter", { y: "0" }, "-=0.5");

  // document.querySelector(".overlay-div").style.display = "block";
  // document.querySelector(".filter").style.transform = "translateY(0%)";
};

const closeFilter = () => {
  document.querySelector(".overlay-div").style.display = "none";
};

getAllProducts();
