// sorting.js
// Sort helpers

function sortItems(list, mode) {
    const arr = [...list];

    if (mode === 'az') {
        arr.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));
    } else if (mode === 'za') {
        arr.sort((a, b) => b.text.localeCompare(a.text, undefined, { sensitivity: 'base' }));
    } else if (mode === 'priority') {
        // Sort by priority: high > medium > low > none, then alphabetically
        const priorityOrder = { 'high': 0, 'medium': 1, 'low': 2, 'none': 3 };
        arr.sort((a, b) => {
            const aPriority = a.priority || 'none';
            const bPriority = b.priority || 'none';
            const priorityDiff = priorityOrder[aPriority] - priorityOrder[bPriority];
            
            if (priorityDiff !== 0) {
                return priorityDiff;
            }
            // If same priority, sort alphabetically
            return a.text.localeCompare(b.text, undefined, { sensitivity: 'base' });
        });
    } else if (mode === 'donefirst') {
        arr.sort((a, b) => {
            if (a.done === b.done) {
                return a.text.localeCompare(b.text, undefined, { sensitivity: 'base' });
            }
            return a.done ? -1 : 1;
        });
    }

    return arr;
}