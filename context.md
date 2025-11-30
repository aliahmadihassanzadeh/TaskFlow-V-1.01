# TaskFlow - Project Context

**Last Updated:** November 30, 2025  
**Version:** 1.1 (Recurring Tasks Complete)

---

## 📋 Project Overview
**TaskFlow** - A feature-rich task management web app with categories, calendar view, and recurring tasks.

**Tech Stack:**
- Vanilla JavaScript (no frameworks)
- Bootstrap 5.3.3
- LocalStorage for persistence
- No backend required

---

## 📁 File Structure (22 files total)

### JavaScript Files (12 files)
```
js/
├── main.js           - Main orchestration, refreshUI()
├── ui.js             - UI rendering, createItemElement()
├── items.js          - Task CRUD operations
├── recurring.js      - Recurring tasks logic ⭐ RECENTLY UPDATED
├── calendar.js       - Calendar view & drag-drop ⭐ RECENTLY UPDATED
├── categories.js     - Category management
├── filters.js        - Search & filtering
├── ical-export.js    - Export to .ics format
├── shortcuts.js      - Keyboard shortcuts
├── sorting.js        - Task sorting logic
├── storage.js        - localStorage wrapper
└── theme.js          - Dark mode & color themes
```

### CSS Files (9 files)
```
css/
├── theme.css         - Theme variables & dark mode
├── layout.css        - Main layout structure
├── calendar.css      - Calendar styles
├── categories.css    - Category styles
├── items.css         - Task item styles
├── dates.css         - Date picker styles
├── modals.css        - Modal dialogs
├── progress.css      - Progress bars
└── components.css    - Reusable components
```

### HTML
```
index.html            - Main entry point
```

---

## ✅ Features Implemented

### Core Features
- ✅ Task categories (drag to reorder)
- ✅ Priority levels (High/Medium/Low)
- ✅ Start & Due dates with optional times
- ✅ Timeline visualization
- ✅ Subtasks with progress tracking
- ✅ Drag items between categories
- ✅ Edit category names
- ✅ Default categories: Tasks & Shopping List

### Advanced Features
- ✅ Calendar view (month/week toggle)
- ✅ Drag tasks to calendar to set dates
- ✅ Dark mode & 4 color themes
- ✅ Keyboard shortcuts
- ✅ Export/Import JSON
- ✅ Search & filters
- ✅ iCalendar export (.ics)

### Recurring Tasks (Complete Implementation) ⭐
- ✅ Daily, Weekly, Monthly, Yearly patterns
- ✅ Custom intervals (every X days/weeks/months)
- ✅ Weekly day selection (Mon, Tue, Wed...)
- ✅ **Start Date = When recurring begins**
- ✅ **Due Date = When recurring ends**
- ✅ **Quick date options (Today, Tomorrow, Open-Ended)**
- ✅ **Date validation with clear warnings**
- ✅ **Auto-renewal on task completion**
- ✅ **Calendar shows all recurring instances within range**

---

## 🎯 Current Status

### Recently Completed (Nov 30, 2025):
**Recurring Tasks - Start/Due Date Integration**

**Completed Features:**
1. ✅ Removed separate "Ends" options from recurring dialog
2. ✅ Integrated Start Date = recurring start time
3. ✅ Integrated Due Date = recurring end time
4. ✅ Added date requirement validation
5. ✅ Quick date buttons:
   - Start Date: "Today" and "Tomorrow"
   - Due Date: "Open-Ended (1 year)" and "Custom Date"
6. ✅ Clear warning when dates are missing
7. ✅ Updated calendar to use Start/Due date range for occurrences
8. ✅ Task completion renews to next occurrence within date range

**How It Works:**
- Click recurring button on any task
- Select recurrence type (Daily, Weekly, Monthly, Yearly, Custom)
- System prompts for Start Date (when recurring begins)
- System prompts for Due Date (when recurring ends)
- Quick buttons available for common date scenarios
- Validation ensures both dates are set before saving
- Calendar displays all future occurrences within the date range
- When task is completed, it resets to next occurrence date
- Recurring stops when Due Date is reached

---

## 🔑 Key Functions Reference

### Main Entry Points
- `refreshUI()` - Main.js - Refreshes entire UI, preserves state
- `createItemElement(item)` - UI.js - Creates task HTML element
- `showRecurringDialog(itemId)` - Recurring.js - Opens recurring modal
- `getTasksByDate(date)` - Calendar.js - Gets tasks for specific date

### Data Operations
- `createItem(categoryId, name)` - Items.js - Creates new task
- `saveItems()` - Storage.js - Persists to localStorage
- `setItemRecurrence(itemId, pattern)` - Recurring.js - Set recurring pattern
- `generateRecurringOccurrences()` - Calendar.js - Generate future instances

