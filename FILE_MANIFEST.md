# TaskFlow - File Manifest

**Purpose:** Quick reference for which files do what and their dependencies

---

## 📄 JavaScript Files (12 files)

### **main.js** - Application Orchestrator
**Purpose:** Glues everything together, initializes app  
**Key Functions:**
- `refreshUI()` - Main render function
- App initialization on page load

**Dependencies:** All other JS files  
**Depended by:** None (top-level)  
**When to modify:** Rarely - only when adding new global initialization

---

### **ui.js** - UI Rendering Engine
**Purpose:** Creates and renders all visual elements  
**Key Functions:**
- `createItemElement(item)` - Creates task HTML
- `renderCategories()` - Renders category sections
- Timeline visualization

**Dependencies:** items.js, categories.js, recurring.js  
**Depended by:** main.js  
**When to modify:** Adding visual features, changing task appearance

---

### **items.js** - Task CRUD Operations
**Purpose:** All task data operations  
**Key Functions:**
- `createItem()` - Create new task
- `updateItem()` - Modify task
- `deleteItem()` - Remove task
- `toggleItemDone()` - Mark complete/incomplete

**Dependencies:** storage.js, recurring.js  
**Depended by:** ui.js, main.js, calendar.js  
**When to modify:** Changing task data structure, adding task properties

---

### **recurring.js** - Recurring Tasks Logic ⭐ RECENTLY UPDATED
**Purpose:** Handle all recurring task functionality with Start/Due date integration  
**Key Functions:**
- `showRecurringDialog(itemId)` - Open recurring modal with date validation
- `setItemRecurrence(itemId, pattern)` - Save recurrence pattern
- `removeItemRecurrence(itemId)` - Remove recurrence from task
- `isItemRecurring(item)` - Check if task is recurring
- `getRecurrenceDescription(pattern)` - Get human-readable description
- `getNextOccurrence(item)` - Calculate next occurrence date
- `handleRecurringTaskCompletion(itemId)` - Auto-renew completed recurring tasks
- **NEW: `getTodayString()`** - Get today's date in YYYY-MM-DD format
- **NEW: `getTomorrowString()`** - Get tomorrow's date in YYYY-MM-DD format
- **NEW: `getOneYearFromNowString()`** - Get date 1 year from now

**Dependencies:** items.js, storage.js  
**Depended by:** ui.js, calendar.js, items.js  
**When to modify:** Changing recurring patterns, adding recurrence types

**⚠️ Important:** Must load BEFORE main.js in index.html

**Recent Changes (Nov 30, 2025):**
- Removed separate "Ends" options (endType, endCount, endOn)
- Integrated Start Date = when recurring begins
- Integrated Due Date = when recurring ends
- Added date requirement validation
- Added quick date helper functions
- Added visual date input sections with quick buttons

---

### **calendar.js** - Calendar View ⭐ RECENTLY UPDATED
**Purpose:** Month/week calendar view with drag-drop and recurring support  
**Key Functions:**
- `setupCalendar()` - Initialize calendar
- `renderCalendar(date, mode)` - Render month/week view
- `getTasksByDate()` - Get tasks for specific date
- **UPDATED: `generateRecurringOccurrences(item, viewStart, viewEnd)`** - Generate occurrences using Start/Due date range
- `getNextOccurrenceDate(currentDate, pattern)` - Calculate next date based on pattern
- Drag-drop date assignment

**Dependencies:** items.js, recurring.js  
**Depended by:** main.js  
**When to modify:** Changing calendar appearance, drag-drop behavior

**Recent Changes (Nov 30, 2025):**
- Updated `generateRecurringOccurrences()` to use item.startDate and item.dueDate as the recurring range
- Removed reference to old pattern.endType, pattern.endCount, pattern.endOn
- Now generates occurrences from Start Date to Due Date
- Better console logging for debugging

---

### **categories.js** - Category Management
**Purpose:** Handle categories (Tasks, Shopping List, etc.)  
**Key Functions:**
- `createCategory(name)` - Add new category
- `deleteCategory(id)` - Remove category
- `renameCategory(id, newName)` - Change category name
- Drag-to-reorder categories

