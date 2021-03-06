const express = require('express');
const cors = require('cors');
// const jwt = require('jsonwebtoken');
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { send } = require('express/lib/response');
const port = process.env.PORT || 5000
require('dotenv').config()


//middleware
app.use(cors());
app.use(express.json());
//jwt
// function verifyJwt(req, res, next) {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) {
//         return res.status(401).send({ message: 'unauthorized access' })
//     }
//     const token = authHeader.split('')[1];
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
//         if (err) {
//             return res.status(403).send({ message: 'forbidden access' });
//         }
//         console.log('decoded', decoded);
//         req.decoded = decoded;
//     })
//     next()
// }

app.get('/', (req, res) => {
    res.send('server side is running')
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tjkq5.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const collectionProduct = client.db('hikingGears').collection('product')

        //auth
        // app.post('/login', async (req, res) => {
        //     const user = req.body;
        //     const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
        //     res.send({ accessToken })
        // })



        //get all products
        app.get('/products', async (req, res) => {
            const query = {};
            // console.log(req);
            const cursor = collectionProduct.find(query);
            const result = await cursor.toArray();;
            res.send(result);

        })



        //post product
        app.post('/products', async (req, res) => {
            const user = req.body;
            // console.log(user);
            const result = await collectionProduct.insertOne(user);
            res.send(result)
        });



        //get single products
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionProduct.findOne(query)
            res.send(result)
        })


        //update products
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedStock = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                    stock: updatedStock.stock
                },
            }
            const result = await collectionProduct.updateOne(filter, updateDoc, options);
            res.send(result)
        })


        //delete products
        app.delete('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await collectionProduct.deleteOne(query)
            res.send(result)
        })


        // app.get('/product', verifyJwt, async (req, res) => {
        app.get('/product', async (req, res) => {
            //jwt
            // const decodedEmail = req.decoded.email;
            const email = req.query.email;
            // if (email === decodedEmail) {
            const query = { email: email };
            const cursor = collectionProduct.find(query);
            const result = await cursor.toArray();
            res.send(result);
            // }
            // else {
            //     res.status(403).send({ message: 'forbidden access' })
            // }
        })

    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)


app.listen(port, () => {
    console.log('listening ', port);
})