import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Image as ImageIcon, Camera, Search, VideoOff } from 'lucide-react';
import toast from 'react-hot-toast';

const Scan = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const [html5QrCode, setHtml5QrCode] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const qrCode = new Html5Qrcode("reader");
    setHtml5QrCode(qrCode);

    return () => {
      if (qrCode.isScanning) {
        qrCode.stop().catch(console.error);
      }
    };
  }, []);

  const handleBarcodeDetected = (barcode) => {
    if (!barcode) return;
    setIsScanning(true);
    toast.success("Barcode detected!");
    navigate('/analyzing', { state: { barcode } });
  };

  const startCamera = async () => {
    if (!html5QrCode) return;
    try {
      await html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          html5QrCode.stop();
          setIsCameraActive(false);
          handleBarcodeDetected(decodedText);
        },
        (error) => { /* Ignore frame errors */ }
      );
      setIsCameraActive(true);
    } catch (err) {
      toast.error("Camera permissions denied or unavailable.");
    }
  };

  const stopCamera = async () => {
    if (html5QrCode && isCameraActive) {
      await html5QrCode.stop();
      setIsCameraActive(false);
    }
  };

  const toggleCamera = () => {
    if (isCameraActive) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      if (isCameraActive) await stopCamera();
      const tempQrCode = new Html5Qrcode("hidden-reader");
      const decodedText = await tempQrCode.scanFile(file, true);
      handleBarcodeDetected(decodedText);
      tempQrCode.clear();
    } catch (err) {
      toast.error("No barcode found in image.");
    }
  };

  return (
    <div className="flex-column" style={{ minHeight: '100vh', background: '#1E293B' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '24px', alignItems: 'center' }}>
        <button 
          style={{ background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
          onClick={() => navigate('/home')}
        >
          <X size={24} />
        </button>
        <div className="text-center">
          <p className="font-bold text-sm">SCAN BARCODE</p>
          <div style={{ width: '24px', height: '3px', background: 'var(--primary-green)', margin: '4px auto 0', borderRadius: '2px' }} />
        </div>
        <div style={{ width: '40px' }} />
      </div>

      <div className="flex-column" style={{ padding: '24px', alignItems: 'center', flex: 1 }}>
        <h2 className="text-xl font-bold mb-2">Align the nutrition label</h2>
        <p className="text-muted text-sm mb-8">Hold steady for automatic detection</p>

        {/* Scanner Container */}
        <div style={{ width: '100%', maxWidth: '350px', margin: '0 auto', position: 'relative' }}>
          <div id="reader" style={{ background: 'black', borderRadius: '16px', overflow: 'hidden', minHeight: isCameraActive ? '250px' : '0' }}></div>
          <div id="hidden-reader" style={{ display: 'none' }}></div>
          
          {!isCameraActive && (
            <div style={{ padding: '40px 0', textAlign: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '16px' }}>
              <p className="text-muted mb-4">Camera is off.</p>
              <button className="btn-primary" style={{ width: 'auto', margin: '0 auto' }} onClick={startCamera}>
                <Camera size={20} /> Turn On Camera
              </button>
            </div>
          )}
        </div>

        {/* Manual Fallback */}
        <div style={{ display: 'flex', width: '100%', maxWidth: '350px', gap: '8px', marginTop: '24px' }}>
          <input 
            type="text" 
            className="glass-input" 
            placeholder="Enter barcode manually..." 
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value)}
          />
          <button className="btn-primary" style={{ width: 'auto', padding: '12px' }} onClick={() => handleBarcodeDetected(manualBarcode)}>
            <Search size={20} />
          </button>
        </div>

        <div style={{ marginTop: 'auto', marginBottom: '40px', width: '100%', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          <div className="flex-column flex-center gap-2">
            <label style={{
              width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #4B5563', cursor: 'pointer'
            }}>
              <ImageIcon size={24} color="white" />
              <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
            <span className="text-xs text-muted" style={{ letterSpacing: '1px' }}>GALLERY</span>
          </div>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isScanning ? 'var(--primary-green)' : 'rgba(255,255,255,0.3)' }} />
          </div>

          <div className="flex-column flex-center gap-2">
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%', background: isCameraActive ? 'var(--primary-green)' : 'rgba(0,0,0,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #4B5563', cursor: 'pointer'
            }} onClick={toggleCamera}>
              {isCameraActive ? <VideoOff size={24} color="white" /> : <Camera size={24} color="white" />}
            </div>
            <span className="text-xs text-muted" style={{ letterSpacing: '1px' }}>CAMERA</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;
