// main.js
// Glue everything together. No imports, just global functions.

function refreshUI() {
    // Save the state of which items have open subtasks/notes BEFORE refresh
    const openStates = {};
    document.querySelectorAll('li.item').forEach(item => {
        const itemId = item.dataset.id;
        const noteBox = item.querySelector('.note-box');
        const subtasksContainer = item.querySelector('.subtasks-container');
        
        openStates[itemId] = {
            noteOpen: noteBox && !noteBox.classList.contains('d-none'),
            subtasksOpen: subtasksContainer && !subtasksContainer.classList.contains('d-none')
        };
    });
    
    // Persist
    saveItemsToStorage();

    // Re-render categories and items
    renderCategories();
    renderAllItems();

    // Update stats
    updateSummaryDashboard();
    updateCategoryCounts();
    
    // Update category selects
    updateCategorySelects();
    
    // Re-setup toggles after rendering
    setupCategoryToggles();
    
    // Restore open states after a brief delay (to ensure DOM is ready)
    setTimeout(() => {
        restoreItemOpenStates(openStates);
        
        // Re-setup item drag based on calendar state
        const calendarModal = document.getElementById('calendarModal');
        const calendarOpen = calendarModal && !calendarModal.classList.contains('d-none');
        
        if (!calendarOpen) {
            // Calendar is closed, setup drag for moving between categories
            setupItemDragBetweenCategories();
        }
        // If calendar is open, the calendar.js will handle drag setup
    }, 50);
}

// Restore open states for items after re-render
function restoreItemOpenStates(openStates) {
    if (!openStates) return;
    
    Object.keys(openStates).forEach(itemId => {
        const state = openStates[itemId];
        const item = document.querySelector(`li.item[data-id="${itemId}"]`);
        
        if (!item) return;
        
        const noteBox = item.querySelector('.note-box');
        const subtasksContainer = item.querySelector('.subtasks-container');
        
        // Restore note box state
        if (noteBox && state.noteOpen) {
            noteBox.classList.remove('d-none');
        }
        
        // Restore subtasks container state
        if (subtasksContainer && state.subtasksOpen) {
            subtasksContainer.classList.remove('d-none');
        }
    });
}

function renderCategories() {
    const container = document.getElementById('categoriesContainer');
    if (!container) return;
    
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const categoryDiv = createCategoryElement(cat);
        container.appendChild(categoryDiv);
    });
    
    // Setup drag and drop
    setupDragAndDrop();
    
    // Setup category action buttons (including edit, delete, clear, add)
    setupCategoryActionButtons();
}

