const bcrypt = require("bcrypt")
const User = require('../model/user');
const users = require('./users.json');
const connectMongo = require("../database/db");

async function seeder() {
  await connectMongo()
  for (const user of users) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    const userModel = new User({ ...user, password: hashPassword });
    await userModel.save();
  }
  console.log("User seeded!");
}

seeder();

