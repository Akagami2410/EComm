let data,
  currentData,
  newData = [],
  allSizes = [],
  SingleProduct,
  CartItemArray = [];

const getSpecifiedData = async () => {
  const res = await fetch("assests/js/data.json");
  const element = document.querySelector(".product-images");

  const queryParams = new URLSearchParams(window.location.search);
  const ID = queryParams.get("id");

  const data = await res.json();
  SingleProduct = data.products.filter((item) => item.id === ID);

  SingleProduct.forEach((product) => {
    const newElement = document.createElement("div");
    newElement.classList.add("product-image");
    newElement.classList.add("slide_current");
    newElement.innerHTML = `<img src=${product.image} >`;
    element.insertAdjacentElement("beforeend", newElement);
    document.querySelector(".product-header").innerHTML = `
    <h5>${product.name}</h5>
    <p>${product.category}</p>
    <div class="ratings">
      <i class="fas fa-star"></i>
    </div>`;
    document.querySelector(".rate").innerHTML = `₹${product.price}`;
    if (product.availableSizes) {
      product.availableSizes.forEach((size, index) => {
        const span = document.createElement("span");
        span.classList.add("size");
        if (index === 0) {
          span.classList.add("activate");
        }
        span.innerText = size;
        document
          .querySelector(".sizes")
          .insertAdjacentElement("beforeend", span);
        allSizes.push(span);
      });
    }
    if (product.thumbnailImages) {
      product.thumbnailImages.forEach((thumb) => {
        // console.log(thumb);
        const newElement = document.createElement("div");
        newElement.classList.add("product-image");
        newElement.innerHTML = `<img src=${thumb} >`;
        element.insertAdjacentElement("beforeend", newElement);
      });
    }
  });

  addToCart(allSizes);
};
const AllData = async () => {
  const res = await fetch("/assests/js/data.json");
  const data = await res.json();
  return data;
};

const DisplayTheProducts = (arr, Parent) => {
  arr.forEach((product) => {
    const element = document.createElement("div");
    element.classList.add("item");
    element.setAttribute("ID", product.id);
    element.addEventListener("click", () => {
      productPage(element.getAttribute("ID"));
    });
    element.innerHTML = `<div class="item-image">
                    <img src= ${product.image} alt=""/>
                  </div>
                  <div class="item-details">
                    <p class="item-name">${product.name}</p>
                    <p class="item-price">₹${product.price}</p>
                    <p item="item-category">${product.category}</p>
                  </div>
              `;
    Parent.insertAdjacentElement("beforeend", element);
  });
};

function productPage(productId) {
  console.log(productId);
  window.location.href = `product.html?id=${productId}`;
}

const getAllProducts = async () => {
  const queryParams = new URLSearchParams(window.location.search);
  data = await AllData();
  let element;
  const categoryValue = queryParams.get("categ");
  currentData = data.products;

  if (categoryValue === "Men's") {
    document.getElementById("1").checked = true;
    element = document.getElementById("1");
  } else if (categoryValue === "Women's") {
    document.getElementById("2").checked = true;
    element = document.getElementById("2");
  } else if (categoryValue === "Unisex") {
    document.getElementById("3").checked = true;
    element = document.getElementById("3");
  } else if (categoryValue === "kids") {
    document.getElementById("4").checked = true;
    document.getElementById("5").checked = true;
    getFilteredProducts(document.getElementById("4"));
    getFilteredProducts(document.getElementById("5"));
    return;
  }
  getFilteredProducts(element);
};

let colorFilter = [],
  dataFilter = [];
const getFilteredProducts = (element) => {
  newData = [];

  if (element.checked) {
    if (element.id === "7") {
      colorFilter.push(element.value);
    } else {
      dataFilter.push(element.value);
    }
  } else {
    if (element.id === "7") {
      colorFilter = colorFilter.filter((color) => color !== element.value);
    } else {
      dataFilter = dataFilter.filter((cat) => cat !== element.value);
    }
  }

  // Apply both color and category filters simultaneously
  newData = currentData.filter((product) => {
    const passesColorFilter =
      colorFilter.length === 0 ||
      colorFilter.some((color) => product.color.toLowerCase().includes(color));
    const passesCategoryFilter =
      dataFilter.length === 0 ||
      dataFilter.some((category) => product.category.includes(category));
    return passesColorFilter && passesCategoryFilter;
  });

  console.log(colorFilter, dataFilter, "i am both");
  // newReqData = [...reqData, ...newReqData];
  console.log(newData, "i am being updated");
  ShowData(newData);
};

