import { db } from "./firebase-config.js";

import {
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

let cart = [];

const productList = document.getElementById("productList");
const cartBtn = document.getElementById("cartBtn");
const cartModal = document.getElementById("cartModal");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const checkoutBtn = document.getElementById("checkoutBtn");

function formatRupiah(number) {
  return Number(number).toLocaleString("id-ID");
}

function getFinalPrice(price, discount) {
  const normalPrice = Number(price || 0);
  const discountValue = Number(discount || 0);

  if (discountValue <= 0) {
    return normalPrice;
  }

  return Math.round(normalPrice - (normalPrice * discountValue / 100));
}

onSnapshot(collection(db, "products"), function (snapshot) {
  productList.innerHTML = "";

  if (snapshot.empty) {
    productList.innerHTML = "<p>Produk belum tersedia.</p>";
    return;
  }

  snapshot.forEach(function (item) {
    const product = {
      id: item.id,
      ...item.data()
    };

    const finalPrice = getFinalPrice(product.price, product.discount);

    productList.innerHTML += `
      <div class="product-card">
        <img src="${product.imageUrl || 'assets/placeholder.jpg'}" alt="${product.title}">
        <div class="product-content">
          <h3>${product.title}</h3>
          <p>${product.description}</p>

          <div class="price-row">
            <div>
              ${
                Number(product.discount || 0) > 0
                  ? `<small class="old-price">Rp ${formatRupiah(product.price)}</small>`
                  : ""
              }
              <strong>Rp ${formatRupiah(finalPrice)}</strong>
            </div>

            ${
              Number(product.discount || 0) > 0
                ? `<span>Diskon ${product.discount}%</span>`
                : ""
            }
          </div>

          <button onclick='addToCart(${JSON.stringify({
            id: product.id,
            name: product.title,
            price: finalPrice
          })})'>
            Tambahkan ke Keranjang
          </button>
        </div>
      </div>
    `;
  });
});

function addToCart(product) {
  const existingProduct = cart.find(item => item.id === product.id);

  if (existingProduct) {
    existingProduct.qty += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      qty: 1
    });
  }

  updateCart();
}

function updateCart() {
  cartCount.textContent = cart.reduce((total, item) => total + item.qty, 0);

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Keranjang masih kosong.</p>";
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.name} x${item.qty}</span>
      <strong>Rp ${formatRupiah(item.price * item.qty)}</strong>
    </div>
  `).join("");
}

cartBtn.addEventListener("click", function () {
  cartModal.classList.add("active");
  updateCart();
});

closeCart.addEventListener("click", function () {
  cartModal.classList.remove("active");
});

cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.classList.remove("active");
  }
});

checkoutBtn.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Keranjang masih kosong");
    return;
  }

  const orderText = cart
    .map(item => `${item.name} jumlah ${item.qty} - Rp ${formatRupiah(item.price * item.qty)}`)
    .join(", ");

  const totalOrder = cart.reduce((total, item) => total + item.price * item.qty, 0);

  const nomorWhatsApp = "6285379504992";

  const pesan = `Hallo kak saya mau order bunga berikut: ${orderText}. Total pesanan Rp ${formatRupiah(totalOrder)}. Bagaimana caranya?`;

  window.open(
    `https://wa.me/${nomorWhatsApp}?text=${encodeURIComponent(pesan)}`,
    "_blank"
  );
});

window.addToCart = addToCart;

updateCart();