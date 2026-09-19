// ===============================
// SIDEBAR NAVIGATION
// ===============================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(function (page) {
        page.classList.remove("page-active");
    });

    let selectedPage = document.getElementById(pageName);

    if (selectedPage) {
        selectedPage.classList.add("page-active");
    }

    document.querySelectorAll(".sidebar nav button").forEach(function (btn) {
        btn.classList.toggle("active", btn.dataset.page === pageName);
    });
}


// ===============================
// DATA STORES
// ===============================

let subjects = {};      // { subjectName: { present, total } }
let assignments = [];   // { subject, title, date }
let events = [];        // { title, description }
let timetable = {};     // { "Monday-9-10": "Python", ... }


// ===============================
// LOAD / SAVE (localStorage)
// ===============================

function loadData() {

    let savedSubjects = localStorage.getItem("clos_subjects");
    let savedAssignments = localStorage.getItem("clos_assignments");
    let savedEvents = localStorage.getItem("clos_events");
    let savedTimetable = localStorage.getItem("clos_timetable");

    subjects = savedSubjects ? JSON.parse(savedSubjects) : {
        Python: { present: 18, total: 20 },
        DBMS: { present: 16, total: 20 }
    };

    assignments = savedAssignments ? JSON.parse(savedAssignments) : [];

    events = savedEvents ? JSON.parse(savedEvents) : [
        { title: "Freshers Event", description: "College freshers event coming soon." },
        { title: "Hackathon", description: "Upcoming college hackathon." }
    ];

    timetable = savedTimetable ? JSON.parse(savedTimetable) : {};
}

function saveSubjects() {
    localStorage.setItem("clos_subjects", JSON.stringify(subjects));
}

function saveAssignments() {
    localStorage.setItem("clos_assignments", JSON.stringify(assignments));
}

function saveEvents() {
    localStorage.setItem("clos_events", JSON.stringify(events));
}

function saveTimetableData() {
    localStorage.setItem("clos_timetable", JSON.stringify(timetable));
}


// ===============================
// GREETING
// ===============================

function updateGreeting() {

    let hour = new Date().getHours();
    let text = "Good evening";

    if (hour < 12) {
        text = "Good morning";
    } else if (hour < 17) {
        text = "Good afternoon";
    }

    let el = document.getElementById("greeting");

    if (el) {
        el.innerText = text + " 👋";
    }
}


// ===============================
// SHARED HELPER
// ===============================

function attendanceColor(pct) {
    if (pct >= 75) return "var(--forest)";
    if (pct >= 60) return "var(--gold)";
    return "var(--rust)";
}


// ===============================
// ATTENDANCE
// ===============================

function ensureSubject(name) {

    name = name.trim();

    if (!name) {
        return;
    }

    if (!subjects[name]) {
        subjects[name] = { present: 0, total: 0 };
    }
}

function addSubject() {

    let input = document.getElementById("subjectInput");
    let subject = input.value.trim();

    if (subject === "") {
        alert("Please enter a subject name.");
        return;
    }

    if (subjects[subject]) {
        alert("This subject already exists.");
        return;
    }

    subjects[subject] = { present: 0, total: 0 };

    input.value = "";

    saveSubjects();
    refreshAll();
}

function markAttendance(subject, isPresent) {

    subjects[subject].total++;

    if (isPresent) {
        subjects[subject].present++;
    }

    saveSubjects();
    refreshAll();
}

function deleteSubject(subject) {

    delete subjects[subject];

    saveSubjects();
    refreshAll();
}

function displayAttendance() {

    let list = document.getElementById("attendanceList");

    list.innerHTML = "";

    let names = Object.keys(subjects);

    if (names.length === 0) {
        list.innerHTML = `<p class="subtitle">No subjects yet. Add one above, or type a subject into your Timetable.</p>`;
        return;
    }

    names.forEach(function (subject) {

        let present = subjects[subject].present;
        let total = subjects[subject].total;

        let pct = total > 0 ? (present / total) * 100 : 0;
        let pctText = pct.toFixed(1);
        let color = attendanceColor(pct);

        let div = document.createElement("div");

        div.className = "card";

        div.innerHTML = `
            <div class="subject-card-top">
                <h3>${subject}</h3>
                <span class="subject-pct" style="color:${color}">${pctText}%</span>
            </div>

            <div class="ledger-bar">
                <div class="ledger-bar-fill" style="width:${pctText}%; background:${color}"></div>
            </div>

            <p class="subject-card-note">
                ${present} present of ${total} classes${total > 0 && pct < 75 ? " — below the 75% requirement" : ""}
            </p>

            <div class="subject-card-actions">
                <button class="btn-present" onclick="markAttendance('${subject}', true)">Present</button>
                <button class="btn-absent" onclick="markAttendance('${subject}', false)">Absent</button>
                <button class="secondary" onclick="deleteSubject('${subject}')">Remove</button>
            </div>
        `;

        list.appendChild(div);
    });
}

