//Sample database. Please modify this to suit your needs.
// Initialize database from localStorage or create a new one if it doesn't exist
var database = JSON.parse(localStorage.getItem("database")) || []

//Print to check if the database is populated correctly.
console.log(database);


//Create a variable to hold the maximum seen ID in your system. Useful later to create unique IDs for new expenses.
var maxId = database.length > 0 ? Math.max(...database.map(expense => expense[0])) : 0;


/*Q4: Function to Display
*/
function display()
    {   
        var tbl = document.getElementById("displayTable");
        var selectedCategory = document.getElementById("filterCategory").value;
        /* Display the expenses in the form of a table. 
        The for loop shown in lecture could draw only 1D table. Write your own code to create a 2D table.*/

        // error handling when table element not found
        if (!tbl) {
            console.error("table element not found");
            return;
        }

        // clear current table content
        tbl.innerHTML = "";

        // Filter by category
        let filteredData = [];

        if (selectedCategory === "All") {
            filteredData = database;
        }
        else {
            filteredData = database.filter(function(entry) {
                return entry[1] === selectedCategory;
            })
        }

        if (filteredData.length === 0) {
            const tr = tbl.insertRow();
            const td = tr.insertCell();
            td.colSpan = 6;
            td.appendChild(document.createTextNode(`No records were found under ${selectedCategory} category`));
            return;
        }

        // Display filtered entry
        for (let i = 0; i < filteredData.length; i++) {
            const tr = tbl.insertRow();
            tr.setAttribute('data-category', filteredData[i][1]);
            
            const currentSerialNumber = filteredData[i][0];

            // Add data cells
            for (let j = 0; j < filteredData[i].length; j++) {
                const td = tr.insertCell();
                td.appendChild(document.createTextNode(filteredData[i][j]));
            }

            // Add action button cells
            const actionCell = tr.insertCell();
            actionCell.className = 'action-buttons';
            
            // Add update buttons
            const updateBtn = document.createElement('button');
            updateBtn.textContent = 'Update';
            updateBtn.className = 'update-btn';
            updateBtn.onclick = function() {
                showTab('Update');
                document.getElementById('updateSerialNumber').value = currentSerialNumber;
            };
            
            // Add delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = function() {
                if (confirm('Are you sure you want to delete this record?')) {
                    document.getElementById('deleteSerialNumber').value = currentSerialNumber;
                    deletefn();
                    display(); // Refresh and display
                }
            };
            
            actionCell.appendChild(updateBtn);
            actionCell.appendChild(deleteBtn);
        }
    }

/*Q2: Function to ADD 
*/
function add()
{
    //Read Element values from the HTML using DOM read operations
    const category = document.getElementById("category").value;
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const amount = document.getElementById("amount").value;

    // Verify required fields
    if (!category || !title || !date || !amount || amount <= 0) {
        document.querySelector(".Addresult").textContent = "Please enter valid value for all required fields (category, title, date and amount)";
        return;
    }

    //check if values read are correct using console log
    console.log("Category:", category);
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Date:", date);
    console.log("Amount:", amount);

    //Add to the Database. Make sure to set the correct value of serial number. Javascript uses 0 based index, whereas common people use 1 based index.
    const serialNumber = ++maxId;

    // Add entry to database
    const newEntry = [serialNumber, category, title, description, date, parseFloat(amount)];
    database.push(newEntry);

    // Save the updated database to localStorage
    localStorage.setItem('database', JSON.stringify(database));

    // Display add result
    document.querySelector(".Addresult").textContent = "Expense added successfully!";
    console.log("Entry added:", newEntry);
    console.log("After added: ", database)

    // Clear current form
    document.getElementById("category").value = "";
    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("date").value = "";
    document.getElementById("amount").value = "";

    display();
    
}

