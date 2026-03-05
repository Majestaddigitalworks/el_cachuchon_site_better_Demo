const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });
revealEls.forEach((el) => observer.observe(el));

const floatingBrand = document.getElementById('floatingBrand');
const onScroll = () => {
  const y = window.scrollY || 0;
  if (floatingBrand) {
    const move = Math.min(120, y * 0.18);
    floatingBrand.style.transform = `translateY(${move}px)`;
  }
  document.body.classList.toggle('scrolled', y > 80);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

function fakeSubmit(event) {
  event.preventDefault();
  showToast('Placeholder signup captured. Ready to connect later.');
  return false;
}
window.fakeSubmit = fakeSubmit;

const products = {
  'midnight-crown': {
    name: 'Midnight Crown',
    price: '$60',
    stock: 'Only 1 available',
    badge: 'Featured fitted',
    image: 'assets/img/product-1.jpg',
    description: 'A monochrome fitted with the crown front mark and a clean blackout finish. Built to feel like a centerpiece drop.',
    colors: ['Black / Silver'],
    sizes: ['7', '7 1/8', '7 1/4', '7 3/8'],
    details: { Style: 'Structured fitted', Material: 'Wool blend mockup', Logo: 'Crown front embroidery', Release: 'Vault sample drop' }
  },
  'la-sample': {
    name: 'LA Sample',
    price: '$60',
    stock: 'Only 1 available',
    badge: 'Sample cap',
    image: 'assets/img/product-2.jpg',
    description: 'Using your uploaded LA sample image as a product display cap for now. Dark luxury feel with a clean front hit.',
    colors: ['Black / Silver'],
    sizes: ['7', '7 1/8', '7 1/4', '7 1/2'],
    details: { Style: 'Sample fitted', Material: 'Premium mockup finish', Logo: 'LA sample front mark', Release: 'Display section piece' }
  },
  'd-sample': {
    name: 'D Sample',
    price: '$60',
    stock: 'Only 1 available',
    badge: 'Sample cap',
    image: 'assets/img/product-3.jpg',
    description: 'A dark fitted placeholder built from the uploaded D sample image. Good for showing the store layout until the final product photos arrive.',
    colors: ['Black / Silver'],
    sizes: ['7', '7 1/4', '7 3/8', '7 1/2'],
    details: { Style: 'Sample fitted', Material: 'Premium mockup finish', Logo: 'D front letter', Release: 'Display section piece' }
  },
  'black-vault': {
    name: 'Black Vault',
    price: '$60',
    stock: 'Small batch',
    badge: 'Vault drop',
    image: 'assets/img/product-4.jpg',
    description: 'A secondary display cap used for building out the vault section and future drop area.',
    colors: ['Black / Black'],
    sizes: ['7', '7 1/8', '7 1/4'],
    details: { Style: 'Collector fitted', Material: 'Wool blend mockup', Logo: 'Blackout front embroidery', Release: 'Future drop area' }
  },
  'hustle-mark': {
    name: 'Hustle Mark',
    price: '$60',
    stock: 'Small batch',
    badge: 'Vault drop',
    image: 'assets/img/product-5.jpg',
    description: 'A repeat display cap for rounding out the store grid while keeping the same premium visual direction.',
    colors: ['Black / Silver'],
    sizes: ['7 1/8', '7 1/4', '7 3/8'],
    details: { Style: 'Collector fitted', Material: 'Premium mockup finish', Logo: 'Script front mark', Release: 'Future drop area' }
  },
  'street-script': {
    name: 'Street Script',
    price: '$48',
    stock: 'Available soon',
    badge: 'Future drop',
    image: 'assets/img/product-6.jpg',
    description: 'A softer-priced display piece to give the mock store a more complete collection feel.',
    colors: ['Black / White'],
    sizes: ['7', '7 1/8', '7 1/4', '7 3/8'],
    details: { Style: 'Classic fitted', Material: 'Wool blend mockup', Logo: 'Script front embroidery', Release: 'Coming soon' }
  }
};

const modal = document.getElementById('productModal');
const modalTitle = document.getElementById('modalTitle');
const modalBadge = document.getElementById('modalBadge');
const modalPrice = document.getElementById('modalPrice');
const modalStock = document.getElementById('modalStock');
const modalDescription = document.getElementById('modalDescription');
const modalImage = document.getElementById('modalImage');
const colorOptions = document.getElementById('colorOptions');
const sizeOptions = document.getElementById('sizeOptions');
const detailList = document.getElementById('detailList');
const addToCartBtn = document.getElementById('addToCartBtn');
const cartCount = document.getElementById('cartCount');
const toast = document.getElementById('toast');

let currentProductId = null;
let selectedSize = '';
let selectedColor = '';
let cartTotal = 0;

function buildPills(container, values, activeValue, onClick) {
  container.innerHTML = '';
  values.forEach((value, index) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'pill' + ((activeValue ? value === activeValue : index === 0) ? ' is-active' : '');
    btn.textContent = value;
    btn.addEventListener('click', () => {
      [...container.children].forEach((child) => child.classList.remove('is-active'));
      btn.classList.add('is-active');
      onClick(value);
    });
    container.appendChild(btn);
  });
}

function buildDetails(details) {
  detailList.innerHTML = '';
  Object.entries(details).forEach(([label, value]) => {
    const card = document.createElement('div');
    card.className = 'detail-card';
    card.innerHTML = `<span class="detail-label">${label}</span><span class="detail-value">${value}</span>`;
    detailList.appendChild(card);
  });
}

function openModal(productId) {
  const product = products[productId];
  if (!product) return;

  currentProductId = productId;
  selectedSize = product.sizes[0] || '';
  selectedColor = product.colors[0] || '';

  modalTitle.textContent = product.name;
  modalBadge.textContent = product.badge;
  modalPrice.textContent = product.price;
  modalStock.textContent = product.stock;
  modalDescription.textContent = product.description;
  modalImage.src = product.image;
  modalImage.alt = product.name;

  buildPills(colorOptions, product.colors, selectedColor, (value) => { selectedColor = value; });
  buildPills(sizeOptions, product.sizes, selectedSize, (value) => { selectedSize = value; });
  buildDetails(product.details);

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.classList.remove('is-visible');
  }, 2200);
}

function addCurrentToCart() {
  const product = products[currentProductId];
  if (!product) return;
  cartTotal += 1;
  cartCount.textContent = String(cartTotal);
  showToast(`${product.name} added to cart • ${selectedSize} • ${selectedColor}`);
  closeModal();
}

[...document.querySelectorAll('[data-product-id]')].forEach((card) => {
  card.addEventListener('click', (event) => {
    const button = event.target.closest('.open-product');
    if (button || card.classList.contains('mini-card')) {
      openModal(card.dataset.productId);
    }
  });
});

[...document.querySelectorAll('[data-close-modal]')].forEach((el) => {
  el.addEventListener('click', closeModal);
});

addToCartBtn.addEventListener('click', addCurrentToCart);

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
});

document.getElementById('openCartBtn').addEventListener('click', () => {
  showToast(cartTotal ? `Cart has ${cartTotal} item${cartTotal > 1 ? 's' : ''}.` : 'Your cart is empty for now.');
});
