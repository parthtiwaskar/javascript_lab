const cart = {};
const shipping = 5.0;
const format = (price) => `$${price.toFixed(2)}`;

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  let total = 0;

  cartItems.innerHTML = "";

  for (let item in cart) {
    const cost = cart[item].price * cart[item].qty;
    total += cost;

    cartItems.innerHTML += `
      <div class="cart-item">
        ${item} x${cart[item].qty} — ${format(cost)}
      </div>
    `;
  }

  if (total === 0) {
    cartItems.textContent = "Your cart is empty.";
  }

  document.getElementById("subtotalAmount").textContent = format(total);
  document.getElementById("totalAmount").textContent = format(total + shipping);
  document.getElementById("shippingAmount").textContent = format(shipping);
}

document.querySelectorAll("button[data-name]").forEach((btn) => {
  btn.onclick = () => {
    const name = btn.dataset.name;
    const price = +btn.dataset.price;

    if (!cart[name]) {
      cart[name] = { price, qty: 0 };
    }

    cart[name].qty++;
    updateCart();
  };
});

updateCart();
