const express = require('express')

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("glorious-gray-duckCyclicDB")

const animals = db.collection("animals")

async function run() {
    // create an item in collection with key "leo"
    let leo = await animals.set("leo", {
        type: "cat",
        color: "orange"
    })

    // get an item at key "leo" from collection animals
    let item = await animals.get("leo")
    console.log(item);
}
run();



const app = express()
app.all('/', async (req, res) => {
    console.log("Just got a request!")
    let item = await animals.get("leo");
    if (item) {
        res.send(item);
    } else {
        res.send('Good');
    }
    
})
app.listen(process.env.PORT || 3000)