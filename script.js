/* =====================================================
   EQUIPMENT BORROWING MANAGEMENT SYSTEM
   Data Storage: Browser LocalStorage
===================================================== */


/* =====================================================
   STORAGE KEYS

   These act like our database tables.
===================================================== */

const EQUIPMENT_STORAGE_KEY = "ebms_equipment";
const TRANSACTION_STORAGE_KEY = "ebms_transactions";


/* =====================================================
   INITIAL EQUIPMENT DATA

   This data will only be used the first time
   the application is opened.
===================================================== */

const defaultEquipment = [
    {
        id: "EQ-001",
        name: "Dell Laptop",
        category: "Computer",
        status: "Available"
    },
    {
        id: "EQ-002",
        name: "Epson Projector",
        category: "Projector",
        status: "Available"
    },
    {
        id: "EQ-003",
        name: "Canon DSLR Camera",
        category: "Camera",
        status: "Available"
    },
    {
        id: "EQ-004",
        name: "Wireless Microphone Set",
        category: "Audio",
        status: "Available"
    },
    {
        id: "EQ-005",
        name: "Arduino Development Kit",
        category: "Electronics",
        status: "Available"
    },
    {
        id: "EQ-006",
        name: "Portable PA System",
        category: "Audio",
        status: "Available"
    }
];


/* =====================================================
   APPLICATION DATA
===================================================== */

let equipment = [];
let transactions = [];


/* =====================================================
   DOM ELEMENTS
   Stores commonly used page elements so we do not
   repeatedly search for them using getElementById().
===================================================== */

let elements = {};


/* =====================================================
   INITIALIZE APPLICATION
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* -----------------------------------------
       CACHE PAGE ELEMENTS
    ----------------------------------------- */

    elements = {

        borrowForm:
            document.getElementById("borrowForm"),

        equipmentSelect:
            document.getElementById("equipmentSelect"),

        borrowerName:
            document.getElementById("borrowerName"),

        borrowerType:
            document.getElementById("borrowerType"),

        borrowDate:
            document.getElementById("borrowDate"),

        expectedReturnDate:
            document.getElementById("expectedReturnDate"),

        borrowMessage:
            document.getElementById("borrowMessage"),

        equipmentTableBody:
            document.getElementById("equipmentTableBody"),

        equipmentCount:
            document.getElementById("equipmentCount"),

        returnTableBody:
            document.getElementById("returnTableBody"),

        transactionsTableBody:
            document.getElementById("transactionsTableBody"),

        transactionCount:
            document.getElementById("transactionCount"),

        recentTransactionsBody:
            document.getElementById("recentTransactionsBody"),

        totalEquipment:
            document.getElementById("totalEquipment"),

        availableEquipment:
            document.getElementById("availableEquipment"),

        borrowedEquipment:
            document.getElementById("borrowedEquipment"),

        pageTitle:
            document.getElementById("pageTitle"),

        toast:
            document.getElementById("toast"),

        logoutButton:
            document.getElementById("logoutButton")
    };


    /* -----------------------------------------
       INITIALIZE APPLICATION
    ----------------------------------------- */

    initializeStorage();

    loadData();

    setupNavigation();

    setupBorrowForm();

    setupLogout();

    setDefaultDates();

    renderAll();

});


/* =====================================================
   INITIALIZE LOCAL STORAGE
===================================================== */

function initializeStorage() {

    const existingEquipment =
        localStorage.getItem(EQUIPMENT_STORAGE_KEY);

    const existingTransactions =
        localStorage.getItem(TRANSACTION_STORAGE_KEY);


    // Create equipment data if it does not exist.
    if (existingEquipment === null) {

        localStorage.setItem(
            EQUIPMENT_STORAGE_KEY,
            JSON.stringify(defaultEquipment)
        );

    }


    // Create an empty transaction list if it does not exist.
    if (existingTransactions === null) {

        localStorage.setItem(
            TRANSACTION_STORAGE_KEY,
            JSON.stringify([])
        );

    }

}