function updateDashboardAttendance() {

    let totalPresent = 0;
    let totalClasses = 0;

    for (let subject in subjects) {
        totalPresent += subjects[subject].present;
        totalClasses += subjects[subject].total;
    }

    let percentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

    let dashboard = document.getElementById("dashboardAttendance");
    let bar = document.getElementById("dashboardAttendanceBar");
    let note = document.getElementById("dashboardAttendanceNote");

    if (dashboard) {
        dashboard.innerText = percentage.toFixed(1) + "%";
    }

    if (bar) {
        bar.style.width = percentage.toFixed(1) + "%";
    }

    if (note) {
        let subjectCount = Object.keys(subjects).length;

        if (subjectCount === 0) {
            note.innerText = "Add a subject to start tracking.";
        } else if (percentage < 75) {
            note.innerText = `Across ${subjectCount} subject${subjectCount > 1 ? "s" : ""} — below the 75% requirement.`;
        } else {
            note.innerText = `Across ${subjectCount} subject${subjectCount > 1 ? "s" : ""} — on track.`;
        }
    }

    let subjectBox = document.getElementById("dashboardSubjects");

    if (subjectBox) {

        subjectBox.innerHTML = "";

        let names = Object.keys(subjects);

        if (names.length === 0) {
            subjectBox.innerHTML = `<p class="subtitle" style="margin-bottom:0;">No subjects yet.</p>`;
        } else {

            names.forEach(function (subject) {

                let present = subjects[subject].present;
                let total = subjects[subject].total;

                let pct = total > 0 ? (present / total) * 100 : 0;
                let pctText = pct.toFixed(1);
                let color = attendanceColor(pct);

                subjectBox.innerHTML += `
                    <div class="ledger-row">
                        <div class="ledger-row-top">
                            <span>${subject}</span>
                            <strong style="color:${color}">${pctText}%</strong>
                        </div>
                        <div class="ledger-bar">
                            <div class="ledger-bar-fill" style="width:${pctText}%; background:${color}"></div>
                        </div>
                    </div>
                `;
            });
        }
    }
}


// ===============================
// ASSIGNMENTS
// ===============================

function populateAssignmentSubjects() {

    let select = document.getElementById("assignmentSubject");

    if (!select) {
        return;
    }

    let current = select.value;

    select.innerHTML = `<option value="">General</option>`;

    Object.keys(subjects).forEach(function (subject) {
        select.innerHTML += `<option value="${subject}">${subject}</option>`;
    });

    if (Object.keys(subjects).includes(current)) {
        select.value = current;
    }
}

function addAssignment() {

    let input = document.getElementById("assignmentInput");
    let date = document.getElementById("assignmentDate");
    let subjectSelect = document.getElementById("assignmentSubject");

    if (input.value.trim() === "") {
        alert("Please enter an assignment.");
        return;
    }

    assignments.push({
        title: input.value.trim(),
        date: date.value,
        subject: subjectSelect ? subjectSelect.value : ""
    });

    input.value = "";
    date.value = "";

    saveAssignments();
    displayAssignments();
}

function displayAssignments() {

    let list = document.getElementById("assignmentList");

    list.innerHTML = "";

    if (assignments.length === 0) {
        list.innerHTML = `<p class="subtitle">No assignments yet.</p>`;
    }

    assignments.forEach(function (assignment, index) {

        let div = document.createElement("div");

        div.className = "list-row";

        div.innerHTML = `
            <div>
                <div class="list-row-title">
                    ${assignment.subject ? `<span class="tag">${assignment.subject}</span>` : ""}${assignment.title}
                </div>
                <div class="list-row-meta">${assignment.date ? assignment.date : "No due date"}</div>
            </div>

            <button class="danger" onclick="deleteAssignment(${index})">Delete</button>
        `;

        list.appendChild(div);
    });

    let countEl = document.getElementById("assignmentCount");

    if (countEl) {
        countEl.innerText = assignments.length;
    }
}

function deleteAssignment(index) {

    assignments.splice(index, 1);

    saveAssignments();
    displayAssignments();
}


// ===============================
// EVENTS
// ===============================

function addEvent() {

    let titleInput = document.getElementById("eventTitleInput");
    let descInput = document.getElementById("eventDescInput");

    if (titleInput.value.trim() === "") {
        alert("Please enter an event title.");
        return;
    }

    events.push({
        title: titleInput.value.trim(),
        description: descInput.value.trim()
    });

    titleInput.value = "";
    descInput.value = "";

    saveEvents();
    displayEvents();
}

