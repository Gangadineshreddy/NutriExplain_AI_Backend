import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, analysis, prediction } = location.state || {};

  if (!product) {
    navigate('/home');
    return null;
  }

  const isSafe = analysis === 'SAFE';

  return (
    <div className="screen-padding flex-column animate-fade-in" style={{ paddingBottom: '80px', overflowY: 'auto' }}>
      <div className="flex-between mb-6">
        <button className="back-button" onClick={() => navigate('/home')}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Analysis Result</h1>
        <div style={{ width: '40px' }} />
      </div>

      {/* Product Header */}
      <div className="flex-center flex-column mb-6">
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '16px', 
          background: product.image_url ? `url(${product.image_url}) center/cover` : 'var(--bg-card)',
          border: '2px solid rgba(255,255,255,0.1)',
          marginBottom: '16px'
        }} />
        <h2 className="text-xl font-bold text-center">{product.product_name}</h2>
        <p className="text-muted">{product.brand || 'Unknown Brand'}</p>
      </div>

      {/* AI Prediction Box */}
      <div className="glass-panel w-full mb-6" style={{ border: `2px solid ${isSafe ? 'var(--primary-green)' : 'var(--danger)'}` }}>
        <div className="flex-center gap-2 mb-2">
          {isSafe ? <ShieldCheck size={28} color="var(--primary-green)" /> : <ShieldAlert size={28} color="var(--danger)" />}
          <h2 className="text-lg font-bold" style={{ color: isSafe ? 'var(--primary-green)' : 'var(--danger)' }}>
            {analysis}
          </h2>
        </div>
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '8px', marginTop: '12px' }}>
          <p className="font-semibold mb-1" style={{ fontSize: '14px', color: 'var(--accent)' }}>AI Insight:</p>
          <p className="text-sm" style={{ lineHeight: '1.5' }}>{prediction}</p>
        </div>
      </div>

      {/* Nutritional Facts */}
      <h3 className="font-bold text-lg mb-4">Nutritional Breakdown (per 100g)</h3>
      <div className="flex-column gap-3 mb-8">
        <NutrientRow label="Calories" value={product.calories} unit="kcal" />
        <NutrientRow label="Carbohydrates" value={product.carbs} unit="g" />
        <NutrientRow label="Sugars" value={product.sugar} unit="g" isHigh={product.sugar > 15} />
        <NutrientRow label="Fat" value={product.fat} unit="g" isHigh={product.fat > 20} />
        <NutrientRow label="Protein" value={product.protein} unit="g" />
        <NutrientRow label="Sodium" value={product.sodium} unit="mg" isHigh={product.sodium > 600} />
        <NutrientRow label="Fiber" value={product.fiber} unit="g" />
      </div>

      <button className="btn-primary mt-auto" onClick={() => navigate('/scan')}>
        Scan Another Product
      </button>
    </div>
  );
};

const NutrientRow = ({ label, value, unit, isHigh }) => (
  <div className="glass-input flex-between" style={{ padding: '16px' }}>
    <span className="font-semibold">{label}</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <span className={isHigh ? 'text-danger font-bold' : ''} style={{ color: isHigh ? 'var(--danger)' : 'inherit' }}>
        {typeof value === 'number' ? value.toFixed(1) : value} {unit}
      </span>
      {isHigh ? <AlertTriangle size={16} color="var(--danger)" /> : <CheckCircle size={16} color="var(--primary-green)" />}
    </div>
  </div>
);

export default Result;
