// items.js
// Item helpers that operate on the global 'items' array

// Generate a simple unique id
function generateItemId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function findItemIndexById(id) {
    return items.findIndex(it => it.id === id);
}

function addItem(text, category) {
    const trimmed = text.trim();
    if (!trimmed) return null;

    const item = {
        id: generateItemId(),
        text: trimmed,
        category: category,
        done: false,
        favorite: false,
        priority: 'none', // none, low, medium, high
        startDate: null, // ISO date string or null
        dueDate: null, // ISO date string or null (end date)
        progress: 0, // 0-100 percentage
        subtasks: [], // Array of {id, text, done}
        note: "",
        // NEW: Additional fields
        alarm: null, // {type: 'before-start'|'before-due'|'custom', minutes: number, customTime: 'ISO string'}
        address: null, // String address
        url: null // URL string
    };
    items.push(item);
    return item;
}

function deleteItemById(id) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items.splice(idx, 1);
    }
}

function toggleItemDoneById(id) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items[idx].done = !items[idx].done;
    }
}

function toggleItemFavoriteById(id) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items[idx].favorite = !items[idx].favorite;
    }
}

function updateItemTextById(id, newText) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        const t = newText.trim();
        if (t) {
            items[idx].text = t;
        }
    }
}

function setItemNoteById(id, noteText) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items[idx].note = noteText;
    }
}

// Set item priority
function setItemPriorityById(id, priority) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items[idx].priority = priority;
    }
}

// Cycle through priorities (none -> low -> medium -> high -> none)
function cycleItemPriorityById(id) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        const current = items[idx].priority || 'none';
        const priorities = ['none', 'low', 'medium', 'high'];
        const currentIndex = priorities.indexOf(current);
        const nextIndex = (currentIndex + 1) % priorities.length;
        items[idx].priority = priorities[nextIndex];
        return items[idx].priority;
    }
    return 'none';
}

// Set item due date
function setItemDueDateById(id, dueDate) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items[idx].dueDate = dueDate;
    }
}

// Set item due time (adds time to existing date)
function setItemDueTimeById(id, time) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        if (items[idx].dueDate) {
            // Extract date part and add time
            const datePart = items[idx].dueDate.split('T')[0];
            items[idx].dueDate = `${datePart}T${time}`;
        }
    }
}

// Set item start time (adds time to existing date)
function setItemStartTimeById(id, time) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        if (items[idx].startDate) {
            // Extract date part and add time
            const datePart = items[idx].startDate.split('T')[0];
            items[idx].startDate = `${datePart}T${time}`;
        }
    }
}

// Check if item is overdue
function isItemOverdue(item) {
    if (!item.dueDate || item.done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(item.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

// Check if item is due today
function isItemDueToday(item) {
    if (!item.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(item.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
}

// Add subtask to item
function addSubtaskToItem(itemId, subtaskText) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        const subtask = {
            id: generateItemId(),
            text: subtaskText.trim(),
            done: false,
            dueDate: null
        };
        if (!items[idx].subtasks) {
            items[idx].subtasks = [];
        }
        items[idx].subtasks.push(subtask);
        updateItemProgress(itemId);
        return subtask;
    }
    return null;
}

// Toggle subtask done status
function toggleSubtaskDone(itemId, subtaskId) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1 && items[idx].subtasks) {
        const subtask = items[idx].subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            subtask.done = !subtask.done;
            updateItemProgress(itemId);
        }
    }
}

// Delete subtask
function deleteSubtask(itemId, subtaskId) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1 && items[idx].subtasks) {
        items[idx].subtasks = items[idx].subtasks.filter(st => st.id !== subtaskId);
        updateItemProgress(itemId);
    }
}

// Update item progress based on subtasks
function updateItemProgress(itemId) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        const subtasks = items[idx].subtasks || [];
        if (subtasks.length === 0) {
            items[idx].progress = 0;
        } else {
            const completed = subtasks.filter(st => st.done).length;
            items[idx].progress = Math.round((completed / subtasks.length) * 100);
        }
    }
}

