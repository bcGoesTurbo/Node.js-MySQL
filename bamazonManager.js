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
          "View Products for Sale",
          "View Low Inventory",
          "Add to Inventory",
          "Add New Product",
          "Exit"
        ]
      }
    ])
    .then(function(answer) {
      switch (answer.doThing) {
        case "View Products for Sale":
          viewProducts();
          break;
        case "View Low Inventory":
          viewLowInventory();
          break;
        case "Add to Inventory":
          addToInventory();
          break;
        case "Add New Product":
          addNewProduct();
          break;
        case "Exit":
          console.log("Bye!");
          connection.end();
          break;
      }
    });
}
//View the table with products
function viewProducts(answer) {
  var query =
    "SELECT item_id, product_name, department_name, price,stock_quantity FROM products";
  connection.query(query, function(err, results) {
    // instantiate
    var theDisplayTable = new Table({
      head: ["Item ID", "Product Name", "Department Name", "Price", "Quantity"],
      colWidths: [10, 25, 25, 10, 10]
    });

    for (var i = 0; i < results.length; i++) {
      theDisplayTable.push([
        results[i].item_id,
        results[i].product_name,
        results[i].department_name,
        results[i].price,
        results[i].stock_quantity
      ]);
    }
    console.log(theDisplayTable.toString());
    menuOptions();
  });
}

//function to View Low Inventory.
function viewLowInventory() {
  //query database to list items with an inventory count lower than five.
  var query = "SELECT * FROM products WHERE stock_quantity <=5";
  connection.query(query, function(err, res) {
    if (err) throw err;

    //display the table using cli-table.
    var theDisplayTable = new Table({
      head: ["Item ID", "Product Name", "Department Name", "Price", "Quantity"],
      colWidths: [10, 25, 25, 10, 10]
    });

    for (var i = 0; i < res.length; i++) {
      theDisplayTable.push([
        res[i].item_id,
        res[i].product_name,
        res[i].department_name,
        res[i].price,
        res[i].stock_quantity
      ]);
    }
    console.log(theDisplayTable.toString());
    menuOptions();
  });
}

//function to Add to Inventory
function addToInventory() {
  //prompt questions to get selected item id and quantity
  inquirer
    .prompt([
      {
        type: "input",
        name: "itemID",
        message:
          "What is the ID of the item you would like to add more quantity?",
        //users need to enter number
        validate: function(inputID) {
          if (!isNaN(inputID)) {
            return true;
          }
          console.log("Please enter a valid ID.");
          return false;
        }
      },
      {
        type: "input",
        name: "quantity",
        message: "How many would you like to add to the inventory?",
        //users need to enter number
        validate: function(inputQty) {
          if (!isNaN(inputQty)) {
            return true;
          }
          console.log("Please enter a valid quantity.");
          return false;
        }
      }
    ])
    .then(function(answer) {
      connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;

        //if users enter an item ID outside total items range, then throw error message.
        if (
          parseInt(answer.itemID) > res.length ||
          parseInt(answer.itemID) <= 0
        ) {
          console.log("Please enter a valid ID.");
        }

        //otherwise, proceed to loop through the data and find matched item id as the selected item
        var chosenItem = "";
        for (var i = 0; i < res.length; i++) {
          if (res[i].item_id === parseInt(answer.itemID)) {
            chosenItem = res[i];
          }
        }

        //update the quantity for selected item id
        connection.query(
          "UPDATE products SET ? WHERE ?",
          [
            {
              stock_quantity: (chosenItem.stock_quantity += parseInt(
                answer.quantity
              ))
            },
            {
              item_id: chosenItem.item_id
            }
          ],
          function(error) {
            if (error) throw err;
            //show message that certain product and its quantity has been updated in the inventory.
            console.log(
              "Successfully updated/added " +
                answer.quantity +
                " " +
                chosenItem.product_name +
                " to the inventory."
            );
            viewProducts();
          }
        );
      });
    });
}

//function to Add New Product
function addNewProduct() {
  //prompt questions to get product name, department, cost, and quantity for the new product
  inquirer
    .prompt([
      {
        type: "input",
        name: "newProductName",
        message: "What is the name of the product you would like to add?"
      },
      {
        type: "list",
        name: "department",
        message: "Which department does this product fall into?",
        choices: ["Computers", "Gaming", "Mobile Phones", "Outdoor Living", "Plants", "Power Tools", "Tablets", "TV's"]
      },
      {
        type: "input",
        name: "cost",
        message: "How much does it cost?",
        validate: function(cost) {
          if (!isNaN(cost)) {
            return true;
          }
          console.log("Please enter a valid cost.");
          return false;
        }
      },
      {
        type: "input",
        name: "iniQuantity",
        message: "How many do we have?",
        validate: function(iniQuantity) {
          if (!isNaN(iniQuantity)) {
            return true;
          }
          console.log("Please enter a valid quantity.");
          return false;
        }
      }
    ])
    .then(function(answers) {
      //grab the new product info from answer and add to (insert into) the database table
      var queryString = "INSERT INTO products SET ?";
      connection.query(queryString, {
        product_name: answers.newProductName,
        department_name: answers.department,
        price: answers.cost,
        stock_quantity: answers.iniQuantity
      });

      //show message that the product has been added.
      console.log(answers.newProductName + " has been added to Bamazon.");

      menuOptions();
    });
}
