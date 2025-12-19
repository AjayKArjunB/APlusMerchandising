/* Minimal demo e-commerce behavior (client-side only) */
const products = [
  { id: 'scrub-cap', title: 'Surgical Scrub Cap', description: 'Adjustable, breathable cap with mask buttons; washable and lightweight.', priceUSD: 3.59, img: 'images/scrub-cap.jpg' },
  { id: 'under-scrub', title: 'Underscrub (Long Sleeve)', description: 'Ultra-soft Pima cotton underscrub — breathable and sweat-absorbing for long shifts.', priceUSD: 9.59, img: 'images/under-scrub.jpg' },
  { id: 'premium-scrubs', title: 'Classic V-Neck Scrub', description: 'Modern V-neck with roomy pockets, side slits and back darts for a structured fit.', priceUSD: 13.19, img: 'images/premium-scrubs.jpg' },
  { id: 'lab-coat', title: 'Professional Lab Coat', description: 'Lightweight 100% polyester lab coat with multiple pockets and breathable fabric.', priceUSD: 13.19, img: 'images/lab-coat.jpg' },
  { id: 'sleeve-top', title: 'Cap Sleeve Scrub Top', description: 'Cap sleeve top with mandarin collar, hidden placket and practical pockets.', priceUSD: 14.39, img: 'images/sleeve-top.jpg' },
  { id: 'jogger-pants', title: 'Jogger Scrub Pants', description: 'Slim-fit jogger pants with 8 pockets, elastic waist and ankle cuffs.', priceUSD: 14.39, img: 'images/jogger-pants.jpg' }
];

const currencyRates = { USD: 1, EUR: 0.92, GBP: 0.80 };
let currency = localStorage.getItem('aplus_currency') || 'USD';

function formatPrice(amount, currencyCode){
  return new Intl.NumberFormat(undefined, { style: 'currency', currency: currencyCode }).format(amount);
}

function scrollToSection(id){
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    const el = document.createElement('div');
    el.className = 'product-card';
    el.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p class="small">${p.description}</p>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:.6rem">
        <div class="price">${priceFor(p.priceUSD)}</div>
        <button class="btn primary add-btn" data-id="${p.id}">Add</button>
      </div>
    `;
    grid.appendChild(el);
  });
}

function priceFor(usd){
  const converted = usd * (currencyRates[currency] || 1);
  return formatPrice(converted, currency);
}

// CART (simple localStorage)
const CART_KEY = 'aplus_cart';
function getCart(){
  return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}
function saveCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  renderCartCount();
}
function addToCart(id){
  const prod = products.find(p => p.id === id);
  if(!prod) return;
  const cart = getCart();
  const entry = cart.find(c => c.id === id);
  if(entry) entry.qty += 1; else cart.push({ id, qty: 1 });
  saveCart(cart);
}
function removeFromCart(id){
  const cart = getCart().filter(c => c.id !== id);
  saveCart(cart);
}
function cartTotal(){
  const cart = getCart();
  let totalUSD = 0;
  cart.forEach(ci => {
    const p = products.find(x => x.id === ci.id);
    if(p) totalUSD += p.priceUSD * ci.qty;
  });
  return totalUSD * (currencyRates[currency] || 1);
}
function renderCartCount(){
  document.getElementById('cartCount').textContent = getCart().reduce((s,i) => s + i.qty, 0);
}

let lastFocusedEl = null;

function openCart(){
  const dialog = document.getElementById('cartPanel');
  populateCartDialog();
  lastFocusedEl = document.activeElement;
  dialog.showModal();
  dialog.focus();
  document.getElementById('cartBtn').setAttribute('aria-expanded','true');
}
function closeCart(){
  const dialog = document.getElementById('cartPanel');
  dialog.close();
  document.getElementById('cartBtn').setAttribute('aria-expanded','false');
  if(lastFocusedEl) lastFocusedEl.focus();
}

function populateCartDialog(){
  const container = document.getElementById('cartItems');
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length === 0){ container.innerHTML = '<p class="small">Your cart is empty.</p>'; }
  cart.forEach(ci => {
    const p = products.find(x => x.id === ci.id);
    if(!p) return;
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div style="flex:1">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${p.title}</strong>
          <span class="small">${priceFor(p.priceUSD)}</span>
        </div>
        <div class="small">Qty: ${ci.qty}</div>
      </div>
      <div>
        <button class="btn ghost remove-btn" data-id="${p.id}">Remove</button>
      </div>
    `;
    container.appendChild(div);
  });
  document.getElementById('currencyLabel').textContent = currency;
  document.getElementById('cartTotal').textContent = (cartTotal()).toFixed(2);
}

// Event wiring
function setup(){
  // currency
  const cur = document.getElementById('currency');
  cur.value = currency;
  cur.addEventListener('change', e => { currency = e.target.value; localStorage.setItem('aplus_currency', currency); renderProducts(); renderCartCount(); });

  // render products & cart
  renderProducts();
  renderCartCount();

  // delegate add buttons
  document.addEventListener('click', e => {
    const a = e.target.closest('.add-btn');
    if(a){ addToCart(a.dataset.id); renderCartCount(); return; }
    const r = e.target.closest('.remove-btn');
    if(r){ removeFromCart(r.dataset.id); populateCartDialog(); return; }
    if(e.target.id === 'cartBtn'){ openCart(); }
    if(e.target.id === 'closeCart'){ closeCart(); }
    if(e.target.id === 'checkoutBtn'){ alert('Demo checkout: this is a static demo. Implement payment integration to accept payments.'); }
  });

  // cart dialog close on escape
  const dialog = document.getElementById('cartPanel');
  dialog.addEventListener('close', () => { document.getElementById('cartBtn').setAttribute('aria-expanded','false'); });

  // contact form
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    // Demo behavior: send to Formspree if user replaced action; otherwise show local success message
    const formAction = form.getAttribute('action');
    const status = document.getElementById('formStatus');
    if(formAction){
      try{
        const res = await fetch(formAction, { method:'POST', body: data, headers: { 'Accept': 'application/json' } });
        if(res.ok) status.textContent = 'Thanks — we received your message.'; else status.textContent = 'There was a problem sending your message.';
      }catch(err){ status.textContent = 'Unable to send message (network error).'; }
      form.reset();
    } else {
      status.textContent = 'Thanks! (Demo) Your message was noted. Replace the form action with your Formspree endpoint to enable real submissions.';
      form.reset();
    }
  });

  document.getElementById('year').textContent = new Date().getFullYear();
}

// Initialize when DOM is ready
if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setup); else setup();

export { scrollToSection };
