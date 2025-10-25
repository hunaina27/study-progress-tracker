const schedule = {
      Monday: [
        { subject: 'Computer', time: '9:00 AM - 11:00 AM', lectures: 1 +"week"},
        { subject: 'English', time: '11:30 AM - 1:30 PM', lectures: 2 },
        { subject: 'English', time: '3:00 PM - 5:00 PM', lectures: 2 },
        { subject: 'JavaScript Assignment', time: '7:00 PM - 8:00 PM', lectures: 1 }
      ],
      Tuesday: [
        { subject: 'JavaScript Class', time: '9:00 AM - 1:00 PM', lectures: 0 },
        { subject: 'Computer', time: '3:00 PM - 5:00 PM', lectures: 1 +"week" },
        { subject: 'English', time: '7:00 PM - 8:00 PM', lectures: 1 }
      ],
      Wednesday: [
        { subject: 'Math 101', time: '10:00 AM - 12:00 PM', lectures: 2 },
        { subject: 'Math 202', time: '3:00 PM - 5:00 PM', lectures: 2 },
        { subject: 'JavaScript Assignment', time: '7:00 PM - 8:00 PM', lectures: 1 }
      ],
      Thursday: [
        { subject: 'JavaScript Class', time: '9:00 AM - 1:00 PM', lectures: 0 },
        { subject: 'Math 202', time: '3:00 PM - 5:00 PM', lectures: 2 },
        { subject: 'Math 101', time: '7:00 PM - 8:00 PM', lectures: 2 }
      ],
      Friday: [
        { subject: 'Physics + Numericals', time: '9:00 AM - 12:00 PM', lectures: 2 },
        { subject: 'Pakistan Studies', time: '4:00 PM - 6:00 PM', lectures: 2 },
        { subject: 'JavaScript Practice', time: '8:00 PM - 9:00 PM', lectures: 1 }
      ],
      Saturday: [
        { subject: 'Physics + Numericals', time: '9:00 AM - 12:00 PM', lectures: 2 },
        { subject: 'Pakistan Studies', time: '4:00 PM - 6:00 PM', lectures: 2 },
        { subject: 'Physics Revision', time: '8:00 PM - 9:00 PM', lectures: 1 }
      ],
      Sunday: []
    };

    // === SUBJECT TOTALS FOR 60% GOAL ===
    const totalLectures = {
      "Physics + Numericals": 24,
      "Computer": 9,
      "Math 101": 27,
      "Math 202": 27,
      "English": 27,
      "Pakistan Studies": 18,
      "JavaScript Practice & Asignments": 10
    };

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const lecturesList = document.getElementById('lecturesList');
    const dayTitle = document.getElementById('dayTitle');
    const progressBar = document.getElementById('progressBar');
    const subjectProgressList = document.getElementById('subjectProgressList');

    function loadDay() {
      dayTitle.innerText = `Today's Schedule - ${today}`;
      lecturesList.innerHTML = '';

      const todayLectures = schedule[today] || [];
      if (todayLectures.length === 0) {
        lecturesList.innerHTML = '<p class="text-center text-muted">Rest day 😴</p>';
        updateProgress();
        updateSubjectProgress();
        return;
      }

      const completed = JSON.parse(localStorage.getItem(today)) || [];

      todayLectures.forEach((lec, index) => {
        const done = completed.includes(index);
        const div = document.createElement('div');
        div.className = 'lecture' + (done ? ' done' : '');
        div.innerHTML = `
          <div>
            <strong>${lec.subject}</strong><br>
            <small>${lec.time} (${lec.lectures} lecture${lec.lectures > 1 ? 's' : ''})</small>
          </div>
          ${lec.lectures > 0 ?
            `<button class="btn btn-success btn-sm" onclick="toggleDone(${index})">${done ? 'Undo' : 'Mark Done'}</button>`
            : '<span class="badge bg-info">Class</span>'}
        `;
        lecturesList.appendChild(div);
      });
      updateProgress();
      updateSubjectProgress();
    }

    function toggleDone(index) {
      const todayLectures = schedule[today];
      const completed = JSON.parse(localStorage.getItem(today)) || [];
      const lec = todayLectures[index];

      if (completed.includes(index)) {
        const idx = completed.indexOf(index);
        completed.splice(idx, 1);
        updateSubjectCount(lec.subject, -lec.lectures);
      } else {
        completed.push(index);
        updateSubjectCount(lec.subject, lec.lectures);
      }

      localStorage.setItem(today, JSON.stringify(completed));
      loadDay();
    }

    function updateSubjectCount(subject, delta) {
      const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress')) || {};
      subjectProgress[subject] = (subjectProgress[subject] || 0) + delta;
      if (subjectProgress[subject] < 0) subjectProgress[subject] = 0;
      localStorage.setItem('subjectProgress', JSON.stringify(subjectProgress));
    }

    function updateSubjectProgress() {
      const subjectProgress = JSON.parse(localStorage.getItem('subjectProgress')) || {};
      subjectProgressList.innerHTML = '';

      let totalCompleted = 0;
      let totalTarget = 0;

      for (let subject in totalLectures) {
        const done = subjectProgress[subject] || 0;
        const total = totalLectures[subject];
        const percent = Math.min(Math.round((done / total) * 100), 100);
        totalCompleted += done;
        totalTarget += total;

        const div = document.createElement('div');
        div.innerHTML = `
          <div class="mb-2"><strong>${subject}</strong> — ${percent}% (${done}/${total})</div>
          <div class="progress mb-3">
            <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
          </div>
        `;
        subjectProgressList.appendChild(div);
      }

      const overallPercent = Math.min(Math.round((totalCompleted / totalTarget) * 100), 100);
      progressBar.style.width = overallPercent + '%';
      progressBar.textContent = overallPercent + '%';
    }

    function updateProgress() {
      // handled by updateSubjectProgress
    }

    function resetDay() {
      localStorage.removeItem(today);
      loadDay();
    }

    function resetAll() {
      Object.keys(schedule).forEach(day => localStorage.removeItem(day));
      localStorage.removeItem('subjectProgress');
      loadDay();
    }

    loadDay();