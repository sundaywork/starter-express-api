// ref: https://web.dev/sending-messages-with-web-push-libraries/

const express = require('express')
const cors = require('cors');

const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("glorious-gray-duckCyclicDB")

const subscribers = db.collection("subscribers")

// async function saveScriber(id, peer) {
//     // create an item in collection with key "leo"
//     let user = await subscribers.set(id, {
//         type: "cat",
//         color: "orange"
//     })

//     // get an item at key "leo" from collection animals
//     let item = await animals.get("leo")
//     console.log(item);
// }
// run();



const app = express(cors())
app.options('*', cors());

app.all('/', async (req, res) => {
    console.log("Just got a request!")
    res.send('Good');
})

app.post('/api/save-subscription/', async function (req, res) {
    console.log("getting call to /api/save-subscription/", req);
    // res.header("Access-Control-Allow-Origin", "*")
    // res.header(
    //   "Access-Control-Allow-Headers",
    //   "Origin, X-Requested, Content-Type, Accept Authorization"
    // )

    // Check the request body has at least an endpoint.
    if (!req.body || !req.body.endpoint) {
        // Not a valid subscription.
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(
            JSON.stringify({
                error: {
                    id: 'no-endpoint',
                    message: 'Subscription must have an endpoint.',
                },
            }),
        );
        return false;
    }

    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )

    console.log(req.body);
    res.send(req.body);

    // return await saveSubscriptionToDatabase(req.body)
    // .then(function (subscriptionId) {
    //   res.setHeader('Content-Type', 'application/json');
    //   res.send(JSON.stringify({data: {success: true}}));
    // })
    // .catch(function (err) {
    //   res.status(500);
    //   res.setHeader('Content-Type', 'application/json');
    //   res.send(
    //     JSON.stringify({
    //       error: {
    //         id: 'unable-to-save-subscription',
    //         message:
    //           'The subscription was received but we were unable to save it to our database.',
    //       },
    //     }),
    //   );
    // });
});

async function saveSubscriptionToDatabase(subscription) {

    let user = await subscribers.set('leo', subscription);
    return user._id;
}

app.listen(process.env.PORT || 3000)