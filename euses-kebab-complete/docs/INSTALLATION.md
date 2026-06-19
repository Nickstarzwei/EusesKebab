# 🔥 EUSES KEBAB Management System v2.0 - Vollständige Installationsanleitung

## 📋 Was ist enthalten?

✅ **Zeiterfassung** - Ein/Ausloggen mit Stundentracking  
✅ **Kassensystem** - Verkäufe erfassen mit Discord-Integration  
✅ **Stempel-System** - Treuepunkte für Mitarbeiter  
✅ **Manager-Dashboard** - Live-Statistiken und Umsatzübersicht  
✅ **Produktverwaltung** - Produkte hinzufügen/bearbeiten/löschen  
✅ **Mitarbeiterverwaltung** - Neue Mitarbeiter erstellen  
✅ **Analytics** - Detaillierte Auswertungen und Top-Statistiken  

---

## 🚀 INSTALLATION - SCHRITT FÜR SCHRITT

### Schritt 1: Node.js & npm installieren

Falls nicht vorhanden:
- Windows/Mac: https://nodejs.org/de
- Linux: `sudo apt install nodejs npm`

Überprüfen:
```bash
node --version
npm --version
```

### Schritt 2: Projekt erstellen

```bash
# Neues React-Projekt
npx create-react-app euses-kebab
cd euses-kebab

# Dependencies installieren
npm install firebase
```

### Schritt 3: App.js ersetzen

1. Öffne `src/App.js`
2. Lösche den gesamten Inhalt
3. Kopiere den Inhalt von `EusesKebabSystem_V2.jsx` rein
4. Speichern!

### Schritt 4: Starten

```bash
npm start
```

Die App läuft jetzt auf **http://localhost:3000** 🎉

---

## 🔐 FIREBASE SETUP

### 1. Datenbank initialisieren

Firebase Console → **Realtime Database** → **Create Database**

Regeln kopieren:

```json
{
  "rules": {
    "employees": {
      ".read": "auth != null",
      ".write": "root.child('employees').child(auth.uid).child('role').val() === 'manager'",
      "$id": {
        ".validate": "newData.hasChildren(['email', 'role', 'uid', 'createdAt'])"
      }
    },
    "timeLogs": {
      ".read": "auth != null",
      ".write": "auth != null",
      "$log": {
        ".validate": "newData.hasChildren(['email', 'timestamp', 'uid'])"
      }
    },
    "sales": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "stamps": {
      ".read": "auth != null",
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid"
      }
    },
    "products": {
      ".read": "auth != null",
      ".write": "root.child('employees').child(auth.uid).child('role').val() === 'manager'"
    }
  }
}
```

### 2. Authentication konfigurieren

Firebase Console → **Authentication** → **Sign-in method**

Aktivieren:
- ✅ Email/Passwort

### 3. Datenbank-Struktur vorbereiten

Gehe zu Realtime Database und erstelle folgende Struktur (unter "Data"):

```
euses-kebab/
├── employees/
│   └── -M1a2b3c4d5e (auto-generierte ID)
│       ├── email: "manager@euses-kebab.de"
│       ├── role: "manager"
│       ├── uid: "firebase-uid-hier"
│       └── createdAt: "2024-01-01T00:00:00Z"
├── products/
│   ├── -prod1: {name: "Döner", price: 6.5, category: "essens"}
│   ├── -prod2: {name: "Ayran", price: 2, category: "getraenke"}
│   └── -prod3: {name: "Baklava", price: 4, category: "nachtisch"}
├── timeLogs/
├── sales/
└── stamps/
```

---

## 👤 MANAGER ERSTELLEN

### 1. Firebase Authentication

1. Firebase Console → **Authentication** → **Users**
2. Klick **Add user**
3. Email: `manager@euses-kebab.de`
4. Passwort: Sicheres Passwort (min. 6 Zeichen)
5. **Copy the UID** (lange ID oben)

### 2. In Realtime Database eintragen

Realtime Database → **employees** → **Add child**

