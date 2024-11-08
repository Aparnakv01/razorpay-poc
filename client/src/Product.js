import React, { useState } from "react";
import Tshirt1 from "./images/Tshirt1.jpg";
import Tshirt2 from "./images/Tshirt2.jpg";
import Tshirt3 from "./images/Tshirt3.jpg";


function Product() {
  const [purchaseComplete, setPurchaseComplete] = useState(false);
  const amount = 500;
  const currency = "INR";
  const receiptId = "qwsaq1";
  
  const products = [
    {
      id: "Tshirt1",
      name: "Solid Blue T-Shirt",
      description: "A comfortable, solid blue cotton T-shirt.",
      price: 500,
      image: Tshirt1,
    },
    {
      id: "Tshirt2",
      name: "Classic Black T-Shirt",
      description: "A stylish, classic black cotton T-shirt.",
      price: 600,
      image: Tshirt2,
    },
    {
      id: "Tshirt3",
      name: "Striped T-Shirt",
      description: "A trendy striped T-shirt for casual wear.",
      price: 550,
      image: Tshirt3,
    },
  ];

  const paymentHandler = async (productId, amount) => {
    const response = await fetch("http://localhost:3000/order", {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);

    var options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount,
      currency,
      name: "Shopifyze",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order.id,
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          "http://localhost:3000/order/validate",
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
        
        // Set the purchaseComplete state to true if payment is successful
        setPurchaseComplete(true);
      },
      prefill: {
        name: "Web Dev Matrix",
        email: "webdevmatrix@example.com",
        contact: "9000000000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
      method: {
        upi: true, 
        card: true,
        netbanking: true,
        wallet: true
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.description);
    });
    rzp1.open();
  };

  return (
    <div className="product-page">
      <div className="sidebar">
        <h2>Shopifyze</h2>
        <ul>
          <li>Home</li>
          <li>Products</li>
          <li>About Us</li>
          <li>Contact</li>
        </ul>
      </div>
      <div className="main-content">
        <h1 className="page-title">Explore Our Collection</h1>
        {purchaseComplete ? (
          <div className="purchase-complete">
            <h2>Thank you for your purchase!</h2>
            <p>Your order has been successfully placed.</p>
            <button onClick={() => setPurchaseComplete(false)} className="continue-shopping-button">
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="product-list">
            {products.map((product) => (
              <div key={product.id} className="product-item">
                <img src={product.image} alt={product.name} className="product-image" />
                <h3 className="product-title">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: ₹{product.price}</p>
                <button
                  onClick={() => paymentHandler(product.id, product.price)}
                  className="pay-button"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Product;
