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
    const { username, email, password, tipo, cnpj, telefone } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Nome e senha são obrigatórios." });
    }

    // Validações específicas por tipo
    if (tipo === 'empresa') {
      if (!cnpj || !email || !telefone) {
        return res.status(400).json({ message: "CNPJ, email e telefone são obrigatórios para empresas." });
      }
    }

    try {
      // Verifica se o usuário já existe (por username)
      const existingUser = await UserAPIModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Nome de usuário já existe." });
      }

      // Verifica se o email já existe (se fornecido)
      if (email) {
        const existingEmail = await UserAPIModel.findByEmail(email);
        if (existingEmail) {
          return res.status(409).json({ message: "Email já cadastrado." });
        }
      }

      // Verifica se o CNPJ já existe (para empresas)
      if (tipo === 'empresa' && cnpj) {
        const existingCNPJ = await UserAPIModel.findByCNPJ(cnpj);
        if (existingCNPJ) {
          return res.status(409).json({ message: "CNPJ já cadastrado." });
        }
      }

      // Hash da senha
      const salt = await bcrypt.genSalt(10);
      const password_hash = await bcrypt.hash(password, salt);

      // Cria o novo usuário
      const newUser = await UserAPIModel.createUser({ 
        username, 
        email,
        password_hash,
        tipo: tipo || 'usuario',
        cnpj,
        telefone
      });
      
      res.status(201).json({
        message: "Usuário registrado com sucesso!",
        user: { 
          id: newUser.id, 
          username: newUser.username,
          tipo: newUser.tipo
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  },

  // Recuperação de senha
  forgotPassword: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório." });
    }

    try {
      // Verifica se o email existe
      const user = await UserAPIModel.findByEmail(email);
      
      // Por segurança, sempre retorna sucesso mesmo se o email não existir
      // Isso previne que atacantes descubram emails válidos
      if (!user) {
        return res.status(200).json({ 
          message: "Se o email estiver cadastrado, você receberá um link de recuperação." 
        });
      }

      // TODO: Implementar geração de token de recuperação e envio de email
      // Por enquanto, apenas simulamos o sucesso
      // Em produção, você deve:
      // 1. Gerar um token único e temporário
      // 2. Salvar o token no banco com data de expiração
      // 3. Enviar email com link contendo o token
      
      console.log(`[SIMULAÇÃO] Link de recuperação seria enviado para: ${email}`);
      console.log(`[SIMULAÇÃO] Usuário: ${user.username}`);

      res.status(200).json({ 
        message: "Link de recuperação enviado! Verifique seu email." 
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro no servidor." });
    }
  }


};