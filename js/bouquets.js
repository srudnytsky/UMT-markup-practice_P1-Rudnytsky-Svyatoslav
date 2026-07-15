// bouquets.js
// Loads bouquets from a mock API (json-server) via axios and renders
// them dynamically into #bouquets-list. Supports "Load more" pagination
// and category / text filtering. Clicking a card opens the product modal
// (handled in modal.js via the [data-bouquet-card] delegation).

document.addEventListener('DOMContentLoaded', () => {
  const API_URL = 'https://my-json-server.typicode.com/srudnytsky/UMT-markup-practice_P1-Rudnytsky-Svyatoslav/tree/dz-2/bouquets';

  const listEl = document.querySelector('#bouquets-list');
  const statusEl = document.querySelector('#bouquets-status');
  const loadMoreBtn = document.querySelector('#load-more');
  const searchInput = document.querySelector('#bouquet-search');
  const categorySelect = document.querySelector('#bouquet-category');

  if (!listEl) return; // section not present on this page

  const state = {
    page: 1,
    limit: 6,
    category: 'all',
    search: '',
  };

  let debounceTimer = null;

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;');
  }

  function cardTemplate(item) {
    const imagePath = `images/${item.image}`;
    const image2x = imagePath.replace(/\.(jpg|jpeg|png)$/i, '@2x.$1');

    return `
      <li class="bouquet-card" data-bouquet-card tabindex="0" role="button"
          data-id="${item.id}"
          data-title="${escapeAttr(item.title)}"
          data-price="${item.price}"
          data-desc="${escapeAttr(item.desc)}"
          data-image="${imagePath}">
        <div class="bouquet-card__image">
          <img
            src="${imagePath}"
            srcset="${imagePath} 1x, ${image2x} 2x"
            alt="${escapeAttr(item.alt || item.title)}"
            width="400" height="400" loading="lazy">
        </div>
        <div class="bouquet-card__info">
          <h3 class="bouquet-card__title">${item.title}</h3>
          <p class="bouquet-card__desc">${item.desc}</p>
          <div class="bouquet-card__price">$${item.price}</div>
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

  // Initial load
  fetchBouquets({ isReset: true });
});