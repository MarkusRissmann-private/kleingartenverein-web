import React, { useState, useEffect } from 'react';
import { Calendar, Leaf, Users, Bell, LogIn, LogOut, Edit, Plus, Trash2 } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  date: string;
  content: string;
}

interface Event {
  id: number;
  date: string;
  title: string;
  time: string;
}

const App: React.FC = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: 1,
      title: "Frühjahrsputz am 15. März",
      date: "2024-02-20",
      content: "Gemeinsam machen wir unsere Anlage fit für den Frühling. Treffpunkt 9 Uhr am Vereinshaus."
    },
    {
      id: 2,
      title: "Neue Bewässerungsanlage installiert",
      date: "2024-02-15",
      content: "Dank der Gemeinschaftsaktion haben wir nun eine moderne Tröpfchenbewässerung in Bereich C."
    },
    {
      id: 3,
      title: "Jahreshauptversammlung - Einladung",
      date: "2024-02-10",
      content: "Wir laden herzlich zur Jahreshauptversammlung am 5. April ein. Tagesordnung folgt per Mail."
    }
  ]);
  
  const [events, setEvents] = useState<Event[]>([
    { id: 1, date: "15.03.2025", title: "Frühjahrsputz", time: "09:00" },
    { id: 2, date: "05.04.2025", title: "Jahreshauptversammlung", time: "18:00" },
    { id: 3, date: "01.05.2025", title: "Maifest", time: "14:00" },
    { id: 4, date: "15.06.2025", title: "Sommerfest", time: "15:00" }
  ]);

  const [editingNews, setEditingNews] = useState<number | null>(null);
  const [editingEvent, setEditingEvent] = useState<number | null>(null);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAdmin(true);
    setShowLogin(false);
  };

  const handleAddNews = () => {
    const newItem: NewsItem = {
      id: Date.now(),
      title: "Neue Nachricht",
      date: new Date().toISOString().split('T')[0],
      content: "Inhalt hier eingeben..."
    };
    setNews([newItem, ...news]);
    setEditingNews(newItem.id);
  };

  const handleAddEvent = () => {
    const newEvent: Event = {
      id: Date.now(),
      date: new Date().toLocaleDateString('de-DE'),
      title: "Neuer Termin",
      time: "10:00"
    };
    setEvents([...events, newEvent]);
    setEditingEvent(newEvent.id);
  };

  const handleDeleteNews = (id: number) => setNews(news.filter(n => n.id !== id));
  const handleDeleteEvent = (id: number) => setEvents(events.filter(e => e.id !== id));

  const handleNewsUpdate = (id: number, field: keyof NewsItem, value: string) => {
    setNews(news.map(n => n.id === id ? { ...n, [field]: value } : n));
  };

  const handleEventUpdate = (id: number, field: keyof Event, value: string) => {
    setEvents(events.map(ev => ev.id === id ? { ...ev, [field]: value } : ev));
  };

  return (
    <div style={{
      fontFamily: "'Petrona', 'Georgia', serif",
      background: 'linear-gradient(135deg, #f5f1e8 0%, #e8f3e8 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.03,
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(76, 175, 80, 0.4) 0%, transparent 50%),
                         radial-gradient(circle at 80% 80%, rgba(139, 195, 74, 0.4) 0%, transparent 50%)`,
        pointerEvents: 'none', zIndex: 0 }} />

      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        background: scrolled ? 'rgba(255, 255, 255, 0.85)' : 'transparent',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: scrolled ? '1px solid rgba(139, 195, 74, 0.2)' : 'none',
        boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.05)' : 'none'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 2rem',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '50px', height: '50px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #689f38 0%, #8bc34a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 20px rgba(139, 195, 74, 0.3)'
            }}>
              <Leaf size={28} color="white" />
            </div>
            <h1 style={{
              margin: 0, fontSize: '1.8rem', fontWeight: 700,
              background: 'linear-gradient(135deg, #33691e 0%, #689f38 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>Kleingartenverein</h1>
          </div>
          
          <button onClick={() => isAdmin ? setIsAdmin(false) : setShowLogin(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem',
              background: isAdmin ? 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)' 
                : 'linear-gradient(135deg, #689f38 0%, #8bc34a 100%)',
              color: 'white', border: 'none', borderRadius: '50px', cursor: 'pointer',
              fontSize: '0.95rem', fontWeight: 600
            }}>
            {isAdmin ? <><LogOut size={18} /> Abmelden</> : <><LogIn size={18} /> Admin-Login</>}
          </button>
        </div>
      </nav>

      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem 3rem', textAlign: 'center', zIndex: 1 }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, margin: '0 0 1.5rem 0',
          background: 'linear-gradient(135deg, #1b5e20 0%, #689f38 50%, #8bc34a 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.1
        }}>
          Natur. Gemeinschaft.<br /><span style={{ fontStyle: 'italic', fontWeight: 600 }}>Lebensfreude.</span>
        </h2>
        <p style={{ fontSize: '1.3rem', color: '#558b2f', maxWidth: '700px', margin: '0 auto 4rem', lineHeight: 1.6 }}>
          Willkommen in unserer grünen Oase – wo Tradition auf moderne Gartenkultur trifft.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          {[
            { icon: Leaf, title: "Nachhaltig", text: "Ökologisches Gärtnern im Einklang mit der Natur" },
            { icon: Users, title: "Gemeinschaft", text: "Aktive Community mit regelmäßigen Veranstaltungen" },
            { icon: Calendar, title: "Vielfältig", text: "Workshops, Feste und gemeinsame Projekte" }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)',
              borderRadius: '24px', padding: '2.5rem 2rem',
              border: '1px solid rgba(139, 195, 74, 0.2)', cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06)', transition: 'all 0.4s'
            }}>
              <div style={{
                width: '70px', height: '70px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #689f38 0%, #8bc34a 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 1.5rem', boxShadow: '0 8px 24px rgba(139, 195, 74, 0.25)'
              }}>
                <feature.icon size={34} color="white" />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#33691e', margin: '0 0 0.75rem 0' }}>
                {feature.title}
              </h3>
              <p style={{ fontSize: '1rem', color: '#558b2f', margin: 0, lineHeight: 1.6 }}>
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* News and Events sections truncated for space - see full file in repository */}
      
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Petrona:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; }
      `}</style>
    </div>
  );
};

export default App;