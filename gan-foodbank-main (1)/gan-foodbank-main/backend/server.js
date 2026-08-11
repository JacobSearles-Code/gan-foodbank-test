import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import Database from 'better-sqlite3'
import bcrypt from 'bcrypt'
import * as db from './dbFunctions.js'
import fs from 'fs'

//Express
const server = express()
const port = 3000

//Middleware
server.use(express.json()) //to ensure data is trasmitted as json
server.use(express.urlencoded({ extended: true })) //to ensure data is encoded and decoded while transmission
server.use(cors())

//close db connection on shutdown
process.on('exit', () => {return db.close()})
//catches "interrupt signal" (ctrl + C)
process.on('SIGINT', () => {
    db.close()
    process.exit()
})

const indexDbResults = (dbTable) => {
    let i = 0
    dbTable.forEach((option)=>{
        option.index = i
        i++
    })
    //console.log(dbTable)
    return(dbTable)
}
const addInventorySelectedValue = (dbTable) => {
    dbTable.forEach((option)=>{
        option.selected = false
    })
    //console.log(dbTable)
    return(dbTable)
}

//store user list
let users = indexDbResults(db.getAllUsers())
//updates stored user list after db update
const refreshUserList= () => {
    users =  indexDbResults(db.getAllUsers())
}

//store inventory list
let inventory = indexDbResults(db.getInventory())
let inventoryFilters = {nameFilter: new RegExp(""), categoryFilter: new RegExp(""), sortBy: ""}
//updates stored inventory list after db update
const refreshInventoryList= () => {
    inventory =  indexDbResults(db.getInventory())
}

let ordersOld = [
    {
        order_group_id: 1, 
        date_sent: "2026-06-30",
        order_items: [
            {orders_id: 1, item_name: "Chick Peas", amount: 4, date_issued: "2026-06-10", date_recieved: "pending",}, 
            {orders_id: 2, item_name: "Rice", amount: 4, date_issued: "2026-06-10", date_recieved: "pending"}, 
            {orders_id: 3, item_name: "Canned Tuna", amount: 4, date_issued: "2026-06-10", date_recieved: "pending"}
        ]
    },
    {
        order_group_id: 2, 
        date_sent: "2026-07-31",
        order_items: [
            {orders_id: 1, item_name: "Pasta", amount: 4, date_issued: "2026-07-11", date_recieved: "pending",}, 
            {orders_id: 2, item_name: "Soup", amount: 4, date_issued: "2026-07-11", date_recieved: "pending"}, 
            {orders_id: 3, item_name: "Canned Fruit", amount: 4, date_issued: "2026-07-11", date_recieved: "pending"}
        ]
    },
    {
        order_group_id: 3, 
        date_sent: "unsent",
        order_items: [
            {orders_id: 1, item_name: "Sugar", amount: 4, date_issued: "2026-08-02", date_recieved: "pending",}
        ]
    },
]
let orderFilters = {}
let currentOrderGroupIndex = 1
//
// Endpoints
//
server.listen(port, () => {
      console.log(`Database is connected\nServer is listening on ${port}`)
      console.log(new Date(Date.now()))
    });

server.get("/", (request, response) => {
    console.log("main endpoint")
    response.send("Server is Live!")
});

server.post("/", (request, response) => {
    const {name, password} = request.body
    try{
        //const user = await User.findOne({name});
        const user = users.find(user => user.first_name.toLowerCase() === name.toLowerCase());
        //console.log(user)
        if (!user){
            return response.status(404).send({message: "User does not exist"})
        }
        //const match = await bcrypt.compare(password, user.password);
        const match = password === user.password
        //console.log(match)
        if (!match)
        {
            return response.status(403).send({message: "Incorrect credentials"})
        }
        const jwtToken = jwt.sign({role: user.role, name, }, "temp")
        return response.status(201).send({message: "User Authenticated", token: jwtToken})
    }catch(err){
        response.status(500).send({message: err.message})
    }
})

//endpoint for showing all users
server.get("/users", (request, response) => {
    response.send(users)
})

