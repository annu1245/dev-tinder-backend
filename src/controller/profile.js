const { validateEditRoute } = require('../utils/validate');

exports.view = async (req, res) => {
  const user = req.user;
  res.send(user);
}

exports.edit = async(req, res) => {
  try {
    if (!validateEditRoute) {
      throw new Error("Edit not Allowed")
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(key => loggedInUser[key] = req.body[key]);
    await loggedInUser.save();
    res.status(200).json({message: "Profile Edited", data: loggedInUser})

  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
}