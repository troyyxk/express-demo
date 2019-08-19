const express = require("express");
const logger = require("./logger");
const app = express();
const Joi = require("joi");

// middelware functions are called in sequence
// should put middle ware functions in a second module

app.use(express.json());

app.use(logger);

var courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" }
];

// #region helper functions
function validateCourse(course) {
  const schema = {
    name: Joi.string()
      .min(3)
      .required()
  };

  return Joi.validate(course, schema);
}
// #endregion

// #region get
// first arguement endpoint (url), seconde arguement is the call back function
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send(courses);
});

// use ? to add query, sortyBy=name, which is another key value pair, with sortBy as key and name as value
// year and month as key and the inputed value as their value in the same order respectively
app.get("/api/courses/:id", (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    // 404
    res.status(404).send("The course withe the given id is not found.");
    return;
  }
  res.send(course);
});

// #endregion

// #region post
// post request, for posting data
app.post("/api/courses", (req, res) => {
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  if (!req.body.name || req.body.name.length < 3) {
    // 400, Bad Request
    res
      .status(400)
      .send("Name is required and should be minimun 3 characters.");
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name
  };
  courses.push(course);
  res.send(course); // by convension, send the object that is saved in the server
});
// #endregion

// #region put
// PUT, for updating data
app.put("/api/courses/:id", (req, res) => {
  // Look up a course
  // If not existing, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course withe the given id is not found.");
    return;
  }
  // Validate
  // If invalid, return 400 - Bad request
  const { error } = validateCourse(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  // Update the course and return the updated course
  course.name = req.body.name;

  // return the updated course
  res.send(course);
});
// #endregion

// #region delete
// delete
app.delete("/api/courses/:id", (req, res) => {
  // look up the course
  // does not exit, return 404
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    res.status(404).send("The course withe the given id is not found.");
    return;
  }

  // delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // return
  res.send(course);
});
// #endregion

// PORT
const port = process.env.PORT || 3000;

// second arguement is a function that will be called when the application starts listening on th egiven port
app.listen(port, () => console.log(`Listening on port ${port}...`));
