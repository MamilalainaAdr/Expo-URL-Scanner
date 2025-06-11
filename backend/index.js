import express from 'express'
import axios from 'axios'
const app = express()
const ZAP_API_URL = 'http://localhost:8080/JSON';
const PORT = 3000;

// Route de test
app.get('/', (req, res) => {
  res.send('API ZAP Scanner');
});

app.get('/scan', async (req, res) => {
  const targetUrl = req.query.url;
  if (!targetUrl) {
    return res.status(400).json({ error: "Paramètre 'url' manquant" });
  }

  try {
    // 1. Lancement du spider (crawl du site)
    await axios.get(`${ZAP_API_URL}/spider/action/scan`, {
      params: { url: targetUrl }
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