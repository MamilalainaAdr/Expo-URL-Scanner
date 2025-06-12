import express from 'express'
import axios from 'axios'
import morgan from 'morgan';
import 'dotenv/config'; //charge les .env

const app = express()
const PORT = 3000;

app.use(morgan('dev'));

// Recuperer les venv
const{
  API_TOKEN,
  ZAP_API_URL,
  ZAP_API_KEY
} = process.env;

// Middleware de vérification du token API
const checkApiToken = (req, res, next) => {
  const clientToken = req.query.token || req.headers['x-api-token'];
  
  if (!clientToken || clientToken !== API_TOKEN) {
    return res.status(403).json({ 
      error: "Accès refusé : token API invalide" 
    });
  }
  next();
};
app.get('/scan', checkApiToken, async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Paramètre 'url' manquant" });
  }

  try {
    // 1. Lancement du spider (crawl du site) avec le token
    await axios.get(`${ZAP_API_URL}/spider/action/scan`, {
      params: { url: targetUrl },
      headers: {
        "X-ZAP-API-Key": ZAP_API_KEY,
        "Accept": "application/json"
      }
    });

    // 2. Attente du résultat (simplifié)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 3. Récupération du rapport
    const report = await axios.get(`${ZAP_API_URL}/core/view/alerts`, {
      params: { baseurl: targetUrl }
    });
    // Filtrage des alertes importantes
    const filteredAlerts = report.data.alerts.map(alert => ({
      name: alert.name,
      risk: alert.risk,
      description: alert.description,
      solution: alert.solution
    }));

    res.json({ url: targetUrl, alerts: filteredAlerts });

  } catch (error) {
    res.status(500).json({ error: "Échec du scan", details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`API en écoute sur http://localhost:${PORT}`);
});