/* =====================================================
   LOAD DATA FROM LOCAL STORAGE
===================================================== */

function loadData() {

    const storedEquipment =
        localStorage.getItem(EQUIPMENT_STORAGE_KEY);

    const storedTransactions =
        localStorage.getItem(TRANSACTION_STORAGE_KEY);


    equipment = storedEquipment
        ? JSON.parse(storedEquipment)
        : [];

    transactions = storedTransactions
        ? JSON.parse(storedTransactions)
        : [];

}


/* =====================================================
   SAVE EQUIPMENT
===================================================== */

function saveEquipment() {

    localStorage.setItem(
        EQUIPMENT_STORAGE_KEY,
        JSON.stringify(equipment)
    );

}


/* =====================================================
   SAVE TRANSACTIONS
===================================================== */

function saveTransactions() {

    localStorage.setItem(
        TRANSACTION_STORAGE_KEY,
        JSON.stringify(transactions)
    );

}


/* =====================================================
   NAVIGATION
===================================================== */

function setupNavigation() {

    const navigationButtons =
        document.querySelectorAll("[data-section]");


    navigationButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const sectionId =
                button.getAttribute("data-section");

            showSection(sectionId);

        });

    });

}


function showSection(sectionId) {

    const sections =
        document.querySelectorAll(".page-section");

    const navigationButtons =
        document.querySelectorAll(".nav-link");


    // Hide all sections.
    sections.forEach(function (section) {

        section.classList.remove("active-section");

    });


    // Remove active state from navigation.
    navigationButtons.forEach(function (button) {

        button.classList.remove("active");

    });


    // Show selected section.
    const selectedSection =
        document.getElementById(sectionId);

    if (selectedSection) {

        selectedSection.classList.add("active-section");

    }


    // Highlight corresponding navigation button.
    navigationButtons.forEach(function (button) {

        if (button.getAttribute("data-section") === sectionId) {

            button.classList.add("active");

        }

    });


    // Update page title.
    updatePageTitle(sectionId);

}


/* =====================================================
   PAGE TITLE
===================================================== */

function updatePageTitle(sectionId) {

    const titles = {

        dashboardSection: "Dashboard",

        equipmentSection: "Equipment",

        borrowSection: "Borrow Equipment",

        returnSection: "Return Equipment",

        transactionsSection: "Transactions"

    };


    elements.pageTitle.textContent =
        titles[sectionId] || "Dashboard";

}


/* =====================================================
   RENDER EVERYTHING
===================================================== */

function renderAll() {

    renderDashboard();

    renderEquipment();

    renderEquipmentOptions();

    renderReturnTable();

    renderTransactions();

    renderRecentTransactions();

}


/* =====================================================
   DASHBOARD
===================================================== */

function renderDashboard() {

    const total =
        equipment.length;


    const available =
        equipment.filter(function (item) {

            return item.status === "Available";

        }).length;


    const borrowed =
        equipment.filter(function (item) {

            return item.status === "Borrowed";

        }).length;


    elements.totalEquipment.textContent =
        total;

    elements.availableEquipment.textContent =
        available;

    elements.borrowedEquipment.textContent =
        borrowed;

}


/* =====================================================
   EQUIPMENT TABLE
===================================================== */

