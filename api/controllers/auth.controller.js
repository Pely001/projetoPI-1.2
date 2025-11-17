// /api/controllers/auth.controller.js
import { UserAPIModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

export const AuthAPIController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
    }

    if (!JWT_SECRET) {
      console.error('JWT_SECRET não configurado');
      return res.status(500).json({ message: "JWT_SECRET não configurado no servidor." });
    }

    try {
      const user = await UserAPIModel.findByUsername(username);
      if (!user) return res.status(401).json({ message: "Credenciais inválidas." });

      // tenta campos comuns (password, password_hash, passwordHash)
      const storedHash = user.password || user.password_hash || user.passwordHash;
      const isMatch = await bcrypt.compare(password, storedHash);
      if (!isMatch) return res.status(401).json({ message: "Credenciais inválidas." });

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
        message: "Login bem-sucedido!",
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name || user.username
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  },

  register: async (req, res) => {
    const { username, password, name, email } = req.body;

    if (!username || !password || !name || !email) {
      return res.status(400).json({ message: "Nome, usuário, e-mail e senha são obrigatórios." });
    }

    try {
      const existingUser = await UserAPIModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Nome de usuário já está em uso." });
      }

      const existingEmail = await UserAPIModel.findByEmail(email);
      if (existingEmail) {
        return res.status(409).json({ message: "E-mail já cadastrado." });
      }

      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      const newUser = await UserAPIModel.createUser({
        username,
        password_hash,
        name,
        email
      });

      const token = jwt.sign({ id: newUser.id, username: newUser.username }, JWT_SECRET, { expiresIn: '1h' });

      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        token,
        user: {
          id: newUser.id,
          username: newUser.username,
          name: newUser.name
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  }
};