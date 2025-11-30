// calendar.js
// Calendar view functionality

let currentCalendarDate = new Date();
let calendarViewMode = 'month'; // 'month' or 'week'

function setupCalendar() {
    const calendarBtn = document.getElementById('calendarBtn');
    const closeBtn = document.getElementById('closeCalendar');
    const overlay = document.querySelector('#calendarModal .shortcuts-overlay');
    const prevBtn = document.getElementById('calendarPrevBtn');
    const nextBtn = document.getElementById('calendarNextBtn');
    const todayBtn = document.getElementById('calendarTodayBtn');
    const viewToggle = document.getElementById('calendarViewToggle');

    if (calendarBtn) {
        calendarBtn.addEventListener('click', () => {
            currentCalendarDate = new Date();
            openCalendar();
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeCalendar);
    }

    if (overlay) {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeCalendar();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (calendarViewMode === 'month') {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
            } else {
                currentCalendarDate.setDate(currentCalendarDate.getDate() - 7);
            }
            renderCalendar();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (calendarViewMode === 'month') {
                currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
            } else {
                currentCalendarDate.setDate(currentCalendarDate.getDate() + 7);
            }
            renderCalendar();
        });
    }

    if (todayBtn) {
        todayBtn.addEventListener('click', () => {
            currentCalendarDate = new Date();
            renderCalendar();
        });
    }

    if (viewToggle) {
        viewToggle.addEventListener('click', () => {
            calendarViewMode = calendarViewMode === 'month' ? 'week' : 'month';
            viewToggle.innerHTML = calendarViewMode === 'month' 
                ? '<i class="bi bi-calendar-week"></i> Week' 
                : '<i class="bi bi-calendar-month"></i> Month';
            renderCalendar();
        });
    }
}

function openCalendar() {
    const modal = document.getElementById('calendarModal');
    if (modal) {
        console.log('=== OPENING CALENDAR MODAL ===');
        modal.classList.remove('d-none');
        modal.style.display = 'flex';
        
        renderCalendar();
        
        // Enable dragging immediately
        console.log('=== ABOUT TO ENABLE DRAGGING ===');
        enableTaskDragging();
        
        // Also try again after a delay
        setTimeout(() => {
            console.log('=== ENABLING DRAGGING AGAIN (AFTER DELAY) ===');
            enableTaskDragging();
        }, 200);
    } else {
        console.error('Calendar modal not found!');
    }
}

function closeCalendar() {
    const modal = document.getElementById('calendarModal');
    if (modal) {
        modal.classList.add('closing');
        
        // Disable dragging for all items and subtasks
        disableTaskDragging();
        
        setTimeout(() => {
            modal.classList.add('d-none');
            modal.classList.remove('closing');
            modal.style.display = 'none';
            
            // Re-enable item drag for category moves after calendar closes
            console.log('Calendar closed - re-enabling item drag for category moves');
            if (typeof setupItemDragBetweenCategories === 'function') {
                setupItemDragBetweenCategories();
            }
        }, 300);
    }
}

// Enable dragging for all tasks and subtasks
function enableTaskDragging() {
    console.log('==========================================');
    console.log('ENABLING TASK DRAGGING - FUNCTION CALLED');
    console.log('==========================================');
    
    // Enable main tasks
    const items = document.querySelectorAll('li.item');
    console.log('🔍 Searching for li.item elements...');
    console.log('✅ Found items:', items.length);
    
    let enabledCount = 0;
    items.forEach((item, index) => {
        const oldDraggable = item.draggable;
        item.draggable = true;
        item.classList.add('draggable-enabled');
        item.style.setProperty('cursor', 'grab', 'important');
        
        console.log(`  Item ${index + 1}:`, {
            id: item.dataset.id,
            text: item.querySelector('.item-text')?.textContent?.substring(0, 30),
            wasDraggable: oldDraggable,
            nowDraggable: item.draggable,
            cursor: item.style.cursor
        });
        
        enabledCount++;
    });
    
    console.log(`✅ Enabled dragging for ${enabledCount} items`);
    
    // Enable subtasks
    const subtasks = document.querySelectorAll('.subtask-item');
    console.log('🔍 Searching for .subtask-item elements...');
    console.log('✅ Found subtasks:', subtasks.length);
    
    let subtaskEnabledCount = 0;
    subtasks.forEach((subtask, index) => {
        subtask.draggable = true;
        subtask.classList.add('draggable-enabled');
        subtask.style.setProperty('cursor', 'grab', 'important');
        subtaskEnabledCount++;
    });
    
    console.log(`✅ Enabled dragging for ${subtaskEnabledCount} subtasks`);
    console.log('==========================================');
    console.log('TASK DRAGGING ENABLED SUCCESSFULLY!');
    console.log('==========================================');
}

