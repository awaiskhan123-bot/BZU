import React from 'react';
import {
  X,
  PhoneCall,
  Mail,
  MapPin,
  ShieldAlert,
  Clock,
  ExternalLink,
  GraduationCap,
  Building,
  HeartPulse,
  Banknote
} from 'lucide-react';
import { UniversityProfile } from '../types.ts';

interface DirectoryModalProps {
  profile: UniversityProfile | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DirectoryModal: React.FC<DirectoryModalProps> = ({ profile, isOpen, onClose }) => {
  if (!isOpen) return null;

  const contacts = profile?.contactDirectory || {
    admissionsEmail: "admissions@bzu.edu.pk",
    admissionsPhone: "+92 (61) 9210074",
    financialAidEmail: "sfao@bzu.edu.pk",
    financialAidPhone: "+92 (61) 9210092",
    registrarEmail: "registrar@bzu.edu.pk",
    registrarPhone: "+92 (61) 9210072",
    campusSafetyEmergency: "+92 (61) 9210099",
    campusSafetyNonEmergency: "+92 (61) 9210071 Ext 111",
    generalInfoEmail: "info@bzu.edu.pk"
  };

  const offices = [
    {
      name: "BZU Admissions Directorate",
      icon: GraduationCap,
      description: "Undergraduate & Post-Graduate admissions, merit lists, and online challans",
      email: contacts.admissionsEmail,
      phone: contacts.admissionsPhone,
      location: "Incharge Admissions Office, Administration Block, Bosan Road",
      hours: "Mon-Fri: 8:00 AM - 4:00 PM"
    },
    {
      name: "Student Financial Aid Office (SFAO)",
      icon: Banknote,
      description: "HEC Need-Based, PEEF, Mora Zakat, Bait-ul-Mal, and fee concessions",
      email: contacts.financialAidEmail,
      phone: contacts.financialAidPhone,
      location: "1st Floor, Admin Block (Opposite Treasurer Office)",
      hours: "Mon-Fri: 8:30 AM - 3:30 PM"
    },
    {
      name: "Office of the Controller of Examinations",
      icon: Building,
      description: "Semester results, transcripts, degree certificates, and DMC verification",
      email: "controller@bzu.edu.pk",
      phone: "+92 (61) 9210080",
      location: "Examination Branch, Main Campus, Bosan Road",
      hours: "Mon-Fri: 8:00 AM - 3:30 PM"
    },
    {
      name: "BZU Health Centre & Emergency Clinic",
      icon: HeartPulse,
      description: "On-campus doctors, 24/7 ambulances, primary care dispensary",
      email: "health@bzu.edu.pk",
      phone: "+92 (61) 9210099",
      location: "Near Student Teacher Centre (STC), Main Campus",
      hours: "24/7 Emergency & Ambulance Service"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0f2744] text-white flex items-center justify-between border-b border-[#1e3a5f]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-crest font-bold text-base sm:text-lg text-white">
                Official University Contact Directory
              </h3>
              <p className="text-xs text-slate-300">
                {profile?.name || 'Apex Metropolitan University'} • Administrative Support Desks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Notice Banner */}
        <div className="bg-rose-50 border-b border-rose-200/80 px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-xs text-rose-900">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <span className="font-bold">Campus Police & Emergency:</span>
              <span className="ml-1 font-semibold">{contacts.campusSafetyEmergency}</span>
              <span className="hidden sm:inline text-rose-700 ml-2">(Non-Emergency: {contacts.campusSafetyNonEmergency})</span>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-rose-200/60 text-rose-800 px-2 py-0.5 rounded">
            24/7 Active
          </span>
        </div>

        {/* Directory List */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {offices.map((office, idx) => {
              const Icon = office.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-blue-300 transition-all shadow-2xs space-y-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-xs sm:text-sm text-[#0f2744] leading-snug">
                        {office.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {office.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5 border-t border-slate-200/80 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <PhoneCall className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <a href={`tel:${office.phone}`} className="font-medium hover:text-blue-700">
                        {office.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <a href={`mailto:${office.email}`} className="font-medium hover:text-blue-700 truncate">
                        {office.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{office.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{office.hours}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-800">Campus Physical Address: </span>
              <span>{profile?.location || 'Metropolitan Campus, 100 University Boulevard'}</span>
            </div>
            <a
              href={`mailto:${contacts.generalInfoEmail}`}
              className="inline-flex items-center gap-1 text-blue-700 hover:text-blue-900 font-semibold"
            >
              <span>Email Info</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#0f2744] text-white hover:bg-[#1a385c] transition-colors"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
};
