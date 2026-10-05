import * as userService from '../services/userService.js';

export async function getUsers(req, res) {
  const users = await userService.listUsers();
  res.status(200).json(users);
}

export async function createUser(req, res) {
  const { name, email } = req.body;
  const user = await userService.createUser(name, email);
  res.status(201).json(user);
}