server.post("/users", async (request, response) => {
    const {name, role, password} = request.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        users = db.addUser(name, "Lnameplaceholder", role, hashedPassword) //update place holder last name!
        refreshUserList()
        return response.status(200).send({
            message: `user added successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})

server.patch("/users", async (request, response) => {
    const {id, name, role, password} = request.body
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        users = db.updateUser(id, name, "Lnameplaceholder", role, hashedPassword) //update place holder last name!
        refreshUserList()
        return response.status(200).send({
            message: `user updated successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})

server.delete("/users/:id", (request, response) => {
  const { id } = request.params;
  try {
        users = db.deleteUser(id);
        refreshUserList()
        return response.status(200).send({
            message: `user deleted successfully!`
        });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

server.get("/inventory", (request, response) => {
    inventory = inventory.filter((item) => {return inventoryFilters.nameFilter.test(item.name.toLowerCase()) })
    //asc
    inventoryFilters.sortBy === "nameAsc" && (inventory = inventory.sort((a, b)=>{return a.name.localeCompare(b.name)}))
    inventoryFilters.sortBy === "categoryAsc" && (inventory = inventory.sort((a, b)=>{return a.category - b.category}))
    inventoryFilters.sortBy === "stockAsc" && (inventory = inventory.sort((a, b)=>{return a.stock - b.stock}))
    //desc
    inventoryFilters.sortBy === "nameDesc" && (inventory = inventory.sort((a, b)=>{return b.name.localeCompare(a.name)}))
    inventoryFilters.sortBy === "categoryDesc" && (inventory = inventory.sort((a, b)=>{return b.category - a.category}))
    inventoryFilters.sortBy === "stockDesc" && (inventory = inventory.sort((a, b)=>{return b.stock - a.stock}))
    response.send(indexDbResults(addInventorySelectedValue(inventory)))
})

server.post("/inventory", (request, response) => {
    const {name, category, stock} = request.body
    try {
        inventory = db.AddInvItem(name, category, stock) 
        refreshInventoryList()
        return response.status(200).send({
            message: `item added successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})
server.delete("/inventory/:id", (request, response) => {
  const { id } = request.params;
  try {
        users = db.deleteInvItem(id);
        refreshInventoryList()
        return response.status(200).send({
            message: `item deleted successfully!`
        });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});

server.patch("/inventoryIntValue", async (request, response) => {
    const {item, newValue, targetValue} = request.body
    try {
        targetValue === "stock" && (inventory = db.UpdateInvItem(item.item_id, item.name, item.category, newValue))
        refreshInventoryList()
        return response.status(200).send({
            message: `user updated successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})
server.patch("/inventoryStringValue", async (request, response) => {
    const {item, newValue, targetValue} = request.body
    try {
        targetValue === "name" && (inventory = db.UpdateInvItem(item.item_id, newValue, item.category, item.stock))
        targetValue === "category" && (inventory = db.UpdateInvItem(item.item_id, item.name, newValue, item.stock))
        refreshInventoryList()
        return response.status(200).send({
            message: `user updated successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})
server.patch("/inventoryFilters", async (request, response) => {
    const {nameFilter, categoryFilter, sortBy} = request.body
    //console.log(nameFilter, categoryFilter, "ss")
    try {
        inventoryFilters.nameFilter = new RegExp(nameFilter.toLowerCase())
        inventoryFilters.categoryFilter = new RegExp(categoryFilter.toLowerCase())
        inventoryFilters.sortBy = sortBy
        refreshInventoryList()
        return response.status(200).send({
            message: `filters updated successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})

server.get("/ordersOld", (request, response) => {
    response.send({db: indexDbResults(ordersOld), currentGroup: currentOrderGroupIndex})
    currentOrderGroupIndex = 1
})
server.post("/ordersOld", (request, response) => {
    const {item_name, amount} = request.body
    const currentTime = new Date(Date.now())
    //console.log(currentTime)
    try {
        ordersOld[ordersOld.length-1].order_items.push({
            orders_id: ordersOld[ordersOld.length-1].order_items[ordersOld.length-1].orders_id+1,
            item_name, 
            amount, 
            date_issued: currentTime.getFullYear() + "-" + currentTime.getMonth().toString().padStart(2,"0") + "-" + currentTime.getDate().toString().padStart(2,"0"), 
            date_recieved: "pending"
        })
        return response.status(200).send({
            message: `order added successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
    response.send(indexDbResults(orders))
})
server.patch("/ordersOld", (request, response) => {
    const {group_id, order_id} = request.body
    const currentTime = new Date(Date.now())
    currentOrderGroupIndex = group_id
    //console.log(currentTime)
    try {
        ordersOld[group_id].order_items[order_id-1]
            .date_recieved = 
                currentTime.getFullYear() + "-" 
                + currentTime.getMonth().toString().padStart(2,"0") + "-" 
                + currentTime.getDate().toString().padStart(2,"0")
        return response.status(200).send({
            message: `order added successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
    response.send(indexDbResults(orders))
})

server.get("/orders", (request, response) => {
    try {
        let orders = db.getOrders() 
        return response.send({db: indexDbResults(orders), currentGroup: currentOrderGroupIndex})
    } catch(error){
        response.status(500).send({message: error.message})
    }
    currentOrderGroupIndex = 1
})

server.get("/orders/:id", (request, response) => {
  const { id } = request.params;
    try {
        let order = db.getOrderById(id)

        //attach order details from matching file onto response object
        order.items = JSON.parse(fs.readFileSync(order.path, 'utf8'))

        return response.send(order)
    } catch(error){
        response.status(500).send({message: error.message})
    }
})

//only order items are required, created date is auto filled, and status defaults to 0 (open)
server.post("/orders", (request, response) => {
    const { items } = request.body;
    let fileContents = []
    //console.log(items)
    items.forEach((item)=>{
        fileContents.push({id: item.index, name: item.name, amount: item.unitAmount * item.unitQuantity })
    })
    try {
        let time = new Date()
        //console.log(time)

        //closely matches SQLite formatting "YYYY-MM-DD HH:MM:SS" (can't put :'s in file name)
        let formatted = time.getFullYear() + "-" + 
        (time.getMonth() + 1).toString().padStart(2,'0') + "-" +  
        time.getDate().toString().padStart(2,'0') + " " +
        time.getHours().toString().padStart(2,'0') + "-" +
        time.getMinutes().toString().padStart(2,'0') + "-" +
        time.getSeconds().toString().padStart(2,'0')
        //console.log(formatted)

        let filePath = "./orders/" + formatted + ".json"
        console.log(filePath + 1)

        //create order file
        fs.writeFileSync(filePath, JSON.stringify(fileContents))
        console.log(filePath)
        let order = db.addOrder(filePath) 
        //console.log(order)
        return response.status(200).send({
            message: `order added successfully!`
        });
    } catch(error){
        console.log(error)
        response.status(500).send({message: error.message})
    }
})

//date string is formatted as "YYYY-MM-DD HH:MM:SS"
server.patch("/orders", async (request, response) => {
    const {id, receivedDate, status, items} = request.body
    try {
        //only update order file whne items object is passed
        if(items != null){
            //fetch path
            let filePath = db.getOrderById(id).path
            fs.writeFileSync(filePath, items, 'utf8')
        }

        let order = db.updateOrder(id, receivedDate, status) 
        return response.status(200).send({
            message: `order updated successfully!`
        });
    } catch(error){
        response.status(500).send({message: error.message})
    }
})

server.delete("/order/:id", (request, response) => {
  const { id } = request.params;
  try {
        //delete matching order file
        //fetch path
        let filePath = db.getOrderById(id).path

        fs.unlinkSync(filePath)
        
        let order = db.deleteOrder(id)
        return response.status(200).send({
            message: `item deleted successfully!`
        });
  } catch (error) {
    response.status(400).send({ message: error.message });
  }
});


server.get("/test", (request, response) => {
    response.send(db.getInvItemById(3))
})