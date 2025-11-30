// theme.js
// Accent colour + night mode handling

function applyAccent(accent) {
    document.body.dataset.accent = accent;
}

function applyNightMode(on) {
    if (on) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
}

function loadThemeFromStorage() {
    const savedAccent = localStorage.getItem('accent') || 'orange';
    const savedNight = localStorage.getItem('nightMode') === 'true';

    applyAccent(savedAccent);
    applyNightMode(savedNight);

    const accentSelect = document.getElementById('accentSelect');
    const nightToggle = document.getElementById('nightToggle');

    if (accentSelect) accentSelect.value = savedAccent;
    if (nightToggle) nightToggle.checked = savedNight;
}

function setupThemeControls() {
    const accentSelect = document.getElementById('accentSelect');
    const nightToggle = document.getElementById('nightToggle');

    if (accentSelect) {
        accentSelect.addEventListener('change', () => {
            const value = accentSelect.value;
            applyAccent(value);
            localStorage.setItem('accent', value);
        });
    }

    if (nightToggle) {
        nightToggle.addEventListener('change', () => {
            const on = nightToggle.checked;
            applyNightMode(on);
            localStorage.setItem('nightMode', String(on));
        });
    }
}

// Format date for display
function formatDateForDisplay(dateStr) {
    if (!dateStr) return '';
    
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const itemDate = new Date(dateStr);
    itemDate.setHours(0, 0, 0, 0);
    
    const diffTime = itemDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Check if time is included
    const hasTime = dateStr.includes('T');
    let timeStr = '';
    
    if (hasTime) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        timeStr = ` ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    
    if (diffDays === 0) return 'Today' + timeStr;
    if (diffDays === 1) return 'Tomorrow' + timeStr;
    if (diffDays === -1) return 'Yesterday' + timeStr;
    if (diffDays > 0 && diffDays < 7) return `in ${diffDays}d` + timeStr;
    if (diffDays < 0 && diffDays > -7) return `${Math.abs(diffDays)}d ago` + timeStr;
    
    const dateOnlyStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return dateOnlyStr + timeStr;
}