function createCategoryElement(categoryName) {
    const div = document.createElement('div');
    div.className = 'category';
    div.dataset.name = categoryName;
    div.draggable = true;
    
    // Check if this category should be open or closed
    const categoryStates = loadCategoryStates();
    const isOpen = categoryStates[categoryName] !== false; // Default to open if not specified
    
    // Title
    const title = document.createElement('div');
    title.className = 'cat-title';
    title.dataset.cat = categoryName;
    
    // Left side
    const leftSide = document.createElement('div');
    leftSide.className = 'cat-title-left';
    
    const dragHandle = document.createElement('span');
    dragHandle.className = 'drag-handle';
    dragHandle.innerHTML = '<i class="bi bi-grip-vertical"></i>';
    
    const nameSpan = document.createElement('span');
    nameSpan.textContent = categoryName;
    
    leftSide.appendChild(dragHandle);
    leftSide.appendChild(nameSpan);
    
    // Right side
    const rightSide = document.createElement('div');
    rightSide.className = 'cat-title-right';
    
    const badge = document.createElement('span');
    badge.className = 'badge bg-secondary cat-badge';
    badge.dataset.cat = categoryName;
    badge.textContent = '0/0';
    
    const addItemBtn = document.createElement('button');
    addItemBtn.className = 'cat-action-btn add-item-cat-btn';
    addItemBtn.dataset.cat = categoryName;
    addItemBtn.title = 'Add item to this category';
    addItemBtn.innerHTML = '<i class="bi bi-plus-circle"></i>';
    
    const editBtn = document.createElement('button');
    editBtn.className = 'cat-action-btn edit-cat-btn';
    editBtn.dataset.cat = categoryName;
    editBtn.title = 'Edit category name';
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'cat-action-btn clear-cat-btn';
    clearBtn.dataset.cat = categoryName;
    clearBtn.title = 'Clear all items';
    clearBtn.innerHTML = '<i class="bi bi-trash"></i>';
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'cat-action-btn cat-delete-btn';
    deleteBtn.dataset.cat = categoryName;
    deleteBtn.title = 'Delete category';
    deleteBtn.innerHTML = '<i class="bi bi-x-circle"></i>';
    
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.dataset.cat = categoryName;
    toggleBtn.innerHTML = isOpen ? '<i class="bi bi-chevron-up"></i>' : '<i class="bi bi-chevron-down"></i>';
    
    rightSide.appendChild(badge);
    rightSide.appendChild(addItemBtn);
    rightSide.appendChild(editBtn);
    rightSide.appendChild(clearBtn);
    rightSide.appendChild(deleteBtn);
    rightSide.appendChild(toggleBtn);
    
    title.appendChild(leftSide);
    title.appendChild(rightSide);
    
    // Body
    const body = document.createElement('div');
    body.className = isOpen ? 'cat-body open' : 'cat-body';
    
    const ul = document.createElement('ul');
    ul.id = 'cat-' + categoryName;
    
    body.appendChild(ul);
    
    div.appendChild(title);
    div.appendChild(body);
    
    return div;
}

function setupCategoryToggles() {
    const allCategories = document.querySelectorAll('.category');
    
    allCategories.forEach(categoryDiv => {
        const toggleBtn = categoryDiv.querySelector('.toggle-btn');
        const catBody = categoryDiv.querySelector('.cat-body');
        const categoryName = categoryDiv.dataset.name;
        
        if (!toggleBtn || !catBody) return;
        
        // Remove all existing event listeners by cloning
        const newToggleBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newToggleBtn, toggleBtn);
        
        newToggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            // Toggle the open class
            const wasOpen = catBody.classList.contains('open');
            
            if (wasOpen) {
                catBody.classList.remove('open');
            } else {
                catBody.classList.add('open');
            }
            
            // Update icon
            const icon = newToggleBtn.querySelector('i');
            if (icon) {
                if (catBody.classList.contains('open')) {
                    icon.className = 'bi bi-chevron-up';
                } else {
                    icon.className = 'bi bi-chevron-down';
                }
            }
            
            // Save the state
            const states = getCurrentCategoryStates();
            saveCategoryStates(states);
        });
    });
}

function renderAllItems() {
    const { list, filters } = applyFiltersAndSorting(items);

    const flatMode = filters.flat;

    const categoriesContainer = document.getElementById('categoriesContainer');
    const flatContainer = document.getElementById('flatContainer');
    const flatList = document.getElementById('flatList');

    if (flatMode) {
        // Show flat list
        if (categoriesContainer) categoriesContainer.classList.add('d-none');
        if (flatContainer) flatContainer.classList.remove('d-none');
        if (flatList) flatList.innerHTML = '';

        list.forEach(item => {
            const li = createItemElement(item);
            if (flatList) flatList.appendChild(li);
        });
    } else {
        // Show categories
        if (categoriesContainer) categoriesContainer.classList.remove('d-none');
        if (flatContainer) flatContainer.classList.add('d-none');

        // Clear all ULs FIRST
        categories.forEach(cat => {
            const ul = document.getElementById('cat-' + cat);
            if (ul) ul.innerHTML = '';
        });

        // Then add items
        list.forEach(item => {
            const ul = document.getElementById('cat-' + item.category);
            if (!ul) {
                console.warn(`No UL found for category: ${item.category}`);
                return;
            }
            const li = createItemElement(item);
            ul.appendChild(li);
        });
    }
    
    updateCategoryCounts();
    updateSummaryDashboard();
}

