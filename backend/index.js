// index.js
import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Route pour envoyer l'email
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  // Validation des champs
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      message: "Tous les champs sont requis" 
    });
  }

  try {
    // Transporter Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "soulaymazay@gmail.com",
        pass: "qdar jjvi mknf riku"
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // 1. Email reçu par la société (avec replyTo pour répondre au client)
    await transporter.sendMail({
      from: '"Site Web GLOIRE" <soulaymazay@gmail.com>',
      replyTo: email,
      to: "soulaymazay@gmail.com",
      subject: `Nouveau message de ${name}`,
      text: `Nouveau message reçu via le formulaire de contact :

Nom : ${name}
Email : ${email}
Message :
${message}

---
Cet email a été envoyé depuis le formulaire de contact du site web GLOIRE.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px;">
            Nouveau message de contact - GLOIRE
          </h2>
          <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <p><strong style="color: #4CAF50;">Nom :</strong> ${name}</p>
            <p><strong style="color: #4CAF50;">Email :</strong> ${email}</p>
            <p><strong style="color: #4CAF50;">Message :</strong></p>
            <div style="background-color: white; padding: 15px; border-left: 4px solid #4CAF50; margin: 10px 0;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          <hr style="margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Cet email a été envoyé depuis le formulaire de contact du site web GLOIRE.<br>
            Pour répondre, cliquez simplement sur "Répondre".
          </p>
        </div>
      `
    });

    // 2. Email de confirmation pour le client (EXACTEMENT comme dans l'image)
    await transporter.sendMail({
      from: '"GLOIRE" <soulaymazay@gmail.com>',
      to: email,
      subject: "Confirmation de réception",
      text: `Bonjour ${name},

Nous avons bien reçu votre message.

Cordialement,
L'équipe de GLOIRE`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #4CAF50; margin: 0;">GLOIRE</h1>
            <p style="color: #666; margin-top: 5px;">Votre succès, notre engagement</p>
          </div>
          
          <div style="background-color: #f9f9f9; padding: 25px; border-radius: 10px;">
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
              Bonjour <strong>${name}</strong>,
            </p>
            
            <p style="font-size: 15px; color: #555; line-height: 1.6;">
              Nous avons bien reçu votre message.
            </p>
            
            <div style="margin: 30px 0; padding: 20px; background-color: white; border-left: 4px solid #4CAF50;">
              <p style="font-style: italic; color: #666; margin: 0;">
                "Votre satisfaction est notre priorité"
              </p>
            </div>
            
            <p style="font-size: 15px; color: #555; line-height: 1.6;">
              Nous vous répondrons dans les plus brefs délais.
            </p>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
            <p style="color: #333; font-weight: bold; margin-bottom: 5px;">
              Cordialement,
            </p>
            <p style="color: #4CAF50; font-size: 18px; font-weight: bold; margin: 0;">
              L'équipe de GLOIRE
            </p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background-color: #f5f5f5; border-radius: 5px;">
            <p style="color: #666; font-size: 12px; text-align: center; margin: 0;">
              Ceci est un message automatique, merci de ne pas y répondre.<br>
              © ${new Date().getFullYear()} GLOIRE. Tous droits réservés.
            </p>
          </div>
        </div>
      `
    });

    res.status(200).json({ 
      success: true, 
      message: "Email envoyé avec succès !" 
    });

  } catch (error) {
    console.error("Erreur lors de l'envoi :", error);
    res.status(500).json({ 
      success: false, 
      message: "Erreur lors de l'envoi de l'email",
      error: error.message 
    });
  }
});

// Route de test
app.get("/", (req, res) => {
  res.json({ 
    message: "Serveur d'envoi d'emails GLOIRE",
    endpoint: "POST /send-email",
    required_fields: ["name", "email", "message"]
  });
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: "Route non trouvée" 
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur GLOIRE démarré sur http://localhost:${PORT}`);
});