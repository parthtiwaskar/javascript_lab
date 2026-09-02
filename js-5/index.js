// Shopping cart array
let cart = [];

// Add product to cart
function addToCart(name, price) {
  let product = {
    name: name,
    price: price,
  };

  // Add product to array
  cart.push(product);

  displayCart();
}

// Display cart
function displayCart() {
  let cartItems = document.getElementById("cartItems");

  cartItems.innerHTML = "";

  // Check if cart is empty
  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">Your cart is empty.</p>';

    document.getElementById("total").innerText = 0;

    return;
  }

  // Display every cart item
  cart.forEach(function (product, index) {
    let item = document.createElement("div");

    item.className = "cart-item";

    item.innerHTML = `
            <div class="item-info">
                <h3>${product.name}</h3>
                <p>₹${product.price}</p>
            </div>

            <button 
                class="remove-btn"
                onclick="removeFromCart(${index})">
                Remove
            </button>
        `;

    cartItems.appendChild(item);
  });

  // Calculate total using reduce()
  let total = cart.reduce(function (sum, product) {
    return sum + product.price;
  }, 0);

  document.getElementById("total").innerText = total;
}

// Remove product from cart
function removeFromCart(index) {
  // Remove one item from array
  cart.splice(index, 1);

  displayCart();
}

// Clear entire cart
function clearCart() {
  cart = [];

  displayCart();
}