// Disable dragging for all tasks and subtasks
function disableTaskDragging() {
    console.log('Disabling task dragging...');
    
    // Disable main tasks
    const items = document.querySelectorAll('li.item');
    items.forEach(item => {
        item.draggable = false;
        item.classList.remove('draggable-enabled');
        item.style.cursor = '';
    });
    
    // Disable subtasks
    const subtasks = document.querySelectorAll('.subtask-item');
    subtasks.forEach(subtask => {
        subtask.draggable = false;
        subtask.classList.remove('draggable-enabled');
        subtask.style.cursor = '';
    });
    
    console.log('Task dragging disabled!');
}

function renderCalendar() {
    if (calendarViewMode === 'month') {
        renderMonthView();
    } else {
        renderWeekView();
    }
}

function renderMonthView() {
    const monthEl = document.getElementById('calendarMonthYear');
    const gridEl = document.getElementById('calendarGrid');
    
    if (!gridEl) {
        console.error('Calendar grid element not found!');
        return;
    }

    const year = currentCalendarDate.getFullYear();
    const month = currentCalendarDate.getMonth();
    
    // Update month header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    if (monthEl) {
        monthEl.textContent = `${monthNames[month]} ${year}`;
    }

    // Clear grid
    gridEl.innerHTML = '';
    
    // Set grid to calendar layout
    gridEl.className = 'calendar-grid';

    // Add day headers
    const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        gridEl.appendChild(header);
    });

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Get tasks by date
    const tasksByDate = getTasksByDate();

    // Add previous month's trailing days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i;
        const dayEl = createCalendarDay(day, month - 1, year, tasksByDate, true);
        gridEl.appendChild(dayEl);
    }

    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = (day === today.getDate() && month === today.getMonth() && year === today.getFullYear());
        const dayEl = createCalendarDay(day, month, year, tasksByDate, false, isToday);
        gridEl.appendChild(dayEl);
    }

    // Add next month's leading days
    const remainingSlots = 42 - (startingDayOfWeek + daysInMonth);
    for (let day = 1; day <= remainingSlots; day++) {
        const dayEl = createCalendarDay(day, month + 1, year, tasksByDate, true);
        gridEl.appendChild(dayEl);
    }
}

function renderWeekView() {
    const monthEl = document.getElementById('calendarMonthYear');
    const gridEl = document.getElementById('calendarGrid');
    
    if (!gridEl) {
        console.error('Calendar grid element not found!');
        return;
    }

    // Get the week containing currentCalendarDate
    const today = new Date(currentCalendarDate);
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek);

    // Update header with week range
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    if (monthEl) {
        const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const endMonth = endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        monthEl.textContent = `${startMonth} - ${endMonth}`;
    }

    // Clear grid
    gridEl.innerHTML = '';
    
    // Set grid to calendar layout
    gridEl.className = 'calendar-grid';

    // Add day headers
    const dayHeaders = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        gridEl.appendChild(header);
    });

    // Get tasks by date
    const tasksByDate = getTasksByDate();

    // Add 7 days
    const realToday = new Date();
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        
        const isToday = (
            currentDay.getDate() === realToday.getDate() && 
            currentDay.getMonth() === realToday.getMonth() && 
            currentDay.getFullYear() === realToday.getFullYear()
        );
        
        const dayEl = createCalendarDay(
            currentDay.getDate(),
            currentDay.getMonth(),
            currentDay.getFullYear(),
            tasksByDate,
            false,
            isToday
        );
        
        // Make week view cells taller
        dayEl.style.minHeight = '120px';
        dayEl.style.maxHeight = 'none';
        
        gridEl.appendChild(dayEl);
    }
}

