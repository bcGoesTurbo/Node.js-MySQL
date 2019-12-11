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
  viewProducts();
});

//Show the table with products
function viewProducts(answer) {
  var query = "SELECT item_id, product_name, department_name, price,stock_quantity FROM products";
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

	chooseProduct();
  });
}

function chooseProduct(){
	inquirer.prompt([
		{
		  name: "item",
		  type: "input",
		  message: "Enter the ID of the item you would like to purchase"
    },
    {
      name: "count",
      tyoe: "input",
      message: "How many would you like to buy?"
    }
  ]).then(function(answer)
  {
    connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products WHERE ?",
    {item_id: answer.item}, function(err, results) 
    {
      if (parseInt(answer.count) > results[0].stock_quantity){
        console.log("Insufficient quantity! We only have " + results[0].stock_quantity + " left");
        chooseProduct();
    }
    else
    {
      console.log("Confirming your purchase of " + answer.count + ' ' + 
      results[0].product_name + "/s total cost is: $" + parseInt(results[0].price) * parseInt(answer.count));
      var stockRemaining = results[0].stock_quantity - answer.count;
      console.log(stockRemaining);
      connection.query("UPDATE products SET ? WHERE ?",
      [{
        stock_quantity: stockRemaining
      },
      {
        item_id: answer.item
      }
    ],
    function(err){
      if(err) throw err;
    });
      console.log("Inventory updated. There are " + stockRemaining + " left");
      viewProducts();
    }
    })
  });
};

