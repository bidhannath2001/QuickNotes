const events = [
    { name: "Team Meeting", date: "2024-11-01T10:00:00" },
    { name: "Project Deadline", date: "2024-11-15T17:00:00" },
    { name: "Conference", date: "2024-12-05T09:00:00" }
];

// Current sort direction
let sortDirection = {
    name: 'asc',
    date: 'asc'
};

// Function to calculate remaining time
function calculateRemainingTime(eventDate) {
    const now = new Date();
    const timeDifference = new Date(eventDate) - now;

    if (timeDifference < 0) {
        return 'Event has passed';
    }

    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${days}d, ${hours}h, ${minutes}m, ${seconds}s`;
}

// Function to update remaining times in the table
function updateRemainingTimes() {
    const remainingTimeCells = document.querySelectorAll('.remaining-time');

    remainingTimeCells.forEach((cell, index) => {
        const eventDate = events[index].date;
        cell.textContent = calculateRemainingTime(eventDate);
    });
}

// Function to render events in the table
function renderEvents() {
    const tbody = document.querySelector('#eventsTable tbody');
    tbody.innerHTML = ''; // Clear existing rows

    events.forEach(event => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
    <td>${event.name}</td>
    <td>${new Date(event.date).toLocaleString()}</td>
    <td class="remaining-time">${calculateRemainingTime(event.date)}</td>`;
        tbody.appendChild(newRow);
    });
}

// Function to sort events
function sortEvents(key) {
    events.sort((a, b) => {
        if (key === 'date') {
            return sortDirection[key] === 'asc'
                ? new Date(a.date) - new Date(b.date)
                : new Date(b.date) - new Date(a.date);
        } else if (key === 'name') {
            return sortDirection[key] === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        }
    });

    // Toggle the sorting direction for the next click
    sortDirection[key] = sortDirection[key] === 'asc' ? 'desc' : 'asc';

    // Update sort symbols
    updateSortSymbols(key);
    renderEvents(); // Re-render the events after sorting
}

// Function to update sort symbols
function updateSortSymbols(sortedKey) {
    document.querySelectorAll('.sort-symbol').forEach(symbol => {
        const key = symbol.parentElement.getAttribute('data-sort');
        if (key === sortedKey) {
            symbol.textContent = sortDirection[key] === 'asc' ? '▲' : '▼'; // Update to ascending or descending
        } 
        else {
            symbol.textContent = '▲'; // Reset other symbols to ascending
        }
    });
}

// Add event listeners to sortable headers
document.querySelectorAll('.sortable').forEach(th => {
    th.addEventListener('click', () => {
        const key = th.getAttribute('data-sort');
        sortEvents(key);
    });
});

// Initial call to render the events
renderEvents();

// Update remaining times every second
setInterval(updateRemainingTimes, 1000);