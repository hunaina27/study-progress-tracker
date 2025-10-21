
const schedule = {
    Monday: [
        { subject: 'Computer', time: '9:00 a.m. - 12:00 p.m.', lectures: 2 },
        { subject: 'English', time: '9:00 a.m. - 12:00 p.m.', lectures: 1 },
        { subject: 'English', time: '2:00 p.m. - 4:00 p.m.', lectures: 2 },
        { subject: 'JavaScript Practice', time: '7:00 p.m. - 8:00 p.m.', lectures: 1 }
    ],
    Tuesday: [
        { subject: 'JavaScript Class', time: '9:00 a.m. - 12:00 p.m.', lectures: 1 },
        { subject: 'Computer', time: '3:00 p.m. - 5:00 p.m.', lectures: 2 },
        { subject: 'Math 101', time: '7:00 p.m. - 9:00 p.m.', lectures: 2 },
        { subject: 'Math 202', time: '9:00 p.m. - 11:00 p.m.', lectures: 2 }
    ],
    Wednesday: [
        { subject: 'Computer', time: '9:00 a.m. - 12:00 p.m.', lectures: 2 },
        { subject: 'English', time: '9:00 a.m. - 12:00 p.m.', lectures: 1 },
        { subject: 'English', time: '2:00 p.m. - 4:00 p.m.', lectures: 2 },
        { subject: 'JavaScript Practice', time: '7:00 p.m. - 8:00 p.m.', lectures: 1 }
    ],
    Thursday: [
        { subject: 'JavaScript Class', time: '9:00 a.m. - 12:00 p.m.', lectures: 1 },
        { subject: 'Computer', time: '3:00 p.m. - 5:00 p.m.', lectures: 2 },
        { subject: 'Math 101', time: '7:00 p.m. - 9:00 p.m.', lectures: 2 },
        { subject: 'Math 202', time: '9:00 p.m. - 11:00 p.m.', lectures: 2 }
    ],
    Friday: [
        { subject: 'Physics + Numericals', time: '9:00 a.m. - 12:00 p.m.', lectures: 2 },
        { subject: 'Pakistan Studies', time: '4:00 p.m. - 6:00 p.m.', lectures: 2 }
    ],
    Saturday: [
        { subject: 'Physics + Numericals', time: '9:00 a.m. - 12:00 p.m.', lectures: 2 },
        { subject: 'Pakistan Studies', time: '4:00 p.m. - 6:00 p.m.', lectures: 2 }
    ],
    Sunday: []
};

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
const lecturesList = document.getElementById('lecturesList');
const dayTitle = document.getElementById('dayTitle');
const progressBar = document.getElementById('progressBar');

function loadDay() {
    dayTitle.innerText = `Today's Schedule - ${today}`;
    lecturesList.innerHTML = '';

    const todayLectures = schedule[today] || [];
    if (todayLectures.length === 0) {
        lecturesList.innerHTML = '<p class="text-center text-muted">Rest day 😴</p>';
        return;
    }

    const completed = JSON.parse(localStorage.getItem(today)) || [];

    todayLectures.forEach((lec, index) => {
        const done = completed.includes(index);
        const div = document.createElement('div');
        div.className = 'lecture' + (done ? ' done' : '');
        div.innerHTML = `
          <div>
            <strong>${lec.subject}</strong> <br>
            <small>${lec.time} (${lec.lectures} lecture${lec.lectures > 1 ? 's' : ''})</small>
          </div>
          <button class="btn btn-success btn-sm" onclick="toggleDone(${index})">${done ? 'Undo' : 'Mark Done'}</button>
        `;
        lecturesList.appendChild(div);
    });
    updateProgress();
}

function toggleDone(index) {
    const completed = JSON.parse(localStorage.getItem(today)) || [];
    if (completed.includes(index)) {
        const idx = completed.indexOf(index);
        completed.splice(idx, 1);
    } else {
        completed.push(index);
    }
    localStorage.setItem(today, JSON.stringify(completed));
    loadDay();
}

function updateProgress() {
    const todayLectures = schedule[today] || [];
    const completed = JSON.parse(localStorage.getItem(today)) || [];
    const percent = todayLectures.length ? Math.round((completed.length / todayLectures.length) * 100) : 0;
    progressBar.style.width = percent + '%';
    progressBar.textContent = percent + '%';
}

function resetDay() {
    localStorage.removeItem(today);
    loadDay();
}

function resetAll() {
    Object.keys(schedule).forEach(day => localStorage.removeItem(day));
    loadDay();
}

loadDay();
