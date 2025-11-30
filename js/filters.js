// filters.js
// Read filter controls and return a filtered + sorted copy of items

function getCurrentFilters() {
    const searchBox = document.getElementById('searchBox');
    const filterCategory = document.getElementById('filterCategory');
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const sortSelect = document.getElementById('sortSelect');
    const favOnly = document.getElementById('favOnly');
    const flatToggle = document.getElementById('flatToggle');

    // Get category value, default to 'all' if empty or not found
    let categoryValue = 'all';
    if (filterCategory && filterCategory.value) {
        categoryValue = filterCategory.value;
    }

    return {
        search: searchBox ? searchBox.value.trim().toLowerCase() : "",
        category: categoryValue,
        status: statusFilter ? statusFilter.value : "all",
        priority: priorityFilter ? priorityFilter.value : "all",
        sort: sortSelect ? sortSelect.value : "az",
        urgentOnly: favOnly ? favOnly.checked : false,
        flat: flatToggle ? flatToggle.checked : false
    };
}

function applyFiltersAndSorting(sourceItems) {
    const filters = getCurrentFilters();
    let list = [...sourceItems];

    // Search
    if (filters.search) {
        list = list.filter(it => it.text.toLowerCase().includes(filters.search));
    }

    // Category - only filter if not 'all'
    if (filters.category && filters.category !== 'all') {
        list = list.filter(it => it.category === filters.category);
    }

    // Status
    if (filters.status === 'done') {
        list = list.filter(it => it.done);
    } else if (filters.status === 'notdone') {
        list = list.filter(it => !it.done);
    }

    // Priority filter
    if (filters.priority && filters.priority !== 'all') {
        list = list.filter(it => {
            const itemPriority = it.priority || 'none';
            return itemPriority === filters.priority;
        });
    }

    // Urgent / favorite
    if (filters.urgentOnly) {
        list = list.filter(it => it.favorite);
    }

    // Sorting
    list = sortItems(list, filters.sort);

    return { list, filters };
}