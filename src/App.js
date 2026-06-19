import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword 
} from 'firebase/auth';
import { 
  getDatabase, 
  ref, 
  push, 
  set, 
  get, 
  update,
  onValue,
  remove 
} from 'firebase/database';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBMLfe2y65TIh1NPSphoxzuy-onAmTiO_A",
  authDomain: "euses-kebab.firebaseapp.com",
  projectId: "euses-kebab",
  databaseURL: "https://euses-kebab-default-rtdb.firebaseapp.com",
  storageBucket: "euses-kebab.firebasestorage.app",
  messagingSenderId: "662222849450",
  appId: "1:662222849450:web:18cee8ba51524cbc3c17d3",
  measurementId: "G-W52W7SK9HB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1479186089397719060/evYXofPEG-K5pS0TE7Xozrbv254jvIPsBSunh-VR6djV5bXyugHLzyApvWq-jY7obP1J";

// ============= COMPONENTS =============

function LoginPage({ error, loading, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLocalError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-logo">🔥</div>
        <h1>EUSES KEBAB</h1>
        <p className="login-subtitle">Management System</p>
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="📧 E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="🔒 Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? '⏳ Wird angemeldet...' : '🚪 Anmelden'}
          </button>
        </form>

        {(localError || error) && (
          <div className="error-message">
            ⚠️ {localError || error}
          </div>
        )}

        <div className="login-info">
          <p>👨‍💼 Manager oder Mitarbeiter?</p>
          <small>Kontaktieren Sie den Manager für Login-Daten</small>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, role, onLogout }) {
  const [activeTab, setActiveTab] = useState(role === 'manager' ? 'dashboard' : 'register');
  const [currentlyWorking, setCurrentlyWorking] = useState(null);
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    const logsRef = ref(database, 'timeLogs');
    const unsubscribe = onValue(logsRef, (snapshot) => {
      if (snapshot.exists()) {
        const logs = Object.values(snapshot.val());
        const activeLog = logs.find(log => 
          log.email === user.email && !log.checkOutTime
        );
        setCurrentlyWorking(activeLog || null);
        
        const activeWorkers = logs.filter(log => !log.checkOutTime);
        setWorkers(activeWorkers);
      }
    });

    return () => unsubscribe();
  }, [user.email]);

  const handleTabChange = (tab) => {
    if (currentlyWorking || tab === 'register' || role === 'manager') {
      setActiveTab(tab);
    } else {
      alert('⚠️ Du musst zuerst einchecken!');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <div className="logo-small">🔥</div>
          <h2>EUSES KEBAB</h2>
        </div>
        <div className="header-center">
          {currentlyWorking && (
            <div className="working-indicator">
              🟢 Arbeitet seit {formatTime(new Date(currentlyWorking.timestamp))}
            </div>
          )}
        </div>
        <div className="header-right">
          <span className="user-info">
            <span className="user-name">{user.email.split('@')[0]}</span>
            <span className="role-badge">{role === 'manager' ? '👨‍💼' : '👨‍🍳'}</span>
          </span>
          <button onClick={onLogout} className="logout-btn">🚪 Abmelden</button>
        </div>
      </header>

      <nav className="nav-tabs">
        <button 
          className={`nav-tab ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => handleTabChange('register')}
          title="Zeiterfassung"
        >
          📝 Zeit
        </button>
        {currentlyWorking && (
          <button 
            className={`nav-tab ${activeTab === 'cash' ? 'active' : ''}`}
            onClick={() => handleTabChange('cash')}
            title="Kassensystem"
          >
            💰 Kasse
          </button>
        )}
        <button 
          className={`nav-tab ${activeTab === 'stamps' ? 'active' : ''}`}
          onClick={() => handleTabChange('stamps')}
          title="Stempelsystem"
        >
          🎫 Stempel
        </button>
        {role === 'manager' && (
          <>
            <button 
              className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('dashboard')}
              title="Dashboard"
            >
              📊 Dashboard
            </button>
            <button 
              className={`nav-tab ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => handleTabChange('products')}
              title="Produkte"
            >
              🛒 Produkte
            </button>
            <button 
              className={`nav-tab ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => handleTabChange('employees')}
              title="Mitarbeiter"
            >
              👥 Team
            </button>
            <button 
              className={`nav-tab ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => handleTabChange('analytics')}
              title="Analytics"
            >
              📈 Auswertung
            </button>
          </>
        )}
      </nav>

      <div className="tab-content">
        {activeTab === 'register' && (
          <TimeRegistration user={user} currentlyWorking={currentlyWorking} />
        )}
        {activeTab === 'cash' && currentlyWorking && (
          <CashSystem user={user} />
        )}
        {activeTab === 'stamps' && (
          <StampSystem user={user} />
        )}
        {activeTab === 'dashboard' && role === 'manager' && (
          <ManagerDashboard workers={workers} />
        )}
        {activeTab === 'products' && role === 'manager' && (
          <ProductManagement />
        )}
        {activeTab === 'employees' && role === 'manager' && (
          <EmployeeManagement />
        )}
        {activeTab === 'analytics' && role === 'manager' && (
          <Analytics />
        )}
      </div>
    </div>
  );
}

