import express, { Request, Response } from 'express';
import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const isExistingUser = await User.findOne({ email });
    if (isExistingUser) {
      res.status(400).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà.',
      });
      return;
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Création de l'utilisateur
    const user = new User({
      email,
      password: hashedPassword,
    });
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
    });
  } catch (error) {
    console.error('Erreur lors de l’enregistrement de l’utilisateur :', error);

    res.status(500).json({
      success: false,
      message: "Une erreur s'est produite ! Veuillez réessayer.",
    });
  }
});

//Signin Route
router.post('/signin', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const currentUser = await User.findOne({ email });

    if (!currentUser) {
      res.status(400).json({
        success: false,
        message: "L'utilisateur n'existe pas.",
      });
      return;
    }
    const isPasswordValidate = await bcrypt.compare(
      password,
      currentUser.password
    );

    if (!isPasswordValidate) {
      res.status(400).json({
        success: false,
        message: 'Mot de passe incorrect.',
      });
      return;
    }

    const token = jwt.sign({ userId: currentUser._id }, 'JWT_SECRET', {
      expiresIn: '1h',
    });

    res.status(200).json({
      success: true,
      token,
      userId: currentUser._id,
    });
  } catch (error) {
    console.error('Erreur lors de la connexion de l’utilisateur :', error);

    res.status(500).json({
      success: false,
      message: "Une erreur s'est produite ! Veuillez réessayer.",
    });
  }
});

export default router;
