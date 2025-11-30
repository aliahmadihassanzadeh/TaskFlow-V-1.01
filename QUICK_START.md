# TaskFlow - Quick Start Template

Use this when starting a **NEW conversation** with Claude!

---

## 📋 Copy-Paste Template

```
I'm working on TaskFlow - a task management web app.

WORKFLOW RULES (from context.md):
✅ Create artifacts for each file
✅ Deliver complete updated files (never code snippets)
✅ Auto-update documentation at end of conversation

CURRENT WORK:
[Describe what you're working on]

FILES ATTACHED:
- context.md (project overview) ← ONLY DOC FILE TO UPLOAD
- [file1.js] (file being modified)
- [file2.js] (related file for context)

WHAT I NEED:
[Describe the feature/fix you want]
```

**Note:** QUICK_START.md and FILE_MANIFEST.md are YOUR reference files - don't upload them to Claude!

---

## 📂 What to Attach

### Always Include:
1. ✅ **context.md** - Project overview (ONLY documentation file needed)

### Never Include:
❌ QUICK_START.md - This is YOUR cheat sheet
❌ FILE_MANIFEST.md - This is YOUR reference guide

### Include Based on Work:

**Adding new feature:**
- The file where feature will be added
- 1-2 related files for context
- Example: Adding export → upload `export.js`, `ui.js`, `context.md`

**Fixing bug:**
- The buggy file
- Related file that might be affected
- Example: Calendar bug → upload `calendar.js`, `ui.js`, `context.md`

**Modifying existing feature:**
- The main file with the feature
- Files that call this feature
- Example: Update recurring → upload `recurring.js`, `calendar.js`, `ui.js`, `context.md`

**Major refactoring:**
- All affected files (up to 5-6 max)
- Example: Restructure data → upload `items.js`, `storage.js`, `ui.js`, `main.js`, `context.md`

---

## ✅ Checklist Before New Conversation

- [ ] Updated context.md with latest changes
- [ ] Saved all artifacts from previous conversation to local files
- [ ] Identified which 2-3 files need modification
- [ ] Have clear goal for this session
- [ ] Backed up working version (optional but recommended)

---

## 🎯 Example Conversation Starters

### Example 1: New Feature
```
Working on TaskFlow - adding tag system to tasks.

WORKFLOW: Follow rules in context.md (artifacts, complete files, no snippets)

FILES: context.md, items.js, ui.js

GOAL: Add ability to tag tasks with custom labels (e.g., #urgent, #work)
```

### Example 2: Bug Fix
```
Working on TaskFlow - fixing calendar drag-drop issue.

WORKFLOW: Follow rules in context.md (artifacts, complete files, no snippets)

FILES: context.md, calendar.js, ui.js

ISSUE: When dragging task to calendar, date doesn't update properly
```

### Example 3: Enhancement
```
Working on TaskFlow - improving recurring task UI.

WORKFLOW: Follow rules in context.md (artifacts, complete files, no snippets)

FILES: context.md, recurring.js, ui.js

GOAL: Add visual indicator showing next occurrence date
```

### Example 4: Recurring Tasks Integration ⭐ NEW
```
Working on TaskFlow - integrating Start/Due dates with recurring tasks.

WORKFLOW: Follow rules in context.md (artifacts, complete files, no snippets)

FILES: context.md, recurring.js, calendar.js

GOAL: Use Start Date as recurring start, Due Date as recurring end.
Remove separate "Ends" options. Add validation for required dates.
```

---

## 💡 Pro Tips

### Keep Conversations Focused
- ✅ One main feature per conversation
- ✅ Related bug fixes can be in same chat
- ✅ Don't mix unrelated features

### Efficient File Sharing
- ✅ Only upload files being modified
- ✅ Context.md gives Claude the full picture
- ✅ Don't upload all 22 files every time!

### Save Your Work
- ✅ Copy artifacts immediately after creation
- ✅ Replace local files right away
- ✅ Update context.md at end of session

### When Stuck
- ✅ Share browser console errors
- ✅ Describe exact steps to reproduce
- ✅ Mention what you already tried

---

## 🔄 Recurring Tasks - Common Scenarios

### Scenario 1: Creating Daily Task
```
User: I want a task that repeats every day for the next month.

Files to modify: recurring.js (if changing logic), none if just using
Action: 
1. Create task
2. Click recurring button
3. Select "Daily"
4. Click "Today" for Start Date
5. Set Due Date to 1 month from now (or use custom date)
6. Save
```

### Scenario 2: Weekly Meeting
```
User: Create recurring task for weekly team meeting every Monday.

Action:
1. Create task "Team Meeting"
2. Click recurring button
3. Select "Weekly"
4. Check "Mon" checkbox
5. Set Start Date (when meetings begin)
6. Set Due Date (when meetings end, or use "Open-Ended")
7. Save
```

### Scenario 3: Monthly Bill
```
User: Remind me to pay rent on 1st of each month.

Action:
1. Create task "Pay Rent"
2. Click recurring button
3. Select "Monthly"
4. Set Start Date to next 1st of month
5. Set Due Date to "Open-Ended (1 year)"
6. Save
```

### Scenario 4: Validation Error
```
User tries to enable recurring without dates.

System shows warning:
"⚠️ Both Start Date and Due Date are required to enable recurring!
📅 Start Date = When the recurring pattern begins
🏁 Due Date = When the recurring pattern ends
Please set both dates and try again."
```

---

## 🐛 Common Issues & Solutions

### Issue: "Recurring button does nothing"
**Solution:**
- Check browser console (F12) for JavaScript errors
- Verify recurring.js is loaded before main.js in index.html
- Hard refresh (Ctrl+Shift+R)

### Issue: "Can't save recurring - validation error"
**Solution:**
- Both Start Date AND Due Date must be set
- Click the quick date buttons if you need help
- Start Date must be before or equal to Due Date

### Issue: "Recurring instances not showing in calendar"
**Solution:**
- Check that both startDate and dueDate are set on the task
- Open browser console and look for "Generating recurring instances" logs
- Verify recurrence object exists on the item
- Hard refresh calendar view

### Issue: "Task doesn't renew after completion"
**Solution:**
- Check that task has recurrence set
- Verify startDate and dueDate exist
- Check console for "Recurring ended - reached due date" message
- Make sure next occurrence is within the due date range

---

**Save this file in your TaskFlow folder for quick reference!**
