// TODO: total price in the cart section;
// FIX ME: when we want to remove cart product, if one prduct have more than one quantity, quantity not decrease, whole item removed.


const productContainer = document.querySelector("#inner-container");
const cart = document.querySelector("#menu .menu-item.cart");
const cartContainer = document.querySelector(".cart-container");
const closeCartBtn = document.querySelector(".btn.close-cart");
const cartInnerContainer = document.querySelector("#inner-cart-container");
const cartPopUp = document.querySelector(".menu-item.cart .cart-popup");

const LOCAL_STORAGE_KEY = "CART_PRODUCTS";

// Api Url
const url = "https://fakestoreapi.com/products";

// After refresh It's showing data cart data
showCartProducts();

let productsData = null;

// Api Call.
fetchApi(url);

async function fetchApi(url) {
    // loader
    loader();
    try {
        const res = await fetch(url);
        const results = await res.json();
        // storing product data
        productsData = results;
        showingProductsData();
    } catch (err) {
        console.log(err);
    }
}

function loader() {
    productContainer.innerHTML =
        `<div id="loader-container">
            <div class="loader"></div>
        </div>`;
}

// Home section product data
function showingProductsData() {
    console.log(productsData);
    productContainer.innerHTML = productsData.map((product) => {
        const { id, title, image, category, price } = product;
        return (`<div class="product-card">
        <div class="product-img">
            <img src="${image}" alt="${title}">
        </div>
        <div class="product-details">
            <p class="product title">${title}</p>
            <p class="product category">${category}</p>
            <p class="product price">${price}</p>
            <button class="btn add-cart" onclick="handleAddCart(${id})">Add To Cart</button>
        </div>
    </div>`)
    }).join("");

}

// cart container feature
cart.addEventListener("click", () => {
    cartContainer.classList.add("on");
})
closeCartBtn.addEventListener("click", () => {
    cartContainer.classList.remove("on");
})


function handleAddCart(addCartProductId) {
    for (let product of productsData) {
        if (product.id === addCartProductId) {
            handleLocalStorage(product);
            break;
        }
    }

    showCartProducts();

}

function handleLocalStorage(addCartProduct) {
    // Grabbing cart data from local storage
    const cartProductsData = gettingLocalStorageData();

    // update with new product
    const updatedCartData = getUpdatedCartData(cartProductsData, addCartProduct);

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCartData));
}

// showing cart products
function showCartProducts() {
    const cartProductsData = gettingLocalStorageData();

    // no of product popup handler
    handleNoOfProductPopup(cartProductsData.length);

    if (!cartProductsData.length) {
        cartInnerContainer.innerHTML = `<p id="empty-cart">Your Cart is Empty!</p>`;
    } else {
        cartInnerContainer.innerHTML = cartProductsData.map(product => {
            const { id, image, title, price, quantity } = product;
            return (
                `
        <div class="cart-product-box">
        <div class = "cart-products">
        <div class="cart-product-img">
                <img src="${image}"
                alt="${title}">
        </div>
            <span class="product-title">${title}</span>
            <span class="product-price">Price :${price}</span>
        </div>
        <button class="btn remove-cartproduct" onclick="handleRemoveCartProduct(${id})">Remove</button>
        <button class="btn buy-cartproduct">Buy Now</button>
        <p class="quantity">Quantity: ${quantity}</p>
        </div>
        `
            )
        }).join("");
    }

}

function gettingLocalStorageData() {
    const localStorageData = localStorage.getItem(LOCAL_STORAGE_KEY);
    const cartProducts = !localStorageData ? [] : JSON.parse(localStorageData);
    return cartProducts;
}

function handleRemoveCartProduct(productId) {
    const cartProductsData = gettingLocalStorageData();
    const updatedCartData = cartProductsData.filter((product) => product.id !== productId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedCartData));
    showCartProducts();
}
function getUpdatedCartData(cartProductsData, addCartProduct) {
    const addCartProductId = addCartProduct.id;

    // checking already product is available in the cart or not
    const isProductContain = cartProductsData.some((product) => product.id === addCartProductId);

    // if true then only increase quantity
    if (isProductContain) {
        const updatedCartData = cartProductsData.map((product) => {
            if (product.id === addCartProductId) {
                let updatedQuantity = product.quantity;
                updatedQuantity++;
                return { ...product, quantity: updatedQuantity };
            } else {
                return product;
            }
        })
        return updatedCartData;
    } else {
        // add a new property quantity
        addCartProduct = { ...addCartProduct, quantity: 1 };
        cartProductsData.push(addCartProduct);
        return cartProductsData;
    }
}

function handleNoOfProductPopup(noOfProduct) {
    if (noOfProduct) {
        cartPopUp.style.display = "block";
        cartPopUp.innerText = noOfProduct;
    } else {
        cartPopUp.style.display = "none";
    }
}