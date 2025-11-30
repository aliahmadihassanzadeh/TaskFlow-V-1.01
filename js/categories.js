// categories.js
// Dynamic category management (+ Add category…)

const DEFAULT_CATEGORIES = ['Fruits', 'Drinks', 'Food', 'Tools', 'General'];
const ADD_CATEGORY_VALUE = '__add__';

// Ensure categories array is initialised
function initCategories() {
    loadCategoriesFromStorage();
    if (!Array.isArray(categories) || categories.length === 0) {
        categories = DEFAULT_CATEGORIES.slice();
        saveCategoriesToStorage();
    }
}

// Normalise category names
function normaliseCategoryName(name) {
    return name.trim();
}

// Add new category (if not exists)
function addCategory(name) {
    const clean = normaliseCategoryName(name);
    if (!clean) return null;

    const exists = categories.some(
        c => c.toLowerCase() === clean.toLowerCase()
    );
    if (exists) return null;

    categories.push(clean);
    saveCategoriesToStorage();

    // Ensure a visual card exists
    ensureCategorySections();
    // Refresh selects so user can pick it
    syncCategorySelects();

    return clean;
}

// Populate the "add item" and "filter" category selects
function syncCategorySelects() {
    const addSelect = document.getElementById('category');
    const filterSelect = document.getElementById('filterCategory');
    if (!addSelect || !filterSelect) return;

    // --- add item select ---
    addSelect.innerHTML = '';

    const optAdd = document.createElement('option');
    optAdd.value = ADD_CATEGORY_VALUE;
    optAdd.textContent = '+ Add category…';
    addSelect.appendChild(optAdd);

    categories.forEach(cat => {
        const o = document.createElement('option');
        o.value = cat;
        o.textContent = cat;
        addSelect.appendChild(o);
    });

    // --- filter select ---
    filterSelect.innerHTML = '';

    const optAll = document.createElement('option');
    optAll.value = 'all';
    optAll.textContent = 'All Categories';
    filterSelect.appendChild(optAll);

    categories.forEach(cat => {
        const o = document.createElement('option');
        o.value = cat;
        o.textContent = cat;
        filterSelect.appendChild(o);
    });
}

// Attach behaviour to #category for "+ Add category…"
function setupCategorySelectBehaviour() {
    const addSelect = document.getElementById('category');
    if (!addSelect) return;

    addSelect.addEventListener('change', () => {
        if (addSelect.value !== ADD_CATEGORY_VALUE) return;

        const name = prompt('New category name:');
        const added = addCategory(name || '');
        // After adding we select it; if cancelled or duplicate, reset to first real category
        if (added) {
            addSelect.value = added;
        } else {
            const firstReal = categories[0];
            addSelect.value = firstReal || ADD_CATEGORY_VALUE;
        }
    });
}