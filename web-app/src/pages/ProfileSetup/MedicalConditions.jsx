import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import { Plus, X } from 'lucide-react';

const COMMON_DISEASES = [
  "Diabetes Type 1", "Diabetes Type 2", "Hypertension", 
  "Heart Disease", "Celiac Disease", "Lactose Intolerance"
];

const STAGES = ["Mild", "Moderate", "Severe", "Not Applicable"];

const MedicalConditions = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [conditions, setConditions] = useState([]);
  const [disease, setDisease] = useState('');
  const [stage, setStage] = useState('Not Applicable');
  const [isLoading, setIsLoading] = useState(false);

  const addCondition = () => {
    if (!disease) return;
    if (conditions.some(c => c.disease === disease)) {
      toast.error("Condition already added");
      return;
    }
    setConditions([...conditions, { disease, stage }]);
    setDisease('');
    setStage('Not Applicable');
  };

  const removeCondition = (d) => {
    setConditions(conditions.filter(c => c.disease !== d));
  };

  const handleNext = async () => {
    setIsLoading(true);
    try {
      // Save all conditions
      for (const c of conditions) {
        await api.saveHealthCondition({
          user_id: userId,
          disease: c.disease,
          stage: c.stage
        });
      }
      navigate('/lifestyle');
    } catch (err) {
      toast.error("Failed to save conditions");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-column animate-fade-in">
      <div className="glass-panel w-full" style={{ marginTop: '20px', flex: 1 }}>
        <h1 className="text-2xl font-bold text-primary mb-2">Step 2 of 3</h1>
        <p className="text-muted mb-8">Medical Conditions</p>

        <div className="flex-column gap-4 mb-8">
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Disease name or select below" 
            value={disease} 
            onChange={(e) => setDisease(e.target.value)} 
            list="common-diseases"
          />
          <datalist id="common-diseases">
            {COMMON_DISEASES.map(d => <option key={d} value={d} />)}
          </datalist>

          <select className="glass-input" value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button className="btn-secondary" onClick={addCondition}>
            <Plus size={20} /> Add Condition
          </button>
        </div>

        <div className="flex-column gap-2 mb-8">
          {conditions.map((c, i) => (
            <div key={i} className="flex-between glass-input" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div>
                <p className="font-semibold text-primary">{c.disease}</p>
                <p className="text-xs text-muted">Stage: {c.stage}</p>
              </div>
              <button onClick={() => removeCondition(c.disease)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
          ))}
          {conditions.length === 0 && <p className="text-center text-muted text-sm mt-4">No conditions added</p>}
        </div>

      </div>
      <button className="btn-primary mt-4" onClick={handleNext} disabled={isLoading}>
        {isLoading ? <div className="loader" /> : 'Continue'}
      </button>
    </div>
  );
};

export default MedicalConditions;
