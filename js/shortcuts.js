// shortcuts.js
// Keyboard shortcut handlers

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Don't trigger shortcuts when typing in inputs
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            // Allow Escape to blur/close
            if (e.key === 'Escape') {
                e.target.blur();
            }
            return;
        }

        const key = e.key.toLowerCase();

        // Prevent default for our shortcuts
        const shortcutKeys = ['n', '/', 'f', '1', '2', '3', '0', 'a', 'd', 's', '?'];
        if (shortcutKeys.includes(key)) {
            e.preventDefault();
        }

        switch (key) {
            case 'n':
                // Focus new item input
                document.getElementById('itemInput')?.focus();
                break;

            case '/':
                // Focus search
                document.getElementById('searchBox')?.focus();
                break;

            case 'f':
                // Toggle flat list
                const flatToggle = document.getElementById('flatToggle');
                if (flatToggle) {
                    flatToggle.checked = !flatToggle.checked;
                    flatToggle.dispatchEvent(new Event('change'));
                }
                break;

            case '1':
                // Filter high priority
                setPriorityFilter('high');
                break;

            case '2':
                // Filter medium priority
                setPriorityFilter('medium');
                break;

            case '3':
                // Filter low priority
                setPriorityFilter('low');
                break;

            case '0':
                // Clear priority filter
                setPriorityFilter('all');
                break;

            case 'a':
                // Show all items
                setStatusFilter('all');
                break;

            case 'd':
                // Show done items
                setStatusFilter('done');
                break;

            case 's':
                // Toggle starred only
                const favOnly = document.getElementById('favOnly');
                if (favOnly) {
                    favOnly.checked = !favOnly.checked;
                    favOnly.dispatchEvent(new Event('change'));
                }
                break;

            case '?':
                // Show shortcuts modal
                toggleShortcutsModal();
                break;

            case 'escape':
                // Close modals
                closeShortcutsModal();
                break;
        }
    });
}

function setPriorityFilter(value) {
    const priorityFilter = document.getElementById('priorityFilter');
    if (priorityFilter) {
        priorityFilter.value = value;
        priorityFilter.dispatchEvent(new Event('change'));
    }
}

function setStatusFilter(value) {
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.value = value;
        statusFilter.dispatchEvent(new Event('change'));
    }
}

function toggleShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) {
        modal.classList.toggle('d-none');
    }
}

function closeShortcutsModal() {
    const modal = document.getElementById('shortcutsModal');
    if (modal) {
        modal.classList.add('d-none');
    }
}

function setupShortcutsModal() {
    const helpBtn = document.getElementById('helpBtn');
    const closeBtn = document.getElementById('closeShortcuts');
    const overlay = document.querySelector('.shortcuts-overlay');

    if (helpBtn) {
        helpBtn.addEventListener('click', toggleShortcutsModal);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', closeShortcutsModal);
    }

    if (overlay) {
        overlay.addEventListener('click', closeShortcutsModal);
    }
}