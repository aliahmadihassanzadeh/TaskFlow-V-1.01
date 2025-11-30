// ui.js
// UI rendering logic with timeline support and drag-drop

function createItemElement(item) {
    const li = document.createElement('li');
    li.className = 'item';
    li.dataset.id = item.id;
    if (item.done) li.classList.add('done');
    
    // Priority indicator bar
    if (item.priority && item.priority !== 'none') {
        const indicator = document.createElement('div');
        indicator.className = 'priority-indicator';
        li.appendChild(indicator);
        li.classList.add(`priority-${item.priority}`);
    }
    
    if (item.favorite) li.classList.add('favorite');
    
    // Row with text + buttons
    const row = document.createElement('div');
    row.className = 'item-row';
    
    const textSpan = document.createElement('span');
    textSpan.className = 'item-text';
    
    // Add subtask indicator if item has subtasks
    if (item.subtasks && item.subtasks.length > 0) {
        const subtaskBadge = document.createElement('span');
        subtaskBadge.className = 'subtask-indicator';
        subtaskBadge.innerHTML = '<i class="bi bi-list-task"></i>';
        subtaskBadge.title = `${item.subtasks.length} subtask${item.subtasks.length > 1 ? 's' : ''}`;
        textSpan.appendChild(subtaskBadge);
        textSpan.appendChild(document.createTextNode(' ' + item.text));
    } else {
        textSpan.textContent = item.text;
    }
    
    row.appendChild(textSpan);
    
    // Button container
    const btnDiv = document.createElement('div');
    btnDiv.className = 'item-buttons';
    
    // Priority button
    const priorityBtn = document.createElement('button');
    priorityBtn.className = `priority-btn ${item.priority || 'none'}`;
    priorityBtn.textContent = (item.priority === 'none' || !item.priority) ? '—' : item.priority.charAt(0).toUpperCase();
    priorityBtn.title = 'Cycle Priority';
    priorityBtn.onclick = (e) => {
        e.stopPropagation();
        cycleItemPriorityById(item.id);
        refreshUI();
    };
    btnDiv.appendChild(priorityBtn);
    
    // Start date button (flag icon)
    const startDateBtn = document.createElement('button');
    startDateBtn.className = 'start-date-btn';
    if (item.startDate) {
        startDateBtn.classList.add('has-date');
        const icon = document.createElement('i');
        icon.className = 'bi bi-flag-fill';
        startDateBtn.appendChild(icon);
        const label = document.createElement('span');
        label.className = 'date-label';
        label.textContent = formatDateForDisplay(item.startDate);
        startDateBtn.appendChild(label);
    } else {
        const icon = document.createElement('i');
        icon.className = 'bi bi-flag';
        startDateBtn.appendChild(icon);
    }
    startDateBtn.title = 'Left-click: Set Start Date | Right-click: Remove Date';
    
    // Left click - set/edit date
    startDateBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const currentDate = item.startDate ? item.startDate.split('T')[0] : getTodayDateString();
        const newDate = prompt('Start date (YYYY-MM-DD):', currentDate);
        if (newDate) {
            setItemStartDateById(item.id, newDate);
            refreshUI();
        }
    };
    
    // Right click - remove date
    startDateBtn.oncontextmenu = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (item.startDate) {
            if (confirm('Remove start date?')) {
                setItemStartDateById(item.id, null);
                refreshUI();
            }
        }
    };
    
    btnDiv.appendChild(startDateBtn);
    
    // Start time button (only show if start date exists)
    if (item.startDate) {
        const startTimeBtn = document.createElement('button');
        startTimeBtn.className = 'time-btn';
        const hasTime = item.startDate.includes('T');
        const icon = document.createElement('i');
        icon.className = hasTime ? 'bi bi-clock-fill' : 'bi bi-clock';
        startTimeBtn.appendChild(icon);
        startTimeBtn.title = hasTime ? 'Left-click: Edit Time | Right-click: Remove Time' : 'Click to Add Time';
        
        // Left click - add/edit time
        startTimeBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            let currentTime = '09:00';
            if (hasTime) {
                currentTime = item.startDate.split('T')[1].substring(0, 5);
            }
            const newTime = prompt('Start time (HH:MM):', currentTime);
            if (newTime && /^\d{2}:\d{2}$/.test(newTime)) {
                setItemStartTimeById(item.id, newTime);
                refreshUI();
            }
        };
        
        // Right click - remove time (keep date)
        if (hasTime) {
            startTimeBtn.oncontextmenu = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (confirm('Remove start time (keep date)?')) {
                    const datePart = item.startDate.split('T')[0];
                    setItemStartDateById(item.id, datePart);
                    refreshUI();
                }
            };
        }
        
        btnDiv.appendChild(startTimeBtn);
    }
    
    // Due date button
    const dueDateBtn = document.createElement('button');
    dueDateBtn.className = 'due-date-btn';
    if (item.dueDate) {
        dueDateBtn.classList.add('has-date');
        if (isItemOverdue(item)) dueDateBtn.classList.add('overdue');
        if (isItemDueToday(item)) dueDateBtn.classList.add('due-today');
        
        const icon = document.createElement('i');
        icon.className = 'bi bi-calendar-check-fill';
        dueDateBtn.appendChild(icon);
        const label = document.createElement('span');
        label.className = 'date-label';
        label.textContent = formatDateForDisplay(item.dueDate);
        dueDateBtn.appendChild(label);
    } else {
        const icon = document.createElement('i');
        icon.className = 'bi bi-calendar-check';
        dueDateBtn.appendChild(icon);
    }
    dueDateBtn.title = 'Left-click: Set Due Date | Right-click: Remove Date';
    
    // Left click - set/edit date
    dueDateBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const currentDate = item.dueDate ? item.dueDate.split('T')[0] : getTodayDateString();
        const newDate = prompt('Due date (YYYY-MM-DD):', currentDate);
        if (newDate) {
            setItemDueDateById(item.id, newDate);
            refreshUI();
        }
    };
    
    // Right click - remove date
    dueDateBtn.oncontextmenu = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (item.dueDate) {
            if (confirm('Remove due date?')) {
                setItemDueDateById(item.id, null);
                refreshUI();
            }
        }
    };
    
    btnDiv.appendChild(dueDateBtn);
    
    // Due time button (only show if due date exists)
    if (item.dueDate) {
        const dueTimeBtn = document.createElement('button');
        dueTimeBtn.className = 'time-btn';
        const hasTime = item.dueDate.includes('T');
        const icon = document.createElement('i');
        icon.className = hasTime ? 'bi bi-clock-fill' : 'bi bi-clock';
        dueTimeBtn.appendChild(icon);
        dueTimeBtn.title = hasTime ? 'Left-click: Edit Time | Right-click: Remove Time' : 'Click to Add Time';
        
        // Left click - add/edit time
        dueTimeBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            let currentTime = '17:00';
            if (hasTime) {
                currentTime = item.dueDate.split('T')[1].substring(0, 5);
            }
            const newTime = prompt('Due time (HH:MM):', currentTime);
            if (newTime && /^\d{2}:\d{2}$/.test(newTime)) {
                setItemDueTimeById(item.id, newTime);
                refreshUI();
            }
        };
        
        // Right click - remove time (keep date)
        if (hasTime) {
            dueTimeBtn.oncontextmenu = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (confirm('Remove due time (keep date)?')) {
                    const datePart = item.dueDate.split('T')[0];
                    setItemDueDateById(item.id, datePart);
                    refreshUI();
                }
            };
        }
        
        btnDiv.appendChild(dueTimeBtn);
    }
    
    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = 'icon-btn fav-btn';
    favBtn.innerHTML = item.favorite ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
    favBtn.onclick = (e) => {
        e.stopPropagation();
        toggleItemFavoriteById(item.id);
        refreshUI();
    };
    btnDiv.appendChild(favBtn);
    
    // Note button - toggles both note box AND subtasks
    const noteBtn = document.createElement('button');
    noteBtn.className = 'icon-btn note-btn';
    noteBtn.innerHTML = '<i class="bi bi-chat-left-text"></i>';
    noteBtn.onclick = (e) => {
        e.stopPropagation();
        const noteBox = li.querySelector('.note-box');
        const subtasksContainer = li.querySelector('.subtasks-container');
        
        if (noteBox) noteBox.classList.toggle('d-none');
        if (subtasksContainer) subtasksContainer.classList.toggle('d-none');
    };
    btnDiv.appendChild(noteBtn);
    
    // Recurring button
    const recurBtn = document.createElement('button');
    recurBtn.className = 'icon-btn recur-btn';
    const isRecurring = item.recurrence && item.recurrence.type;
    recurBtn.innerHTML = isRecurring ? '<i class="bi bi-arrow-repeat" style="color: var(--accent);"></i>' : '<i class="bi bi-arrow-repeat"></i>';
    recurBtn.title = isRecurring ? 'Edit recurrence' : 'Make recurring';
    recurBtn.onclick = (e) => {
        e.stopPropagation();
        console.log('Recurring button clicked for item:', item.id);
        console.log('showRecurringDialog function exists?', typeof showRecurringDialog);
        
        if (typeof showRecurringDialog === 'function') {
            console.log('Calling showRecurringDialog...');
            showRecurringDialog(item.id);
        } else {
            console.error('showRecurringDialog function not found! Check if recurring.js is loaded.');
            alert('Recurring feature not loaded. Please check that recurring.js is included in your HTML.');
        }
    };
    btnDiv.appendChild(recurBtn);
    
    // ========== NEW: ALARM, ADDRESS, URL BUTTONS ==========
    
    // Alarm button
    const alarmBtn = document.createElement('button');
    alarmBtn.className = 'icon-btn alarm-btn';
    const hasAlarm = item.alarm && item.alarm.type;
    alarmBtn.innerHTML = hasAlarm ? '<i class="bi bi-alarm-fill" style="color: var(--accent);"></i>' : '<i class="bi bi-alarm"></i>';
    alarmBtn.title = hasAlarm ? `Alarm: ${getAlarmDescription(item.alarm)}` : 'Set alarm';
    alarmBtn.onclick = (e) => {
        e.stopPropagation();
        showAlarmDialog(item.id);
    };
    btnDiv.appendChild(alarmBtn);
    
    // Address button
    const addressBtn = document.createElement('button');
    addressBtn.className = 'icon-btn address-btn';
    const hasAddress = item.address && item.address.trim();
    addressBtn.innerHTML = hasAddress ? '<i class="bi bi-geo-alt-fill" style="color: var(--accent);"></i>' : '<i class="bi bi-geo-alt"></i>';
    addressBtn.title = hasAddress ? `Address: ${item.address}` : 'Add address';
    addressBtn.onclick = (e) => {
        e.stopPropagation();
        showAddressDialog(item.id);
    };
    btnDiv.appendChild(addressBtn);
    
    // URL button
    const urlBtn = document.createElement('button');
    urlBtn.className = 'icon-btn url-btn';
    const hasUrl = item.url && item.url.trim();
    urlBtn.innerHTML = hasUrl ? '<i class="bi bi-link-45deg" style="color: var(--accent);"></i>' : '<i class="bi bi-link-45deg"></i>';
    urlBtn.title = hasUrl ? `URL: ${item.url}` : 'Add link';
    urlBtn.onclick = (e) => {
        e.stopPropagation();
        if (hasUrl) {
            // Right-click or ctrl-click to edit
            if (e.button === 2 || e.ctrlKey) {
                showUrlDialog(item.id);
            } else {
                // Left-click to open
                window.open(item.url, '_blank');
            }
        } else {
            showUrlDialog(item.id);
        }
    };
    urlBtn.oncontextmenu = (e) => {
        e.preventDefault();
        e.stopPropagation();
        showUrlDialog(item.id);
    };
    btnDiv.appendChild(urlBtn);
    
    // ========== END NEW BUTTONS ==========
    
    // Edit button
    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn edit-btn';
    editBtn.innerHTML = '<i class="bi bi-pencil"></i>';
    editBtn.onclick = (e) => {
        e.stopPropagation();
        const newText = prompt('Edit text:', item.text);
        if (newText !== null) {
            updateItemTextById(item.id, newText);
            refreshUI();
        }
    };
    btnDiv.appendChild(editBtn);
    
    // Delete button
    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn del-btn';
    delBtn.innerHTML = '<i class="bi bi-trash"></i>';
    delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteItemById(item.id);
        refreshUI();
    };
    btnDiv.appendChild(delBtn);
    
    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = item.done;
    checkbox.onclick = (e) => {
        e.stopPropagation();
        toggleItemDoneById(item.id);
        
        // Handle recurring task completion
        if (item.recurrence && item.recurrence.type && typeof handleRecurringTaskCompletion === 'function') {
            handleRecurringTaskCompletion(item.id);
        }
        
        refreshUI();
    };
    btnDiv.appendChild(checkbox);
    
    row.appendChild(btnDiv);
    li.appendChild(row);
    
    // Timeline bar (if both start and due dates exist)
    if (item.startDate && item.dueDate) {
        const timelineBar = createTimelineBar(item);
        if (timelineBar) {
            li.appendChild(timelineBar);
        }
    }
    
    // Progress bar and subtasks (hidden by default)
    if (item.subtasks && item.subtasks.length > 0) {
        const subtasksContainer = createSubtasksContainer(item);
        subtasksContainer.classList.add('d-none'); // Hidden by default
        li.appendChild(subtasksContainer);
    }
    
    // Note box (hidden by default)
    const noteBox = document.createElement('div');
    noteBox.className = 'note-box d-none';
    const noteInput = document.createElement('textarea');
    noteInput.className = 'note-input form-control';
    noteInput.placeholder = 'Add notes...';
    noteInput.value = item.note || '';
    noteInput.onchange = () => {
        setItemNoteById(item.id, noteInput.value);
        saveItemsToStorage();
    };
    noteBox.appendChild(noteInput);
    li.appendChild(noteBox);
    
    // DON'T set up drag here - let main.js handle it based on context
    // setupItemDrag(li, item); // REMOVED
    
    return li;
}

