import { FormTemplate, GridRow, SavedRecord } from "../types";

// Static base templates for general hospital functions
const STATIC_TEMPLATES: FormTemplate[] = [
  { id: "daily-nursing", code: "BHG-FR-GEN-027", titleAr: "جرد مستلزمات غرفة الملابس - Dressing Room Check", titleEn: "Daily Nursing Checklist (Dressing Room Supplies)", departmentDefault: "DRESSING ROOM", version: "01", issueDate: "03.2025" },
  { id: "patient-discharge-ama", code: "BHG-FR-MED-080", titleAr: "إقرار خروج المريض بالرفض / مخالفاً للنصيحة الطبية", titleEn: "Patient Discharge Against Medical Advice", departmentDefault: "EMERGENCY UNIT", version: "01", issueDate: "03.2025", hasPatientDetails: true },
  { id: "ambulance-request", code: "BHG-FR-GEN-003", titleAr: "طلب نقل سيارة إسعاف - Ambulance Request Form", titleEn: "Ambulance Request & Patient Conveyance Form", departmentDefault: "EMERGENCY UNIT", version: "02", issueDate: "03.2023", hasPatientDetails: true },
  { id: "er-triage-log", code: "BHG-FR-NUR-023", titleAr: "سجل فرز وتصنيف حالات الطوارئ - Triage Log", titleEn: "ER Triage & Patient Classification Register", departmentDefault: "EMERGENCY ROOM", version: "01", issueDate: "2025" },
  { id: "er-isolation-pressure", code: "BHG-FR-ENG-080", titleAr: "سجل ضغط غرفة العزل السلبي - Negative Pressure", titleEn: "Isolation Room Daily Negative Pressure Log", departmentDefault: "EMERGENCY ROOM", version: "01", issueDate: "2025" },
  { id: "er-cast-splint", code: "BHG-FR-NUR-025", titleAr: "جرد جبائر ومستلزمات العظام بالطوارئ - Cast & Splint", titleEn: "Cast, Bandages and Orthopedic Splint Stock", departmentDefault: "EMERGENCY UNIT", version: "01", issueDate: "2025" },
  { id: "er-suture-checklist", code: "BHG-FR-NUR-026", titleAr: "جرد مستلزمات خياطة الجروح بالطوارئ - Suture Room", titleEn: "Emergency Suture Room Supplies Checklist", departmentDefault: "EMERGENCY UNIT", version: "01", issueDate: "2025" },
  { id: "icu-supplies-services", code: "BHG-BZ-FR-NUR-010-ICU", titleAr: "مستلزمات وإجراءات الرعاية المركزة - ICU Supplies & Services", titleEn: "ICU Supplies & Services Daily Ledger", departmentDefault: "ICU", version: "03", issueDate: "09.2025" },
  { id: "icu-pressure-ulcer", code: "BHG-FR-ICU-007", titleAr: "فحص ومتابعة قرح الفراش بالرعاية - Pressure Ulcers", titleEn: "ICU Pressure Ulcer Integrity Assessment Log", departmentDefault: "ICU", version: "01", issueDate: "2025" },
  { id: "icu-blood-gas", code: "BHG-FR-ICU-008", titleAr: "سجل عينات غازات الدم الشرياني ومستهلكاتها - ABG Log", titleEn: "Arterial Blood Gas Analysis & Consumables Log", departmentDefault: "ICU", version: "01", issueDate: "2025" },
  { id: "icu-infusion-pumps", code: "BHG-FR-ICU-009", titleAr: "سجل عهدة مضخات المحاليل والحقن الوريدي بالرعاية", titleEn: "Volumetric Infusion & Syringe Pumps Registry", departmentDefault: "ICU", version: "01", issueDate: "2025" },
  { id: "or-specimen-log", code: "BHG-FR-SURG-051", titleAr: "سجل تسجيل وإرسال العينات الباثولوجية - Specimen Log", titleEn: "Intraoperative Surgical Pathology Specimen Log", departmentDefault: "OPERATING ROOM", version: "01", issueDate: "2025" },
  { id: "or-implants-mesh", code: "BHG-FR-SURG-052", titleAr: "سجل جرد الرقع الجراحية والشبكات المستوردة - Implants", titleEn: "Surgical Mesh & Implantable Prostheses Ledger", departmentDefault: "OPERATING ROOM", version: "01", issueDate: "2025" },
  { id: "or-count-sheet", code: "BHG-FR-SURG-053", titleAr: "قائمة عد الشاش والإبر والآلات أثناء الجراحة", titleEn: "Surgical Sponge & Sharp Instruments Count Sheet", departmentDefault: "OPERATING ROOM", version: "01", issueDate: "2025" },
  { id: "chemo-spill-kit", code: "BHG-FR-CHEMO-102", titleAr: "سجل فحص وتوافر حقيبة التعامل مع انسكاب الكيماوي", titleEn: "Chemotherapy Spill Kit Inventory Checklist", departmentDefault: "CHEMO DAYCARE", version: "01", issueDate: "2025" },
  { id: "chemo-extravasation", code: "BHG-FR-CHEMO-103", titleAr: "سجل رصد ومتابعة تسرب دواء الكيماوي تحت الجلد", titleEn: "Chemotherapy Extravasation Intervention Logs", departmentDefault: "CHEMO DAYCARE", version: "01", issueDate: "2025" },
  { id: "rad-contrast-media", code: "BHG-FR-RAD-201", titleAr: "سجل جرد واستهلاك مواد التباين والصبغات بالأشعة", titleEn: "Contrast Media Stock & Patient Usage Log", departmentDefault: "RADIOLOGY UNIT", version: "01", issueDate: "2025" },
  { id: "rad-mri-safety", code: "BHG-FR-RAD-205", titleAr: "قائمة التحقق من الأمان والسلامة قبل الدخول للرنين", titleEn: "MRI High-Field Magnetic Safety Patient Screening", departmentDefault: "RADIOLOGY UNIT", version: "01", issueDate: "2025" },
  { id: "pha-narcotics-registry", code: "BHG-FR-PHA-401", titleAr: "سجل وحساب عهدة الأدوية المخدرة والخاضعة للمراقبة", titleEn: "Controlled Narcotics & Psychotropics Ledger Balance", departmentDefault: "PHARMACY DEPT", version: "01", issueDate: "2025" },
  { id: "code-blue-log", code: "BHG-BZ-FR-NUR-005", titleAr: "دفتر قيد نداءات الكود الأزرق - Code Blue Logs", titleEn: "Code Blue Responders & Operator Logbook", departmentDefault: "ICU / TELEMETRY", version: "01", issueDate: "07.2025" },
  { id: "nursing-safety-huddle", code: "BHG-FR-NUR-027-Huddle", titleAr: "اجتماع السلامة التمريضي اليومي - Safety Huddle", titleEn: "Daily Nursing Safety Huddle Checklist", departmentDefault: "NURSING DEPT", version: "01", issueDate: "01.2024" },
  { id: "quality-falls-prevention", code: "BHG-FR-QLTY-501", titleAr: "قائمة مراقبة السلامة البيئية لمنع سقوط المرضى", titleEn: "Environmental Falls Prevention Compliance Round", departmentDefault: "QUALITY CONTROL", version: "01", issueDate: "2025" }
];