```json
{
  "email": "manager@euses-kebab.de",
  "role": "manager",
  "uid": "PASTE-UID-HERE",
  "createdAt": "2024-01-15T00:00:00Z"
}
```

### 3. In der App anmelden

- Öffne http://localhost:3000
- Email: `manager@euses-kebab.de`
- Passwort: dein Passwort
- ✅ Login!

---

## 📊 ERSTE SCHRITTE ALS MANAGER

### 1. Produkte hinzufügen

1. Im System anmelden als Manager
2. Tab **"🛒 Produkte"** klicken
3. **"➕ Neues Produkt"** klicken
4. Eingeben:
   - Name: "Döner"
   - Preis: "6.50"
   - Kategorie: "🍖 Essen"
5. **"✅ Erstellen"** klicken

Wiederhole für alle Produkte aus deiner Speisekarte.

### 2. Mitarbeiter hinzufügen

1. Tab **"👥 Team"** klicken
2. **"➕ Neuer Mitarbeiter"** klicken
3. Email: "mitarbeiter@euses-kebab.de"
4. Passwort: Sicheres Passwort
5. Rolle: "👨‍🍳 Mitarbeiter"
6. **"✅ Erstellen"** klicken

### 3. Discord verbinden (bereits vorbereitet!)

Webhook-URL ist bereits eingebunden. Verkäufe werden automatisch an Discord gesendet!

---

## 👨‍🍳 FÜR MITARBEITER

### Arbeitsablauf

1. **Anmelden** mit deinen Login-Daten
2. **Einloggen** - Tab "📝 Zeit" → "🚪 Einloggen" klicken
3. **Verkaufen** - Tab "💰 Kasse" wird sichtbar
   - Produkte anklicken
   - "✅ Abrechnung" klicken
   - ✅ Wird zu Discord geschickt!
4. **Stempel** - Tab "🎫 Stempel" für Treuepunkte
5. **Ausloggen** - Tab "📝 Zeit" → "🚪 Ausloggen" klicken

---

## 🎯 FEATURES ERKLÄRT

### ⏱️ Zeiterfassung

- **Ein/Ausloggen** mit Zeitstempel
- Automatische **Dauer-Berechnung**
- Nur während Arbeitszeit können Verkäufe erfasst werden
- Übersicht über aktive Mitarbeiter

### 💰 Kassensystem

- Produkte nach **Kategorie** filtern
- **Warenkorb** mit Artikelverwaltung
- Automatische **Summen-Berechnung**
- **Discord-Meldung** bei jedem Verkauf
- Verkauf in Datenbank gespeichert

Beispiel Discord-Nachricht:
```
💰 Neuer Verkauf
👨‍🍳 Mitarbeiter: milan
🕐 Zeit: 12:34:56
📦 Artikel (2x)
• Döner €6.50
• Ayran €2.00
💵 Summe: €8.50
```

### 🎫 Stempel-System

- **Eigene Stempel erstellen** (z.B. "10x Döner = gratis Getränk")
- **Stempel hinzufügen** mit einem Klick
- **Fortschrittsanzeige** visualisiert Ziel
- **Reset & Löschen** möglich
- 🏆 Benachrichtigung beim Erreichen des Ziels

### 📊 Manager Dashboard

- **Live-Statistiken**:
  - Umsatz heute
  - Gesamtumsatz
  - Aktive Mitarbeiter
  - Anzahl Verkäufe
- **Mitarbeiter-Übersicht** mit aktueller Arbeitszeit

### 📈 Analytics & Auswertungen

- 💵 **Gesamtumsatz** aller Zeiten
- 📦 **Anzahl Verkäufe**
- 📊 **Durchschnittlicher Verkauf**
- ⭐ **Top Mitarbeiter** (nach Umsatz)
- 🏆 **Top 5 Produkte** (meistverkauft)
- 📅 **Umsatz nach Tag**

---

## 🔗 DISCORD WEBHOOK (bereits konfiguriert)

