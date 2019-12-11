DROP DATABASE IF EXISTS bamazon_DB;

-- Create a database called 'Bamazon'
CREATE database bamazon_DB;

USE bamazon_DB;

CREATE TABLE products(
	item_id INT(10) AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(100) NOT NULL,
    PRIMARY KEY (item_id)
);

Select * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("laptop", "computers", 1200.00, 15),
		("drill", "power tools", 80.50, 10),
        ("Rose", "plants", 55.25, 8),
        ("tv", "TV's", 2543.50, 3),
        ("bbq", "outdoor living", 5550.00, 2),
        ("iphone", "mobile phones", 1100.00, 20),
		("ps4", "gaming", 400.00, 10),
		("ipad", "tablets", 1200.00, 20),
		("Samsung_Galaxy", "mobile phones", 1299.00, 20),
		("laptop", "computers", 3400.00, 10);
        
CREATE TABLE departments(
	department_id INT(10) AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(100) NOT NULL,
	over_head_costs DECIMAL(10,2) NOT NULL,
	PRIMARY KEY (department_id)
    );
Select * From departments;
   
ALTER TABLE products ADD COLUMN product_sales DECIMAL(10,2) DEFAULT '0.00';

INSERT INTO departments(department_name, over_head_costs)
VALUES
("computers", 2000),
("mobile phones", 1000),
("gaming", 300),
("power tools", 400),
("plants", 50),
("TV's", 800),
("tablets", 700),
("outdoor living", 300);

-- SELECT departments.department_name, departments.over_head_costs, products.product_sales
-- FROM departments
-- INNER JOIN products
-- ON departments.department_name = products.department_name;

-- SELECT department_name AS 'Department', SUM(departments.over_head_costs) AS 'Overhead Cost', SUM(products.product_sales) AS 'Total Sales' 
-- FROM departments
-- INNER JOIN `departments` on products.department_name=departments.department_name
-- GROUP BY departments.department_name;

-- SELECT department_name AS 'Department', SUM(departments.over_head_costs) AS 'Overhead Cost' FROM departments GROUP BY departments.department_name;	

-- SELECT department_name AS 'Department', SUM(products.product_sales) AS 'Total Sales' FROM products GROUP BY products.department_name;	