const ShowData = (arr) => {
  // return;
  // console.log(arr, "i am currently");
  const Parent = document.querySelector(".avail-item-container");
  Parent.innerHTML = "";
  if (!arr.length) {
    Parent.innerHTML = "<h1 class='no-product' >Products not Found</h1>";
    return;
  }

  DisplayTheProducts(arr, Parent);
};

const addToCart = (sizes) => {
  let selectedSize;
  sizes.forEach((target, index) => {
    if (index === 0) {
      selectedSize = parseInt(target.innerText.split(" ")[1]);
    }
    target.addEventListener("click", () => {
      sizes.forEach((size) => {
        if (size != target && size.classList.contains("activate")) {
          size.classList.remove("activate");
        }
      });
      target.classList.add("activate");
      selectedSize = parseInt(target.innerText.split(" ")[1]);
    });
  });

  const cartBtn = document.querySelector(".add-to-cart");

  cartBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    await CreateCartItem(SingleProduct[0], selectedSize);

    HandleCartClosingOpening();
    // console.log(SingleProduct[0]);
  });
};

const CreateCartItem = async (cartProduct, selectedSize) => {
  const uniqueKey = `${cartProduct.id}_${selectedSize}`;

  const alreadyExists = JSON.parse(sessionStorage.getItem(uniqueKey));

  cartProduct.uid = uniqueKey;
  cartProduct.selectedSize = selectedSize;
  if (!alreadyExists) {
    sessionStorage.setItem(uniqueKey, JSON.stringify(cartProduct));
  } else {
    alreadyExists.Qty++;
    sessionStorage.setItem(uniqueKey, JSON.stringify(alreadyExists));
  }

  let price = parseFloat(cartProduct.price.replace(/,/g, ""));

  const ParentElement = document.querySelector(".cart-products");
  DisplayCart(ParentElement);
};

const HandleCartClosingOpening = () => {
  const closeCart = document.querySelector(".cart-close");
  const Opac = document.querySelector(".opacity-less");

  setTimeout(() => {
    document.querySelector(".section-cart .cart").classList.add("gm");
  }, 100);
  document.querySelector(".section-cart").classList.add("hm");

  closeCart.addEventListener("click", () => {
    document.querySelector(".section-cart .cart").classList.remove("gm");
    setTimeout(() => {
      document.querySelector(".section-cart").classList.remove("hm");
    }, 100);
  });

  Opac.addEventListener("click", () => {
    document.querySelector(".section-cart .cart").classList.remove("gm");
    setTimeout(() => {
      document.querySelector(".section-cart").classList.remove("hm");
    }, 100);
  });
};

