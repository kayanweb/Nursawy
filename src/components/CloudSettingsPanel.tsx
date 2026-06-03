import React from "react";
import { X, Cloud, ShieldCheck, Database } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function CloudSettingsPanel({ onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
            <Cloud className="w-6 h-6 text-blue-600" />
            إعدادات السحابة والربط
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-green-600" />
              <div>
                <p className="font-semibold text-green-900">نظام الربط نشط</p>
                <p className="text-sm text-green-700">Firebase Cloud Firestore</p>
              </div>
            </div>
            <span className="bg-green-200 text-green-800 text-xs px-2 py-1 rounded-full font-medium">متصل</span>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <Database className="w-5 h-5 text-gray-600" />
              <p className="font-semibold text-gray-900">حالة قاعدة البيانات</p>
            </div>
            <p className="text-sm text-gray-600">القواعد والاتصال مؤمّن وجاهز للاستخدام.</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
