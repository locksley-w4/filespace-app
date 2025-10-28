import { verifyAccessToken } from "../services/authService.js";

export async function checkAuth(req, res, next) {
  try {
    const accessToken = req.headers.authorization?.split(" ")[1];

    console.log("start middleware");
    if (!accessToken) {
      throw new Error("Login required", { cause: 401 });
    }
    
    const userdata = verifyAccessToken(accessToken);

    if(!userdata) {
        throw new Error("Login required", { cause: 401 });
    }

    console.log("end middleware");
    req.user = userdata;
    return next();
  } catch (e) {
    console.error(e.message);
    res.status(e.status ?? 401).send({ error: e, message: e.message });
    return;
  }

  res.sendStatus(401);
}
