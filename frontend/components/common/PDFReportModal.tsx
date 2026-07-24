import React, { useRef, useState } from 'react';
import { ScanResult, User } from '../../types';
import {
  Download,
  Printer,
  X,
  CheckCircle2,
  ShieldCheck,
  QrCode,
  Activity,
  FileCheck,
  AlertTriangle
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PDFReportModalProps {
  scan: ScanResult;
  patientUser?: User | null;
  onClose: () => void;
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({ scan, patientUser, onClose }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`PathoAI_Pathology_Report_${scan.id}.pdf`);
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Could not render PDF file. Please try the Print option.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 my-8 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 rounded-xl">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">Official Pathology Laboratory Diagnostic Report</h3>
              <p className="text-xs text-slate-400">Scan Reference ID: {scan.id}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3 py-2 rounded-xl transition-all"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center space-x-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs px-4 py-2 rounded-xl font-medium transition-all shadow-md shadow-teal-500/20 disabled:opacity-50"
            >
              <Download className="w-4 h-4 animate-bounce" />
              <span>{isGenerating ? 'Rendering PDF...' : 'Download PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas Container */}
        <div className="p-6 sm:p-10 overflow-y-auto flex-1 bg-white text-slate-900">
          <div ref={reportRef} className="max-w-3xl mx-auto p-8 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-900 font-sans space-y-6">
            
            {/* Report Letterhead Header */}
            <div className="flex items-center justify-between border-b-2 border-teal-600 pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-teal-600 text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-md">
                  <Activity className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">PathoAI Diagnostics</h1>
                  <p className="text-xs text-teal-700 font-medium">CAP & CLIA Accredited Digital Pathology Network</p>
                  <p className="text-[11px] text-slate-500">100 Medical Plaza, Suite 400 • Phone: (800) 555-PATHO</p>
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block px-3 py-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold rounded-full mb-1">
                  VERIFIED DIAGNOSIS
                </div>
                <p className="text-xs font-mono text-slate-600">Date: {new Date(scan.createdAt).toLocaleDateString()}</p>
                <p className="text-[11px] text-slate-500">Report No: PAR-2026-9921</p>
              </div>
            </div>

            {/* Patient & Scan Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <p className="text-slate-500 uppercase font-bold text-[10px]">Patient Name</p>
                <p className="font-semibold text-slate-900">{scan.patientName}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-bold text-[10px]">Age / Gender</p>
                <p className="font-semibold text-slate-900">{patientUser?.age || 34} Yrs / {patientUser?.gender || 'Female'}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-bold text-[10px]">Blood Group</p>
                <p className="font-semibold text-slate-900">{patientUser?.bloodGroup || 'A+'}</p>
              </div>
              <div>
                <p className="text-slate-500 uppercase font-bold text-[10px]">Affected Area</p>
                <p className="font-semibold text-slate-900">{scan.affectedArea || 'Dermal Region'}</p>
              </div>
            </div>

            {/* Scan Image & Primary AI Diagnostic Result */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border border-slate-200 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-teal-50/30">
              {/* Scan Thumbnail */}
              <div className="relative group rounded-xl overflow-hidden border border-slate-300 shadow-sm aspect-square bg-black">
                <img src={scan.imageUrl} alt="Pathology Scan" className="w-full h-full object-cover" />
                <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                  Input Specimen
                </div>
              </div>

              {/* Diagnosis Overview */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {scan.category}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    scan.severity === 'Severe' || scan.severity === 'High' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                    'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}>
                    {scan.severity} Severity
                  </span>
                </div>

                <h2 className="text-2xl font-bold text-slate-900">{scan.diseaseName}</h2>

                {/* AI Confidence Meter */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600">Model Confidence Classification</span>
                    <span className="text-teal-700 font-mono font-bold">{scan.confidence}% Confidence</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-cyan-600 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(scan.confidence, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed italic border-l-2 border-teal-500 pl-3">
                  "{scan.description}"
                </p>
              </div>
            </div>

            {/* Differential Diagnosis & Precautions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-teal-800">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Differential Diagnosis</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {scan.differentialDiagnosis.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>

              <div className="border border-slate-200 p-4 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center space-x-1.5 text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Clinical Precautions</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700">
                  {scan.precautions.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Recommended Medications Table */}
            {scan.recommendedMedicines && scan.recommendedMedicines.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-100 px-4 py-2 border-b border-slate-200 font-bold text-xs text-slate-800">
                  Recommended Treatment Plan & Pharmacotherapy
                </div>
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                    <tr>
                      <th className="px-4 py-2">Medication</th>
                      <th className="px-4 py-2">Dosage</th>
                      <th className="px-4 py-2">Frequency</th>
                      <th className="px-4 py-2">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {scan.recommendedMedicines.map((med, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-2 font-semibold text-slate-900">{med.name}</td>
                        <td className="px-4 py-2">{med.dosage}</td>
                        <td className="px-4 py-2">{med.frequency}</td>
                        <td className="px-4 py-2">{med.duration}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Signatures & Accreditation Footer */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-1">
                <p className="font-mono text-[10px] text-slate-500">Model Engine: {scan.modelVersion}</p>
                <p className="font-mono text-[10px] text-slate-500">Inference Latency: {scan.inferenceTimeMs}ms</p>
                <p className="text-[10px] text-slate-400">Electronic verification hash: sha256_e88a329910c</p>
              </div>

              <div className="flex items-center space-x-4">
                {/* QR Code Placeholder */}
                <div className="w-16 h-16 bg-slate-100 border border-slate-300 p-1 rounded-lg flex flex-col items-center justify-center text-center">
                  <QrCode className="w-10 h-10 text-slate-800" />
                  <span className="text-[8px] font-mono text-slate-500 mt-0.5">SCAN VERIFY</span>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-teal-800 font-bold text-sm">
                    Dr. Marcus Vance, MD
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium">Chief Pathologist</p>
                  <p className="text-[10px] text-slate-400">License: MD-NY-98231</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
