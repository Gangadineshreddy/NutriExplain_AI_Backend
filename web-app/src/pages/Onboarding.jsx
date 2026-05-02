import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, ShieldCheck, Zap } from 'lucide-react';

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const content = [
    {
      title: "Welcome to NutriExplain AI",
      desc: "Your Personal Context-Aware Smart Nutrition Interpreter. Discover what's really in your food.",
      icon: <Activity size={80} color="var(--primary-green)" />
    },
    {
      title: "Scan & Analyze",
      desc: "Instantly scan barcodes to get detailed AI-driven nutritional breakdowns and health insights.",
      icon: <Zap size={80} color="var(--primary-green)" />
    },
    {
      title: "Personalized For You",
      desc: "Get recommendations based on your unique health profile, medical conditions, and lifestyle.",
      icon: <ShieldCheck size={80} color="var(--primary-green)" />
    }
  ];

  const handleNext = () => {
    if (step < content.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="screen-padding flex-center" style={{ textAlign: 'center' }}>
      <div className="animate-fade-in w-full" key={step}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}>
          <div className="animate-pulse" style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '40px', borderRadius: '50%' }}>
            {content[step].icon}
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-4">{content[step].title}</h1>
        <p className="text-muted text-lg mb-8" style={{ lineHeight: '1.6' }}>
          {content[step].desc}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '40px' }}>
          {content.map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: i === step ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '4px', 
                background: i === step ? 'var(--primary-green)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s'
              }}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <button className="btn-primary" onClick={handleNext}>
            {step === content.length - 1 ? 'Get Started' : 'Next'} <ArrowRight size={20} />
          </button>
          {step < content.length - 1 && (
            <button className="btn-secondary" onClick={() => navigate('/login')}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
