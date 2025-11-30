// dialogs.js
// Dialog functions for alarm, address, and URL

// Show alarm configuration dialog
function showAlarmDialog(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
    // Check if item has dates
    const hasStartDate = item.startDate && item.startDate.trim();
    const hasDueDate = item.dueDate && item.dueDate.trim();
    
    // If no dates at all, show warning and return
    if (!hasStartDate && !hasDueDate) {
        alert('⚠️ Please set a Start Date or Due Date first!\n\nAlarms require a date to be set.\n\n📅 You can add dates by:\n• Clicking the flag (📍) or calendar (📅) icons on the task\n• Or go to Calendar view and click "Add Tasks" button');
        return;
    }
    
    const currentAlarm = item.alarm || {};
    
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
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        color: var(--text);
    `;
    
    // Build alarm type options based on available dates
    let alarmOptions = '<option value="">No alarm</option>';
    
    if (hasStartDate) {
        alarmOptions += '<option value="before-start">Before start time</option>';
    }
    
    if (hasDueDate) {
        alarmOptions += '<option value="before-due">Before due time</option>';
    }
    
    alarmOptions += '<option value="custom">Custom time</option>';
    
    content.innerHTML = `
        <h3 style="margin-top: 0; color: var(--text);">
            <i class="bi bi-alarm"></i> Set Alarm
        </h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Alarm Type:</label>
            <select id="alarmType" class="form-control" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                ${alarmOptions}
            </select>
        </div>
        
        <div id="minutesSection" style="display: none; margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Minutes before:</label>
            <select id="alarmMinutes" class="form-control" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                <option value="5">5 minutes</option>
                <option value="10">10 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="120">2 hours</option>
                <option value="1440">1 day</option>
            </select>
        </div>
        
        <div id="customTimeSection" style="display: none; margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Custom date & time:</label>
            <input type="datetime-local" id="customTime" class="form-control" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
        </div>
        
        <div style="padding: 12px; background: var(--item-bg); border-radius: 8px; margin-bottom: 16px;">
            <small style="color: var(--text); opacity: 0.8;">
                <i class="bi bi-info-circle"></i> Note: Alarms will show browser notifications when the time comes (if notifications are enabled).
            </small>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button id="cancelAlarm" class="btn btn-secondary" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">Cancel</button>
            <button id="saveAlarm" class="btn btn-primary" style="background: var(--accent); color: white; border: none;">Save</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const alarmType = content.querySelector('#alarmType');
    const minutesSection = content.querySelector('#minutesSection');
    const customTimeSection = content.querySelector('#customTimeSection');
    const alarmMinutes = content.querySelector('#alarmMinutes');
    const customTime = content.querySelector('#customTime');
    
    // Load current alarm settings
    if (currentAlarm.type) {
        alarmType.value = currentAlarm.type;
        if (currentAlarm.type === 'before-start' || currentAlarm.type === 'before-due') {
            minutesSection.style.display = 'block';
            alarmMinutes.value = currentAlarm.minutes || 15;
        } else if (currentAlarm.type === 'custom') {
            customTimeSection.style.display = 'block';
            if (currentAlarm.customTime) {
                customTime.value = currentAlarm.customTime.slice(0, 16); // Format for datetime-local
            }
        }
    }
    
    // Handle alarm type change
    alarmType.addEventListener('change', () => {
        const type = alarmType.value;
        minutesSection.style.display = (type === 'before-start' || type === 'before-due') ? 'block' : 'none';
        customTimeSection.style.display = type === 'custom' ? 'block' : 'none';
    });
    
    // Cancel button
    content.querySelector('#cancelAlarm').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Save button
    content.querySelector('#saveAlarm').addEventListener('click', () => {
        const type = alarmType.value;
        
        if (!type) {
            // Remove alarm
            removeItemAlarm(itemId);
        } else {
            const alarmConfig = { type };
            
            if (type === 'before-start' || type === 'before-due') {
                alarmConfig.minutes = parseInt(alarmMinutes.value);
            } else if (type === 'custom') {
                if (!customTime.value) {
                    alert('Please select a custom time');
                    return;
                }
                alarmConfig.customTime = customTime.value + ':00'; // Add seconds
            }
            
            setItemAlarm(itemId, alarmConfig);
        }
        
        saveItemsToStorage();
        document.body.removeChild(modal);
        refreshUI();
    });
    
    // Click overlay to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

// Show address dialog
function showAddressDialog(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
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
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        color: var(--text);
    `;
    
    content.innerHTML = `
        <h3 style="margin-top: 0; color: var(--text);">
            <i class="bi bi-geo-alt"></i> Set Address
        </h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">Address:</label>
            <textarea id="addressInput" class="form-control" rows="3" placeholder="Enter address..." style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">${item.address || ''}</textarea>
        </div>
        
        <div style="padding: 12px; background: var(--item-bg); border-radius: 8px; margin-bottom: 16px;">
            <small style="color: var(--text); opacity: 0.8;">
                <i class="bi bi-info-circle"></i> Tip: Click "Open in Maps" to view in Google Maps
            </small>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: space-between;">
            <button id="openMaps" class="btn btn-info" style="background: #17a2b8; color: white; border: none;">
                <i class="bi bi-map"></i> Open in Maps
            </button>
            <div style="display: flex; gap: 8px;">
                <button id="removeAddress" class="btn btn-danger" style="background: #dc3545; color: white; border: none;">
                    Remove
                </button>
                <button id="cancelAddress" class="btn btn-secondary" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                    Cancel
                </button>
                <button id="saveAddress" class="btn btn-primary" style="background: var(--accent); color: white; border: none;">
                    Save
                </button>
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const addressInput = content.querySelector('#addressInput');
    const openMapsBtn = content.querySelector('#openMaps');
    const removeBtn = content.querySelector('#removeAddress');
    
    // Open in Maps button
    openMapsBtn.addEventListener('click', () => {
        const address = addressInput.value.trim();
        if (address) {
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(mapsUrl, '_blank');
        } else {
            alert('Please enter an address first');
        }
    });
    
    // Remove button
    removeBtn.addEventListener('click', () => {
        if (confirm('Remove address from this task?')) {
            setItemAddress(itemId, null);
            saveItemsToStorage();
            document.body.removeChild(modal);
            refreshUI();
        }
    });
    
    // Cancel button
    content.querySelector('#cancelAddress').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Save button
    content.querySelector('#saveAddress').addEventListener('click', () => {
        const address = addressInput.value.trim();
        setItemAddress(itemId, address || null);
        saveItemsToStorage();
        document.body.removeChild(modal);
        refreshUI();
    });
    
    // Click overlay to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Focus input
    addressInput.focus();
}

// Show URL dialog
function showUrlDialog(itemId) {
    const item = items.find(it => it.id === itemId);
    if (!item) return;
    
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
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        color: var(--text);
    `;
    
    content.innerHTML = `
        <h3 style="margin-top: 0; color: var(--text);">
            <i class="bi bi-link-45deg"></i> Set URL
        </h3>
        
        <div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 8px; font-weight: 600;">URL:</label>
            <input type="url" id="urlInput" class="form-control" placeholder="https://example.com" value="${item.url || ''}" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
        </div>
        
        <div style="padding: 12px; background: var(--item-bg); border-radius: 8px; margin-bottom: 16px;">
            <small style="color: var(--text); opacity: 0.8;">
                <i class="bi bi-info-circle"></i> Tip: Left-click the URL button to open link. Right-click to edit.
            </small>
        </div>
        
        <div style="display: flex; gap: 8px; justify-content: space-between;">
            <button id="openUrl" class="btn btn-info" style="background: #17a2b8; color: white; border: none;">
                <i class="bi bi-box-arrow-up-right"></i> Open Link
            </button>
            <div style="display: flex; gap: 8px;">
                <button id="removeUrl" class="btn btn-danger" style="background: #dc3545; color: white; border: none;">
                    Remove
                </button>
                <button id="cancelUrl" class="btn btn-secondary" style="background: var(--item-bg); color: var(--text); border: 1px solid var(--border);">
                    Cancel
                </button>
                <button id="saveUrl" class="btn btn-primary" style="background: var(--accent); color: white; border: none;">
                    Save
                </button>
            </div>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const urlInput = content.querySelector('#urlInput');
    const openUrlBtn = content.querySelector('#openUrl');
    const removeBtn = content.querySelector('#removeUrl');
    
    // Open URL button
    openUrlBtn.addEventListener('click', () => {
        const url = urlInput.value.trim();
        if (url) {
            window.open(url, '_blank');
        } else {
            alert('Please enter a URL first');
        }
    });
    
    // Remove button
    removeBtn.addEventListener('click', () => {
        if (confirm('Remove URL from this task?')) {
            setItemUrl(itemId, null);
            saveItemsToStorage();
            document.body.removeChild(modal);
            refreshUI();
        }
    });
    
    // Cancel button
    content.querySelector('#cancelUrl').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Save button
    content.querySelector('#saveUrl').addEventListener('click', () => {
        let url = urlInput.value.trim();
        
        // Add https:// if no protocol specified
        if (url && !url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }
        
        setItemUrl(itemId, url || null);
        saveItemsToStorage();
        document.body.removeChild(modal);
        refreshUI();
    });
    
    // Click overlay to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Focus input
    urlInput.focus();
}