function updateCategorySelects() {
    const categorySelect = document.getElementById('category');
    const filterCategory = document.getElementById('filterCategory');
    
    if (categorySelect) {
        const currentValue = categorySelect.value;
        categorySelect.innerHTML = '';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });
        if (categories.includes(currentValue)) {
            categorySelect.value = currentValue;
        }
    }
    
    if (filterCategory) {
        const currentValue = filterCategory.value;
        filterCategory.innerHTML = '';
        
        const allOption = document.createElement('option');
        allOption.value = 'all';
        allOption.textContent = 'All Categories';
        filterCategory.appendChild(allOption);
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            filterCategory.appendChild(option);
        });
        
        if (currentValue === 'all' || categories.includes(currentValue)) {
            filterCategory.value = currentValue;
        }
    }
}

function updateCategoryCounts() {
    // Update the badge count for each category (X/Y format where X = done, Y = total)
    categories.forEach(cat => {
        const badge = document.querySelector(`.cat-badge[data-cat="${cat}"]`);
        if (!badge) return;
        
        const catItems = items.filter(item => item.category === cat);
        const doneItems = catItems.filter(item => item.done);
        
        badge.textContent = `${doneItems.length}/${catItems.length}`;
    });
}

function setupDragAndDrop() {
    const categoryDivs = document.querySelectorAll('.category');
    
    categoryDivs.forEach(div => {
        // Make category draggable by title only
        const catTitle = div.querySelector('.cat-title');
        if (catTitle) {
            catTitle.draggable = true;
            catTitle.style.cursor = 'grab';
            
            catTitle.addEventListener('dragstart', (e) => {
                draggedElement = div;
                catTitle.classList.add('dragging');
                catTitle.style.cursor = 'grabbing';
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('type', 'category');
            });
            
            catTitle.addEventListener('dragend', (e) => {
                catTitle.classList.remove('dragging');
                catTitle.style.cursor = 'grab';
            });
        }
        
        // Category drop events (for both category reordering and item moves)
        div.addEventListener('dragover', handleDragOver);
        div.addEventListener('drop', handleCategoryDrop);
        div.addEventListener('dragenter', handleDragEnter);
        div.addEventListener('dragleave', handleDragLeave);
    });
    
    // Setup item drag to move between categories
    setupItemDragBetweenCategories();
}

let draggedElement = null;
let draggedItemId = null;

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleDragEnter(e) {
    if (this !== draggedElement) {
        this.classList.add('drag-over');
    }
}

function handleDragLeave(e) {
    this.classList.remove('drag-over');
}

// Handle category drop (for reordering categories)
function handleCategoryDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    this.classList.remove('drag-over');
    
    const dragType = e.dataTransfer.getData('type');
    console.log('Drop detected! Type:', dragType);
    
    if (dragType === 'category' && draggedElement && draggedElement !== this) {
        console.log('Reordering categories...');
        // Reorder categories
        const draggedCat = draggedElement.dataset.name;
        const targetCat = this.dataset.name;
        
        const draggedIndex = categories.indexOf(draggedCat);
        const targetIndex = categories.indexOf(targetCat);
        
        if (draggedIndex !== -1 && targetIndex !== -1) {
            categories.splice(draggedIndex, 1);
            categories.splice(targetIndex, 0, draggedCat);
            saveCategoriesToStorage();
            refreshUI();
        }
    } else if (dragType === 'item') {
        console.log('Moving item to category...');
        // Move item to this category
        const itemId = e.dataTransfer.getData('itemId');
        const targetCategory = this.dataset.name;
        
        console.log('Item ID:', itemId, 'Target Category:', targetCategory);
        
        if (itemId && targetCategory) {
            const itemIndex = findItemIndexById(itemId);
            console.log('Item index:', itemIndex);
            if (itemIndex !== -1) {
                const oldCategory = items[itemIndex].category;
                items[itemIndex].category = targetCategory;
                console.log(`Moved item from "${oldCategory}" to "${targetCategory}"`);
                saveItemsToStorage();
                refreshUI();
            }
        }
    }
    
    return false;
}

