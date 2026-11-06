export interface KnowledgeChunk {
  id: string;
  documentId: string;
  documentTitle: string;
  category: 'admissions' | 'tuition_aid' | 'programs' | 'calendar' | 'exams_grading' | 'campus_life' | 'policies';
  title: string;
  content: string;
  keywords: string[];
}

export interface UniversityDocument {
  id: string;
  title: string;
  category: 'admissions' | 'tuition_aid' | 'programs' | 'calendar' | 'exams_grading' | 'campus_life' | 'policies';
  fileName: string;
  fileType: 'pdf' | 'text' | 'manual';
  uploadedAt: string;
  fileSize?: string;
  isActive: boolean;
  chunkCount: number;
  description: string;
}

export interface UniversityFAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  pinned: boolean;
}

export interface UniversityProfile {
  name: string;
  shortName: string;
  motto: string;
  founded: number;
  currentTerm: string;
  location: string;
  contactDirectory: {
    admissionsEmail: string;
    admissionsPhone: string;
    financialAidEmail: string;
    financialAidPhone: string;
    registrarEmail: string;
    registrarPhone: string;
    campusSafetyEmergency: string;
    campusSafetyNonEmergency: string;
    generalInfoEmail: string;
  };
}

export const defaultUniversityProfile: UniversityProfile = {
  name: "Bahauddin Zakariya University Multan",
  shortName: "BZU Multan",
  motto: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ (Seek Knowledge from Cradle to Grave)",
  founded: 1975,
  currentTerm: "Academic Session 2026-2027",
  location: "Bosan Road, Multan, Punjab 60800, Pakistan",
  contactDirectory: {
    admissionsEmail: "admissions@bzu.edu.pk",
    admissionsPhone: "+92 (61) 9210074",
    financialAidEmail: "sfao@bzu.edu.pk",
    financialAidPhone: "+92 (61) 9210092",
    registrarEmail: "registrar@bzu.edu.pk",
    registrarPhone: "+92 (61) 9210072",
    campusSafetyEmergency: "+92 (61) 9210099",
    campusSafetyNonEmergency: "+92 (61) 9210071 Ext 111",
    generalInfoEmail: "info@bzu.edu.pk"
  }
};

export const defaultDocuments: UniversityDocument[] = [
  {
    id: "doc-bzu-adm-2026",
    title: "Official BZU Undergraduate & Postgraduate Admissions Prospectus 2026-2027",
    category: "admissions",
    fileName: "BZU_Admissions_Prospectus_2026_27.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-20T10:00:00Z",
    fileSize: "2.8 MB",
    isActive: true,
    chunkCount: 5,
    description: "Fall 2026 and Spring 2027 admission schedules, merit calculation formulas, eligibility criteria, test requirements, quota seats, and online challan payment rules."
  },
  {
    id: "doc-bzu-fees-2026",
    title: "BZU Semester Fee Schedule, Morning/Evening Rates & Hostel Dues 2026-2027",
    category: "tuition_aid",
    fileName: "BZU_Fee_Structure_and_Hostel_Dues_2026.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-18T14:30:00Z",
    fileSize: "920 KB",
    isActive: true,
    chunkCount: 4,
    description: "Official PKR fee structure for Morning (Regular) and Evening (Self-Support) programs across Engineering, CS, Pharmacy, Business, Law, plus bus pass and hostel boarding charges."
  },
  {
    id: "doc-bzu-scholarships",
    title: "BZU Financial Aid, HEC Need-Based & PEEF Scholarships Handbook",
    category: "tuition_aid",
    fileName: "BZU_Scholarships_and_Financial_Assistance_Guide.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-15T09:15:00Z",
    fileSize: "1.1 MB",
    isActive: true,
    chunkCount: 3,
    description: "HEC Need-Based Grants, PEEF scholarships, BZU Departmental Merit Scholarships, Pakistan Bait-ul-Mal assistance, and Zakat fee concessions administered by SFAO."
  },
  {
    id: "doc-bzu-calendar-2026",
    title: "Official BZU Academic Calendar (Fall 2026 & Spring 2027)",
    category: "calendar",
    fileName: "BZU_Academic_Calendar_2026_2027.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-10T08:00:00Z",
    fileSize: "510 KB",
    isActive: true,
    chunkCount: 3,
    description: "Semester opening dates, course enrollment deadlines, midterm examination weeks, winter vacations, final exams timetable, and summer break."
  },
  {
    id: "doc-bzu-faculties",
    title: "BZU Colleges, Faculties, Institutes & Degree Programs Catalog",
    category: "programs",
    fileName: "BZU_Faculties_and_Departments_Catalog.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-05T11:00:00Z",
    fileSize: "3.5 MB",
    isActive: true,
    chunkCount: 5,
    description: "UCET Engineering, Department of Computer Science & IT, Institute of Management Sciences (IMS), Gillani Law College, Faculty of Pharmacy, Agriculture, and Veterinary Sciences."
  },
  {
    id: "doc-bzu-regulations",
    title: "BZU Semester Examination Regulations, CGPA & 75% Attendance Policy",
    category: "exams_grading",
    fileName: "BZU_Semester_Regulations_and_Grading_Rules.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-02T16:20:00Z",
    fileSize: "680 KB",
    isActive: true,
    chunkCount: 4,
    description: "4.00 CGPA grading scale, 75% mandatory class attendance rule, academic probation thresholds (below 1.70 CGPA), drop semester, and re-checking procedures."
  },
  {
    id: "doc-bzu-facilities",
    title: "BZU Campus Facilities, Central Library, Green Bus Transport & Hostels",
    category: "campus_life",
    fileName: "BZU_Campus_Facilities_and_Student_Services.pdf",
    fileType: "pdf",
    uploadedAt: "2026-07-01T13:45:00Z",
    fileSize: "1.4 MB",
    isActive: true,
    chunkCount: 4,
    description: "Hazrat Bahauddin Zakariya Central Library, 65+ student bus routes throughout Multan region, on-campus student halls of residence, health centre, and sports complex."
  }
];

