// src/data/documentsData.js
// Required documents for each service
// key = service name (must match seedData.js service names exactly)

export const DOCUMENTS_MAP = {

  // ─── TNeSevai ───
  'Ration Card - New Application': [
    'Aadhaar Card (all family members)',
    'Address Proof (Electricity bill / Rental agreement)',
    'Income Certificate or Salary Slip',
    'Passport size photos (2 nos)',
    'Mobile number linked to Aadhaar',
  ],
  'Ration Card - Name Correction': [
    'Original Ration Card',
    'Aadhaar Card',
    'Any document showing correct name (School certificate / Passport)',
  ],
  'Ration Card - Address Change': [
    'Original Ration Card',
    'New address proof (Electricity bill / Rental agreement)',
    'Aadhaar Card with new address',
  ],
  'Ration Card - Member Addition': [
    'Original Ration Card',
    'Birth Certificate (for child) / Marriage Certificate (for spouse)',
    'Aadhaar Card of new member',
    'Passport size photo of new member',
  ],
  'Ration Card - Member Deletion': [
    'Original Ration Card',
    'Death Certificate (if deceased) / Marriage Certificate (if married)',
    'Aadhaar Card of the member to be removed',
  ],
  'Ration Card - Surrender': [
    'Original Ration Card',
    'Aadhaar Card',
    'Surrender application letter',
  ],
  'Ration Card - Lost Card': [
    'FIR / Police complaint copy',
    'Aadhaar Card',
    'Passport size photo',
    'Address proof',
  ],
  'Birth Certificate': [
    'Hospital discharge summary / Birth record',
    'Parents Aadhaar Card',
    'Parents Marriage Certificate',
    'Address proof',
  ],
  'Death Certificate': [
    'Hospital death record / Doctor certificate',
    'Deceased person\'s Aadhaar Card',
    'Applicant\'s Aadhaar Card',
    'Address proof',
  ],
  'Community Certificate': [
    'Aadhaar Card',
    'Ration Card',
    'Father\'s Community Certificate (if available)',
    'School Transfer Certificate (TC)',
    'Passport size photo',
  ],
  'Income Certificate': [
    'Aadhaar Card',
    'Ration Card',
    'Salary Slip / Bank passbook (last 3 months)',
    'Employment proof or Self-declaration for self-employed',
    'Passport size photo',
  ],
  'Nativity Certificate': [
    'Aadhaar Card',
    'Ration Card',
    'Birth Certificate or School TC',
    'Father\'s Nativity Certificate (if available)',
    'Passport size photo',
  ],
  'Residence Certificate': [
    'Aadhaar Card',
    'Current address proof (Electricity bill / Rental agreement)',
    'Ration Card',
    'Passport size photo',
  ],
  'No Male Child Certificate': [
    'Aadhaar Card',
    'Ration Card',
    'Birth Certificates of all children',
    'Marriage Certificate',
    'Passport size photo',
  ],
  'Unmarried Certificate': [
    'Aadhaar Card',
    'Ration Card',
    'Affidavit (self-declaration on stamp paper)',
    'Passport size photo',
  ],
  'Legal Heir Certificate': [
    'Death Certificate of deceased',
    'Aadhaar Cards of all legal heirs',
    'Ration Card',
    'Affidavit on stamp paper',
    'Passport size photos',
  ],
  'Encumbrance Certificate (EC)': [
    'Property details (Survey number / Door number)',
    'Aadhaar Card',
    'Sale deed / Property documents',
    'Specify period required (from year to year)',
  ],
  'Patta Transfer': [
    'Sale deed / Gift deed / Inheritance documents',
    'Aadhaar Card',
    'Ration Card',
    'Previous Patta copy',
    'Chitta & Adangal',
    'Passport size photo',
  ],
  'Chitta / A-Register': [
    'Aadhaar Card',
    'Property survey number',
    'Previous Patta or land documents',
  ],
  'Old Age Pension Application': [
    'Aadhaar Card',
    'Age proof (Birth certificate / School TC)',
    'Ration Card',
    'Bank passbook (for direct benefit transfer)',
    'Passport size photo',
    'Income Certificate',
  ],
  'Widow Pension Application': [
    'Aadhaar Card',
    'Husband\'s Death Certificate',
    'Marriage Certificate',
    'Ration Card',
    'Bank passbook',
    'Income Certificate',
    'Passport size photo',
  ],
  'Disability Certificate': [
    'Aadhaar Card',
    'Medical Certificate from Government Hospital',
    'Ration Card',
    'Passport size photo',
    'Age proof',
  ],
  'Marriage Certificate': [
    'Aadhaar Cards of both bride and groom',
    'Age proof (Birth certificate / School TC) of both',
    'Address proof',
    'Wedding photos (2 nos)',
    'Witness Aadhaar Cards (2 witnesses)',
    'Passport size photos (2 each)',
  ],
  'First Graduate Certificate': [
    'Aadhaar Card',
    'Degree Certificate / Hall Ticket',
    'Parents\' educational certificates (to prove first graduate)',
    'Ration Card',
    'Passport size photo',
  ],
  'Agricultural Certificate': [
    'Aadhaar Card',
    'Patta / Chitta (land documents)',
    'Ration Card',
    'Passport size photo',
  ],
  'Small Business Certificate': [
    'Aadhaar Card',
    'Ration Card',
    'Shop / Trade License (if any)',
    'Business address proof',
    'Passport size photo',
  ],
  'Ration Card - Smart Card': [
    'Original Ration Card',
    'Aadhaar Cards of all family members',
    'Passport size photos of all members',
    'Mobile number',
  ],

  // ─── Digital Seva ───
  'PAN Card - New Application': [
    'Aadhaar Card (mandatory)',
    'Date of Birth proof (Birth certificate / School TC)',
    'Passport size photo (2 nos)',
    'Mobile number linked to Aadhaar',
    'Email ID',
  ],
  'PAN Card - Correction': [
    'Existing PAN Card copy',
    'Aadhaar Card',
    'Document proving the correct information (Name / DOB)',
    'Passport size photo',
  ],
  'PAN Card - Reprint / Duplicate': [
    'Existing PAN number',
    'Aadhaar Card',
    'Passport size photo',
    'Mobile number',
  ],
  'Passport - Fresh Application': [
    'Aadhaar Card (mandatory)',
    'Birth Certificate or Class 10 Marksheet (DOB proof)',
    'Address proof (Aadhaar / Voter ID / Electricity bill)',
    'Passport size photos (4 nos — white background)',
    'Non-ECR proof if applicable (Graduate certificate)',
  ],
  'Passport - Renewal': [
    'Old Passport (original)',
    'Aadhaar Card',
    'Address proof',
    'Passport size photos (4 nos — white background)',
  ],
  'Voter ID - New Registration': [
    'Aadhaar Card',
    'Age proof (must be 18+)',
    'Address proof',
    'Passport size photo',
  ],
  'Voter ID - Correction': [
    'Existing Voter ID card',
    'Document with correct information',
    'Aadhaar Card',
  ],
  'Voter ID - Address Change': [
    'Existing Voter ID card',
    'New address proof (Aadhaar / Electricity bill)',
  ],
  'Voter ID - Download / e-EPIC': [
    'Voter ID number (EPIC number)',
    'Registered mobile number',
  ],
  'Driving Licence - New (LLR)': [
    'Aadhaar Card',
    'Age proof (must be 16+ for 2-wheeler, 18+ for 4-wheeler)',
    'Address proof',
    'Passport size photos (2 nos)',
    'Medical fitness certificate (Form 1A)',
  ],
  'Driving Licence - Permanent': [
    'Learner\'s Licence (LLR)',
    'Aadhaar Card',
    'Passport size photos (2 nos)',
    'Driving school certificate (if any)',
  ],
  'Driving Licence - Renewal': [
    'Original Driving Licence',
    'Aadhaar Card',
    'Medical fitness certificate (for transport vehicles)',
    'Passport size photo',
  ],
  'Driving Licence - Address Change': [
    'Original Driving Licence',
    'New address proof (Aadhaar with new address)',
    'Passport size photo',
  ],
  'Aadhar - Mobile Number Link': [
    'Original Aadhaar Card',
    'Mobile number to be linked',
    'Personal presence required (biometric)',
  ],
  'Aadhar - Name / DOB Correction': [
    'Supporting document with correct name (School TC / Passport / Birth Certificate)',
    'Aadhaar Card (original)',
    'Mobile number linked to Aadhaar',
  ],
  'Aadhar - Address Update': [
    'Aadhaar Card (original)',
    'New address proof (Electricity bill / Rental agreement / Bank passbook)',
    'Mobile number linked to Aadhaar',
  ],
  'Aadhar - Enrolment (New)': [
    'Any one ID proof (Ration Card / Passport / Voter ID / Bank passbook)',
    'Any one Address proof',
    'Date of Birth proof',
    'Personal presence required (biometric)',
  ],
  'Aadhar - Download / e-Aadhar': [
    'Aadhaar number or Enrolment ID',
    'Registered mobile number (for OTP)',
  ],
  'Mobile Recharge - All Networks': [
    'Mobile number to recharge',
    'Recharge amount',
  ],
  'DTH Recharge': [
    'DTH Customer ID / Subscriber ID',
    'Recharge amount / Pack name',
  ],
  'Electricity Bill Payment': [
    'TANGEDCO Consumer Number (on bill)',
    'Payment amount',
  ],
  'Water Bill Payment': [
    'Consumer number (on water bill)',
    'Payment amount',
  ],
  'Property Tax Payment': [
    'Assessment number (on property tax receipt)',
    'Door number / Survey number',
  ],
  'Bus Pass Application': [
    'Aadhaar Card',
    'School / College ID card (for student pass)',
    'Passport size photo (2 nos)',
    'Route details (from — to)',
  ],
  'Print & Xerox (Color)': [
    'Soft copy (USB / Email / Google Drive)',
    'Or bring original document for xerox',
  ],
  'Photo (Passport / ID Size)': [
    'Personal presence required',
    'Specify size required (Passport / Stamp / ID card)',
    'Specify background color if needed',
  ],
  'Scanning Service': [
    'Original document to scan',
    'Specify output format (PDF / JPG)',
    'Email ID to receive scanned file',
  ],
  'Lamination': [
    'Original document or ID card to laminate',
  ],

  // ─── TNPSC ───
  'TNPSC Group 1 Application': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate (BC / MBC / SC / ST)',
    'Educational qualification certificates',
    'Email ID and Mobile number',
    'Passport size photo (white background)',
    'Signature (digital / scanned)',
  ],
  'TNPSC Group 2 Application': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate',
    'Educational qualification certificates',
    'Email ID and Mobile number',
    'Passport size photo (white background)',
    'Signature (digital / scanned)',
  ],
  'TNPSC Group 2A Application': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate',
    'Educational qualification certificates',
    'Email ID and Mobile number',
    'Passport size photo',
    'Signature (digital / scanned)',
  ],
  'TNPSC Group 4 / CCSE IV': [
    'Aadhaar Card',
    'Date of Birth proof (Class 10 marksheet)',
    'Community Certificate',
    'Class 10 & 12 certificates',
    'Email ID and Mobile number',
    'Passport size photo (white background, 20–50 KB)',
    'Signature (10–30 KB)',
  ],
  'TNPSC VAO Application': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate',
    'Class 10 & 12 certificates',
    'Email ID and Mobile number',
    'Passport size photo',
    'Signature',
  ],
  'TN Police SI Recruitment': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate',
    'Educational certificates (Degree)',
    'Email ID and Mobile number',
    'Passport size photo',
    'Signature',
  ],
  'TN Police PC Recruitment': [
    'Aadhaar Card',
    'Date of Birth proof (Class 10)',
    'Community Certificate',
    'Class 10 & 12 certificates',
    'Email ID and Mobile number',
    'Passport size photo',
    'Signature',
  ],
  'TN Forest Guard Recruitment': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate',
    'Class 10 & 12 certificates',
    'Email ID and Mobile number',
    'Passport size photo',
  ],
  'TN TRB Teachers Recruitment': [
    'Aadhaar Card',
    'Date of Birth proof',
    'Community Certificate',
    'Degree / B.Ed certificates',
    'TET / TNTET certificate',
    'Email ID and Mobile number',
    'Passport size photo',
    'Signature',
  ],

  // ─── Education ───
  'NEET UG Application': [
    'Aadhaar Card',
    'Class 10 marksheet (DOB proof)',
    'Class 12 marksheet (PCB subjects mandatory)',
    'Passport size photo (white background, 10–200 KB)',
    'Signature (3–30 KB)',
    'Category certificate if applicable (SC/ST/OBC)',
    'Mobile number and Email ID',
  ],
  'NEET PG Application': [
    'Aadhaar Card',
    'MBBS Certificate / Degree',
    'Internship completion certificate',
    'MCI / NMC registration certificate',
    'Passport size photo',
    'Signature',
    'Email ID and Mobile number',
  ],
  'JEE Main Application': [
    'Aadhaar Card',
    'Class 10 marksheet (DOB proof)',
    'Class 12 marksheet / Appearing proof',
    'Passport size photo (white background)',
    'Signature',
    'Email ID and Mobile number',
  ],
  'TNEA Application': [
    'Aadhaar Card',
    'Class 10 marksheet',
    'Class 12 marksheet',
    'Community Certificate',
    'First Graduate Certificate (if applicable)',
    'Passport size photo',
    'Email ID and Mobile number',
  ],
  'Scholarship Application': [
    'Aadhaar Card',
    'Community Certificate (BC / MBC / SC / ST)',
    'Income Certificate (family annual income)',
    'Previous year marksheets',
    'Bank passbook (for direct transfer)',
    'Bonafide certificate from school/college',
    'Passport size photo',
  ],
  'School TC / Study Certificate': [
    'Aadhaar Card',
    'Previous school ID card',
    'Fee receipt / Admission slip',
    'Passport size photo',
  ],
  'Degree Certificate Verification': [
    'Original Degree Certificate',
    'Aadhaar Card',
    'Hall ticket / Register number',
  ],
};

// Get documents for a service by name
export function getDocuments(serviceName) {
  if (!serviceName) return [];
  // Exact match first
  if (DOCUMENTS_MAP[serviceName]) return DOCUMENTS_MAP[serviceName];
  // Partial match
  const key = Object.keys(DOCUMENTS_MAP).find(k =>
    k.toLowerCase().includes(serviceName.toLowerCase()) ||
    serviceName.toLowerCase().includes(k.toLowerCase())
  );
  return key ? DOCUMENTS_MAP[key] : [];
}