function renderEquipment() {

    const tableBody =
        elements.equipmentTableBody;

    const equipmentCount =
        elements.equipmentCount;


    tableBody.innerHTML = "";


    equipmentCount.textContent =
        `${equipment.length} items`;


    if (equipment.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-message">
                    No equipment records found.
                </td>
            </tr>
        `;

        return;

    }


    equipment.forEach(function (item) {

        const row =
            document.createElement("tr");


        let actionHTML = "";


        if (item.status === "Available") {

            actionHTML = `
                <button
                    class="secondary-button"
                    onclick="prepareBorrow('${item.id}')">
                    Borrow
                </button>
            `;

        } else {

            actionHTML = `
                <span class="disabled-button">
                    Currently Borrowed
                </span>
            `;

        }


        row.innerHTML = `

            <td>${item.id}</td>

            <td>
                <strong>${escapeHTML(item.name)}</strong>
            </td>

            <td>${escapeHTML(item.category)}</td>

            <td>
                ${createStatusBadge(item.status)}
            </td>

            <td>
                ${actionHTML}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   EQUIPMENT SELECT OPTIONS
===================================================== */

function renderEquipmentOptions() {

    const select =
        elements.equipmentSelect;


    select.innerHTML = `
        <option value="">
            Select available equipment
        </option>
    `;


    const availableEquipment =
        equipment.filter(function (item) {

            return item.status === "Available";

        });


    availableEquipment.forEach(function (item) {

        const option =
            document.createElement("option");

        option.value = item.id;

        option.textContent =
            `${item.id} - ${item.name}`;

        select.appendChild(option);

    });

}


/* =====================================================
   PREPARE BORROW FORM
===================================================== */

function prepareBorrow(equipmentId) {

    showSection("borrowSection");


    const equipmentSelect =
        elements.equipmentSelect;


    equipmentSelect.value =
        equipmentId;


    equipmentSelect.focus();

}


/* =====================================================
   BORROW FORM
===================================================== */

function setupBorrowForm() {

    const borrowForm =
        elements.borrowForm;


    borrowForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const equipmentId =
            elements.equipmentSelect.value;

        const borrowerName =
            elements.borrowerName.value.trim();

        const borrowerType =
            elements.borrowerType.value;

        const borrowDate =
            elements.borrowDate.value;

        const expectedReturnDate =
            elements.expectedReturnDate.value;


        /* -----------------------------------------
           BASIC VALIDATION
        ----------------------------------------- */

        if (
            !equipmentId ||
            !borrowerName ||
            !borrowerType ||
            !borrowDate ||
            !expectedReturnDate
        ) {

            showBorrowMessage(
                "Please complete all required fields.",
                "error"
            );

            return;

        }


        /* -----------------------------------------
           DATE VALIDATION
        ----------------------------------------- */

        const today =
            getTodayDate();


        if (borrowDate < today) {

            showBorrowMessage(
                "Borrowing date cannot be earlier than today.",
                "error"
            );

            return;

        }


        if (expectedReturnDate < borrowDate) {

            showBorrowMessage(
                "Expected return date cannot be earlier than the borrowing date.",
                "error"
            );

            return;

        }


        /* -----------------------------------------
           FIND EQUIPMENT
        ----------------------------------------- */

        const selectedEquipment =
            equipment.find(function (item) {

                return item.id === equipmentId;

            });


        if (!selectedEquipment) {

            showBorrowMessage(
                "The selected equipment could not be found.",
                "error"
            );

            return;

        }


        /* -----------------------------------------
           PREVENT BORROWING UNAVAILABLE EQUIPMENT
        ----------------------------------------- */

        if (selectedEquipment.status !== "Available") {

            showBorrowMessage(
                "This equipment is currently unavailable.",
                "error"
            );

            return;

        }


        /* -----------------------------------------
           CONFIRM BORROWING
        ----------------------------------------- */

        const confirmed =
            confirm(
                `Confirm borrowing of ${selectedEquipment.name} by ${borrowerName}?`
            );


        if (!confirmed) {

            return;

        }


        /* -----------------------------------------
           CREATE TRANSACTION
        ----------------------------------------- */

        const newTransaction = {

            id: generateTransactionId(),

            equipmentId: selectedEquipment.id,

            equipmentName: selectedEquipment.name,

            borrowerName: borrowerName,

            borrowerType: borrowerType,

            borrowDate: borrowDate,

            expectedReturnDate: expectedReturnDate,

            actualReturnDate: "",

            status: "Borrowed"

        };


        transactions.push(newTransaction);


        /* -----------------------------------------
           UPDATE EQUIPMENT STATUS
        ----------------------------------------- */

        selectedEquipment.status =
            "Borrowed";


        /* -----------------------------------------
           SAVE DATA
        ----------------------------------------- */

        saveEquipment();

        saveTransactions();


        /* -----------------------------------------
           RESET FORM
        ----------------------------------------- */

        borrowForm.reset();

        setDefaultDates();


        /* -----------------------------------------
           UPDATE DISPLAY
        ----------------------------------------- */

        renderAll();


        showBorrowMessage(
            "Borrowing transaction recorded successfully.",
            "success"
        );


        showToast(
            "Equipment successfully borrowed.",
            "success"
        );

    });

}


