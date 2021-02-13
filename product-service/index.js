const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const productList = {};

app.post('/product', async (req, res) => {
  console.log(req.body);
  
  const id = randomBytes(4).toString('hex');
  const { name, price } = req.body;

  productList[id] = {
    id,
    name,
    price
  };

  await axios.post('http://localhost:4004/events', {
    type: 'ProductCreated',
    data: {
      id,
      name,
      price
    }
  });

  res.status(201).send(productList[id]);
});

app.listen(4001, () => {
  console.log('Listening on port 4001');
});