function TimeRegistration({ user, currentlyWorking }) {
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const logsRef = ref(database, 'timeLogs');
      const newLog = {
        email: user.email,
        timestamp: new Date().toISOString(),
        checkOutTime: null,
        uid: user.uid,
        name: user.email.split('@')[0]
      };
      await push(logsRef, newLog);
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const logsRef = ref(database, 'timeLogs');
      const snapshot = await get(logsRef);
      
      if (snapshot.exists()) {
        const logs = snapshot.val();
        let logId = null;
        
        for (const [id, log] of Object.entries(logs)) {
          if (log.email === user.email && !log.checkOutTime) {
            logId = id;
            break;
          }
        }
        
        if (logId) {
          const checkOutTime = new Date().toISOString();
          const durationMinutes = Math.round(
            (new Date(checkOutTime) - new Date(currentlyWorking.timestamp)) / 60000
          );
          
          await update(ref(database, `timeLogs/${logId}`), {
            checkOutTime: checkOutTime,
            durationMinutes: durationMinutes
          });
        }
      }
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="section">
      <h3>⏱️ Zeiterfassung</h3>
      
      {currentlyWorking ? (
        <div className="time-status working">
          <div className="status-badge">✅ ARBEITET</div>
          <div className="time-info">
            <p>🕐 Eincheckt: {formatDateTime(new Date(currentlyWorking.timestamp))}</p>
            <p>⏰ Arbeitszeit: {formatDuration(currentlyWorking.timestamp)}</p>
          </div>
          <button 
            onClick={handleCheckOut} 
            disabled={loading}
            className="btn btn-danger btn-lg"
          >
            {loading ? '⏳ Wird verarbeitet...' : '🚪 Ausloggen'}
          </button>
        </div>
      ) : (
        <div className="time-status free">
          <div className="status-badge">⏸️ NICHT ARBEITET</div>
          <p style={{marginBottom: '20px', color: '#888'}}>Klicke um deine Schicht zu starten</p>
          <button 
            onClick={handleCheckIn} 
            disabled={loading}
            className="btn btn-success btn-lg"
          >
            {loading ? '⏳ Wird verarbeitet...' : '🚪 Einloggen'}
          </button>
        </div>
      )}
    </div>
  );
}

