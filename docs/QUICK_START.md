# ⚡ EUSES KEBAB - QUICK START CHECKLISTE

## 📥 INSTALLATION (5 Minuten)

- [ ] Node.js installiert (`node --version` prüfen)
- [ ] React-Projekt erstellt: `npx create-react-app euses-kebab`
- [ ] In Projekt-Ordner gewechselt: `cd euses-kebab`
- [ ] Firebase installiert: `npm install firebase`
- [ ] `EusesKebabSystem_V2.jsx` in `src/App.js` kopiert
- [ ] Speichern und `npm start` ausgeführt
- [ ] http://localhost:3000 öffnet sich

## 🔐 FIREBASE SETUP (10 Minuten)

- [ ] Firebase Projekt vorhanden
- [ ] **Realtime Database** erstellt
- [ ] **Security Rules** kopiert (aus INSTALLATION_GUIDE.md)
- [ ] **Authentication** aktiviert (Email/Passwort)
- [ ] Datenbank-Struktur vorbereitet:
  - [ ] `employees/` Ordner existiert
  - [ ] `products/` Ordner existiert
  - [ ] `timeLogs/` Ordner existiert
  - [ ] `sales/` Ordner existiert
  - [ ] `stamps/` Ordner existiert

## 👤 MANAGER ERSTELLEN (5 Minuten)

- [ ] Manager in Firebase Auth erstellt
  - Email: z.B. `manager@euses-kebab.de`
  - Passwort: sicheres Passwort
  - **UID kopiert** (wichtig!)
- [ ] Manager in `employees/` DB-Eintrag erstellt:
  ```json
  {
    "email": "manager@euses-kebab.de",
    "role": "manager",
    "uid": "PASTE-UID-HERE",
    "createdAt": "2024-01-15T00:00:00Z"
  }
  ```
- [ ] In der App als Manager angemeldet
- [ ] Dashboard angezeigt

## 🛒 PRODUKTE HINZUFÜGEN (10 Minuten)

Als Manager:
- [ ] Tab "🛒 Produkte" geöffnet
- [ ] Produkte hinzugefügt:
  - [ ] Döner (6.50, Essen)
  - [ ] Dürüm (6.50, Essen)
  - [ ] Lahmacun (6.50, Essen)
  - [ ] Dönerteller (8.50, Essen)
  - [ ] Pomm-Döner (7.00, Essen)
  - [ ] Euses Köfte (6.50, Essen)
  - [ ] Ayran (2.00, Getränke)
  - [ ] Çay (1.50, Getränke)
  - [ ] Cola (2.50, Getränke)
  - [ ] Uludag (2.00, Getränke)
  - [ ] Ayran Kirsch (2.00, Getränke)
  - [ ] Ayran Mango (2.00, Getränke)
  - [ ] Energy (2.50, Getränke)
  - [ ] Baklava (4.00, Nachtisch)
  - [ ] Sütlaç (3.00, Nachtisch)

## 👥 MITARBEITER ERSTELLEN (5 Minuten pro Person)

Als Manager:
- [ ] Tab "👥 Team" geöffnet
- [ ] "➕ Neuer Mitarbeiter" geklickt
- [ ] Für jeden Mitarbeiter:
  - [ ] Email eingeben (z.B. milan@...)
  - [ ] Passwort eingeben
  - [ ] Rolle: "👨‍🍳 Mitarbeiter" wählen
  - [ ] "✅ Erstellen" klicken

## ✅ TEST (10 Minuten)

Als Manager:
- [ ] Dashboard anschauen (sollte leer sein)
- [ ] "🏆 Abmelden" klicken