### Calendar
- `renderCalendar(date, mode)` - Calendar.js - Renders month/week view
- `setupCalendar()` - Calendar.js - Initialize calendar listeners

### Recurring Task Helpers
- `getTodayString()` - Recurring.js - Get today's date in YYYY-MM-DD
- `getTomorrowString()` - Recurring.js - Get tomorrow's date
- `getOneYearFromNowString()` - Recurring.js - Get date 1 year from now
- `handleRecurringTaskCompletion()` - Recurring.js - Auto-renew on completion

---

## 🎯 Next Features Planned

### Future Enhancements
- [ ] Deploy to GitHub Pages (make it live online)
- [ ] Browser notifications for due tasks
- [ ] Tags/Labels system
- [ ] Templates for common tasks
- [ ] Print view
- [ ] Archive completed tasks
- [ ] Recurring task exceptions (skip specific dates)
- [ ] Recurring task history log

---

## 💡 Usage Notes

### ⚠️ CRITICAL WORKFLOW RULES (Always Follow!)

**When working with Claude on this project:**

1. **📄 ALWAYS auto-update documentation files** ⭐ MOST IMPORTANT
   - At the END of EVERY conversation, automatically update these files:
     - ✅ **context.md** - Update current status, recently completed, update log
     - ✅ **QUICK_START.md** - Add new example if relevant
     - ✅ **FILE_MANIFEST.md** - Update if files changed or new files added
   - Do this AUTOMATICALLY without being asked
   - Include completed features, modifications, bug fixes, anything useful for future
   - Create artifacts for updated documentation files
   - User will download and use for next conversation

2. **✅ ALWAYS create artifacts for each file**
   - Every file modification must be delivered as a complete artifact
   - Each artifact contains the FULL file, ready to copy/paste
   - Never just code snippets or partial updates

3. **✅ ALWAYS deliver complete updated files**
   - When adding features or modifications, update the ENTIRE file
   - Deliver it as a ready-to-use artifact
   - User should never need to manually merge code

4. **❌ NEVER give code snippets to manually add**
   - Don't say "add this function to your file"
   - Don't say "replace lines 50-60 with..."
   - Don't give partial code blocks to copy
   - ALWAYS provide the complete updated file

**Why these rules exist:**
- Prevents merge errors
- Saves time (no manual editing)
- Ensures consistency
- Professional workflow
- Documentation stays current automatically

---

### Starting New Conversation
**What to upload:**
1. ✅ **context.md** file (ONLY this one - it contains everything Claude needs!)
2. Only the 2-3 files you're modifying
3. Brief message about what you're working on

**DON'T upload:**
❌ QUICK_START.md (this is YOUR cheat sheet, not for Claude)
❌ FILE_MANIFEST.md (this is YOUR reference guide, not for Claude)

**Example:**
```
"Working on TaskFlow recurring feature. 
Modifying recurring.js and calendar.js.
Context file attached."
```

**Don't forget to mention:**
"Follow the workflow rules in context.md - create artifacts for each file with complete updates."

---

### Ending a Conversation
**Before finishing, Claude will automatically:**
1. 📄 Update **context.md** with:
   - Completed features moved to "Recently Completed"
   - New row in "Update Log"
   - Updated "Current Status"
   - Any new known issues
   - Updated "Last Updated" date

2. 📄 Update **QUICK_START.md** if:
   - New example conversation would be helpful
   - New common task pattern emerged

3. 📄 Update **FILE_MANIFEST.md** if:
   - New files were added
   - File purposes changed
   - Dependencies changed
   - New functions added

4. ✅ Deliver all updated documentation as artifacts

**You should:**
- Download all updated documentation artifacts
- Replace your local copies
- Use updated context.md in next conversation

### Common Tasks
- **Adding new feature:** Upload context.md + relevant files → Get complete artifact files
- **Bug fixing:** Upload context.md + buggy file + related file → Get fixed complete files
- **Testing:** Upload context.md, mention what to test → Get tested complete files
- **Refactoring:** Upload context.md + files to refactor → Get refactored complete files

---

## 📝 Update Log

| Date | Change | Files Modified |
|------|--------|----------------|
| Nov 30, 2025 | Completed Start/Due date integration with recurring | recurring.js, calendar.js |
| Nov 27, 2025 | Fixed recurring tasks in calendar | calendar.js, recurring.js, storage.js |
| Nov 27, 2025 | Added recurring tasks feature | recurring.js, ui.js, index.html |
| Nov 26, 2025 | Added iCalendar export | ical-export.js |
| Nov 25, 2025 | Implemented calendar view | calendar.js, calendar.css |

---

## 🚨 Known Issues

### Active Issues
- None currently

