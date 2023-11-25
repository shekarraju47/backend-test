const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(cors());

// Connet To DataBase And Like Tabel/Collection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connect SuccessFull"))
  .catch((e) => console.error("error"));

// Enter The Schema/type(string,num) Of Document Name
const userScheema = new mongoose.Schema({
  name: String,
  age: Number,
  username: String,
  password: String,
  gender: String,
});

// Now You can pass the table first and value schema
const user = mongoose.model("users", userScheema);

// Now You Can do Oparations

app.get("/", async (req, res) => {
  try {
    const data = await user.find();
    res.send(data);
  } catch (e) {
    console.error(e.massage);
  }
});

app.post("/signup", async (req, res) => {
  const { name, age, username, password, gender } = req.body;
  const hashpassword = await bcrypt.hash(password, 10);
  try {
    const data = await user.findOne({ username: username });

    if (data.length < 1) {
      const createUser = new user({
        name: name,
        age: age,
        username: username,
        password: hashpassword,
        gender: gender,
      });
      const result = await createUser.save();
      res.status(200);
      res.send(result);
    } else {
      res.status(400);
      res.send({ type: "User Already Exist" });
    }
  } catch (e) {
    res.send(e);
  }
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await user.find({ _id: id });

    const idOf = data[0]._id.toString();
    if (data.length < 1) {
      res.status(400);
      res.send({ TypeError: "No Users" });
    } else {
      await user.deleteOne({ _id: idOf });
      res.send({ typeof: "success" });
    }
  } catch (e) {
    res.send(e);
  }
});

app.put("/update/:id", async (req, res) => {
  const userId = req.params.id.toString();
  const { age, name } = req.body;
  console.log(age);
  try {
    const inDb = await user.find({ _id: userId });
    if (inDb.length < 1) {
      res.send({ TypeError: "User not in Db" });
    } else {
      const updateUser = await user.updateOne(
        { _id: userId },
        { $set: { name: name, age: age } }
      );
      res.send({ typeof: "updated" });
    }
  } catch (e) {
    console.error(e.massage);
  }
});

app.get("/user/:id", async (req, res) => {
  const useId = req.params.id;
  console.log(useId);
  try {
    const data = await user.findOne({ _id: useId });
    res.send(data);
  } catch (e) {
    console.error(e.massage);
  }
});

app.listen(5000, () => {
  console.log("server started at https://emerald-lamb-tux.cyclic.app/");
});
