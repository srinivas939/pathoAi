import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Upload,
  Camera,
  Sparkles,
  FileText,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Calendar,
  Activity,
  ArrowRight,
  RefreshCw,
  Info,
  ChevronRight,
  Download,
  Share2,
  ListFilter,
  Search,
  Zap,
  Sliders,
  X
} from 'lucide-react';
import { apiAnalyzeScan, apiGetScanHistory, apiGetScanById } from '../../services/api';
import { ScanResult } from '../../types';
import { PDFReportModal } from '../common/PDFReportModal';

// Sample Pathology Test Scans Presets
const SAMPLE_PRESETS = [
  {
    name: 'Atopic Eczema Lesion Assessment',
    category: 'Dermatology',
    symptoms: ['Mild Itching', 'Redness', 'Slight Scaling'],
    area: 'Left Forearm',
  },
  {
    name: 'Atypical Pigmented Mole Check',
    category: 'Dermatopathology',
    symptoms: ['Pigmented Spot', 'Irregular Border', 'Color Variation'],
    area: 'Upper Back',
  },
  {
    name: 'Psoriatic Plaque Specimen Check',
    category: 'Histopathology',
    symptoms: ['Silvery Scales', 'Thickened Skin', 'Itching'],
    area: 'Right Knee',
  }
];