**Dependencies:** storage.js  
**Depended by:** ui.js, items.js  
**When to modify:** Category behavior, default categories

---

### **filters.js** - Search & Filtering
**Purpose:** Filter and search tasks  
**Key Functions:**
- Search by text
- Filter by priority
- Filter by date range
- Filter by category

**Dependencies:** items.js  
**Depended by:** ui.js, main.js  
**When to modify:** Adding new filter types

---

### **ical-export.js** - Calendar Export
**Purpose:** Export tasks to .ics file for Google/Apple Calendar  
**Key Functions:**
- `exportToICal()` - Generate .ics file
- Convert tasks to iCalendar format

**Dependencies:** items.js  
**Depended by:** ui.js (export button)  
**When to modify:** Changing export format, adding export options

---

### **shortcuts.js** - Keyboard Shortcuts
**Purpose:** Keyboard navigation and shortcuts  
**Key Functions:**
- `setupShortcuts()` - Register keyboard listeners
- Quick task creation
- Navigation shortcuts

**Dependencies:** items.js, ui.js  
**Depended by:** main.js  
**When to modify:** Adding new shortcuts

---

### **sorting.js** - Task Sorting
**Purpose:** Sort tasks by different criteria  
**Key Functions:**
- Sort by priority
- Sort by date
- Sort by name
- Sort by status

**Dependencies:** None  
**Depended by:** ui.js  
**When to modify:** Adding new sort methods

---

### **storage.js** - Data Persistence
**Purpose:** LocalStorage wrapper and data migration  
**Key Functions:**
- `saveItems()` - Save to localStorage
- `loadItems()` - Load from localStorage
- `migrateItems()` - Handle data structure changes
- Export/Import JSON

**Dependencies:** None  
**Depended by:** All other modules  
**When to modify:** Changing data structure, adding migration for new fields

**⚠️ Important:** When adding new item properties, update `migrateItems()`

**Note:** No changes needed for recurring date integration - existing date fields (startDate, dueDate) are reused

---

### **theme.js** - Themes & Dark Mode
**Purpose:** Color themes and dark mode toggle  
**Key Functions:**
- `toggleDarkMode()` - Switch dark/light
- `setTheme(color)` - Change color theme
- Persist theme preference

**Dependencies:** storage.js  
**Depended by:** main.js  
**When to modify:** Adding new themes, changing theme behavior

---

## 🎨 CSS Files (9 files)

### **theme.css** - Theme Variables & Dark Mode
**Purpose:** CSS variables, dark mode styles  
**Contains:** Color variables, dark mode overrides  
**When to modify:** Adding new color schemes, changing dark mode colors

---

### **layout.css** - Main Layout Structure
**Purpose:** Page layout, responsive grid  
**Contains:** Main containers, flexbox layouts  
**When to modify:** Changing overall page structure

---

### **calendar.css** - Calendar Styles
**Purpose:** Month/week calendar appearance  
**Contains:** Calendar grid, date cells, drag states  
**When to modify:** Calendar visual changes, drag-drop indicators

---

### **categories.css** - Category Styles
**Purpose:** Category sections and headers  
**Contains:** Category cards, drag handles, badges  
**When to modify:** Category appearance, drag-drop styles

---

### **items.css** - Task Item Styles
**Purpose:** Individual task appearance  
**Contains:** Task cards, checkboxes, priority indicators, badges  
**When to modify:** Task visual design, hover effects

---

### **dates.css** - Date Picker Styles
**Purpose:** Date/time picker appearance  
**Contains:** Date input styles, time toggles  
**When to modify:** Date picker visual changes

---

### **modals.css** - Modal Dialog Styles
**Purpose:** All modal dialogs  
**Contains:** Recurring dialog, edit dialogs, confirmations  
**When to modify:** Modal appearance, overlay effects

**Note:** May need updates if recurring modal styling needs enhancement

---

### **progress.css** - Progress Bars
**Purpose:** Subtask progress visualization  
**Contains:** Progress bar styles, percentage indicators  
**When to modify:** Progress bar appearance