function handleDragEnd(e) {
    document.querySelectorAll('.category').forEach(div => {
        div.classList.remove('drag-over');
    });
    document.querySelectorAll('.cat-title').forEach(title => {
        title.classList.remove('dragging');
    });
    draggedElement = null;
    draggedItemId = null;
}

// Setup drag functionality for items to move between categories
function setupItemDragBetweenCategories() {
    console.log('=== Setting up item drag between categories ===');
    
    const allItems = document.querySelectorAll('li.item');
    console.log('Found items:', allItems.length);
    
    // Check if calendar is open
    const calendarModal = document.getElementById('calendarModal');
    const calendarOpen = calendarModal && !calendarModal.classList.contains('d-none');
    console.log('Calendar open:', calendarOpen);
    
    if (calendarOpen) {
        console.log('Calendar is open - skipping item drag setup for category move');
        return; // Don't setup category drag when calendar is open
    }
    
    allItems.forEach((item, index) => {
        // Set draggable
        item.setAttribute('draggable', 'true');
        item.style.setProperty('cursor', 'grab', 'important');
        
        console.log(`Item ${index + 1} setup:`, {
            id: item.dataset.id,
            draggable: item.draggable,
            cursor: item.style.cursor
        });
        
        // Remove calendar drag handlers if they exist
        item.ondragstart = null;
        item.ondragend = null;
        
        // Add category move drag handlers
        item.addEventListener('dragstart', function(e) {
            console.log('Item drag started:', item.dataset.id);
            draggedItemId = item.dataset.id;
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('type', 'item');
            e.dataTransfer.setData('itemId', draggedItemId);
            item.style.opacity = '0.4';
            item.style.setProperty('cursor', 'grabbing', 'important');
        });
        
        item.addEventListener('dragend', function(e) {
            console.log('Item drag ended:', item.dataset.id);
            item.style.opacity = '1';
            item.style.setProperty('cursor', 'grab', 'important');
            draggedItemId = null;
        });
    });
    
    console.log('Item drag setup complete!');
}