// Main 16 Baheya Hospital Departments
export const DEPARTMENT_POOL = [
  { dept: "EMERGENCY UNIT", prefix: "ER", nameAr: "قسم الطوارئ السريع", nameEn: "Emergency Command Unit" },
  { dept: "INTENSIVE CARE", prefix: "ICU", nameAr: "الرعاية الحرجة المركزة", nameEn: "Intensive Care Unit" },
  { dept: "OPERATING ROOM", prefix: "OR", nameAr: "مجمع العمليات الجراحية", nameEn: "Operating Room Surgical Department" },
  { dept: "CHEMOTHERAPY DAYCARE", prefix: "CHEMO", nameAr: "وحدة العلاج الكيماوي اليومي", nameEn: "Chemotherapy Daycare Center" },
  { dept: "RADIOLOGY UNIT", prefix: "RAD", nameAr: "الأشعة التداخلية والتشخيصية", nameEn: "Radiology & Breast Intervention" },
  { dept: "PHARMACY STORE", prefix: "PHA", nameAr: "الصيدلية الإكلينيكية والعهدة", nameEn: "Clinical Pharmacy & Narcotics Depot" },
  { dept: "PEDIATRIC WARD", prefix: "PED", nameAr: "جناح وسريري للأطفال", nameEn: "Specialized Pediatric Ward" },
  { dept: "QUALITY CONTROL", prefix: "QLTY", nameAr: "قسم مراقبة الجودة الطبية وسلامة المرضى", nameEn: "Medical Quality Control Department" },
  { dept: "LABORATORY DEPT", prefix: "LAB", nameAr: "مختبر ومعمل باثولوجيا الأنسجة", nameEn: "Histopathology Medical Lab" },
  { dept: "INFECTION CONTROL", prefix: "INF", nameAr: "مكتب إدارة مكافحة العدوى والوقاية", nameEn: "Infection Control and Prevention" },
  { dept: "CLINICAL NUTRITION", prefix: "NUTR", nameAr: "قسم التغذية الإكلينيكية والعلاجية", nameEn: "Clinical Nutrition & Dietetics" },
  { dept: "INPATIENT FLOORS", prefix: "INP", nameAr: "رعاية الإقامة والأسرة الداخلية", nameEn: "Inpatient Rooms & Wards" },
  { dept: "OUTPATIENT CLINICS", prefix: "OUT", nameAr: "العيادات الخارجية والاستشارات بهية", nameEn: "Outpatient Consulting Clinics" },
  { dept: "BIOMEDICAL ENGINEERING", prefix: "BIOMED", nameAr: "الصيانة الطبية والهندسة الحيوية", nameEn: "Biomedical Equipment Engineering" },
  { dept: "DENTAL CLINIC", prefix: "DNTL", nameAr: "عيادة وصحة الفم والأسنان المعتمدة", nameEn: "Dentistry & Oral Oncology Clinic" },
  { dept: "ONCOLOGY RESEARCH", prefix: "RSRCH", nameAr: "مركز الأبحاث والتجارب الإكلينيكية للثدي", nameEn: "Breast Cancer Advanced Research Center" }
];

