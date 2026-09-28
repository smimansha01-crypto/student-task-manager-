/* =====================================================
   FIREBASE IMPORTS
===================================================== */

import { auth, db } from "./firebase.js";


import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";


import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";



/* =====================================================
   HTML ELEMENTS
===================================================== */


const authSection =
    document.getElementById("authSection");

const appSection =
    document.getElementById("appSection");


const registerEmail =
    document.getElementById("registerEmail");

const registerPassword =
    document.getElementById("registerPassword");

const registerBtn =
    document.getElementById("registerBtn");


const loginEmail =
    document.getElementById("loginEmail");

const loginPassword =
    document.getElementById("loginPassword");

const loginBtn =
    document.getElementById("loginBtn");


const logoutBtn =
    document.getElementById("logoutBtn");


const userEmail =
    document.getElementById("userEmail");


const taskTitle =
    document.getElementById("taskTitle");

const taskSubject =
    document.getElementById("taskSubject");

const taskDeadline =
    document.getElementById("taskDeadline");

const taskPriority =
    document.getElementById("taskPriority");

const addTaskBtn =
    document.getElementById("addTaskBtn");


const taskList =
    document.getElementById("taskList");


const searchTask =
    document.getElementById("searchTask");


const filterPriority =
    document.getElementById("filterPriority");


const totalTasks =
    document.getElementById("totalTasks");

const completedTasks =
    document.getElementById("completedTasks");

const pendingTasks =
    document.getElementById("pendingTasks");

const taskCount =
    document.getElementById("taskCount");



/* =====================================================
   LOCAL ARRAY
===================================================== */


let tasks = [];



/* =====================================================
   REGISTER
===================================================== */


registerBtn.addEventListener(
    "click",
    async function () {

        const email =
            registerEmail.value.trim();

        const password =
            registerPassword.value;


        if (email === "" || password === "") {

            alert("Please enter email and password.");

            return;
        }


        try {

            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert("Account created successfully!");


            registerEmail.value = "";

            registerPassword.value = "";


        } catch (error) {

            console.error(error);

            alert(error.message);

        }

    }
);



/* =====================================================
   LOGIN
===================================================== */


loginBtn.addEventListener(
    "click",
    async function () {

        const email =
            loginEmail.value.trim();

        const password =
            loginPassword.value;


        if (email === "" || password === "") {

            alert("Please enter email and password.");

            return;
        }


        try {

            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            alert("Login successful!");


            loginEmail.value = "";

            loginPassword.value = "";


        } catch (error) {

            console.error(error);

            alert(
                "Login failed: " +
                error.message
            );

        }

    }
);



/* =====================================================
   LOGOUT
===================================================== */


logoutBtn.addEventListener(
    "click",
    async function () {

        try {

            await signOut(auth);

        } catch (error) {

            console.error(error);

        }

    }
);



/* =====================================================
   AUTH STATE
===================================================== */


onAuthStateChanged(
    auth,
    async function (user) {

        if (user) {

            authSection.style.display = "none";

            appSection.style.display = "block";

            userEmail.textContent =
                "Logged in as: " + user.email;


            await loadTasks();

        }

        else {

            authSection.style.display = "block";

            appSection.style.display = "none";

            tasks = [];

        }

    }
);



/* =====================================================
   ADD TASK
===================================================== */


addTaskBtn.addEventListener(
    "click",
    async function () {

        const user = auth.currentUser;


        if (!user) {

            alert("Please login first.");

            return;
        }


        const title =
            taskTitle.value.trim();

        const subject =
            taskSubject.value.trim();

        const deadline =
            taskDeadline.value;

        const priority =
            taskPriority.value;


        if (
            title === "" ||
            subject === "" ||
            deadline === ""
        ) {

            alert("Please fill all task fields.");

            return;
        }


        try {

            await addDoc(
                collection(db, "tasks"),
                {

                    title: title,

                    subject: subject,

                    deadline: deadline,

                    priority: priority,

                    completed: false,

                    userId: user.uid,

                    createdAt: serverTimestamp()

                }
            );


            alert("Task added successfully!");


            taskTitle.value = "";

            taskSubject.value = "";

            taskDeadline.value = "";

            taskPriority.value = "Low";


            await loadTasks();


        } catch (error) {

            console.error(error);

            alert(
                "Error adding task: " +
                error.message
            );

        }

    }
);



/* =====================================================
   LOAD TASKS
===================================================== */


async function loadTasks() {

    const user = auth.currentUser;


    if (!user) {

        return;
    }


    try {

        const tasksQuery =
            query(
                collection(db, "tasks"),
                where("userId", "==", user.uid)
            );


        const querySnapshot =
            await getDocs(tasksQuery);


        tasks = [];


        querySnapshot.forEach(
            function (document) {

                tasks.push({

                    id: document.id,

                    ...document.data()

                });

            }
        );


        displayTasks();

    } catch (error) {

        console.error(error);

        alert(
            "Error loading tasks: " +
            error.message
        );

    }

}



/* =====================================================
   DISPLAY TASKS
===================================================== */


