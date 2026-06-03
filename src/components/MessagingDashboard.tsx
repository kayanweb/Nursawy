import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  MessageSquare, 
  Send, 
  Users, 
  ShieldAlert, 
  Megaphone, 
  UserCheck, 
  HelpCircle,
  Clock,
  ArrowRightLeft,
  ChevronLeft,
  Settings,
  BellRing,
  Check,
  X,
  FileText,
  PlusCircle,
  Calendar,
  AlertTriangle,
  User
} from 'lucide-react';
import { AppUser } from '../types';

interface Message {
  id: string;
  senderId: string;
  senderNameAr: string;
  senderNameEn: string;
  senderRole: string;
  senderDept: string;
  senderAvatar: string;
  content: string;
  type: 'department' | 'supervisor' | 'broadcast';
  deptId?: string | null;
  recipientId?: string | null;
  timestamp: any;
}

const LOCAL_SHIFTS = [
  { id: "M", nameAr: "وردية صباحية (Morning)", nameEn: "Morning Shift (M)" },
  { id: "A", nameAr: "وردية مسائية (Afternoon)", nameEn: "Afternoon Shift (A)" },
  { id: "D", nameAr: "وردية نهارية (Daylight)", nameEn: "Daylight Shift (D)" },
  { id: "N", nameAr: "وردية ليلية (Night)", nameEn: "Night Shift (N)" },
  { id: "DN", nameAr: "سهر ونوبتجية ممتدة (Duty Night)", nameEn: "Duty Night Shift (DN)" },
  { id: "OFF", nameAr: "يوم راحة (Weekend / OFF)", nameEn: "Weekend / OFF" },
  { id: "AL", nameAr: "إجازة سنوية (Annual Leave - AL)", nameEn: "Annual Leave (AL)" }
];

const ROSTER_DAYS_LIST = [
  "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31",
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"
];