---

### **components.css** - Reusable Components
**Purpose:** Shared UI components  
**Contains:** Buttons, badges, icons, utility classes  
**When to modify:** Adding new reusable components

---

## 🌐 HTML File

### **index.html** - Main Entry Point
**Purpose:** Page structure and script loading  
**Contains:**
- Bootstrap CDN links
- All CSS imports (order doesn't matter)
- All JS imports (⚠️ ORDER MATTERS!)
- Modal HTML structures
- Main app container

**Script Load Order (Critical!):**
```html
1. storage.js         (no dependencies)
2. categories.js      (needs storage)
3. items.js          (needs storage)
4. recurring.js      (needs items, storage) ⭐ CRITICAL for recurring
5. calendar.js       (needs items, recurring)
6. filters.js        (needs items)
7. sorting.js        (no dependencies)
8. shortcuts.js      (needs items, ui)
9. theme.js          (needs storage)
10. ical-export.js   (needs items)
11. ui.js            (needs everything)
12. main.js          (needs everything - orchestrator)
```

**When to modify:**
- Adding new JS/CSS files
- Changing script load order (be careful!)
- Adding new modal dialogs

**No changes needed:** Recurring modal is created dynamically in JavaScript

---

## 🔗 Dependency Chain

**Critical Path:**
```
storage.js
    ↓
categories.js + items.js
    ↓
recurring.js ⭐ (MUST come before calendar.js)
    ↓
calendar.js + filters.js + sorting.js + theme.js + ical-export.js
    ↓
ui.js
    ↓
main.js
```

**Rule:** Files lower in chain need files higher up  
**Violation:** Will cause "function not defined" errors

---

## 📄 Most Commonly Modified Files

**By Feature Type:**

| Feature | Primary File | Secondary Files |
|---------|-------------|-----------------|
| Task properties | items.js | ui.js, storage.js |
| Visual appearance | ui.js | items.css |
| Recurring logic | recurring.js | calendar.js |
| Calendar view | calendar.js | calendar.css |
| Date handling | items.js, ui.js | dates.css |
| Export features | ical-export.js | items.js |
| Themes | theme.js | theme.css |
| Shortcuts | shortcuts.js | - |
| Categories | categories.js | categories.css |

---

## 💡 Quick Tips

**Adding new task property:**
1. Update items.js `createItem()` function
2. Update storage.js `migrateItems()` to set default
3. Update ui.js `createItemElement()` to display it
4. Add CSS if needed

**Adding new modal:**
1. Add HTML to index.html (or create dynamically in JS like recurring modal)
2. Add styles to modals.css
3. Add show/hide functions to relevant JS file
4. Update ui.js if needed for button

**Debugging load order issues:**
1. Check browser console for "X is not defined"
2. Check index.html script order
3. Move dependency files higher in load order

**Working with recurring tasks:**
1. Recurring pattern is stored in item.recurrence object
2. Start Date (item.startDate) = when recurring begins
3. Due Date (item.dueDate) = when recurring ends
4. Both dates MUST be set for recurring to work
5. Calendar generates occurrences between Start and Due dates
6. Task completion resets to next occurrence

---

## 🔄 Recurring Task Data Flow

```
User clicks recurring button
    ↓
showRecurringDialog() opens
    ↓
User selects recurrence type
    ↓
Date sections appear with validation warning
    ↓
User sets Start Date (or uses quick buttons)
    ↓
User sets Due Date (or uses quick buttons)
    ↓
User clicks Save
    ↓
Validation checks both dates are set
    ↓
setItemRecurrence() saves pattern
    ↓
setItemStartDateById() & setItemDueDateById() update dates
    ↓
refreshUI() re-renders
    ↓
Calendar shows recurring instances via generateRecurringOccurrences()
    ↓
Task completion triggers handleRecurringTaskCompletion()
    ↓
Task resets to next occurrence (if within date range)
```

---

**Last Updated:** November 30, 2025  
**Total Files:** 22 (12 JS + 9 CSS + 1 HTML)  
**Recent Updates:** recurring.js, calendar.js (Start/Due date integration)
