# 📱 EUSES KEBAB - VISUELLE ANLEITUNG

## 🎬 SCHRITT-FÜR-SCHRITT SETUP

### TEIL 1: Installation

```
┌─────────────────────────────────────┐
│   1. Node.js von nodejs.org         │
│      downloaden & installieren      │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   2. Terminal öffnen und folgendes  │
│      eingeben:                      │
│                                     │
│   npx create-react-app euses-kebab  │
│   cd euses-kebab                    │
│   npm install firebase              │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   3. Code-Editor öffnen             │
│      (VSCode, Sublime, etc.)        │
│                                     │
│   Datei: src/App.js öffnen          │
│   Ganzer Inhalt löschen             │
│   EusesKebabSystem_V2.jsx kopieren  │
│   Speichern                         │
└─────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────┐
│   4. Terminal: npm start            │
│                                     │
│   → http://localhost:3000 öffnet    │
└─────────────────────────────────────┘
```

### TEIL 2: Firebase Konfiguration

```
Firebase Console (console.firebase.google.com)
├── Projekt auswählen (euses-kebab)
├── Build → Realtime Database
│   ├── Create Database
│   ├── Location: Europe (belgium)
│   ├── Security Rules:
│   │   [Kopiere die Rules aus INSTALLATION_GUIDE.md]
│   └── Publish
├── Build → Authentication
│   ├── Sign-in method
│   ├── Email/Passwort aktivieren ✓
│   └── Save
└── Build → Database
    └── Struktur anlegen:
        employees/
        products/
        timeLogs/
        sales/
        stamps/
```

---

## 👤 MANAGER SETUP

### Schritt 1: Manager in Firebase erstellen

**Firebase Console:**
```
Authentication → Users → Add user

Email:    manager@euses-kebab.de
Password: YourSecurePassword123!

[Add User]

→ UID: [COPY THIS - LONG TEXT]
```

### Schritt 2: Manager in Datenbank eintragen

**Realtime Database → employees → + Add child**

```json
{
  "name": "NewKey",
  "value": {
    "email": "manager@euses-kebab.de",
    "role": "manager",
    "uid": "PASTE-THE-UID-HERE",
    "createdAt": "2024-01-15T00:00:00Z"
  }
}
```

### Schritt 3: Anmelden testen

```
http://localhost:3000
├── Email: manager@euses-kebab.de
├── Passwort: YourSecurePassword123!
└── [Login] → ✅ Sollte Dashboard zeigen
```

---

## 🛒 PRODUKTE EINRICHTEN

### Als Manager angemeldet:

```
Navigation:
┌──────────────────────────────────────────┐
│ 📝 Zeit │ 💰 Kasse │ 🎫 Stempel │        │
│ 📊 Dashboard │ 🛒 PRODUKTE │ 👥 Team │   │
│ 📈 Auswertung │                         │
└──────────────────────────────────────────┘
         ↓ Klick auf "🛒 Produkte"
```

### Produkte hinzufügen:

```
Schirm:
┌─────────────────────────────────────┐
│         🛒 Produktverwaltung        │
├─────────────────────────────────────┤
│  [➕ Neues Produkt]                 │
├─────────────────────────────────────┤
│                                     │
│  Essen (🍖)      │  Getränke (🥤)  │
│  ─────────────────────────────────  │
│  □ Döner          □ Ayran           │
│    €6.50            €2.00           │
│  □ Dürüm          □ Cola            │
│    €6.50            €2.50           │
│  □ Lahmacun       □ Energy          │
│    €6.50            €2.50           │
│  □ Dönerteller                      │
│    €8.50          Nachtisch (🍰)    │
│  □ Pomm-Döner    ─────────────────  │
│    €7.00          □ Baklava (NS)    │
│  □ Euses Köfte      €4.00           │
│    €6.50          □ Sütlaç          │
│                     €3.00           │
│                                     │
└─────────────────────────────────────┘
```

### Formular ausfüllen:

