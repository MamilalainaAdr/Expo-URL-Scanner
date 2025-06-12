# API pour interagir avec ZAP
L'API se charge de lancer les requetes vers ZAP et retourner les résultats au format JSON
---
## Configuration de ZAP
Installer ZAP: 
```bash
# installation via snap
snap install zaproxy --classic

# ou installer via le site officiel (telecharger linux installer)

# permissions necessaires au fichier: 
chmod 777 ZAP_*.sh
# lancer l'installation
sudo ./ZAP_*.sh
# Vérifier
curl http://localhost:8080/JSON/core/view/version/

# Lancer ZAP en mode daemon
# avec snap:
/snap/zaproxy/current/zap.sh -daemon -port 8080 -config api.key=ta_cle_api
# classique: 
zap.sh -daemon -port 8080 -config api.key=ta_cle_api
```
---

## Configuration du backend
```bash
# Renommer le .env.development en .env et mettre a jour les clés API (pour ZAP et l'API)
mv .env.development .env

# Lancer l'API
npm start
```
