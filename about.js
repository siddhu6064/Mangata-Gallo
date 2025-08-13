/* About Page - Reservation Calendar System */

document.addEventListener('DOMContentLoaded', function () {
    initializeCalendar();
    initializeReservationForm();
    addDynamicStyles();
});

let selectedDate = null;
let selectedTime = null;
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const availableTimeSlots = [
    '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
    '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM'
];

// Store booked appointments (in real app, this would come from a database)
const bookedSlots = {
    '2025-01-15': ['10:00 AM', '2:00 PM', '4:00 PM'],
    '2025-01-16': ['11:00 AM', '1:00 PM'],
    '2025-01-20': ['10:30 AM', '3:00 PM', '5:00 PM']
};

function initializeCalendar() {
    const prevBtn = document.getElementById('prevMonth');
    const nextBtn = document.getElementById('nextMonth');

    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            generateCalendar();
        });

        nextBtn.addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            generateCalendar();
        });
    }

    generateCalendar();
}

function generateCalendar() {
    const monthHeader = document.getElementById('currentMonth');
    const calendarDays = document.getElementById('calendarDays');

    if (!monthHeader || !calendarDays) return;

    monthHeader.textContent = monthNames[currentMonth] + ' ' + currentYear;

    // Clear previous days
    calendarDays.innerHTML = '';

    // Get first day of month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarDays.appendChild(emptyDay);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;

        const dateObj = new Date(currentYear, currentMonth, day);
        const dateString = formatDateString(dateObj);

        // Disable past dates
        if (dateObj < today) {
            dayElement.classList.add('disabled');
        }
        // Disable Sundays and Mondays (store closed)
        else if (dateObj.getDay() === 0 || dateObj.getDay() === 1) {
            dayElement.classList.add('closed');
            dayElement.title = 'Store closed';
        }
        // Enable clickable dates
        else {
            dayElement.classList.add('available');
            dayElement.addEventListener('click', () => selectDate(dateObj, dayElement));
        }

        calendarDays.appendChild(dayElement);
    }
}

function selectDate(dateObj, dayElement) {
    // Remove previous selection
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });

    // Add selection to clicked day
    dayElement.classList.add('selected');
    selectedDate = dateObj;

    // Show time slots
    showTimeSlots(dateObj);
}

function showTimeSlots(dateObj) {
    const timeSlotsContainer = document.getElementById('timeSlots');
    const timeGrid = document.getElementById('timeGrid');
    const dateString = formatDateString(dateObj);

    if (!timeSlotsContainer || !timeGrid) return;

    timeSlotsContainer.style.display = 'block';
    timeGrid.innerHTML = '';

    // Get booked slots for this date
    const bookedTimes = bookedSlots[dateString] || [];

    // Create time slot buttons
    availableTimeSlots.forEach(time => {
        const timeButton = document.createElement('button');
        timeButton.type = 'button';
        timeButton.className = 'time-slot';
        timeButton.textContent = time;

        if (bookedTimes.includes(time)) {
            timeButton.classList.add('booked');
            timeButton.disabled = true;
            timeButton.title = 'Not available';
        } else {
            timeButton.addEventListener('click', () => selectTime(time, timeButton));
        }

        timeGrid.appendChild(timeButton);
    });
}

function selectTime(time, timeButton) {
    // Remove previous selection
    document.querySelectorAll('.time-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
    });

    // Add selection to clicked time
    timeButton.classList.add('selected');
    selectedTime = time;

    // Update appointment details
    updateAppointmentDetails();

    // Enable reserve button
    const reserveBtn = document.getElementById('reserveBtn');
    if (reserveBtn) {
        reserveBtn.disabled = false;
    }
}

function updateAppointmentDetails() {
    const selectedDateTime = document.getElementById('selectedDateTime');
    const appointmentDetails = document.getElementById('appointmentDetails');

    if (selectedDate && selectedTime && selectedDateTime && appointmentDetails) {
        const options = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        const dateString = selectedDate.toLocaleDateString('en-US', options);

        appointmentDetails.textContent = dateString + ' at ' + selectedTime;
        selectedDateTime.style.display = 'block';
    }
}

function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
}

function initializeReservationForm() {
    const form = document.getElementById('reservationForm');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!selectedDate || !selectedTime) {
                showNotification('❌ Please select a date and time for your visit');
                return;
            }

            // Collect form data
            const formData = new FormData(form);
            const reservation = {
                date: formatDateString(selectedDate),
                time: selectedTime,
                visitType: formData.get('visitType'),
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                partySize: formData.get('partySize'),
                specialRequests: formData.get('specialRequests')
            };

            // Simulate booking process
            processReservation(reservation);
        });
    }
}

