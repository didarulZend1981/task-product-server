const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')
const port = process.env.PORT || 5000


// middleware

app.use(cors())
app.use(express.json())

// const corsOptions = {
//   origin: 'http://localhost:5173', // Your frontend URL
//   credentials: true, // Allow credentials (cookies, authorization headers, TLS client certificates)
// };

// app.use(cors(corsOptions));
const { MongoClient, ServerApiVersion,ObjectId } = require('mongodb');



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ckoz8fu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;




// const uri = "mongodb+srv://<username>:<password>@cluster0.ckoz8fu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection =client.db("taskBD").collection("products");
    

 
  app.get('/products', async (req, res) => {
      const product = productCollection.find();
      const result = await product.toArray();
      res.send(result);
  })



app.get('/api/products', async (req, res) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const searchQuery = req.query.search || '';
      const sortField = req.query.sortField || 'creationDate';
      const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

      

      const startIndex = (page - 1) * limit;
   
      const searchCriteria = searchQuery
          ? { ProductName: { $regex: searchQuery, $options: 'i' } } // 'i' for case-insensitive
          : {};



      const total = await productCollection.countDocuments(searchCriteria);

      const products = await productCollection.find(searchCriteria)
          .sort({ [sortField]: sortOrder })  // Sorting logic
          .skip(startIndex)
          .limit(limit)
          .toArray();

      res.json({
          page,
          totalPages: Math.ceil(total / limit),
          products
      });
      
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});






























    




    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Hello from task product Server..')
})

app.listen(port, () => {
  console.log(`task product Server is running on port ${port}`)
})