/*Q3: Function to Update
*/
function update()
{
    //Read Element values from the HTML using DOM read operations
    const updateSerialNumber = parseInt(document.getElementById("updateSerialNumber").value);
    
    if (!updateSerialNumber) {
        document.querySelector(".Updateresult").textContent = "Please enter serial number!";
        return;
    }

    //Search and identify the right expense to update. Then, update the Database

    //Convert given expense id to database index
    let index = -1;
    for (let i = 0; i < database.length; i++) {
    if (database[i][0] === updateSerialNumber) {
        index = i;
        break;
    }
    }

    // If corresponding expense not found
    if (index === -1) {
        document.querySelector(".Updateresult").textContent = "Expense serial number not found!";
        return;
    }
    
    // Search current expense entry
    const currentExpense = database[index]

    //check if values read are correct using console log
    const updateCategory = document.getElementById("updateCategory").value || currentExpense[1];
    const updateTitle = document.getElementById("updateTitle").value || currentExpense[2];
    const updateDescription = document.getElementById("updateDescription").value || currentExpense[3];
    const updateDate = document.getElementById("updateDate").value || currentExpense[4];
    const updateAmount = parseFloat(document.getElementById("updateAmount").value || currentExpense[5]);
    
    console.log("Current index: ", index)
    console.log("Current expense: ",currentExpense)
    console.log("Update ID:", updateSerialNumber);  // id remains the same
    console.log("Update Category:", updateCategory);
    console.log("Update Title:", updateTitle);
    console.log("Update Description:", updateDescription);
    console.log("Update Date:", updateDate);
    console.log("Update Amount:", updateAmount);

    // Verify update fields
    if (updateAmount && (isNaN(updateAmount) || updateAmount <= 0)) {
        document.querySelector(".Updateresult").textContent = "Please enter a valid amount";
        return;
    }


    // Update dabases
    const updatedExpense = [updateSerialNumber, updateCategory, updateTitle, updateDescription, updateDate, updateAmount];
    database[index] = updatedExpense;
    
    // Store into localStorage
    localStorage.setItem('database', JSON.stringify(database));

    // Display add result
    document.querySelector(".Updateresult").textContent = "Update expense successfully!";
    console.log("Updated expense: ", updatedExpense)
    console.log("After update: ", database)

    // Clear form 
    document.getElementById("updateSerialNumber").value = "";
    document.getElementById("updateCategory").value = "";
    document.getElementById("updateTitle").value = "";
    document.getElementById("updateDescription").value = "";
    document.getElementById("updateDate").value = "";
    document.getElementById("updateAmount").value = "";

    display(); // Refresh and display

    }

function deletefn()
{
    //Read Element values from the HTML using DOM read operations
    const deleteSerialNumber = parseInt(document.getElementById("deleteSerialNumber").value);
    
    // Check if user enter id value 
    if (!deleteSerialNumber) {
        document.querySelector(".Deleteresult").textContent = "Please enter expense serial number!";
        return;
    }

    //Convert given expense id to database index
    let index = -1;
    for (let i = 0; i < database.length; i++) {
    if (database[i][0] === deleteSerialNumber) {
        index = i;
        break;
    }
    }

    // If corresponding expense not found
    if (index === -1) {
        document.querySelector(".Deleteresult").textContent = "Expense serial number not found!";
        return;
    }
    
    // Search current expense entry
    const currentExpense = database[index]

    //check if values read are correct using console log
    console.log("Current index: ", index)
    console.log("Current expense: ",currentExpense)


    //Search and identify the right expense to delete. Then, save the Database. Check if the item is deleted using console log!

    // Delete entry
    const deletedExpense = database.splice(index, 1)[0];
    console.log("Deleted expense: ", deletedExpense);

    // Subtract 1 from the Serial Number of subsequent records
    for (i=index; i < database.length; i++) {
        database[i][0] = database[i][0] - 1;
    }

    //Update max Serial Number
    maxId = database.length;

    localStorage.setItem('database', JSON.stringify(database));
    document.querySelector(".Deleteresult").textContent = "Delete expense successfully!"
    console.log("After deletion: ", database)
    document.getElementById("deleteSerialNumber").value = "";

    display();
}


function main(){
    // Only display Add tab during initialization
    showTab('Add');
    
    /* Q4:  Listener for Display Tab. 
    Write code to uniquely identify the Display Tab in the HTML document using getElementbyID.
    Attach an event listener to it.
    Make the event listener call display() function defined above.
    */
    document.getElementById("submitDisplayExpense").addEventListener("click", function(event) {
        event.preventDefault();
        display();
    });

    /* Q2:  Listener for Add button. 
    Write code to uniquely identify the addExpense in the HTML document using getElementbyID.
    Attach an event listener to it.
    Make the event listener call add() function defined above.
    */
    document.getElementById("submitAddExpense").addEventListener("click", function(event) {
        event.preventDefault();
        add();
    });

    /* Q3:  Listeners for Update and Delete button. 
    Write code to uniquely identify the updateExpense and deleteExpense in the HTML document using getElementbyId.
    Attach an event listener to each.
    Make the event listener call update() and delete() functions defined above.
    */

    // Update
    document.getElementById("submitUpdateExpense").addEventListener("click", function(event) {
        event.preventDefault();
        update();
    })

    // Delete
    document.getElementById("submitDeleteExpense").addEventListener("click", function(event) {
        event.preventDefault();
        if (confirm('Are you sure you want to delete this record?')) {
            document.getElementById('deleteSerialNumber').value =currentSerialNumber;
            deletefn();
            display(); // Refresh and display
            }
        })
     

}

/*Q1: Function to display only the tab that is selected in the navigation bar
Call this function from HTML (using onclick) with a different parameter depending on which nav button is pressed.
E.g., when Add is pressed, call showTab('Add')
Hidden property can be set using the syntax:
document.getElementById('Add').hidden = true
*/

function showTab(select) {
    // Define all possible tabs
    const tabs = ['Add', 'Update', 'Delete', 'Display'];
    
    // Iterate all the tabs
    tabs.forEach(tab => {
        // Retrieve corresponding DOM element
        const element = document.getElementById(tab)
        element.hidden = (tab !== select);
    })
}