```
[➕ Neues Produkt] Klicken

┌─────────────────────────────────────┐
│ Produktname: [Döner_____________]   │
├─────────────────────────────────────┤
│ Preis:       [6.50_______________]  │
├─────────────────────────────────────┤
│ Kategorie:   [🍖 Essen        ▼]    │
├─────────────────────────────────────┤
│         [✅ Erstellen] [✕ Abbrechen] │
└─────────────────────────────────────┘

→ Produkt listet sich darunter auf
→ Wiederholen für alle Produkte
```

---

## 👥 MITARBEITER ERSTELLEN

### Tab: 👥 Team öffnen

```
[➕ Neuer Mitarbeiter] Klicken

┌──────────────────────────────────────┐
│ 📧 E-Mail: [milan@euses.de______]   │
├──────────────────────────────────────┤
│ 🔒 Passwort: [MyPassword123!____]   │
├──────────────────────────────────────┤
│ Rolle: [👨‍🍳 Mitarbeiter     ▼]       │
│   └─ 👨‍🍳 Mitarbeiter                │
│   └─ 👨‍💼 Manager                     │
├──────────────────────────────────────┤
│    [✅ Erstellen] [✕ Abbrechen]      │
└──────────────────────────────────────┘

Wiederhole für alle Mitarbeiter:
- milan@euses.de
- ahmet@euses.de
- fatih@euses.de
- etc.
```

---

## 🚀 MITARBEITER STARTEN IHRE ARBEIT

### Schritt 1: Anmelden

```
http://localhost:3000

┌──────────────────────────────────────┐
│            🔥 EUSES KEBAB           │
│        Management System            │
├──────────────────────────────────────┤
│                                      │
│  [📧 E-Mail_____________________]   │
│                                      │
│  [🔒 Passwort_________________]    │
│                                      │
│         [🚪 Anmelden]               │
│                                      │
│  👨‍💼 Manager oder Mitarbeiter?       │
│  Kontaktieren Sie den Manager       │
│  für Login-Daten                    │
└──────────────────────────────────────┘

E-Mail: milan@euses.de
Passwort: MyPassword123!
[Anmelden] → ✅
```

### Schritt 2: Einchecken (Zeiterfassung)

```
Navigation: [📝 Zeit] (aktiv)

┌──────────────────────────────────────┐
│        ⏱️ Zeiterfassung              │
├──────────────────────────────────────┤
│                                      │
│        ⏸️ NICHT ARBEITET             │
│                                      │
│  Klicke um deine Schicht zu starten  │
│                                      │
│      [🚪 Einloggen]                 │
│                                      │
└──────────────────────────────────────┘

[Einloggen] Klicken

        ↓↓↓ Status ändert sich ↓↓↓

┌──────────────────────────────────────┐
│        ⏱️ Zeiterfassung              │
├──────────────────────────────────────┤
│                                      │
│        ✅ ARBEITET                   │
│                                      │
│  🕐 Eincheckt: 12.01.2024 - 08:30   │
│  ⏰ Arbeitszeit: 0h 0m               │
│                                      │
│      [🚪 Ausloggen]                 │
│                                      │
└──────────────────────────────────────┘

→ Jetzt können Verkäufe erfasst werden!
→ Tab "💰 Kasse" wird sichtbar!
```

### Schritt 3: Verkaufen (Kasse)

```
Navigation: [📝 Zeit] [💰 KASSE]

┌──────────────────────────────────────┐
│         💰 Kassensystem              │
├──────────────────────────────────────┤
│ Kategorien:                          │
│ [📦 Alle] [🍖 Essen] [🥤 Getränke]  │
│ [🍰 Nachtisch]                       │
├──────────────────────────────────────┤
│ Verfügbare Produkte:                 │
│                                      │
│ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │ Döner  │ │ Dürüm  │ │Lahmacun│   │
│ │€6.50   │ │€6.50   │ │€6.50   │   │
│ └────────┘ └────────┘ └────────┘    │
│ ┌────────┐ ┌────────┐ ┌────────┐    │
│ │Dönert. │ │Pomm-D. │ │ Ayran  │   │
│ │€8.50   │ │€7.00   │ │€2.00   │   │
│ └────────┘ └────────┘ └────────┘    │
│      [und mehr...]                   │
├──────────────────────────────────────┤
│ WARENKORB (rechts):                 │
│ ─────────────────────────────────    │
│ • Döner          €6.50        [✕]   │
│ • Ayran          €2.00        [✕]   │
│ • Cola           €2.50        [✕]   │
│                                      │
│ Summe: €11.00                        │
│ [✅ Abrechnung]                      │
└──────────────────────────────────────┘

Ablauf:
1. Produkt anklicken → in Warenkorb
2. Nächstes Produkt anklicken
3. Am Warenkorb kontrollieren
4. [✅ Abrechnung] klicken
5. ✅ Verkauf erfasst! Discord-Meldung!
```

