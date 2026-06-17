import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from './logo.jpeg'; 

function App() {
  // --- 1. STATE (MEMORIA APLICAȚIEI) ---
  const [user, setUser] = useState(null); 
  const [isRegistering, setIsRegistering] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [authMessage, setAuthMessage] = useState('');

  // Date aduse din baza de date MySQL 
  const [pets, setPets] = useState([]); 
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [editId, setEditId] = useState(null); 
  
  // UX și Istoric Programări
  const [activeAppointmentPet, setActiveAppointmentPet] = useState(null); 
  const [viewMode, setViewMode] = useState(null); 
  const [appointments, setAppointments] = useState([]); 
  
  // Formulare
  const [formData, setFormData] = useState({ name: '', species: '', breed: '', birth_date: '' });
  const [appForm, setAppForm] = useState({ service_name: '', date: '' });

  // --- 2. CONFIGURARE TEMA ---
  const theme = { 
    bg: '#f1f8e9', 
    primary: '#4caf50', 
    header: '#2e7d32', 
    text: '#1b5e20', 
    footer: '#1b5e20' 
  };

  // --- 3. LOGICA DE CALCUL (STATISTICI) ---
  const stats = {
      total: pets.length,
      dogs: pets.filter(p => p.species.toLowerCase().includes('caine') || p.species.toLowerCase().includes('dog')).length,
      cats: pets.filter(p => p.species.toLowerCase().includes('pisica') || p.species.toLowerCase().includes('cat') || p.species.toLowerCase().includes('motan')).length
  };

  // --- 4. HANDLERS ---
  
  // Autentificare și Înregistrare 
  const handleAuth = (e) => {
    e.preventDefault();
    setAuthMessage('');
    if (isRegistering) {

        axios.post('http://localhost:3001/register', { username, email, password })
            .then((res) => {
                if (res.data.message === "Succes") {
                    setAuthMessage("Cont creat! Acum te poți loga.");
                    setIsRegistering(false); setUsername(''); setPassword('');
                } else {
                    setAuthMessage(res.data.message);
                }
            });
    } else {

        axios.post('http://localhost:3001/login', { email, password }).then((res) => {
            if (res.data.message) setAuthMessage(res.data.message);
            else setUser(res.data); 
        });
    }
  };

  const handleLogout = () => { setUser(null); setPets([]); setEmail(''); setPassword(''); setAuthMessage(''); };

  useEffect(() => { 
      if (user) {
          fetchPets();
          axios.get('http://localhost:3001/services').then(res => {
              setServices(res.data); 
              if(res.data.length > 0) setAppForm(prev => ({ ...prev, service_name: res.data[0].service_name }));
          });
      } 
  }, [user]);

  const fetchPets = () => { axios.get(`http://localhost:3001/pets?user_id=${user.id}`).then(res => setPets(res.data)); };
  
  const filteredPets = pets.filter(pet => pet.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSend = { ...formData, user_id: user.id };

    const req = editId ? axios.put(`http://localhost:3001/pets/${editId}`, dataToSend) : axios.post('http://localhost:3001/pets', dataToSend);
    req.then(() => { alert(editId ? "Actualizat!" : "Adăugat!"); resetForm(); fetchPets(); });
  };
  
  const handleDelete = (id) => { if (confirm("Sigur ștergi?")) axios.delete(`http://localhost:3001/pets/${id}`).then(fetchPets); };
  
  const handleEdit = (pet) => {
    setEditId(pet.id);
    setFormData({ name: pet.name, species: pet.species, breed: pet.breed, birth_date: pet.birth_date ? new Date(pet.birth_date).toISOString().split('T')[0] : '' });
  };
  
  const resetForm = () => { setFormData({ name: '', species: '', breed: '', birth_date: '' }); setEditId(null); };

  const handleToggle = (petId, mode) => {
      if (activeAppointmentPet === petId && viewMode === mode) {
          setActiveAppointmentPet(null); setViewMode(null);
      } else {
          setActiveAppointmentPet(petId); setViewMode(mode);
          if (mode === 'history') axios.get(`http://localhost:3001/appointments/${petId}`).then(res => setAppointments(res.data));
      }
  };
  
  const handleAppSubmit = (e, petId) => {
    e.preventDefault();
    axios.post('http://localhost:3001/appointments', { ...appForm, pet_id: petId }).then(() => {
      alert("Programare salvată!");
      handleToggle(petId, 'history'); // Arată istoricul actualizat
    });
  };

  // --- 5. INTERFAȚA DE LOGIN (PAGINA DE START) --- 
  if (!user) {
    return (
      <div style={{ width: '100%', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e8f5e9', overflow: 'hidden' }}>
        <div style={{ background: 'white', width: '400px', padding: '40px', borderRadius: '20px', boxShadow: '0 15px 35px rgba(46, 125, 50, 0.15)', textAlign: 'center', borderTop: `6px solid ${theme.primary}` }}>
          <img src={logo} alt="Logo" style={{ height: '90px', marginBottom: '15px', borderRadius: '50%', border: '3px solid #f1f8e9' }} />
          <h2 style={{ margin: '0 0 5px 0', color: theme.text }}>{isRegistering ? 'Cont Nou' : 'Bine ai venit!'}</h2>
          <p style={{ color: '#81c784', marginBottom: '30px', fontWeight: '500' }}>Pet Care Manager App</p>
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {isRegistering && <input type="text" placeholder="Nume utilizator" value={username} onChange={e => setUsername(e.target.value)} required style={inputStyle} />}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
            <input type="password" placeholder="Parolă" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
            <button type="submit" className="interactive-btn" style={{ ...btnPrimaryStyle, background: theme.primary }}>
                {isRegistering ? 'Creează Cont' : 'Autentificare'}
            </button>
          </form>
          {authMessage && <p style={{ color: authMessage.includes('Succes') ? 'green' : '#e53935', marginTop: '15px', fontWeight: 'bold' }}>{authMessage}</p>}
          <div style={{ marginTop: '25px', fontSize: '14px', color: '#666' }}>
            {isRegistering ? 'Ai deja cont? ' : 'Nu ai cont? '}
            <span onClick={() => { setIsRegistering(!isRegistering); setAuthMessage(''); }} style={{ color: theme.header, fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}>{isRegistering ? 'Loghează-te' : 'Înregistrează-te'}</span>
          </div>
        </div>
      </div>
    );
  }

  // --- 6. INTERFAȚA PRINCIPALĂ (DASHBOARD) --- 
  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: theme.bg, overflow: 'hidden' }}>
      
      {/* HEADER */}
      <header style={{ background: theme.header, padding: '0 40px', height: '70px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', color: 'white', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <img src={logo} alt="Logo" style={{ height: '45px', borderRadius: '50%', border: '2px solid rgba(255,255,255,0.8)' }} />
            <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', letterSpacing: '0.5px' }}>Pet Care Manager</h2>
                <span style={{ fontSize: '11px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Sistem Gestiune Veterinară</span>
            </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{opacity: 0.9}}>Salut, <strong>{user.username}</strong>!</span>
            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', transition: '0.3s' }}>Ieșire</button>
        </div>
      </header>

      {/* ZONA CENTRALĂ */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}> 
        <main style={{ padding: '40px', maxWidth: '1200px', width: '100%', margin: '0 auto', boxSizing: 'border-box', flex: 1 }}>
            
            {/* PANOU STATISTICI DINAMICE */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <div style={statCardStyle}><div style={{fontSize: '30px'}}>🐾</div><div><h3 style={{margin: 0, fontSize: '24px', color: theme.header}}>{stats.total}</h3><span style={{color: '#777', fontSize: '13px'}}>Total Animale</span></div></div>
                <div style={statCardStyle}><div style={{fontSize: '30px'}}>🐶</div><div><h3 style={{margin: 0, fontSize: '24px', color: theme.header}}>{stats.dogs}</h3><span style={{color: '#777', fontSize: '13px'}}>Câini</span></div></div>
                <div style={statCardStyle}><div style={{fontSize: '30px'}}>🐱</div><div><h3 style={{margin: 0, fontSize: '24px', color: theme.header}}>{stats.cats}</h3><span style={{color: '#777', fontSize: '13px'}}>Pisici</span></div></div>
            </div>

            {/* BARĂ CĂUTARE ȘI TITLU */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
                <h1 style={{ margin: 0, color: theme.text, fontSize: '26px' }}>Gestionează Animalele</h1>
                <input type="text" placeholder="🔍 Caută animal..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={{ padding: '12px 20px', width: '280px', borderRadius: '30px', border: 'none', outline: 'none', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }} />
            </div>

            <div style={{ display: 'flex', gap: '30px', flexDirection: 'row', alignItems: 'flex-start' }}>
                
                {/* FORMULAR ADĂUGARE/EDITARE */}
                <div style={{ flex: '0 0 320px', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', position: 'sticky', top: '20px' }}>
                    <h3 style={{ marginTop: 0, color: theme.text, borderBottom: '2px solid #f1f8e9', paddingBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {editId ? '✏️ Modifică' : '➕ Adaugă Animal'}
                    </h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} placeholder="Nume (ex: Rex)" />
                        <input type="text" name="species" value={formData.species} onChange={handleChange} required style={inputStyle} placeholder="Specie (ex: Caine)" />
                        <input type="text" name="breed" value={formData.breed} onChange={handleChange} style={inputStyle} placeholder="Rasă (Opțional)" />
                        <label style={{fontSize: '12px', fontWeight: 'bold', color: '#888', marginBottom: '-10px', marginLeft: '5px'}}>DATA NAȘTERII</label>
                        <input type="date" name="birth_date" value={formData.birth_date} onChange={handleChange} required style={inputStyle} />
                        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                            <button type="submit" className="interactive-btn" style={{ ...btnPrimaryStyle, background: theme.primary, flex: 1 }}>{editId ? 'Salvează' : 'Adaugă'}</button>
                            {editId && <button type="button" onClick={resetForm} style={{ ...btnPrimaryStyle, background: '#90a4ae', flex: 1 }}>Anulează</button>}
                        </div>
                    </form>
                </div>

                {/* GRID CARDURI ANIMALE */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', alignContent: 'start' }}>
                    {filteredPets.map((pet) => (
                    <div key={pet.id} className="pet-card" style={{ background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 10px rgba(0,0,0,0.03)', border: '1px solid #f1f8e9', transition: '0.2s', height: 'fit-content' }}>
                        <div style={{ padding: '20px', position: 'relative', background: 'linear-gradient(to right, #f9fbe7, #ffffff)' }}>
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleEdit(pet)} style={iconBtnStyle} title="Editează">✏️</button>
                                <button onClick={() => handleDelete(pet.id)} style={{...iconBtnStyle, color: '#e57373'}} title="Șterge">🗑</button>
                            </div>
                            <h2 style={{ margin: '0 0 2px 0', fontSize: '20px', color: theme.text }}>{pet.name}</h2>
                            <div style={{ fontSize: '13px', color: '#777', textTransform: 'capitalize' }}>{pet.species} • {pet.breed}</div>
                        </div>
                        
                        <div style={{ padding: '15px' }}>
                            <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                                <button onClick={() => handleToggle(pet.id, 'form')} className="interactive-btn" style={{ flex: 1, padding: '10px', border: `1px solid ${theme.primary}`, background: (activeAppointmentPet === pet.id && viewMode === 'form') ? theme.primary : 'white', color: (activeAppointmentPet === pet.id && viewMode === 'form') ? 'white' : theme.primary, borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>📅 Programează</button>
                                <button onClick={() => handleToggle(pet.id, 'history')} className="interactive-btn" style={{ flex: 1, padding: '10px', border: `1px solid #78909c`, background: (activeAppointmentPet === pet.id && viewMode === 'history') ? '#78909c' : 'white', color: (activeAppointmentPet === pet.id && viewMode === 'history') ? 'white' : '#78909c', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: '0.2s' }}>📜 Istoric</button>
                            </div>

                            {/* ZONA CONTEXTUALĂ (FORMULAR PROGRAMARE SAU LISTĂ ISTORIC) */}
                            {activeAppointmentPet === pet.id && (
                                <div style={{ marginTop: '15px', background: '#f1f8e9', padding: '15px', borderRadius: '10px', animation: 'fadeIn 0.3s' }}>
                                    {viewMode === 'form' && (
                                        <form onSubmit={(e) => handleAppSubmit(e, pet.id)} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <select value={appForm.service_name} onChange={e => setAppForm({...appForm, service_name: e.target.value})} style={miniInputStyle}>
                                                {services.map(s => <option key={s.id} value={s.service_name}>{s.service_name} ({s.price} lei)</option>)}
                                            </select>
                                            <div style={{display: 'flex', gap: '5px'}}>
                                                <input type="datetime-local" value={appForm.date} onChange={e => setAppForm({...appForm, date: e.target.value})} required style={{...miniInputStyle, flex: 1}}/>
                                                <button type="submit" className="interactive-btn" style={{ background: theme.primary, color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', padding: '0 12px', fontWeight: 'bold' }}>Salvează</button>
                                            </div>
                                        </form>
                                    )}
                                    {viewMode === 'history' && (
                                        <>
                                            {/* SEPARARE AUTOMATĂ PROGRAMĂRI VIITOARE VS ISTORIC  */}
                                            {appointments.filter(a => new Date(a.appointment_date) >= new Date()).length > 0 && (
                                                <>
                                                    <h4 style={{marginTop: 0, marginBottom: '10px', color: '#2e7d32', fontSize: '13px', borderBottom: '2px solid #a5d6a7', paddingBottom: '3px'}}>🟢 Urmează:</h4>
                                                    <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0 0 15px 0', fontSize: '13px', color: '#555' }}>
                                                        {appointments.filter(a => new Date(a.appointment_date) >= new Date()).map(app => (
                                                            <li key={app.id} style={{ marginBottom: '8px', padding: '8px', background: 'white', borderLeft: '3px solid #66bb6a', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between' }}>
                                                                <div><div style={{fontWeight: 'bold', fontSize: '12px'}}>{new Date(app.appointment_date).toLocaleDateString()} {new Date(app.appointment_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div><div>{app.service_name}</div></div>
                                                                <span style={{fontWeight:'bold', color: '#2e7d32', alignSelf: 'center'}}>{app.price} L</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {/* ISTORIC TRECUT  */}
                                            {appointments.filter(a => new Date(a.appointment_date) < new Date()).length > 0 && (
                                                <>
                                                    <h4 style={{marginTop: 10, marginBottom: '10px', color: '#78909c', fontSize: '13px', borderBottom: '1px solid #cfd8dc', paddingBottom: '3px'}}>⚪ Istoric:</h4>
                                                    <ul style={{ paddingLeft: '0', listStyle: 'none', margin: '0', fontSize: '12px', color: '#777', maxHeight: '120px', overflowY: 'auto' }}>
                                                        {appointments.filter(a => new Date(a.appointment_date) < new Date()).map(app => (
                                                            <li key={app.id} style={{ marginBottom: '5px', paddingBottom: '5px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}><span>{new Date(app.appointment_date).toLocaleDateString()} - {app.service_name}</span><span style={{fontWeight:'bold'}}>{app.price} L</span></li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}
                                            {appointments.length === 0 && <p style={{textAlign: 'center', color: '#999', fontSize: '13px', fontStyle: 'italic'}}>Nicio înregistrare găsită.</p>}
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </main>

        {/* SUBSOL (FOOTER) */}
        <footer style={{ background: theme.footer, color: 'white', padding: '10px 40px', textAlign: 'center', fontSize: '12px', flexShrink: 0, boxShadow: '0 -2px 10px rgba(0,0,0,0.1)', marginTop: 'auto' }}>
            <p style={{ margin: 0 }}>© 2025 Pet Care Manager - Toate drepturile rezervate.</p>
        </footer>
      </div>

      {/* STILURI GLOBALE */}
      <style>{`
        .pet-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.15) !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 10px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #81c784; border-radius: 5px; }
        .interactive-btn:hover, input:focus, select:focus {
          box-shadow: 0 0 12px rgba(76, 175, 80, 0.4) !important;
          transform: scale(1.02);
          transition: 0.2s;
        }
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
            filter: invert(48%) sepia(13%) saturate(3207%) hue-rotate(81deg) brightness(95%) contrast(80%);
            cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// --- 7. STILURI STATICE ---
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #c8e6c9', background: '#fafafa', outline: 'none', boxSizing: 'border-box', fontSize: '14px', transition: '0.3s' };
const btnPrimaryStyle = { width: '100%', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', transition: '0.2s' };
const iconBtnStyle = { width: '28px', height: '28px', borderRadius: '50%', border: 'none', background: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', transition: '0.2s' };
const miniInputStyle = { padding: '8px', borderRadius: '6px', border: '2px solid #a5d6a7', fontSize: '12px', background: 'white', color: '#1b5e20', transition: '0.3s' };
const statCardStyle = { flex: 1, minWidth: '150px', background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px', borderBottom: '4px solid #a5d6a7' };

export default App;