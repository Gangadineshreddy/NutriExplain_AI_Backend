import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Shield, Brain, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Analyzing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuth();
  const barcode = location.state?.barcode;
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Extracting Nutritional Data...", icon: Search },
    { text: "Applying Personal Health Context...", icon: Shield },
    { text: "AI generating predictive insights...", icon: Brain }
  ];

  useEffect(() => {
    if (!barcode) {
      toast.error("No barcode provided");
      navigate('/home');
      return;
    }

    const processScan = async () => {
      try {
        setStep(0);
        // 1. Get Product Data
        const prodRes = await api.getProductData({ barcode });
        const product = prodRes.data;

        setStep(1);
        // 2. Analyze Food against personal limits
        const analyzeRes = await api.analyzeFood({
          user_id: userId,
          sugar: product.sugar,
          sodium: product.sodium,
          fat: product.fat,
          carbs: product.carbs
        });
        const analysis = analyzeRes.data.analysis;

        setStep(2);
        // 3. AI Predict
        const aiRes = await api.aiPredict({
          sugar: product.sugar,
          sodium: product.sodium,
          fat: product.fat,
          carbs: product.carbs,
          calories: product.calories,
          protein: product.protein,
          fiber: product.fiber
        });
        const prediction = aiRes.data.prediction;

        // 4. Save Scan
        await api.saveScan({
          user_id: userId,
          barcode: barcode,
          product_name: product.product_name,
          analysis: analysis,
          prediction: prediction,
          image_url: product.image_url
        });

        // Add a slight delay for UI effect
        setTimeout(() => {
          navigate('/result', { 
            state: { 
              product, 
              analysis, 
              prediction 
            } 
          });
        }, 1500);

      } catch (err) {
        toast.error(err.response?.data?.error || "Error analyzing product");
        navigate('/scan');
      }
    };

    processScan();
  }, [barcode, navigate, userId]);

  const CurrentIcon = steps[step].icon;

  return (
    <div className="flex-column flex-center screen-padding" style={{ background: '#1E293B', textAlign: 'center' }}>
      <div className="animate-pulse" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '30px', borderRadius: '50%', marginBottom: '32px' }}>
         <CurrentIcon size={64} color="var(--primary-green)" />
      </div>
      <h2 className="text-xl font-bold mb-4">NutriExplain AI</h2>
      <p className="text-muted text-lg">{steps[step].text}</p>
      
      <div style={{ marginTop: '48px', display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <div 
            key={i} 
            style={{ 
              width: i === step ? '24px' : '8px', 
              height: '8px', 
              borderRadius: '4px', 
              background: i <= step ? 'var(--primary-green)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s'
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Analyzing;
