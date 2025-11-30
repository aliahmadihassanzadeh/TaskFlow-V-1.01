# TaskFlow - Documentation System Visual Guide

## 📁 Your Documentation Files

```
TaskFlow/
├── context.md          ⭐ UPLOAD TO CLAUDE
├── QUICK_START.md      📖 YOUR CHEAT SHEET
├── FILE_MANIFEST.md    📖 YOUR REFERENCE
└── current/
    ├── js/
    ├── css/
    └── index.html
```

---

## 🔄 Complete Workflow

### Step 1: Starting New Conversation

```
YOU:
1. Open QUICK_START.md (read for reference)
2. Copy the template
3. Upload to Claude:
   ✅ context.md
   ✅ 2-3 files you're modifying
   ❌ Don't upload QUICK_START.md
   ❌ Don't upload FILE_MANIFEST.md

CLAUDE:
1. Reads context.md
2. Sees workflow rules
3. Ready to work!
```

---

### Step 2: During Development

```
YOU:
- Describe what you need
- Share screenshots if debugging
- Ask questions

CLAUDE:
- Creates artifacts for COMPLETE files
- Never gives code snippets
- Delivers full updated files
- You download and replace local files
```

---

### Step 3: End of Conversation

```
CLAUDE (AUTOMATICALLY):
1. 🔄 Updates context.md:
   - Moves completed work to "Recently Completed"
   - Adds to "Update Log"
   - Updates "Current Status"
   - Changes "Last Updated" date

2. 🔄 Updates QUICK_START.md (if needed):
   - Adds new example patterns

3. 🔄 Updates FILE_MANIFEST.md (if needed):
   - Updates file purposes
   - Updates dependencies

4. ✅ Delivers ALL documentation as artifacts

YOU:
1. Download all documentation artifacts
2. Replace your local copies:
   - context.md ← Use in NEXT conversation
   - QUICK_START.md ← Your reference
   - FILE_MANIFEST.md ← Your reference
3. Done! Ready for next session.
```

---

## 🎯 Key Points

### What Gets Uploaded to Claude:
```
✅ context.md           (Always!)
✅ recurring.js         (If modifying)
✅ calendar.js          (If related)
✅ ui.js               (If related)

❌ QUICK_START.md      (YOUR cheat sheet)
❌ FILE_MANIFEST.md    (YOUR reference)
❌ All 22 project files (Too much!)
```

### What Claude Does Automatically:
```
✅ Creates artifacts for ALL modified files
✅ Delivers COMPLETE files (not snippets)
✅ Updates documentation at end
✅ Reminds you to download updated docs
```

### What You Do:
```
✅ Upload context.md to each new conversation
✅ Download artifacts immediately
✅ Replace local files with artifacts
✅ Keep QUICK_START.md and FILE_MANIFEST.md locally for reference
```

---

## 💡 Example Session

### Conversation Start:
```
YOU:
"Working on TaskFlow - adding task templates feature.
Context.md attached.
Also attaching: items.js, ui.js, storage.js"

[Upload: context.md, items.js, ui.js, storage.js]
```

### During Work:
```
CLAUDE creates artifacts:
- items.js (complete updated file) ✅
- ui.js (complete updated file) ✅
- storage.js (complete updated file) ✅

YOU download and replace local files immediately
```

### Conversation End:
```
CLAUDE automatically creates:
- context.md (updated with completed feature) ✅
- QUICK_START.md (updated if needed) ✅
- FILE_MANIFEST.md (updated if needed) ✅

YOU:
1. Download all three
2. Replace local copies
3. Next conversation: Upload updated context.md
```

---

## 🎨 Visual: File Flow

```
┌─────────────────────────────────────────────────┐
│  NEW CONVERSATION                               │
│                                                 │
│  YOU Upload:                                    │
│  ✅ context.md                                  │
│  ✅ recurring.js                                │
│  ✅ calendar.js                                 │
│                                                 │
│  ❌ QUICK_START.md (keep local)                 │
│  ❌ FILE_MANIFEST.md (keep local)               │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  CLAUDE WORKS                                   │
│                                                 │
│  Creates artifacts:                             │
│  📄 recurring.js (COMPLETE file)                │
│  📄 calendar.js (COMPLETE file)                 │
│  📄 ui.js (COMPLETE file)                       │
│                                                 │
│  YOU: Download immediately ↓                    │
│  Save to: TaskFlow/current/js/                  │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  END OF CONVERSATION (AUTOMATIC)                │
│                                                 │
│  Claude creates:                                │
│  📄 context.md (updated)                        │
│  📄 QUICK_START.md (updated if needed)          │
│  📄 FILE_MANIFEST.md (updated if needed)        │
│                                                 │
│  YOU: Download all three ↓                      │
│  Replace in: TaskFlow/                          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│  NEXT CONVERSATION                              │
│                                                 │
│  Upload: Updated context.md                     │
│  Reference: QUICK_START.md (local)              │
│  Reference: FILE_MANIFEST.md (local)            │
└─────────────────────────────────────────────────┘
```

---

## ✅ Checklist

### Before Starting New Conversation:
- [ ] Have updated context.md ready
- [ ] Identified which 2-3 files to modify
- [ ] Read QUICK_START.md for template
- [ ] Clear goal in mind

### During Conversation:
- [ ] Download artifacts as Claude creates them
- [ ] Replace local files immediately
- [ ] Test changes

### End of Conversation:
- [ ] Claude auto-updates documentation (wait for it!)
- [ ] Download updated context.md
- [ ] Download updated QUICK_START.md (if provided)
- [ ] Download updated FILE_MANIFEST.md (if provided)
- [ ] Replace all local documentation files

### Ready for Next Session:
- [ ] Have updated context.md
- [ ] All code files are current
- [ ] Documentation is current
- [ ] Ready to start fresh!

---

**Save this as README.md in your TaskFlow folder for easy reference!**
