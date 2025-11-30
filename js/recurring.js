// recurring.js
// Recurring tasks functionality

// Recurring patterns
const RECURRENCE_TYPES = {
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly',
    CUSTOM: 'custom'
};

// Add recurring pattern to an item
function setItemRecurrence(itemId, recurrencePattern) {
    console.log('setItemRecurrence called with:', itemId, recurrencePattern);
    const idx = findItemIndexById(itemId);
    console.log('Found item at index:', idx);
    
    if (idx !== -1) {
        console.log('Before setting:', items[idx].recurrence);
        items[idx].recurrence = recurrencePattern;
        console.log('After setting:', items[idx].recurrence);
        saveItemsToStorage();
        console.log('Saved to storage!');
    } else {
        console.error('Item not found with ID:', itemId);
    }
}

// Remove recurring pattern from an item
function removeItemRecurrence(itemId) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1) {
        delete items[idx].recurrence;
        saveItemsToStorage();
    }
}

// Check if item is recurring
function isItemRecurring(item) {
    return item.recurrence && item.recurrence.type;
}

// ========== NEW: EXCEPTION FUNCTIONS ==========
// Add exception date to recurring task
function addRecurringException(itemId, exceptionDate) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1 && items[idx].recurrence) {
        if (!items[idx].recurrence.exceptions) {
            items[idx].recurrence.exceptions = [];
        }
        if (!items[idx].recurrence.exceptions.includes(exceptionDate)) {
            items[idx].recurrence.exceptions.push(exceptionDate);
            saveItemsToStorage();
        }
    }
}

// Remove exception date from recurring task
function removeRecurringException(itemId, exceptionDate) {
    const idx = findItemIndexById(itemId);
    if (idx !== -1 && items[idx].recurrence && items[idx].recurrence.exceptions) {
        const exIdx = items[idx].recurrence.exceptions.indexOf(exceptionDate);
        if (exIdx !== -1) {
            items[idx].recurrence.exceptions.splice(exIdx, 1);
            saveItemsToStorage();
        }
    }
}

// Check if a date is an exception
function isExceptionDate(item, dateStr) {
    return item.recurrence && item.recurrence.exceptions && item.recurrence.exceptions.includes(dateStr);
}
// ========== END EXCEPTION FUNCTIONS ==========

// Get today's date string in YYYY-MM-DD format
function getTodayString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Get tomorrow's date string in YYYY-MM-DD format
function getTomorrowString() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
}

// Get date one year from now in YYYY-MM-DD format
function getOneYearFromNowString() {
    const oneYear = new Date();
    oneYear.setFullYear(oneYear.getFullYear() + 1);
    return oneYear.toISOString().split('T')[0];
}

