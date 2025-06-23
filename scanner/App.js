import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from './styles';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedScan, setSelectedScan] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [hasResults, setHasResults] = useState(false);
  const [showDeleteButton, setShowDeleteButton] = useState(false);

  const hideTimeout = useRef(null);

  useEffect(() => {
    if (showDeleteButton) {
      hideTimeout.current = setTimeout(() => {
        setShowDeleteButton(false);
      }, 3000);
    } else {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    }
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
        hideTimeout.current = null;
      }
    };
  }, [showDeleteButton]);

  const getRiskColor = (risk) => {
    if (risk === 'High') return 'red';
    if (risk === 'Medium') return 'orange';
    if (risk === 'Low') return 'green';
    return 'gray';
  };

  const handleScan = async () => {
    if (!url.trim()) {
      setError('Veuillez entrer une URL');
      return;
    }

    let finalUrl = url.trim();
    if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
      finalUrl = 'https://' + finalUrl;
    }

    setLoading(true);
    setError('');
    setResults([]);
    setScanCompleted(false);
    setHasResults(false);

    try {
      const response = await fetch(
        `http://192.168.43.243:3000/scan?url=${encodeURIComponent(finalUrl)}&token=api_token`
      );

      const data = await response.json();

      if (!data.alerts || data.alerts.length === 0) {
        setError('Vérifiez votre URL');
      } else {
        setResults(data.alerts);
        await saveToHistory(finalUrl, data.alerts);
        setScanCompleted(true);
        setHasResults(true);
      }
    } catch (err) {
      console.log(err);
      setError("Erreur lors de la connexion à l’API");
    } finally {
      setLoading(false);
    }
  };

  const saveToHistory = async (url, alerts) => {
    try {
      const existing = await AsyncStorage.getItem('scan_history');
      const history = existing ? JSON.parse(existing) : [];

      const newEntry = {
        url,
        date: new Date().toLocaleString(),
        resultCount: alerts.length,
        alerts,
      };

      history.unshift(newEntry);
      await AsyncStorage.setItem('scan_history', JSON.stringify(history));
    } catch (e) {
      console.log('Erreur de sauvegarde de l’historique :', e);
    }
  };

  const loadHistory = async () => {
    try {
      const stored = await AsyncStorage.getItem('scan_history');
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(parsed);
    } catch (e) {
      console.log('Erreur lors du chargement de l’historique :', e);
    }
  };

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('scan_history');
      setHistory([]);
      setShowDeleteButton(false);
    } catch (e) {
      console.log('Erreur lors de la suppression de l’historique :', e);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerBar}>
        <Image source={require('./assets/logo3.png')} style={styles.logo} resizeMode="contain" />
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)} style={styles.menuButton}>
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* OVERLAY */}
      {showMenu && (
        <TouchableWithoutFeedback onPress={() => setShowMenu(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* MENU DÉROULANT */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          <Button
            title="Voir historique"
            onPress={() => {
              loadHistory();
              setShowHistory(true);
              setShowMenu(false);
            }}
          />
          <Button
            title="À propos"
            onPress={() => {
              info ('Cette application permet de scanner la sécurité des sites web en détectant les vulnérabilités et en les classant selon leur niveau de gravité.');
              setShowMenu(false);
            }}
          />
        </View>
      )}

      {showHistory && (
        <View style={styles.historyControls}>
          <View style={styles.wideButton}>
            <Button
              title="Retour au scan"
              onPress={() => {
                setShowHistory(false);
                setSelectedScan(null);
                setShowDeleteButton(false);
              }}
            />
          </View>

          {showDeleteButton ? (
            <Button title="Effacer l’historique" color="red" onPress={clearHistory} />
          ) : (
            <TouchableOpacity onPress={() => setShowDeleteButton(true)}>
              <Text style={styles.trashIcon}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      <Text style={styles.title}>
        {showHistory ? 'Historique de scan' : 'Scanner de site web'}
      </Text>

      {!showHistory && !selectedScan && (
        <View style={{ marginTop: 30 }}>
          {error !== '' && <Text style={styles.error}>{error}</Text>}

          <TextInput
            style={styles.input}
            placeholder="Entrez l’URL à scanner ex:google.com"
            value={url}
            onChangeText={setUrl}
            editable={!scanCompleted}
          />

          {!scanCompleted ? (
            <Button title="Analyser" onPress={handleScan} color="#007bff" />
          ) : hasResults ? (
            <Button
              title="🔄 Faire un autre scan"
              onPress={() => {
                setUrl('');
                setResults([]);
                setError('');
                setScanCompleted(false);
                setHasResults(false);
              }}
            />
          ) : null}

          {!scanCompleted && !loading && (
            <Text style={styles.appDescription}>
              
            </Text>
          )}

          {loading && <ActivityIndicator size="large" color="#0000ff" />}
          
        </View>
      )}

      {scanCompleted && hasResults && !showHistory && !selectedScan && (
        <ScrollView style={styles.resultContainer}>
          {results.map((alert, index) => (
            <View key={index} style={styles.alertBox}>
              <Text style={styles.alertTitle}>{alert.name}</Text>
              <Text style={{ color: getRiskColor(alert.risk), fontWeight: 'bold' }}>
                {alert.risk === 'High'
                  ? '🔴'
                  : alert.risk === 'Medium'
                  ? '🟠'
                  : alert.risk === 'Low'
                  ? '🟢'
                  : '⚪️'}{' '}
                Gravité : {alert.risk}
              </Text>
              <Text>Description : {alert.description}</Text>
              <Text>Solution : {alert.solution}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {selectedScan && (
        <>
          <View style={styles.detailRow}>
            <Text style={styles.Detail}>Détails du scan : </Text>
            <Text style={styles.Detail}>{selectedScan?.url}</Text>
          </View>
          <ScrollView style={styles.resultContainer}>
            {selectedScan.alerts.map((alert, index) => (
              <View key={index} style={styles.alertBox}>
                <Text style={styles.alertTitle}>{alert.name}</Text>
                <Text style={{ color: getRiskColor(alert.risk), fontWeight: 'bold' }}>
                  {alert.risk === 'High'
                    ? '🔴'
                    : alert.risk === 'Medium'
                    ? '🟠'
                    : alert.risk === 'Low'
                    ? '🟢'
                    : '⚪️'}{' '}
                  Gravité : {alert.risk}
                </Text>
                <Text>Description : {alert.description}</Text>
                <Text>Solution : {alert.solution}</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="Retour à l’historique" onPress={() => setSelectedScan(null)} />
        </>
      )}

      <ScrollView style={styles.resultContainer}>
        {showHistory && !selectedScan ? (
          history.length === 0 ? (
            <Text style={styles.error}>Aucun historique enregistré.</Text>
          ) : (
            history.map((entry, index) => (
              <View key={index} style={styles.alertBox}>
                <Text style={styles.alertTitle}>{entry.url}</Text>
                <Text>Vulnérabilités : {entry.resultCount}</Text>
                <Text>Date : {entry.date}</Text>
                <Button title="Voir détails" onPress={() => setSelectedScan(entry)} />
              </View>
            ))
          )
        ) : null}
      </ScrollView>
    </View>
  );
}