### Schritt 4: Stempel setzen

```
Navigation: [🎫 Stempel]

┌──────────────────────────────────────┐
│      🎫 Stempelsystem                │
├──────────────────────────────────────┤
│   [➕ Neues Stempel-System]          │
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 10x Döner = Gratis Getränk    │  │
│  │                                │  │
│  │ Progress: ████░░░░░░  7/10    │  │
│  │                                │  │
│  │ [➕ Stempel] [🔄 Reset] [🗑️]   │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 5x Teller = Gratis Extra      │  │
│  │                                │  │
│  │ Progress: ██░░░░░░░░  2/5     │  │
│  │                                │  │
│  │ [➕ Stempel] [🔄 Reset] [🗑️]   │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘

Klick [➕ Stempel] nach jedem Verkauf!
```

### Schritt 5: Ausloggen

```
Navigation: [📝 Zeit]

[🚪 Ausloggen] Klicken

→ Arbeitszeit wird berechnet
→ Schicht beendet
→ Nächster Tag von vorne
```

---

## 📊 MANAGER - DASHBOARD ANSICHT

### 📊 Dashboard Tab

```
┌────────────────────────────────────────┐
│      📊 Manager Dashboard              │
├────────────────────────────────────────┤
│                                        │
│  ┌──────────────┐ ┌──────────────┐    │
│  │ 💵 Heute     │ │ 💰 Gesamt    │    │
│  │ €247.50      │ │ €2,547.18    │    │
│  └──────────────┘ └──────────────┘    │
│  ┌──────────────┐ ┌──────────────┐    │
│  │ 🟢 Arbeitet  │ │ 📦 Verkäufe  │    │
│  │ 3 Mitarbeiter│ │ 226          │    │
│  └──────────────┘ └──────────────┘    │
│                                        │
│  👥 Aktiv arbeitende Mitarbeiter       │
│  ──────────────────────────────────    │
│  👨‍🍳 milan          ✓ 3h 45m          │
│  👨‍🍳 ahmet          ✓ 2h 12m          │
│  👨‍🍳 fatih          ✓ 1h 30m          │
│                                        │
└────────────────────────────────────────┘
```

### 📈 Auswertung Tab

```
┌────────────────────────────────────────┐
│     📈 Auswertung & Statistiken        │
├────────────────────────────────────────┤
│                                        │
│  💵 Gesamtumsatz:    €2,547.18        │
│  📦 Verkäufe:        226              │
│  📊 Ø Verkauf:       €11.27           │
│  ⭐ Top Mitarbeiter: Milan (€1250)    │
│                                        │
│  🏆 Top 5 Produkte                    │
│  ──────────────────────────────────    │
│  1. Döner         │ 89x  │ €578,50   │
│  2. Ayran         │ 72x  │ €144,00   │
│  3. Dönerteller   │ 45x  │ €382,50   │
│  4. Cola          │ 38x  │ €95,00    │
│  5. Lahmacun      │ 35x  │ €227,50   │
│                                        │
│  📅 Umsatz nach Tag                   │
│  ──────────────────────────────────    │
│  15.01.2024 → €247,50                 │
│  14.01.2024 → €320,75                 │
│  13.01.2024 → €189,25                 │
│  12.01.2024 → €245,68                 │
│                                        │
└────────────────────────────────────────┘
```

---

## 💬 DISCORD INTEGRATION

### Automatische Verkaufs-Meldung

