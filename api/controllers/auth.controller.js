// /api/controllers/auth.controller.js
import { UserAPIModel } from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = "SEU_PI_PRECISA_DE_UMA_CHAVE_SECRETA_FORTE"; // Mude isso!

export const AuthAPIController = {
  
  login: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
    }

    try {
      // 1. Encontra o usuário no banco
      const user = await UserAPIModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      // 2. Compara a senha
      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      // 3. Gera um Token JWT
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: '1h' } // Token expira em 1 hora
      );

      // 4. Envia o token para o cliente
      res.status(200).json({
        message: "Login bem-sucedido!",
        token: token,
        user: { id: user.id, username: user.username }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  },

  // (Aqui você criaria a função 'register')
  register: async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Usuário e senha são obrigatórios." });
    }

    try {
      // Verifica se o usuário já existe
      const existingUser = await UserAPIModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Usuário já existe." });
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Cria o novo usuário
      const newUser = await UserAPIModel.createUser({ username, password_hash });
      
      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        user: { id: newUser.id, username: newUser.username }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  }


};