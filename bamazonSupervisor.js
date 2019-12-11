// setup variables
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

// connecting to the SQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_DB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  menuOptions();
});

function menuOptions() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "doThing",
        message: "What would you like to do?",
        choices: [
          "View Product Sales by Department",
          "Create New Department",
          "Exit"
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.doThing) {
        case "View Product Sales by Department":
          viewProductSales();
          break;
        case "Create New Department":
            createNewDept();
          break;
        case "Exit":
          console.log("Bye!");
          connection.end();
          break;
      }
    });
}

function viewProductSales() {
  var query =
    "SELECT department_id, department_name, over_head_costs FROM departments";
  connection.query(query, function(err, results) {
    // instantiate
    var theDisplayTable = new Table({
      head: ["Department ID", "Department Name", "Overhead Costs"],
      colWidths: [10, 25, 25]
    });

    for (var i = 0; i < results.length; i++) {
      theDisplayTable.push([
        results[i].department_id,
        results[i].department_name,
        results[i].over_head_costs
      ]);
    }
    console.log(theDisplayTable.toString());
    menuOptions();
  });
}

function createNewDept() {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "Enter new department name:"
      },
      {
        name: "over_head_costs",
        type: "input",
        message: "New department over head costs:"
      }
    ])
    .then(function(answer) {
      // Department added to departments database.
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answer.department_name,
          over_head_costs: answer.over_head_costs
        },
        function(err, res) {
          if (err) {
            throw err;
          } else {
            console.log("Your department was added successfully!");
            menuOptions();
          }
        }
      );
    });
}

