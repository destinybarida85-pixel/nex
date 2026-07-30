import type { DocumentLayout } from "./theme";

export type TemplateSection = { heading: string; text: string };

export type DocumentTemplate = {
  id: string;
  name: string;
  category: string;
  layout: DocumentLayout;
  /** Visual/graphic formats (posters, ID cards, decks) produce a written content
   *  outline here rather than a designed graphic — flagged so the UI can say so. */
  outlineOnly?: boolean;
  title: string;
  meta: string;
  sections: TemplateSection[];
};

const P = "[Your Company]";
const C = "[Client Name]";
const D = "[Date]";

export const templateCategories = [
  "Business",
  "Corporate",
  "Education",
  "Medical",
  "Government & Legal",
  "Finance",
  "Marketing",
  "Administrative",
  "Creative & Portfolio",
  "Digital",
  "Forms",
] as const;

export const documentTemplates: DocumentTemplate[] = [
  // ── Business ──────────────────────────────────────────────────────────
  {
    id: "invoice", name: "Invoice", category: "Business", layout: "modern",
    title: "Invoice", meta: `${P} · Invoice #INV-0001 · Issued ${D}`,
    sections: [
      { heading: "Bill To", text: `${C}\n[Street Address]\n[City, Postal Code]\n[Email]` },
      { heading: "Line Items", text: "1. [Description of work] — [Qty] × [Unit price] = [Amount]\n2. [Description of work] — [Qty] × [Unit price] = [Amount]" },
      { heading: "Totals", text: "Subtotal: [Amount]\nTax ([Rate]%): [Amount]\nTotal due: [Amount]" },
      { heading: "Payment Terms", text: "Payment is due within [15] days of the invoice date. Late payments may accrue interest at [Rate]% per month. Please reference the invoice number with your payment." },
    ],
  },
  {
    id: "receipt", name: "Receipt", category: "Business", layout: "minimal",
    title: "Receipt", meta: `${P} · Receipt #RCP-0001 · ${D}`,
    sections: [
      { heading: "Received From", text: `${C}` },
      { heading: "Payment Details", text: "Amount received: [Amount]\nPayment method: [Card / Bank transfer / Cash]\nReference: [Transaction reference]" },
      { heading: "For", text: "[Description of goods or services paid for]" },
      { heading: "Acknowledgement", text: `This receipt confirms payment has been received in full by ${P}. Thank you for your business.` },
    ],
  },
  {
    id: "quotation", name: "Quotation", category: "Business", layout: "modern",
    title: "Quotation", meta: `${P} · Quote #QT-0001 · Valid until [Date]`,
    sections: [
      { heading: "Prepared For", text: `${C}\n[Contact name]\n[Email]` },
      { heading: "Scope of Work", text: "[Describe exactly what is included in this quote, and what is explicitly excluded.]" },
      { heading: "Pricing", text: "1. [Item] — [Amount]\n2. [Item] — [Amount]\n\nTotal: [Amount]" },
      { heading: "Validity & Terms", text: "This quotation is valid for [30] days from the date of issue. Prices are subject to change after that period. Work begins upon written acceptance and receipt of any required deposit." },
    ],
  },
  {
    id: "purchase-order", name: "Purchase Order", category: "Business", layout: "modern",
    title: "Purchase Order", meta: `PO #PO-0001 · Issued ${D}`,
    sections: [
      { heading: "Vendor", text: "[Vendor name]\n[Vendor address]\n[Vendor contact]" },
      { heading: "Ship To", text: `${P}\n[Delivery address]` },
      { heading: "Ordered Items", text: "1. [Item] — Qty [N] @ [Unit price] = [Amount]\n2. [Item] — Qty [N] @ [Unit price] = [Amount]\n\nOrder total: [Amount]" },
      { heading: "Delivery & Terms", text: "Required delivery date: [Date]. Goods must match the specifications above. Invoices referencing this PO number will be processed on [Net 30] terms." },
    ],
  },
  {
    id: "delivery-note", name: "Delivery Note", category: "Business", layout: "minimal",
    title: "Delivery Note", meta: `${P} · Delivery #DN-0001 · ${D}`,
    sections: [
      { heading: "Deliver To", text: `${C}\n[Delivery address]` },
      { heading: "Items Delivered", text: "1. [Item] — Qty [N]\n2. [Item] — Qty [N]" },
      { heading: "Condition on Arrival", text: "Please inspect all items on receipt. Report any shortage or damage within [48] hours of delivery." },
      { heading: "Received By", text: "Name: ______________________\nSignature: ______________________\nDate: ______________________" },
    ],
  },
  {
    id: "business-proposal", name: "Business Proposal", category: "Business", layout: "modern",
    title: "Business Proposal", meta: `Prepared by ${P} for ${C} · ${D}`,
    sections: [
      { heading: "Executive Summary", text: "[One paragraph: the problem the client faces, what you propose, and the outcome they can expect.]" },
      { heading: "Understanding of Needs", text: "[Restate the client's situation and goals in your own words, to show you understood the brief.]" },
      { heading: "Proposed Solution", text: "[Describe your approach, the phases of work, and what is delivered at each stage.]" },
      { heading: "Timeline", text: "Phase 1 — [Name]: [Duration]\nPhase 2 — [Name]: [Duration]\nPhase 3 — [Name]: [Duration]" },
      { heading: "Investment", text: "Total investment: [Amount]\nPayment schedule: [e.g. 50% on signing, 50% on delivery]" },
      { heading: "Next Steps", text: "To proceed, sign this proposal and return it. Work begins once the deposit is received." },
    ],
  },
  {
    id: "business-plan", name: "Business Plan", category: "Business", layout: "classic",
    title: "Business Plan", meta: `${P} · ${D}`,
    sections: [
      { heading: "1. Executive Summary", text: "[What the business does, who it serves, and why it will succeed — in one paragraph.]" },
      { heading: "2. Market Opportunity", text: "[Size of the market, the specific gap you're addressing, and evidence that customers want this.]" },
      { heading: "3. Products & Services", text: "[What you sell, how it's priced, and what makes it different from alternatives.]" },
      { heading: "4. Operations & Team", text: "[How the business runs day to day, key people, and what roles you still need to fill.]" },
      { heading: "5. Financial Projections", text: "[Revenue and cost projections for the next [3] years, key assumptions, and funding required.]" },
    ],
  },
  {
    id: "company-profile", name: "Company Profile", category: "Business", layout: "minimal",
    title: "Company Profile", meta: `${P} · ${D}`,
    sections: [
      { heading: "Who We Are", text: `${P} is a [industry] company founded in [Year], based in [City, Country]. We help [type of client] achieve [outcome].` },
      { heading: "What We Do", text: "[List your core services or products, each with one line on the value it delivers.]" },
      { heading: "Our Track Record", text: "[Notable clients, projects, or results — with numbers where you have them.]" },
      { heading: "Contact", text: "[Address]\n[Phone] · [Email]\n[Website]" },
    ],
  },
  {
    id: "letterhead", name: "Letterhead", category: "Business", layout: "minimal",
    title: "[Letter Subject]", meta: `${P} · [Address] · [Phone] · [Email]`,
    sections: [
      { heading: "Date & Recipient", text: `${D}\n\n[Recipient name]\n[Title]\n[Organization]\n[Address]` },
      { heading: "Letter", text: "Dear [Name],\n\n[Body of your letter.]\n\n[Closing paragraph.]" },
      { heading: "Sign-off", text: "Sincerely,\n\n\n[Your name]\n[Your title]" },
    ],
  },
  {
    id: "memo", name: "Memo", category: "Business", layout: "minimal",
    title: "Internal Memo", meta: `${P} · ${D}`,
    sections: [
      { heading: "To / From / Subject", text: "TO: [Recipients]\nFROM: [Your name, title]\nDATE: [Date]\nSUBJECT: [Subject line]" },
      { heading: "Purpose", text: "[One or two sentences stating why this memo exists and what you need from the reader.]" },
      { heading: "Details", text: "[The substance: background, what's changing, and who it affects.]" },
      { heading: "Action Required", text: "[Exactly what the reader should do, and by when.]" },
    ],
  },
  {
    id: "contract", name: "Contract", category: "Business", layout: "classic",
    title: "Service Contract", meta: `Between ${P} and ${C} · ${D}`,
    sections: [
      { heading: "1. Parties", text: `This Agreement is entered into on ${D} between ${P} ("Provider") and ${C} ("Client").` },
      { heading: "2. Scope of Services", text: "Provider shall deliver [describe the services in specific, measurable terms]." },
      { heading: "3. Fees & Payment", text: "Client agrees to pay [Amount], payable [schedule]. Invoices are due within [15] days of receipt." },
      { heading: "4. Term & Termination", text: "This Agreement begins on [Date] and continues until [Date or milestone]. Either party may terminate with [30] days' written notice." },
      { heading: "5. Governing Law", text: "This Agreement is governed by the laws of [Jurisdiction]. Any dispute shall be resolved in the courts of [Location]." },
    ],
  },
  {
    id: "nda", name: "NDA (Non-Disclosure Agreement)", category: "Business", layout: "classic",
    title: "Mutual Non-Disclosure Agreement", meta: `Between ${P} and ${C} · ${D}`,
    sections: [
      { heading: "1. Purpose", text: "The parties wish to explore a potential business relationship and may disclose confidential information to one another in connection with that opportunity." },
      { heading: "2. Confidential Information", text: "Confidential Information means all non-public business, technical, and financial information disclosed by either party, whether written or oral, that is marked confidential or would reasonably be understood as confidential." },
      { heading: "3. Obligations", text: "Each party shall keep the other's Confidential Information secret, use it solely for the stated purpose, and disclose it only to employees or advisers with a genuine need to know who are bound by equivalent obligations." },
      { heading: "4. Term", text: "This Agreement remains in effect for [2] years from the date above, and confidentiality obligations survive termination." },
      { heading: "5. Exclusions", text: "These obligations do not apply to information that is or becomes public through no fault of the receiving party, was lawfully known before disclosure, or is independently developed without reference to the Confidential Information." },
    ],
  },

  // ── Corporate ─────────────────────────────────────────────────────────
  {
    id: "employee-id-card", name: "Employee ID Card", category: "Corporate", layout: "minimal", outlineOnly: true,
    title: "Employee Identification", meta: `${P} · Staff ID`,
    sections: [
      { heading: "Employee Details", text: "Full name: [Name]\nEmployee ID: [ID Number]\nDepartment: [Department]\nJob title: [Title]" },
      { heading: "Validity", text: "Issued: [Date]\nExpires: [Date]\nBlood group / emergency contact: [Optional]" },
      { heading: "Conditions of Use", text: "This card remains the property of [Your Company] and must be returned on termination of employment. If found, please return to [Address]." },
    ],
  },
  {
    id: "employment-letter", name: "Employment Letter", category: "Corporate", layout: "classic",
    title: "Letter of Employment", meta: `${P} · ${D}`,
    sections: [
      { heading: "Confirmation", text: `This letter confirms that [Employee Name] has been employed by ${P} since [Start Date] in the position of [Job Title].` },
      { heading: "Employment Details", text: "Employment type: [Full-time / Part-time / Contract]\nCurrent gross salary: [Amount] per [month/year]\nDepartment: [Department]" },
      { heading: "Purpose", text: "This letter is issued at the employee's request for [purpose, e.g. visa application, loan application] and should not be construed as a contract of employment." },
      { heading: "Issued By", text: "[Name]\n[Title]\n[Contact details]" },
    ],
  },
  {
    id: "appointment-letter", name: "Appointment Letter", category: "Corporate", layout: "classic",
    title: "Letter of Appointment", meta: `${P} · ${D}`,
    sections: [
      { heading: "Appointment", text: `We are pleased to appoint you as [Job Title] at ${P}, effective [Start Date], reporting to [Manager Name, Title].` },
      { heading: "Terms of Employment", text: "Gross salary: [Amount] per [month/year]\nProbation period: [N] months\nWorking hours: [Hours]\nLocation: [Office / Remote]" },
      { heading: "Duties", text: "[Summarize the core responsibilities of the role, and note that duties may reasonably evolve.]" },
      { heading: "Acceptance", text: "Please sign and return a copy of this letter to confirm your acceptance of the terms above." },
    ],
  },
  {
    id: "offer-letter", name: "Offer Letter", category: "Corporate", layout: "classic",
    title: "Employment Offer", meta: `${P} · Confidential · ${D}`,
    sections: [
      { heading: "The Offer", text: `We are delighted to offer you the position of [Job Title] at ${P}, reporting to [Manager]. Your anticipated start date is [Date].` },
      { heading: "Compensation", text: "Base salary: [Amount] per year, paid [frequency]\nBonus: [Details or N/A]\nEquity: [Details or N/A]" },
      { heading: "Benefits", text: "[Health cover, retirement contribution, leave allowance, learning budget, and any other benefits.]" },
      { heading: "Conditions", text: "This offer is contingent on [reference checks / right to work verification / background check] and remains open until [Date]." },
    ],
  },
  {
    id: "resignation-letter", name: "Resignation Letter", category: "Corporate", layout: "minimal",
    title: "Letter of Resignation", meta: `${D}`,
    sections: [
      { heading: "Notice", text: `Dear [Manager Name],\n\nI am writing to formally resign from my position as [Job Title] at ${P}, effective [Last Working Day], in line with my [N]-[week/month] notice period.` },
      { heading: "Handover", text: "I am committed to a smooth transition and will [complete outstanding work / document processes / help train a replacement] before my departure." },
      { heading: "Closing", text: "Thank you for the opportunity and support during my time here. I wish the team continued success.\n\nSincerely,\n[Your name]" },
    ],
  },
  {
    id: "payslip", name: "Payslip", category: "Corporate", layout: "modern",
    title: "Payslip", meta: `${P} · Pay period [Month Year]`,
    sections: [
      { heading: "Employee", text: "Name: [Employee name]\nEmployee ID: [ID]\nDepartment: [Department]\nPay date: [Date]" },
      { heading: "Earnings", text: "Basic salary: [Amount]\nAllowances: [Amount]\nOvertime: [Amount]\nGross pay: [Amount]" },
      { heading: "Deductions", text: "Tax: [Amount]\nPension / social security: [Amount]\nOther: [Amount]\nTotal deductions: [Amount]" },
      { heading: "Net Pay", text: "Net pay: [Amount]\nPaid to: [Bank account ending ####]" },
    ],
  },
  {
    id: "leave-request", name: "Leave Request Form", category: "Corporate", layout: "minimal",
    title: "Leave Request", meta: `${P} · ${D}`,
    sections: [
      { heading: "Employee Details", text: "Name: [Name]\nEmployee ID: [ID]\nDepartment: [Department]\nManager: [Manager name]" },
      { heading: "Leave Requested", text: "Type: [Annual / Sick / Parental / Unpaid / Other]\nFrom: [Date]  To: [Date]\nTotal working days: [N]\nReason (optional): [Reason]" },
      { heading: "Cover Arrangements", text: "[Who will cover your responsibilities, and what has been handed over.]" },
      { heading: "Approval", text: "Employee signature: ______________  Date: __________\nManager approval: ______________  Date: __________" },
    ],
  },
  {
    id: "performance-review", name: "Performance Review", category: "Corporate", layout: "modern",
    title: "Performance Review", meta: `${P} · Review period [Period]`,
    sections: [
      { heading: "Employee & Period", text: "Name: [Name]\nRole: [Title]\nReviewer: [Manager]\nPeriod covered: [Start] – [End]" },
      { heading: "Achievements", text: "[Specific results delivered in this period, with measurable outcomes where possible.]" },
      { heading: "Areas for Development", text: "[Honest, specific areas to improve, framed with what support will be provided.]" },
      { heading: "Goals for Next Period", text: "1. [Goal — measurable, with a deadline]\n2. [Goal]\n3. [Goal]" },
      { heading: "Overall Rating & Sign-off", text: "Rating: [Exceeds / Meets / Below expectations]\n\nEmployee comments: [Space for the employee's own response]\n\nEmployee: __________  Manager: __________" },
    ],
  },
  {
    id: "meeting-minutes", name: "Meeting Minutes", category: "Corporate", layout: "minimal",
    title: "Meeting Minutes", meta: `${P} · [Meeting name] · ${D}`,
    sections: [
      { heading: "Attendance", text: "Present: [Names]\nApologies: [Names]\nChair: [Name]  ·  Minutes: [Name]" },
      { heading: "Agenda Items Discussed", text: "1. [Item] — [Summary of discussion]\n2. [Item] — [Summary of discussion]" },
      { heading: "Decisions Made", text: "[List each decision clearly, so someone absent knows exactly what was agreed.]" },
      { heading: "Action Items", text: "[Action] — Owner: [Name] — Due: [Date]\n[Action] — Owner: [Name] — Due: [Date]" },
      { heading: "Next Meeting", text: "Date: [Date]  ·  Time: [Time]  ·  Location: [Location]" },
    ],
  },
  {
    id: "attendance-sheet", name: "Attendance Sheet", category: "Corporate", layout: "modern",
    title: "Attendance Sheet", meta: `${P} · [Period]`,
    sections: [
      { heading: "Details", text: "Team / class: [Name]\nPeriod: [Start] – [End]\nRecorded by: [Name]" },
      { heading: "Register", text: "Name | Date | Time in | Time out | Status\n[Name] | [Date] | [--:--] | [--:--] | [Present/Absent/Late]\n[Name] | [Date] | [--:--] | [--:--] | [Present/Absent/Late]" },
      { heading: "Summary", text: "Total present: [N]\nTotal absent: [N]\nTotal late: [N]" },
    ],
  },

  // ── Education ─────────────────────────────────────────────────────────
  {
    id: "certificate", name: "Certificate", category: "Education", layout: "classic",
    title: "Certificate of Completion", meta: `${P} · Awarded ${D}`,
    sections: [
      { heading: "This Is To Certify That", text: "[Recipient Full Name]" },
      { heading: "Has Successfully Completed", text: "[Course / programme name], comprising [N] hours of study, held from [Start Date] to [End Date]." },
      { heading: "Awarded", text: `Date of issue: ${D}\nCertificate number: [CERT-0001]` },
      { heading: "Authorised By", text: "______________________\n[Name], [Title]\n" + P },
    ],
  },
  {
    id: "diploma", name: "Diploma", category: "Education", layout: "classic",
    title: "Diploma", meta: `${P} · Conferred ${D}`,
    sections: [
      { heading: "Be It Known That", text: "[Graduate Full Name]" },
      { heading: "Has Been Awarded", text: "the Diploma in [Field of Study], having fulfilled all requirements prescribed by [Institution] and demonstrated the required standard of achievement." },
      { heading: "Conferred", text: `Given at [City] on ${D}.\nDiploma number: [DIP-0001]` },
      { heading: "Signatures", text: "______________________        ______________________\n[Registrar]                                    [Principal / Dean]" },
    ],
  },
  {
    id: "transcript", name: "Transcript", category: "Education", layout: "modern",
    title: "Academic Transcript", meta: `${P} · Student ID [ID] · ${D}`,
    sections: [
      { heading: "Student Details", text: "Name: [Full name]\nStudent ID: [ID]\nProgramme: [Programme]\nPeriod of study: [Start] – [End]" },
      { heading: "Courses & Grades", text: "Code | Course title | Credits | Grade\n[CODE] | [Title] | [N] | [Grade]\n[CODE] | [Title] | [N] | [Grade]" },
      { heading: "Summary", text: "Total credits earned: [N]\nCumulative average / GPA: [Value]\nStanding: [Good standing / Graduated / Withdrawn]" },
      { heading: "Certification", text: "This is a true record of the academic performance of the named student, issued by the office of the Registrar." },
    ],
  },
  {
    id: "report-card", name: "Report Card", category: "Education", layout: "modern",
    title: "Student Report Card", meta: `${P} · [Term] [Year]`,
    sections: [
      { heading: "Student", text: "Name: [Name]\nClass / grade: [Class]\nTerm: [Term]\nAttendance: [N] of [N] days" },
      { heading: "Subject Results", text: "Subject | Score | Grade | Remark\n[Subject] | [Score] | [Grade] | [Remark]\n[Subject] | [Score] | [Grade] | [Remark]" },
      { heading: "Teacher's Comments", text: "[Specific, constructive comments on the student's progress, strengths, and where to focus next term.]" },
      { heading: "Sign-off", text: "Class teacher: ______________\nHead teacher: ______________\nParent/guardian: ______________" },
    ],
  },
  {
    id: "assignment-cover", name: "Assignment Cover Page", category: "Education", layout: "minimal",
    title: "[Assignment Title]", meta: `${P} · Submitted ${D}`,
    sections: [
      { heading: "Student Details", text: "Name: [Full name]\nStudent ID: [ID]\nProgramme: [Programme]\nClass / section: [Class]" },
      { heading: "Assignment Details", text: "Course: [Course code and title]\nInstructor: [Name]\nAssignment: [Title / number]\nDue date: [Date]  ·  Submitted: [Date]" },
      { heading: "Declaration", text: "I declare that this submission is my own original work, and that all sources used have been properly acknowledged.\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "lesson-plan", name: "Lesson Plan", category: "Education", layout: "modern",
    title: "Lesson Plan", meta: `[Subject] · [Class] · ${D}`,
    sections: [
      { heading: "Overview", text: "Subject: [Subject]\nTopic: [Topic]\nClass: [Class]  ·  Duration: [N] minutes\nDate: [Date]" },
      { heading: "Learning Objectives", text: "By the end of this lesson, students will be able to:\n1. [Objective]\n2. [Objective]\n3. [Objective]" },
      { heading: "Materials Needed", text: "[List everything required — handouts, equipment, slides, resources.]" },
      { heading: "Lesson Sequence", text: "Introduction ([N] min): [Activity]\nMain activity ([N] min): [Activity]\nPractice ([N] min): [Activity]\nClosing ([N] min): [Recap and check for understanding]" },
      { heading: "Assessment", text: "[How you will check that the objectives were met — questions, exit ticket, worksheet, observation.]" },
    ],
  },
  {
    id: "cv-resume", name: "CV / Resume", category: "Education", layout: "minimal",
    title: "[Your Full Name]", meta: "[Title] · [Email] · [Phone] · [City]",
    sections: [
      { heading: "Profile", text: "[Two or three sentences: who you are professionally, your strongest skills, and what you're looking for.]" },
      { heading: "Experience", text: "[Job Title] — [Company], [City]  ·  [Start] – [End]\n· [Achievement with a measurable result]\n· [Achievement with a measurable result]\n\n[Job Title] — [Company], [City]  ·  [Start] – [End]\n· [Achievement]" },
      { heading: "Education", text: "[Qualification], [Institution]  ·  [Year]\n[Qualification], [Institution]  ·  [Year]" },
      { heading: "Skills", text: "[Skill], [Skill], [Skill], [Skill]" },
      { heading: "References", text: "Available on request." },
    ],
  },
  {
    id: "recommendation-letter", name: "Recommendation Letter", category: "Education", layout: "classic",
    title: "Letter of Recommendation", meta: `${P} · ${D}`,
    sections: [
      { heading: "To Whom It May Concern", text: "I am writing to recommend [Name] for [position / programme / opportunity]. I have known [Name] for [duration] in my capacity as [your relationship to them]." },
      { heading: "Assessment", text: "[Specific examples of their work, character, and impact — concrete situations rather than general praise.]" },
      { heading: "Recommendation", text: "I recommend [Name] without reservation. I am confident they would be an asset to [organization / programme]." },
      { heading: "Contact", text: "Please feel free to contact me for any further information.\n\n[Your name]\n[Title], " + P + "\n[Email] · [Phone]" },
    ],
  },

  // ── Medical ───────────────────────────────────────────────────────────
  {
    id: "medical-report", name: "Medical Report", category: "Medical", layout: "classic",
    title: "Medical Report", meta: `[Clinic Name] · Confidential · ${D}`,
    sections: [
      { heading: "Patient Details", text: "Name: [Name]\nDate of birth: [DOB]\nPatient ID: [ID]\nDate of examination: [Date]" },
      { heading: "Presenting Complaint", text: "[What the patient reported, in their own terms, and duration of symptoms.]" },
      { heading: "Examination Findings", text: "[Objective clinical findings on examination.]" },
      { heading: "Assessment", text: "[Clinical impression / diagnosis.]" },
      { heading: "Plan", text: "[Treatment, medication, referrals, and follow-up arrangements.]\n\nClinician: [Name, qualification]\nRegistration number: [Number]" },
    ],
  },
  {
    id: "prescription", name: "Prescription Pad", category: "Medical", layout: "minimal",
    title: "Prescription", meta: `[Clinician Name, Qualification] · Reg. [Number] · ${D}`,
    sections: [
      { heading: "Patient", text: "Name: [Name]\nAge / DOB: [Age]\nDate: [Date]" },
      { heading: "Rx", text: "1. [Medication name, strength]\n    [Dose] — [Frequency] — [Duration]\n\n2. [Medication name, strength]\n    [Dose] — [Frequency] — [Duration]" },
      { heading: "Instructions", text: "[Instructions for the patient — with or without food, warnings, what to do if a dose is missed.]" },
      { heading: "Prescriber", text: "Signature: ______________________\n[Name], [Qualification]\nRegistration number: [Number]\n[Clinic address and phone]" },
    ],
  },
  {
    id: "patient-registration", name: "Patient Registration Form", category: "Medical", layout: "modern",
    title: "Patient Registration", meta: "[Clinic Name] · Confidential",
    sections: [
      { heading: "Personal Details", text: "Full name: [Name]\nDate of birth: [DOB]\nSex: [ ]\nAddress: [Address]\nPhone: [Phone]  ·  Email: [Email]" },
      { heading: "Emergency Contact", text: "Name: [Name]\nRelationship: [Relationship]\nPhone: [Phone]" },
      { heading: "Medical History", text: "Known conditions: [List]\nCurrent medication: [List]\nAllergies: [List]\nPrevious surgery: [List]" },
      { heading: "Consent", text: "I confirm the information above is accurate and consent to treatment and to the storage of my records in line with the clinic's privacy policy.\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "lab-report", name: "Laboratory Report", category: "Medical", layout: "modern",
    title: "Laboratory Report", meta: "[Laboratory Name] · Report #[LAB-0001]",
    sections: [
      { heading: "Patient & Sample", text: "Patient: [Name]  ·  ID: [ID]\nSample type: [Blood / Urine / Other]\nCollected: [Date, time]  ·  Reported: [Date, time]\nRequested by: [Clinician]" },
      { heading: "Results", text: "Test | Result | Reference range | Flag\n[Test] | [Value] | [Range] | [Normal/High/Low]\n[Test] | [Value] | [Range] | [Normal/High/Low]" },
      { heading: "Comments", text: "[Any interpretive comment from the laboratory, or note of sample quality issues.]" },
      { heading: "Verified By", text: "[Name], [Qualification]\nLaboratory registration: [Number]" },
    ],
  },
  {
    id: "medical-certificate", name: "Medical Certificate", category: "Medical", layout: "classic",
    title: "Medical Certificate", meta: `[Clinic Name] · ${D}`,
    sections: [
      { heading: "Certification", text: "This is to certify that I examined [Patient Name], [Age], on [Date of examination]." },
      { heading: "Findings", text: "In my professional opinion, the patient [is unfit for work/study for the period stated below / is fit to resume normal duties]." },
      { heading: "Period", text: "Recommended period of absence: [Start Date] to [End Date] inclusive.\nExpected date of return: [Date]" },
      { heading: "Issued By", text: "Signature: ______________________\n[Name], [Qualification]\nRegistration number: [Number]\n[Clinic address and phone]" },
    ],
  },

  // ── Government & Legal ────────────────────────────────────────────────
  {
    id: "affidavit", name: "Affidavit", category: "Government & Legal", layout: "classic",
    title: "Affidavit", meta: `Sworn ${D}`,
    sections: [
      { heading: "Deponent", text: "I, [Full Name], of [Address], holder of [ID type] number [ID Number], do hereby make oath and state as follows:" },
      { heading: "Statement of Facts", text: "1. [State each fact in a separate numbered paragraph, in plain language, from your own knowledge.]\n2. [Fact]\n3. [Fact]" },
      { heading: "Declaration", text: "I make this affidavit conscientiously believing the contents to be true and correct to the best of my knowledge and belief." },
      { heading: "Attestation", text: "Sworn at [Place] this [Day] day of [Month], [Year].\n\nDeponent: ______________________\n\nBefore me: ______________________\n[Commissioner for Oaths / Notary Public]" },
    ],
  },
  {
    id: "agreement", name: "Agreement", category: "Government & Legal", layout: "classic",
    title: "Agreement", meta: `Between the parties named below · ${D}`,
    sections: [
      { heading: "1. Parties", text: "This Agreement is made between [Party A], of [Address], and [Party B], of [Address]." },
      { heading: "2. Purpose", text: "[State plainly what the parties are agreeing to do.]" },
      { heading: "3. Obligations", text: "Party A shall: [obligations]\nParty B shall: [obligations]" },
      { heading: "4. Duration & Termination", text: "This Agreement takes effect on [Date] and remains in force until [Date or event]. Either party may terminate on [N] days' written notice." },
      { heading: "5. Signatures", text: "Party A: ______________  Date: __________\nParty B: ______________  Date: __________" },
    ],
  },
  {
    id: "lease-agreement", name: "Lease Agreement", category: "Government & Legal", layout: "classic",
    title: "Lease Agreement", meta: `Landlord and Tenant · ${D}`,
    sections: [
      { heading: "1. Parties & Property", text: "Landlord: [Name, address]\nTenant: [Name, address]\nProperty: [Full address of the premises being let]" },
      { heading: "2. Term", text: "The lease runs from [Start Date] to [End Date], a period of [N] months." },
      { heading: "3. Rent & Deposit", text: "Rent: [Amount] per [month], payable in advance on the [Nth] day of each month.\nSecurity deposit: [Amount], refundable subject to the condition of the property." },
      { heading: "4. Obligations", text: "The Tenant shall keep the property in good condition, pay utilities, and not sublet without written consent. The Landlord shall maintain the structure and ensure the property is fit for habitation." },
      { heading: "5. Signatures", text: "Landlord: ______________  Date: __________\nTenant: ______________  Date: __________" },
    ],
  },
  {
    id: "power-of-attorney", name: "Power of Attorney", category: "Government & Legal", layout: "classic",
    title: "Power of Attorney", meta: `Executed ${D}`,
    sections: [
      { heading: "1. Appointment", text: `I, [Full Name] of [Address] ("the Donor"), appoint [Full Name] of [Address] ("the Attorney") to act on my behalf.` },
      { heading: "2. Powers Granted", text: "The Attorney is authorised to: [list the specific powers granted — be precise, as broad wording grants broad authority]." },
      { heading: "3. Duration", text: "This power takes effect on [Date] and remains in force until [Date / revoked in writing / my incapacity]." },
      { heading: "4. Execution", text: "Donor: ______________  Date: __________\nAttorney: ______________  Date: __________\n\nWitness: ______________  Name: [Name]  Address: [Address]" },
      { heading: "Note", text: "A power of attorney has serious legal effect. Have this reviewed by a qualified lawyer in your jurisdiction before signing." },
    ],
  },
  {
    id: "consent-form", name: "Consent Form", category: "Government & Legal", layout: "minimal",
    title: "Consent Form", meta: `${P} · ${D}`,
    sections: [
      { heading: "Participant", text: "Name: [Name]\nDate of birth: [DOB]\nContact: [Phone / Email]" },
      { heading: "What You Are Consenting To", text: "[Describe plainly what will happen, what it involves, and any risks or alternatives.]" },
      { heading: "Your Rights", text: "Your participation is voluntary. You may withdraw at any time without giving a reason and without penalty. Your information will be handled in line with [privacy policy / applicable data protection law]." },
      { heading: "Declaration", text: "I confirm I have read and understood the above, have had the opportunity to ask questions, and give my consent.\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "application-form-legal", name: "Application Form", category: "Government & Legal", layout: "modern",
    title: "Application Form", meta: `${P} · Reference [APP-0001]`,
    sections: [
      { heading: "Applicant Details", text: "Full name: [Name]\nDate of birth: [DOB]\nNationality: [Nationality]\nID / passport number: [Number]\nAddress: [Address]\nPhone: [Phone]  ·  Email: [Email]" },
      { heading: "Application Type", text: "Applying for: [What is being applied for]\nPreferred start date: [Date]" },
      { heading: "Supporting Information", text: "[Any details required to assess the application — experience, qualifications, circumstances.]" },
      { heading: "Documents Attached", text: "[ ] Proof of identity\n[ ] Proof of address\n[ ] [Other required document]" },
      { heading: "Declaration", text: "I declare that the information given is true and complete. I understand that false information may invalidate this application.\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "license", name: "License", category: "Government & Legal", layout: "classic",
    title: "License", meta: `Issued by ${P} · License #[LIC-0001]`,
    sections: [
      { heading: "Licensee", text: "Name: [Name / Organization]\nAddress: [Address]\nIdentification: [ID / registration number]" },
      { heading: "Scope of License", text: "This license authorises the holder to [describe exactly what activity is permitted], subject to the conditions below." },
      { heading: "Conditions", text: "1. [Condition]\n2. [Condition]\n3. This license is non-transferable and may be revoked for breach of any condition." },
      { heading: "Validity", text: `Issued: ${D}\nValid until: [Expiry Date]\n\nAuthorised signature: ______________________\n[Name, Title]` },
    ],
  },
  {
    id: "permit", name: "Permit", category: "Government & Legal", layout: "classic",
    title: "Permit", meta: `Issued by ${P} · Permit #[PMT-0001]`,
    sections: [
      { heading: "Permit Holder", text: "Name: [Name / Organization]\nContact: [Phone / Email]\nAddress: [Address]" },
      { heading: "Permitted Activity", text: "[Describe the specific activity, location, and any limits on scale or hours.]" },
      { heading: "Period", text: "Valid from: [Start Date]\nValid to: [End Date]\nLocation: [Site / address]" },
      { heading: "Conditions & Authorisation", text: "The holder must comply with all applicable regulations and produce this permit on request.\n\nAuthorised by: ______________________\n[Name, Title]  ·  [Date]" },
    ],
  },

  // ── Finance ───────────────────────────────────────────────────────────
  {
    id: "bank-statement", name: "Bank Statement", category: "Finance", layout: "modern",
    title: "Account Statement", meta: "[Bank / Institution] · Statement period [Start] – [End]",
    sections: [
      { heading: "Account Holder", text: "Name: [Name]\nAccount number: [•••• ####]\nAccount type: [Current / Savings]\nStatement period: [Start] – [End]" },
      { heading: "Summary", text: "Opening balance: [Amount]\nTotal credits: [Amount]\nTotal debits: [Amount]\nClosing balance: [Amount]" },
      { heading: "Transactions", text: "Date | Description | Debit | Credit | Balance\n[Date] | [Description] | [Amount] | — | [Balance]\n[Date] | [Description] | — | [Amount] | [Balance]" },
      { heading: "Notes", text: "Please report any discrepancy within [30] days of the statement date." },
    ],
  },
  {
    id: "budget-planner", name: "Budget Planner", category: "Finance", layout: "modern",
    title: "Budget Planner", meta: `${P} · [Period]`,
    sections: [
      { heading: "Period & Goal", text: "Period: [Month / Quarter / Year]\nPrimary goal: [e.g. reduce operating costs by 10%]" },
      { heading: "Income", text: "Source | Expected | Actual\n[Source] | [Amount] | [Amount]\n[Source] | [Amount] | [Amount]\n\nTotal income: [Amount]" },
      { heading: "Expenses", text: "Category | Budgeted | Actual | Variance\n[Category] | [Amount] | [Amount] | [+/-]\n[Category] | [Amount] | [Amount] | [+/-]\n\nTotal expenses: [Amount]" },
      { heading: "Net Position", text: "Net (income − expenses): [Amount]\nNotes: [What drove the biggest variances, and what to adjust next period.]" },
    ],
  },
  {
    id: "expense-report", name: "Expense Report", category: "Finance", layout: "modern",
    title: "Expense Report", meta: `${P} · [Period] · Report #[EXP-0001]`,
    sections: [
      { heading: "Submitted By", text: "Name: [Name]\nDepartment: [Department]\nPeriod covered: [Start] – [End]\nDate submitted: [Date]" },
      { heading: "Expenses", text: "Date | Category | Description | Amount | Receipt\n[Date] | [Travel] | [Description] | [Amount] | [Y/N]\n[Date] | [Meals] | [Description] | [Amount] | [Y/N]" },
      { heading: "Total", text: "Total claimed: [Amount]\nAdvance already received: [Amount]\nNet reimbursement due: [Amount]" },
      { heading: "Approval", text: "Employee: ______________  Date: __________\nManager: ______________  Date: __________\nFinance: ______________  Date: __________" },
    ],
  },
  {
    id: "financial-statement", name: "Financial Statement", category: "Finance", layout: "modern",
    title: "Financial Statement", meta: `${P} · For the period ended [Date]`,
    sections: [
      { heading: "Income Statement", text: "Revenue: [Amount]\nCost of sales: ([Amount])\nGross profit: [Amount]\nOperating expenses: ([Amount])\nNet profit / (loss): [Amount]" },
      { heading: "Balance Sheet", text: "Assets\n  Current assets: [Amount]\n  Non-current assets: [Amount]\n  Total assets: [Amount]\n\nLiabilities\n  Current liabilities: [Amount]\n  Non-current liabilities: [Amount]\n  Total liabilities: [Amount]\n\nEquity: [Amount]" },
      { heading: "Cash Flow Summary", text: "Cash from operations: [Amount]\nCash from investing: [Amount]\nCash from financing: [Amount]\nNet change in cash: [Amount]" },
      { heading: "Notes", text: "[Accounting basis used, and any significant judgements or events affecting these figures.]" },
    ],
  },
  {
    id: "tax-invoice", name: "Tax Invoice", category: "Finance", layout: "modern",
    title: "Tax Invoice", meta: `${P} · Tax Invoice #[TIN-0001] · ${D}`,
    sections: [
      { heading: "Supplier", text: `${P}\n[Address]\nTax / VAT registration number: [Number]` },
      { heading: "Customer", text: `${C}\n[Address]\nTax registration number (if any): [Number]` },
      { heading: "Items", text: "Description | Qty | Unit price | Taxable amount\n[Item] | [N] | [Amount] | [Amount]\n[Item] | [N] | [Amount] | [Amount]" },
      { heading: "Tax Summary", text: "Taxable amount: [Amount]\nTax rate: [Rate]%\nTax amount: [Amount]\nTotal payable: [Amount]" },
    ],
  },
  {
    id: "payment-voucher", name: "Payment Voucher", category: "Finance", layout: "minimal",
    title: "Payment Voucher", meta: `${P} · Voucher #[PV-0001] · ${D}`,
    sections: [
      { heading: "Payee", text: "Paid to: [Name]\nAddress: [Address]\nBank details: [Bank, account ending ####]" },
      { heading: "Payment Details", text: "Amount: [Amount]\nAmount in words: [Words]\nMethod: [Bank transfer / Cheque / Cash]\nDate: [Date]" },
      { heading: "Being Payment For", text: "[Description of what the payment covers, with invoice or reference number.]" },
      { heading: "Authorisation", text: "Prepared by: ______________  Date: __________\nChecked by: ______________  Date: __________\nApproved by: ______________  Date: __________" },
    ],
  },

  // ── Marketing ─────────────────────────────────────────────────────────
  {
    id: "brochure", name: "Brochure", category: "Marketing", layout: "minimal", outlineOnly: true,
    title: "[Product / Service Name]", meta: `${P} · Brochure`,
    sections: [
      { heading: "Headline", text: "[One clear line stating the main benefit to the customer.]" },
      { heading: "What It Is", text: "[Two or three sentences explaining the offer in plain language.]" },
      { heading: "Key Benefits", text: "· [Benefit — what the customer gets, not what the product does]\n· [Benefit]\n· [Benefit]" },
      { heading: "Pricing & Options", text: "[Package name] — [Price] — [What's included]\n[Package name] — [Price] — [What's included]" },
      { heading: "Call To Action", text: "[What you want the reader to do next]\n[Phone] · [Email] · [Website]" },
    ],
  },
  {
    id: "flyer", name: "Flyer", category: "Marketing", layout: "minimal", outlineOnly: true,
    title: "[Event / Offer Headline]", meta: `${P}`,
    sections: [
      { heading: "The Offer", text: "[One punchy line — the single most compelling reason to pay attention.]" },
      { heading: "Details", text: "What: [Description]\nWhen: [Date and time]\nWhere: [Location]\nPrice: [Amount or Free]" },
      { heading: "Why Come", text: "· [Reason]\n· [Reason]\n· [Reason]" },
      { heading: "Contact", text: "[Phone] · [Email] · [Website / social handle]" },
    ],
  },
  {
    id: "poster", name: "Poster", category: "Marketing", layout: "minimal", outlineOnly: true,
    title: "[Poster Headline]", meta: `${P}`,
    sections: [
      { heading: "Main Message", text: "[The one thing a passer-by should read from across the room.]" },
      { heading: "Supporting Line", text: "[A short second line that adds the essential detail.]" },
      { heading: "Essentials", text: "Date: [Date]\nTime: [Time]\nVenue: [Venue]" },
      { heading: "Footer", text: "[Website / QR code destination] · [Social handle] · [Sponsor logos]" },
    ],
  },
  {
    id: "catalog", name: "Catalog", category: "Marketing", layout: "modern", outlineOnly: true,
    title: "Product Catalog", meta: `${P} · [Season / Year]`,
    sections: [
      { heading: "Introduction", text: "[A short welcome and what the reader will find in this catalog.]" },
      { heading: "Category: [Name]", text: "[Product] — [Code] — [Price]\n  [One-line description]\n\n[Product] — [Code] — [Price]\n  [One-line description]" },
      { heading: "Category: [Name]", text: "[Product] — [Code] — [Price]\n  [One-line description]" },
      { heading: "How To Order", text: "[Ordering process, minimum order, lead time, delivery options.]\n[Phone] · [Email] · [Website]" },
    ],
  },
  {
    id: "newsletter", name: "Newsletter", category: "Marketing", layout: "minimal",
    title: "[Newsletter Title]", meta: `${P} · Issue [N] · ${D}`,
    sections: [
      { heading: "In This Issue", text: "· [Headline 1]\n· [Headline 2]\n· [Headline 3]" },
      { heading: "[Lead Story Headline]", text: "[The main update, written for the reader's interest rather than as an internal announcement.]" },
      { heading: "[Second Story]", text: "[Secondary update.]" },
      { heading: "What's Next", text: "[Upcoming dates, events, or things the reader should watch for.]" },
      { heading: "Stay In Touch", text: "[Website] · [Email] · [Social handles]\n[Unsubscribe instructions]" },
    ],
  },
  {
    id: "press-release", name: "Press Release", category: "Marketing", layout: "classic",
    title: "[Announcement Headline]", meta: `FOR IMMEDIATE RELEASE · ${D}`,
    sections: [
      { heading: "Summary", text: "[City, Date] — [One paragraph containing the full story: who, what, when, where, and why it matters.]" },
      { heading: "Details", text: "[Second and third paragraphs with supporting detail, context, and why this is significant now.]" },
      { heading: "Quote", text: "\"[A quote from a named executive that adds insight rather than repeating the headline.]\" said [Name], [Title] at " + P + "." },
      { heading: "About " + P, text: "[Two or three sentences describing the company, its focus, and where it operates.]" },
      { heading: "Media Contact", text: "[Name]\n[Title]\n[Email] · [Phone]" },
    ],
  },
  {
    id: "media-kit", name: "Media Kit", category: "Marketing", layout: "modern",
    title: "Media Kit", meta: `${P} · ${D}`,
    sections: [
      { heading: "About Us", text: "[A concise description of the company that a journalist could quote directly.]" },
      { heading: "Key Facts", text: "Founded: [Year]\nHeadquarters: [City, Country]\nTeam size: [N]\nCustomers served: [N]" },
      { heading: "Our Audience", text: "[Who your audience is, size, and any demographic detail relevant to partners or advertisers.]" },
      { heading: "Brand Assets", text: "[Where to download logos, product images, and headshots, plus any usage rules.]" },
      { heading: "Press Contact", text: "[Name]\n[Email] · [Phone]" },
    ],
  },

  // ── Administrative ────────────────────────────────────────────────────
  {
    id: "checklist", name: "Checklist", category: "Administrative", layout: "minimal",
    title: "[Checklist Name]", meta: `${P} · ${D}`,
    sections: [
      { heading: "Purpose", text: "[What this checklist is for and when it should be used.]" },
      { heading: "Items", text: "[ ] [Task]\n[ ] [Task]\n[ ] [Task]\n[ ] [Task]" },
      { heading: "Sign-off", text: "Completed by: ______________  Date: __________\nVerified by: ______________  Date: __________" },
    ],
  },
  {
    id: "agenda", name: "Agenda", category: "Administrative", layout: "minimal",
    title: "Meeting Agenda", meta: `${P} · ${D}`,
    sections: [
      { heading: "Meeting Details", text: "Date: [Date]  ·  Time: [Start] – [End]\nLocation: [Location / link]\nChair: [Name]\nAttendees: [Names]" },
      { heading: "Items", text: "1. [Item] — [Owner] — [N] min\n2. [Item] — [Owner] — [N] min\n3. [Item] — [Owner] — [N] min" },
      { heading: "Pre-reading", text: "[Documents attendees should review before the meeting.]" },
      { heading: "Desired Outcomes", text: "[What must be decided or agreed by the end of this meeting.]" },
    ],
  },
  {
    id: "notice", name: "Notice", category: "Administrative", layout: "minimal",
    title: "Notice", meta: `${P} · ${D}`,
    sections: [
      { heading: "Subject", text: "[Clear subject line stating what this notice concerns.]" },
      { heading: "Notice", text: "[The announcement, stated plainly and unambiguously.]" },
      { heading: "Effective Date", text: "This notice takes effect from [Date]." },
      { heading: "Issued By", text: "[Name]\n[Title]\n" + P },
    ],
  },
  {
    id: "circular", name: "Circular", category: "Administrative", layout: "minimal",
    title: "Circular", meta: `${P} · Circular #[C-0001] · ${D}`,
    sections: [
      { heading: "To", text: "[All staff / All departments / Specific group]" },
      { heading: "Subject", text: "[What this circular is about.]" },
      { heading: "Content", text: "[The information being circulated, and any background needed to understand it.]" },
      { heading: "Action Required", text: "[What recipients must do, and by when. State 'For information only' if no action is needed.]" },
      { heading: "Issued By", text: "[Name], [Title]\n[Contact for questions]" },
    ],
  },
  {
    id: "incident-report", name: "Incident Report", category: "Administrative", layout: "modern",
    title: "Incident Report", meta: `${P} · Report #[INC-0001]`,
    sections: [
      { heading: "Incident Details", text: "Date and time: [Date, time]\nLocation: [Where it happened]\nReported by: [Name, role]\nDate reported: [Date]" },
      { heading: "People Involved", text: "[Names and roles of everyone involved or affected, and any witnesses.]" },
      { heading: "What Happened", text: "[A factual, chronological account. Record what was observed, not opinions about blame.]" },
      { heading: "Immediate Action Taken", text: "[What was done right away — first aid, containment, notifications made.]" },
      { heading: "Follow-up & Prevention", text: "[Root cause if known, corrective actions, owner, and target date.]\n\nReported by: ______________  Reviewed by: ______________" },
    ],
  },
  {
    id: "daily-report", name: "Daily Report", category: "Administrative", layout: "minimal",
    title: "Daily Report", meta: `${P} · ${D}`,
    sections: [
      { heading: "Summary", text: "Date: [Date]\nPrepared by: [Name]\nDepartment: [Department]" },
      { heading: "Completed Today", text: "· [Task or outcome]\n· [Task or outcome]" },
      { heading: "In Progress", text: "· [Item] — [Status / % complete]" },
      { heading: "Blockers & Support Needed", text: "[Anything holding work up, and what would unblock it.]" },
      { heading: "Plan For Tomorrow", text: "· [Priority]\n· [Priority]" },
    ],
  },
  {
    id: "weekly-report", name: "Weekly Report", category: "Administrative", layout: "modern",
    title: "Weekly Report", meta: `${P} · Week of [Date]`,
    sections: [
      { heading: "Overview", text: "Period: [Start] – [End]\nPrepared by: [Name]\nTeam / department: [Name]" },
      { heading: "Key Achievements", text: "· [Achievement with a measurable result]\n· [Achievement]" },
      { heading: "Metrics", text: "[Metric]: [Value] (vs [Previous])\n[Metric]: [Value] (vs [Previous])" },
      { heading: "Issues & Risks", text: "[What went wrong or is at risk, the impact, and the plan to address it.]" },
      { heading: "Priorities Next Week", text: "1. [Priority]\n2. [Priority]\n3. [Priority]" },
    ],
  },
  {
    id: "monthly-report", name: "Monthly Report", category: "Administrative", layout: "modern",
    title: "Monthly Report", meta: `${P} · [Month Year]`,
    sections: [
      { heading: "Executive Summary", text: "[The month in one paragraph: what was achieved, what slipped, and the overall trajectory.]" },
      { heading: "Performance Against Targets", text: "Target | Goal | Actual | Status\n[Target] | [Goal] | [Actual] | [On track / Behind / Exceeded]" },
      { heading: "Highlights", text: "· [Notable win, with the number that proves it]\n· [Notable win]" },
      { heading: "Challenges", text: "[Honest account of what didn't work and why.]" },
      { heading: "Focus for Next Month", text: "1. [Objective]\n2. [Objective]\n3. [Objective]" },
    ],
  },

  // ── Creative & Portfolio ──────────────────────────────────────────────
  {
    id: "portfolio", name: "Portfolio", category: "Creative & Portfolio", layout: "minimal", outlineOnly: true,
    title: "[Your Name] — Portfolio", meta: "[Discipline] · [Email] · [Website]",
    sections: [
      { heading: "About", text: "[Two or three sentences on what you do, who you do it for, and what makes your approach distinct.]" },
      { heading: "Selected Work", text: "[Project name] — [Client] — [Year]\n  [What the brief was and what you delivered.]\n\n[Project name] — [Client] — [Year]\n  [What the brief was and what you delivered.]" },
      { heading: "Services", text: "· [Service]\n· [Service]\n· [Service]" },
      { heading: "Clients", text: "[List notable clients or the types of client you work with.]" },
      { heading: "Contact", text: "[Email] · [Phone] · [Website] · [Social]" },
    ],
  },
  {
    id: "project-proposal", name: "Project Proposal", category: "Creative & Portfolio", layout: "modern",
    title: "Project Proposal", meta: `${P} for ${C} · ${D}`,
    sections: [
      { heading: "Project Background", text: "[The client's current situation, the problem or opportunity driving this project, and why it matters now.]" },
      { heading: "Objectives & Scope", text: "· [Objective one — the outcome this project is meant to achieve]\n· [Objective two]\n· [What's explicitly included in this scope, and what isn't]" },
      { heading: "Timeline", text: "Phase 1 — [Name]: [Deliverables] — [Duration]\nPhase 2 — [Name]: [Deliverables] — [Duration]\nPhase 3 — [Name]: [Deliverables] — [Duration]" },
      { heading: "Team", text: "[Name], [Role] — [What they own on this project]\n[Name], [Role] — [What they own on this project]" },
      { heading: "Investment", text: "Phase 1: [Amount]\nPhase 2: [Amount]\nPhase 3: [Amount]\nTotal: [Amount]\nPayment schedule: [e.g. 50% on signing, 50% on delivery]" },
      { heading: "Assumptions & Next Steps", text: "[What you're assuming the client will provide, and exactly how to move forward.]" },
    ],
  },
  {
    id: "case-study", name: "Case Study", category: "Creative & Portfolio", layout: "modern",
    title: "[Client] — [Result Achieved]", meta: `${P} · Case Study`,
    sections: [
      { heading: "The Client", text: "[Who they are, their industry, and their size or scale.]" },
      { heading: "The Challenge", text: "[The specific problem they came to you with, and what was at stake.]" },
      { heading: "What We Did", text: "[Your approach and the key decisions made along the way.]" },
      { heading: "The Results", text: "· [Metric] improved by [N]%\n· [Metric] reduced from [X] to [Y]\n· [Qualitative outcome]" },
      { heading: "In Their Words", text: "\"[Client quote about the impact of the work.]\" — [Name], [Title] at [Client]" },
    ],
  },
  {
    id: "brand-guidelines", name: "Brand Guidelines", category: "Creative & Portfolio", layout: "modern",
    title: "Brand Guidelines", meta: `${P} · Version [1.0] · ${D}`,
    sections: [
      { heading: "Brand Essence", text: "Mission: [Why the brand exists]\nPersonality: [Three to five adjectives]\nTone of voice: [How the brand speaks, with a do/don't example]" },
      { heading: "Logo Usage", text: "[Minimum size, clear space, approved variants, and specific misuses to avoid.]" },
      { heading: "Color Palette", text: "Primary: [Name] — [HEX] — [RGB]\nSecondary: [Name] — [HEX] — [RGB]\nAccent: [Name] — [HEX] — [RGB]" },
      { heading: "Typography", text: "Headings: [Typeface], [Weight]\nBody: [Typeface], [Weight]\nFallback: [System stack]" },
      { heading: "Applications", text: "[How the brand appears across stationery, digital, packaging, and signage.]" },
    ],
  },
  {
    id: "pitch-deck", name: "Pitch Deck", category: "Creative & Portfolio", layout: "modern", outlineOnly: true,
    title: "[Company] — Pitch", meta: `${P} · ${D}`,
    sections: [
      { heading: "1. Problem", text: "[The specific pain, and who feels it most acutely.]" },
      { heading: "2. Solution", text: "[What you've built and how it solves that pain.]" },
      { heading: "3. Market", text: "[Market size, the segment you're attacking first, and why now.]" },
      { heading: "4. Traction", text: "[Revenue, users, growth rate, retention, or signed pipeline — real numbers.]" },
      { heading: "5. Business Model", text: "[How you make money, pricing, and unit economics.]" },
      { heading: "6. Team & Ask", text: "[Who's building this and why you'll win. Amount raising, and what it buys.]" },
    ],
  },
  {
    id: "presentation", name: "Presentation", category: "Creative & Portfolio", layout: "modern", outlineOnly: true,
    title: "[Presentation Title]", meta: `${P} · ${D}`,
    sections: [
      { heading: "Opening", text: "[The hook — the one idea the audience should leave with, stated up front.]" },
      { heading: "Context", text: "[Background the audience needs before your argument makes sense.]" },
      { heading: "Main Points", text: "1. [Point] — [Supporting evidence]\n2. [Point] — [Supporting evidence]\n3. [Point] — [Supporting evidence]" },
      { heading: "Recommendation", text: "[What you're asking the audience to decide, approve, or do.]" },
      { heading: "Close & Questions", text: "[Restate the core message in one line, then open for questions.]" },
    ],
  },

  // ── Digital ───────────────────────────────────────────────────────────
  {
    id: "ebook", name: "eBook", category: "Digital", layout: "classic", outlineOnly: true,
    title: "[eBook Title]", meta: `By [Author] · ${P}`,
    sections: [
      { heading: "Introduction", text: "[Who this book is for, what problem it solves, and what the reader will be able to do by the end.]" },
      { heading: "Chapter 1 — [Title]", text: "[Opening chapter content or outline.]" },
      { heading: "Chapter 2 — [Title]", text: "[Chapter content or outline.]" },
      { heading: "Chapter 3 — [Title]", text: "[Chapter content or outline.]" },
      { heading: "Conclusion & Next Steps", text: "[Recap the key takeaways and tell the reader exactly what to do next.]" },
    ],
  },
  {
    id: "pdf-report", name: "PDF Report", category: "Digital", layout: "modern",
    title: "[Report Title]", meta: `${P} · ${D}`,
    sections: [
      { heading: "Executive Summary", text: "[The findings and recommendation in one paragraph, for readers who won't read further.]" },
      { heading: "Methodology", text: "[How the data was gathered, over what period, and any limitations.]" },
      { heading: "Findings", text: "1. [Finding, with the evidence supporting it]\n2. [Finding]\n3. [Finding]" },
      { heading: "Analysis", text: "[What the findings mean and why they matter.]" },
      { heading: "Recommendations", text: "1. [Recommendation] — Owner: [Name] — By: [Date]\n2. [Recommendation]" },
    ],
  },
  {
    id: "whitepaper", name: "Whitepaper", category: "Digital", layout: "classic",
    title: "[Whitepaper Title]", meta: `${P} · ${D}`,
    sections: [
      { heading: "Abstract", text: "[A short summary of the problem examined, the approach taken, and the conclusion reached.]" },
      { heading: "Background", text: "[The state of the field and why this question matters now.]" },
      { heading: "The Problem", text: "[A rigorous statement of the problem, with evidence of its scale or cost.]" },
      { heading: "Proposed Approach", text: "[Your framework, method, or technology, explained clearly enough for a technical reader to evaluate.]" },
      { heading: "Conclusion", text: "[What follows from the analysis, and what remains open.]" },
      { heading: "References", text: "[1] [Source]\n[2] [Source]" },
    ],
  },
  {
    id: "workbook", name: "Workbook", category: "Digital", layout: "minimal", outlineOnly: true,
    title: "[Workbook Title]", meta: `${P} · ${D}`,
    sections: [
      { heading: "How To Use This Workbook", text: "[Explain the structure and how much time each section takes.]" },
      { heading: "Section 1 — [Title]", text: "[Short teaching content.]\n\nExercise:\n1. [Prompt] ______________________\n2. [Prompt] ______________________" },
      { heading: "Section 2 — [Title]", text: "[Short teaching content.]\n\nExercise:\n1. [Prompt] ______________________" },
      { heading: "Reflection", text: "What was your biggest takeaway? ______________________\nWhat will you do differently? ______________________" },
    ],
  },
  {
    id: "planner", name: "Planner", category: "Digital", layout: "minimal", outlineOnly: true,
    title: "[Planner Title]", meta: `${P} · [Period]`,
    sections: [
      { heading: "Period Goals", text: "1. [Goal] — Success looks like: [Measure]\n2. [Goal] — Success looks like: [Measure]\n3. [Goal] — Success looks like: [Measure]" },
      { heading: "Weekly Breakdown", text: "Week 1: [Focus]\nWeek 2: [Focus]\nWeek 3: [Focus]\nWeek 4: [Focus]" },
      { heading: "Priorities", text: "Must do: [Items]\nShould do: [Items]\nCould do: [Items]" },
      { heading: "Review", text: "What went well: ______________________\nWhat didn't: ______________________\nCarry forward: ______________________" },
    ],
  },
  {
    id: "journal", name: "Journal", category: "Digital", layout: "minimal", outlineOnly: true,
    title: "Journal — [Date]", meta: `${P}`,
    sections: [
      { heading: "Today's Focus", text: "[The one thing that matters most today.]" },
      { heading: "Entry", text: "[Free writing space.]" },
      { heading: "Wins", text: "· [Something that went well]\n· [Something that went well]" },
      { heading: "Lessons", text: "[What you learned, and what you'd do differently.]" },
      { heading: "Tomorrow", text: "[The first thing you'll do tomorrow.]" },
    ],
  },
  {
    id: "calendar", name: "Calendar", category: "Digital", layout: "modern", outlineOnly: true,
    title: "[Month Year] Calendar", meta: `${P}`,
    sections: [
      { heading: "Key Dates", text: "[Date] — [Event]\n[Date] — [Event]\n[Date] — [Event]" },
      { heading: "Deadlines", text: "[Date] — [Deliverable] — Owner: [Name]\n[Date] — [Deliverable] — Owner: [Name]" },
      { heading: "Recurring", text: "[Weekly] — [Event] — [Day, time]\n[Monthly] — [Event] — [Day, time]" },
      { heading: "Notes", text: "[Holidays, blackout periods, or anything affecting scheduling this month.]" },
    ],
  },
  {
    id: "digital-checklist", name: "Checklist (Digital)", category: "Digital", layout: "minimal",
    title: "[Checklist Title]", meta: `${P} · ${D}`,
    sections: [
      { heading: "Before You Start", text: "[ ] [Prerequisite]\n[ ] [Prerequisite]" },
      { heading: "Main Steps", text: "[ ] [Step]\n[ ] [Step]\n[ ] [Step]\n[ ] [Step]" },
      { heading: "Final Checks", text: "[ ] [Verification step]\n[ ] [Verification step]" },
      { heading: "Completed", text: "Completed by: ______________  Date: __________" },
    ],
  },

  // ── Forms ─────────────────────────────────────────────────────────────
  {
    id: "registration-form", name: "Registration Form", category: "Forms", layout: "modern",
    title: "Registration Form", meta: `${P} · ${D}`,
    sections: [
      { heading: "Personal Details", text: "Full name: ______________________\nDate of birth: ______________________\nEmail: ______________________\nPhone: ______________________\nAddress: ______________________" },
      { heading: "Registration Details", text: "Registering for: [Event / course / service]\nPreferred date or session: ______________________\nSpecial requirements: ______________________" },
      { heading: "Emergency Contact", text: "Name: ______________________\nRelationship: ______________________\nPhone: ______________________" },
      { heading: "Declaration", text: "I confirm the information provided is accurate.\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "survey-form", name: "Survey Form", category: "Forms", layout: "modern",
    title: "[Survey Title]", meta: `${P} · ${D}`,
    sections: [
      { heading: "Purpose", text: "[Why you're running this survey, how long it takes, and how responses will be used.]" },
      { heading: "About You (optional)", text: "Role: ______________________\nOrganization: ______________________\nHow long have you used [product/service]: ______________________" },
      { heading: "Questions", text: "1. [Question]\n   ( ) Strongly agree  ( ) Agree  ( ) Neutral  ( ) Disagree  ( ) Strongly disagree\n\n2. [Question]\n   ______________________\n\n3. [Question]\n   ______________________" },
      { heading: "Anything Else", text: "[Open space for anything the questions above didn't cover.]" },
    ],
  },
  {
    id: "feedback-form", name: "Feedback Form", category: "Forms", layout: "minimal",
    title: "Feedback Form", meta: `${P} · ${D}`,
    sections: [
      { heading: "Your Experience", text: "How would you rate your overall experience?\n( ) Excellent  ( ) Good  ( ) Fair  ( ) Poor" },
      { heading: "What Went Well", text: "______________________________________\n______________________________________" },
      { heading: "What Could Be Better", text: "______________________________________\n______________________________________" },
      { heading: "Would You Recommend Us?", text: "( ) Yes  ( ) No  ( ) Maybe\n\nWhy? ______________________________________" },
      { heading: "Contact (optional)", text: "Name: ______________  Email: ______________\n[ ] I'm happy to be contacted about this feedback" },
    ],
  },
  {
    id: "order-form", name: "Order Form", category: "Forms", layout: "modern",
    title: "Order Form", meta: `${P} · Order #[ORD-0001]`,
    sections: [
      { heading: "Customer Details", text: "Name: ______________________\nCompany: ______________________\nEmail: ______________________\nPhone: ______________________" },
      { heading: "Delivery Address", text: "______________________________________\n______________________________________" },
      { heading: "Items Ordered", text: "Item | Code | Qty | Unit price | Total\n[Item] | [Code] | [N] | [Amount] | [Amount]\n[Item] | [Code] | [N] | [Amount] | [Amount]\n\nSubtotal: [Amount]\nDelivery: [Amount]\nTotal: [Amount]" },
      { heading: "Payment & Authorisation", text: "Payment method: [ ] Bank transfer  [ ] Card  [ ] On account\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "contact-form", name: "Contact Form", category: "Forms", layout: "minimal",
    title: "Contact Us", meta: `${P}`,
    sections: [
      { heading: "Your Details", text: "Name: ______________________\nEmail: ______________________\nPhone (optional): ______________________\nCompany (optional): ______________________" },
      { heading: "How Can We Help?", text: "Subject: ______________________\n\nMessage:\n______________________________________\n______________________________________" },
      { heading: "Preferred Contact Method", text: "( ) Email  ( ) Phone  ( ) Either" },
      { heading: "Privacy", text: "We'll only use your details to respond to this enquiry. See our privacy policy for more." },
    ],
  },
  {
    id: "membership-form", name: "Membership Form", category: "Forms", layout: "modern",
    title: "Membership Application", meta: `${P} · ${D}`,
    sections: [
      { heading: "Applicant Details", text: "Full name: ______________________\nDate of birth: ______________________\nAddress: ______________________\nEmail: ______________________\nPhone: ______________________" },
      { heading: "Membership Type", text: "( ) [Tier] — [Amount] per [period]\n( ) [Tier] — [Amount] per [period]\n( ) [Tier] — [Amount] per [period]\n\nPreferred start date: ______________________" },
      { heading: "Payment", text: "Method: ( ) Direct debit  ( ) Card  ( ) Bank transfer\nBilling frequency: ( ) Monthly  ( ) Annually" },
      { heading: "Agreement", text: "I agree to abide by the rules and code of conduct of " + P + ".\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "application-form", name: "Application Form", category: "Forms", layout: "modern",
    title: "Application Form", meta: `${P} · [APP-0001]`,
    sections: [
      { heading: "Position Applied For", text: "Role: ______________________\nWhere you saw this role: ______________________\nEarliest start date: ______________________" },
      { heading: "Personal Details", text: "Full name: ______________________\nEmail: ______________________\nPhone: ______________________\nLocation: ______________________" },
      { heading: "Experience", text: "[Most recent role, employer, dates, and key responsibilities.]\n\n[Previous role, employer, dates.]" },
      { heading: "Why This Role", text: "[Why you're applying and what you'd bring — a few sentences.]" },
      { heading: "Declaration", text: "I confirm the information given is true and complete.\n\nSignature: ______________  Date: __________" },
    ],
  },
  {
    id: "evaluation-form", name: "Evaluation Form", category: "Forms", layout: "modern",
    title: "Evaluation Form", meta: `${P} · ${D}`,
    sections: [
      { heading: "What Is Being Evaluated", text: "Subject: [Person / course / vendor / project]\nEvaluator: ______________________\nDate: ______________________" },
      { heading: "Criteria", text: "Criterion | Score (1–5) | Comments\n[Criterion] | [ ] | ______________\n[Criterion] | [ ] | ______________\n[Criterion] | [ ] | ______________" },
      { heading: "Strengths", text: "______________________________________" },
      { heading: "Areas For Improvement", text: "______________________________________" },
      { heading: "Overall & Recommendation", text: "Overall score: [ ] / 5\nRecommendation: ( ) Proceed  ( ) Proceed with conditions  ( ) Do not proceed\n\nSignature: ______________  Date: __________" },
    ],
  },
];

export function templatesByCategory(category: string) {
  return documentTemplates.filter((t) => t.category === category);
}