/* =====================================================
   RETURN TABLE
===================================================== */

function renderReturnTable() {

    const tableBody =
        elements.returnTableBody;


    tableBody.innerHTML = "";


    const borrowedTransactions =
        transactions.filter(function (transaction) {

            return transaction.status === "Borrowed";

        });


    if (borrowedTransactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="empty-message">
                    There are currently no borrowed equipment items.
                </td>
            </tr>
        `;

        return;

    }


    borrowedTransactions.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(transaction.equipmentName)}
                </strong>
            </td>

            <td>
                ${escapeHTML(transaction.borrowerName)}
            </td>

            <td>
                ${formatDate(transaction.borrowDate)}
            </td>

            <td>
                ${formatDate(transaction.expectedReturnDate)}
            </td>

            <td>
                ${createStatusBadge(transaction.status)}
            </td>

            <td>

                <button
                    class="return-button"
                    onclick="returnEquipment('${transaction.id}')">
                    Record Return
                </button>

            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   RETURN EQUIPMENT
===================================================== */

function returnEquipment(transactionId) {

    const transaction =
        transactions.find(function (item) {

            return item.id === transactionId;

        });


    if (!transaction) {

        showToast(
            "Transaction could not be found.",
            "error"
        );

        return;

    }


    if (transaction.status !== "Borrowed") {

        showToast(
            "This transaction has already been returned.",
            "error"
        );

        return;

    }


    const confirmed =
        confirm(
            `Record the return of ${transaction.equipmentName}?`
        );


    if (!confirmed) {

        return;

    }


    /* -----------------------------------------
       UPDATE TRANSACTION
    ----------------------------------------- */

    transaction.actualReturnDate =
        getTodayDate();


    transaction.status =
        "Returned";


    /* -----------------------------------------
       UPDATE EQUIPMENT
    ----------------------------------------- */

    const returnedEquipment =
        equipment.find(function (item) {

            return item.id === transaction.equipmentId;

        });


    if (returnedEquipment) {

        returnedEquipment.status =
            "Available";

    }


    /* -----------------------------------------
       SAVE DATA
    ----------------------------------------- */

    saveEquipment();

    saveTransactions();


    /* -----------------------------------------
       UPDATE DISPLAY
    ----------------------------------------- */

    renderAll();


    showToast(
        "Equipment return recorded successfully.",
        "success"
    );

}


/* =====================================================
   TRANSACTION TABLE
===================================================== */

function renderTransactions() {

    const tableBody =
        elements.transactionsTableBody;

    const transactionCount =
        elements.transactionCount;


    tableBody.innerHTML = "";


    transactionCount.textContent =
        `${transactions.length} records`;


    if (transactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" class="empty-message">
                    No transaction records found.
                </td>
            </tr>
        `;

        return;

    }


    // Display newest transactions first.
    const sortedTransactions =
        [...transactions].reverse();


    sortedTransactions.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        const actualReturn =
            transaction.actualReturnDate
                ? formatDate(transaction.actualReturnDate)
                : "—";


        row.innerHTML = `

            <td>${transaction.id}</td>

            <td>
                ${escapeHTML(transaction.equipmentName)}
            </td>

            <td>
                ${escapeHTML(transaction.borrowerName)}
            </td>

            <td>
                ${transaction.borrowerType}
            </td>

            <td>
                ${formatDate(transaction.borrowDate)}
            </td>

            <td>
                ${formatDate(transaction.expectedReturnDate)}
            </td>

            <td>
                ${actualReturn}
            </td>

            <td>
                ${createStatusBadge(transaction.status)}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   RECENT TRANSACTIONS
===================================================== */

function renderRecentTransactions() {

    const tableBody =
        elements.recentTransactionsBody;


    tableBody.innerHTML = "";


    const recentTransactions =
        [...transactions]
            .reverse()
            .slice(0, 5);


    if (recentTransactions.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-message">
                    No recent transactions.
                </td>
            </tr>
        `;

        return;

    }


    recentTransactions.forEach(function (transaction) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHTML(transaction.equipmentName)}
            </td>

            <td>
                ${escapeHTML(transaction.borrowerName)}
            </td>

            <td>
                ${formatDate(transaction.borrowDate)}
            </td>

            <td>
                ${createStatusBadge(transaction.status)}
            </td>

        `;


        tableBody.appendChild(row);

    });

}


/* =====================================================
   STATUS BADGE
===================================================== */

function createStatusBadge(status) {

    let className =
        "status-badge";


    if (status === "Available") {

        className += " status-available";

    }

    else if (status === "Borrowed") {

        className += " status-borrowed";

    }

    else if (status === "Returned") {

        className += " status-returned";

    }


    return `
        <span class="${className}">
            ${status}
        </span>
    `;

}


/* =====================================================
   GENERATE TRANSACTION ID
===================================================== */

function generateTransactionId() {

    const nextNumber =
        transactions.length + 1;


    return `TRX-${String(nextNumber).padStart(3, "0")}`;

}


/* =====================================================
   GET TODAY'S DATE
===================================================== */

function getTodayDate() {

    const today =
        new Date();


    const year =
        today.getFullYear();


    const month =
        String(today.getMonth() + 1).padStart(2, "0");


    const day =
        String(today.getDate()).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =====================================================
   SET DEFAULT DATES
===================================================== */

function setDefaultDates() {

    const borrowDate =
        elements.borrowDate;

    const expectedReturnDate =
        elements.expectedReturnDate;


    const today =
        new Date();


    const tomorrow =
        new Date();


    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    borrowDate.value =
        formatDateForInput(today);


    expectedReturnDate.value =
        formatDateForInput(tomorrow);

}


/* =====================================================
   FORMAT DATE FOR INPUT
===================================================== */

function formatDateForInput(date) {

    const year =
        date.getFullYear();


    const month =
        String(date.getMonth() + 1).padStart(2, "0");


    const day =
        String(date.getDate()).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =====================================================
   FORMAT DATE FOR DISPLAY
===================================================== */

function formatDate(dateString) {

    if (!dateString) {

        return "—";

    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {

        return dateString;

    }


    return `${parts[1]}/${parts[2]}/${parts[0]}`;

}


/* =====================================================
   BORROW FORM MESSAGE
===================================================== */

function showBorrowMessage(message, type) {

    const messageElement =
        elements.borrowMessage;


    messageElement.textContent =
        message;


    messageElement.className =
        `form-message ${type}`;

}


/* =====================================================
   TOAST MESSAGE
===================================================== */

function showToast(message, type) {

    const toast =
        elements.toast;


    toast.textContent =
        message;


    toast.className =
        `toast ${type} show`;


    setTimeout(function () {

        toast.classList.remove("show");

    }, 3000);

}


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {

    const logoutButton =
        elements.logoutButton;


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmed =
                confirm(
                    "Are you sure you want to log out?"
                );


            if (!confirmed) {
                return;
            }


            // Remove the login session.
            sessionStorage.removeItem(
                "ebms_logged_in"
            );


            // Return to login page.
            window.location.href =
                "login.html";

        }
    );

}


/* =====================================================
   BASIC HTML SAFETY
===================================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}