```
Discord Server → Management Kanal

┌─────────────────────────────────────┐
│  💰 Neuer Verkauf                   │
├─────────────────────────────────────┤
│  👨‍🍳 Mitarbeiter: milan              │
│  🕐 Zeit: 12:34:56                  │
│  📦 Artikel (3x)                    │
│    • Döner €6.50                    │
│    • Ayran €2.00                    │
│    • Cola €2.50                     │
│  💵 Summe: €11.00                   │
│                                     │
│  2024-01-15T12:34:56Z               │
└─────────────────────────────────────┘

Automatisch nach jedem [✅ Abrechnung]!
```

---

## 🎯 TYPISCHER ARBEITSTAG

```
08:00  👨‍🍳 Milan kommt an → [🚪 Einloggen]
       📝 Status: ✅ ARBEITET

08:15  👨‍💼 Manager prüft Dashboard
       📊 "Milan arbeitet seit 15 min"

08:30  👨‍🍳 Erster Verkauf:
       💰 2x Döner + 1x Ayran = €14.50
       🔔 Discord erhält Meldung
       🎫 Stempel setzen: +1 (1/10)

10:00  👨‍💼 Analytics anschauen
       📈 Heute schon €47,50 Umsatz!

12:30  👨‍🍳 Milan macht Pause
       🚪 [Ausloggen] - 4h 30m Arbeitszeit

13:00  👨‍🍳 Milan kommt zurück
       🚪 [Einloggen]

17:30  👨‍🍳 Milan geht nach Hause
       🚪 [Ausloggen] - 9h 30m (mit Pause)
       💾 Arbeitszeit gespeichert

19:00  👨‍💼 Manager schließt und prüft:
       📊 Heute €247,50 Umsatz
       📈 226 Verkäufe insgesamt
       ⭐ Top Mitarbeiter: Milan (€1250)
       🎫 Top Stempel: Döner (89x)
```

---

## 🔒 SICHERHEIT ÜBERBLICK

```
MITARBEITER (👨‍🍳) darf:
✅ Sich ein/aus-loggen
✅ Verkäufe erfassen (nur wenn eingeloggt)
✅ Stempel-Systeme erstellen
✅ Eigene Stempel sehen
❌ Produkte ändern
❌ Mitarbeiter verwalten
❌ Dashboard/Analytics sehen

MANAGER (👨‍💼) darf:
✅ Alles, was Mitarbeiter darf
✅ Produkte hinzufügen/bearbeiten/löschen
✅ Mitarbeiter erstellen/löschen
✅ Dashboard ansehen
✅ Analytics/Statistiken ansehen
✅ Alle Verkäufe sehen
```

---

## 📱 MOBILE ANSICHT

```
Auf Smartphone öffnen: http://localhost:3000

Optimiert für:
✅ iPhone/iPad
✅ Android Phones
✅ Tablets
✅ Landscape & Portrait

Beispiel Smartphone:
┌──────────────────┐
│ 🔥 EUSES KEBAB   │ (Header verkürzt)
├──────────────────┤
│[📝][💰][🎫][📊]  │ (Tabs scrollbar)
├──────────────────┤
│                  │
│  💰 Kasse        │ (Vollbreite)
│  ───────────────  │
│  [Döner] [Dürüm] │
│  [Ayran] [Cola]  │
│                  │
│  Warenkorb       │
│  ───────────────  │
│  • Döner  €6.50  │
│  • Ayran  €2.00  │
│                  │
│  Summe: €8.50    │
│  [✅ Abrechnung] │
│                  │
└──────────────────┘
```

---

## ✅ CHECKLISTE TÄGLICHE NUTZUNG

```
MORGENS:
□ npm start
□ Manager anmelden
□ Dashboard kontrollieren
□ Alle Produkte da? (falls neu hinzugefügt)

WÄHREND ARBEIT:
□ Mitarbeiter sich regelmäßig ein/ausloggen
□ Verkäufe werden automatisch zu Discord geschickt
□ Manager kann Dashboard live beobachten

ABENDS:
□ Alle Mitarbeiter ausgeloggt?
□ Tagesumsatz kontrollieren
□ Analytics anschauen
□ Morgen Produkte hinzufügen?
```

---

🎉 **Herzlichen Glückwunsch - System läuft!**
