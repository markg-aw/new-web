// --- CUSTOM CURSOR ---
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  const posX = e.clientX;
  const posY = e.clientY;
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;
  cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 500, fill: "forwards" });
});

const hoverElements = document.querySelectorAll('a, button, .product-card, .filter-btn, .insta-item');
hoverElements.forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// --- IMAGE LOADING LOGIC (BAGO) ---
// Kapag na-download na ng browser yung image, lalabas na ito at mawawala yung skeleton
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll('.real-img');
  
  images.forEach(img => {
    if (img.complete) {
      img.classList.add('loaded'); // Kung naka-cache na, ilabas agad
    } else {
      img.addEventListener('load', () => {
        img.classList.add('loaded'); // Kapag katatapos lang mag-load, ilabas
      });
      img.addEventListener('error', () => {
        // Kung basag yung image (tulad ng sa mascara), itago muna or hayaan lang
        img.classList.add('loaded'); 
      });
    }
  });
});

// --- SCROLL & THEME ---
function scrollToProducts() { document.getElementById('products').scrollIntoView({ behavior: 'smooth' }); }
function toggleTheme() {
  const body = document.body;
  const themeIcon = document.getElementById('themeIcon');
  body.classList.toggle('light-mode');
  if (body.classList.contains('light-mode')) {
    themeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>';
  } else {
    themeIcon.innerHTML = '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>';
  }
}

// --- MODAL LOGIC ---
function openModal(modalId) {
  document.getElementById(modalId).classList.add('active');
}
function closeModal(modalId) {
  document.getElementById(modalId).classList.remove('active');
}

// --- CART & PROMO LOGIC ---
let cart = []; 
let discountApplied = false; 
const freeShippingThreshold = 1500; 

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function addToCart(productName, price) {
  const existingItem = cart.find(item => item.name === productName);
  if (existingItem) { existingItem.quantity += 1; } 
  else { cart.push({ name: productName, price: price, quantity: 1 }); }
  updateCartUI();
  if (!document.getElementById('cartSidebar').classList.contains('active')) { toggleCart(); }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function applyPromo() {
  const promoInput = document.getElementById('promoInput').value.toUpperCase();
  if (promoInput === 'W2FUTURE') {
    discountApplied = true;
    alert('Promo Applied! 10% Discount 🎉');
    updateCartUI();
  } else {
    alert('Invalid Promo Code.');
  }
}

function updateCartUI() {
  const cartItemsContainer = document.getElementById('cartItems');
  const cartTotalElement = document.getElementById('cartTotal');
  const cartCountElement = document.getElementById('cartCount'); 
  const shippingMessage = document.getElementById('shippingMessage');
  const shippingProgress = document.getElementById('shippingProgress');
  
  cartItemsContainer.innerHTML = '';
  let total = 0;
  let totalItems = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
  } else {
    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      totalItems += item.quantity;
      
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <h4>${item.name} (x${item.quantity})</h4>
          <p>₱${item.price * item.quantity}</p>
        </div>
        <button class="remove-btn" onclick="removeFromCart(${index})">X</button>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
  }

  let finalTotal = total;
  if (discountApplied && total > 0) { finalTotal = total - (total * 0.10); }

  cartTotalElement.innerText = `₱${finalTotal.toFixed(2)}`;
  cartCountElement.innerText = totalItems; 

  if (total >= freeShippingThreshold) {
    shippingMessage.innerHTML = "🎉 You've unlocked <span>FREE Shipping!</span>";
    shippingProgress.style.width = "100%";
  } else {
    const remaining = freeShippingThreshold - total;
    shippingMessage.innerHTML = `Add <span>₱${remaining}</span> more for FREE Shipping!`;
    const percentage = (total / freeShippingThreshold) * 100;
    shippingProgress.style.width = `${percentage}%`;
  }
}

// --- CHECKOUT FLOW ---
function openCheckout() {
  if (cart.length === 0) {
    alert("Wala pang laman ang cart mo!");
  } else {
    toggleCart(); 
    setTimeout(() => openModal('checkoutModal'), 300); 
  }
}

function processCheckout() {
  alert("Order Placed Successfully! 🎉 Thank you for shopping with W2.");
  cart = []; 
  discountApplied = false; 
  document.getElementById('promoInput').value = '';
  updateCartUI();
  closeModal('checkoutModal');
}

// --- FILTER & SEARCH ---
let currentCategory = 'all';
let searchQuery = '';

function setCategory(category, btnElement) {
  currentCategory = category;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  filterProducts();
}

function filterProducts() {
  searchQuery = document.getElementById('searchInput').value.toLowerCase();
  const products = document.querySelectorAll('.product-card');

  products.forEach(product => {
    const category = product.getAttribute('data-category');
    const name = product.getAttribute('data-name').toLowerCase();
    const matchesCategory = (currentCategory === 'all' || category === currentCategory);
    const matchesSearch = name.includes(searchQuery);

    if (matchesCategory && matchesSearch) { product.classList.remove('hide'); } 
    else { product.classList.add('hide'); }
  });
}

// --- QUICK VIEW MODAL ---
let currentModalProduct = { name: '', price: 0 };

function openQuickView(name, category, price, imgSrc) {
  document.getElementById('quickViewModal').classList.add('active');
  document.getElementById('modalTitle').innerText = name;
  document.getElementById('modalCategory').innerText = category;
  document.getElementById('modalPrice').innerText = price;
  document.getElementById('modalImg').src = imgSrc;
  currentModalProduct.name = name;
  currentModalProduct.price = parseInt(price.replace(/[^0-9]/g, ''));
}

function addToCartFromModal() {
  addToCart(currentModalProduct.name, currentModalProduct.price);
  closeModal('quickViewModal');
}

// --- SCROLL REVEAL ---
window.addEventListener('scroll', reveal);
function reveal() {
  var reveals = document.querySelectorAll('.reveal');
  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 100;
    if (elementTop < windowHeight - elementVisible) { reveals[i].classList.add('active'); }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  reveal();
  updateCartUI();
});
