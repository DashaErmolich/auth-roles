const User = require('./models/User');
const Role = require('./models/Role');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const { secret } = require('./config')

const generateAccessToken = (id, roles) => {
  const payload = {
    id,
    roles,
  }

  return jwt.sign(payload, secret, {
    expiresIn: '24h',
  })
}

class AuthController {
  async registration(req, res) {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          message: `Registration errors!`,
          errors,
        })
      }

      const { username, password } = req.body;
      const candidate = await User.findOne({ username });

      if (candidate) {
        return res.status(400).json({
          message: `User with username ${username} already exists`,
        })
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPassword = bcrypt.hashSync(password, salt);
      const userRole = await Role.findOne({ value: 'USER' });
      const user = new User({ username, password: hashPassword, roles: [userRole.value] });

      await user.save();

      return res.status(200).json({
        message: `User with username ${username} successfully created`,
      })
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Registration error',
      })
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });

      if (!user) {
        res.status(400).json({
          message: `User with username ${username} not found`,
        })
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        res.status(400).json({
          message: `Incorrect password`,
        })
      }

      const token = generateAccessToken(user._id, user.roles);
      return res.json({ token });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Login error',
      })
    }
  }

  async getUsers(req, res) {
    try {

      // DONE ONES

      // const userRole = new Role();
      // const adminRole = new Role({ value: 'ADMIN' });

      // await userRole.save();
      // await adminRole.save();

      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.log(error);
      res.status(400).json({
        message: 'Users error',
      })
    }
  }
}

module.exports = new AuthController();