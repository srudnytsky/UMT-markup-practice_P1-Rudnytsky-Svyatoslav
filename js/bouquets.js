// bouquets.js
// Fetches bouquets from a mock API (json-server) via axios and renders
// them dynamically into #bouquets-list. Supports "Load more" pagination
// and category / text filtering, with app state kept in one place.

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'http://localhost:3000/bouquets';

  const listEl = document.querySelector('#bouquets-list');
  const statusEl = document.querySelector('#bouquets-status');
  const loadMoreBtn = document.querySelector('#load-more');
  const searchInput = document.querySelector('#bouquet-search');
  const categorySelect = document.querySelector('#bouquet-category');

  if (!listEl) return; // section not present on this page

  // Single source of truth for the app's current state.
  const state = {
    page: 1,
    limit: 6,
    category: 'all',
    search: '',
  };

  let debounceTimer = null;

  function cardTemplate(item) {
    // Content images use srcset for x1/x2. Replace the "@2x" filenames
    // with real exported retina assets in your images/ folder.
    return `
      <li class="bouquet-card" data-id="${item.id}">
        <div class="bouquet-card__image">
          <img
            src="images/${item.image}"
            srcset="images/${item.image} 1x, images/${item.image.replace(/\.(jpg|jpeg|png)$/i, '@2x.$1')} 2x"
            alt="${item.alt || item.title}"
            width="400" height="400" loading="lazy">
        </div>
        <div class="bouquet-card__info">
          <h3 class="bouquet-card__title">${item.title}</h3>
          <p class="bouquet-card__desc">${item.desc}</p>
          <div class="bouquet-card__price">$${item.price}</div>
          <button type="button" class="btn btn--primary bouquet-card__order-btn" data-order="${item.title}">
            Order
          </button>
        </div>
      </li>
    `;
  }

  function setStatus(message) {
    if (!message) {
      statusEl.hidden = true;
      statusEl.textContent = '';
      return;
    }
    statusEl.hidden = false;
    statusEl.textContent = message;
  }

  function clearList() {
    listEl.innerHTML = '';
  }

  async function fetchBouquets({ isReset = false } = {}) {
    loadMoreBtn.disabled = true;
    setStatus(isReset ? 'Loading bouquets…' : 'Loading more…');

    try {
      const params = {
        _page: state.page,
        _limit: state.limit,
      };
      if (state.category !== 'all') params.category = state.category;
      if (state.search.trim()) params.q = state.search.trim();

      const response = await axios.get(API_URL, { params });
      const items = response.data;

      if (isReset) clearList();

      if (items.length === 0 && state.page === 1) {
        setStatus('No bouquets match your search. Try a different filter.');
        loadMoreBtn.hidden = true;
        return;
      }

      // Single batch insert per request — not one insertAdjacentHTML per item.
      const markup = items.map(cardTemplate).join('');
      listEl.insertAdjacentHTML('beforeend', markup);

      if (items.length < state.limit) {
        loadMoreBtn.hidden = true;
        setStatus("You've reached the end of the collection.");
      } else {
        loadMoreBtn.hidden = false;
        setStatus('');
      }
    } catch (error) {
      console.error('Failed to load bouquets:', error);
      setStatus('Something went wrong while loading bouquets. Please try again later.');
      loadMoreBtn.hidden = true;
    } finally {
      loadMoreBtn.disabled = false;
    }
  }

  function resetAndFetch() {
    state.page = 1;
    fetchBouquets({ isReset: true });
  }

  // ==================== EVENTS ====================
  loadMoreBtn.addEventListener('click', () => {
    state.page += 1;
    fetchBouquets({ isReset: false });
  });

  if (categorySelect) {
    categorySelect.addEventListener('change', (event) => {
      state.category = event.target.value;
      resetAndFetch();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      clearTimeout(debounceTimer);
      const value = event.target.value;
      debounceTimer = setTimeout(() => {
        state.search = value;
        resetAndFetch();
      }, 400);
    });
  }

  // Open the order modal from a card, pre-filling the subtitle with the bouquet name.
  listEl.addEventListener('click', (event) => {
    const orderBtn = event.target.closest('[data-order]');
    if (!orderBtn) return;

    const title = orderBtn.getAttribute('data-order');
    const subtitle = document.querySelector('#order-modal-subtitle');
    if (subtitle) {
      subtitle.textContent = `You're requesting: "${title}". Add any extra details below.`;
    }
    if (typeof window.openOrderModal === 'function') {
      window.openOrderModal();
    }
  });

  // Initial load
  fetchBouquets({ isReset: true });
});