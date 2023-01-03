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
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.all('/', async (req, res) => {
    console.log("Just got a request!")
    res.send('Good ' + Date.now());
})

app.all('/api/all-subscribers', async (req, res) => {
    console.log("getting call to list all subscribers");
    let allSubscribers = await subscribers.list();
    console.log('all subscribers:', allSubscribers);
    res.send(allSubscribers);
})

app.post('/api/save-subscription/', async function (req, res) {
    console.log("getting call to /api/save-subscription/", req.body);
    res.header("Access-Control-Allow-Origin", "*")
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested, Content-Type, Accept Authorization"
    )

    // Check the request body has at least an endpoint.
    if (!req.body || !req.body.subscription || !req.body.subscription.endpoint) {
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



    
    //res.send(req.body);

    // {"ownerId":"ss","subscription":{"endpoint":"https://fcm.googleapis.com/fcm/send/dqy_o-vmruA:APA91bEbzBiquM_vAQXEOfFgfq4O3DQvQB0XScNTnDZPwFxjNbx23T1ehsl-Bntcroa7acDAThEkAQFWUcZpsVB3CX5prFm10G8n3qJTjM8fbUZ79hvSlRmfI4cDJ1w_by5iPR4XUPjh","expirationTime":null,"keys":{"p256dh":"BHt55lq5fttaOHup_aSSnj4BLXtK4A6QwEUMJXMqV5608GFpRA7ut5k469fb72QRFG8hlFtLQ2p9ldoDv9UoLM0","auth":"oNaY-obF4Wpku4pdDcCUOQ"}}}

    return await saveSubscriptionToDatabase(req.body)
    .then(function (subscriptionId) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({data: {success: true, ownerId: subscriptionId}}));
    })
    .catch(function (err) {
      res.status(500);
      res.setHeader('Content-Type', 'application/json');
      res.send(
        JSON.stringify({
          error: {
            id: 'unable-to-save-subscription',
            message:
              'The subscription was received but we were unable to save it to our database.',
          },
        }),
      );
    });
});

async function saveSubscriptionToDatabase(payload) {

    let ownerId = payload.ownerId;
    let subscription = payload.subscription;
    let user = await subscribers.set(ownerId, {subscription: subscription});
    console.log(user);
    return ownerId;
}

app.listen(process.env.PORT || 3000)