function createCalendarDay(day, month, year, tasksByDate, isOtherMonth, isToday = false) {
    const dayEl = document.createElement('div');
    dayEl.className = 'calendar-day';
    if (isOtherMonth) dayEl.classList.add('other-month');
    if (isToday) dayEl.classList.add('today');

    const dayNum = document.createElement('div');
    dayNum.className = 'calendar-day-number';
    dayNum.textContent = day;
    dayEl.appendChild(dayNum);

    // Get tasks for this date
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const tasksForDay = tasksByDate[dateStr] || [];

    if (tasksForDay.length > 0) {
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'calendar-task-dots';

        // Show up to 3 dots
        const visibleTasks = tasksForDay.slice(0, 3);
        visibleTasks.forEach(task => {
            const dot = document.createElement('div');
            dot.className = 'calendar-task-dot';
            
            // Check if it's a subtask or main task
            let isOverdue, isDueToday;
            
            if (task.isSubtask) {
                // For subtasks, only show dot if not done
                if (task.done) {
                    return;
                }
                isOverdue = isDateOverdue(task.dueDate) && !task.done;
                isDueToday = isDateToday(task.dueDate);
            } else {
                // For main tasks, use the helper functions
                isOverdue = isItemOverdue(task);
                isDueToday = isItemDueToday(task);
            }
            
            if (isOverdue) {
                dot.classList.add('overdue');
            } else if (isDueToday) {
                dot.classList.add('today');
            } else {
                dot.classList.add('upcoming');
            }
            
            dotsContainer.appendChild(dot);
        });

        dayEl.appendChild(dotsContainer);
    }

    // Click to show tasks
    dayEl.addEventListener('click', () => {
        showTasksForDate(dateStr, tasksForDay, dayEl);
    });

    // Setup drag-and-drop for date changes
    setupCalendarDayDropZone(dayEl, dateStr);

    return dayEl;
}

// Setup drag-and-drop functionality for calendar days
function setupCalendarDayDropZone(dayEl, dateStr) {
    // Allow dropping on this day
    dayEl.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dayEl.classList.add('drag-over');
    });

    dayEl.addEventListener('dragleave', () => {
        dayEl.classList.remove('drag-over');
    });

    dayEl.addEventListener('drop', (e) => {
        e.preventDefault();
        dayEl.classList.remove('drag-over');

        const taskId = e.dataTransfer.getData('text/plain');
        const dateType = e.dataTransfer.getData('dateType') || 'due'; // 'start' or 'due'

        console.log('Drop detected:', { taskId, dateType, dateStr });

        // Check if it's a subtask (format: "subtask:parentId:subtaskId")
        if (taskId.startsWith('subtask:')) {
            const parts = taskId.split(':');
            const parentId = parts[1];
            const subtaskId = parts[2];
            
            // Update subtask due date (subtasks don't have start dates)
            setSubtaskDueDate(parentId, subtaskId, dateStr);
            saveItemsToStorage();
            
            // Show success message
            showDropFeedback(dayEl, 'Subtask due date updated!');
        } else if (taskId) {
            // Update main task date based on dateType
            if (dateType === 'start') {
                setItemStartDateById(taskId, dateStr);
                showDropFeedback(dayEl, 'Start date updated! 📅');
            } else {
                setItemDueDateById(taskId, dateStr);
                showDropFeedback(dayEl, 'Due date updated! 🏁');
            }
            saveItemsToStorage();
        }

        // Re-render calendar to show new date
        renderCalendar();
        
        // Re-render the main UI - IMPORTANT!
        if (typeof refreshUI === 'function') {
            refreshUI();
        } else if (typeof renderAllItems === 'function') {
            renderAllItems();
        }
        
        // Re-enable dragging after UI refresh (items are recreated)
        setTimeout(() => {
            enableTaskDragging();
        }, 100);
    });
}

