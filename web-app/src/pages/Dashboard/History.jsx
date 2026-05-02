import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Clock, Search, AlertTriangle, CheckCircle } from 'lucide-react';

const History = () => {
  const { userId } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, [userId]);

  const fetchHistory = async () => {
    try {
      const res = await api.getHistory(userId);
      setHistory(res.data.history || []);
    } catch (err) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-column animate-fade-in" style={{ paddingBottom: '80px' }}>
      <h1 className="text-xl font-bold mb-6">Scan History</h1>

      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <Search size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '12px' }} />
        <input type="text" className="glass-input" placeholder="Search past scans..." style={{ paddingLeft: '48px' }} />
      </div>

      {loading ? (
        <div className="flex-center" style={{ flex: 1 }}><div className="loader" /></div>
      ) : history.length === 0 ? (
        <div className="flex-center flex-column" style={{ flex: 1, opacity: 0.5 }}>
          <Clock size={48} className="mb-4" />
          <p>No scan history found</p>
        </div>
      ) : (
        <div className="history-grid">
          {history.map((item, i) => (
            <div key={i} className="glass-panel flex-between" style={{ padding: '20px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '12px', 
                  background: item.image_url ? `url(${item.image_url}) center/cover` : 'var(--bg-dark)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }} />
                <div>
                  <h3 className="font-semibold">{item.product_name}</h3>
                  <p className="text-muted text-sm mt-1">
                    {new Date(item.scanned_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div>
                {item.analysis_result === 'SAFE' ? (
                  <CheckCircle size={28} color="var(--primary-green)" />
                ) : (
                  <AlertTriangle size={28} color="var(--danger)" />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