function createTimelineBar(item) {
    const duration = getItemDuration(item);
    if (duration === null) return null;
    
    const progress = getDateBasedProgress(item);
    if (progress === null) return null;
    
    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    
    const info = document.createElement('div');
    info.className = 'timeline-info';
    
    const durationSpan = document.createElement('span');
    durationSpan.className = 'timeline-duration';
    durationSpan.textContent = `Duration: ${formatDuration(duration)}`;
    info.appendChild(durationSpan);
    
    const progressSpan = document.createElement('span');
    progressSpan.className = 'timeline-progress';
    progressSpan.textContent = `${progress}% elapsed`;
    info.appendChild(progressSpan);
    
    bar.appendChild(info);
    
    const progressBarContainer = document.createElement('div');
    progressBarContainer.className = 'timeline-progress-bar';
    
    const progressBarFill = document.createElement('div');
    progressBarFill.className = 'timeline-progress-fill';
    progressBarFill.style.width = `${progress}%`;
    
    if (progress > 100) {
        progressBarFill.classList.add('overdue');
    } else if (progress > 75) {
        progressBarFill.classList.add('warning');
    }
    
    progressBarContainer.appendChild(progressBarFill);
    bar.appendChild(progressBarContainer);
    
    return bar;
}

function createSubtasksContainer(item) {
    const container = document.createElement('div');
    container.className = 'subtasks-container';
    
    const header = document.createElement('div');
    header.className = 'subtasks-header';
    
    const title = document.createElement('div');
    title.className = 'subtasks-title';
    title.textContent = 'Subtasks';
    header.appendChild(title);
    
    const badge = document.createElement('span');
    badge.className = 'subtasks-badge';
    const completed = item.subtasks.filter(st => st.done).length;
    badge.textContent = `${completed}/${item.subtasks.length}`;
    header.appendChild(badge);
    
    container.appendChild(header);
    
    item.subtasks.forEach(subtask => {
        const subtaskEl = createSubtaskElement(item.id, subtask);
        container.appendChild(subtaskEl);
    });
    
    const addInput = document.createElement('input');
    addInput.type = 'text';
    addInput.className = 'add-subtask-input';
    addInput.placeholder = 'Add subtask...';
    addInput.onkeypress = (e) => {
        if (e.key === 'Enter' && addInput.value.trim()) {
            addSubtaskToItem(item.id, addInput.value);
            addInput.value = '';
            refreshUI();
        }
    };
    container.appendChild(addInput);
    
    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar-container';
    const progressFill = document.createElement('div');
    progressFill.className = 'progress-bar-fill';
    progressFill.style.width = `${item.progress}%`;
    progressBar.appendChild(progressFill);
    container.appendChild(progressBar);
    
    const progressLabel = document.createElement('div');
    progressLabel.className = 'progress-label';
    progressLabel.innerHTML = `<span>${item.progress}% complete</span>`;
    container.appendChild(progressLabel);
    
    return container;
}

