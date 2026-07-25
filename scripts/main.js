/* ═══════════════════════════════════════════════════════════════
   SHEIN HUB — Motion & Interaction (Complete)
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── 1. Loading Screen ──────────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 400);
    });
    // Fallback if load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => loader.classList.add('hidden'), 400);
    }
  }


  /* ─── 2. Nav: Scroll Border + Auto-Hide ──────────────────── */
  const nav = document.getElementById('main-nav');
  let lastScrollY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 60);
      if (y > 200) {
        nav.classList.toggle('hidden', y > lastScrollY);
      } else {
        nav.classList.remove('hidden');
      }
    }
    lastScrollY = y;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ─── 3. Mobile Menu Toggle ──────────────────────────────── */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close when a mobile link is tapped
    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  /* ─── 4. Hero Dual-Image Slider ──────────────────────────── */
  const heroImages = document.querySelectorAll('.hero__image');
  let heroIdx = 0;

  if (heroImages.length > 1) {
    setInterval(() => {
      heroImages[heroIdx].classList.remove('hero__image--active');
      heroIdx = (heroIdx + 1) % heroImages.length;
      heroImages[heroIdx].classList.add('hero__image--active');
    }, 5000);
  }


  /* ─── 5. Scroll Reveals (IntersectionObserver) ───────────── */
  const reveals = document.querySelectorAll('.reveal');

  if (reveals.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || '0', 10);
          setTimeout(() => el.classList.add('revealed'), delay);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(el => revealObserver.observe(el));
  }


  /* ─── 6. Product Filtering ──────────────────────────────── */
  const filterBtns   = document.querySelectorAll('.filter-btn');
  const productCards  = document.querySelectorAll('.product-card');
  const shopHeading   = document.getElementById('shop-heading');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      const filter = btn.dataset.filter;

      // Update heading
      if (shopHeading) {
        shopHeading.textContent = filter === 'all'
          ? 'All Pieces'
          : filter.charAt(0).toUpperCase() + filter.slice(1);
      }

      // Show / hide cards
      productCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || filter === cat) {
          card.style.display = '';
          card.classList.remove('revealed');
          requestAnimationFrame(() => {
            requestAnimationFrame(() => card.classList.add('revealed'));
          });
        } else {
          card.style.display = 'none';
        }
      });

      // Update active states on ALL filter buttons with same value
      filterBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll(`.filter-btn[data-filter="${filter}"]`).forEach(b => {
        b.classList.add('active');
      });

      // Scroll to shop
      const shopSection = document.getElementById('shop');
      if (shopSection) {
        window.scrollTo({
          top: shopSection.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });


  /* ─── 7. Shopping Cart ──────────────────────────────────── */
  let cart = [];

  const cartBtn       = document.getElementById('open-cart');
  const closeBtn      = document.getElementById('close-cart');
  const cartDrawer    = document.getElementById('cart-drawer');
  const cartOverlay   = document.getElementById('cart-overlay');
  const cartBadge     = document.getElementById('cart-badge');
  const cartItems     = document.getElementById('cart-items-container');
  const cartTotal     = document.getElementById('cart-total-price');
  const addBtns       = document.querySelectorAll('.add-to-cart-btn');

  const openCart  = () => {
    cartDrawer?.classList.add('open');
    cartOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeCart = () => {
    cartDrawer?.classList.remove('open');
    cartOverlay?.classList.remove('open');
    document.body.style.overflow = '';
  };

  cartBtn?.addEventListener('click', openCart);
  closeBtn?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  const renderCart = () => {
    if (!cartBadge || !cartItems || !cartTotal) return;

    cartBadge.textContent = cart.length;
    cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';

    if (cart.length === 0) {
      cartItems.innerHTML = '<p style="text-align:center; padding:3rem 0; color:var(--color-sand); font-size:0.85rem;">Your cart is currently empty.</p>';
      cartTotal.textContent = 'PKR 0';
      return;
    }

    let total = 0;
    cartItems.innerHTML = '';

    cart.forEach((item, i) => {
      total += parseInt(item.price, 10);
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <img src="${item.img}" alt="${item.name}" class="cart-item__image">
        <div class="cart-item__info">
          <h4 class="cart-item__name">${item.name}</h4>
          <span class="cart-item__price">PKR ${Number(item.price).toLocaleString()}</span>
          <button class="cart-item__remove" data-index="${i}">Remove</button>
        </div>`;
      cartItems.appendChild(el);
    });

    cartTotal.textContent = `PKR ${total.toLocaleString()}`;

    cartItems.querySelectorAll('.cart-item__remove').forEach(btn => {
      btn.addEventListener('click', () => {
        cart.splice(parseInt(btn.dataset.index), 1);
        renderCart();
      });
    });
  };

  addBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      cart.push({
        id:    btn.dataset.id,
        name:  btn.dataset.name,
        price: btn.dataset.price,
        img:   btn.dataset.img
      });
      renderCart();
      openCart();
    });
  });

  renderCart(); // init badge state


  /* ─── 8. Back to Top ────────────────────────────────────── */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

});
