const Router = require("express");
const router = new Router();
const controller = require("./auth-controller");
const { check } = require("express-validator");
const authMiddleware = require("./middlewares/auth-middleware");
const roleMiddleware = require("./middlewares/role-middleware");

router.post(
  "/registration",
  [
    check("username", "Username can not be empty").notEmpty(),
    check("password", "Password length must be from 4 to 10").isLength({
      min: 4,
      max: 10,
    }),
  ],
  controller.registration
);
router.post("/login", controller.login);
router.get("/users", roleMiddleware(['USER', 'ADMIN']), controller.getUsers);

module.exports = router;