export default function MessagingDashboard({ 
  currentUser, 
  systemUsers = [], 
  language = 'ar',
  rosterWishes = [],
  setRosterWishes,
  rosterList = [],
  setRosterList,
  addSystemLog,
  notifications = [],
  setNotifications
}: { 
  currentUser: any; 
  systemUsers?: AppUser[]; 
  language?: 'ar' | 'en';
  rosterWishes?: any[];
  setRosterWishes?: (wishes: any[]) => void;
  rosterList?: any[];
  setRosterList?: (rosters: any[]) => void;
  addSystemLog?: (text: string, type: "info" | "warning" | "success" | "error") => void;
  notifications?: any[];
  setNotifications?: (notifs: any[]) => void;
}) {
  const [activeSubTab, setActiveSubTab] = useState<'chat' | 'swap' | 'vacation'>('chat');

  const isAr = language === 'ar';

  return (
    <div className="flex flex-col lg:flex-row h-[780px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl transition-all font-sans">
      {/* Sidebar Control Menu */}
      <div className="w-full lg:w-64 bg-slate-950 border-b lg:border-b-0 lg:border-l border-slate-800 p-4 shrink-0 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6 justify-end lg:justify-start lg:flex-row-reverse pb-3 border-b border-slate-800">
            <div className="text-right">
              <h4 className="text-xs font-black text-slate-200 tracking-wider">
                {isAr ? "لوحة تواصل بهية" : "Baheya Messenger"}
              </h4>
              <p className="text-[10px] text-emerald-400 font-mono tracking-tight font-semibold mt-0.5 animate-pulse">
                ● {isAr ? "الربط الآمن للمستشفى" : "SECURE CLINICAL LINE"}
              </p>
            </div>
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-pink-600 to-fuchsia-600 flex items-center justify-center text-white shadow-md">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <button 
              onClick={() => setActiveSubTab('chat')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'chat' 
                  ? 'bg-gradient-to-r from-pink-600/20 to-fuchsia-600/20 text-pink-400 border border-pink-500/30 shadow-inner' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              } ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}
            >
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span>{isAr ? "غرفة المحادثة الرقمية" : "Clinical Chatroom"}</span>
            </button>

            <button 
              onClick={() => setActiveSubTab('swap')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'swap' 
                  ? 'bg-gradient-to-r from-pink-600/20 to-fuchsia-600/20 text-pink-400 border border-pink-500/30' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              } ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}
            >
              <ArrowRightLeft className="h-4 w-4 shrink-0" />
              <span>{isAr ? "طلبات ومبادلات الوردية" : "Shift Swapping Logs"}</span>
            </button>

            <button 
              onClick={() => setActiveSubTab('vacation')} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                activeSubTab === 'vacation' 
                  ? 'bg-gradient-to-r from-pink-600/20 to-fuchsia-600/20 text-pink-400 border border-pink-500/30' 
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              } ${isAr ? 'flex-row-reverse text-right' : 'text-left'}`}
            >
              <BellRing className="h-4 w-4 shrink-0" />
              <span>{isAr ? "إجازات وموافقة المشرف" : "Vacation Approvals"}</span>
            </button>
          </div>
        </div>

        {/* Current User Info Card */}
        <div className={`mt-6 p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-[10px] space-y-1.5 ${isAr ? 'text-right' : 'text-left'}`}>
          <div className={`flex items-center gap-2 ${isAr ? 'flex-row-reverse' : ''}`}>
            <div className="h-6 w-6 rounded-md bg-slate-800 flex items-center justify-center font-mono font-bold text-slate-300">
              {currentUser?.avatarInitials || "BH"}
            </div>
            <div>
              <p className="font-bold text-slate-200 line-clamp-1">
                {isAr ? currentUser?.nameAr : currentUser?.nameEn}
              </p>
              <p className="text-slate-500 uppercase font-mono tracking-tight text-[8px]">
                {currentUser?.role}
              </p>
            </div>
          </div>
          <div className="border-t border-slate-800/80 pt-1.5 text-slate-400 space-y-0.5" dir={isAr ? "rtl" : "ltr"}>
            <div>
              <strong>{isAr ? "القسم:" : "Dept:"}</strong> {currentUser?.department}
            </div>
            {currentUser?.supervisorId && (
              <div>
                <strong>{isAr ? "المشرف المباشر:" : "Supervisor:"}</strong> {currentUser.supervisorId}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Messaging Canvas */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-y-auto">
        {activeSubTab === 'chat' && (
          <ChatView 
            currentUser={currentUser} 
            systemUsers={systemUsers} 
            language={language} 
          />
        )}
        
        {activeSubTab === 'swap' && (
          <SwapRequestView 
            currentUser={currentUser}
            language={language}
            rosterWishes={rosterWishes}
            setRosterWishes={setRosterWishes}
            rosterList={rosterList}
            setRosterList={setRosterList}
            addSystemLog={addSystemLog}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}
        
        {activeSubTab === 'vacation' && (
          <VacationRequestView 
            currentUser={currentUser}
            language={language}
            rosterWishes={rosterWishes}
            setRosterWishes={setRosterWishes}
            rosterList={rosterList}
            setRosterList={setRosterList}
            addSystemLog={addSystemLog}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}
      </div>
    </div>
  );
}

function ChatView({ 
  currentUser, 
  systemUsers, 
  language 
}: { 
  currentUser: any; 
  systemUsers: AppUser[]; 
  language: 'ar' | 'en';
}) {
  const isAr = language === 'ar';
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageType, setMessageType] = useState<'department' | 'supervisor' | 'broadcast'>('department');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Checks if the current user has administrative/supervisory permissions
  const isSupervisorOrAdmin = ['admin', 'head_nurse', 'quality', 'president', 'it'].includes(currentUser?.role || '');

  // Subscribe to real-time messages
  useEffect(() => {
    const q = collection(db, 'messages');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      // Sort client-side by timestamp to prevent index errors
      msgs.sort((a, b) => {
        const t1 = a.timestamp?.seconds || 0;
        const t2 = b.timestamp?.seconds || 0;
        return t1 - t2;
      });
      setMessages(msgs);
    }, (error) => {
      console.error("Firestore Subscribe Error:", error);
    });
    return unsubscribe;
  }, []);

  // Recipient User List Filtering logic
  const getFilteredRecipientUsers = (): AppUser[] => {
    if (messageType === 'department') {
      // Show only colleagues in the same department (excluding self)
      return systemUsers.filter(u => u.department === currentUser?.department && u.id !== currentUser?.id);
    }
    if (messageType === 'supervisor') {
      if (isSupervisorOrAdmin) {
        // As a supervisor, show only my immediate subordinates reporting to me
        return systemUsers.filter(u => u.supervisorId === currentUser?.id && u.id !== currentUser?.id);
      } else {
        // As an employee, show my direct supervisor
        return systemUsers.filter(u => u.id === currentUser?.supervisorId);
      }
    }
    return [];
  };

  const filteredUsers = getFilteredRecipientUsers();

  // Handle auto-selection of direct supervisor when selecting 'supervisor'
  useEffect(() => {
    if (messageType === 'supervisor' && !isSupervisorOrAdmin && currentUser?.supervisorId) {
      setSelectedRecipientId(currentUser.supervisorId);
    } else {
      setSelectedRecipientId('');
    }
  }, [messageType, currentUser, isSupervisorOrAdmin]);

  // Handle functional messaging send logic with data binding constraints
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    let targetRole = "";
    let targetDept = "";
    let targetSupervisor = "";
    let targetId = "";

    // Resolve details of chosen target recipient
    if (messageType === 'department') {
      targetDept = currentUser?.department || "";
      if (selectedRecipientId) {
        const trg = systemUsers.find(u => u.id === selectedRecipientId);
        if (trg) {
          targetRole = trg.role;
          targetDept = trg.department;
          targetSupervisor = trg.supervisorId || "";
          targetId = trg.id;
        }
      }
    } else if (messageType === 'supervisor') {
      if (isSupervisorOrAdmin) {
        // Supervisor messaging a sub-co-worker
        const trg = systemUsers.find(u => u.id === selectedRecipientId);
        if (trg) {
          targetRole = trg.role;
          targetDept = trg.department;
          targetSupervisor = trg.supervisorId || "";
          targetId = trg.id;
        }
      } else {
        // Subordinate messaging supervisor
        const supervisor = systemUsers.find(u => u.id === currentUser?.supervisorId);
        if (supervisor) {
          targetRole = supervisor.role;
          targetDept = supervisor.department;
          targetSupervisor = supervisor.supervisorId || "";
          targetId = supervisor.id;
        }
      }
    }

    const senderDept = currentUser?.department || "";
    const senderId = currentUser?.id || "";

    // Rigorous logical authorization gates requested by the user:
    const isSendingToMySupervisor = (targetId && targetId === currentUser?.supervisorId);
    const isSendingToMySubordinate = (targetSupervisor && targetSupervisor === senderId);

    let canSend = false;

    if (messageType === 'broadcast') {
      // Broadcast restricted strictly to management/admin roles
      canSend = isSupervisorOrAdmin;
    } else if (messageType === 'department' && !selectedRecipientId) {
      // General department message is always allowed for anyone inside the department
      canSend = true;
    } else {
      canSend = (
        targetRole === 'admin' || 
        targetRole === 'president' ||
        targetDept === senderDept || 
        isSendingToMySupervisor || 
        isSendingToMySubordinate
      );
    }

    if (!canSend) {
      const errMsg = isAr 
        ? "⚠️ تم حظر الإرسال: لا تملك الصلاحية للتواصل مع الموظف المختار بناءً على هيكلية الأقسام الإدارية الرسمية لبهية."
        : "⚠️ Transmission Blocked: You do not have the clearance to message the selected recipient based on clinical department-supervisor binding regulations.";
      setErrorMsg(errMsg);
      return;
    }

    try {
      setErrorMsg('');
      await addDoc(collection(db, 'messages'), {
        senderId: currentUser?.id || 'anonymous',
        senderNameAr: currentUser?.nameAr || 'مستخدم مجهول',
        senderNameEn: currentUser?.nameEn || 'Anonymous User',
        senderRole: currentUser?.role || 'staff',
        senderDept: currentUser?.department || 'Unassigned',
        senderAvatar: currentUser?.avatarInitials || 'BH',
        content: newMessage,
        type: messageType,
        deptId: messageType === 'department' ? currentUser?.department : null,
        recipientId: messageType === 'supervisor' 
          ? (isSupervisorOrAdmin ? selectedRecipientId : currentUser?.supervisorId)
          : (messageType === 'department' ? (selectedRecipientId || null) : null),
        timestamp: serverTimestamp(),
      });

      setNewMessage('');
    } catch (err: any) {
      console.error("Error sending message to Firestore: ", err);
      setErrorMsg(isAr ? "❌ فشل حفظ وإرسال الرسالة إلى قاعدة بيانات بهية." : "❌ Failed to sync and save message to the Baheya database.");
    }
  };

  // Secure client-side localized message viewing filters:
  const visibleMessages = messages.filter(msg => {
    // 1. Broadcast messages are accessible globally to everyone
    if (msg.type === 'broadcast') return true;

    // 2. Departmental messages matching user department
    if (msg.type === 'department') {
      if (msg.deptId === currentUser?.department) {
        // If a specific department user was chosen as target, restrict viewing to they and the sender
        if (msg.recipientId) {
          return msg.recipientId === currentUser?.id || msg.senderId === currentUser?.id;
        }
        return true;
      }
      return false;
    }

    // 3. Supervisor private messages: only accessible to sender and direct recipient
    if (msg.type === 'supervisor') {
      return msg.senderId === currentUser?.id || msg.recipientId === currentUser?.id;
    }

    // Fallback security check
    return msg.senderId === currentUser?.id;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden p-4">
      {/* Target Routing Dropdown & Filtering Canvas */}
      <div className={`p-4 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-4 space-y-3 shrink-0 ${isAr ? 'text-right' : 'text-left'}`}>
        <div className={`flex flex-col md:flex-row gap-3 ${isAr ? 'md:flex-row-reverse' : ''}`}>
          {/* Dropdown for message type selection */}
          <div className="flex-1">
            <label className="block text-[10px] font-bold text-slate-400 mb-1">
              {isAr ? "خط القناة / نوع المراسلة:" : "Department / Channel Filter:"}
            </label>
            <select
              value={messageType}
              onChange={(e) => {
                setMessageType(e.target.value as any);
                setErrorMsg('');
              }}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 font-bold focus:outline-none focus:ring-1 focus:ring-pink-500"
            >
              <option value="department">
                🏢 {isAr ? "رسالة للقسم (للزملاء بنفس فرعك)" : "Departmental (Colleagues in Unit)"}
              </option>
              <option value="supervisor">
                🛡️ {isAr ? "رسالة للمشرف / المدير المسؤول" : "Supervisor-Subordinate Direct"}
              </option>
              {isSupervisorOrAdmin && (
                <option value="broadcast">
                  📢 {isAr ? "إعلان عام (للإدارة فقط)" : "Global Broadcast (Admin/Management)"}
                </option>
              )}
            </select>
          </div>

          {/* Recipients dropdown list after filter */}
          {messageType !== 'broadcast' && (
            <div className="flex-1">
              <label className="block text-[10px] font-bold text-slate-400 mb-1">
                {messageType === 'department'
                  ? (isAr ? "حدد موظفاً زميلاً بالقسم (أو اترك للكل):" : "Select Colleague (or leave empty for whole dept):")
                  : (isAr ? "المستلم (المشرف أو المرؤوس):" : "Linked Supervisor / Subordinate:")
                }
              </label>
              
              {messageType === 'supervisor' && !isSupervisorOrAdmin ? (
                // Non-supervisor regular nurse always messages their defined supervisorId
                <div className="bg-slate-900 border border-slate-750 text-emerald-400 text-xs font-bold rounded-lg px-3 py-2">
                  👤 {isAr ? "المشرف المباشر المحدد تلقائياً لملفك" : "Your direct Emergency Head Nurse/Admin"}
                </div>
              ) : (
                <select
                  value={selectedRecipientId}
                  onChange={(e) => setSelectedRecipientId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500"
                >
                  <option value="">
                    {messageType === 'department' 
                      ? (isAr ? "👥 إرسال للقسم بأكمله" : "👥 Broadcast to whole Department")
                      : (isAr ? "🔍 اختر مستخدماً..." : "🔍 Select coworker...")
                    }
                  </option>
                  {filteredUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {isAr ? u.nameAr : u.nameEn} ({u.role.toUpperCase()} - {u.department})
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}
        </div>

        {/* Informative help note */}
        <div className={`p-2 bg-slate-900/30 rounded border border-dashed border-slate-800 text-[10px] text-slate-400 leading-relaxed flex items-center gap-1.5 ${isAr ? 'flex-row-reverse text-right' : ''}`}>
          <HelpCircle className="h-3.5 w-3.5 hover:text-pink-400 text-slate-400 shrink-0" />
          <span>
            {messageType === 'department' && (
              isAr 
                ? `سيتم حفظ وتوجيه رسالتك إلى زملاء قسمك الحالي [${currentUser?.department}].`
                : `Your message will be sent inside current unit [${currentUser?.department}].`
            )}
            {messageType === 'supervisor' && (
              isAr
                ? `تواصل مباشر وخاص مرسل ومعتمد إدارياً باتجاه خط المشرفين لملفك الشخصي.`
                : `Synchronized message flow secure inside direct supervisor chain.`
            )}
            {messageType === 'broadcast' && (
              isAr
                ? `رسالة عامة ستظهر في شاشات الإعلانات وجداول المراسلات لكافة مستخدمي مستشفى بهية.`
                : `General news message broadcasts instantly to all active Baheya Hospital accounts.`
            )}
          </span>
        </div>
      </div>

      {/* Error / Feedback indicator */}
      {errorMsg && (
        <div className={`p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs text-red-300 font-bold mb-3 ${isAr ? 'text-right' : 'text-left'}`}>
          {errorMsg}
        </div>
      )}

      {/* Messages Feed View */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 bg-slate-950/30 border border-slate-800/60 p-4 rounded-xl flex flex-col scroll-smooth">
        {visibleMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 py-10">
            <MessageSquare className="h-8 w-8 text-slate-700 mb-2 animate-pulse" />
            <p className="text-[11px] font-bold">
              {isAr ? "لا توجد رسائل قيد العرض مطابقة لخطوط التواصل النشطة." : "No communication feed logs found for this clinical line."}
            </p>
            <p className="text-[9px] text-slate-600 mt-0.5">
              {isAr ? "قم باختيار القناة وتوجيه رسالتك الآمنة من الحقل أدناه." : "Change filters or send an authenticated message below."}
            </p>
          </div>
        ) : (
          visibleMessages.map((msg) => {
            const isSelf = msg.senderId === currentUser?.id;
            
            // Channel label badging based on styles
            let typeBadge = "";
            let typeBadgeClass = "";
            if (msg.type === 'broadcast') {
              typeBadge = isAr ? "إعلان عام" : "BROADCAST";
              typeBadgeClass = "bg-violet-950 text-violet-300 border-violet-800";
            } else if (msg.type === 'supervisor') {
              typeBadge = isAr ? "دعم إداري" : "DIRECT / SV";
              typeBadgeClass = "bg-emerald-950 text-emerald-300 border-emerald-900";
            } else {
              typeBadge = isAr ? "تواصل داخلي" : "DEPARTMENTAL";
              typeBadgeClass = "bg-cyan-950 text-cyan-300 border-cyan-800";
            }

            return (
              <div 
                key={msg.id} 
                className={`flex flex-col max-w-[85%] rounded-2xl p-3 border shadow-sm transition-all text-xs ${
                  isSelf 
                    ? 'self-end bg-gradient-to-tr from-pink-700/10 to-fuchsia-700/15 border-pink-500/30 text-right' 
                    : 'self-start bg-slate-800/40 border-slate-755 text-left'
                }`}
              >
                {/* Meta details */}
                <div className={`flex flex-wrap items-center gap-1.5 mb-1.5 text-[9px] text-slate-400 font-bold ${isSelf ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                  <span className="text-slate-100 font-black">
                    {isAr ? msg.senderNameAr : msg.senderNameEn}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className="text-pink-400 uppercase tracking-tight">
                    {msg.senderDept}
                  </span>
                  <span className="text-slate-500">|</span>
                  <span className={`px-1.5 py-0.5 rounded border text-[8px] font-semibold tracking-wider ${typeBadgeClass}`}>
                    {typeBadge}
                  </span>
                </div>

                {/* Content text */}
                <p className="text-slate-200 leading-normal break-words whitespace-pre-wrap font-sans text-xs">
                  {msg.content}
                </p>

                {/* Timestamp */}
                <div className={`flex items-center gap-1 mt-1.5 text-[8px] text-slate-500 ${isSelf ? 'justify-start' : 'justify-end flex-row-reverse'}`}>
                  <Clock className="h-2.5 w-2.5 text-slate-600" />
                  <span>
                    {msg.timestamp?.seconds 
                      ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                      : (isAr ? "الآن" : "Just now")
                    }
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Box Input and Send control button */}
      <div className="flex gap-2.5 shrink-0">
        <input 
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            if (errorMsg) setErrorMsg('');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage();
            }
          }}
          className={`flex-1 bg-slate-950 hover:bg-slate-900 focus:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all ${
            isAr ? 'text-right' : 'text-left'
          }`}
          placeholder={isAr ? "اكتب محتوى رسالتك هنا..." : "Type your clinical message..."}
        />
        <button 
          onClick={sendMessage} 
          className="bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white font-bold p-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center shrink-0 min-w-[50px]"
          title={isAr ? "إرسال الرسالة" : "Send securely"}
        >
          <Send size={15} />
        </button>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUB-TAB VIEW: SHIFT SWAPPING LOGS & REQUESTS (طلبات ومبادلات الوردية)
