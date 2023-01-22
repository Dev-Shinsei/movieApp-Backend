import userModel from "../models/user.model"
import jsonwebtoken from "jsonwebtoken"
import responseHandler from "../handlers/response.handler"

const signup = async (req, res) => {
  try {
    const { username, password, displayName } = req.body

    const checkUser = await userModel.findOne({ username });
    if (checkUser) return responseHandler.badrequest(res, "Username already used.");

    const user = new userModel()

    user.displayName = displayName
    user.username = username
    user.setPassword(password)

    await user.save();

    const token = jsonwebtoken.sign({ data: user.id }, process.env.TOKEN_SECRET, { expiresIn: "24h" })

    responseHandler.created(res, {
      token,
      ...user._doc,
      id: user.id
    })
  } catch {
    return responseHandler.error(res)
  }
}

const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.findOne({ username }).select("username password salt id displayName")

    if (!user) return responseHandler.badrequest(res, "Username or password is incorrect.")
  } catch {
    responseHandler.error(res)
  }
}