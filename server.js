const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "*" }));

const jwt = require("jsonwebtoken");

const userDetails = require("./model");
const middleware = require("./middleware");

app.get("/", async (req, res) => {
  res.send("hello");
});

mongoose
  .connect(
    "mongodb+srv://rahulrg8688:rahul1234@cluster0.9xexxaz.mongodb.net/?retryWrites=true&w=majority",
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      //   useCreateIndex: true,
    }
  )
  .then(() => {
    console.log("DB established");
  })
  .catch((err) => console.log(err));

app.use(express.json());

app.post("/register", async (request, response) => {
  try {
    const { name, email, password, confirmPassword } = request.body;

    const exist = await userDetails.findOne({ email });
    if (exist) {
      response.send("user already exist");
    }
    if (password !== confirmPassword) {
      response.send("Passwords didnot match");
    }

    const newUser = new userDetails({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    });
    await newUser.save();
    return response.json(await userDetails.find());
  } catch (e) {
    console.log(e.message);
  }
});

app.get("/userdetails", async (request, response) => {
  try {
    const allUserData = await userDetails.find();
    return response.json(await allUserData);
  } catch (e) {
    return response(e.message);
  }
});

app.get("/userdetails/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const getById = await userDetails.findById(request.params.id);
    return response.json(await getById);
  } catch (e) {
    return response(e.message);
  }
});

app.delete("/userdetails/:id", async (request, response) => {
  try {
    const { id } = request.params;
    const deleteBYId = await userDetails.findByIdAndDelete(id);
    response.send("Deleted successfully");
    return response.json(await userDetails.find());
  } catch (e) {
    response.send(e.message);
  }
});

app.post("/login", async (request, response) => {
  const { email, password } = request.body;
  try {
    const existUser = await userDetails.findOne({ email });
    if (!existUser) {
      return response.send("user not found");
    }
    if (existUser.password !== password) {
      return response.send("Invalid credientals");
    }

    const payload = {
      user: {
        id: existUser.id,
      },
    };
    jwt.sign(
      payload,
      "jwtToken",
      { expiresIn: 43434300000000 },
      (err, Token) => {
        if (err) {
          response.send(err.message);
        } else {
          return response.json({ Token });
        }
      }
    );

    // response.send(existUser);
  } catch (e) {
    // response.send(e.message);
    response.send(e);
  }
});

app.get("/myprofile", middleware, async (request, response) => {
  try {
    let exist = await userDetails.findById(request.user.id);
    if (!exist) {
      response.send("user not found");
    }
    response.json(exist);
  } catch (e) {
    response.send(e);
  }
});

app.listen("5000", () => {
  console.log("server is running");
});
