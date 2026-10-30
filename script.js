function scrollToProducts() {
  document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
}

let cartCount = 0;
const cartBtn = document.getElementById('cartBtn');

function addToCart(productName) {
  cartCount++;
  cartBtn.innerText = `Cart (${cartCount})`;
  
  // Bounce animation sa cart button
  cartBtn.style.transform = 'scale(1.15)';
  setTimeout(() => {
    cartBtn.style.transform = 'scale(1)';
  }, 150);

  // Non-blocking toast notification imbes na alert
  showToast(`${productName} added to cart! 🛒`);
}

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%) translateY(100px);
    background: #064e3b;
    color: white;
    padding: 14px 24px;
    border-radius: 30px;
    font-size: 0.9rem;
    font-weight: bold;
    box-shadow: 0 8px 24px rgba(0,0,0,0.25);
    z-index: 1000;
    opacity: 0;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    pointer-events: none;
  `;
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.transform = 'translateX(-50%) translateY(0)';
    toast.style.opacity = '1';
  });
  
  setTimeout(() => {
    toast.style.transform = 'translateX(-50%) translateY(100px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 2200);
}