function displayEvents() {

    let list = document.getElementById("eventList");

    list.innerHTML = "";

    if (events.length === 0) {
        list.innerHTML = `<p class="subtitle">No events yet. Add one above.</p>`;
    }

    events.forEach(function (event, index) {

        let div = document.createElement("div");

        div.className = "card";

        div.innerHTML = `
            <h3>${event.title}</h3>
            <p class="subtitle" style="margin-bottom:14px;">${event.description ? event.description : ""}</p>
            <button class="danger" onclick="deleteEvent(${index})">Delete</button>
        `;

        list.appendChild(div);
    });

    let countEl = document.getElementById("eventCount");

    if (countEl) {
        countEl.innerText = events.length;
    }
}

function deleteEvent(index) {

    events.splice(index, 1);

    saveEvents();
    displayEvents();
}


// ===============================
// TIMETABLE
// ===============================

function timetableKey(day, time) {
    return day + "-" + time;
}

function loadTimetableInputs() {

    document.querySelectorAll("#timetable input[data-day]").forEach(function (input) {

        let key = timetableKey(input.dataset.day, input.dataset.time);

        if (timetable[key]) {
            input.value = timetable[key];
        }
    });
}

function handleTimetableChange(e) {

    let input = e.target;

    if (!input.dataset.day) {
        return;
    }

    let key = timetableKey(input.dataset.day, input.dataset.time);
    let value = input.value.trim();

    if (value) {

        timetable[key] = value;

        if (value.toLowerCase() !== "break") {
            ensureSubject(value);
        }

    } else {
        delete timetable[key];
    }

    saveTimetableData();
    saveSubjects();
    refreshAll();
}

function saveTimetable() {

    document.querySelectorAll("#timetable input[data-day]").forEach(function (input) {

        let key = timetableKey(input.dataset.day, input.dataset.time);
        let value = input.value.trim();

        if (value) {
            timetable[key] = value;

            if (value.toLowerCase() !== "break") {
                ensureSubject(value);
            }
        }
    });

    saveTimetableData();
    saveSubjects();
    refreshAll();

    alert("Timetable saved! Subjects have been synced to Attendance.");
}

function clearTimetable() {

    document.querySelectorAll("#timetable input[data-day]").forEach(function (input) {
        input.value = "";
    });

    timetable = {};

    saveTimetableData();
}

function uploadTimetable() {

    let file = document.getElementById("timetableImage").files[0];

    if (!file) {
        alert("Please select a timetable photo.");
        return;
    }

    document.getElementById("uploadMessage").innerText =
        "Photo uploaded. Automatic timetable reading isn't available yet — please enter subjects manually above.";
}


// ===============================
// TODAY'S CLASSES (DASHBOARD)
// ===============================

function displayTodayClasses() {

    let box = document.getElementById("dashboardToday");
    let heading = document.getElementById("todayHeading");

    if (!box) {
        return;
    }

    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let today = days[new Date().getDay()];

    if (heading) {
        heading.innerText = "Today's classes — " + today;
    }

    let timeLabels = {
        "9-10": "9:00 - 10:00",
        "10-11": "10:00 - 11:00",
        "11-12": "11:00 - 12:00",
        "12-1": "12:00 - 1:00",
        "1-2": "1:00 - 2:00",
        "2-3": "2:00 - 3:00"
    };

    box.innerHTML = "";

    let found = false;

    Object.keys(timeLabels).forEach(function (time) {

        let key = timetableKey(today, time);
        let subject = timetable[key];

        if (subject) {
            found = true;

            box.innerHTML += `
                <div class="timeline-item">
                    <div class="timeline-dot"></div>
                    <div class="timeline-time">${timeLabels[time]}</div>
                    <div class="timeline-content"><strong>${subject}</strong></div>
                </div>
            `;
        }
    });

    if (!found) {
        box.innerHTML = `<p class="subtitle" style="margin-bottom:0;">No classes scheduled for ${today}.</p>`;
    }
}


// ===============================
// REFRESH EVERYTHING
// ===============================

function refreshAll() {
    displayAttendance();
    updateDashboardAttendance();
    populateAssignmentSubjects();
    displayAssignments();
    displayEvents();
    displayTodayClasses();
}


// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    loadData();
    loadTimetableInputs();
    updateGreeting();

    document.querySelectorAll("#timetable input[data-day]").forEach(function (input) {
        input.addEventListener("change", handleTimetableChange);
    });

    refreshAll();
});