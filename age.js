const { DateTime } = luxon;

const form = document.querySelector('#age-form');
const input = document.querySelector('#birthdate');
const result = document.querySelector('#result');
const errorMessage = document.querySelector('#error-message');
errorMessage.textContent = '';
//preventing futures dates
input.max = DateTime.now().toISODate();

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const birthdate = DateTime.fromISO(input.value).startOf('day');
    const today = DateTime.now().startOf('day');
    if (!input.value || !birthdate.isValid || birthdate > today) {
        showErrorMessage('Please enter a valid birthdate that is not in the future.');
        return;
    }

    errorMessage.textContent = '';
    const age = today.diff(birthdate, ['years', 'months', 'days']).toObject();
    document.querySelector('#years').textContent = Math.floor(age.years);
    document.querySelector('#months').textContent = Math.floor(age.months);
    document.querySelector('#days').textContent = Math.floor(age.days);
    
    const birthdayInYear = (year) => {
        const firstOfBirthMonth = birthdate.set({ year, day: 1 });
        return firstOfBirthMonth.set({ day: Math.min(birthdate.day, firstOfBirthMonth.daysInMonth) });
    };

    let nextBirthday = birthdayInYear(today.year);
    if (nextBirthday < today) {
        nextBirthday = birthdayInYear(today.year + 1);
    }
    const isBirthday = nextBirthday.equals(today);
    const daysUntilNextBirthday = Math.round(nextBirthday.diff(today, 'days').days);
    document.querySelector('#birthday-note').textContent = isBirthday ? 'Happy Birthday!' : `Your next birthday is in ${daysUntilNextBirthday} days.`;
    result.classList.remove('hidden');
});

function showErrorMessage(message) {
    errorMessage.textContent = message;
    result.classList.add('hidden');
    input.focus();
}