// Core clinical templates to distribute to all departments
const CORE_CATEGORIES = [
  {
    key: "crash-cart",
    prefix: "CRASH",
    titleAr: "جرد وفحص عهدة عربة الطوارئ (الكراش كارت) وعلامات القفل اليومي",
    titleEn: "Inspection and Inventory of Emergency Crash Cart & Lock Seals",
  },
  {
    key: "dc-shock",
    prefix: "DC",
    titleAr: "سجل جاهزية وعمر بطارية جهاز صدمات وفحص شحنة الـ DC Shock",
    titleEn: "Defibrillator DC Shock Instrument Readiness & Charge Verification",
  },
  {
    key: "med-cart",
    prefix: "MED",
    titleAr: "جرد وتدقيق عربة الأدوية والمحاليل العلاجية والأمبولات اليومية",
    titleEn: "Daily Medication Cart Stocking, Admixtures & Vials Checklist",
  },
  {
    key: "supplies-store",
    prefix: "STORE",
    titleAr: "جرد وفحص مخزن ومستودع المستلزمات الطبية والتمريضية العام",
    titleEn: "General Medical and Nursing Supplies Store Auditing and Check",
  },
  {
    key: "temp-fridge",
    prefix: "TEMP",
    titleAr: "سجل مراقبة درجات حرارة الغرف وثلاجة حفظ الأدوية الطبية المعتمد",
    titleEn: "Room Environment & Medical Fridge Temperature & Humidity Monitoring",
  },
  {
    key: "supplies-box",
    prefix: "BOX",
    titleAr: "جرد وفحص جاهزية علب وبوكسات المستلزمات السريرية الطارئة بالقسم",
    titleEn: "Inspection of Clinical emergency supplies boxes & sets in unit",
  },
  {
    key: "intubation-box",
    prefix: "INTUB",
    titleAr: "قائمة جرد وتكامل صندوق أنابيب ومناظير التنفس (بوكس Intubation)",
    titleEn: "Laryngoscopes & Intubation Box Equipment Completeness and Verification",
  },
  {
    key: "chest-tube",
    prefix: "CHEST",
    titleAr: "جرد متكامل ومتابعة لوازم تركيب أنبوب الصدر والنزح (الشيست تيوب)",
    titleEn: "Chest Tube Core Supplies and Underwater Seal Drainage Set Check",
  }
];

// Extra clinical items to pad other clinical sheets appropriately
const EXTRA_TYPES = [
  { ar: "قائمة تسليم وتسلم نوبتجيات القسم لـ", en: "Shift Handover and Nursing Handoff Registry of" },
  { ar: "بيانات فحص كواشف وتحاليل مستهلكات غسيل", en: "Chemical Reagents & Laboratory Consumables inspection in" },
  { ar: "نموذج موافقة المريض المستنيرة المعتمد لـ", en: "Patient Informed Consent & Compliance checklist of" },
  { ar: "سجل تدقيق الأدوية والعهدة عالية الخطورة بـ", en: "High-Alert Drugs Monthly Audit Balance in" },
  { ar: "سجل تعقيم الآلات وأجهزة التعقيم للبخار بـ", en: "Sterilization Log and Autoclave validation checks in" },
  { ar: "سجل النفايات والمخلفات الطبية والخطرة بـ", en: "Biohazardous & Medical Waste Disposal record sheets of" }
];

