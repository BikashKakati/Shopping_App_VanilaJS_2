// TODO: buying completed feature;
// FIX ME: when we want to remove cart product, if one prduct have more than one quantity, quantity not decrease, whole item removed.


const productContainer = document.querySelector("#inner-container");
const cart = document.querySelector("#menu .menu-item.cart");
const cartContainer = document.querySelector(".cart-container");
const closeCartBtn = document.querySelector(".btn.close-cart");
const cartInnerContainer = document.querySelector("#inner-cart-container");
const cartPopUp = document.querySelector(".menu-item.cart .cart-popup");
const cartTotalPrice = document.querySelector(".cart-container .cart-totalprice");

const LOCAL_STORAGE_KEY = "CART_PRODUCTS";


// After refresh It's showing data cart data
showCartProducts();

// made the api calling a separate object to not pollute the data in global;
const apiDataManager = {
    productsData: null,
    url: "https://fakestoreapi.com/products",
    loader: function () {
        productContainer.innerHTML =
            `<div id="loader-container">
                <div class="loader"></div>
            </div>`;
    },
    fetchApi: async function () {
        this.loader();
        try {
            const res = await fetch(this.url);
            const results = await res.json();
            // storing product data
            this.productsData = results;
        } catch (err) {
            console.log(err);
        }
    }
}
apiDataManager.fetchApi()
    .then(function () {
        return showingProductsData();
    })

// Home section product data
function showingProductsData() {
    const { productsData } = apiDataManager
    productContainer.innerHTML = productsData.map((product) => {
        const { id, title, image, category, price, rating: { rate: productRating } } = product;
        // start rating
        let wholeNum = Math.floor(productRating);
        let str = '<i class="fa fa-star" aria-hidden="true"></i>'.repeat(wholeNum);
        let deci = productRating % wholeNum;
        if (deci) {
            str += '<i class="fa fa-star-half"></i>';
        }
        let remain = deci ? 5 - (wholeNum + 1) : 5 - wholeNum;
        str += '<i class="fa fa-star" aria-hidden="true" style="color:var(--grey)"></i>'.repeat(remain);

        return (
            `<div class="product-card">
        <div class="product-img">
            <img src="${image}" alt="${title}">
        </div>
        <div class="product-details">
            <p class="product title">${title.slice(0, 50)}${title.length > 50 && "..."}</p>
            <p class="product category">${category}</p>
            <p class="product price">Price ₹${price}</p>
            <div class ="star-rating">
            ${str}
            </div>
            <button class="btn add-cart" onclick="handleAddCart(${id})">Add To Cart</button>
        </div>
    </div>`
        )
    }).join("");

}
function handleAddCart(addCartProductId) {
    const { productsData } = apiDataManager;
    for (let product of productsData) {
        if (product.id === addCartProductId) {
            handleLocalStorage(product);
            break;
        }
    }

    showCartProducts();

}

// cart container feature
cart.addEventListener("click", () => {
    cartContainer.classList.add("on");
})
closeCartBtn.addEventListener("click", () => {
    cartContainer.classList.remove("on");
})

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
    handleTotalPrice(cartProductsData);

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
            <span class="product-price">Price :₹${price}</span>
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

function handleTotalPrice(cartProductsData) {
    let allTotalPrice = 0;
    for (let product of cartProductsData) {
        let productTotalPrice = product.price * product.quantity;
        allTotalPrice += productTotalPrice;
    }
    cartTotalPrice.innerText = `Total Price: ₹${allTotalPrice.toFixed(2)}`;
}