### Resolved Issues
- ✅ Recurring dates using separate end conditions (fixed Nov 30 - now uses Due Date)
- ✅ Recurring tasks not showing in calendar (fixed Nov 27)
- ✅ Recurrence data lost on refresh (fixed Nov 27)

---

## 🔧 Project-Specific Conventions

### Code Style
- **No frameworks:** Pure vanilla JavaScript
- **No build tools:** Direct browser execution
- **Global functions:** Most functions are global (no modules)
- **Bootstrap classes:** Use Bootstrap 5.3.3 utilities
- **LocalStorage:** All data persists in browser localStorage

### File Organization
- **One feature per file:** Each JS file handles one main concern
- **CSS separation:** Each CSS file matches a feature area
- **No imports:** Scripts loaded in order via index.html
- **Script order matters:** Check index.html for correct sequence

### Naming Conventions
- **Functions:** camelCase (e.g., `createItem`, `refreshUI`)
- **Constants:** UPPER_SNAKE_CASE (e.g., `RECURRENCE_TYPES`)
- **CSS classes:** kebab-case (e.g., `item-container`, `recurring-badge`)
- **Data attributes:** data-* (e.g., `data-id`, `data-category`)

### Data Structure
```javascript
// Example item structure
{
  id: "unique-id",
  name: "Task name",
  category: "category-id",
  priority: "high"|"medium"|"low",
  startDate: "2025-11-27T10:00",  // ISO string or null - When recurring begins
  dueDate: "2025-12-01T17:00",    // ISO string or null - When recurring ends
  done: false,
  subtasks: [],
  notes: "",
  recurrence: {
    type: "daily"|"weekly"|"monthly"|"yearly"|"custom",
    interval: 1,  // For custom type
    weekDays: [0,1,2,3,4,5,6],  // For weekly
    unit: "days"|"weeks"|"months"|"years"  // For custom type
    // NOTE: No longer has endType, endCount, endDate - uses item's dueDate instead
  }
}
```

---

## 🛠 Troubleshooting Guide

### Common Issues & Solutions

**Issue: Changes not appearing**
- ✅ Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- ✅ Clear browser cache
- ✅ Check browser console for errors (F12)

**Issue: localStorage data lost**
- ✅ Check if browser cleared data
- ✅ Export JSON backup regularly
- ✅ localStorage has ~5-10MB limit

**Issue: Recurring tasks not showing**
- ✅ Check console logs for "Has recurrence?"
- ✅ Verify item has both startDate and dueDate set
- ✅ Ensure recurrence object is properly saved
- ✅ Hard refresh after updating files

**Issue: Recurring validation failing**
- ✅ Both Start Date AND Due Date must be set
- ✅ Start Date must be before or equal to Due Date
- ✅ Use quick date buttons for easy setup

**Issue: Script load order problems**
- ✅ Check index.html script order
- ✅ Ensure recurring.js loads before main.js
- ✅ Dependencies must load before dependents

**Issue: Dates showing wrong timezone**
- ✅ All dates stored as ISO strings
- ✅ Use `new Date().toISOString()` for saving
- ✅ Parse with `new Date(isoString)` for display

---

## 📚 Additional Resources

### When to Create New Conversation
**Start fresh when:**
- ✅ Current conversation feels slow/heavy
- ✅ Token usage > 150,000
- ✅ Moving to completely different feature
- ✅ Claude starts forgetting earlier context

**Stay in current conversation when:**
- ✅ Working on related files
- ✅ Debugging recent changes
- ✅ Making small tweaks to same feature
- ✅ Token usage < 100,000

### Backup Strategy
**Essential backups:**
1. **context.md** - Update after each session
2. **All working files** - Keep in local folder
3. **localStorage export** - Weekly JSON export
4. **Git commits** - If using version control (recommended)

### Testing Checklist
Before considering a feature "complete":
- [ ] Hard refresh and test in browser
- [ ] Check browser console for errors
- [ ] Test with existing data
- [ ] Test with fresh data (localStorage.clear())
- [ ] Test edge cases (empty inputs, long text, etc.)
- [ ] Test on different screen sizes
- [ ] Update context.md with completion notes

### Recurring Tasks Testing Checklist
- [ ] Create task without dates - should show warning
- [ ] Create task with only start date - should show warning
- [ ] Create task with only due date - should show warning
- [ ] Create task with both dates - should work
- [ ] Verify start date before due date validation
- [ ] Test "Today" quick button
- [ ] Test "Tomorrow" quick button
- [ ] Test "Open-Ended (1 year)" quick button
- [ ] Test daily recurrence appears in calendar
- [ ] Test weekly recurrence with specific days
- [ ] Test monthly recurrence
- [ ] Complete recurring task - should reset to next date
- [ ] Complete recurring task past due date - should stop recurring

---

**END OF CONTEXT**