const EXTRA_AREAS = [
  { ar: "جناح أ - الطابق الأول الممرات", en: "Wing A - 1st Floor Passageways" },
  { ar: "الكبائن المعقمة والتحضيرات السريرية", en: "Sterile Hoods & Clinical Formulations area" },
  { ar: "مخزن الحفظ المغناطيسي للأشعة والتعقيم", en: "MRI Scanning Shield Room & sterilization ward" },
  { ar: "غرف الإقامة الجراحية وعيادات الكشف للثدي", en: "Inpatient breast surgical units & exam rooms" },
  { ar: "مكتب المتابعة النفسية والدعم الإكلينيكي", en: "Psychosocial counseling & clinical support files" }
];

// Build exactly 200 clinical templates bilingually
const generateAllTemplates = (): FormTemplate[] => {
  const resultList = [...STATIC_TEMPLATES];
  
  // 1. First, assign all 8 core clinical checklists (Crash Cart, DC Shock, Med Cart, etc.) to all 16 departments
  // This produces 16 * 8 = 128 templates completely distributed!
  let currentNum = resultList.length + 1;

  for (const dept of DEPARTMENT_POOL) {
    for (const core of CORE_CATEGORIES) {
      const codeNum = String(currentNum).padStart(3, "0");
      const id = `${dept.prefix.toLowerCase()}-${core.key}`;
      const code = `BHG-FR-${dept.prefix}-${core.prefix}-${codeNum}`;
      const titleAr = `${core.titleAr} (${dept.nameAr})`;
      const titleEn = `${core.titleEn} [${dept.nameEn}]`;

      resultList.push({
        id,
        code,
        titleAr,
        titleEn,
        departmentDefault: dept.dept,
        version: "02",
        issueDate: "2026",
      });
      currentNum++;
    }
  }

  // 2. Next, generate specialized sheets up to exactly 200 sheets to represent robust specific workflows
  let typeIdx = 0;
  let areaIdx = 0;
  let deptIdx = 0;

  while (resultList.length < 200) {
    const dept = DEPARTMENT_POOL[deptIdx % DEPARTMENT_POOL.length];
    const type = EXTRA_TYPES[typeIdx % EXTRA_TYPES.length];
    const area = EXTRA_AREAS[areaIdx % EXTRA_AREAS.length];
    const codeNum = String(currentNum).padStart(3, "0");

    const id = `dynamic-${dept.prefix.toLowerCase()}-${codeNum}`;
    const code = `BHG-FR-${dept.prefix}-${codeNum}`;
    const titleAr = `${type.ar} ${area.ar} (${dept.nameAr})`;
    const titleEn = `${type.en} ${area.en} [${dept.nameEn}]`;

    resultList.push({
      id,
      code,
      titleAr,
      titleEn,
      departmentDefault: dept.dept,
      version: "01",
      issueDate: "2026",
    });

    currentNum++;
    deptIdx++;
    typeIdx = (typeIdx + 1) % EXTRA_TYPES.length;
    areaIdx = (areaIdx + 1) % EXTRA_AREAS.length;
  }

  // Ensure strict truncation/expansion at exactly 200 items to avoid deviations
  return resultList.slice(0, 200);
};

export const FORM_TEMPLATES = generateAllTemplates();

