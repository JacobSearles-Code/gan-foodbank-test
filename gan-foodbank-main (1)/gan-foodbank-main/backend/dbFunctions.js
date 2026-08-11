import Database from 'better-sqlite3'
import * as Schema from  './dbSchema.js'

//create db object when module is loaded (file is created if it doesn't exist)
const db = new Database('GanFB.db')
db.pragma('journal_mode = WAL')
init()

//statements are pulled from dbSchema.js
export function init()
{
    console.log("Checking database schema...")
    //create tables 
    for(const table of Schema.tables){ 
        db.prepare(table).run()
    }
    //insert default data
    for(const data of Schema.defaultData){ 
        db.prepare(data).run()
    }
    //insert test data
    for(const testData of Schema.testData){ 
        db.prepare(testData).run()
    }
    console.log("Schema Updated\n")
}

export function close()
{
    db.close()
}

//
//SQLite commands (grouped by table)
//

//commands with parameters use binding
//all ?'s are replaced in order with arguments to .get , .all , and .run functions

//
//Users
//
export function getAllUsers()
{
    return db.prepare(`SELECT U.*, R.name as role_name FROM Users AS U LEFT JOIN Roles as R ON U.role = R.role_id`).all()
}

export function getUserById(id)
{
    return db.prepare(`SELECT U.*, R.name as role_name FROM Users AS U LEFT JOIN Roles as R ON U.role = R.role_id WHERE user_id=?`).get(id)
}

export function AddUser(firstName, lastName, role, password)
{
    return db.prepare(
        `INSERT INTO Users (first_name, last_name, role, password)
         VALUES (?,?,?,?)
        `
    ).run(firstName, lastName, role, password)
}

export function UpdateUser(id, newFName, newLName, newRole, newPassword)
{
    return db.prepare(
        `UPDATE Users SET first_name=?, last_name=?, role=?, password=?
         WHERE user_id=?
        `
    ).run(newFName, newLName, newRole, newPassword, id)
}

export function deleteUser(id)
{
    return db.prepare(`DELETE FROM Users WHERE user_id=?`).run(id)
}

//
//Roles
//
export function getRoles()
{
    return db.prepare(`SELECT * FROM Roles`).all()
} 

//
//Inventory
//
export function getInventory()
{
    return db.prepare(
        `
        SELECT I.*, C.name as category_name, U.name as unit_name FROM Inventory as I 
        LEFT JOIN Categories as C ON I.category = C.category_id 
        LEFT JOIN Units as U ON I.unit = U.unit_id
        `
    ).all()
}

export function getInvItemById(id)
{
    return db.prepare(
        `
        SELECT I.*, C.name as category_name, U.name as unit_name FROM Inventory as I 
        LEFT JOIN Categories as C ON I.category = C.category_id 
        LEFT JOIN Units as U ON I.unit = U.unit_id
        WHERE item_id=?
        `
    ).get(id)
} 

//default unit and size until add function can be refactored
export function AddInvItem(name,category,stock,par,unit=1,size="100 m/l")
{
    return db.prepare(
        `INSERT INTO Inventory (name, category, stock, par, unit, size)
         VALUES (?,?,?,?,?,?)
        `
    ).run(name,category,stock,par,unit,size)
}

//default unit and size until update function can be refactored
export function UpdateInvItem(id, newName, newCategory, newStock, newPar, newUnit=1, newSize="100 m/l")
{
    return db.prepare(
        `UPDATE Inventory SET name=?, category=?, stock=?, par=?, unit=?, size=?
         WHERE item_id=?
        `
    ).run(newName, newCategory, newStock, newPar, newUnit, newSize, id)
}

export function deleteInvItem(id)
{
    return db.prepare(`DELETE FROM Inventory WHERE item_id=?`).run(id)
}

//
//Categories
//
export function getCategories()
{
    return db.prepare(`SELECT * FROM Categories`).all()
} 

//
//Units
//
export function getUnits()
{
    return db.prepare(`SELECT * FROM Units`).all()
} 

//
//Orders
//
export function getOrders()
{
    return db.prepare(`SELECT O.*, S.name as status_name FROM Orders AS O LEFT JOIN Status AS S ON O.status = S.status_id`).all()
}

export function getOrderById(id)
{
    return db.prepare(`SELECT O.*, S.name as status_name FROM Orders AS O LEFT JOIN Status AS S ON O.status = S.status_id WHERE order_id=?`).get(id)
} 

export function addOrder(path)
{
    return db.prepare(
        `INSERT INTO Orders (created_date, path) 
        VALUES (datetime('now', 'localtime'), ?)
        `
    ).run(path)
}

export function updateOrder(id, newReceivedDate, newStatus)
{
    return db.prepare(
        `UPDATE Orders SET received_date=?, status=?
         WHERE order_id=?
        `
    ).run(newReceivedDate, newStatus, id)
}

export function deleteOrder(id)
{
    return db.prepare(`DELETE FROM Orders WHERE order_id=?`).run(id)
}