const DisplayCart = (parent) => {
  let totalPrice = 0;
  parent.innerHTML = "";
  const sessionStorageArray = [];
  let cnt = 0;
  // Loop through sessionStorage to retrieve all key-value pairs
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    const value = sessionStorage.getItem(key);

    // Check if the key matches the expected pattern
    if (key.match(/^\d+_\d+$/)) {
      // If the key matches, push the key-value pair as an object into sessionStorageArray
      sessionStorageArray.push(JSON.parse(value));
    }
  }
  sessionStorageArray.forEach((arrItem) => {
    const newElement = document.createElement("div");

    totalPrice += arrItem.Qty * parseFloat(arrItem.price.replace(/,/g, ""));

    newElement.classList.add("cart-product");
    newElement.innerHTML = `
    <article class="cart-item-image">
    <img src = '${arrItem.image}' />
    </article>
    <article class="cart-item-price">
    <h5 class="cart-item-total-price">${(
      parseFloat(arrItem.price.replace(/,/g, "")) * arrItem.Qty
    ).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}</h5>
      <p class="cart-item-actual-price">₹${arrItem.price}</p>
      <a class="button remove" data-uid="${arrItem.uid}">remove</a>
      </article>
      <article class="cart-item-info">
      <div class="cart-item-name">${arrItem.name}</div>
      <div class="cart-item-category">${arrItem.category}</div>
      <p class="cart-item-size">Size: ${arrItem.selectedSize}</p>
      <div class="cart-quantity-controller">
      <button class="increase" data-uid="${arrItem.uid}">
      <i class="fa-solid fa-plus"></i>
      </button>
      <p class="quant">${arrItem.Qty}</p>
      <button class="decrease" data-uid="${arrItem.uid}" ${
      arrItem.Qty <= 1 ? "disabled" : ""
    }>
      <i class="fa-solid fa-minus"></i>
      </button>
      </div>
      </article>
      `;

    parent.insertAdjacentElement("beforeend", newElement);
    cnt += 1;
    // Check if the current page is "checkout.html"
    // console.log(sessionStorageArray.length, " i am length");
  });

  if (window.location.pathname !== "checkout.html") {
    document.querySelector(".crt").innerHTML = `Cart (${cnt})`;
    showCartNumber();
  }

  HandleQuantity(parent);
};

const HandleQuantity = (doc) => {
  const decrease = doc.querySelectorAll(".decrease");
  const increase = doc.querySelectorAll(".increase");
  const remove = doc.querySelectorAll(".remove");
  const clear = document.querySelector(".clear-cart");

  clear.addEventListener("click", (e) => {
    update(e.currentTarget, doc);
    return;
  });

  if (remove.length) {
    remove.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        update(e.currentTarget, doc);
      });
    });
  }
  increase.forEach((inc) => {
    inc.addEventListener("click", (e) => {
      update(e.currentTarget, doc);
    });
  });

  decrease.forEach((dec) => {
    dec.addEventListener("click", (e) => {
      update(e.currentTarget, doc);
    });
  });
  CorrectlyShowTotalAmount(doc);
};

const CorrectlyShowTotalAmount = (doc) => {
  let totalAmount = 0;
  doc.childNodes.forEach((node) => {
    const monetaryValue = node
      .querySelector(".cart-item-total-price")
      .innerText.replace(/[^\d.]/g, "");
    totalAmount += parseFloat(monetaryValue);
  });
  // console.log(totalAmount, "k");
  document.querySelector(".price-final").innerHTML = new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
    }
  ).format(totalAmount);
};

const update = (btn, doc) => {
  let sesItm = JSON.parse(sessionStorage.getItem(btn.dataset.uid));
  if (btn && btn.classList.contains("increase")) {
    doc.querySelector(".decrease").disabled = false;
    sesItm.Qty += 1;
  } else if (btn && btn.classList.contains("decrease")) {
    sesItm.Qty -= 1;
    if (sesItm.Qty === 1) {
      btn.disabled = true;
      // return;
    }
  } else if (btn && btn.classList.contains("remove")) {
    console.log("remove called", btn);
    sessionStorage.removeItem(btn.dataset.uid);
    DisplayCart(document.querySelector(".cart-products"));
    CorrectlyShowTotalAmount(doc);
    return;
  } else if (btn && btn.classList.contains("clear-cart")) {
    console.log("clicked");

    var pattern = /^[0-9]+_[0-9]+$/;
    for (let i = 1; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (pattern.test(key)) {
        sessionStorage.removeItem(key);
      }
    }

    DisplayCart(document.querySelector(".cart-products"));
    CorrectlyShowTotalAmount(doc);
    return;
  }
  doc.querySelector(".quant").innerText = sesItm.Qty;
  let priceinNum = parseFloat(sesItm.price.replace(/[^\d.-]/g, ""));
  doc.querySelector(".cart-item-total-price").innerHTML = new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
    }
  ).format(priceinNum * sesItm.Qty);
  sessionStorage.setItem(btn.dataset.uid, JSON.stringify(sesItm));
  CorrectlyShowTotalAmount(doc);
};