// Show visual feedback when task is dropped
function showDropFeedback(element, message) {
    const feedback = document.createElement('div');
    feedback.className = 'drop-feedback';
    feedback.textContent = message;
    feedback.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--accent);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85rem;
        font-weight: 600;
        z-index: 1000;
        pointer-events: none;
        animation: dropFeedbackAnim 1s ease forwards;
    `;

    element.style.position = 'relative';
    element.appendChild(feedback);

    setTimeout(() => {
        feedback.remove();
    }, 1000);
}

function getTasksByDate() {
    const tasksByDate = {};
    
    console.log('=== Getting tasks by date ===');
    console.log('Total items:', items.length);
    
    // Get calendar view range (current month or week)
    const viewStart = new Date(currentCalendarDate);
    const viewEnd = new Date(currentCalendarDate);
    
    if (calendarViewMode === 'month') {
        // Start of month
        viewStart.setDate(1);
        viewStart.setHours(0, 0, 0, 0);
        // End of month + some days for next month preview
        viewEnd.setMonth(viewEnd.getMonth() + 1);
        viewEnd.setDate(15); // Show 2 weeks into next month
    } else {
        // Week view - show 2 weeks ahead
        viewEnd.setDate(viewEnd.getDate() + 14);
    }
    
    items.forEach(item => {
        // Add main task if it has a due date
        if (item.dueDate) {
            const dateOnly = item.dueDate.split('T')[0];
            if (!tasksByDate[dateOnly]) {
                tasksByDate[dateOnly] = [];
            }
            tasksByDate[dateOnly].push({
                ...item,
                isSubtask: false,
                isStartDate: false
            });
            
            console.log('Processing item:', item.text, 'Due:', dateOnly);
            console.log('Has recurrence?', item.recurrence);
            console.log('Is done?', item.done);
            console.log('Start date?', item.startDate);
            
            // IMPORTANT: Only generate recurring instances if:
            // 1. Has recurrence pattern
            // 2. Has both startDate AND dueDate
            // 3. Not done
            if (item.recurrence && item.recurrence.type && !item.done && item.startDate && item.dueDate) {
                console.log('Generating recurring instances for:', item.text);
                console.log('Recurrence range: Start =', item.startDate, 'Due =', item.dueDate);
                
                const futureOccurrences = generateRecurringOccurrences(item, viewStart, viewEnd);
                console.log('Generated occurrences:', futureOccurrences);
                
                futureOccurrences.forEach(occurrence => {
                    const occurrenceDate = occurrence.date;
                    if (!tasksByDate[occurrenceDate]) {
                        tasksByDate[occurrenceDate] = [];
                    }
                    tasksByDate[occurrenceDate].push({
                        ...item,
                        dueDate: occurrenceDate,
                        isSubtask: false,
                        isStartDate: false,
                        isRecurringInstance: true,
                        originalDate: item.dueDate
                    });
                    console.log('Added recurring instance on:', occurrenceDate);
                });
            } else if (item.recurrence && item.recurrence.type) {
                console.log('⚠️ Recurring task but missing dates - skipping occurrence generation');
            }
        }
        
        // Add main task if it has a start date
        if (item.startDate) {
            const dateOnly = item.startDate.split('T')[0];
            if (!tasksByDate[dateOnly]) {
                tasksByDate[dateOnly] = [];
            }
            tasksByDate[dateOnly].push({
                ...item,
                isSubtask: false,
                isStartDate: true
            });
        }
        
        // Add subtasks with due dates
        if (item.subtasks && item.subtasks.length > 0) {
            item.subtasks.forEach(subtask => {
                if (subtask.dueDate) {
                    const dateOnly = subtask.dueDate.split('T')[0];
                    if (!tasksByDate[dateOnly]) {
                        tasksByDate[dateOnly] = [];
                    }
                    tasksByDate[dateOnly].push({
                        id: subtask.id,
                        text: `↳ ${subtask.text}`,
                        category: item.category,
                        priority: item.priority,
                        done: subtask.done,
                        dueDate: subtask.dueDate,
                        parentTask: item.text,
                        parentId: item.id,
                        isSubtask: true
                    });
                }
            });
        }
    });

    console.log('=== Total dates with tasks:', Object.keys(tasksByDate).length);
    return tasksByDate;
}

// Generate future occurrences for recurring tasks using Start Date and Due Date
// NEW: Now skips exception dates
function generateRecurringOccurrences(item, viewStartDate, viewEndDate) {
    if (!item.recurrence || !item.recurrence.type || !item.startDate || !item.dueDate) {
        console.log('Cannot generate occurrences - missing recurrence, startDate, or dueDate');
        return [];
    }
    
    const occurrences = [];
    const pattern = item.recurrence;
    
    // Recurring range: Start Date to Due Date
    const recurStart = new Date(item.startDate.split('T')[0]);
    const recurEnd = new Date(item.dueDate.split('T')[0]);
    
    console.log('Recurrence range:', recurStart, 'to', recurEnd);
    console.log('View range:', viewStartDate, 'to', viewEndDate);
    
    // Start from the beginning of the recurrence range
    let currentDate = new Date(recurStart);
    
    let iterationCount = 0;
    const maxIterations = 365; // Safety limit
    
    while (currentDate && currentDate <= recurEnd && iterationCount < maxIterations) {
        iterationCount++;
        
        // Add this occurrence if it's within the view range
        const dateStr = currentDate.toISOString().split('T')[0];
        const originalDateStr = recurStart.toISOString().split('T')[0];
        
        // NEW: Check if this date is an exception
        const isException = isExceptionDate(item, dateStr);
        
        // Don't add the original start date (we already show that)
        // Only add future occurrences that are NOT exceptions
        if (currentDate >= viewStartDate && currentDate <= viewEndDate && dateStr !== originalDateStr && !isException) {
            occurrences.push({
                date: dateStr,
                occurrenceNumber: iterationCount
            });
            console.log('Added occurrence:', dateStr);
        } else if (isException) {
            console.log('Skipped exception date:', dateStr);
        }
        
        // Get next occurrence
        currentDate = getNextOccurrenceDate(currentDate, pattern);
        
        if (!currentDate) break;
    }
    
    console.log('Total occurrences generated:', occurrences.length);
    return occurrences;
}

// Calculate next occurrence date based on recurrence pattern
function getNextOccurrenceDate(currentDate, pattern) {
    const nextDate = new Date(currentDate);
    
    switch (pattern.type) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
            
        case 'weekly':
            if (pattern.weekdays && pattern.weekdays.length > 0) {
                // Find next selected weekday
                let found = false;
                for (let i = 1; i <= 7; i++) {
                    const testDate = new Date(currentDate);
                    testDate.setDate(testDate.getDate() + i);
                    if (pattern.weekdays.includes(testDate.getDay())) {
                        nextDate.setTime(testDate.getTime());
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    nextDate.setDate(nextDate.getDate() + 7);
                }
            } else {
                nextDate.setDate(nextDate.getDate() + 7);
            }
            break;
            
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
            
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
            
        case 'custom':
            const interval = pattern.interval || 1;
            const unit = pattern.unit || 'days';
            
            if (unit === 'days') {
                nextDate.setDate(nextDate.getDate() + interval);
            } else if (unit === 'weeks') {
                nextDate.setDate(nextDate.getDate() + (interval * 7));
            } else if (unit === 'months') {
                nextDate.setMonth(nextDate.getMonth() + interval);
            } else if (unit === 'years') {
                nextDate.setFullYear(nextDate.getFullYear() + interval);
            }
            break;
            
        default:
            return null;
    }
    
    return nextDate;
}

// NEW: Updated to show times and add tasks button
function showTasksForDate(dateStr, tasks, dayEl) {
    const taskListEl = document.getElementById('calendarTaskList');
    if (!taskListEl) return;

    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(el => {
        el.classList.remove('selected');
    });
    dayEl.classList.add('selected');

    // Format date
    const date = new Date(dateStr + 'T00:00:00');
    const dateFormatted = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    // Create header with add button
    taskListEl.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h5 style="margin: 0;">${dateFormatted}</h5>
            <button id="addTasksToDateBtn" class="btn btn-sm btn-primary" style="background: var(--accent); color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer;">
                <i class="bi bi-plus-circle"></i> Add Tasks
            </button>
        </div>
        <div style="margin-bottom: 8px; color: var(--text); opacity: 0.7;">
            ${tasks.length} ${tasks.length === 1 ? 'item' : 'items'}
        </div>
    `;
    taskListEl.classList.remove('d-none');
    
    // Add click handler for the add button
    const addBtn = document.getElementById('addTasksToDateBtn');
    if (addBtn) {
        addBtn.onclick = () => {
            showAddTasksToDateDialog(dateStr);
        };
    }

    tasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'calendar-task-item';
        
        // Add done class for completed tasks/subtasks
        if (task.done) {
            taskEl.classList.add('done');
        }
        
        // Check if task or subtask is overdue
        let isOverdue, isDueToday;
        
        if (task.isSubtask) {
            isOverdue = isDateOverdue(task.dueDate) && !task.done;
            isDueToday = isDateToday(task.dueDate);
        } else {
            if (!task.isStartDate) {
                isOverdue = isItemOverdue(task);
                isDueToday = isItemDueToday(task);
            }
        }
        
        if (isOverdue) {
            taskEl.classList.add('overdue');
        } else if (isDueToday) {
            taskEl.classList.add('today');
        }

        const title = document.createElement('div');
        title.className = 'calendar-task-title';
        
        // Add recurring indicator for recurring instances
        let recurringIcon = '';
        if (task.isRecurringInstance) {
            recurringIcon = '🔄 ';
        }
        
        // Add icon to indicate start vs due date
        const dateIcon = task.isStartDate ? '▶️ ' : '🏁 ';
        
        // NEW: Extract and display time
        let timeStr = '';
        const relevantDate = task.isStartDate ? task.startDate : task.dueDate;
        const time = extractTime(relevantDate);
        if (time) {
            timeStr = ` 🕐 ${time}`;
        }
        
        title.textContent = recurringIcon + (task.isStartDate ? dateIcon : '') + task.text + timeStr;
        
        // Add strikethrough for completed tasks
        if (task.done) {
            title.style.textDecoration = 'line-through';
            title.style.opacity = '0.6';
        }
        
        // Add parent task info for subtasks
        if (task.isSubtask) {
            title.style.fontSize = '0.9rem';
            if (!task.done) {
                title.style.opacity = '0.9';
            }
        }

        const meta = document.createElement('div');
        meta.className = 'calendar-task-meta';
        
        const metaParts = [];
        
        // Show date type for main tasks
        if (!task.isSubtask) {
            if (task.isStartDate) {
                metaParts.push('📅 Start Date');
            } else {
                metaParts.push('🏁 Due Date');
            }
        }
        
        if (task.isSubtask) {
            metaParts.push(`From: ${task.parentTask}`);
        }
        
        metaParts.push(task.category);
        
        if (task.priority && task.priority !== 'none') {
            metaParts.push(task.priority.toUpperCase() + ' priority');
        }
        
        if (!task.isSubtask && task.subtasks && task.subtasks.length > 0) {
            metaParts.push(`${task.progress}% complete`);
        }
        
        // Add completion status for done tasks
        if (task.done) {
            metaParts.push('✓ Completed');
        }
        
        meta.textContent = metaParts.join(' • ');

        taskEl.appendChild(title);
        taskEl.appendChild(meta);

        // Click to close calendar and show task
        taskEl.addEventListener('click', () => {
            closeCalendar();
            
            // Scroll to the task and optionally open its notes
            const taskElement = document.querySelector(`[data-id="${task.isSubtask ? task.parentId : task.id}"]`);
            if (taskElement) {
                taskElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Flash the task to highlight it
                taskElement.classList.add('flash-highlight');
                setTimeout(() => {
                    taskElement.classList.remove('flash-highlight');
                }, 1500);
                
                // If it's a subtask, open the note box
                if (task.isSubtask) {
                    const noteBox = taskElement.querySelector('.note-box');
                    if (noteBox && noteBox.classList.contains('d-none')) {
                        const noteBtn = taskElement.querySelector('.note-btn');
                        if (noteBtn) {
                            noteBtn.click();
                        }
                    }
                }
            }
        });

        taskListEl.appendChild(taskEl);
    });
}

