const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const userList = {};

app.post('/user', async (req, res) => {
  console.log(req.body);
  
  const id = randomBytes(4).toString('hex');
  const { email } = req.body;

  userList[id] = {
    id,
    email
  };

  await axios.post('http://localhost:4004/events', {
    type: 'UserCreated',
    data: {
      id,
      email
    }
  });

  res.status(201).send(userList[id]);
});

app.listen(4000, () => {
  console.log('Listening on port 4000');
});