function setupCoreEvents() {
    const addBtn = document.getElementById('addBtn');
    const itemInput = document.getElementById('itemInput');
    const categorySelect = document.getElementById('category');
    const searchBox = document.getElementById('searchBox');
    const filterCategory = document.getElementById('filterCategory');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const sortSelect = document.getElementById('sortSelect');
    const favOnly = document.getElementById('favOnly');
    const flatToggle = document.getElementById('flatToggle');
    const fabAdd = document.querySelector('.fab-add');
    const deleteAllBtn = document.getElementById('deleteAllBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    function handleAdd() {
        const text = itemInput.value;
        const category = categorySelect.value;
        const item = addItem(text, category);
        if (item) {
            itemInput.value = '';
            refreshUI();
        }
    }

    if (addBtn) {
        addBtn.addEventListener('click', handleAdd);
    }
    if (fabAdd) {
        fabAdd.addEventListener('click', () => {
            if (itemInput) itemInput.focus();
        });
    }
    if (itemInput) {
        itemInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAdd();
            }
        });
    }

    // Delete all items button
    if (deleteAllBtn) {
        deleteAllBtn.addEventListener('click', () => {
            if (items.length === 0) {
                alert('No items to delete!');
                return;
            }
            if (confirm(`Are you sure you want to delete all ${items.length} items? This cannot be undone.`)) {
                deleteAllItems();
                refreshUI();
            }
        });
    }

    // Export data button
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const jsonData = exportData();
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `taskflow-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Export to calendar button
    const exportCalendarBtn = document.getElementById('exportCalendarBtn');
    if (exportCalendarBtn) {
        exportCalendarBtn.addEventListener('click', () => {
            if (typeof exportToICalendar === 'function') {
                exportToICalendar();
            } else {
                alert('Calendar export feature is not loaded!');
            }
        });
    }

    // Import data button
    if (importBtn) {
        importBtn.addEventListener('click', () => {
            if (importFile) {
                importFile.click();
            }
        });
    }

    // Handle file import
    if (importFile) {
        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const success = importData(event.target.result);
                    if (success) {
                        refreshUI();
                        alert('Data imported successfully!');
                    }
                };
                reader.readAsText(file);
            }
            // Reset file input
            importFile.value = '';
        });
    }

    // Filters -> just re-render
    [searchBox, filterCategory, statusFilter, priorityFilter, sortSelect].forEach(el => {
        if (!el) return;
        el.addEventListener('input', renderAllItems);
        el.addEventListener('change', renderAllItems);
    });

    if (favOnly) {
        favOnly.addEventListener('change', renderAllItems);
    }
    if (flatToggle) {
        flatToggle.addEventListener('change', renderAllItems);
    }
}

function setupCategoryActionButtons() {
    // Add item to category buttons
    document.querySelectorAll('.add-item-cat-btn').forEach(btn => {
        const category = btn.dataset.cat;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const itemName = prompt(`Add new item to ${category}:`);
            if (itemName && itemName.trim()) {
                const item = addItem(itemName.trim(), category);
                if (item) {
                    refreshUI();
                }
            }
        });
    });
    
    // Edit category name buttons
    document.querySelectorAll('.edit-cat-btn').forEach(btn => {
        const oldCategory = btn.dataset.cat;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const newName = prompt(`Edit category name:`, oldCategory);
            
            if (!newName || !newName.trim()) {
                return; // User cancelled or entered empty name
            }
            
            const trimmedName = newName.trim();
            
            // Check if name is the same
            if (trimmedName === oldCategory) {
                return; // No change
            }
            
            // Check if new name already exists
            if (categories.some(cat => cat.toLowerCase() === trimmedName.toLowerCase())) {
                alert('A category with this name already exists!');
                return;
            }
            
            // Update category name in categories array
            const categoryIndex = categories.indexOf(oldCategory);
            if (categoryIndex !== -1) {
                categories[categoryIndex] = trimmedName;
            }
            
            // Update all items in this category
            items.forEach(item => {
                if (item.category === oldCategory) {
                    item.category = trimmedName;
                }
            });
            
            // Save and refresh
            saveCategoriesToStorage();
            saveItemsToStorage();
            refreshUI();
        });
    });
    
    // Clear category items buttons
    document.querySelectorAll('.clear-cat-btn').forEach(btn => {
        const category = btn.dataset.cat;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const catItems = items.filter(item => item.category === category);
            if (catItems.length === 0) {
                alert(`No items in ${category} to delete!`);
                return;
            }
            if (confirm(`Delete all ${catItems.length} items in ${category}?`)) {
                deleteItemsByCategory(category);
                refreshUI();
            }
        });
    });

    // Delete category buttons
    document.querySelectorAll('.cat-delete-btn').forEach(btn => {
        const category = btn.dataset.cat;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            if (categories.length === 1) {
                alert('Cannot delete the last category!');
                return;
            }
            
            const catItems = items.filter(item => item.category === category);
            if (catItems.length > 0) {
                if (!confirm(`${category} has ${catItems.length} items. Delete category and all items?`)) {
                    return;
                }
                deleteItemsByCategory(category);
            } else {
                if (!confirm(`Delete ${category} category?`)) {
                    return;
                }
            }
            
            // Remove from categories array
            deleteCategory(category);
            
            refreshUI();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Load from storage
    loadCategoriesFromStorage();
    loadItemsFromStorage();

    // Theme
    loadThemeFromStorage();
    setupThemeControls();

    // Wire events
    setupCoreEvents();

    // Setup keyboard shortcuts
    setupKeyboardShortcuts();
    setupShortcutsModal();
    
    // Setup calendar
    setupCalendar();

    // Initial render - IMPORTANT: render categories FIRST, then items
    renderCategories();
    renderAllItems();
    updateSummaryDashboard();
    updateCategoryCounts();
    updateCategorySelects();
    
    // Setup toggles AFTER everything is rendered
    setupCategoryToggles();
    
    // Setup item drag for category moves (since calendar is closed on load)
    setupItemDragBetweenCategories();
    
    // Remove preload class to enable transitions after initial render
    setTimeout(() => {
        document.body.classList.remove('preload');
    }, 100);
});