// Helper function to check if a date string is overdue
function isDateOverdue(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr.split('T')[0]);
    due.setHours(0, 0, 0, 0);
    return due < today;
}

// Helper function to check if a date string is today
function isDateToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dateStr.split('T')[0]);
    due.setHours(0, 0, 0, 0);
    return due.getTime() === today.getTime();
}

// NEW: Extract and format time from date string
function extractTime(dateStr) {
    if (!dateStr || !dateStr.includes('T')) return null;
    const timePart = dateStr.split('T')[1];
    if (!timePart) return null;
    
    const hours = parseInt(timePart.substring(0, 2));
    const minutes = timePart.substring(3, 5);
    
    // Convert to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    
    return `${hour12}:${minutes} ${period}`;
}

// NEW: Show dialog to add existing tasks to a specific date
function showAddTasksToDateDialog(dateStr) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: var(--box-bg);
        border-radius: 16px;
        padding: 24px;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        color: var(--text);
    `;
    
    const date = new Date(dateStr + 'T00:00:00');
    const dateFormatted = date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    content.innerHTML = `
        <h3 style="margin-top: 0; color: var(--text);">
            <i class="bi bi-calendar-plus"></i> Add Tasks to ${dateFormatted}
        </h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Select Date Type:</label>
            <select id="dateType" class="form-control" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border); margin-bottom: 12px;">
                <option value="start">Set as Start Date</option>
                <option value="due">Set as Due Date</option>
            </select>
        </div>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">
                <input type="checkbox" id="addTime" style="margin-right: 6px;">
                Add specific time
            </label>
            <input type="time" id="timeInput" class="form-control" disabled style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);" value="09:00">
        </div>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Select Tasks:</label>
            <div id="tasksList" style="max-height: 300px; overflow-y: auto; border: 1px solid var(--border); border-radius: 8px; padding: 8px; background: var(--item-bg);">
                <!-- Tasks will be added here -->
            </div>
        </div>
        
        <div style="padding: 12px; background: var(--item-bg); border-radius: 8px; margin-bottom: 16px;">
            <small style="color: var(--text); opacity: 0.8;">
                <i class="bi bi-info-circle"></i> Select one or more tasks to assign to this date. Tasks will keep their existing dates on the other field (start/due).
            </small>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="cancelAddTasks" class="btn btn-secondary" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">Cancel</button>
            <button id="saveAddTasks" class="btn btn-primary" style="background: var(--accent); color: white; border: none;">Add to Date</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const tasksList = content.querySelector('#tasksList');
    const dateType = content.querySelector('#dateType');
    const addTimeCheckbox = content.querySelector('#addTime');
    const timeInput = content.querySelector('#timeInput');
    
    // Enable/disable time input based on checkbox
    addTimeCheckbox.addEventListener('change', () => {
        timeInput.disabled = !addTimeCheckbox.checked;
    });
    
    // Populate tasks list
    items.forEach(item => {
        const taskDiv = document.createElement('div');
        taskDiv.style.cssText = `
            padding: 8px;
            margin-bottom: 4px;
            border-radius: 6px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s;
        `;
        
        taskDiv.innerHTML = `
            <label style="display: flex; align-items: center; cursor: pointer; margin: 0;">
                <input type="checkbox" class="task-checkbox" data-task-id="${item.id}" style="margin-right: 8px;">
                <div style="flex: 1;">
                    <div style="font-weight: 500;">${item.text}</div>
                    <small style="opacity: 0.7;">${item.category}</small>
                </div>
            </label>
        `;
        
        taskDiv.addEventListener('mouseover', () => {
            taskDiv.style.background = 'var(--border)';
        });
        
        taskDiv.addEventListener('mouseout', () => {
            const checkbox = taskDiv.querySelector('.task-checkbox');
            if (!checkbox.checked) {
                taskDiv.style.background = 'transparent';
            }
        });
        
        const checkbox = taskDiv.querySelector('.task-checkbox');
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                taskDiv.style.background = 'var(--accent)';
                taskDiv.style.borderColor = 'var(--accent)';
            } else {
                taskDiv.style.background = 'transparent';
                taskDiv.style.borderColor = 'transparent';
            }
        });
        
        tasksList.appendChild(taskDiv);
    });
    
    // Cancel button
    content.querySelector('#cancelAddTasks').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Save button
    content.querySelector('#saveAddTasks').addEventListener('click', () => {
        const selectedCheckboxes = content.querySelectorAll('.task-checkbox:checked');
        
        if (selectedCheckboxes.length === 0) {
            alert('Please select at least one task');
            return;
        }
        
        const type = dateType.value;
        const withTime = addTimeCheckbox.checked;
        const time = timeInput.value;
        
        let finalDate = dateStr;
        if (withTime) {
            finalDate = `${dateStr}T${time}:00`;
        }
        
        // Update each selected task
        selectedCheckboxes.forEach(cb => {
            const taskId = cb.dataset.taskId;
            if (type === 'start') {
                setItemStartDateById(taskId, finalDate);
            } else {
                setItemDueDateById(taskId, finalDate);
            }
        });
        
        saveItemsToStorage();
        document.body.removeChild(modal);
        
        // Refresh calendar and UI
        renderCalendar();
        if (typeof refreshUI === 'function') {
            refreshUI();
        }
        
        // Show success message
        alert(`✅ ${selectedCheckboxes.length} task${selectedCheckboxes.length > 1 ? 's' : ''} added to ${dateFormatted}`);
    });
    
    // Click overlay to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}