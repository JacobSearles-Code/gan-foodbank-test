//The purpose of this file is to allow the creation of the DB file in place
//All the relevant SQL commands to do so will live here (tables, data, test-data, etc.)
//IF NOT EXITS and INSERT OR REPLACE should prevent duplicate tables and records and allow quick changes

//SQL commands for creating tables (DB file must be deleted to recreate tables)
export const tables = [
    `CREATE TABLE IF NOT EXISTS "Categories" (
        "category_id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("category_id" AUTOINCREMENT)
    );`,
    `CREATE TABLE IF NOT EXISTS "Units" (
        "unit_id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("unit_id" AUTOINCREMENT)
    );`,
    `CREATE TABLE IF NOT EXISTS "Inventory" (
        "item_id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL UNIQUE,
        "category"	INTEGER,
        "stock"	INTEGER,
        "unit" INTEGER DEFAULT 1,
        "par"	INTEGER DEFAULT (NULL),
        "size" TEXT,
        PRIMARY KEY("item_id" AUTOINCREMENT),
        FOREIGN KEY("category") REFERENCES "Categories"("category_id") ON UPDATE CASCADE ON DELETE SET NULL
        FOREIGN KEY("unit") REFERENCES "Units"("unit_id") ON UPDATE CASCADE ON DELETE SET NULL
    );`,
    `CREATE TABLE IF NOT EXISTS "Roles" (
        "role_id"	INTEGER NOT NULL UNIQUE,
        "name"	TEXT NOT NULL UNIQUE,
        PRIMARY KEY("role_id" AUTOINCREMENT)
    );`,
    `CREATE TABLE IF NOT EXISTS "Users" (
        "user_id"	INTEGER NOT NULL UNIQUE,
        "first_name"	TEXT NOT NULL,
        "last_name"	TEXT,
        "role"	INTEGER,
        "password"	TEXT NOT NULL,
        PRIMARY KEY("user_id" AUTOINCREMENT),
        FOREIGN KEY("role") REFERENCES "Roles"("role_id") ON UPDATE CASCADE ON DELETE SET NULL
    );`,
    `CREATE TABLE IF NOT EXISTS "Status" (
        "status_id"	    INTEGER NOT NULL UNIQUE,
        "name"	        TEXT    NOT NULL UNIQUE,
        PRIMARY KEY("status_id" AUTOINCREMENT)
    );`,
    `CREATE TABLE IF NOT EXISTS "Orders" (
	    "order_id"	INTEGER NOT NULL UNIQUE,
	    "created_date"	TEXT NOT NULL,
	    "received_date"	TEXT,
	    "status"	INTEGER DEFAULT 1,
	    "path"	TEXT,
	    PRIMARY KEY("order_id" AUTOINCREMENT),
	    FOREIGN KEY("status") REFERENCES "Status"("status_id") ON UPDATE CASCADE ON DELETE SET NULL
    );`
]

//default data (categories, roles, status)
export const defaultData = [
    `INSERT OR REPLACE INTO "Categories" VALUES 
        (1,'General'),
        (2,'Fridge'),
        (3,'Fresh Fruit'),
        (4,'Fresh Veg'),
        (5,'Hygiene'),
        (6,'Household Products'),
        (7,'Freezer'),
        (9,'Canned Goods'),
        (10,'Pets'),
        (11,'Baby'),
        (13,'TestCategory2'),
        (14,'TestCategory3'),
        (15,'TestCategory5');
    `,
    `INSERT OR REPLACE INTO "Units" VALUES 
        (1,'Cans'),
        (2,'Boxes'),
        (3,'lbs');
    `,
    `INSERT OR REPLACE INTO "Roles" VALUES 
        (1,'admin'),
        (2,'volunteer');
    `,
    `INSERT OR REPLACE INTO "Status" VALUES 
        (1,'open'),
        (2,'partial'),
        (3,'filled');
    `
]