function CashSystem({ user }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const prods = Object.entries(snapshot.val()).map(([key, val]) => ({
          id: key,
          ...val
        }));
        setProducts(prods);
      }
    });

    return () => unsubscribe();
  }, []);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('⚠️ Keine Produkte ausgewählt');
      return;
    }

    setLoading(true);
    try {
      const totalPrice = getTotalPrice();
      const receipt = {
        timestamp: new Date().toISOString(),
        employee: user.email,
        items: cart.map(p => ({
          name: p.name,
          price: p.price
        })),
        totalPrice: parseFloat(totalPrice),
        uid: user.uid,
        itemCount: cart.length
      };

      const salesRef = ref(database, 'sales');
      await push(salesRef, receipt);

      const discordMessage = {
        embeds: [{
          title: "💰 Neuer Verkauf",
          color: 16711680,
          fields: [
            { name: "👨‍🍳 Mitarbeiter", value: user.email.split('@')[0], inline: true },
            { name: "🕐 Zeit", value: new Date().toLocaleTimeString('de-DE'), inline: true },
            { 
              name: "📦 Artikel (" + cart.length + "x)", 
              value: cart.map(p => `• ${p.name} €${p.price.toFixed(2)}`).join('\n') || "Keine"
            },
            { name: "💵 Summe", value: `**€${totalPrice}**`, inline: false }
          ],
          timestamp: new Date().toISOString()
        }]
      };

      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(discordMessage)
      }).catch(err => console.error('Discord error:', err));

      setCart([]);
      alert(`✅ Verkauf erfasst!\nSumme: €${totalPrice}`);
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category === selectedCategory);

  const categories = ['all', 'essens', 'getraenke', 'nachtisch'];

  return (
    <div className="section">
      <h3>💰 Kassensystem</h3>
      
      <div className="cash-container">
        <div className="product-section">
          <h4>Kategorien</h4>
          <div className="category-filter">
            {categories.map(cat => (
              <button
                key={cat}
                className={`category-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'all' && '📦 Alle'}
                {cat === 'essens' && '🍖 Essen'}
                {cat === 'getraenke' && '🥤 Getränke'}
                {cat === 'nachtisch' && '🍰 Nachtisch'}
              </button>
            ))}
          </div>

          <h4 style={{marginTop: '20px'}}>Verfügbare Produkte</h4>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <button
                key={product.id}
                className="product-btn"
                onClick={() => addToCart(product)}
              >
                <div className="product-name">{product.name}</div>
                <div className="product-price">€{product.price?.toFixed(2)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="cart-section">
          <h4>🛒 Warenkorb</h4>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p className="empty">Keine Produkte</p>
            ) : (
              cart.map((product, idx) => (
                <div key={idx} className="cart-item">
                  <span>{product.name}</span>
                  <span className="price">€{product.price?.toFixed(2)}</span>
                  <button 
                    onClick={() => removeFromCart(idx)}
                    className="remove-btn"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
          
          <div className="cart-summary">
            <div className="cart-count">
              {cart.length} Artikel
            </div>
            <div className="total">
              <span>Summe:</span>
              <span className="amount">€{getTotalPrice()}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="btn btn-success btn-lg"
            >
              {loading ? '⏳ Wird verarbeitet...' : '✅ Abrechnung'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StampSystem({ user }) {
  const [stamps, setStamps] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStampName, setNewStampName] = useState('');
  const [newStampTarget, setNewStampTarget] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stampsRef = ref(database, `stamps/${user.uid}`);
    const unsubscribe = onValue(stampsRef, (snapshot) => {
      if (snapshot.exists()) {
        const stampData = Object.entries(snapshot.val()).map(([key, val]) => ({
          id: key,
          ...val
        }));
        setStamps(stampData.sort((a, b) => b.current - a.current));
      } else {
        setStamps([]);
      }
    });

    return () => unsubscribe();
  }, [user.uid]);

  const createStamp = async (e) => {
    e.preventDefault();
    if (!newStampName || !newStampTarget) {
      alert('⚠️ Bitte alle Felder ausfüllen');
      return;
    }

    setLoading(true);
    try {
      const stampsRef = ref(database, `stamps/${user.uid}`);
      await push(stampsRef, {
        name: newStampName,
        target: parseInt(newStampTarget),
        current: 0,
        createdAt: new Date().toISOString()
      });
      setNewStampName('');
      setNewStampTarget('');
      setShowForm(false);
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const addStamp = async (stampId) => {
    try {
      const stamp = stamps.find(s => s.id === stampId);
      const newCurrent = stamp.current + 1;
      
      await update(ref(database, `stamps/${user.uid}/${stampId}`), {
        current: newCurrent
      });

      if (newCurrent === stamp.target) {
        alert(`🎉 Glückwunsch!\n"${stamp.name}" ist vollständig!`);
      }
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
  };

  const resetStamp = async (stampId) => {
    if (window.confirm('🔄 Stempel wirklich zurücksetzen?')) {
      try {
        await update(ref(database, `stamps/${user.uid}/${stampId}`), {
          current: 0
        });
      } catch (err) {
        alert('❌ Fehler: ' + err.message);
      }
    }
  };

  const deleteStamp = async (stampId) => {
    if (window.confirm('🗑️ Stempel wirklich löschen?')) {
      try {
        await remove(ref(database, `stamps/${user.uid}/${stampId}`));
      } catch (err) {
        alert('❌ Fehler: ' + err.message);
      }
    }
  };

  return (
    <div className="section">
      <h3>🎫 Stempelsystem</h3>
      
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)} 
          className="btn btn-primary"
          style={{marginBottom: '20px'}}
        >
          ➕ Neues Stempel-System
        </button>
      ) : (
        <form onSubmit={createStamp} className="stamp-form">
          <input
            type="text"
            placeholder="Name (z.B. 'Döner-Stempel')"
            value={newStampName}
            onChange={(e) => setNewStampName(e.target.value)}
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Zielanzahl (z.B. 10)"
            value={newStampTarget}
            onChange={(e) => setNewStampTarget(e.target.value)}
            disabled={loading}
            min="1"
          />
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-success">
              ✅ Erstellen
            </button>
            <button 
              type="button"
              onClick={() => setShowForm(false)} 
              className="btn btn-cancel"
            >
              ✕ Abbrechen
            </button>
          </div>
        </form>
      )}

      <div className="stamps-grid">
        {stamps.length === 0 ? (
          <p className="empty">Noch keine Stempel-Systeme</p>
        ) : (
          stamps.map(stamp => {
            const percentage = (stamp.current / stamp.target) * 100;
            const isComplete = stamp.current >= stamp.target;
            
            return (
              <div key={stamp.id} className={`stamp-card ${isComplete ? 'complete' : ''}`}>
                {isComplete && <div className="complete-badge">🏆 FERTIG!</div>}
                <h4>{stamp.name}</h4>
                <div className="stamp-progress">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                  <p className="progress-text">
                    {stamp.current} / {stamp.target}
                  </p>
                </div>
                
                <div className="stamp-actions">
                  <button 
                    onClick={() => addStamp(stamp.id)}
                    className="btn btn-small btn-success"
                  >
                    ➕ Stempel
                  </button>
                  <button 
                    onClick={() => resetStamp(stamp.id)}
                    className="btn btn-small btn-warning"
                  >
                    🔄 Reset
                  </button>
                  <button 
                    onClick={() => deleteStamp(stamp.id)}
                    className="btn btn-small btn-danger"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ManagerDashboard({ workers }) {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    totalSales: 0,
    activeSessions: 0
  });

  useEffect(() => {
    const salesRef = ref(database, 'sales');
    
    const unsubscribe = onValue(salesRef, (snapshot) => {
      if (snapshot.exists()) {
        const sales = Object.values(snapshot.val());
        const today = new Date().toDateString();
        
        const todaySales = sales.filter(s => 
          new Date(s.timestamp).toDateString() === today
        );
        
        const totalRevenue = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
        const todayRevenue = todaySales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
        
        setStats({
          totalRevenue: totalRevenue.toFixed(2),
          todayRevenue: todayRevenue.toFixed(2),
          totalSales: sales.length,
          activeSessions: workers.length
        });
      }
    });

    return () => unsubscribe();
  }, [workers.length]);

  return (
    <div className="section">
      <h3>📊 Manager Dashboard</h3>
      
      <div className="dashboard-grid">
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-label">Heute</div>
          <div className="stat-value">€{stats.todayRevenue}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-label">Gesamt</div>
          <div className="stat-value">€{stats.totalRevenue}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🟢</div>
          <div className="stat-label">Arbeitet</div>
          <div className="stat-value">{stats.activeSessions}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Verkäufe</div>
          <div className="stat-value">{stats.totalSales}</div>
        </div>
      </div>

      <div className="active-workers" style={{marginTop: '24px'}}>
        <h4>👥 Aktiv arbeitende Mitarbeiter</h4>
        {workers.length === 0 ? (
          <p className="empty">Keine aktiven Sessions</p>
        ) : (
          <div className="workers-list">
            {workers.map((worker, idx) => (
              <div key={idx} className="worker-card">
                <span className="worker-name">👨‍🍳 {worker.email.split('@')[0]}</span>
                <span className="worker-time">
                  {formatDuration(worker.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', category: 'essens' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const productsRef = ref(database, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const prods = Object.entries(snapshot.val()).map(([key, val]) => ({
          id: key,
          ...val
        }));
        setProducts(prods);
      } else {
        setProducts([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) {
      alert('⚠️ Bitte alle Felder ausfüllen');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await update(ref(database, `products/${editingId}`), {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          category: newProduct.category
        });
        setEditingId(null);
      } else {
        const productsRef = ref(database, 'products');
        await push(productsRef, {
          name: newProduct.name,
          price: parseFloat(newProduct.price),
          category: newProduct.category
        });
      }
      
      setNewProduct({ name: '', price: '', category: 'essens' });
      setShowForm(false);
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const deleteProduct = async (id) => {
    if (window.confirm('🗑️ Produkt wirklich löschen?')) {
      try {
        await remove(ref(database, `products/${id}`));
      } catch (err) {
        alert('❌ Fehler: ' + err.message);
      }
    }
  };

  const startEdit = (product) => {
    setNewProduct(product);
    setEditingId(product.id);
    setShowForm(true);
  };

  return (
    <div className="section">
      <h3>🛒 Produktverwaltung</h3>

      {!showForm ? (
        <button 
          onClick={() => {
            setNewProduct({ name: '', price: '', category: 'essens' });
            setEditingId(null);
            setShowForm(true);
          }}
          className="btn btn-primary"
          style={{marginBottom: '20px'}}
        >
          ➕ Neues Produkt
        </button>
      ) : (
        <form onSubmit={handleAddProduct} className="product-form">
          <input
            type="text"
            placeholder="Produktname"
            value={newProduct.name}
            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
            disabled={loading}
          />
          <input
            type="number"
            placeholder="Preis"
            value={newProduct.price}
            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
            disabled={loading}
            step="0.01"
            min="0"
          />
          <select
            value={newProduct.category}
            onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
            disabled={loading}
          >
            <option value="essens">🍖 Essen</option>
            <option value="getraenke">🥤 Getränke</option>
            <option value="nachtisch">🍰 Nachtisch</option>
          </select>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-success">
              ✅ {editingId ? 'Aktualisieren' : 'Erstellen'}
            </button>
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-cancel"
            >
              ✕ Abbrechen
            </button>
          </div>
        </form>
      )}

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Kategorie</th>
              <th>Preis</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr><td colSpan="4" className="empty">Keine Produkte</td></tr>
            ) : (
              products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>
                    {product.category === 'essens' && '🍖'}
                    {product.category === 'getraenke' && '🥤'}
                    {product.category === 'nachtisch' && '🍰'}
                  </td>
                  <td>€{product.price?.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => startEdit(product)}
                      className="btn btn-small btn-warning"
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteProduct(product.id)}
                      className="btn btn-small btn-danger"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState('employee');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const empRef = ref(database, 'employees');
    const unsubscribe = onValue(empRef, (snapshot) => {
      if (snapshot.exists()) {
        const emps = Object.entries(snapshot.val()).map(([key, val]) => ({
          id: key,
          ...val
        }));
        setEmployees(emps);
      }
    });

    return () => unsubscribe();
  }, []);

  const createEmployee = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword) {
      alert('⚠️ Bitte alle Felder ausfüllen');
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, newEmail, newPassword);
      
      const empRef = ref(database, 'employees');
      await push(empRef, {
        email: newEmail,
        role: newRole,
        uid: userCred.user.uid,
        createdAt: new Date().toISOString()
      });

      setNewEmail('');
      setNewPassword('');
      setNewRole('employee');
      setShowForm(false);
      alert('✅ Mitarbeiter erstellt!');
    } catch (err) {
      alert('❌ Fehler: ' + err.message);
    }
    setLoading(false);
  };

  const deleteEmployee = async (id) => {
    if (window.confirm('🗑️ Mitarbeiter wirklich löschen?')) {
      try {
        await remove(ref(database, `employees/${id}`));
        alert('✅ Mitarbeiter gelöscht');
      } catch (err) {
        alert('❌ Fehler: ' + err.message);
      }
    }
  };

  return (
    <div className="section">
      <h3>👥 Mitarbeiterverwaltung</h3>
      
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
          style={{marginBottom: '20px'}}
        >
          ➕ Neuer Mitarbeiter
        </button>
      ) : (
        <form onSubmit={createEmployee} className="employee-form">
          <input
            type="email"
            placeholder="📧 E-Mail"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            disabled={loading}
            required
          />
          <input
            type="password"
            placeholder="🔒 Passwort"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
          />
          <select 
            value={newRole} 
            onChange={(e) => setNewRole(e.target.value)}
            disabled={loading}
          >
            <option value="employee">👨‍🍳 Mitarbeiter</option>
            <option value="manager">👨‍💼 Manager</option>
          </select>
          <div className="form-actions">
            <button type="submit" disabled={loading} className="btn btn-success">
              ✅ Erstellen
            </button>
            <button 
              type="button"
              onClick={() => setShowForm(false)}
              className="btn btn-cancel"
            >
              ✕ Abbrechen
            </button>
          </div>
        </form>
      )}

      <div className="employee-table">
        <table>
          <thead>
            <tr>
              <th>📧 E-Mail</th>
              <th>👤 Rolle</th>
              <th>📅 Erstellt</th>
              <th>⚙️ Aktion</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan="4" className="empty">Keine Mitarbeiter</td></tr>
            ) : (
              employees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.email}</td>
                  <td>{emp.role === 'manager' ? '👨‍💼 Manager' : '👨‍🍳 Mitarbeiter'}</td>
                  <td>{new Date(emp.createdAt).toLocaleDateString('de-DE')}</td>
                  <td>
                    <button 
                      onClick={() => deleteEmployee(emp.id)}
                      className="btn btn-small btn-danger"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Analytics() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalSales: 0,
    averageSale: 0,
    topEmployee: null,
    salesByDay: {},
    topProducts: []
  });

  useEffect(() => {
    const salesRef = ref(database, 'sales');
    
    const unsubscribe = onValue(salesRef, (snapshot) => {
      if (snapshot.exists()) {
        const sales = Object.values(snapshot.val());
        
        const totalRevenue = sales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
        const averageSale = sales.length > 0 ? (totalRevenue / sales.length).toFixed(2) : 0;
        
        const employeeSales = {};
        sales.forEach(sale => {
          if (!employeeSales[sale.employee]) {
            employeeSales[sale.employee] = 0;
          }
          employeeSales[sale.employee] += sale.totalPrice || 0;
        });
        
        const topEmp = Object.entries(employeeSales)
          .sort(([,a], [,b]) => b - a)[0];
        
        const salesByDay = {};
        sales.forEach(sale => {
          const day = new Date(sale.timestamp).toLocaleDateString('de-DE');
          if (!salesByDay[day]) salesByDay[day] = 0;
          salesByDay[day] += sale.totalPrice || 0;
        });
        
        const productSales = {};
        sales.forEach(sale => {
          if (sale.items) {
            sale.items.forEach(item => {
              if (!productSales[item.name]) {
                productSales[item.name] = {count: 0, revenue: 0};
              }
              productSales[item.name].count += 1;
              productSales[item.name].revenue += item.price || 0;
            });
          }
        });
        
        const topProds = Object.entries(productSales)
          .sort(([,a], [,b]) => b.count - a.count)
          .slice(0, 5)
          .map(([name, data]) => ({name, ...data}));
        
        setStats({
          totalRevenue: totalRevenue.toFixed(2),
          totalSales: sales.length,
          averageSale,
          topEmployee: topEmp ? {name: topEmp[0], revenue: topEmp[1].toFixed(2)} : null,
          salesByDay,
          topProducts: topProds
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="section">
      <h3>📈 Auswertung & Statistiken</h3>
      
      <div className="analytics-grid">
        <div className="stat-card">
          <div className="stat-icon">💵</div>
          <div className="stat-label">Gesamtumsatz</div>
          <div className="stat-value">€{stats.totalRevenue}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-label">Verkäufe</div>
          <div className="stat-value">{stats.totalSales}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-label">Ø Verkauf</div>
          <div className="stat-value">€{stats.averageSale}</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-label">Top Mitarbeiter</div>
          <div className="stat-value">
            {stats.topEmployee 
              ? stats.topEmployee.name.split('@')[0] 
              : '—'}
          </div>
          {stats.topEmployee && (
            <div className="stat-subtext">€{stats.topEmployee.revenue}</div>
          )}
        </div>
      </div>

      <div className="analytics-section" style={{marginTop: '24px'}}>
        <h4>🏆 Top 5 Produkte</h4>
        {stats.topProducts.length === 0 ? (
          <p className="empty">Noch keine Daten</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Produkt</th>
                <th>Verkäufe</th>
                <th>Umsatz</th>
              </tr>
            </thead>
            <tbody>
              {stats.topProducts.map((product, idx) => (
                <tr key={idx}>
                  <td>{product.name}</td>
                  <td>{product.count}x</td>
                  <td>€{product.revenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="analytics-section" style={{marginTop: '24px'}}>
        <h4>📅 Umsatz nach Tag</h4>
        {Object.keys(stats.salesByDay).length === 0 ? (
          <p className="empty">Noch keine Daten</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Datum</th>
                <th>Umsatz</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(stats.salesByDay)
                .sort(([,a], [,b]) => b - a)
                .map(([day, revenue]) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>€{revenue.toFixed(2)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============= HELPERS =============

function formatDateTime(date) {
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatTime(date) {
  return date.toLocaleTimeString('de-DE', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDuration(timestamp) {
  const now = new Date();
  const start = new Date(timestamp);
  const diffMs = now - start;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) return `${diffMins}m`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return `${hours}h ${mins}m`;
}

// ============= MAIN APP =============

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        try {
          const empRef = ref(database, 'employees');
          const snapshot = await get(empRef);
          
          if (snapshot.exists()) {
            const emps = Object.values(snapshot.val());
            const userRole = emps.find(emp => emp.uid === authUser.uid)?.role || 'employee';
            setRole(userRole);
          } else {
            setRole('employee');
          }
        } catch (err) {
          console.error('Error getting role:', err);
          setRole('employee');
        }
        setUser(authUser);
        setError('');
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner">🔥</div>
        <p>EUSES KEBAB wird geladen...</p>
      </div>
    );
  }

  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #0f0f0f;
          color: #e0e0e0;
        }

        input, select, textarea {
          background: #1a1a1a;
          border: 1px solid #333;
          color: #e0e0e0;
          padding: 10px;
          border-radius: 6px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.2s;
        }

        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #ff4444;
          box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1);
        }

        input:disabled, select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        button {
          cursor: pointer;
          font-weight: 600;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          transition: all 0.2s;
          font-size: 14px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn {
          display: inline-block;
          padding: 10px 16px;
          border-radius: 6px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-lg {
          padding: 14px 24px;
          font-size: 16px;
        }

        .btn-primary {
          background: #ff4444;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #ff2222;
          transform: translateY(-2px);
        }

        .btn-success {
          background: #22c55e;
          color: white;
        }

        .btn-success:hover:not(:disabled) {
          background: #16a34a;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #dc2626;
        }

        .btn-warning {
          background: #f97316;
          color: white;
        }

        .btn-warning:hover:not(:disabled) {
          background: #ea580c;
        }

        .btn-cancel {
          background: #666;
          color: white;
        }

        .btn-cancel:hover {
          background: #555;
        }

        .btn-small {
          padding: 6px 10px;
          font-size: 12px;
        }

        .loading-screen {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          gap: 20px;
          font-size: 18px;
        }

        .spinner {
          font-size: 64px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* LOGIN */
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          padding: 20px;
        }

        .login-card {
          background: #1a1a1a;
          border: 2px solid #ff4444;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 400px;
          box-shadow: 0 10px 40px rgba(255, 68, 68, 0.2);
        }

        .login-logo {
          font-size: 48px;
          text-align: center;
          margin-bottom: 10px;
        }

        .login-card h1 {
          text-align: center;
          font-size: 28px;
          margin-bottom: 8px;
          color: #fff;
        }

        .login-subtitle {
          text-align: center;
          color: #888;
          font-size: 13px;
          margin-bottom: 30px;
          letter-spacing: 1px;
        }

        .login-card form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 20px;
        }

        .login-card input {
          padding: 12px;
        }

        .login-card button {
          padding: 12px;
          background: #ff4444;
          color: white;
          font-weight: 700;
          font-size: 16px;
        }

        .login-card button:hover:not(:disabled) {
          background: #ff2222;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid #ef4444;
          color: #fca5a5;
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 16px;
        }

        .login-info {
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid #6366f1;
          padding: 16px;
          border-radius: 6px;
          text-align: center;
        }

        .login-info p {
          margin-bottom: 6px;
          font-weight: 600;
        }

        .login-info small {
          color: #888;
        }

        /* DASHBOARD */
        .dashboard {
          min-height: 100vh;
          background: #0f0f0f;
        }

        .dashboard-header {
          background: #1a1a1a;
          border-bottom: 2px solid #ff4444;
          padding: 12px 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .logo-small {
          font-size: 28px;
        }

        .header-left h2 {
          font-size: 18px;
          color: #fff;
        }

        .header-center {
          flex: 1;
          text-align: center;
          min-width: 200px;
        }

        .working-indicator {
          color: #22c55e;
          font-size: 13px;
          font-weight: 600;
          animation: pulse 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .user-name {
          font-weight: 600;
          color: #e0e0e0;
          font-size: 14px;
        }

        .role-badge {
          font-size: 14px;
        }

        .logout-btn {
          background: #ef4444;
          color: white;
          padding: 8px 12px;
          font-size: 13px;
        }

        /* NAV */
        .nav-tabs {
          display: flex;
          gap: 6px;
          padding: 10px 12px;
          background: #0f0f0f;
          border-bottom: 1px solid #222;
          overflow-x: auto;
          flex-wrap: wrap;
        }

        .nav-tab {
          padding: 8px 12px;
          background: transparent;
          border: 1px solid #333;
          color: #888;
          border-radius: 6px;
          transition: all 0.2s;
          white-space: nowrap;
          font-size: 13px;
        }

        .nav-tab:hover {
          color: #e0e0e0;
          border-color: #555;
        }

        .nav-tab.active {
          background: #ff4444;
          color: white;
          border-color: #ff4444;
        }

        .tab-content {
          padding: 16px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .section {
          background: #1a1a1a;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
        }

        .section h3 {
          font-size: 18px;
          margin-bottom: 16px;
          color: #fff;
          border-bottom: 2px solid #ff4444;
          padding-bottom: 8px;
        }

        .section h4 {
          font-size: 14px;
          margin-bottom: 12px;
          color: #e0e0e0;
        }

        /* TIME */
        .time-status {
          padding: 20px;
          border-radius: 8px;
          text-align: center;
        }

        .time-status.working {
          background: rgba(34, 197, 94, 0.1);
          border: 2px solid #22c55e;
        }

        .time-status.free {
          background: rgba(107, 114, 128, 0.1);
          border: 2px solid #6b7280;
        }

        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-weight: 700;
          margin-bottom: 12px;
          font-size: 12px;
        }

        .time-status.working .status-badge {
          background: #22c55e;
          color: white;
        }

        .time-status.free .status-badge {
          background: #6b7280;
          color: white;
        }

        .time-info {
          margin: 16px 0;
          text-align: left;
          background: rgba(255, 255, 255, 0.05);
          padding: 12px;
          border-radius: 6px;
          font-size: 13px;
        }

        .time-info p {
          margin: 6px 0;
        }

        /* CASH */
        .cash-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        @media (max-width: 1000px) {
          .cash-container {
            grid-template-columns: 1fr;
          }
        }

        .product-section, .cart-section {
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
        }

        .category-filter {
          display: flex;
          gap: 6px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .category-btn {
          padding: 6px 10px;
          background: #2a2a2a;
          border: 1px solid #333;
          color: #888;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .category-btn:hover {
          border-color: #555;
          color: #e0e0e0;
        }

        .category-btn.active {
          background: #ff4444;
          color: white;
          border-color: #ff4444;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 8px;
        }

        .product-btn {
          background: #2a2a2a;
          border: 1px solid #333;
          color: #e0e0e0;
          padding: 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          flex-direction: column;
          gap: 6px;
          align-items: center;
          font-size: 12px;
        }

        .product-btn:hover {
          background: #ff4444;
          color: white;
          border-color: #ff4444;
          transform: translateY(-2px);
        }

        .product-name {
          font-weight: 600;
        }

        .product-price {
          font-size: 13px;
          font-weight: 700;
          color: #22c55e;
        }

        .product-btn:hover .product-price {
          color: white;
        }

        .cart-items {
          background: #0f0f0f;
          border-radius: 6px;
          max-height: 300px;
          overflow-y: auto;
          margin-bottom: 12px;
          border: 1px solid #222;
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          border-bottom: 1px solid #222;
          gap: 8px;
          font-size: 13px;
        }

        .cart-item:last-child {
          border-bottom: none;
        }

        .cart-item .price {
          color: #22c55e;
          font-weight: 600;
        }

        .remove-btn {
          background: #ef4444;
          color: white;
          border: none;
          width: 20px;
          height: 20px;
          padding: 0;
          border-radius: 4px;
          font-size: 11px;
        }

        .empty {
          color: #666;
          text-align: center;
          padding: 16px;
          font-style: italic;
          font-size: 13px;
        }

        .cart-summary {
          background: #0f0f0f;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #333;
        }

        .cart-count {
          color: #888;
          font-size: 12px;
          margin-bottom: 8px;
        }

        .total {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          font-size: 14px;
          font-weight: 700;
        }

        .total .amount {
          color: #22c55e;
        }

        /* FORMS */
        .stamp-form, .product-form, .employee-form {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
          margin-bottom: 16px;
          background: #0f0f0f;
          padding: 12px;
          border-radius: 6px;
          border: 1px solid #333;
        }

        .form-actions {
          display: flex;
          gap: 8px;
          grid-column: 1 / -1;
        }

        .form-actions .btn {
          flex: 1;
        }

        /* STAMPS */
        .stamps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 12px;
        }

        .stamp-card {
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
          transition: all 0.2s;
          position: relative;
        }

        .stamp-card.complete {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.05);
        }

        .complete-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: #22c55e;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
        }

        .stamp-card:hover {
          border-color: #ff4444;
          box-shadow: 0 4px 12px rgba(255, 68, 68, 0.1);
        }

        .stamp-card h4 {
          margin-bottom: 12px;
          color: #fff;
          font-size: 14px;
        }

        .stamp-progress {
          margin-bottom: 12px;
        }

        .progress-bar {
          height: 20px;
          background: #1a1a1a;
          border-radius: 10px;
          overflow: hidden;
          margin-bottom: 6px;
          border: 1px solid #333;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff4444, #ff7777);
          transition: width 0.3s ease;
        }

        .progress-text {
          text-align: center;
          font-weight: 600;
          color: #e0e0e0;
          font-size: 12px;
        }

        .stamp-actions {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }

        /* DASHBOARD GRID */
        .dashboard-grid, .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 12px;
          margin-bottom: 16px;
        }

        .stat-card {
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 16px;
          text-align: center;
        }

        .stat-icon {
          font-size: 32px;
          margin-bottom: 8px;
        }

        .stat-label {
          color: #888;
          font-size: 12px;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: #ff4444;
        }

        .stat-subtext {
          color: #888;
          font-size: 12px;
          margin-top: 4px;
        }

        .active-workers, .analytics-section {
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 8px;
          padding: 12px;
        }

        .workers-list {
          display: grid;
          gap: 8px;
        }

        .worker-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px;
          background: #1a1a1a;
          border-radius: 6px;
          font-size: 13px;
        }

        .worker-name {
          font-weight: 600;
        }

        .worker-time {
          color: #888;
        }

        /* TABLES */
        .products-table, .employee-table {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          background: #0f0f0f;
          border: 1px solid #333;
          border-radius: 6px;
          overflow: hidden;
          font-size: 13px;
        }

        th {
          background: #1a1a1a;
          border-bottom: 1px solid #333;
          padding: 10px;
          text-align: left;
          font-weight: 700;
          color: #e0e0e0;
        }

        td {
          padding: 10px;
          border-bottom: 1px solid #222;
        }

        tr:last-child td {
          border-bottom: none;
        }

        tr:hover {
          background: #1a1a1a;
        }

        table .btn {
          margin-right: 4px;
        }

        @media (max-width: 768px) {
          .dashboard-header {
            padding: 10px;
          }

          .header-left h2 {
            display: none;
          }

          .nav-tabs {
            padding: 8px;
          }

          .nav-tab {
            padding: 6px 8px;
            font-size: 11px;
          }

          .tab-content {
            padding: 8px;
          }

          .section {
            padding: 12px;
          }

          .btn-lg {
            padding: 12px 16px;
          }

          .products-grid {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          }

          .cash-container {
            grid-template-columns: 1fr;
          }

          .dashboard-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      {user && role ? (
        <Dashboard 
          user={user} 
          role={role}
          onLogout={handleLogout}
        />
      ) : (
        <LoginPage 
          error={error}
          loading={loading}
          onLogin={() => {}}
        />
      )}
    </>
  );
}