function createSubtaskElement(itemId, subtask) {
    const div = document.createElement('div');
    div.className = 'subtask-item';
    div.dataset.subtaskId = subtask.id;
    div.dataset.itemId = itemId;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'subtask-checkbox';
    checkbox.checked = subtask.done;
    checkbox.onclick = (e) => {
        e.stopPropagation();
        toggleSubtaskDone(itemId, subtask.id);
        refreshUI();
    };
    div.appendChild(checkbox);
    
    const text = document.createElement('span');
    text.className = 'subtask-text';
    if (subtask.done) text.classList.add('completed');
    text.textContent = subtask.text;
    div.appendChild(text);
    
    // Subtask due date button
    const dueDateBtn = document.createElement('button');
    dueDateBtn.className = 'subtask-due-date';
    if (subtask.dueDate) {
        dueDateBtn.classList.add('has-date');
        if (isSubtaskOverdue(subtask)) dueDateBtn.classList.add('overdue');
        if (isSubtaskDueToday(subtask)) dueDateBtn.classList.add('due-today');
        
        const icon = document.createElement('i');
        icon.className = 'bi bi-calendar-check-fill';
        dueDateBtn.appendChild(icon);
        const label = document.createElement('span');
        label.textContent = formatDateForDisplay(subtask.dueDate);
        dueDateBtn.appendChild(label);
    } else {
        const icon = document.createElement('i');
        icon.className = 'bi bi-calendar-check';
        dueDateBtn.appendChild(icon);
    }
    dueDateBtn.title = 'Left-click: Set Due Date | Right-click: Remove Date';
    
    // Left click - set/edit date
    dueDateBtn.onclick = (e) => {
        e.stopPropagation();
        e.preventDefault();
        const currentDate = subtask.dueDate ? subtask.dueDate.split('T')[0] : getTodayDateString();
        const newDate = prompt('Subtask due date (YYYY-MM-DD):', currentDate);
        if (newDate) {
            setSubtaskDueDate(itemId, subtask.id, newDate);
            refreshUI();
        }
    };
    
    // Right click - remove date
    dueDateBtn.oncontextmenu = (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (subtask.dueDate) {
            if (confirm('Remove subtask due date?')) {
                setSubtaskDueDate(itemId, subtask.id, null);
                refreshUI();
            }
        }
    };
    
    div.appendChild(dueDateBtn);
    
    // Subtask time button (only show if due date exists)
    if (subtask.dueDate) {
        const timeBtn = document.createElement('button');
        timeBtn.className = 'subtask-due-date';
        const hasTime = subtask.dueDate.includes('T');
        const icon = document.createElement('i');
        icon.className = hasTime ? 'bi bi-clock-fill' : 'bi bi-clock';
        timeBtn.appendChild(icon);
        timeBtn.title = hasTime ? 'Left-click: Edit Time | Right-click: Remove Time' : 'Click to Add Time';
        
        // Left click - add/edit time
        timeBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            let currentTime = '17:00';
            if (hasTime) {
                currentTime = subtask.dueDate.split('T')[1].substring(0, 5);
            }
            const newTime = prompt('Subtask due time (HH:MM):', currentTime);
            if (newTime && /^\d{2}:\d{2}$/.test(newTime)) {
                setSubtaskDueTime(itemId, subtask.id, newTime);
                refreshUI();
            }
        };
        
        // Right click - remove time (keep date)
        if (hasTime) {
            timeBtn.oncontextmenu = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (confirm('Remove subtask time (keep date)?')) {
                    const datePart = subtask.dueDate.split('T')[0];
                    setSubtaskDueDate(itemId, subtask.id, datePart);
                    refreshUI();
                }
            };
        }
        
        div.appendChild(timeBtn);
    }
    
    const delBtn = document.createElement('button');
    delBtn.className = 'subtask-delete';
    delBtn.innerHTML = '<i class="bi bi-x"></i>';
    delBtn.onclick = (e) => {
        e.stopPropagation();
        deleteSubtask(itemId, subtask.id);
        refreshUI();
    };
    div.appendChild(delBtn);
    
    // Setup subtask drag
    div.ondragstart = (e) => {
        e.stopPropagation();
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', `subtask:${itemId}:${subtask.id}`);
        e.dataTransfer.setData('dateType', 'due');
        div.style.opacity = '0.5';
    };
    
    div.ondragend = (e) => {
        div.style.opacity = '1';
    };
    
    return div;
}

