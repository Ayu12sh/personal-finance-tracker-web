const form = document.getElementById("expense-form");
const expenseList = document.getElementById("expense-list");
const submitButton = form.querySelector('button[type="submit"]');

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// null means we are adding a new expense.
// A number means we are editing the expense at that position.
let editingIndex = null;

function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateTotal() {
    let totalCents = 0;

    expenses.forEach(function (expense) {
        totalCents += Math.round(Number(expense.amount) * 100);
    });

    document.getElementById("total-expenses").textContent =
        (totalCents / 100).toFixed(2);
}

function updateMonthlyTotal() {
    const selectedMonth = document.getElementById("month").value;
    let totalCents = 0;

    expenses.forEach(function (expense) {
        if (selectedMonth !== "" && expense.date.startsWith(selectedMonth)) {
            totalCents += Math.round(Number(expense.amount) * 100);
        }
    });

    document.getElementById("monthly-total").textContent =
        (totalCents / 100).toFixed(2);
}

function displayExpenses() {
    expenseList.innerHTML = "";

    expenses.forEach(function (expense, index) {
        const listItem = document.createElement("li");

        const details = document.createElement("span");
        details.textContent =
            `${expense.description} - $${expense.amount} - ` +
            `${expense.category} - ${expense.date} `;

        // Create the Edit button.
        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.type = "button";

        editButton.addEventListener("click", function () {
            // Put this expense's details back into the form.
            document.getElementById("description").value = expense.description;
            document.getElementById("amount").value = expense.amount;
            document.getElementById("category").value = expense.category;
            document.getElementById("date").value = expense.date;

            editingIndex = index;
            submitButton.textContent = "Save Changes";
            document.getElementById("description").focus();
        });

        // Create the Delete button.
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", function () {
            expenses.splice(index, 1);

            // Cancel any edit because deleting changes array positions.
            editingIndex = null;
            form.reset();
            submitButton.textContent = "Add Expense";

            saveExpenses();
            displayExpenses();
            updateTotal();
            updateMonthlyTotal();
        });

        listItem.appendChild(details);
        listItem.appendChild(editButton);
        listItem.appendChild(deleteButton);
        expenseList.appendChild(listItem);
    });
}

document.getElementById("month").addEventListener("change", updateMonthlyTotal);

displayExpenses();
updateTotal();
updateMonthlyTotal();

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const expense = {
        description: document.getElementById("description").value,
        amount: document.getElementById("amount").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    if (editingIndex === null) {
        // Add a new expense.
        expenses.push(expense);
    } else {
        // Replace the expense being edited.
        expenses[editingIndex] = expense;
    }

    saveExpenses();
    displayExpenses();
    updateTotal();
    updateMonthlyTotal();

    // Return the form to add mode.
    editingIndex = null;
    form.reset();
    submitButton.textContent = "Add Expense";
});