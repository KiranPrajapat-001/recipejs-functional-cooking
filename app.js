


const RecipeApp = (() => {
    'use strict';

    // ================= DATA =================
    const recipes = [
        {
            id: 1,
            title: 'Pasta',
            difficulty: 'easy',
            time: 25,
            description: 'Creamy Italian pasta',
            ingredients: ['pasta', 'cheese', 'milk']
        },
        {
            id: 2,
            title: 'Veg Biryani',
            difficulty: 'medium',
            time: 45,
            description: 'Spicy rice dish',
            ingredients: ['rice', 'vegetables', 'spices']
        },
        {
            id: 3,
            title: 'Salad',
            difficulty: 'easy',
            time: 10,
            description: 'Healthy fresh salad',
            ingredients: ['lettuce', 'tomato', 'cucumber']
        }
    ];

    // ================= STATE =================
    let currentFilter = 'all';
    let currentSort = 'none';
    let searchQuery = '';
    let favorites = JSON.parse(localStorage.getItem('recipeFavorites')) || [];
    let debounceTimer;

    // ================= DOM =================
    const recipeContainer = document.querySelector('#recipe-container');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.querySelector('#search-input');
    const clearSearchBtn = document.querySelector('#clear-search');
    const recipeCountDisplay = document.querySelector('#recipe-count');

    // ================= FILTERS =================
    const filterByDifficulty = (list, level) =>
        list.filter(r => r.difficulty === level);

    const filterByTime = (list, max) =>
        list.filter(r => r.time <= max);

    const filterBySearch = (list, query) => {
        if (!query) return list;
        const q = query.toLowerCase();
        return list.filter(r =>
            r.title.toLowerCase().includes(q) ||
            r.description.toLowerCase().includes(q) ||
            r.ingredients.some(i => i.toLowerCase().includes(q))
        );
    };

    const filterFavorites = list =>
        list.filter(r => favorites.includes(r.id));

    // ================= SORTS =================
    const applySort = (list, type) => {
        if (type === 'title') {
            return [...list].sort((a, b) => a.title.localeCompare(b.title));
        }
        if (type === 'time') {
            return [...list].sort((a, b) => a.time - b.time);
        }
        return list;
    };

    const applyFilter = (list, type) => {
        switch (type) {
            case 'easy': return filterByDifficulty(list, 'easy');
            case 'medium': return filterByDifficulty(list, 'medium');
            case 'hard': return filterByDifficulty(list, 'hard');
            case 'quick': return filterByTime(list, 30);
            case 'favorites': return filterFavorites(list);
            default: return list;
        }
    };

    // ================= RENDER =================
    const createRecipeCard = recipe => `
        <div class="recipe-card">
            <button class="favorite-btn" data-id="${recipe.id}">
                ${favorites.includes(recipe.id) ? '❤️' : '🤍'}
            </button>
            <h3>${recipe.title}</h3>
            <p>${recipe.description}</p>
            <p><strong>Time:</strong> ${recipe.time} min</p>
        </div>
    `;

    const renderRecipes = list => {
        recipeContainer.innerHTML = list.map(createRecipeCard).join('');
    };

    const updateCounter = (shown, total) => {
        recipeCountDisplay.textContent = `Showing ${shown} of ${total} recipes`;
    };

    const updateDisplay = () => {
        let list = filterBySearch(recipes, searchQuery);
        list = applyFilter(list, currentFilter);
        list = applySort(list, currentSort);
        updateCounter(list.length, recipes.length);
        renderRecipes(list);
    };

    // ================= FAVORITES =================
    const saveFavorites = () =>
        localStorage.setItem('recipeFavorites', JSON.stringify(favorites));

    const toggleFavorite = id => {
        id = Number(id);
        favorites = favorites.includes(id)
            ? favorites.filter(f => f !== id)
            : [...favorites, id];
        saveFavorites();
        updateDisplay();
    };

    // ================= EVENTS =================
    const setupEventListeners = () => {
        filterButtons.forEach(btn =>
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.filter;
                updateDisplay();
            })
        );

        sortButtons.forEach(btn =>
            btn.addEventListener('click', () => {
                currentSort = btn.dataset.sort;
                updateDisplay();
            })
        );

        recipeContainer.addEventListener('click', e => {
            if (e.target.classList.contains('favorite-btn')) {
                toggleFavorite(e.target.dataset.id);
            }
        });

        searchInput.addEventListener('input', e => {
            clearTimeout(debounceTimer);
            clearSearchBtn.style.display = e.target.value ? 'block' : 'none';
            debounceTimer = setTimeout(() => {
                searchQuery = e.target.value;
                updateDisplay();
            }, 300);
        });

        clearSearchBtn.addEventListener('click', () => {
            searchInput.value = '';
            searchQuery = '';
            clearSearchBtn.style.display = 'none';
            updateDisplay();
        });
    };

    // ================= INIT =================
    const init = () => {
        console.log('🍳 RecipeJS Ready');
        setupEventListeners();
        updateDisplay();
    };

    return { init };
})();

RecipeApp.init();