function displayTasks() {

    const search =
        searchTask.value
            .trim()
            .toLowerCase();


    const priorityFilter =
        filterPriority.value;


    const filteredTasks =
        tasks.filter(
            function (task) {

                const matchesSearch =
                    task.title
                        .toLowerCase()
                        .includes(search) ||

                    task.subject
                        .toLowerCase()
                        .includes(search);


                const matchesPriority =
                    priorityFilter === "All" ||
                    task.priority === priorityFilter;


                return (
                    matchesSearch &&
                    matchesPriority
                );

            }
        );


    taskList.innerHTML = "";


    if (filteredTasks.length === 0) {

        taskList.innerHTML = `
            <p class="empty-message">
                No matching tasks found.
            </p>
        `;

    }


    filteredTasks.forEach(
        function (task) {

            const taskDiv =
                document.createElement("div");


            taskDiv.className = "task";


            if (task.completed) {

                taskDiv.classList.add("completed");

            }


            let priorityClass =
                "priority-low";


            if (task.priority === "High") {

                priorityClass =
                    "priority-high";

            }

            else if (task.priority === "Medium") {

                priorityClass =
                    "priority-medium";

            }


            taskDiv.innerHTML = `

                <h3>
                    ${escapeHTML(task.title)}
                </h3>


                <p class="task-info">
                    <strong>Subject:</strong>
                    ${escapeHTML(task.subject)}
                </p>


                <p class="task-info">
                    <strong>Deadline:</strong>
                    ${escapeHTML(task.deadline)}
                </p>


                <span class="priority ${priorityClass}">
                    ${escapeHTML(task.priority)}
                </span>


                <div class="task-buttons">

                    <button
                        class="complete-btn"
                        onclick="toggleComplete('${task.id}', ${task.completed})">

                        ${
                            task.completed
                            ? "Mark Pending"
                            : "Complete"
                        }

                    </button>


                    <button
                        class="edit-btn"
                        onclick="editTask('${task.id}')">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        onclick="deleteTask('${task.id}')">

                        Delete

                    </button>

                </div>

            `;


            taskList.appendChild(taskDiv);

        }
    );


    updateStatistics();

}



/* =====================================================
   COMPLETE / UNCOMPLETE
===================================================== */


window.toggleComplete =
    async function (taskId, currentStatus) {

        try {

            const taskReference =
                doc(db, "tasks", taskId);


            await updateDoc(
                taskReference,
                {

                    completed:
                        !currentStatus

                }
            );


            await loadTasks();


        } catch (error) {

            console.error(error);

            alert(
                "Could not update task."
            );

        }

    };



/* =====================================================
   DELETE TASK
===================================================== */


window.deleteTask =
    async function (taskId) {

        const confirmDelete =
            confirm(
                "Are you sure you want to delete this task?"
            );


        if (!confirmDelete) {

            return;
        }


        try {

            await deleteDoc(
                doc(db, "tasks", taskId)
            );


            await loadTasks();


        } catch (error) {

            console.error(error);

            alert(
                "Could not delete task."
            );

        }

    };



/* =====================================================
   EDIT TASK
===================================================== */


window.editTask =
    async function (taskId) {

        const task =
            tasks.find(
                function (item) {

                    return item.id === taskId;

                }
            );


        if (!task) {

            return;
        }


        const newTitle =
            prompt(
                "Enter new task name:",
                task.title
            );


        if (newTitle === null) {

            return;
        }


        const newSubject =
            prompt(
                "Enter new subject:",
                task.subject
            );


        if (newSubject === null) {

            return;
        }


        const newDeadline =
            prompt(
                "Enter new deadline (YYYY-MM-DD):",
                task.deadline
            );


        if (newDeadline === null) {

            return;
        }


        try {

            await updateDoc(
                doc(db, "tasks", taskId),
                {

                    title:
                        newTitle.trim(),

                    subject:
                        newSubject.trim(),

                    deadline:
                        newDeadline

                }
            );


            await loadTasks();


        } catch (error) {

            console.error(error);

            alert(
                "Could not edit task."
            );

        }

    };



/* =====================================================
   SEARCH
===================================================== */


searchTask.addEventListener(
    "input",
    displayTasks
);



/* =====================================================
   FILTER
===================================================== */


filterPriority.addEventListener(
    "change",
    displayTasks
);



/* =====================================================
   STATISTICS
===================================================== */


function updateStatistics() {

    const total =
        tasks.length;


    const completed =
        tasks.filter(
            function (task) {

                return task.completed === true;

            }
        ).length;


    const pending =
        total - completed;


    totalTasks.textContent =
        total;


    completedTasks.textContent =
        completed;


    pendingTasks.textContent =
        pending;


    taskCount.textContent =
        total +
        (total === 1 ? " task" : " tasks");

}



/* =====================================================
   HTML SAFETY
===================================================== */


function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")

        .replaceAll("<", "&lt;")

        .replaceAll(">", "&gt;")

        .replaceAll('"', "&quot;")

        .replaceAll("'", "&#039;");

}