// Show recurring task dialog
function showRecurringDialog(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
    const currentPattern = item.recurrence || null;
    
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
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        color: var(--text);
    `;
    
    content.innerHTML = `
        <h3 style="margin-top: 0; color: var(--text);">
            <i class="bi bi-arrow-repeat"></i> Repeat Task
        </h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Repeat Type:</label>
            <select id="recurType" class="form-control" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                <option value="">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
            </select>
        </div>
        
        <!-- DATE REQUIREMENT WARNING -->
        <div id="dateWarning" style="display: none; margin-bottom: 16px; padding: 12px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; color: #856404;">
            <i class="bi bi-exclamation-triangle-fill"></i>
            <strong>Dates Required:</strong> To enable recurring, you must set both Start Date (when recurring begins) and Due Date (when recurring ends).
        </div>
        
        <!-- INFO NOTE WHEN DISABLING RECURRING -->
        <div id="disableNote" style="display: none; margin-bottom: 16px; padding: 12px; background: #d1ecf1; border: 1px solid #17a2b8; border-radius: 8px; color: #0c5460;">
            <i class="bi bi-info-circle-fill"></i>
            <strong>Note:</strong> Disabling recurring will also remove the Start and Due dates. You can add new dates manually if needed.
        </div>
        
        <!-- START DATE SECTION -->
        <div id="startDateSection" style="display: none; margin-bottom: 16px; padding: 16px; background: var(--item-bg); border-radius: 8px; border: 2px solid var(--accent);">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">
                <i class="bi bi-flag-fill"></i> Start Date (When recurring begins):
            </label>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <button id="startToday" class="btn btn-sm btn-outline-primary" style="flex: 1;">Today</button>
                <button id="startTomorrow" class="btn btn-sm btn-outline-primary" style="flex: 1;">Tomorrow</button>
            </div>
            <input type="date" id="startDateInput" class="form-control" style="background: var(--box-bg); color: var(--text); border: 1px solid var(--border);">
            <small style="display: block; margin-top: 4px; color: var(--text); opacity: 0.7;">Current: <span id="currentStartDate">Not set</span></small>
        </div>
        
        <!-- DUE DATE SECTION (END DATE) -->
        <div id="dueDateSection" style="display: none; margin-bottom: 16px; padding: 16px; background: var(--item-bg); border-radius: 8px; border: 2px solid var(--accent);">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">
                <i class="bi bi-calendar-check-fill"></i> Due Date (When recurring ends):
            </label>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <button id="endOpenEnded" class="btn btn-sm btn-outline-success" style="flex: 1;">Open-Ended (1 year)</button>
                <button id="endCustom" class="btn btn-sm btn-outline-primary" style="flex: 1;">Custom Date</button>
            </div>
            <input type="date" id="dueDateInput" class="form-control" style="background: var(--box-bg); color: var(--text); border: 1px solid var(--border);">
            <small style="display: block; margin-top: 4px; color: var(--text); opacity: 0.7;">Current: <span id="currentDueDate">Not set</span></small>
        </div>
        
        <div id="customOptions" style="display: none; margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Repeat every:</label>
            <div style="display: flex; gap: 8px; align-items: center;">
                <input type="number" id="recurInterval" min="1" value="1" class="form-control" style="width: 80px; background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                <select id="recurUnit" class="form-control" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                    <option value="days">days</option>
                    <option value="weeks">weeks</option>
                    <option value="months">months</option>
                    <option value="years">years</option>
                </select>
            </div>
        </div>
        
        <div id="weeklyOptions" style="display: none; margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Repeat on:</label>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="0"> Sun
                </label>
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="1"> Mon
                </label>
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="2"> Tue
                </label>
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="3"> Wed
                </label>
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="4"> Thu
                </label>
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="5"> Fri
                </label>
                <label style="padding: 4px 8px; border: 1px solid var(--border); border-radius: 4px; cursor: pointer; background: var(--item-bg);">
                    <input type="checkbox" name="weekday" value="6"> Sat
                </label>
            </div>
        </div>
        
        <!-- NEW: EXCEPTIONS SECTION -->
        <div id="exceptionsSection" style="display: none; margin-bottom: 16px; padding: 16px; background: var(--item-bg); border-radius: 8px; border: 1px solid var(--border);">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">
                <i class="bi bi-calendar-x"></i> Skip Specific Dates:
            </label>
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <input type="date" id="exceptionDate" class="form-control" style="background: var(--box-bg); color: var(--text); border: 1px solid var(--border); flex: 1;">
                <button id="addException" class="btn btn-sm btn-primary" style="background: var(--accent); color: white; border: none;">
                    <i class="bi bi-plus-circle"></i> Add
                </button>
            </div>
            <div id="exceptionsList" style="margin-top: 8px;">
                <!-- Exceptions list here -->
            </div>
            <small style="display: block; margin-top: 4px; color: var(--text); opacity: 0.7;">
                Skip task on specific dates (holidays, vacations, etc.)
            </small>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: flex-end; margin-top: 24px;">
            <button id="cancelRecur" class="btn btn-secondary" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">Cancel</button>
            <button id="saveRecur" class="btn btn-primary" style="background: var(--accent); color: white; border: none;">Save</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Setup event handlers
    const recurType = content.querySelector('#recurType');
    const customOptions = content.querySelector('#customOptions');
    const weeklyOptions = content.querySelector('#weeklyOptions');
    const dateWarning = content.querySelector('#dateWarning');
    const disableNote = content.querySelector('#disableNote');
    const startDateSection = content.querySelector('#startDateSection');
    const dueDateSection = content.querySelector('#dueDateSection');
    const exceptionsSection = content.querySelector('#exceptionsSection');
    const startDateInput = content.querySelector('#startDateInput');
    const dueDateInput = content.querySelector('#dueDateInput');
    const currentStartDate = content.querySelector('#currentStartDate');
    const currentDueDate = content.querySelector('#currentDueDate');
    const exceptionDate = content.querySelector('#exceptionDate');
    const addExceptionBtn = content.querySelector('#addException');
    const exceptionsList = content.querySelector('#exceptionsList');
    
    // Quick date buttons
    const startTodayBtn = content.querySelector('#startToday');
    const startTomorrowBtn = content.querySelector('#startTomorrow');
    const endOpenEndedBtn = content.querySelector('#endOpenEnded');
    const endCustomBtn = content.querySelector('#endCustom');
    
    // Display current dates
    if (item.startDate) {
        currentStartDate.textContent = item.startDate.split('T')[0];
        startDateInput.value = item.startDate.split('T')[0];
    }
    if (item.dueDate) {
        currentDueDate.textContent = item.dueDate.split('T')[0];
        dueDateInput.value = item.dueDate.split('T')[0];
    }
    
    // NEW: Function to render exceptions
    function renderExceptions() {
        if (!item.recurrence || !item.recurrence.exceptions || item.recurrence.exceptions.length === 0) {
            exceptionsList.innerHTML = '<small style="color: var(--text); opacity: 0.6;">No exceptions added</small>';
            return;
        }
        
        exceptionsList.innerHTML = '';
        item.recurrence.exceptions.forEach(excDate => {
            const excItem = document.createElement('div');
            excItem.style.cssText = 'display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; margin-bottom: 4px; background: var(--box-bg); border-radius: 4px; border: 1px solid var(--border);';
            
            const dateText = document.createElement('span');
            const d = new Date(excDate + 'T00:00:00');
            dateText.textContent = d.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
            dateText.style.color = 'var(--text)';
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'btn btn-sm';
            removeBtn.innerHTML = '<i class="bi bi-x"></i>';
            removeBtn.style.cssText = 'background: #dc3545; color: white; border: none; padding: 2px 8px;';
            removeBtn.onclick = () => {
                removeRecurringException(itemId, excDate);
                renderExceptions();
            };
            
            excItem.appendChild(dateText);
            excItem.appendChild(removeBtn);
            exceptionsList.appendChild(excItem);
        });
    }
    
    // NEW: Add exception handler
    addExceptionBtn.addEventListener('click', () => {
        const dateValue = exceptionDate.value;
        if (!dateValue) {
            alert('Please select a date');
            return;
        }
        
        if (item.startDate && item.dueDate) {
            const startDateOnly = item.startDate.split('T')[0];
            const dueDateOnly = item.dueDate.split('T')[0];
            
            if (dateValue < startDateOnly || dateValue > dueDateOnly) {
                alert('Exception must be between Start and Due date');
                return;
            }
        }
        
        addRecurringException(itemId, dateValue);
        renderExceptions();
        exceptionDate.value = '';
    });
    
    // Quick date button handlers
    startTodayBtn.addEventListener('click', () => {
        startDateInput.value = getTodayString();
        currentStartDate.textContent = getTodayString();
    });
    
    startTomorrowBtn.addEventListener('click', () => {
        startDateInput.value = getTomorrowString();
        currentStartDate.textContent = getTomorrowString();
    });
    
    endOpenEndedBtn.addEventListener('click', () => {
        dueDateInput.value = getOneYearFromNowString();
        currentDueDate.textContent = getOneYearFromNowString() + ' (Open-ended: 1 year)';
    });
    
    endCustomBtn.addEventListener('click', () => {
        dueDateInput.focus();
    });
    
    // Update current date displays when inputs change
    startDateInput.addEventListener('change', () => {
        if (startDateInput.value) {
            currentStartDate.textContent = startDateInput.value;
        }
    });
    
    dueDateInput.addEventListener('change', () => {
        if (dueDateInput.value) {
            currentDueDate.textContent = dueDateInput.value;
        }
    });
    
    // Load current pattern if exists
    if (currentPattern) {
        recurType.value = currentPattern.type;
        recurType.dispatchEvent(new Event('change'));
        
        if (currentPattern.interval) {
            content.querySelector('#recurInterval').value = currentPattern.interval;
        }
        if (currentPattern.unit) {
            content.querySelector('#recurUnit').value = currentPattern.unit;
        }
        if (currentPattern.weekdays) {
            currentPattern.weekdays.forEach(day => {
                const checkbox = content.querySelector(`input[name="weekday"][value="${day}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        // Render existing exceptions
        renderExceptions();
    }
    
    recurType.addEventListener('change', () => {
        const type = recurType.value;
        customOptions.style.display = type === 'custom' ? 'block' : 'none';
        weeklyOptions.style.display = type === 'weekly' || (type === 'custom' && content.querySelector('#recurUnit').value === 'weeks') ? 'block' : 'none';
        
        // Show/hide date sections and warning based on whether recurring is enabled
        if (type) {
            // Recurring is being enabled
            startDateSection.style.display = 'block';
            dueDateSection.style.display = 'block';
            exceptionsSection.style.display = 'block'; // NEW: Show exceptions
            disableNote.style.display = 'none';
            
            // Show warning if dates are missing
            if (!item.startDate || !item.dueDate) {
                dateWarning.style.display = 'block';
            } else {
                dateWarning.style.display = 'none';
            }
        } else {
            // Recurring is being disabled
            startDateSection.style.display = 'none';
            dueDateSection.style.display = 'none';
            exceptionsSection.style.display = 'none'; // NEW: Hide exceptions
            dateWarning.style.display = 'none';
            
            // Show info note if task has dates
            if (item.startDate || item.dueDate) {
                disableNote.style.display = 'block';
            } else {
                disableNote.style.display = 'none';
            }
        }
    });
    
    content.querySelector('#recurUnit').addEventListener('change', (e) => {
        weeklyOptions.style.display = e.target.value === 'weeks' ? 'block' : 'none';
    });
    
    // Cancel button
    content.querySelector('#cancelRecur').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Save button
    content.querySelector('#saveRecur').addEventListener('click', () => {
        const type = recurType.value;
        
        console.log('=== SAVING RECURRENCE ===');
        console.log('Item ID:', itemId);
        console.log('Type selected:', type);
        
        if (!type) {
            // Remove recurrence and clear dates
            console.log('Removing recurrence and clearing dates...');
            removeItemRecurrence(itemId);
            
            // Always clear both dates when disabling recurring
            setItemStartDateById(itemId, null);
            setItemDueDateById(itemId, null);
            console.log('Recurring disabled - dates cleared');
            
            document.body.removeChild(modal);
            refreshUI();
            return;
        }
        
        // VALIDATION: Check if dates are set
        const startDate = startDateInput.value;
        const dueDate = dueDateInput.value;
        
        if (!startDate || !dueDate) {
            alert('⚠️ Both Start Date and Due Date are required to enable recurring!\n\n' +
                  '📅 Start Date = When the recurring pattern begins\n' +
                  '🏁 Due Date = When the recurring pattern ends\n\n' +
                  'Please set both dates and try again.');
            return;
        }
        
        // Validate that start date is before or equal to due date
        if (new Date(startDate) > new Date(dueDate)) {
            alert('⚠️ Start Date must be before or equal to Due Date!\n\n' +
                  'Please adjust the dates and try again.');
            return;
        }
        
        // Update item dates first
        setItemStartDateById(itemId, startDate);
        setItemDueDateById(itemId, dueDate);
        
        const pattern = {
            type: type
        };
        
        if (type === 'custom') {
            pattern.interval = parseInt(content.querySelector('#recurInterval').value) || 1;
            pattern.unit = content.querySelector('#recurUnit').value;
        }
        
        if (type === 'weekly' || (type === 'custom' && pattern.unit === 'weeks')) {
            const weekdays = [];
            content.querySelectorAll('input[name="weekday"]:checked').forEach(cb => {
                weekdays.push(parseInt(cb.value));
            });
            if (weekdays.length > 0) {
                pattern.weekdays = weekdays;
            }
        }
        
        // NEW: Preserve exceptions
        if (item.recurrence && item.recurrence.exceptions) {
            pattern.exceptions = item.recurrence.exceptions;
        }
        
        console.log('Pattern to save:', pattern);
        console.log('Start date:', startDate);
        console.log('Due date:', dueDate);
        
        setItemRecurrence(itemId, pattern);
        
        // Verify it was saved
        const itemCheck = items.find(it => it.id === itemId);
        console.log('After save, item recurrence:', itemCheck ? itemCheck.recurrence : 'ITEM NOT FOUND');
        console.log('After save, item startDate:', itemCheck ? itemCheck.startDate : 'ITEM NOT FOUND');
        console.log('After save, item dueDate:', itemCheck ? itemCheck.dueDate : 'ITEM NOT FOUND');
        
        document.body.removeChild(modal);
        refreshUI();
    });
    
    // Click overlay to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Trigger initial change to show/hide sections
    recurType.dispatchEvent(new Event('change'));
}

// Get human-readable description of recurrence pattern
function getRecurrenceDescription(pattern) {
    if (!pattern || !pattern.type) return '';
    
    let desc = '';
    switch (pattern.type) {
        case 'daily':
            desc = 'Repeats daily';
            break;
        case 'weekly':
            if (pattern.weekdays && pattern.weekdays.length > 0) {
                const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const dayNames = pattern.weekdays.map(d => days[d]).join(', ');
                desc = `Repeats weekly on ${dayNames}`;
            } else {
                desc = 'Repeats weekly';
            }
            break;
        case 'monthly':
            desc = 'Repeats monthly';
            break;
        case 'yearly':
            desc = 'Repeats yearly';
            break;
        case 'custom':
            const interval = pattern.interval || 1;
            const unit = pattern.unit || 'days';
            desc = `Repeats every ${interval} ${unit}`;
            break;
        default:
            desc = '';
    }
    
    // NEW: Add exceptions count
    if (pattern.exceptions && pattern.exceptions.length > 0) {
        desc += ` (${pattern.exceptions.length} skip${pattern.exceptions.length > 1 ? 's' : ''})`;
    }
    
    return desc;
}

// Calculate next occurrence date
function getNextOccurrence(item) {
    if (!item.recurrence || !item.startDate) return null;
    
    const pattern = item.recurrence;
    const currentDate = new Date(item.startDate);
    const nextDate = new Date(currentDate);
    
    switch (pattern.type) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'weekly':
            if (pattern.weekdays && pattern.weekdays.length > 0) {
                // Find next weekday
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
    }
    
    return nextDate.toISOString().split('T')[0];
}

// When task is completed, create next occurrence
function handleRecurringTaskCompletion(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item || !isItemRecurring(item)) return;
    
    // Calculate next occurrence
    const nextDate = getNextOccurrence(item);
    if (!nextDate) return;
    
    // Check if we've reached the end (due date)
    if (item.dueDate) {
        const dueDateOnly = item.dueDate.split('T')[0];
        if (nextDate > dueDateOnly) {
            // Reached end date, stop recurring
            console.log('Recurring ended - reached due date');
            return;
        }
    }
    
    // Update the current task's start date to next occurrence
    // and mark it as not done
    item.startDate = nextDate;
    item.done = false;
    
    // Reset subtasks if any
    if (item.subtasks && item.subtasks.length > 0) {
        item.subtasks.forEach(st => st.done = false);
        updateItemProgress(itemId);
    }
    
    saveItemsToStorage();
}