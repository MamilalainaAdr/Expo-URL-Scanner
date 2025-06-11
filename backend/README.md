Installer ZAP via snap: 
snap install zaproxy --classic

ou installer via le site officiel (telecharger linux installer)
permissions necessaires au fichier: chmod 777 ZAP_*.sh
lancer l'installation: sudo ./ZAP_*

Vérifier
curl http://localhost:8080/JSON/core/view/version/

Lancer ZAP en mode daemon
avec snap: /snap/zaproxy/current/zap.sh -daemon -port 8080 -config api.disablekey=true
classique: zap.sh -daemon -port 8080 -config api.disablekey=true

Lancer l'API
npm start