export const defaultKnowledgeChunks: KnowledgeChunk[] = [
  // --- BZU ADMISSIONS CHUNKS ---
  {
    id: "chk-bzu-adm-01",
    documentId: "doc-bzu-adm-2026",
    documentTitle: "Official BZU Undergraduate & Postgraduate Admissions Prospectus 2026-2027",
    category: "admissions",
    title: "BZU Fall 2026 Admission Deadlines & Merit Lists Schedule",
    content: `Bahauddin Zakariya University Multan (BZU) Fall 2026 Admissions Schedule:
- Online Applications Open: July 15, 2026.
- Last Date for Online Form Submission: August 25, 2026 (5:00 PM).
- Departmental Entry Tests (Engineering, Pharmacy, Art & Design, M.Phil): August 28 - August 30, 2026.
- Display of 1st Merit List: September 2, 2026 (Fee due date: September 5, 2026).
- Display of 2nd Merit List: September 7, 2026 (Fee due date: September 9, 2026).
- Display of 3rd Merit List: September 12, 2026 (Fee due date: September 15, 2026).
- Display of 4th / Final Merit List: September 17, 2026.
- Commencement of Classes: Monday, September 21, 2026.
Applications must be submitted online through the BZU Admissions Portal (apply.bzu.edu.pk). Candidates must deposit the non-refundable processing fee of Rs. 1,500 using the system-generated bank challan at any designated branch of Habib Bank Limited (HBL), United Bank Limited (UBL), or National Bank of Pakistan (NBP).`,
    keywords: ["admissions", "deadline", "fall 2026", "merit list", "apply", "bzu multan", "first merit list", "last date", "challan"]
  },
  {
    id: "chk-bzu-adm-02",
    documentId: "doc-bzu-adm-2026",
    documentTitle: "Official BZU Undergraduate & Postgraduate Admissions Prospectus 2026-2027",
    category: "admissions",
    title: "Eligibility Criteria & Merit Calculation Formula",
    content: `BZU Undergraduate Admission Eligibility & Merit Formulas for 2026-2027:
1. Faculty of Science, Arts & Social Sciences (BS 4-Year Programs):
   - Formula: 30% Matriculation marks + 70% Intermediate (F.Sc. / FA / ICS / I.Com) marks. Minimum 50% aggregate marks required.
2. Department of Computer Science & Information Technology (BS CS, BS SE, BS IT):
   - Eligibility: Minimum 50% marks in Intermediate with Mathematics (F.Sc. Pre-Engineering, ICS with Math, or F.Sc. Pre-Medical with additional math deficiency courses as per HEC).
3. University College of Engineering & Technology (UCET - Civil, Electrical, Mechanical, Computer Systems, Chemical):
   - Eligibility: Minimum 60% marks in F.Sc. Pre-Engineering / DAE.
   - Merit Formula: 10% Matric + 40% Intermediate + 50% ECAT / BZU Engineering Entry Test.
4. Faculty of Pharmacy (Pharm.D 5-Year):
   - Eligibility: Minimum 60% marks in F.Sc. Pre-Medical (Physics, Chemistry, Biology). Strict merit-based selection.
5. Gillani Law College (LL.B 5-Year Program):
   - Eligibility: Minimum 50% in Intermediate + passing the HEC Law Admission Test (LAT) with at least 50% marks.`,
    keywords: ["eligibility", "merit formula", "computer science", "engineering", "ucet", "pharmacy", "pharm d", "lat", "fsc", "matric"]
  },
  {
    id: "chk-bzu-adm-03",
    documentId: "doc-bzu-adm-2026",
    documentTitle: "Official BZU Undergraduate & Postgraduate Admissions Prospectus 2026-2027",
    category: "admissions",
    title: "Reserved Seats, Quotas & Evening (Self-Support) Admissions",
    content: `BZU Reserved Seats & Quota Allocations:
- BZU allocates reserved quota seats in all undergraduate departments for:
  * Disabled / Special persons (medical board assessment required)
  * Outstanding sports personnel (trials conducted by BZU Sports Directorate)
  * Real sons/daughters of BZU teachers and administrative staff
  * Candidates from Balochistan and FATA / Newly Merged Districts
  * Overseas Pakistanis and Foreign nationals
  * Army/Police Shaheed dependents
- Evening (Self-Support) Programs:
  * Offered in almost all major departments (Computer Science, BBA, Commerce, English, Chemistry, Physics, Law).
  * Evening programs have slightly lower merit cut-offs than Morning programs.
  * Fee structure is higher than Morning programs. Candidates must apply specifically for Evening seats on the online portal.`,
    keywords: ["reserved seats", "quota", "sports quota", "balochistan quota", "evening", "self support", "disabled seats"]
  },

  // --- BZU TUITION & FEES CHUNKS ---
  {
    id: "chk-bzu-fee-01",
    documentId: "doc-bzu-fees-2026",
    documentTitle: "BZU Semester Fee Schedule, Morning/Evening Rates & Hostel Dues 2026-2027",
    category: "tuition_aid",
    title: "Morning (Regular) Program Semester Tuition Rates 2026-2027",
    content: `BZU Morning (Regular/Subsidized) Program Semester Fee Structure (in Pakistani Rupees - PKR):
- BS Computer Science / BS Software Engineering / BS Data Science: Rs. 42,500 per semester.
- B.Sc. Engineering (UCET - Civil, Electrical, Mechanical, Computer): Rs. 48,000 per semester.
- Doctor of Pharmacy (Pharm.D Morning): Rs. 52,000 per semester.
- Bachelor of Business Administration (BBA Morning - IMS): Rs. 38,000 per semester.
- BS Sciences (Physics, Chemistry, Mathematics, Botany, Zoology): Rs. 32,000 - Rs. 36,000 per semester.
- BS Arts, Humanities & Social Sciences (English, Economics, Sociology, Urdu, IR): Rs. 26,500 - Rs. 29,500 per semester.
- Doctor of Veterinary Medicine (DVM Morning): Rs. 44,000 per semester.
- Gillani Law College (LL.B 5-Year Morning): Rs. 36,000 per semester.
(Note: First-semester admission fee includes one-time registration and library security charges of Rs. 6,500).`,
    keywords: ["fee", "tuition", "morning fee", "pkr", "computer science fee", "engineering fee", "pharmacy fee", "bba fee", "semester fee"]
  },
  {
    id: "chk-bzu-fee-02",
    documentId: "doc-bzu-fees-2026",
    documentTitle: "BZU Semester Fee Schedule, Morning/Evening Rates & Hostel Dues 2026-2027",
    category: "tuition_aid",
    title: "Evening (Self-Support) Semester Fee Structure",
    content: `BZU Evening (Self-Support / Replica) Program Semester Fees (in PKR):
- BS Computer Science / Software Engineering (Evening): Rs. 68,000 per semester.
- BBA (Evening - IMS): Rs. 62,000 per semester.
- Doctor of Pharmacy (Pharm.D Evening): Rs. 98,000 per semester.
- BS Chemistry / Physics / Biotechnology (Evening): Rs. 54,000 per semester.
- BS English / Economics / Law (Evening): Rs. 48,000 - Rs. 52,000 per semester.
- MBA (1.5 & 2-Year Evening): Rs. 58,000 per semester.
- M.Phil Programs (All disciplines): Rs. 45,000 - Rs. 55,000 per semester.
- Ph.D. Programs (All disciplines): Rs. 50,000 - Rs. 60,000 per semester.
Challan forms can be paid at HBL BZU Branch (New Campus Bosan Road) or online through HBL Konnect / 1Bill.`,
    keywords: ["evening fee", "self support fee", "mphil fee", "phd fee", "bba evening", "cs evening", "pkr"]
  },
  {
    id: "chk-bzu-fee-03",
    documentId: "doc-bzu-fees-2026",
    documentTitle: "BZU Semester Fee Schedule, Morning/Evening Rates & Hostel Dues 2026-2027",
    category: "tuition_aid",
    title: "Hostel Dues, Room Charges & Green Bus Transport Pass",
    content: `BZU Hostel Allotment, Boarding & Green Bus Transport Charges:
- University Student Bus Pass (Green Bus Fleet): Rs. 4,500 per semester.
  * Provides unlimited daily round-trip transport across all official routes in Multan (Bosan Road, Cantt, Chowk Kumharanwala, Shah Rukn-e-Alam, Vehari Road, Khanewal Road, Shujabad, Lodhran, and Muzaffargarh).
- BZU Hostel Accommodation Fees (14 Halls of Residence):
  * Room Rent & Utilities: Rs. 18,500 per semester for morning students (Rs. 26,000 for evening students).
  * Hostel Security Deposit: Rs. 5,000 (one-time, refundable).
  * Mess Charges: Operates on monthly actual cooperative sharing basis (typically Rs. 6,500 - Rs. 8,500 per month for three daily meals).
Hostel applications are submitted online through the BZU Hall Council portal after departmental admission verification.`,
    keywords: ["hostel fee", "hostel dues", "bus pass", "transport fee", "green bus", "mess charges", "hall council"]
  },

  // --- BZU SCHOLARSHIPS & FINANCIAL AID ---
  {
    id: "chk-bzu-sch-01",
    documentId: "doc-bzu-scholarships",
    documentTitle: "BZU Financial Aid, HEC Need-Based & PEEF Scholarships Handbook",
    category: "tuition_aid",
    title: "HEC Need-Based & PEEF Scholarships at BZU",
    content: `Financial Assistance Programs at BZU Multan (Administered by Student Financial Aid Office - SFAO):
1. Higher Education Commission (HEC) Need-Based Scholarships:
   - Covers 100% full tuition fees of the degree program.
   - Provides a monthly living stipend of Rs. 6,000 directly to the student's bank account.
   - Eligibility: Genuine financial need with family income below Rs. 45,000/month.
2. Punjab Educational Endowment Fund (PEEF) Scholarships:
   - For students with Punjab domicile who secured at least 60% marks in BISE Intermediate examination.
   - Monthly stipend + full tuition waiver.
3. Pakistan Bait-ul-Mal Financial Assistance:
   - Financial support for orphans, destitute students, and families facing severe economic hardship.
4. BZU Institutional Merit Scholarship:
   - Top 3 position holders in each semester exam in every department receive merit awards (1st position Rs. 12,000, 2nd position Rs. 9,000, 3rd position Rs. 6,000).
5. Mora (Zakat) Scholarship & Tuition Fee Concessions:
   - Awarded by District Zakat Committees and BZU Zakat Committee.
Office Location: Student Financial Aid Office (SFAO), 1st Floor, Administration Block, BZU Bosan Road Campus. Email: sfao@bzu.edu.pk.`,
    keywords: ["scholarship", "hec need based", "peef", "bait ul mal", "financial aid", "merit scholarship", "sfao", "fee concession"]
  },

  // --- BZU ACADEMIC CALENDAR ---
  {
    id: "chk-bzu-cal-01",
    documentId: "doc-bzu-calendar-2026",
    documentTitle: "Official BZU Academic Calendar (Fall 2026 & Spring 2027)",
    category: "calendar",
    title: "BZU Academic Year 2026-2027 Important Dates",
    content: `Bahauddin Zakariya University Multan Academic Calendar 2026-2027:
- Fall Semester 2026:
  * Commencement of Classes: Monday, September 21, 2026.
  * Last date for add/drop and course registration: October 2, 2026.
  * Midterm Examinations: November 16 - November 21, 2026.
  * Winter Vacations: December 24, 2026 - January 3, 2027.
  * Classes Resume: January 4, 2027.
  * Final Term Examinations: January 18 - January 30, 2027.
  * Announcement of Semester Results: February 12, 2027.
- Spring Semester 2027:
  * Commencement of Classes: Monday, February 15, 2027.
  * Midterm Examinations: April 12 - April 17, 2027.
  * Final Term Examinations: June 14 - June 26, 2027.
  * Summer Vacations: July 1, 2027 - August 31, 2027.
  * BZU Annual Convocation: Usually held in November/December.`,
    keywords: ["academic calendar", "semester start", "midterm exams", "final exams", "winter vacation", "summer vacation", "dates", "bzu calendar"]
  },

  // --- BZU FACULTIES & DEPARTMENTS ---
  {
    id: "chk-bzu-prog-01",
    documentId: "doc-bzu-faculties",
    documentTitle: "BZU Colleges, Faculties, Institutes & Degree Programs Catalog",
    category: "programs",
    title: "Key Faculties & Institutes at BZU Multan",
    content: `Prominent Academic Faculties & Colleges at BZU Multan:
1. University College of Engineering & Technology (UCET):
   - Accredited by Pakistan Engineering Council (PEC) Level-II.
   - Departments: Civil Engineering, Electrical Engineering, Mechanical Engineering, Computer Systems Engineering, Chemical Engineering, Metallurgy & Materials.
2. Department of Computer Science & Information Technology (CS&IT):
   - Accredited by NCEAC (Highest W-Category).
   - Degrees: BS Computer Science, BS Software Engineering, BS Data Science, BS Artificial Intelligence, MS CS, and Ph.D.
3. Institute of Management Sciences (IMS) & Department of Commerce:
   - Degrees: BBA (Honors), BS Accounting & Finance, MBA, MS Management Sciences, B.Com, M.Com.
4. Faculty of Pharmacy:
   - Accredited by Pharmacy Council of Pakistan (PCP).
   - Degree: Doctor of Pharmacy (Pharm.D 5-Year) Morning and Evening.
5. Gillani Law College (Est. 1971):
   - One of Pakistan's oldest and premier law institutions.
   - Degree: LL.B (5-Year Honors) and LL.M.
6. Faculty of Agricultural Sciences & Technology and Faculty of Veterinary Sciences (DVM).`,
    keywords: ["departments", "ucet", "computer science", "ims", "bba", "pharmacy", "law college", "gillani law", "engineering", "programs"]
  },

  // --- BZU EXAMS & REGULATIONS ---
  {
    id: "chk-bzu-exm-01",
    documentId: "doc-bzu-regulations",
    documentTitle: "BZU Semester Examination Regulations, CGPA & 75% Attendance Policy",
    category: "exams_grading",
    title: "Semester Grading Rules, CGPA Scale & 75% Attendance Requirement",
    content: `BZU Examination Regulations & Academic Policies:
1. 75% Mandatory Attendance Rule:
   - A student must maintain at least 75% attendance in lectures and practical labs of each enrolled course to be eligible to sit in the Final Examination.
   - Students falling below 75% attendance are not issued an admit card for that course and must repeat it.
2. CGPA Grading System:
   - 80% and above: A Grade (4.00 Grade Points)
   - 65% to 79%: B Grade (3.00 to 3.99 Grade Points)
   - 50% to 64%: C Grade (2.00 to 2.99 Grade Points)
   - 40% to 49%: D Grade (1.00 to 1.99 Grade Points)
   - Below 40%: F Grade (0.00 Fail)
3. Academic Probation & Drop Policy:
   - A minimum cumulative CGPA of 2.00 is required for graduation.
   - If a student's CGPA drops below 1.70, they are placed on Academic Probation.
   - Two consecutive probations result in dropped semester or dismissal as per BZU Academic Regulations.`,
    keywords: ["grading system", "cgpa", "attendance", "75 percent attendance", "probation", "fail", "examination rules", "controller"]
  },

  // --- BZU CAMPUS FACILITIES & LIFE ---
  {
    id: "chk-bzu-fac-01",
    documentId: "doc-bzu-facilities",
    documentTitle: "BZU Campus Facilities, Central Library, Green Bus Transport & Hostels",
    category: "campus_life",
    title: "Central Library, Student Green Buses & On-Campus Health Clinic",
    content: `Bahauddin Zakariya University Multan Campus Amenities:
- Hazrat Bahauddin Zakariya Central Library:
  * Operating Hours: Monday to Friday 8:00 AM - 9:00 PM (extended till 11:00 PM during final examination weeks).
  * Over 200,000 hardbound books, free access to HEC National Digital Library (thousands of research journals), air-conditioned research carrels, and computer lab.
- Student Transport Fleet (Green Buses):
  * Over 65 university buses operating on 28 routes connecting BZU Main Bosan Road Campus to all corners of Multan City, Cantt, Gulgasht, Mumtazabad, Shah Rukn-e-Alam, Dera Adda, Shujabad, Lodhran, and Khanewal.
- BZU Hostels (Halls of Residence):
  * 14 residential halls (Ali Hall, Umer Hall, Hamza Hall for male students; Fatima Hall, Ayesha Hall, Khadija Hall, Zainab Hall for female students) providing secure accommodation with high-speed Wi-Fi, dining halls, and indoor sports.
- BZU Health Clinic:
  * Located near Student Teacher Center (STC); 24/7 emergency medical staff and ambulance facility on call at +92 (61) 9210099. Free consultations and primary medications for enrolled students.`,
    keywords: ["library", "central library hours", "green bus", "bus routes", "hostels", "health clinic", "ambulance", "sports complex"]
  }
];

