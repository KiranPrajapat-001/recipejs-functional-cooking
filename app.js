// Recipe data - Foundation for all 4 parts
const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta",
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry",
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking",
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad",
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat",
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian",
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles",
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza",
    },
];

// DOM Selection
const recipeContainer = document.querySelector('#recipe-container');

// Create HTML for a single recipe card
const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>
            <p>${recipe.description}</p>
        </div>
    `;
};

// Render recipes to the DOM
const renderRecipes = (recipesToRender) => {
    const recipeCardsHTML = recipesToRender
        .map(createRecipeCard)
        .join('');

    recipeContainer.innerHTML = recipeCardsHTML;
};

// Initialize App
renderRecipes(recipes);

// ============================================
// STATE MANAGEMENT
// ============================================
let currentFilter = "all";
let currentSort = "none";
const filterButtons = document.querySelectorAll(".filter-btn");
const sortButtons = document.querySelectorAll(".sort-btn");


// ============================================
// PURE FILTER FUNCTIONS
// ============================================

// Filter by difficulty
const filterByDifficulty = (recipes, difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

// Filter by time
const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time <= maxTime);
};

// Apply selected filter
const applyFilter = (recipes, filterType) => {
    switch (filterType) {
        case "easy":
            return filterByDifficulty(recipes, "easy");
        case "medium":
            return filterByDifficulty(recipes, "medium");
        case "hard":
            return filterByDifficulty(recipes, "hard");
        case "quick":
            return filterByTime(recipes, 30);
        case "all":
        default:
            return recipes;
    }
};


// ============================================
// PURE SORT FUNCTIONS
// ============================================

// Sort by name (A-Z)
const sortByName = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.title.localeCompare(b.title)
    );
};

// Sort by time (fastest first)
const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) => a.time - b.time);
};

// Apply selected sort
const applySort = (recipes, sortType) => {
    switch (sortType) {
        case "name":
            return sortByName(recipes);
        case "time":
            return sortByTime(recipes);
        case "none":
        default:
            return recipes;
    }
};


// ============================================
// RENDER FUNCTIONS
// ============================================


// ============================================
// MAIN UPDATE FUNCTION
// ============================================

const updateDisplay = () => {
    let result = recipes;

    result = applyFilter(result, currentFilter);
    result = applySort(result, currentSort);

    renderRecipes(result);

    console.log(
        `Displaying ${result.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
    );
};


// ============================================
// UI HELPER FUNCTIONS
// ============================================

const updateActiveButtons = () => {
    filterButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.filter === currentFilter
        );
    });

    sortButtons.forEach(btn => {
        btn.classList.toggle(
            "active",
            btn.dataset.sort === currentSort
        );
    });
};


// ============================================
// EVENT HANDLERS
// ============================================

const handleFilterClick = (event) => {
    currentFilter = event.target.dataset.filter;
    updateActiveButtons();
    updateDisplay();
};

const handleSortClick = (event) => {
    currentSort = event.target.dataset.sort;
    updateActiveButtons();
    updateDisplay();
};


// ============================================
// EVENT LISTENER SETUP
// ============================================

const setupEventListeners = () => {
    filterButtons.forEach(btn =>
        btn.addEventListener("click", handleFilterClick)
    );

    sortButtons.forEach(btn =>
        btn.addEventListener("click", handleSortClick)
    );

    console.log("Event listeners attached");
};


// ============================================
// INITIALIZATION
// ============================================

setupEventListeners();
updateDisplay();