// Helper to get today's date string
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function renderAllItems() {
    const { list, filters } = applyFiltersAndSorting(items);
    
    if (filters.flat) {
        renderFlatList(list);
    } else {
        renderCategorizedList(list);
    }
}

function renderFlatList(filteredItems) {
    const container = document.getElementById('categories');
    container.innerHTML = '';
    
    const ul = document.createElement('ul');
    ul.style.listStyle = 'none';
    ul.style.padding = '0';
    
    filteredItems.forEach(item => {
        const li = createItemElement(item);
        ul.appendChild(li);
    });
    
    container.appendChild(ul);
}

function renderCategorizedList(filteredItems) {
    const catContainer = document.getElementById('categories');
    if (!catContainer) return;
    
    catContainer.innerHTML = '';
    
    categories.forEach(catName => {
        const catItems = filteredItems.filter(it => it.category === catName);
        if (catItems.length === 0) return;
        
        const catDiv = document.createElement('div');
        catDiv.className = 'category';
        catDiv.dataset.name = catName;
        
        const catTitle = document.createElement('div');
        catTitle.className = 'cat-title';
        
        const leftSide = document.createElement('div');
        leftSide.className = 'cat-title-left';
        
        const dragHandle = document.createElement('span');
        dragHandle.className = 'drag-handle';
        dragHandle.innerHTML = '<i class="bi bi-grip-vertical"></i>';
        leftSide.appendChild(dragHandle);
        
        const titleText = document.createElement('span');
        titleText.textContent = catName;
        leftSide.appendChild(titleText);
        
        const badge = document.createElement('span');
        badge.className = 'badge bg-secondary cat-badge';
        badge.textContent = catItems.length;
        leftSide.appendChild(badge);
        
        catTitle.appendChild(leftSide);
        
        const rightSide = document.createElement('div');
        rightSide.className = 'cat-title-right';
        
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.innerHTML = '<i class="bi bi-chevron-down"></i>';
        toggleBtn.onclick = () => {
            const body = catDiv.querySelector('.cat-body');
            body.classList.toggle('open');
            const icon = toggleBtn.querySelector('i');
            icon.className = body.classList.contains('open') ? 'bi bi-chevron-up' : 'bi bi-chevron-down';
            
            const states = getCurrentCategoryStates();
            saveCategoryStates(states);
        };
        rightSide.appendChild(toggleBtn);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'cat-action-btn cat-delete-btn';
        deleteBtn.innerHTML = '<i class="bi bi-trash"></i>';
        deleteBtn.title = 'Delete Category';
        deleteBtn.onclick = () => {
            if (confirm(`Delete category "${catName}" and all its items?`)) {
                deleteItemsByCategory(catName);
                deleteCategory(catName);
                refreshUI();
            }
        };
        rightSide.appendChild(deleteBtn);
        
        catTitle.appendChild(rightSide);
        catDiv.appendChild(catTitle);
        
        const catBody = document.createElement('div');
        catBody.className = 'cat-body open';
        
        const ul = document.createElement('ul');
        catItems.forEach(item => {
            const li = createItemElement(item);
            ul.appendChild(li);
        });
        
        catBody.appendChild(ul);
        catDiv.appendChild(catBody);
        
        catContainer.appendChild(catDiv);
    });
    
    const savedStates = loadCategoryStates();
    categories.forEach(catName => {
        const catDiv = document.querySelector(`.category[data-name="${catName}"]`);
        if (catDiv && savedStates.hasOwnProperty(catName)) {
            const body = catDiv.querySelector('.cat-body');
            const toggleBtn = catDiv.querySelector('.toggle-btn i');
            if (savedStates[catName]) {
                body.classList.add('open');
                toggleBtn.className = 'bi bi-chevron-up';
            } else {
                body.classList.remove('open');
                toggleBtn.className = 'bi bi-chevron-down';
            }
        }
    });
}

function renderCategories() {
    renderAllItems();
}

function updateSummaryDashboard() {
    const totalItems = items.length;
    const doneItems = items.filter(it => it.done).length;
    const urgentItems = items.filter(it => it.favorite && !it.done).length;
    
    document.getElementById('totalCount').textContent = totalItems;
    document.getElementById('doneCount').textContent = doneItems;
    document.getElementById('urgentCount').textContent = urgentItems;
}

function updateCategoryBadge(catName) {
    const catDiv = document.querySelector(`.category[data-name="${catName}"]`);
    if (!catDiv) return;
    
    const badge = catDiv.querySelector('.cat-badge');
    if (!badge) return;
    
    const count = items.filter(it => it.category === catName).length;
    badge.textContent = count;
}