//test data
export const testData = [
    `INSERT OR REPLACE INTO "Inventory" VALUES 
        (1,'Soup',9,27,1,10,'100 m/l'),
        (2,'Chunky Soup',9,15,1,10,'100 m/l'),
        (3,'Canned Ham',9,7,1,10,'100 m/l'),
        (4,'Canned Tuna',9,9,1,10,'100 m/l'),
        (5,'Canned Turkey',9,12,1,10,'100 m/l'),
        (6,'Canned Vegetables',9,7,1,10,'100 m/l'),
        (7,'Canned Tomatoes',9,6,1,10,'100 m/l'),
        (8,'Pasta Sauce',9,12,1,10,'100 m/l'),
        (9,'Chick Peas',9,9,1,10,'100 m/l'),
        (10,'Black Beans',9,5,1,10,'100 m/l'),
        (11,'Baked Beans',9,2,1,10,'100 m/l'),
        (12,'Ravioli Mixed',9,9,1,10,'100 m/l'),
        (13,'Canned Spam',9,13,1,10,'100 m/l'),
        (14,'Rice',1,30,1,10,'100 m/l'),
        (15,'Pasta',1,25,1,10,'100 m/l'),
        (16,'Kraft Dinner',1,40,1,10,'100 m/l'),
        (17,'Tea',1,12,1,10,'100 m/l'),
        (18,'Sugar',1,21,1,10,'100 m/l'),
        (19,'Powdered Milk',1,7,1,10,'100 m/l'),
        (20,'Canned Fruit',9,2,1,10,'100 m/l'),
        (21,'Crackers',1,8,1,10,'100 m/l'),
        (22,'Mustard',1,9,1,10,'100 m/l'),
        (23,'Relish',1,4,1,10,'100 m/l'),
        (25,'Mayo',1,2,1,10,'100 m/l'),
        (26,'Ketchup',1,5,1,10,'100 m/l'),
        (27,'Cookies',1,13,1,10,'100 m/l'),
        (28,'Granola',1,15,1,10,'100 m/l'),
        (29,'Margarine',2,4,1,10,'100 m/l'),
        (30,'Cheese',2,21,1,10,'100 m/l'),
        (31,'Eggs',2,40,1,10,'100 m/l'),
        (32,'Milk - Sleeve',2,18,1,10,'100 m/l'),
        (33,'Yogurt',2,27,1,10,'100 m/l'),
        (34,'Apples',3,14,1,10,'100 m/l'),
        (35,'Oranges',3,13,1,10,'100 m/l'),
        (36,'Pears',3,9,1,10,'100 m/l'),
        (37,'Potatoes',4,17,1,10,'100 m/l'),
        (38,'Onions',4,4,1,10,'100 m/l'),
        (39,'Carrots',5,32,1,10,'100 m/l'),
        (40,'Cake Mix + Icing',1,10,1,10,'100 m/l'),
        (41,'Pancake Mix + Syrup',1,5,1,10,'100 m/l'),
        (42,'Flour',1,12,1,10,'100 m/l'),
        (43,'Juice',1,17,1,10,'100 m/l'),
        (44,'Peanut Butter',1,5,1,10,'100 m/l'),
        (45,'Jam',1,9,1,10,'100 m/l'),
        (46,'Cereal',1,7,1,10,'100 m/l'),
        (47,'Oatmeal',1,4,1,10,'100 m/l'),
        (48,'Shampoo',5,3,1,10,'100 m/l'),
        (49,'Conditioner',5,9,1,10,'100 m/l'),
        (50,'Deodorant (F)',5,2,1,10,'100 m/l'),
        (51,'Deodorant (M)',5,4,1,10,'100 m/l'),
        (52,'Toothbrush',5,6,1,10,'100 m/l'),
        (53,'Tooth Paste',5,15,1,10,'100 m/l'),
        (54,'Paper Towel',6,7,1,10,'100 m/l'),
        (55,'Tissues',6,12,1,10,'100 m/l'),
        (56,'Dish Soap',6,4,1,10,'100 m/l'),
        (57,'Chicken',7,12,1,10,'100 m/l'),
        (58,'Ground Beef',7,16,1,10,'100 m/l'),
        (59,'Bacon',7,17,1,10,'100 m/l'),
        (60,'Pork',7,19,1,10,'100 m/l'),
        (61,'Sausage',7,5,1,10,'100 m/l'),
        (62,'Frozen Veg',7,3,1,10,'100 m/l'),
        (63,'Cat Food',10,17,1,10,'100 m/l'),
        (64,'Dog Food',10,15,1,10,'100 m/l'),
        (65,'Diapers',11,12,1,10,'100 m/l'),
        (66,'Baby Food',11,11,1,10,'100 m/l');
    `,
    `INSERT OR REPLACE INTO "Users" VALUES 
        (1,'Jarrod','Hoddinott',2,'123'),
        (2,'Maxwell','Schriner',2,'456'),
        (3,'Bob','Bobertson',1,'789'),
		(4,'Jacob','Searles',1,'321');
    `
]

/*
    `INSERT OR REPLACE INTO "Orders" VALUES 
        (1,datetime('now', 'localtime'),NULL,1,"./orders/2026-08-05 12-18-24.json"),
    `
*/
