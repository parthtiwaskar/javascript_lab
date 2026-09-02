function generateBill() {
  let item = document.getElementById("itemName").value;
  let quantity = Number(document.getElementById("quantity").value);
  let price = Number(document.getElementById("price").value);

  if (item === "" || quantity <= 0 || price <= 0) {
    alert("Please enter valid details.");
    return;
  }

  let total = quantity * price;

  let gst = total * 0.18;

  let finalBill = total + gst;

  document.getElementById("bill").innerHTML = `
        <h2>Bill</h2>

        <p><strong>Item :</strong> ${item}</p>

        <p><strong>Quantity :</strong> ${quantity}</p>

        <p><strong>Price :</strong> ₹${price.toFixed(2)}</p>

        <hr>

        <p><strong>Total :</strong> ₹${total.toFixed(2)}</p>

        <p><strong>GST (18%) :</strong> ₹${gst.toFixed(2)}</p>

        <hr>

        <h3>Final Amount : ₹${finalBill.toFixed(2)}</h3>
    `;
}
