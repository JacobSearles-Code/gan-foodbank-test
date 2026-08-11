//
// Cloudflare D1 database functions
//
// D1 is asynchronous, so all database functions return Promises.
// Pass env.DB into these functions from your Worker.
//

//
// Users
//

export async function getAllUsers(db) {
    const result = await db
        .prepare(`
SELECT U.*, R.name AS role_name
FROM Users AS U
LEFT JOIN Roles AS R ON U.role = R.role_id
    `)
        .all();

    return result.results;
}

export async function getUserById(db, id) {
    return await db
        .prepare(`
SELECT U.*, R.name AS role_name
FROM Users AS U
LEFT JOIN Roles AS R ON U.role = R.role_id
WHERE user_id = ?
    `)
        .bind(id)
        .first();
}

export async function AddUser(db, firstName, lastName, role, password) {
    return await db
        .prepare(`
    INSERT INTO Users (first_name, last_name, role, password)
VALUES (?, ?, ?, ?)
    `)
        .bind(firstName, lastName, role, password)
        .run();
}

export async function UpdateUser(
    db,
    id,
    newFName,
    newLName,
    newRole,
    newPassword
) {
    return await db
        .prepare(`
UPDATE Users
SET first_name = ?,
    last_name = ?,
    role = ?,
    password = ?
        WHERE user_id = ?
            `)
        .bind(newFName, newLName, newRole, newPassword, id)
        .run();
}

export async function deleteUser(db, id) {
    return await db
        .prepare(`
            DELETE FROM Users
WHERE user_id = ?
    `)
        .bind(id)
        .run();
}

//
// Roles
//

export async function getRoles(db) {
    const result = await db
        .prepare(`
    SELECT *
    FROM Roles
    `)
        .all();

    return result.results;
}

//
// Inventory
//

export async function getInventory(db) {
    const result = await db
        .prepare(`
SELECT
I.*,
    C.name AS category_name,
    U.name AS unit_name
FROM Inventory AS I
LEFT JOIN Categories AS C
ON I.category = C.category_id
LEFT JOIN Units AS U
ON I.unit = U.unit_id
    `)
        .all();

    return result.results;
}

export async function getInvItemById(db, id) {
    return await db
        .prepare(`
SELECT
I.*,
    C.name AS category_name,
    U.name AS unit_name
FROM Inventory AS I
LEFT JOIN Categories AS C
ON I.category = C.category_id
LEFT JOIN Units AS U
ON I.unit = U.unit_id
WHERE item_id = ?
    `)
        .bind(id)
        .first();
}

// Default unit and size retained from original application.
export async function AddInvItem(
    db,
    name,
    category,
    stock,
    par,
    unit = 1,
    size = "100 m/l"
) {
    return await db
        .prepare(`
    INSERT INTO Inventory
(name, category, stock, par, unit, size)
VALUES (?, ?, ?, ?, ?, ?)
    `)
        .bind(name, category, stock, par, unit, size)
        .run();
}

// Default unit and size retained from original application.
export async function UpdateInvItem(
    db,
    id,
    newName,
    newCategory,
    newStock,
    newPar,
    newUnit = 1,
    newSize = "100 m/l"
) {
    return await db
        .prepare(`
UPDATE Inventory
SET name = ?,
    category = ?,
    stock = ?,
    par = ?,
    unit = ?,
    size = ?
        WHERE item_id = ?
            `)
        .bind(
            newName,
            newCategory,
            newStock,
            newPar,
            newUnit,
            newSize,
            id
        )
        .run();
}

export async function deleteInvItem(db, id) {
    return await db
        .prepare(`
            DELETE FROM Inventory
WHERE item_id = ?
    `)
        .bind(id)
        .run();
}

//
// Categories
//

export async function getCategories(db) {
    const result = await db
        .prepare(`
    SELECT *
    FROM Categories
    `)
        .all();

    return result.results;
}

//
// Units
//

export async function getUnits(db) {
    const result = await db
        .prepare(`
SELECT *
FROM Units
    `)
        .all();

    return result.results;
}

//
// Orders
//

export async function getOrders(db) {
	const result = await db
		.prepare(`
			SELECT
				O.*,
				S.name AS status_name
			FROM Orders AS O
					 LEFT JOIN Status AS S
							   ON O.status = S.status_id
		`)
		.all();

	return result.results.map(order => ({
		...order,
		items: order.items
			? JSON.parse(order.items)
			: []
	}));
}


export async function getOrderById(db, id) {
	const order = await db
		.prepare(`
			SELECT
				O.*,
				S.name AS status_name
			FROM Orders AS O
					 LEFT JOIN Status AS S
							   ON O.status = S.status_id
			WHERE order_id = ?
		`)
		.bind(id)
		.first();

	if (!order) {
		return null;
	}

	return {
		...order,
		items: order.items
			? JSON.parse(order.items)
			: []
	};
}


export async function addOrder(db, items) {
    return await db
        .prepare(`
	INSERT INTO Orders
(created_date, status, items)
VALUES
(datetime('now', 'localtime'), 1, ?)
	`)
        .bind(JSON.stringify(items))
        .run();
}


export async function updateOrder(
    db,
    id,
    newReceivedDate,
    newStatus,
    items = null
) {
    if (items !== null) {
        return await db
            .prepare(`
UPDATE Orders
SET
received_date = ?,
	status = ?,
	items = ?
		WHERE order_id = ?
			`)
            .bind(
                newReceivedDate,
                newStatus,
                JSON.stringify(items),
                id
            )
            .run();
    }

    return await db
        .prepare(`
			UPDATE Orders
SET
received_date = ?,
	status = ?
		WHERE order_id = ?
			`)
        .bind(
            newReceivedDate,
            newStatus,
            id
        )
        .run();
}


export async function deleteOrder(db, id) {
    return await db
        .prepare(`
			DELETE FROM Orders
WHERE order_id = ?
	`)
        .bind(id)
        .run();
}
