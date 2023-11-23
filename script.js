const productContainer = document.querySelector("#inner-container");
const cart = document.querySelector("#menu .menu-item.cart");
const cartContainer = document.querySelector(".cart-container");
const closeCartBtn = document.querySelector(".btn.close-cart");
const url = "https://fakestoreapi.com/products";

fetchApi(url);
function showingProductsData(products) {
    console.log(products);
    productContainer.innerHTML = products.map((product) => {
        const { title, image, category, price } = product;
        return (`<div class="product-card">
        <div class="product-img">
            <img src="${image}" alt="${title}">
        </div>
        <div class="product-details">
            <p class="product title">${title}</p>
            <p class="product category">${category}</p>
            <p class="product price">${price}</p>
            <button class="btn add-cart">Add To Cart</button>
        </div>
    </div>`)
    }).join("");

}

async function fetchApi(url) {
    productContainer.innerHTML = `<h1 id="loader">Loading....</h1>`;
    try {
        const res = await fetch(url);
        const json = await res.json();
        showingProductsData(json);
    } catch (err) {
        console.log(err);
    }
}
cart.addEventListener("click", () => {
    cartContainer.classList.add("on");
})
closeCartBtn.addEventListener("click", () => {
    cartContainer.classList.remove("on");
})