// Structured high-fidelity checklists for the primary procedures requested
export const DEFAULT_ITEMS: Record<string, Omit<GridRow, "days">[]> = {
  // CRASH CART ITEMS
  "crash-cart-core": [
    { sn: "1", code: "CC-ADR", itemAr: "أدرينالين أمبول (Adrenaline 1mg/ml) [درج 1]", itemEn: "Adrenaline 1mg (Drawer 1 - Lifesaving)", unit: "AMP", qty: "20" },
    { sn: "2", code: "CC-ATR", itemAr: "أتروبين أمبول (Atropine 1mg/ml) [درج 1]", itemEn: "Atropine 1mg (Drawer 1 - Bradycardia)", unit: "AMP", qty: "10" },
    { sn: "3", code: "CC-AMD", itemAr: "أمبول أميودارون (Amiodarone 150mg) [درج 1]", itemEn: "Amiodarone 150mg Cardiac Resuscitate", unit: "AMP", qty: "5" },
    { sn: "4", code: "CC-BIC", itemAr: "بيكربونات الصوديوم 8.4% (NaHCO3) [درج 1]", itemEn: "Sodium Bicarbonate 8.4% 50ml Vial", unit: "VIAL", qty: "5" },
    { sn: "5", code: "CC-CAL", itemAr: "جلوكونات الكالسيوم 10٪ (Calcium Gluconate)", itemEn: "Calcium Gluconate 10% Ampules", unit: "AMP", qty: "5" },
    { sn: "6", code: "CC-SEAL", itemAr: "تحقق من سلامة الأقفال البلاستيكية وعلامات قفل العربة", itemEn: "Check integrity of yellow plastic safety seals", unit: "CHECK", qty: "1" },
    { sn: "7", code: "CC-CLEAN", itemAr: "نظافة وخلو سطح عربة الطوارئ من الأتربة", itemEn: "Surface cleanliness, disinfected and dust-free", unit: "CHECK", qty: "1" }
  ],
  // DC SHOCK ITEMS
  "dc-shock-core": [
    { sn: "1", code: "DC-PWR", itemAr: "توصيل كابل الكهرباء الرئيسي وعمل لمبات الإشارة", itemEn: "Main AC Power connection & indicator lights", unit: "CHECK", qty: "1" },
    { sn: "2", code: "DC-BATT", itemAr: "مؤشر شحن البطارية الداخلية والعمل الذاتي", itemEn: "Internal system battery indicator and levels", unit: "CHECK", qty: "1" },
    { sn: "3", code: "DC-PADDLE", itemAr: "سلامة المقابض ووجود جل واقي للبالغين والأطفال", itemEn: "Paddles integrity and standard conductive gel", unit: "CHECK", qty: "1" },
    { sn: "4", code: "DC-AED", itemAr: "توافر أقطاب لاصقة للصدمات التلقائية AED للبالغين/الأطفال", itemEn: "Presence of Adult/Pediatric adhesive AED pads", unit: "CHECK", qty: "4" },
    { sn: "5", code: "DC-PAPER", itemAr: "توافر رول الورق واختبار طباعة رسم نبضات القلب", itemEn: "ECG paper roll loaded and printing self-test", unit: "CHECK", qty: "1" },
    { sn: "6", code: "DC-TEST", itemAr: "أداء تجربة تفريغ شحنة الاختبار بنجاح (30 جول)", itemEn: "Execute routine self-test shock discharge (30J)", unit: "CHECK", qty: "1" }
  ],
  // MEDICATION CART ITEMS
  "med-cart-core": [
    { sn: "1", code: "MC-HYD", itemAr: "سوليو-كورتيف / هيدروكورتيزون أمبولات الحساسية", itemEn: "Solu-Cortef / Hydrocortisone allergy ampules", unit: "AMP", qty: "10" },
    { sn: "2", code: "MC-DEX", itemAr: "محاليل جلوكوز بالتراكيز (Dextrose 5% / 10% / 25%)", itemEn: "Dextrose IV solution bottles (5%, 10%, 25%)", unit: "BOTTLE", qty: "6" },
    { sn: "3", code: "MC-SYR", itemAr: "سرنجات حقن معقمة مقاسات (3 مل - 5 مل - 10 مل)", itemEn: "Clinical sterile syringes (3cc, 5cc, 10cc)", unit: "PCS", qty: "120" },
    { sn: "4", code: "MC-SAL", itemAr: "محلول ملح فسيولوجي معقم 0.9٪ سعة 100 مل", itemEn: "Normal Saline 100ml flasks for infusion prep", unit: "BOTTLE", qty: "20" },
    { sn: "5", code: "MC-CAN", itemAr: "كانيولات وريدية ملونة بمقاسات (G18 / G20 / G22)", itemEn: "Color-coded IV Cannula sets (G18/G20/G22)", unit: "PCS", qty: "30" },
    { sn: "6", code: "MC-ALC", itemAr: "مسحات كحولية معقمة لتطهير موضع الحقن", itemEn: "Individual sterile isopropyl alcohol prep pads", unit: "PCS", qty: "200" }
  ],
  // SUPPLIES STORE ITEMS
  "supplies-store-core": [
    { sn: "1", code: "SS-CAN", itemAr: "كانيولات تمريضية ملونة مقاسات مختلفة للحقن", itemEn: "Nursing IV Cannulas multicolor (all clinic sizes)", unit: "BOX", qty: "2" },
    { sn: "2", code: "SS-TAPE", itemAr: "بلاستر أبيض قماشي وبكرة تثبيت الكانيولات للجسم", itemEn: "Adhesive clinical plaster roll and medical tapes", unit: "ROLL", qty: "10" },
    { sn: "3", code: "SS-INF", itemAr: "أجهزة نقل وإعطاء المحاليل المعقمة مع المرشح", itemEn: "Sterile IV infusion sets equipped with filters", unit: "PCS", qty: "50" },
    { sn: "4", code: "SS-SYR", itemAr: "سرنجات حقن ومحاقن تمريض معقمة بمختلف المقاسات", itemEn: "Therapeutic syringe sizes (3cc / 5cc / 10cc)", unit: "BOX", qty: "5" },
    { sn: "5", code: "SS-COT", itemAr: "بكرات قطن طبي وشاش معقم للغيارات السريرية", itemEn: "Medical cotton wool rolls and sterile sponges", unit: "BOX", qty: "4" },
    { sn: "6", code: "SS-BAND", itemAr: "أربطة شاش مرنة وضاغطة لتضميد جروح الثدي والمحاربات", itemEn: "Elastic compression bandages for post-op oncology", unit: "PCS", qty: "30" }
  ],
  // TEMPERATURE LOG ITEMS
  "temp-fridge-core": [
    { sn: "1", code: "TF-ROOM", itemAr: "درجة حرارة الغرفة (المعيار المطلوب: 18 - 25 مئوية)", itemEn: "Room Environment Temp (Required: 18°C - 25°C)", unit: "°C", qty: "1" },
    { sn: "2", code: "TF-REF", itemAr: "درجة حرارة ثلاجة حفظ العينات (المعيار: 2 - 8 مئوية)", itemEn: "Refrigerator Internal Temp (Required: 2°C - 8°C)", unit: "°C", qty: "1" },
    { sn: "3", code: "TF-HUM", itemAr: "درجة الرطوبة النسبية للغرفة (المعيار: 30٪ - 60٪)", itemEn: "Relative Air Humidity Level (Required: 30% - 60%)", unit: "%", qty: "1" },
    { sn: "4", code: "TF-OUT", itemAr: "فحص ميزان ومؤشر رصد الحرارة الرقمي والبطارية", itemEn: "Verify digital thermo-hygrometer calibration", unit: "CHECK", qty: "1" }
  ],
  // SUPPLIES BOX ITEMS
  "supplies-box-core": [
    { sn: "1", code: "SB-PHLEB", itemAr: "صندوق وبوكس مستلزمات سحب الدم الأساسية وتحضير العينات", itemEn: "Complete blood collection sample phlebotomy set", unit: "BOX", qty: "1" },
    { sn: "2", code: "SB-PORT", itemAr: "بوكس تركيب وصيانة سن الإبرة للبورت كاث (الكيماوي)", itemEn: "Port-A-Cath safety needles and maintenance supplies", unit: "BOX", qty: "2" },
    { sn: "3", code: "SB-DRESS", itemAr: "صندوق طاقم الغيارات المعقمة الصغير ورعاية جروح بهية", itemEn: "Baheya sterile minor wound dressings box complete", unit: "SET", qty: "5" },
    { sn: "4", code: "SB-3WAY", itemAr: "صمامات إعطاء المحاليل ثلاثية الاتجاه (3-Way stopcock)", unit: "BOX", qty: "2", itemEn: "Sterile 3-Way injection stopcocks boxes" },
    { sn: "5", code: "SB-TOUR", itemAr: "أربطة ضاغطة مرنة لسحب الدم (Tourniquets) بالبوكس", itemEn: "Elastic vascular tourniquets loaded inside box", unit: "PCS", qty: "3" }
  ],
  // INTUBATION BOX ITEMS
  "intubation-box-core": [
    { sn: "1", code: "IB-LARYN", itemAr: "منظار حنجرة معدني ببطارية مشحونة وشفرات المقاسات", itemEn: "Fiberoptic laryngoscope set handles with all blades", unit: "SET", qty: "1" },
    { sn: "2", code: "IB-ETT", itemAr: "أنابيب حنجرية رغامية معقمة بمقاسات (6.5 / 7.0 / 7.5 / 8.0)", itemEn: "Endotracheal tube sizes (ETT 6.5, 7.0, 7.5, 8.0)", unit: "PCS", qty: "10" },
    { sn: "3", code: "IB-STYL", itemAr: "بوجي وسلك توجيه معدني مرن للأنبوبة الحنجرية (Stylet)", itemEn: "Intubation guide stylets & bougie connectors", unit: "PCS", qty: "4" },
    { sn: "4", code: "IB-LMA", itemAr: "أنابيب التنفس الصناعي لقناع الحنجرة لسلامة مجرى الهواء LMA", itemEn: "Emergency Laryngeal Mask Airway sets (LMA)", unit: "PCS", qty: "2" },
    { sn: "5", code: "IB-SPRAY", itemAr: "بخاخ ليدوكائين مخدر موضعي الحلق (Lidocaine Spray)", itemEn: "Lidocaine 10% oral aerosol numbing spray", unit: "BOTTLE", qty: "1" }
  ],
  // CHEST TUBE ITEMS
  "chest-tube-core": [
    { sn: "1", code: "CT-TUBE", itemAr: "درنقة صدر وأنابيب تصريف معقمة بمقاسات (28Fr / 32Fr)", itemEn: "Thoracostomy chest drain tubes (Sizes Fr28 & Fr32)", unit: "PCS", qty: "4" },
    { sn: "2", code: "CT-BOTTLE", itemAr: "برطمان نزح الصدر المائي وحيد/ثنائي الحجرات معقم", itemEn: "Sterile underwater seal drainage bottle system", unit: "SET", qty: "2" },
    { sn: "3", code: "CT-BLADE", itemAr: "مشرط جراحي معقم وخيط حرير 0 مع إبرة الخياطة للجسم", itemEn: "Surgical scalpel and heavy Silk 0 suturing needle", unit: "PACK", qty: "5" },
    { sn: "4", code: "CT-CLAMP", itemAr: "ملاقط ومقاطع الشريان الثقيلة كوشر لتأمين مخرج الهواء", itemEn: "Heavy-duty Kocher locking forceps for tube clamping", unit: "PCS", qty: "2" },
    { sn: "5", code: "CT-FIXATE", itemAr: "رقع لاصقة وشاش فازلين معقم حول فتحة أنبوب الصدر", itemEn: "Sterile Vaseline petroleum gauze & adhesive fixes", unit: "BOX", qty: "1" }
  ]
};