// SCREEN 17 & 18: Scan Upload & Symptom Entry
export const ScanUploadScreen: React.FC = () => {
  const { user, navigate, setActiveScan } = useAuth();
  const [step, setStep] = useState<'upload' | 'symptoms'>('upload');
  const [selectedFile, setSelectedFile] = useState<string | null>('atopic_eczema_sample_data.dcm');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Symptoms state
  const [symptoms, setSymptoms] = useState<string[]>(['Mild Itching', 'Redness']);
  const [affectedArea, setAffectedArea] = useState('Forearm / Arm');
  const [durationDays, setDurationDays] = useState('4-7 days');
  const [customSymptom, setCustomSymptom] = useState('');

  const commonSymptomChips = [
    'Mild Itching', 'Severe Itching', 'Redness / Erythema', 'Scaling',
    'Bleeding / Oozing', 'Irregular Borders', 'Rapid Color Change',
    'Pain / Tenderness', 'Raised Nodule', 'Flaking'
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file.name);
    }
  };

  const handleSelectPreset = (preset: typeof SAMPLE_PRESETS[0]) => {
    setSelectedFile(`${preset.name.toLowerCase().replace(/\s+/g, '_')}.dcm`);
    setSymptoms(preset.symptoms);
    setAffectedArea(preset.area);
  };

  const toggleSymptom = (chip: string) => {
    if (symptoms.includes(chip)) {
      setSymptoms(symptoms.filter(s => s !== chip));
    } else {
      setSymptoms([...symptoms, chip]);
    }
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim() && !symptoms.includes(customSymptom.trim())) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const startAnalysisPipeline = async () => {
    if (!selectedFile) {
      alert('Please select or upload a pathology specimen file first');
      return;
    }

    // Go to loading animation step with state
    navigate('prediction_loading');

    try {
      const result = await apiAnalyzeScan({
        patientId: user?.id || 'pat-1',
        patientName: user?.name || 'Sarah Jenkins',
        imageBase64: selectedFile,
        symptoms,
        affectedArea,
        durationDays,
      });

      setActiveScan(result);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze scan image.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-6 p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
      
      {/* Header Wizard Nav */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">AI Pathology Scanner</h2>
            <p className="text-xs text-slate-500">Step {step === 'upload' ? '1: Load Specimen Data' : '2: Symptom Assessment'}</p>
          </div>
        </div>

        <div className="flex space-x-1">
          <div className={`w-8 h-1.5 rounded-full ${step === 'upload' ? 'bg-slate-900 dark:bg-slate-100' : 'bg-slate-300 dark:bg-slate-700'}`} />
          <div className={`w-8 h-1.5 rounded-full ${step === 'symptoms' ? 'bg-slate-900 dark:bg-slate-100' : 'bg-slate-200 dark:bg-slate-800'}`} />
        </div>
      </div>

      {step === 'upload' ? (
        <div className="space-y-6">
          
          {/* Main Dropzone Box (No images) */}
          <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-6 text-center bg-slate-50/50 dark:bg-slate-800/30 overflow-hidden">
            {selectedFile ? (
              <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-sm mx-auto space-y-3">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-2xl flex items-center justify-center mx-auto border border-slate-300 dark:border-slate-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{selectedFile}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Specimen Data Loaded • Ready for Pipeline Analysis</p>
                </div>
                <label className="inline-block bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-[11px] font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                  Replace File
                  <input type="file" accept=".dcm,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="py-8 space-y-4">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl flex items-center justify-center mx-auto border border-slate-200 dark:border-slate-700">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">Upload Pathology Specimen Data File</p>
                  <p className="text-xs text-slate-500 mt-0.5">Supports Digital Specimen Data / DICOM / JPG (Max 15MB)</p>
                </div>
                <label className="inline-block bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer">
                  Browse Device Files
                  <input type="file" accept=".dcm,.png,.jpg,.jpeg" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}
          </div>

          {/* Quick Preset Selector for Testing */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Or Select Specimen Preset Category:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {SAMPLE_PRESETS.map((p, i) => (
                <div
                  key={i}
                  onClick={() => handleSelectPreset(p)}
                  className={`p-3 rounded-2xl border cursor-pointer text-left transition-all ${
                    selectedFile?.includes(p.name.toLowerCase().substring(0, 6))
                      ? 'border-slate-900 dark:border-slate-100 bg-slate-100 dark:bg-slate-800'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-400'
                  }`}
                >
                  <p className="text-[11px] font-bold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{p.category} • {p.area}</p>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setStep('symptoms')}
            disabled={!selectedFile}
            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            <span>Proceed to Symptom Assessment</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>
      ) : (
        /* Step 2: Symptom Assessment Form */
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 dark:text-slate-200">
              Select Observed Symptoms (Multi-Select Chips):
            </label>
            <div className="flex flex-wrap gap-2">
              {commonSymptomChips.map(chip => {
                const isSelected = symptoms.includes(chip);
                return (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => toggleSymptom(chip)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-400'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add custom symptom */}
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Add other symptom (e.g., Burning sensation)..."
              value={customSymptom}
              onChange={e => setCustomSymptom(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
            />
            <button
              onClick={handleAddCustomSymptom}
              className="bg-slate-800 text-white text-xs px-3 py-2 rounded-xl font-bold"
            >
              Add
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Affected Anatomical Area</label>
              <input
                type="text"
                value={affectedArea}
                onChange={e => setAffectedArea(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Symptom Duration</label>
              <select
                value={durationDays}
                onChange={e => setDurationDays(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
              >
                <option value="1-3 days">1-3 days</option>
                <option value="4-7 days">4-7 days</option>
                <option value="2-3 weeks">2-3 weeks</option>
                <option value="1+ month">1+ month</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              onClick={() => setStep('upload')}
              className="w-1/3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-3.5 rounded-2xl text-xs"
            >
              Back
            </button>
            <button
              onClick={startAnalysisPipeline}
              className="w-2/3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold py-3.5 rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-teal-500/20"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Run AI Transfer Learning Model</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

// SCREEN 19: Prediction Loading Screen
export const PredictionLoadingScreen: React.FC = () => {
  const { activeScan, navigate } = useAuth();
  const [progress, setProgress] = useState(0);
  const [stepLabel, setStepLabel] = useState('Initializing input tensor preprocessing...');

  React.useEffect(() => {
    const steps = [
      { p: 20, label: 'Resizing & BGR to RGB color normalization...' },
      { p: 45, label: 'Gaussian spatial noise filtering...' },
      { p: 70, label: 'EfficientNetB0 feature extractor backbone...' },
      { p: 88, label: 'Ensemble ResNet50 softmax probability cross-validation...' },
      { p: 100, label: 'Calibrating confidence score & severity output...' }
    ];

    let current = 0;
    const interval = setInterval(() => {
      if (current < steps.length) {
        setProgress(steps[current].p);
        setStepLabel(steps[current].label);
        current++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          navigate('prediction_result');
        }, 500);
      }
    }, 450);

    return () => clearInterval(interval);
  }, [activeScan]);

  return (
    <div className="max-w-md mx-auto my-12 p-8 bg-slate-900 text-white rounded-3xl shadow-2xl text-center space-y-6 border border-teal-800/40">
      <div className="relative w-24 h-24 mx-auto">
        <div className="w-full h-full rounded-full border-4 border-teal-500/20 border-t-teal-400 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-lg text-teal-300">
          {progress}%
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight">AI Pathology Analysis</h2>
        <p className="text-xs text-teal-200/80 mt-1 font-mono">{stepLabel}</p>
      </div>

      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-400 to-cyan-400 h-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="text-[10px] text-slate-400 font-mono pt-2">
        Model: EfficientNetB0-v2.1 • Latency ~380ms • Target Accuracy ≥94%
      </div>
    </div>
  );
};

// SCREEN 20: Prediction Result Screen
export const PredictionResultScreen: React.FC = () => {
  const { activeScan, navigate, user } = useAuth();
  const [showPDFModal, setShowPDFModal] = useState(false);

  // Fallback demo result if none in context
  const scan: ScanResult = activeScan || {
    id: 'scan-demo-101',
    patientId: user?.id || 'pat-1',
    patientName: user?.name || 'Sarah Jenkins',
    imageUrl: '',
    symptoms: ['Mild Itching', 'Redness'],
    affectedArea: 'Forearm',
    diseaseName: 'Atopic Dermatitis (Eczema)',
    category: 'Dermatology',
    confidence: 96.4,
    severity: 'Moderate',
    description: 'Inflammatory skin condition characterized by dry, erythematous patches with superficial epidermal scaling.',
    differentialDiagnosis: ['Contact Dermatitis', 'Psoriasis Vulgaris'],
    precautions: [
      'Avoid harsh chemical soaps.',
      'Apply emollients within 3 mins of bathing.'
    ],
    recommendedMedicines: [
      { name: 'Hydrocortisone 1% Cream', dosage: 'Thin layer', frequency: 'Twice daily', duration: '7 days', instructions: 'Topical application.' }
    ],
    recommendedDiet: ['Increase omega-3 fatty acids', 'Hydrate with 2.5L water daily'],
    recommendedSpecialist: 'Dermatologist',
    modelVersion: 'EfficientNetB0-v2.1 (Ensemble ResNet50)',
    inferenceTimeMs: 380,
    status: 'analyzed',
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="max-w-4xl mx-auto my-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                {scan.category}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                scan.severity === 'Severe' || scan.severity === 'High' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-slate-100 text-slate-800 border-slate-200'
              }`}>
                {scan.severity} Severity
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-2">
              {scan.diseaseName}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowPDFModal(true)}
              className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Hospital PDF Report</span>
            </button>
            <button
              onClick={() => navigate('appointment_booking', { scanId: scan.id })}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all border border-slate-700"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Specialist</span>
            </button>
          </div>
        </div>

        {/* Diagnostic Metadata + Confidence Meter Grid (No image) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700 pb-2">
              <Activity className="w-4 h-4" />
              <span>Specimen Metadata</span>
            </div>
            <p><strong>Affected Area:</strong> {scan.affectedArea || 'Unspecified'}</p>
            <p><strong>Symptoms Recorded:</strong> {scan.symptoms?.join(', ') || 'N/A'}</p>
            <p><strong>Date Analyzed:</strong> {new Date(scan.createdAt).toLocaleDateString()}</p>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Model Softmax Confidence</span>
                <span className="text-slate-900 dark:text-white font-mono text-base">{scan.confidence}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <div
                  className="bg-slate-900 dark:bg-slate-100 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${Math.min(scan.confidence, 100)}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed border-l-2 border-slate-800 dark:border-slate-200 pl-3 italic">
              "{scan.description}"
            </p>

            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block font-bold">Recommended Specialist</span>
                <span className="font-semibold text-slate-900 dark:text-white">{scan.recommendedSpecialist}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold">Transfer Learning Model</span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{scan.modelVersion}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Diagnostic Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-slate-100 dark:border-slate-800">
          
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Differential Diagnoses</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              {scan.differentialDiagnosis.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
              <AlertTriangle className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              <span>Precautionary Guidelines</span>
            </h4>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              {scan.precautions.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

        </div>

        {/* Recommended Medicines */}
        {scan.recommendedMedicines && scan.recommendedMedicines.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white">Recommended Pharmacotherapy</h4>
            <div className="divide-y divide-slate-200 dark:divide-slate-700">
              {scan.recommendedMedicines.map((m, idx) => (
                <div key={idx} className="py-2 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{m.name}</span>
                    <p className="text-[11px] text-slate-500">{m.instructions}</p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-800 dark:text-slate-200">
                    {m.dosage} • {m.frequency}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* PDF Modal */}
      {showPDFModal && (
        <PDFReportModal scan={scan} patientUser={user} onClose={() => setShowPDFModal(false)} />
      )}

    </div>
  );
};

// SCREEN 21 & 22: Scan History & Detail View
export const ScanHistoryScreen: React.FC = () => {
  const { user, navigate } = useAuth();
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await apiGetScanHistory(user?.id);
        setScans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const filtered = scans.filter(s =>
    s.diseaseName.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">Pathology Scan History</h1>
          <p className="text-xs text-slate-500">Archived AI specimen classifications and doctor reviews</p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search disease or category..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs text-slate-400">Loading history records...</div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 space-y-3">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <p className="text-xs text-slate-500">No matching scan records found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(scan => (
            <div
              key={scan.id}
              onClick={() => navigate('scan_detail', { scanId: scan.id })}
              className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-slate-400 shadow-sm transition-all cursor-pointer flex space-x-4 items-center group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 shrink-0">
                <Activity className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                    {scan.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {new Date(scan.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-slate-600 transition-colors">
                  {scan.diseaseName}
                </h3>
                <p className="text-xs font-mono text-slate-700 dark:text-slate-300 font-semibold">
                  {scan.confidence}% Confidence • {scan.affectedArea || 'Specimen'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ScanDetailScreen: React.FC = () => {
  const { activeScanId, navigate, user } = useAuth();
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    if (activeScanId) {
      apiGetScanById(activeScanId).then(setScan).catch(console.error);
    }
  }, [activeScanId]);

  if (!scan) return <div className="p-8 text-center text-xs text-slate-400">Loading scan details...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-6">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 dark:bg-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-full border border-slate-200 dark:border-slate-700">{scan.category}</span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2">{scan.diseaseName}</h1>
          </div>
          <button
            onClick={() => setShowPDF(true)}
            className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm"
          >
            Download Official Report
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
            <p className="font-bold text-slate-900 dark:text-white mb-2">Specimen & Symptoms</p>
            <p><strong>Affected Area:</strong> {scan.affectedArea || 'Unspecified'}</p>
            <p><strong>Symptoms:</strong> {scan.symptoms?.join(', ') || 'None listed'}</p>
            <p><strong>Date Analyzed:</strong> {new Date(scan.createdAt).toLocaleString()}</p>
          </div>
          <div className="space-y-2 text-xs">
            <p className="text-slate-500 font-semibold">Classification Model: <span className="text-slate-900 dark:text-white font-mono">{scan.modelVersion}</span></p>
            <p className="text-slate-500 font-semibold">Confidence Score: <span className="text-slate-900 dark:text-white font-bold font-mono text-sm">{scan.confidence}%</span></p>
            <p className="text-slate-500 font-semibold">Severity: <span className="text-slate-800 dark:text-slate-200 font-bold">{scan.severity}</span></p>
            <p className="text-slate-700 dark:text-slate-300 italic">"{scan.description}"</p>
          </div>
        </div>

        {scan.doctorNotes && (
          <div className="p-4 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 mb-1">Doctor Verification Notes</h4>
            <p className="text-slate-800 dark:text-slate-200">{scan.doctorNotes}</p>
          </div>
        )}
      </div>

      {showPDF && <PDFReportModal scan={scan} patientUser={user} onClose={() => setShowPDF(false)} />}
    </div>
  );
};
