const express = require("express");
const logger = require("./logger");
const app = express();
const Joi = require("joi");
const courses = require("./courses");

// middelware functions are called in sequence
// should put middle ware functions in a second module

app.use(express.json());
app.use(logger);
app.use("./api/courses", courses);

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

// #endregion

// PORT
const port = process.env.PORT || 3000;

// second arguement is a function that will be called when the application starts listening on th egiven port
app.listen(port, () => console.log(`Listening on port ${port}...`));
