const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const orderList = {};

app.post('/order', async (req, res) => {
  console.log(req.body);

  const id = randomBytes(4).toString('hex');
  const { userId, productId, total } = req.body;

  orderList[id] = {
    id,
    userId,
    productId,
    total
  };

  await axios.post('http://localhost:4004/events', {
    type: 'OrderPlaced',
    data: {
      id,
      userId,
      productId,
      total
    }
  });

  res.status(201).send(orderList[id]);
});

app.listen(4002, () => {
  console.log('Listening on port 4002');
})