Die Webhook-URL ist bereits eingebunden:
```
https://discord.com/api/webhooks/1479186089397719060/evYXofPEG-K5pS0TE7Xozrbv254jvIPsBSunh-VR6djV5bXyugHLzyApvWq-jY7obP1J
```

**Verkäufe werden automatisch zu Discord geschickt!**

Falls du eine andere Webhook brauchst:
1. In Discord → Server → #Kanal auswählen
2. Kanal-Einstellungen → Integrationen → Webhooks
3. "Neuer Webhook" erstellen
4. In der App ersetzen (Zeile ~30 in der JSX Datei)

---

## 💾 DATENBANK STRUKTUR

### employees
```json
{
  "email": "mail@example.com",
  "role": "manager|employee",
  "uid": "firebase-uid",
  "createdAt": "ISO-8601 timestamp"
}
```

### timeLogs
```json
{
  "email": "mail@example.com",
  "timestamp": "2024-01-15T08:00:00Z",
  "checkOutTime": "2024-01-15T16:30:00Z",
  "durationMinutes": 510,
  "uid": "firebase-uid",
  "name": "username"
}
```

### sales
```json
{
  "timestamp": "2024-01-15T12:30:00Z",
  "employee": "mail@example.com",
  "items": [
    {"name": "Döner", "price": 6.50},
    {"name": "Ayran", "price": 2.00}
  ],
  "totalPrice": 8.50,
  "uid": "firebase-uid",
  "itemCount": 2
}
```

### products
```json
{
  "name": "Döner",
  "price": 6.50,
  "category": "essens|getraenke|nachtisch"
}
```

### stamps
```json
{
  "user-uid": {
    "stamp-id": {
      "name": "Döner Stempel",
      "target": 10,
      "current": 7,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

---

## 🐛 TROUBLESHOOTING

| Problem | Lösung |
|---------|--------|
| **Anmeldung schlägt fehl** | Manager muss vorher in Firebase erstellt werden |
| **Verkäufe sind grau** | Mitarbeiter muss zuerst einchecken |
| **Discord erhält keine Meldungen** | Webhook-URL überprüfen, Netzwerk-Tab ansehen |
| **Produkte sind leer** | Manager muss Produkte hinzufügen |
| **Fehler "auth/user-not-found"** | Firebase Auth aktiviert? Richtige Email? |
| **Datenbank ist leer** | Security Rules zu restriktiv? Prüfen! |

---

## 📱 MOBILE OPTIMIERUNG

Die App ist **vollständig mobil optimiert**!

- ✅ Responsive Design (Tablets, Phones)
- ✅ Touch-freundliche Buttons
- ✅ Automatisch skalierend
- ✅ Offline-Cache (teilweise)

---

## 🔐 SICHERHEIT

### Best Practices

1. **Starke Passwörter** verwenden (min. 8 Zeichen)
2. **Firebase Rules** implementiert (siehe oben)
3. **Nur Manager** können Produkte/Mitarbeiter verwalten
4. **Nur User** können eigene Daten ändern
5. **Webhook URL** ist sicher (Read-only)

### WICHTIG: Firebase Security Rules

Die Security Rules sind KRITISCH! Ohne sie kann jeder auf alles zugreifen!

Kopiere die Rules aus "SCHRITT 4" oben in Firebase Console!

---

## 🚀 DEPLOYMENT

### Auf Vercel (kostenlos, empfohlen)

```bash
# Vercel CLI installieren
npm install -g vercel

# Deployen
vercel
```

Dann:
- Repo wählen
- Projekt bestätigen
- ✅ Live!

### Auf Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📞 SUPPORT & WEITERE INFOS

- **Firebase Docs**: https://firebase.google.com/docs
- **React Docs**: https://react.dev
- **Discord Webhooks**: https://discord.com/developers/docs/resources/webhook

---

## 📝 LIZENZ

Dieses System wurde speziell für Euses Kebab entwickelt.

---

**Version**: 2.0.0  
**Letzte Aktualisierung**: Januar 2024  
**Status**: ✅ Production Ready
