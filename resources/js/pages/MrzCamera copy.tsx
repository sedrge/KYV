import React, { useRef, useEffect, useState, useCallback } from 'react';
import { createWorker, Worker, PSM, OEM } from 'tesseract.js';
import { parse as parseMRZ } from 'mrz';
import { Camera, RotateCcw, Check, AlertCircle, Scan } from 'lucide-react';

interface MrzFields {
  [key: string]: string | undefined;
}

interface ProcessedImage {
  data: string;
  timestamp: number;
  width: number;
  height: number;
}

interface AnalysisResult {
  fields: Record<string, any>;
  confidence: number;
  rawText: string;
  imageData?: string;
}

export default function MrzCameraModal({ onResult }: { onResult: (data: MrzFields) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [worker, setWorker] = useState<Worker | null>(null);
  const [mode, setMode] = useState<'preview' | 'captured' | 'processing' | 'result'>('preview');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Initialisation...');
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [capturedImage, setCapturedImage] = useState<ProcessedImage | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [debugMode, setDebugMode] = useState(false);

  // Configuration MRZ
  const MRZ_CONFIG = {
    MIN_LINE_LENGTH: 30,
    REQUIRED_LINES: 2,
    CONFIDENCE_THRESHOLD: 60,
  };

  // Prétraitement image pour MRZ
  const preprocessImageForMRZ = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    
    // 1. Conversion en niveaux de gris et binarisation
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // Conversion en niveaux de gris
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      
      // Seuillage pour MRZ (caractères noirs sur fond clair)
      const threshold = 160;
      const binary = gray < threshold ? 0 : 255;
      
      data[i] = data[i + 1] = data[i + 2] = binary;
      data[i + 3] = 255;
    }
    
    ctx.putImageData(imgData, 0, 0);
    
    // 2. Amélioration du contraste
    const enhancedImgData = ctx.getImageData(0, 0, width, height);
    const enhancedData = enhancedImgData.data;
    
    for (let i = 0; i < enhancedData.length; i += 4) {
      const value = enhancedData[i];
      enhancedData[i] = enhancedData[i + 1] = enhancedData[i + 2] = 
        value < 128 ? Math.max(0, value - 50) : Math.min(255, value + 50);
    }
    
    ctx.putImageData(enhancedImgData, 0, 0);
  }, []);

  // Capturer l'image de la caméra
  const captureImage = useCallback(async (): Promise<ProcessedImage | null> => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!ctx || !video.videoWidth || video.videoWidth === 0) {
      setError('Caméra non prête');
      return null;
    }
    
    try {
      // Capturer toute l'image de la caméra
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      ctx.imageSmoothingEnabled = false;
      
      // Dessiner l'image complète
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      // Rogner la partie basse où se trouve le MRZ
      const mrzRegionHeight = Math.floor(canvas.height * 0.3); // 30% du bas
      const mrzRegionY = canvas.height - mrzRegionHeight;
      
      // Créer un nouveau canvas pour la région MRZ
      const mrzCanvas = document.createElement('canvas');
      mrzCanvas.width = canvas.width;
      mrzCanvas.height = mrzRegionHeight;
      const mrzCtx = mrzCanvas.getContext('2d');
      
      if (!mrzCtx) return null;
      
      // Copier la région MRZ
      mrzCtx.drawImage(
        canvas, 
        0, mrzRegionY, canvas.width, mrzRegionHeight,
        0, 0, canvas.width, mrzRegionHeight
      );
      
      // Appliquer le prétraitement
      preprocessImageForMRZ(mrzCtx, mrzCanvas.width, mrzCanvas.height);
      
      // Pour le debug
      if (debugMode && previewCanvasRef.current) {
        const previewCtx = previewCanvasRef.current.getContext('2d');
        if (previewCtx) {
          previewCanvasRef.current.width = mrzCanvas.width;
          previewCanvasRef.current.height = mrzCanvas.height;
          previewCtx.drawImage(mrzCanvas, 0, 0);
        }
      }
      
      return {
        data: mrzCanvas.toDataURL('image/png'),
        timestamp: Date.now(),
        width: mrzCanvas.width,
        height: mrzCanvas.height
      };
      
    } catch (err) {
      console.error('Capture error:', err);
      setError('Erreur lors de la capture');
      return null;
    }
  }, [preprocessImageForMRZ, debugMode]);

  // Analyser l'image avec Tesseract
  const analyzeCapturedImage = useCallback(async (imageData: string): Promise<AnalysisResult | null> => {
    if (!worker) return null;
    
    try {
      setMode('processing');
      setStatus('Analyse OCR en cours...');
      setProcessingProgress(30);
      
      // Simuler la progression
      const progressInterval = setInterval(() => {
        setProcessingProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Utiliser recognize sans logger
      const result = await worker.recognize(imageData);
      
      clearInterval(progressInterval);
      setProcessingProgress(100);
      
      // Extraire le texte
      const text = result.data.text;
      const confidence = result.data.confidence || 0;
      
      console.log('OCR Result:', {
        text: text.substring(0, 200),
        confidence,
        lines: text.split('\n').length
      });
      
      // Nettoyer et extraire les lignes MRZ
      const lines = text
        .split('\n')
        .map(line => {
          return line
            .toUpperCase()
            .replace(/[^A-Z0-9<]/g, '')
            .trim();
        })
        .filter(line => {
          const hasChevrons = line.includes('<');
          const goodLength = line.length >= 28 && line.length <= 44;
          const hasDigits = /\d/.test(line);
          const hasLetters = /[A-Z]/.test(line);
          
          return hasChevrons && goodLength && hasDigits && hasLetters;
        });
      
      console.log('Filtered MRZ lines:', lines);
      
      if (lines.length >= MRZ_CONFIG.REQUIRED_LINES) {
        let parsedResult = null;
        let mrzText = '';
        
        // Essai 1: Prendre les 2-3 dernières lignes
        if (lines.length >= 3) {
          mrzText = lines.slice(-3).join('\n');
          try {
            const parsed = parseMRZ(mrzText);
            if (parsed && parsed.fields) {
              parsedResult = parsed;
            }
          } catch (e) {
            console.log('3-line parse failed');
          }
        }
        
        // Essai 2: Prendre les 2 lignes
        if (!parsedResult && lines.length >= 2) {
          mrzText = lines.slice(-2).join('\n');
          try {
            const parsed = parseMRZ(mrzText);
            if (parsed && parsed.fields) {
              parsedResult = parsed;
            }
          } catch (e) {
            console.log('2-line parse failed');
          }
        }
        
        if (parsedResult && parsedResult.fields) {
          console.log('Successfully parsed MRZ:', parsedResult.fields);
          
          const result: AnalysisResult = {
            fields: parsedResult.fields as Record<string, any>,
            confidence: confidence,
            rawText: mrzText,
            imageData: imageData
          };
          
          return result;
        }
      }
      
      setStatus(`MRZ non détecté (${lines.length} lignes trouvées)`);
      return null;
      
    } catch (error) {
      console.error('OCR Error:', error);
      setError('Erreur lors de l\'analyse OCR');
      return null;
    }
  }, [worker]);

  // Gestionnaire de capture
  const handleCapture = async () => {
    setStatus('Capture en cours...');
    
    const image = await captureImage();
    if (!image) {
      setStatus('Échec de la capture');
      return;
    }
    
    setCapturedImage(image);
    setMode('captured');
    setStatus('Image capturée! Prêt pour analyse.');
  };

  // Gestionnaire d'analyse
  const handleAnalyze = async () => {
    if (!capturedImage) return;
    
    const result = await analyzeCapturedImage(capturedImage.data);
    
    if (result) {
      setAnalysisResult(result);
      setMode('result');
      setStatus('MRZ analysé avec succès!');
      
      // Attendre un peu pour montrer le résultat
      setTimeout(() => {
        onResult(result.fields as MrzFields);
      }, 1500);
    } else {
      setMode('captured');
      setStatus('MRZ non détecté. Essayez à nouveau.');
    }
  };

  // Réinitialiser
  const handleReset = () => {
    setMode('preview');
    setCapturedImage(null);
    setAnalysisResult(null);
    setStatus('Prêt à capturer');
    setProcessingProgress(0);
  };

  // Initialisation caméra
  const initCamera = useCallback(async (deviceId?: string) => {
    try {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }

      let constraints: MediaStreamConstraints;
      if (deviceId) {
        constraints = { 
          video: { 
            deviceId: { exact: deviceId },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30 }
          } 
        };
      } else {
        constraints = { 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'environment',
            frameRate: { ideal: 30 }
          } 
        };
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('Prêt à capturer - alignez le MRZ');
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      setError(`Erreur caméra: ${err.message || 'Permission refusée'}`);
    }
  }, []);

  // Initialisation Tesseract
  useEffect(() => {
    const initWorker = async () => {
      try {
        const w = await createWorker('eng', OEM.LSTM_ONLY);
        
        await w.setParameters({
          tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<',
          tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
          preserve_interword_spaces: '0',
          textord_min_linesize: '2.0',
          classify_bln_numeric_mode: '0',
        });
        
        setWorker(w);
        setStatus('OCR prêt');
      } catch (err) {
        console.error('Worker init error:', err);
        setError('Erreur lors de l\'initialisation OCR');
      }
    };
    
    initWorker();

    return () => {
      if (worker) {
        worker.terminate();
      }
    };
  }, []);

  // Gestion des périphériques vidéo
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInput = devices.filter(d => d.kind === 'videoinput');
        setVideoDevices(videoInput);
        if (videoInput.length > 0) {
          const backCamera = videoInput.find(d => d.label.toLowerCase().includes('back')) || videoInput[0];
          setSelectedDeviceId(backCamera.deviceId);
        }
      } catch (err) {
        console.error('Device enumeration error:', err);
      }
    };
    
    fetchDevices();
  }, []);

  // Changer de caméra
  useEffect(() => {
    if (selectedDeviceId) {
      initCamera(selectedDeviceId);
    }
  }, [selectedDeviceId, initCamera]);

  // Nettoyage
  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      if (worker) {
        worker.terminate();
      }
    };
  }, [worker]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/95 z-50 space-y-6 p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="flex items-center space-x-3">
          <Camera size={28} className="text-white" />
          <div>
            <h2 className="text-white text-xl font-bold">Scanner MRZ</h2>
            <p className="text-white/70 text-sm">
              {mode === 'preview' && 'Alignez le document et capturez'}
              {mode === 'captured' && 'Image capturée - Analysez maintenant'}
              {mode === 'processing' && 'Analyse en cours...'}
              {mode === 'result' && 'Résultat obtenu!'}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {videoDevices.length > 1 && (
            <button
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              onClick={() => {
                const currentIndex = videoDevices.findIndex(d => d.deviceId === selectedDeviceId);
                const nextIndex = (currentIndex + 1) % videoDevices.length;
                setSelectedDeviceId(videoDevices[nextIndex].deviceId);
              }}
              title="Changer de caméra"
            >
              <Camera size={20} className="text-white" />
            </button>
          )}
          
          {mode !== 'preview' && (
            <button
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
              onClick={handleReset}
              title="Nouveau scan"
            >
              <RotateCcw size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-2xl">
        {/* Vue caméra / Image capturée */}
        <div className="flex-1">
          <div className="relative rounded-xl overflow-hidden border-3 border-gray-700 shadow-2xl">
            {mode === 'preview' ? (
              // Vue caméra live
              <>
                <video
                  ref={videoRef}
                  className="w-full h-64 md:h-80 object-cover"
                  playsInline
                  autoPlay
                  muted
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="text-center">
                    <div className="inline-block bg-yellow-500/20 border-2 border-yellow-400 rounded-lg px-4 py-2 mb-2">
                      <p className="text-yellow-300 text-sm font-medium">
                        ↓ Positionnez le MRZ en bas ↓
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : mode === 'captured' ? (
              // Image capturée
              <div className="bg-black p-4">
                <div className="relative">
                  {capturedImage && (
                    <img 
                      src={capturedImage.data} 
                      alt="Captured MRZ"
                      className="w-full h-auto max-h-80 object-contain mx-auto"
                    />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                    <p className="text-white text-center text-sm">
                      MRZ capturé - {capturedImage?.width}x{capturedImage?.height}px
                    </p>
                  </div>
                </div>
              </div>
            ) : mode === 'processing' ? (
              // Écran de traitement
              <div className="h-64 md:h-80 flex flex-col items-center justify-center bg-gray-900">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mb-4" />
                <p className="text-white text-lg font-medium mb-2">{status}</p>
                <div className="w-3/4 bg-gray-700 rounded-full h-3">
                  <div 
                    className="bg-green-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${processingProgress}%` }}
                  />
                </div>
                <p className="text-white/70 text-sm mt-2">{processingProgress}%</p>
              </div>
            ) : mode === 'result' ? (
              // Résultat
              <div className="h-64 md:h-80 flex flex-col items-center justify-center bg-gradient-to-br from-green-900/30 to-gray-900">
                <Check size={64} className="text-green-400 mb-4" />
                <p className="text-white text-xl font-bold mb-2">MRZ Analysé!</p>
                <p className="text-white/80 text-center px-4">
                  {analysisResult?.fields.documentNumber && (
                    <>N° document: <span className="font-mono font-bold">{analysisResult.fields.documentNumber}</span></>
                  )}
                </p>
                <div className="mt-4 bg-black/50 rounded-lg p-3">
                  <p className="text-green-300 text-sm">
                    Confiance: {analysisResult?.confidence.toFixed(1)}%
                  </p>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Contrôles principaux */}
          <div className="mt-4 flex justify-center space-x-4">
            {mode === 'preview' && (
              <button
                onClick={handleCapture}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition"
              >
                <Scan size={20} />
                <span>CAPTURER L'IMAGE</span>
              </button>
            )}
            
            {mode === 'captured' && (
              <div className="flex space-x-4">
                <button
                  onClick={handleReset}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg flex items-center space-x-2 transition"
                >
                  <RotateCcw size={18} />
                  <span>Recapturer</span>
                </button>
                <button
                  onClick={handleAnalyze}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition"
                >
                  <Check size={20} />
                  <span>ANALYSER L'IMAGE</span>
                </button>
              </div>
            )}
            
            {mode === 'result' && (
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg flex items-center space-x-2 transition"
              >
                <RotateCcw size={20} />
                <span>NOUVEAU SCAN</span>
              </button>
            )}
          </div>
        </div>

        {/* Panel latéral d'information */}
        <div className="w-full md:w-80 space-y-4">
          {/* Statut */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <h3 className="text-white font-medium mb-2">Statut</h3>
            <div className="flex items-center space-x-2">
              {mode === 'processing' ? (
                <div className="animate-pulse h-3 w-3 bg-blue-500 rounded-full" />
              ) : mode === 'result' ? (
                <Check size={16} className="text-green-500" />
              ) : (
                <AlertCircle size={16} className="text-yellow-500" />
              )}
              <p className="text-white text-sm">{status}</p>
            </div>
            
            {capturedImage && mode !== 'preview' && (
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-white/70 text-xs">
                  Image: {capturedImage.width}×{capturedImage.height}px
                </p>
                <p className="text-white/70 text-xs">
                  Capturé: {new Date(capturedImage.timestamp).toLocaleTimeString()}
                </p>
              </div>
            )}
          </div>

          {/* Informations MRZ */}
          {analysisResult && mode === 'result' && (
            <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
              <h3 className="text-white font-medium mb-3">Informations extraites</h3>
              <div className="space-y-2">
                {Object.entries(analysisResult.fields).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex justify-between">
                      <span className="text-white/70 text-xs capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span className="text-white text-xs font-mono font-medium">
                        {String(value)}
                      </span>
                    </div>
                  )
                ))}
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between">
                    <span className="text-white/70 text-xs">Confiance OCR:</span>
                    <span className={`text-xs font-bold ${
                      analysisResult.confidence > 80 ? 'text-green-400' : 
                      analysisResult.confidence > 60 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {analysisResult.confidence.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Debug panel */}
          {debugMode && (
            <div className="bg-gray-900/90 rounded-xl p-4 border border-gray-600">
              <h3 className="text-white font-medium mb-2">Debug</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/70">Mode:</span>
                  <span className="text-white font-mono">{mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Worker:</span>
                  <span className="text-white font-mono">{worker ? '✅' : '❌'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Caméra:</span>
                  <span className="text-white font-mono">
                    {videoRef.current?.readyState === 4 ? '✅' : '❌'}
                  </span>
                </div>
                {previewCanvasRef.current && (
                  <div className="mt-2">
                    <p className="text-white/70 mb-1">Image traitée:</p>
                    <canvas 
                      ref={previewCanvasRef} 
                      className="w-full h-24 border border-gray-700 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bouton debug */}
          {process.env.NODE_ENV === 'development' && (
            <button
              onClick={() => setDebugMode(!debugMode)}
              className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-white text-xs rounded-lg transition"
            >
              {debugMode ? '🔒 Masquer Debug' : '🔓 Afficher Debug'}
            </button>
          )}
        </div>
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="bg-red-600 text-white px-5 py-4 rounded-xl shadow-lg max-w-2xl">
          <div className="flex items-center space-x-3">
            <AlertCircle size={22} />
            <div className="flex-1">
              <p className="font-medium">{error}</p>
              <button
                className="mt-3 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded transition"
                onClick={() => {
                  setError(null);
                  if (selectedDeviceId) initCamera(selectedDeviceId);
                }}
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Canvases cachés */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <canvas ref={previewCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}