Als Mitarbeiter (Login mit Mitarbeiterdaten):
- [ ] ✅ Angemeldet als Mitarbeiter
- [ ] Tab "📝 Zeit" → "🚪 Einloggen" klicken
- [ ] Status sollte grün sein "✅ ARBEITET"
- [ ] Tab "💰 Kasse" ist jetzt sichtbar
- [ ] Ein paar Produkte auswählen
- [ ] "✅ Abrechnung" klicken
- [ ] ✅ Alert zeigt Summe
- [ ] **Discord-Kanal überprüfen** - sollte Nachricht haben!
- [ ] Tab "🎫 Stempel" → "➕ Neues Stempel-System"
- [ ] "Test-Stempel" mit 5 Zielen erstellen
- [ ] "➕ Stempel" klicken - Fortschritt sollte steigen
- [ ] "🚪 Ausloggen" klicken

Als Manager (neuer Login):
- [ ] Dashboard anschauen
- [ ] Statistiken sollten aktualisiert sein
- [ ] "📊 Dashboard" Tab - zeigt Umsatz & aktive Mitarbeiter
- [ ] "📈 Auswertung" Tab - zeigt detaillierte Stats

## 🎉 FERTIG!

- [ ] System lädt schnell
- [ ] Alle Tabs funktionieren
- [ ] Discord-Integration funktioniert
- [ ] Datenbank wird aktualisiert
- [ ] Mobile Ansicht funktioniert (F12 → Responsive Mode)

---

## 🚨 HÄUFIGE FEHLER

| Fehler | Lösung |
|--------|--------|
| "Auth/user-not-found" | Manager existiert nicht in Firebase |
| "Permission denied" | Security Rules nicht korrekt kopiert |
| Produkte sind leer | Produkte wurden nicht hinzugefügt |
| Kasse ist grau | Mitarbeiter muss erst einchecken |
| Discord erhält nichts | Webhook URL überprüfen |
| App lädt nicht | npm start erneut ausführen |

---

## 🔄 TÄGLICH

### Morgens (Manager)
- [ ] System starten: `npm start`
- [ ] Als Manager anmelden
- [ ] Dashboard überprüfen
- [ ] Alle Mitarbeiter zur Arbeit anmelden

### Während des Tages
- [ ] Mitarbeiter loggen sich ein/aus
- [ ] Verkäufe laufen (Discord-Meldungen kontrollieren)
- [ ] Stempel werden gesetzt

### Abends (Manager)
- [ ] Alle Mitarbeiter ausgeloggt?
- [ ] Tagesumsatz im Dashboard anschauen
- [ ] Analytics überprüfen
- [ ] Evtl. neue Produkte hinzufügen

---

## 📞 NÄCHSTE SCHRITTE

1. **ALLE diese Schritte durchführen** ✓
2. **Mobil testen** (öffne auf Smartphone)
3. **Mitarbeiter trainieren** (10 Min. Einführung)
4. **System eine Woche testen**
5. **Backup machen** (Firebase Export)
6. **Eventuell deployen** (auf Vercel/Firebase Hosting)

---

## 💡 TIPPS

- **Passwörter speichern**: Nutze einen Passwort-Manager (1Password, Bitwarden)
- **Regelmäßig Backups**: Firebase hat automatische Backups, aber exportieren ist auch gut
- **Mobile App**: Die Web-App funktioniert auch im Browser des Smartphones!
- **Discord Channel**: Erstelle einen privaten Channel für Verkaufs-Meldungen
- **Statistiken**: Nutze die Analytics regelmäßig um Trends zu sehen

---

## ✨ ADVANCED (Optional)

Falls später noch interessant:
- [ ] **Custom Domain**: Vercel Deployment mit eigener Domain
- [ ] **Push Notifications**: Browser-Benachrichtigungen bei Verkaufen
- [ ] **SMS Alerts**: Manager benachrichtigen bei großen Umsätzen
- [ ] **Kasse Drucker**: Quittungen ausdrucken
- [ ] **Netzwerk Offline**: App funktioniert auch ohne Internet (mit Service Worker)

---

**Geschätzte Zeit bis "Ready to use": 45 Minuten**

🚀 **LOS GEHT'S!**
