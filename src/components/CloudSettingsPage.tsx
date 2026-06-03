import React from 'react';
import { Cloud, ShieldCheck, Database, RefreshCw, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

export default function CloudSettingsPage({ language }: { language: 'ar' | 'en' }) {
  const isAr = language === 'ar';
  
  const clearLocalCache = () => {
    if (confirm(isAr ? 'هل أنت متأكد؟ سيتم حذف جميع البيانات المخزنة محلياً.' : 'Are you sure? All locally stored data will be deleted.')) {
      localStorage.clear();
      alert(isAr ? 'تم مسح الكاش بنجاح.' : 'Local cache cleared successfully.');
    }
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <header className="flex items-center gap-3 mb-6">
        <Cloud className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">
          {isAr ? 'إعدادات السحابة والربط' : 'Cloud & System Connectivity Settings'}
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Section */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-500" />
            {isAr ? 'حالة الاتصال' : 'Connection Status'}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">{isAr ? 'قاعدة البيانات (Firestore)' : 'Database (Firestore)'}</p>
                  <p className="text-sm text-green-700">{isAr ? 'متصل ومزامن في الوقت الفعلي.' : 'Connected and syncing in real-time.'}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration Utilities */}
        <section className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-gray-500" />
            {isAr ? 'إعدادات النظام الأمنية' : 'System Security Settings'}
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{isAr ? 'نظام مزامنة البيانات' : 'Data Sync System'}</span>
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">LIVE</span>
            </div>
            
            <button 
                onClick={clearLocalCache}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <Trash2 className="w-4 h-4" />
              {isAr ? 'مسح التخزين المحلي (LocalStorage)' : 'Clear Local Storage Cache'}
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition">
              <RefreshCw className="w-4 h-4" />
              {isAr ? 'إعادة فحص الاتصال' : 'Refresh Connection'}
            </button>
          </div>
        </section>
      </div>

      <section className="bg-amber-50 p-6 rounded-xl border border-amber-200 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-900">
          <AlertCircle className="w-5 h-5" />
          {isAr ? 'ملاحظات هامة' : 'Important Notes'}
        </h2>
        <p className="text-amber-800 text-sm leading-relaxed">
          {isAr 
            ? 'تُستخدم هذه الصفحة لإدارة اتصالات السحابة. سيؤدي مسح التخزين المحلي إلى الاعتماد الكلي على السحابة (Firestore).'
            : 'This page is used to manage cloud connectivity. Clearing local storage ensures total reliance on the cloud (Firestore).'}
        </p>
      </section>
    </div>
  );
}