// Auto-populate helper with generic lists for all other templates dynamically
const genericItemsTemplate: Omit<GridRow, "days">[] = [
  { sn: "1", code: "GEN-01", itemAr: "شاش طبي وغيار الجروح الأساسي", itemEn: "Standard absorbent medical gauze", unit: "PACKET", qty: "10" },
  { sn: "2", code: "GEN-02", itemAr: "جوانتي طبي للفحص معقم ومحفوظ", itemEn: "Non-sterile latex exam gloves", unit: "BOX", qty: "2" },
  { sn: "3", code: "GEN-03", itemAr: "كانيولا فحص قياسية بالأجنحة", itemEn: "Intravenous standard Cannula size G20", unit: "PCS", qty: "5" },
  { sn: "4", code: "GEN-04", itemAr: "بلاستر جروح قماش عريض قوي للتثبيت", itemEn: "High-adhesion surgical plaster roll", unit: "PCS", qty: "1" },
  { sn: "5", code: "GEN-05", itemAr: "محلول ملح طعام غسيل معقم 0.9٪", itemEn: "Physiological Normal Saline 500ml", unit: "BOTTLE", qty: "2" },
  { sn: "6", code: "GEN-06", itemAr: "سرنجات حقن فحص تمريضي مقاس 5 سم", itemEn: "Standard single-use syringe 5cc", unit: "PCS", qty: "20" }
];