// Set item start date
function setItemStartDateById(id, startDate) {
    const idx = findItemIndexById(id);
    if (idx !== -1) {
        items[idx].startDate = startDate;
        // If end date exists and start > end, swap them
        if (items[idx].dueDate && startDate && startDate > items[idx].dueDate) {
            const temp = items[idx].dueDate;
            items[idx].dueDate = startDate;
            items[idx].startDate = temp;
        }
    }
}

// Get duration in days between start and end date
function getItemDuration(item) {
    if (!item.startDate || !item.dueDate) return null;
    const start = new Date(item.startDate);
    const end = new Date(item.dueDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Get progress percentage based on dates (0-100)
function getDateBasedProgress(item) {
    if (!item.startDate || !item.dueDate) return null;
    
    const start = new Date(item.startDate);
    const end = new Date(item.dueDate);
    const now = new Date();
    
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    
    // If not started yet
    if (now < start) return 0;
    
    // If past due date
    if (now > end) return 100;
    
    // Calculate percentage
    const totalTime = end - start;
    const elapsed = now - start;
    return Math.round((elapsed / totalTime) * 100);
}

// Format duration nicely
function formatDuration(days) {
    if (days === 0) return 'Today';
    if (days === 1) return '1 day';
    if (days < 7) return `${days} days`;
    if (days < 30) {
        const weeks = Math.floor(days / 7);
        return weeks === 1 ? '1 week' : `${weeks} weeks`;
    }
    const months = Math.floor(days / 30);
    return months === 1 ? '1 month' : `${months} months`;
}

// Set subtask due date
function setSubtaskDueDate(itemId, subtaskId, dueDate) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1 && items[idx].subtasks) {
        const subtask = items[idx].subtasks.find(st => st.id === subtaskId);
        if (subtask) {
            subtask.dueDate = dueDate;
        }
    }
}

// Set subtask due time
function setSubtaskDueTime(itemId, subtaskId, time) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1 && items[idx].subtasks) {
        const subtask = items[idx].subtasks.find(st => st.id === subtaskId);
        if (subtask && subtask.dueDate) {
            const datePart = subtask.dueDate.split('T')[0];
            subtask.dueDate = `${datePart}T${time}`;
        }
    }
}

// Check if subtask is overdue
function isSubtaskOverdue(subtask) {
    if (!subtask.dueDate || subtask.done) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(subtask.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

// Check if subtask is due today
function isSubtaskDueToday(subtask) {
    if (!subtask.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(subtask.dueDate);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
}

// Delete all items in a specific category
function deleteItemsByCategory(category) {
    items = items.filter(item => item.category !== category);
}

// Delete all items
function deleteAllItems() {
    items = [];
}

// Add a new category
function addCategory(categoryName) {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    
    // Check if category already exists (case insensitive)
    const exists = categories.some(cat => cat.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
        alert('Category already exists!');
        return false;
    }
    
    categories.push(trimmed);
    saveCategoriesToStorage();
    return true;
}

// Delete a category
function deleteCategory(categoryName) {
    const idx = categories.indexOf(categoryName);
    if (idx !== -1) {
        categories.splice(idx, 1);
        saveCategoriesToStorage();
    }
}

// ========== NEW: ALARM FUNCTIONS ==========
// Set alarm for item
function setItemAlarm(itemId, alarmConfig) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        items[idx].alarm = alarmConfig;
    }
}

// Remove alarm from item
function removeItemAlarm(itemId) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        items[idx].alarm = null;
    }
}

// Get alarm description
function getAlarmDescription(alarm) {
    if (!alarm) return '';
    
    switch (alarm.type) {
        case 'before-start':
            return `${alarm.minutes} min before start`;
        case 'before-due':
            return `${alarm.minutes} min before due`;
        case 'custom':
            if (alarm.customTime) {
                const date = new Date(alarm.customTime);
                return `At ${date.toLocaleString()}`;
            }
            return 'Custom time';
        default:
            return '';
    }
}

// ========== NEW: ADDRESS FUNCTIONS ==========
// Set address for item
function setItemAddress(itemId, address) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        items[idx].address = address ? address.trim() : null;
    }
}

// ========== NEW: URL FUNCTIONS ==========
// Set URL for item
function setItemUrl(itemId, url) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        items[idx].url = url ? url.trim() : null;
    }
}