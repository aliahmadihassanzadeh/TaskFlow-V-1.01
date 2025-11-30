// ical-export.js
// Export tasks to iCal format (.ics file)

function exportToICalendar() {
    // Filter items that have dates
    const itemsWithDates = items.filter(item => item.dueDate || item.startDate);
    
    if (itemsWithDates.length === 0) {
        alert('No tasks with dates to export!');
        return;
    }
    
    // Generate iCal content
    const icalContent = generateICalContent(itemsWithDates);
    
    // Create and download file
    const blob = new Blob([icalContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-calendar-${new Date().toISOString().split('T')[0]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`Exported ${itemsWithDates.length} tasks to calendar file!`);
}

function generateICalContent(tasks) {
    let ical = 'BEGIN:VCALENDAR\r\n';
    ical += 'VERSION:2.0\r\n';
    ical += 'PRODID:-//TaskFlow//Task Management//EN\r\n';
    ical += 'CALSCALE:GREGORIAN\r\n';
    ical += 'METHOD:PUBLISH\r\n';
    ical += 'X-WR-CALNAME:TaskFlow Tasks\r\n';
    ical += 'X-WR-TIMEZONE:UTC\r\n';
    
    tasks.forEach(task => {
        // Add event for start date if exists
        if (task.startDate) {
            ical += generateEvent(task, 'start');
        }
        
        // Add event for due date if exists
        if (task.dueDate) {
            ical += generateEvent(task, 'due');
        }
        
        // Add subtasks with dates
        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach(subtask => {
                if (subtask.dueDate) {
                    ical += generateSubtaskEvent(task, subtask);
                }
            });
        }
    });
    
    ical += 'END:VCALENDAR\r\n';
    return ical;
}

function generateEvent(task, dateType) {
    const uid = `${task.id}-${dateType}@taskflow.app`;
    const now = formatDateForICal(new Date());
    const isAllDay = !task[dateType === 'start' ? 'startDate' : 'dueDate'].includes('T');
    
    let event = 'BEGIN:VEVENT\r\n';
    event += `UID:${uid}\r\n`;
    event += `DTSTAMP:${now}\r\n`;
    
    // Set date/time
    const dateValue = task[dateType === 'start' ? 'startDate' : 'dueDate'];
    if (isAllDay) {
        // All-day event
        event += `DTSTART;VALUE=DATE:${formatDateForICal(new Date(dateValue + 'T00:00:00'), true)}\r\n`;
        event += `DTEND;VALUE=DATE:${formatDateForICal(new Date(dateValue + 'T23:59:59'), true)}\r\n`;
    } else {
        // Timed event
        const startTime = new Date(dateValue);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // +1 hour
        event += `DTSTART:${formatDateForICal(startTime)}\r\n`;
        event += `DTEND:${formatDateForICal(endTime)}\r\n`;
    }
    
    // Event title
    const prefix = dateType === 'start' ? '▶️ ' : '🏁 ';
    event += `SUMMARY:${prefix}${escapeICalText(task.text)}\r\n`;
    
    // Description with details
    let description = `Category: ${task.category}\\n`;
    if (task.priority && task.priority !== 'none') {
        description += `Priority: ${task.priority.toUpperCase()}\\n`;
    }
    if (task.note) {
        description += `\\nNotes: ${escapeICalText(task.note)}\\n`;
    }
    if (task.subtasks && task.subtasks.length > 0) {
        description += `\\nSubtasks (${task.subtasks.length}):\\n`;
        task.subtasks.forEach((st, idx) => {
            description += `${idx + 1}. ${st.done ? '✓' : '○'} ${escapeICalText(st.text)}\\n`;
        });
    }
    event += `DESCRIPTION:${description}\r\n`;
    
    // Category as color
    event += `CATEGORIES:${task.category}\r\n`;
    
    // Priority
    if (task.priority === 'high') {
        event += 'PRIORITY:1\r\n';
    } else if (task.priority === 'medium') {
        event += 'PRIORITY:5\r\n';
    } else if (task.priority === 'low') {
        event += 'PRIORITY:9\r\n';
    }
    
    // Status
    if (task.done) {
        event += 'STATUS:COMPLETED\r\n';
    } else {
        event += 'STATUS:NEEDS-ACTION\r\n';
    }
    
    event += 'END:VEVENT\r\n';
    return event;
}

function generateSubtaskEvent(parentTask, subtask) {
    const uid = `${parentTask.id}-subtask-${subtask.id}@taskflow.app`;
    const now = formatDateForICal(new Date());
    const isAllDay = !subtask.dueDate.includes('T');
    
    let event = 'BEGIN:VEVENT\r\n';
    event += `UID:${uid}\r\n`;
    event += `DTSTAMP:${now}\r\n`;
    
    // Set date/time
    if (isAllDay) {
        event += `DTSTART;VALUE=DATE:${formatDateForICal(new Date(subtask.dueDate + 'T00:00:00'), true)}\r\n`;
        event += `DTEND;VALUE=DATE:${formatDateForICal(new Date(subtask.dueDate + 'T23:59:59'), true)}\r\n`;
    } else {
        const startTime = new Date(subtask.dueDate);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // +30 minutes
        event += `DTSTART:${formatDateForICal(startTime)}\r\n`;
        event += `DTEND:${formatDateForICal(endTime)}\r\n`;
    }
    
    // Title
    event += `SUMMARY:↳ ${escapeICalText(subtask.text)}\r\n`;
    
    // Description
    let description = `Subtask of: ${escapeICalText(parentTask.text)}\\n`;
    description += `Category: ${parentTask.category}\\n`;
    event += `DESCRIPTION:${description}\r\n`;
    
    // Category
    event += `CATEGORIES:${parentTask.category},Subtask\r\n`;
    
    // Status
    if (subtask.done) {
        event += 'STATUS:COMPLETED\r\n';
    } else {
        event += 'STATUS:NEEDS-ACTION\r\n';
    }
    
    event += 'END:VEVENT\r\n';
    return event;
}

function formatDateForICal(date, dateOnly = false) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    if (dateOnly) {
        return `${year}${month}${day}`;
    }
    
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

function escapeICalText(text) {
    if (!text) return '';
    return text
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '');
}