export const getItemsForTemplate = (templateId: string, template: FormTemplate): Omit<GridRow, "days">[] => {
  if (template && template.items && template.items.length > 0) {
    return template.items;
  }

  // Redirect templates containing requested core keywords immediately to the high-fidelity items
  const tid = templateId.toLowerCase();
  if (tid.includes("crash-cart") || tid === "daily-nursing" || tid === "daily-nursing-checklist") {
    return DEFAULT_ITEMS["crash-cart-core"];
  }
  if (tid.includes("dc-shock") || tid.includes("dcshock")) {
    return DEFAULT_ITEMS["dc-shock-core"];
  }
  if (tid.includes("med-cart") || tid.includes("medication") || tid.includes("er-medication")) {
    return DEFAULT_ITEMS["med-cart-core"];
  }
  if (tid.includes("supplies-store") || tid.includes("supplies-surgical") || tid.includes("linens-closet")) {
    return DEFAULT_ITEMS["supplies-store-core"];
  }
  if (tid.includes("temp-fridge") || tid.includes("temp-humidity") || tid.includes("temperature")) {
    return DEFAULT_ITEMS["temp-fridge-core"];
  }
  if (tid.includes("supplies-box")) {
    return DEFAULT_ITEMS["supplies-box-core"];
  }
  if (tid.includes("intubation-box") || tid.includes("icu-airway-intubation") || tid.includes("intub")) {
    return DEFAULT_ITEMS["intubation-box-core"];
  }
  if (tid.includes("chest-tube") || tid.includes("chesttube") || tid.includes("chest")) {
    return DEFAULT_ITEMS["chest-tube-core"];
  }

  // Fallback map checks
  if (DEFAULT_ITEMS[templateId]) {
    return DEFAULT_ITEMS[templateId];
  }

  // Prefix extraction fallback
  const codeParts = template.code.split("-");
  const prefix = codeParts[2] || "GEN";

  const itemSuggestionsList: Record<string, { ar: string, en: string, unit: string, qty: string }[]> = {
    "ER": [
      { ar: "أدرينالين أمبول Adrenaline 1mg", en: "Adrenaline 1mg Ampule", unit: "AMP", qty: "10" },
      { ar: "أتروبين أمبول Atropine 1mg", en: "Atropine 1mg Ampule", unit: "AMP", qty: "5" },
      { ar: "أكياس وريدية صوديوم كلورايد 0.9٪", en: "Sodium Chloride saline 0.9% 500ml", unit: "BOTTLE", qty: "15" },
      { ar: "سرنجات بلاستيكية معقمة 5 سم لجرد الطوارئ", en: "Disposable syringes 5cc sterile", unit: "PCS", qty: "100" }
    ],
    "ICU": [
      { ar: "أنابيب شفط الهواء التنفسي الرغامي مقاس 7.5", en: "Endotracheal tube sterile size 7.5", unit: "PCS", qty: "5" },
      { ar: "أقطاب رسم واختبار نبضات القلب ECG معايير", en: "ECG disposable diagnostic electrodes pads", unit: "PCS", qty: "100" },
      { ar: "جهاز محاليل وريدي قياسي ذو منقي دقيق", en: "Standard IV administration set with microfilter", unit: "PCS", qty: "20" }
    ],
    "OR": [
      { ar: "مشرط جراحي حاد معقم مقاس 15 دقة العمليات", en: "Surgical scalpel blades size 15 precision", unit: "PCS", qty: "20" },
      { ar: "خيط جراحي فكريل 3.0 مخروطي الإبرة معقم", en: "Vicryl 3-0 polyglactin suturing thread", unit: "PCS", qty: "12" },
      { ar: "جزء ملاءات غيار جراحية وحقل التعقيم المعقم", en: "Disposable sterile surgical drapes pack", unit: "PACK", qty: "5" }
    ],
    "CHEMO": [
      { ar: "إبر بورتكاس لتلقي الجلسات مقاس G20 وريدي", en: "Port-a-cath clinical needles G20 with tubing", unit: "PCS", qty: "15" },
      { ar: "حقيبة معالجة انسكابات الأدوية الكيماوية الجودة", en: "Chemotherapy cytotoxic spill containment kit", unit: "KIT", qty: "2" },
      { ar: "جوانتي كيميائي مخصص سميك حماية ممرضة", en: "Chemo-approved nitrile protective gloves", unit: "BOX", qty: "2" }
    ]
  };

  const list = itemSuggestionsList[prefix];
  if (!list) {
    return genericItemsTemplate;
  }

  return list.map((item, idx) => ({
    sn: (idx + 1).toString(),
    code: `${prefix}-${(idx + 1).toString().padStart(2, "0")}`,
    itemAr: item.ar,
    itemEn: item.en,
    unit: item.unit,
    qty: item.qty
  }));
};

export function createNewRecord(templateId: string, customTemplates: FormTemplate[] = []): Omit<SavedRecord, "id" | "createdAt"> {
  const allTemplates = [...FORM_TEMPLATES, ...customTemplates];
  const template = allTemplates.find((t) => t.id === templateId);
  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const defaultItems = getItemsForTemplate(templateId, template);
  const gridData: GridRow[] = defaultItems.map((item) => {
    const days: Record<string, string> = {};
    for (let i = 1; i <= 31; i++) {
      days[i.toString()] = "";
    }
    return {
      ...item,
      days
    };
  });

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const dateStr = `${year}-${month}-${String(now.getDate()).padStart(2, '0')}`;
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  return {
    templateId,
    date: dateStr,
    time: timeStr,
    department: template.departmentDefault,
    staffName: "",
    staffId: "",
    notes: "",
    patientName: "",
    patientMRN: "",
    diagnosis: "",
    additionalInfo: {},
    gridData
  };
}
