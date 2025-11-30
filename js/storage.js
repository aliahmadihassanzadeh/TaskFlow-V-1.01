// storage.js
// Simple persistence layer for items and categories

// Global array of item objects
// { id, text, category, done, favorite, note }
let items = [];

// Global array of categories
let categories = ['Tasks', 'Shopping List'];

// Load items from localStorage into the global 'items' array
function loadItemsFromStorage() {
    try {
        const raw = localStorage.getItem('items');
        items = raw ? JSON.parse(raw) : [];
        
        // Migration: Add new fields to old items
        let needsSave = false;
        items = items.map(item => {
            if (!item.hasOwnProperty('priority')) {
                item.priority = 'none';
                needsSave = true;
            }
            if (!item.hasOwnProperty('dueDate')) {
                item.dueDate = null;
                needsSave = true;
            }
            if (!item.hasOwnProperty('startDate')) {
                item.startDate = null;
                needsSave = true;
            }
            if (!item.hasOwnProperty('progress')) {
                item.progress = 0;
                needsSave = true;
            }
            if (!item.hasOwnProperty('subtasks')) {
                item.subtasks = [];
                needsSave = true;
            }
            // NEW: Migrate alarm, address, url fields
            if (!item.hasOwnProperty('alarm')) {
                item.alarm = null;
                needsSave = true;
            }
            if (!item.hasOwnProperty('address')) {
                item.address = null;
                needsSave = true;
            }
            if (!item.hasOwnProperty('url')) {
                item.url = null;
                needsSave = true;
            }
            // Don't touch recurrence - let it be whatever it is (null, undefined, or an object)
            // This ensures existing recurrence data is preserved
            
            return item;
        });
        
        if (needsSave) {
            saveItemsToStorage();
        }
        
        console.log('Loaded items from storage:', items.length);
        // Log items with recurrence
        items.forEach(item => {
            if (item.recurrence) {
                console.log('Item with recurrence:', item.text, item.recurrence);
            }
        });
    } catch (e) {
        console.error('Failed to load items from storage', e);
        items = [];
    }
}

// Save the global 'items' array back to localStorage
function saveItemsToStorage() {
    try {
        localStorage.setItem('items', JSON.stringify(items));
    } catch (e) {
        console.error('Failed to save items to storage', e);
    }
}

// Load categories from localStorage
function loadCategoriesFromStorage() {
    try {
        const raw = localStorage.getItem('categories');
        if (raw) {
            categories = JSON.parse(raw);
        } else {
            categories = ['Tasks', 'Shopping List'];
        }
    } catch (e) {
        console.error('Failed to load categories from storage', e);
        categories = ['Tasks', 'Shopping List'];
    }
}

// Save categories to localStorage
function saveCategoriesToStorage() {
    try {
        localStorage.setItem('categories', JSON.stringify(categories));
    } catch (e) {
        console.error('Failed to save categories to storage', e);
    }
}

// Load category open/closed states
function loadCategoryStates() {
    try {
        const raw = localStorage.getItem('categoryStates');
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.error('Failed to load category states', e);
        return {};
    }
}

// Save category open/closed states
function saveCategoryStates(states) {
    try {
        localStorage.setItem('categoryStates', JSON.stringify(states));
    } catch (e) {
        console.error('Failed to save category states', e);
    }
}

// Get current category states from DOM
function getCurrentCategoryStates() {
    const states = {};
    categories.forEach(cat => {
        const catDiv = document.querySelector(`.category[data-name="${cat}"]`);
        if (catDiv) {
            const body = catDiv.querySelector('.cat-body');
            states[cat] = body ? body.classList.contains('open') : true;
        }
    });
    return states;
}

// Export all data to JSON
function exportData() {
    const data = {
        items: items,
        categories: categories,
        exportDate: new Date().toISOString(),
        version: '1.0'
    };
    return JSON.stringify(data, null, 2);
}

// Import data from JSON
function importData(jsonString) {
    try {
        const data = JSON.parse(jsonString);
        
        // Validate data structure
        if (!data.items || !data.categories) {
            throw new Error('Invalid data format');
        }
        
        // Confirm before overwriting
        const itemCount = data.items.length;
        const catCount = data.categories.length;
        const message = `Import ${itemCount} items and ${catCount} categories?\n\nThis will replace your current data!`;
        
        if (!confirm(message)) {
            return false;
        }
        
        // Import data
        items = data.items;
        categories = data.categories;
        
        // Save to storage
        saveItemsToStorage();
        saveCategoriesToStorage();
        
        return true;
    } catch (e) {
        console.error('Failed to import data', e);
        alert('Failed to import data. Please check the file format.');
        return false;
    }
}