export const defaultFAQs: UniversityFAQ[] = [
  {
    id: "faq-bzu-01",
    question: "When do undergraduate admissions open for Fall 2026 at BZU Multan?",
    answer: "Fall 2026 admissions open in mid-July 2026 with an application deadline of August 25, 2026. The 1st Merit List is published on September 2, 2026 on the official portal apply.bzu.edu.pk.",
    category: "Admissions",
    pinned: true
  },
  {
    id: "faq-bzu-02",
    question: "What is the fee structure for Morning vs Evening programs at BZU?",
    answer: "For Morning (Regular) BS programs, semester fee is approximately Rs. 28,000 - Rs. 42,500 (BS CS ~Rs. 42,500, Engineering ~Rs. 48,000). For Evening (Self-Support) programs, fees range from Rs. 52,000 to Rs. 68,000 per semester.",
    category: "Tuition & Fees",
    pinned: true
  },
  {
    id: "faq-bzu-03",
    question: "How do I apply for the BZU student Green Bus transport pass?",
    answer: "The BZU student bus pass costs Rs. 4,500 per semester and covers over 65 green buses across 28 routes in Multan and surrounding districts. You can deposit the challan at HBL BZU Branch and obtain your pass from the Transport Office.",
    category: "Campus Facilities",
    pinned: true
  },
  {
    id: "faq-bzu-04",
    question: "What scholarships are available for needy and talented students at BZU?",
    answer: "BZU offers HEC Need-Based Scholarships (full tuition waiver + Rs. 6,000/month stipend), PEEF Scholarships, BZU Institutional Merit Scholarships (top 3 in each department), Pakistan Bait-ul-Mal, and Mora Zakat assistance via the Student Financial Aid Office (SFAO).",
    category: "Scholarships & Aid",
    pinned: true
  },
  {
    id: "faq-bzu-05",
    question: "What is the minimum attendance required to appear in BZU final exams?",
    answer: "According to BZU Semester Regulations, a minimum of 75% attendance in theory lectures and laboratory practicals is mandatory to be eligible to sit in the final examination of any course.",
    category: "Exams & Grading",
    pinned: false
  },
  {
    id: "faq-bzu-06",
    question: "What are the hours for Hazrat Bahauddin Zakariya Central Library?",
    answer: "The Central Library is open Monday to Friday from 8:00 AM to 9:00 PM, and remains open with extended hours until 11:00 PM during midterm and final examination weeks.",
    category: "Campus Facilities",
    pinned: false
  }
];