function processReservation(reservation) {
    const reserveBtn = document.getElementById('reserveBtn');
    if (!reserveBtn) return;

    const originalText = reserveBtn.textContent;

    // Show loading state
    reserveBtn.textContent = 'Processing...';
    reserveBtn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Add to booked slots
        const dateString = reservation.date;
        if (!bookedSlots[dateString]) {
            bookedSlots[dateString] = [];
        }
        bookedSlots[dateString].push(reservation.time);

        // Show success message
        showNotification('🎉 Reservation confirmed for ' + reservation.firstName + ' ' + reservation.lastName + '!');

        // Reset form and calendar
        const form = document.getElementById('reservationForm');
        if (form) form.reset();

        const selectedDateTime = document.getElementById('selectedDateTime');
        if (selectedDateTime) selectedDateTime.style.display = 'none';

        const timeSlots = document.getElementById('timeSlots');
        if (timeSlots) timeSlots.style.display = 'none';

        document.querySelectorAll('.calendar-day.selected').forEach(day => {
            day.classList.remove('selected');
        });

        selectedDate = null;
        selectedTime = null;

        reserveBtn.textContent = originalText;
        reserveBtn.disabled = true;

        console.log('Reservation details:', reservation);

    }, 2000);
}

function showNotification(message) {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; background: linear-gradient(45deg, #d4af37, #f4d03f); color: #1a1a1a; padding: 15px 25px; border-radius: 25px; font-weight: bold; box-shadow: 0 5px 20px rgba(212, 175, 55, 0.4); z-index: 1000; transform: translateX(300px); transition: all 0.3s ease; font-family: Lora, serif;';

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Animate out after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function addDynamicStyles() {
    // Check if styles already added
    if (document.getElementById('calendar-styles')) return;

    const styleSheet = document.createElement('style');
    styleSheet.id = 'calendar-styles';
    styleSheet.textContent = `
        .calendar {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 0.25rem 1rem rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .calendar-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1rem;
        }
        
        .calendar-nav {
            background: #d4af37;
            border: none;
            border-radius: 50%;
            width: 2.5rem;
            height: 2.5rem;
            cursor: pointer;
            font-weight: bold;
            font-size: 1.2rem;
            color: #1a1a1a;
            transition: all 0.3s ease;
        }
        
        .calendar-nav:hover {
            background: #f4d03f;
            transform: scale(1.1);
        }
        
        .calendar-month {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            color: #1a1a1a;
            margin: 0;
        }
        
        .calendar-weekdays {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.5rem;
            margin-bottom: 0.5rem;
        }
        
        .weekday {
            text-align: center;
            font-weight: bold;
            color: #666;
            padding: 0.5rem;
            font-size: 0.9rem;
        }
        
        .calendar-days {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.25rem;
        }
        
        .calendar-day {
            aspect-ratio: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .calendar-day.available {
            background: #f8f8f8;
            border: 1px solid #e0e0e0;
        }
        
        .calendar-day.available:hover {
            background: #d4af37;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 0.25rem 0.75rem rgba(212, 175, 55, 0.3);
        }
        
        .calendar-day.selected {
            background: #d4af37 !important;
            color: white;
            font-weight: bold;
            transform: scale(1.1);
            box-shadow: 0 0.25rem 0.75rem rgba(212, 175, 55, 0.4);
        }
        
        .calendar-day.disabled {
            color: #ccc;
            cursor: not-allowed;
            background: #f5f5f5;
        }
        
        .calendar-day.closed {
            background: #ffe6e6;
            color: #999;
            cursor: not-allowed;
        }
        
        .calendar-day.empty {
            cursor: default;
        }
        
        .time-slots {
            background: white;
            border-radius: 0.75rem;
            padding: 1.5rem;
            box-shadow: 0 0.25rem 1rem rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }
        
        .time-slots h4 {
            margin-bottom: 1rem;
            color: #1a1a1a;
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
        }
        
        .time-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(7rem, 1fr));
            gap: 0.75rem;
        }
        
        .time-slot {
            padding: 0.75rem 1rem;
            border: 2px solid #e0e0e0;
            background: #f8f8f8;
            border-radius: 0.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .time-slot:hover:not(.booked) {
            background: #d4af37;
            color: white;
            border-color: #d4af37;
            transform: translateY(-2px);
            box-shadow: 0 0.25rem 0.75rem rgba(212, 175, 55, 0.3);
        }
        
        .time-slot.selected {
            background: #d4af37;
            color: white;
            border-color: #d4af37;
            font-weight: bold;
            transform: translateY(-2px);
            box-shadow: 0 0.25rem 0.75rem rgba(212, 175, 55, 0.4);
        }
        
        .time-slot.booked {
            background: #f0f0f0;
            color: #999;
            cursor: not-allowed;
            border-color: #ddd;
        }
        
        @media (max-width: 48rem) {
            .time-grid {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .calendar-nav {
                width: 2rem;
                height: 2rem;
                font-size: 1rem;
            }
            
            .calendar-month {
                font-size: 1.2rem;
            }
        }
    `;

    document.head.appendChild(styleSheet);
}