// ----------------------------------------------------
function SwapRequestView({
  currentUser,
  language,
  rosterWishes = [],
  setRosterWishes,
  rosterList = [],
  setRosterList,
  addSystemLog,
  notifications = [],
  setNotifications
}: {
  currentUser: any;
  language: 'ar' | 'en';
  rosterWishes: any[];
  setRosterWishes?: (wishes: any[]) => void;
  rosterList: any[];
  setRosterList?: (rosters: any[]) => void;
  addSystemLog?: (text: string, type: "info" | "warning" | "success" | "error") => void;
  notifications?: any[];
  setNotifications?: (notifs: any[]) => void;
}) {
  const isAr = language === 'ar';
  
  // Local form states
  const [selectedDay, setSelectedDay] = useState("16");
  const [selectedShift, setSelectedShift] = useState("M");
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isStaff = currentUser?.role === 'staff' || currentUser?.role === 'Staff';
  const isSupervisorOrAdmin = ['admin', 'head_nurse', 'quality', 'president', 'it'].includes(currentUser?.role || '');

  // Filter swap requests (exclude vacations AL)
  const swapWishes = rosterWishes.filter(w => w.requestedShift !== 'AL');

  const handleCreateSwap = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert(isAr ? "من فضلك اكتب سبب للطلب" : "Please state the reason for this swap.");
      return;
    }

    const newWish = {
      id: `wish-${Date.now()}`,
      employeeId: currentUser?.id,
      employeeNameAr: currentUser?.nameAr || "مستخدم تمريض",
      employeeNameEn: currentUser?.nameEn || "Nursing Staff",
      departmentName: currentUser?.department || "EMERGENCY UNIT",
      dayKey: selectedDay,
      requestedShift: selectedShift,
      reasonAr: `[مبادلة وردية] ${reason}`,
      reasonEn: `[Shift Swap Request] ${reason}`,
      status: "pending",
      submittedAt: new Date().toISOString()
    };

    if (setRosterWishes) {
      const updated = [newWish, ...rosterWishes];
      setRosterWishes(updated);
      localStorage.setItem("baheya_roster_wishes", JSON.stringify(updated));
    }

    if (setNotifications) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        messageAr: `⚙️ طلب تواصل ومبادلة وردية: قامت الممرضة "${currentUser?.nameAr}" برفع طلب تبديل وردية ليوم ${selectedDay} لشفت "${selectedShift}".`,
        messageEn: `⚙️ Shift Swap Request: Nurse "${currentUser?.nameEn}" requested a shift exchange for Day ${selectedDay} to shift "${selectedShift}".`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "wish",
        targetSection: "roster"
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem("baheya_notifications", JSON.stringify(updatedNotifs));
    }

    if (addSystemLog) {
      addSystemLog(`Submitted direct swap request for day ${selectedDay} shift ${selectedShift}`, "info");
    }

    setReason("");
    setSuccessMsg(isAr ? "✅ تم إرسال طلب التبديل بنجاح إلى المشرف وسجل الرغبات!" : "✅ Swap request successfully logged inside supervisor channel!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleApprove = (wish: any) => {
    if (!setRosterWishes || !setRosterList) return;

    // Approve wish in list
    const updatedWishes = rosterWishes.map(w => w.id === wish.id ? { ...w, status: "approved" } : w);
    setRosterWishes(updatedWishes);
    localStorage.setItem("baheya_roster_wishes", JSON.stringify(updatedWishes));

    // Update roster row
    const nextRosterList = rosterList.map((rost) => {
      const hasEmployee = rost.rows.some((row: any) => 
        row.employeeId === wish.employeeId || 
        row.employeeCode === wish.employeeId ||
        row.employeeNameEn.toLowerCase().trim() === wish.employeeNameEn.toLowerCase().trim()
      );
      if (hasEmployee) {
        return {
          ...rost,
          rows: rost.rows.map((row: any) => {
            if (
              row.employeeId === wish.employeeId || 
              row.employeeCode === wish.employeeId ||
              row.employeeNameEn.toLowerCase().trim() === wish.employeeNameEn.toLowerCase().trim()
            ) {
              return {
                ...row,
                shifts: {
                  ...row.shifts,
                  [wish.dayKey]: wish.requestedShift
                }
              };
            }
            return row;
          })
        };
      }
      return rost;
    });

    setRosterList(nextRosterList);
    localStorage.setItem("baheya_department_rosters", JSON.stringify(nextRosterList));

    if (setNotifications) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        messageAr: `✓ تم اعتماد طلب التبديل: وافقت الإدارة على طلب مبادلة وردية الممرضة "${wish.employeeNameAr}" ليوم ${wish.dayKey}. تم تحديث الروستر بنجاح!`,
        messageEn: `✓ Swap Request Approved: Supervisor approved shift swap for "${wish.employeeNameEn}" on Day ${wish.dayKey}. Roster auto-updated!`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "wish",
        targetSection: "roster"
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem("baheya_notifications", JSON.stringify(updatedNotifs));
    }

    if (addSystemLog) {
      addSystemLog(`Approved shift exchange for ${wish.employeeNameEn} on day ${wish.dayKey}`, "success");
    }
    alert(isAr ? "تم اعتماد وقبول مبادلة الوردية بنجاح بنظام بهية" : "Shift Swap request has been approved and injected into roster.");
  };

  const handleReject = (wish: any) => {
    if (!setRosterWishes) return;

    const updated = rosterWishes.map(w => w.id === wish.id ? { ...w, status: "rejected" } : w);
    setRosterWishes(updated);
    localStorage.setItem("baheya_roster_wishes", JSON.stringify(updated));

    if (setNotifications) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        messageAr: `✗ تم رفض طلب التبديل: رفضت الإدارة طلب مبادلة وردية الممرضة "${wish.employeeNameAr}" ليوم ${wish.dayKey}.`,
        messageEn: `✗ Swap Request Rejected: Supervisor declined shift swap for "${wish.employeeNameEn}" on Day ${wish.dayKey}.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "wish",
        targetSection: "roster"
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem("baheya_notifications", JSON.stringify(updatedNotifs));
    }

    if (addSystemLog) {
      addSystemLog(`Rejected shift exchange request of ${wish.employeeNameEn}`, "warning");
    }
    alert(isAr ? "تم رفض الطلب بنجاح وإرسال إشعار للموظف." : "Request marked as rejected.");
  };

  return (
    <div className="flex-1 p-6 space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
          <ArrowRightLeft className="h-4.5 w-4.5 text-pink-500 animate-pulse" />
          <span>{isAr ? "إدارة طلبات ومبادلات الشفتات والوردية" : "Shift Exchanges & Swapping Hub"}</span>
        </h3>
        <span className="text-[10px] text-slate-450 font-mono">
          {swapWishes.length} {isAr ? "طلبات مسجلة" : "Requests found"}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Submission form for Staff Nurse */}
        {isStaff && (
          <form onSubmit={handleCreateSwap} className="xl:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
          <h4 className="text-xs font-black text-pink-400 flex items-center gap-1.5">
            <PlusCircle className="h-4 w-4" />
            <span>{isAr ? "تقديم طلب تبديل / نوبتجية جديدة" : "Request Urgent Shift Exchange"}</span>
          </h4>
          
          {successMsg && (
            <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-xs text-emerald-300 font-bold mb-3">
              {successMsg}
            </div>
          )}

          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">{isAr ? "اليوم المستهدف بجدول شهر مايو-يونيو:" : "Roster Target Day:"}</label>
            <select 
              value={selectedDay} 
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono font-medium"
            >
              {ROSTER_DAYS_LIST.map(d => (
                <option key={d} value={d}>Day {d} / يوم {d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">{isAr ? "الوردية أو الشفت المطلوب تثبيته:" : "Requested Duty Period:"}</label>
            <select 
              value={selectedShift} 
              onChange={(e) => setSelectedShift(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 font-black"
            >
              {LOCAL_SHIFTS.filter(s => s.id !== 'AL').map(s => (
                <option key={s.id} value={s.id}>{isAr ? s.nameAr : s.nameEn}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] text-slate-400 font-bold mb-1">{isAr ? "مبرر وسبب التعديل أو التبديل:" : "Detailed Exchange Justification:"}</label>
            <textarea 
              rows={3}
              value={reason} 
              onChange={(e) => setReason(e.target.value)}
              placeholder={isAr ? "مثال: تبديل مع الزميلة فاطمة، لضرورة طبية عائلية..." : "E.g., Swapping with Nurse Fatima due to family checkup..."}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all font-bold"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Send size={13} />
            <span>{isAr ? "إرسال الطلب وإخطار المشرف" : "Transmit Swap Request"}</span>
          </button>
        </form>
        )}

        <div className={isStaff ? "xl:col-span-7 space-y-3" : "xl:col-span-12 space-y-3"}>
          <h4 className="text-xs font-black text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <span>{isAr ? "الطلبات الحالية لتبديل وضبط الورديات بالقسم" : "Current Active Shift Swapping Inbox"}</span>
          </h4>

          {swapWishes.length === 0 ? (
            <div className="bg-slate-950/40 border border-slate-800 p-8 rounded-2xl text-center text-slate-500">
              <Calendar className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-[11px] font-bold">{isAr ? "لا توجد طلبات ومبادلات شفتات نشطة حالياً." : "No active swapping or exchange logs indexed."}</p>
            </div>
          ) : (
            swapWishes.map((wish) => {
              const shiftStyle = LOCAL_SHIFTS.find(s => s.id === wish.requestedShift);
              const isPending = wish.status === 'pending';
              const isApproved = wish.status === 'approved';
              const isRejected = wish.status === 'rejected';

              return (
                <div key={wish.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 space-y-3 relative hover:border-slate-800 transition">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-pink-400" />
                        <span>{isAr ? wish.employeeNameAr : wish.employeeNameEn}</span>
                      </h5>
                      <span className="text-[9px] text-slate-450 block mt-0.5">
                        {isAr ? `القسم: ${wish.departmentName}` : `Unit: ${wish.departmentName}`}
                      </span>
                    </div>

                    <div className="text-left font-mono text-[9px] text-slate-400">
                      {wish.submittedAt ? new Date(wish.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ""}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-lg flex flex-wrap gap-4 items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 ml-1.5">{isAr ? "اليوم:" : "Day:"}</span>
                      <strong className="text-pink-400 font-mono text-xs">{wish.dayKey} مايو-يونيو</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 ml-1.5">{isAr ? "الطلب:" : "Period:"}</span>
                      <strong className="text-emerald-400">{shiftStyle ? (isAr ? shiftStyle.nameAr : shiftStyle.nameEn) : wish.requestedShift}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 ml-1.5">{isAr ? "حالة القرار:" : "Status:"}</span>
                      <strong className={`px-2 py-0.5 rounded text-[10px] ${
                        isApproved ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                        isRejected ? "bg-red-950/80 text-red-300 border border-red-900" :
                        "bg-yellow-950 text-yellow-300 border border-yellow-800"
                      }`}>
                        {isApproved ? (isAr ? "مقبول ومعتمد" : "Approved") :
                         isRejected ? (isAr ? "مرفوض" : "Rejected") :
                         (isAr ? "قيد الدراسة إدارياً" : "Pending Approval")}
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-350 bg-slate-900/40 p-2 border border-slate-850 border-dashed rounded font-mono leading-relaxed text-right">
                    <span className="font-bold text-pink-300 ml-1">{isAr ? "السبب المذكور:" : "Reason:"}</span>
                    {wish.reasonAr || wish.reasonEn}
                  </p>

                  {/* Actions for head nurses & supervisors */}
                  {isPending && isSupervisorOrAdmin && (
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => handleReject(wish)}
                        className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-900/60 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        <span>{isAr ? "رفض الطلب" : "Reject"}</span>
                      </button>

                      <button
                        onClick={() => handleApprove(wish)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Check className="h-3 w-3" />
                        <span>{isAr ? "اعتماد وضبط الروستر" : "Approve & Apply"}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// SUB-TAB VIEW: LEAVES & VACATION APPROVALS (إجازات وموافقة المشرف)
// ----------------------------------------------------
function VacationRequestView({
  currentUser,
  language,
  rosterWishes = [],
  setRosterWishes,
  rosterList = [],
  setRosterList,
  addSystemLog,
  notifications = [],
  setNotifications
}: {
  currentUser: any;
  language: 'ar' | 'en';
  rosterWishes: any[];
  setRosterWishes?: (wishes: any[]) => void;
  rosterList: any[];
  setRosterList?: (rosters: any[]) => void;
  addSystemLog?: (text: string, type: "info" | "warning" | "success" | "error") => void;
  notifications?: any[];
  setNotifications?: (notifs: any[]) => void;
}) {
  const isAr = language === 'ar';
  
  // Local form states
  const [selectedDay, setSelectedDay] = useState("16");
  const [vacationType, setVacationType] = useState("AL"); // AL or OFF (Extra Day)
  const [reason, setReason] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const isStaff = currentUser?.role === 'staff' || currentUser?.role === 'Staff';
  const isSupervisorOrAdmin = ['admin', 'head_nurse', 'quality', 'president', 'it'].includes(currentUser?.role || '');

  // Filter vacations (where requestedShift is AL or is related to vacation)
  const vacationWishes = rosterWishes.filter(w => w.requestedShift === 'AL' || w.reasonAr.includes("إجازة") || w.reasonEn.toLowerCase().includes("vacation") || w.reasonEn.toLowerCase().includes("leave") || w.requestedShift === 'OFF' && w.reasonAr.includes("إجازة"));

  const handleCreateVacation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert(isAr ? "من فضلك اكتب سبب أو نوع الإجازة" : "Please state the reason for this leave request.");
      return;
    }

    const newWish = {
      id: `wish-${Date.now()}`,
      employeeId: currentUser?.id,
      employeeNameAr: currentUser?.nameAr || "مستخدم تمريض",
      employeeNameEn: currentUser?.nameEn || "Nursing Staff",
      departmentName: currentUser?.department || "EMERGENCY UNIT",
      dayKey: selectedDay,
      requestedShift: vacationType, // AL (Annual Leave)
      reasonAr: `[طلب إجازة سنوية/عارضة] ${reason}`,
      reasonEn: `[Vacation Request: ${vacationType}] ${reason}`,
      status: "pending",
      submittedAt: new Date().toISOString()
    };

    if (setRosterWishes) {
      const updated = [newWish, ...rosterWishes];
      setRosterWishes(updated);
      localStorage.setItem("baheya_roster_wishes", JSON.stringify(updated));
    }

    if (setNotifications) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        messageAr: `🌴 طلب إجازة جديد: قامت الممرضة "${currentUser?.nameAr}" بطلب إجازة/عطلة ليوم ${selectedDay} (النوع: ${vacationType}).`,
        messageEn: `🌴 New Leave Application: Nurse "${currentUser?.nameEn}" requested a vacation for Day ${selectedDay} (Type: ${vacationType}).`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "wish",
        targetSection: "roster"
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem("baheya_notifications", JSON.stringify(updatedNotifs));
    }

    if (addSystemLog) {
      addSystemLog(`Submitted leave/vacation request for day ${selectedDay}`, "info");
    }

    setReason("");
    setSuccessMsg(isAr ? "✅ تم تسجيل طلب الإجازة بنجاح للدراسة والاعتماد!" : "✅ Leave application submitted successfully!");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  const handleApprove = (wish: any) => {
    if (!setRosterWishes || !setRosterList) return;

    // Approve wish in list
    const updatedWishes = rosterWishes.map(w => w.id === wish.id ? { ...w, status: "approved" } : w);
    setRosterWishes(updatedWishes);
    localStorage.setItem("baheya_roster_wishes", JSON.stringify(updatedWishes));

    // Update roster row
    const nextRosterList = rosterList.map((rost) => {
      const hasEmployee = rost.rows.some((row: any) => 
        row.employeeId === wish.employeeId || 
        row.employeeCode === wish.employeeId ||
        row.employeeNameEn.toLowerCase().trim() === wish.employeeNameEn.toLowerCase().trim()
      );
      if (hasEmployee) {
        return {
          ...rost,
          rows: rost.rows.map((row: any) => {
            if (
              row.employeeId === wish.employeeId || 
              row.employeeCode === wish.employeeId ||
              row.employeeNameEn.toLowerCase().trim() === wish.employeeNameEn.toLowerCase().trim()
            ) {
              return {
                ...row,
                shifts: {
                  ...row.shifts,
                  [wish.dayKey]: wish.requestedShift
                }
              };
            }
            return row;
          })
        };
      }
      return rost;
    });

    setRosterList(nextRosterList);
    localStorage.setItem("baheya_department_rosters", JSON.stringify(nextRosterList));

    if (setNotifications) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        messageAr: `✓ تم قبول الإجازة: اعتمد المشرف إجازة الزميلة "${wish.employeeNameAr}" ليوم ${wish.dayKey}. تم تفريغ الخانة بالروستر.`,
        messageEn: `✓ Leave Approved: Supervisor authorized vacation for "${wish.employeeNameEn}" on Day ${wish.dayKey}. Roster updated!`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "wish",
        targetSection: "roster"
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem("baheya_notifications", JSON.stringify(updatedNotifs));
    }

    if (addSystemLog) {
      addSystemLog(`Approved leave/vacation of ${wish.employeeNameEn} on day ${wish.dayKey}`, "success");
    }
    alert(isAr ? "تم اعتماد وقبول الإجازة بنجاح بنظام بهية" : "Leave request approved and applied automatically onto the live calendar.");
  };

  const handleReject = (wish: any) => {
    if (!setRosterWishes) return;

    const updated = rosterWishes.map(w => w.id === wish.id ? { ...w, status: "rejected" } : w);
    setRosterWishes(updated);
    localStorage.setItem("baheya_roster_wishes", JSON.stringify(updated));

    if (setNotifications) {
      const newNotification = {
        id: `notif-${Date.now()}`,
        messageAr: `✗ تم رفض الإجازة: رفض المشرف طلب إجازة الزميلة "${wish.employeeNameAr}" ليوم ${wish.dayKey}.`,
        messageEn: `✗ Leave Request Rejected: Supervisor declined holiday request for "${wish.employeeNameEn}" on Day ${wish.dayKey}.`,
        timestamp: new Date().toISOString(),
        read: false,
        type: "wish",
        targetSection: "roster"
      };
      const updatedNotifs = [newNotification, ...notifications];
      setNotifications(updatedNotifs);
      localStorage.setItem("baheya_notifications", JSON.stringify(updatedNotifs));
    }

    if (addSystemLog) {
      addSystemLog(`Rejected holiday wish of ${wish.employeeNameEn}`, "warning");
    }
    alert(isAr ? "تم رفض الطلب بنجاح وإرسال إشعار للموظف." : "Leave request marked as rejected.");
  };

  return (
    <div className="flex-1 p-6 space-y-6 text-right" dir="rtl">
      <div className="flex justify-between items-center pb-4 border-b border-slate-800">
        <h3 className="text-sm font-black text-slate-100 flex items-center gap-2">
          <BellRing className="h-4.5 w-4.5 text-fuchsia-400 animate-bounce" />
          <span>{isAr ? "سجل طلبات الإجازات السنوية والموافقة عليها" : "Leave Tracker & Supervisor Holiday Approvals"}</span>
        </h3>
        <span className="text-[10px] text-slate-450 font-mono">
          {vacationWishes.length} {isAr ? "إجازات مدونة" : "Leave Logs"}
        </span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Submit vacation */}
        {isStaff && (
          <form onSubmit={handleCreateVacation} className="xl:col-span-5 bg-slate-950 p-5 rounded-2xl border border-slate-800/80 space-y-4">
            <h4 className="text-xs font-black text-fuchsia-400 flex items-center gap-1.5">
              <PlusCircle className="h-4 w-4" />
              <span>{isAr ? "تقديم طلب إجازة رسمية / عارضة" : "Submit Leave Application"}</span>
            </h4>
            
            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-900/50 rounded-xl text-xs text-emerald-300 font-bold mb-3">
                {successMsg}
              </div>
            )}

            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">{isAr ? "تحديد اليوم المطلوب للإجازة:" : "Holiday Target Day:"}</label>
              <select 
                value={selectedDay} 
                onChange={(e) => setSelectedDay(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 font-mono font-medium"
              >
                {ROSTER_DAYS_LIST.map(d => (
                  <option key={d} value={d}>Day {d} / يوم {d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">{isAr ? "نوع الإجازة المطلوبة:" : "Leave Allocation Type:"}</label>
              <select 
                value={vacationType} 
                onChange={(e) => setVacationType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-pink-500 font-black"
              >
                <option value="AL">{isAr ? "إجازة سنوية (Annual Leave - AL)" : "Annual Leave (AL)"}</option>
                <option value="OFF">{isAr ? "يوم راحة إضافي (Extra OFF Day)" : "Extra Day Off (OFF)"}</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-slate-400 font-bold mb-1">{isAr ? "السبب الطبي / العائلي المفصل للإجازة:" : "Vacation Reason Details:"}</label>
              <textarea 
                rows={3}
                value={reason} 
                onChange={(e) => setReason(e.target.value)}
                placeholder={isAr ? "مثال: مرافقة والدتي للفحص السنوي، ظروف عائلية حرجة..." : "E.g., Medical treatment, family emergency..."}
                className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all font-bold"
              />
            </div>

            <button 
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Send size={13} />
              <span>{isAr ? "تقديم طلب الإجازة للمراجعة الكلية" : "Submit Leave Application"}</span>
            </button>
          </form>
        )}

        {/* RIGHT COLUMN: Vacation List */}
        <div className={isStaff ? "xl:col-span-7 space-y-3" : "xl:col-span-12 space-y-3"}>
          <h4 className="text-xs font-black text-slate-300 mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-400" />
            <span>{isAr ? "سجل طلبات إجازات كوادر التمريض بهية" : "Submited Nursing Staff Holidays Queue"}</span>
          </h4>

          {vacationWishes.length === 0 ? (
            <div className="bg-slate-950/40 border border-slate-800 p-8 rounded-2xl text-center text-slate-500">
              <Calendar className="h-8 w-8 text-slate-700 mx-auto mb-2" />
              <p className="text-[11px] font-bold">{isAr ? "لا توجد طلبات إجازة أو عارضة مسجلة حالياً." : "No submitted holidays or vacations found."}</p>
            </div>
          ) : (
            vacationWishes.map((wish) => {
              const isPending = wish.status === 'pending';
              const isApproved = wish.status === 'approved';
              const isRejected = wish.status === 'rejected';

              return (
                <div key={wish.id} className="bg-slate-950 p-4 rounded-xl border border-slate-850/80 space-y-3 relative hover:border-slate-800 transition">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h5 className="text-xs font-black text-slate-200 flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-fuchsia-400" />
                        <span>{isAr ? wish.employeeNameAr : wish.employeeNameEn}</span>
                      </h5>
                      <span className="text-[9px] text-slate-450 block mt-0.5">
                        {isAr ? `القسم: ${wish.departmentName}` : `Unit: ${wish.departmentName}`}
                      </span>
                    </div>

                    <div className="text-left font-mono text-[9px] text-slate-400">
                      {wish.submittedAt ? new Date(wish.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric' }) : ""}
                    </div>
                  </div>

                  <div className="bg-slate-900 border border-slate-850 p-2.5 rounded-lg flex flex-wrap gap-4 items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400 ml-1.5">{isAr ? "اليوم:" : "Day:"}</span>
                      <strong className="text-fuchsia-450 font-mono text-xs">{wish.dayKey} مايو-يونيو</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 ml-1.5">{isAr ? "النوع والموافقة:" : "Leave type:"}</span>
                      <strong className="text-purple-400">{wish.requestedShift === 'AL' ? (isAr ? "ساري سنوي (AL)" : "Annual Leave") : (isAr ? "يوم راحة (OFF)" : "Day Off")}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 ml-1.5">{isAr ? "الحالة:" : "Status:"}</span>
                      <strong className={`px-2 py-0.5 rounded text-[10px] ${
                        isApproved ? "bg-emerald-950 text-emerald-300 border border-emerald-800" :
                        isRejected ? "bg-red-950/80 text-red-300 border border-red-900" :
                        "bg-yellow-950 text-yellow-300 border border-yellow-800"
                      }`}>
                        {isApproved ? (isAr ? "إجازة معتمدة" : "Authorized Leave") :
                         isRejected ? (isAr ? "إجازة مرفوضة" : "Leave Refused") :
                         (isAr ? "بانتظار موافقة المشرف" : "Awaiting Review")}
                      </strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-350 bg-slate-900/40 p-2 border border-slate-850 border-dashed rounded font-mono leading-relaxed text-right">
                    <span className="font-bold text-fuchsia-300 ml-1">{isAr ? "تفاصيل الداعي للإجازة:" : "Stated Reason:"}</span>
                    {wish.reasonAr || wish.reasonEn}
                  </p>

                  {/* Actions for head nurses & supervisors */}
                  {isPending && isSupervisorOrAdmin && (
                    <div className="flex gap-2 justify-end pt-1">
                      <button
                        onClick={() => handleReject(wish)}
                        className="px-2.5 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-900/60 rounded-xl text-[10px] font-bold transition flex items-center gap-1 cursor-pointer"
                      >
                        <X className="h-3 w-3" />
                        <span>{isAr ? "رفض الإجازة" : "Deny Leave"}</span>
                      </button>

                      <button
                        onClick={() => handleApprove(wish)}
                        className="px-3 py-1.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl text-[10px] font-black transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Check className="h-3 w-3" />
                        <span>{isAr ? "قبول وتنزيل بالروستر" : "Authorize Holiday & Apply"}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
