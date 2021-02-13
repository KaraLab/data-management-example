const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userList = {};
const productList = {};

const handleEvent = (type, data) => {
  if(type === 'UserCreated') {
    console.log('Processing event:', type);
    console.log(data);

    const { id } = data;

    userList[id] = {id, products: [] };
    console.log(userList);
  }

  if(type === 'ProductCreated') {
    console.log('Processing event:', type);
    console.log(data);

    const { id, name, price } = data;

    productList[id] = {id, name, price};
    console.log(productList);
  }

  if(type === 'OrderPlaced') {
    console.log('Processing event:', type);
    console.log(data);

    const { userId, productId } = data;
    const user = userList[userId];
    user.products.push(productId);

    console.log(userList);
  }
};

app.get('/orderedProducts', (req, res) => {
  console.log(req.body);

  const { userId } = req.body;
  const orderedProducts = [];

  const products = userList[userId].products;

  for(let productId of products) {
    orderedProducts.push(productList[productId]);
  }

  console.log(orderedProducts);

  res.send(orderedProducts);
});

app.post('/events', (req, res) => {
  const { type, data } = req.body;

  handleEvent(type, data);

  res.send({});
});

app.listen(4003, async () => {
  console.log('Listening on port 4003');

  const res = await axios.get('http://localhost:4004/events');

  for(let event of res.data) {
    handleEvent(event.type, event.data);
  }
});
