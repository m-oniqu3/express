const fs = require('node:fs');
const express = require('express');
const { del } = require('express/lib/application');
const app = express();

// middleware: function to modify the incoming request data
app.use(express.json());

// read the tours data from the file and parse it into a JavaScript object
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  // req.params is an object containing properties mapped to the named route “parameters”
  // its where all the variables and parameters we define in the route are stored
  console.log(req.params);

  //convert string to number with unary plus
  const id = +req.params.id;
  const tour = tours.find((tour) => tour.id === id);

  //   if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

const createTour = (req, res) => {
  // console.log(req.body);

  //create new id
  const newId = tours[tours.length - 1].id + 1;

  //create new object where we merge the id & request body (incoming data)
  const newTour = Object.assign({ id: newId }, req.body);

  // add the new tour to the existing tours
  tours.push(newTour);

  // write the new tours data to the file, where it will override the existing tours,, we also stringify the tours
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      // it sends a response back to the client with a status code of 201 (created) and a JSON object containing the status message 'success' and the newly created newTour object in a data property.
      // Sending a response is an important part of building a web application because it allows the client to know whether their request was successful or not.
      res.status(201).json({ status: 'success', data: { tour: newTour } });
    }
  );
};

const updateTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }
  res.status(200).json({
    status: 'success',
    data: { tour: 'updated tour here' },
  });
};

const deleteTour = (req, res) => {
  if (+req.params.id > tours.length) {
    return res.status(404).json({ status: 'failed', message: 'Invalid ID' });
  }
  // 204 means no content because dont send any data back, we send null to show that the resource we deleted no long exist
  res.status(204).json({
    status: 'success',
    data: { tour: 'updated tour here' },
  });
};

////app.get('/api/v1/tours', getAllTours);

// optional params -> '/api/v1/tours/:id/:name?'
//app.get('/api/v1/tours/:id', getTour);

//app.post('/api/v1/tours', createTour);

//put -> receives the entire updated object
//patch -> receives the property that is being updated
//app.patch('/api/v1/tours/:id', updateTour);

//app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`App runninng on port ${port}...`);
});
