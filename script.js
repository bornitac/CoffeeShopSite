console.clear();

// the 6 coffee products
const products = [
  {
    id: 1,
    name: 'Espresso Cup',
    price: 9.99,
    image:
      'https://m.media-amazon.com/images/I/61R8s8PwKWL.__AC_SY300_SX300_QL70_FMwebp_.jpg',
  },
  {
    id: 2,
    name: 'Latte Mug',
    price: 12.99,
    image:
      'https://i.etsystatic.com/11902728/r/il/cabccd/3141196787/il_1588xN.3141196787_8gwu.jpg',
  },
  {
    id: 3,
    name: 'Travel Tumbler',
    price: 19.99,
    image:
      'https://www.mysticmonkcoffee.com/cdn/shop/products/Monk_Press_Travel_Mug_5000x.jpg?v=1614039701',
  },
  {
    id: 4,
    name: 'French Press',
    price: 24.99,
    image:
      'https://www.simplyrecipes.com/thmb/P3VbZlGeTFLRZXYj12IWv5uBjgo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/Simply-Recipes-French-Press-Coffee-METHOD-07-e61f9c9136b94f3389522ec2f52892a5.jpg',
  },
  {
    id: 5,
    name: 'Coffee Beans Bag',
    price: 14.99,
    image:
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Coffee Scoop',
    price: 4.99,
    image:
      'https://m.media-amazon.com/images/I/810uslzCtmL._AC_UF894,1000_QL80_.jpg',
  },
];

let cart = [];

document.addEventListener('DOMContentLoaded', () => {
  loadCart();
  renderProducts();
  renderCart();
});

function renderProducts() {
  const grid = document.querySelector('.products-grid');
  products.forEach((p) => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h3>${p.name}</h3>
      <p>$${p.price.toFixed(2)}</p>
      <button data-id="${p.id}">Add to Cart</button>
    `;
    grid.appendChild(div);
    div
      .querySelector('button')
      .addEventListener('click', () => addToCart(p.id));
  });
}

function loadCart() {
  const stored = localStorage.getItem('coffeeCart');
  cart = stored ? JSON.parse(stored) : [];
}
function saveCart() {
  localStorage.setItem('coffeeCart', JSON.stringify(cart));
}

function addToCart(id) {
  const item = cart.find((i) => i.id === id);
  if (item) item.quantity++;
  else {
    const prod = products.find((p) => p.id === id);
    cart.push({ id: prod.id, name: prod.name, price: prod.price, quantity: 1 });
  }
  saveCart();
  renderCart();
}
function removeFromCart(id) {
  cart = cart.filter((i) => i.id !== id);
  saveCart();
  renderCart();
}
function updateQuantity(id, qty) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity = qty;
  if (item.quantity < 1) removeFromCart(id);
  else {
    saveCart();
    renderCart();
  }
}

function renderCart() {
  const container = document.getElementById('cart-rows');
  container
    .querySelectorAll('.cart-row:not(.header)')
    .forEach((row) => row.remove());

  cart.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'cart-row';
    row.innerHTML = `
      <div class="col item">${item.name}</div>
      <div class="col price">$${item.price.toFixed(2)}</div>
      <div class="col qty">
        <input type="number" min="1" value="${item.quantity}" data-id="${
      item.id
    }">
      </div>
      <div class="col subtotal">$${(item.price * item.quantity).toFixed(
        2
      )}</div>
      <div class="col actions">
        <button data-id="${item.id}">Remove</button>
      </div>
    `;
    container.appendChild(row);
    row
      .querySelector('input')
      .addEventListener('change', (e) =>
        updateQuantity(item.id, parseInt(e.target.value, 10))
      );
    row
      .querySelector('button')
      .addEventListener('click', () => removeFromCart(item.id));
  });

  updateSummary();
}

function updateSummary() {
  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach(function(item) {
    totalItems += item.quantity;
    totalPrice += item.quantity * item.price;
  });

  let label = 'items';
  if (totalItems === 1) {
    label = 'item';
  }

  document.getElementById('cart-count').textContent =
    totalItems + ' ' + label + ' in cart';
  document.getElementById('cart-total').textContent =
    'Total: $' + totalPrice.toFixed(2);
}
