// src/data/seedData.js
// Complete TNeSevai, Digital Seva, TNPSC, Education services list

export const ALL_SERVICES = [

  // ─────────────────────────────────────────────
  // TNeSevai Services
  // ─────────────────────────────────────────────
  { name: 'Ration Card - New Application', nameTa: 'ரேஷன் கார்டு - புதிய விண்ணப்பம்', icon: '🍚', category: 'tnesevai', desc: 'Apply for new ration card', descTa: 'புதிய ரேஷன் கார்டுக்கு விண்ணப்பிக்கவும்' },
  { name: 'Ration Card - Name Correction', nameTa: 'ரேஷன் கார்டு - பெயர் திருத்தம்', icon: '📝', category: 'tnesevai', desc: 'Correct name on ration card', descTa: 'ரேஷன் கார்டில் பெயர் திருத்தம்' },
  { name: 'Ration Card - Address Change', nameTa: 'ரேஷன் கார்டு - முகவரி மாற்றம்', icon: '🏠', category: 'tnesevai', desc: 'Update address on ration card', descTa: 'ரேஷன் கார்டில் முகவரி புதுப்பிக்கவும்' },
  { name: 'Ration Card - Member Addition', nameTa: 'ரேஷன் கார்டு - உறுப்பினர் சேர்க்கை', icon: '👨‍👩‍👧', category: 'tnesevai', desc: 'Add new family member to ration card', descTa: 'ரேஷன் கார்டில் புதிய உறுப்பினர் சேர்க்கை' },
  { name: 'Ration Card - Member Deletion', nameTa: 'ரேஷன் கார்டு - உறுப்பினர் நீக்கம்', icon: '🗑️', category: 'tnesevai', desc: 'Remove member from ration card', descTa: 'ரேஷன் கார்டிலிருந்து உறுப்பினர் நீக்கம்' },
  { name: 'Ration Card - Surrender', nameTa: 'ரேஷன் கார்டு - ஒப்படைப்பு', icon: '↩️', category: 'tnesevai', desc: 'Surrender ration card', descTa: 'ரேஷன் கார்டு ஒப்படைப்பு' },
  { name: 'Ration Card - Lost Card', nameTa: 'ரேஷன் கார்டு - தொலைந்த கார்டு', icon: '🔍', category: 'tnesevai', desc: 'Apply for lost ration card duplicate', descTa: 'தொலைந்த ரேஷன் கார்டு நகல் விண்ணப்பம்' },
  { name: 'Birth Certificate', nameTa: 'பிறப்பு சான்றிதழ்', icon: '👶', category: 'tnesevai', desc: 'Apply and download birth certificate', descTa: 'பிறப்பு சான்றிதழ் விண்ணப்பம் & பதிவிறக்கம்' },
  { name: 'Death Certificate', nameTa: 'இறப்பு சான்றிதழ்', icon: '📜', category: 'tnesevai', desc: 'Apply and download death certificate', descTa: 'இறப்பு சான்றிதழ் விண்ணப்பம் & பதிவிறக்கம்' },
  { name: 'Community Certificate', nameTa: 'சாதி சான்றிதழ்', icon: '📋', category: 'tnesevai', desc: 'All community certificates (BC, MBC, SC, ST)', descTa: 'அனைத்து சாதி சான்றிதழ்கள் (BC, MBC, SC, ST)' },
  { name: 'Income Certificate', nameTa: 'வருமான சான்றிதழ்', icon: '💰', category: 'tnesevai', desc: 'Annual income certificate', descTa: 'ஆண்டு வருமான சான்றிதழ்' },
  { name: 'Nativity Certificate', nameTa: 'பூர்வீக சான்றிதழ்', icon: '🏡', category: 'tnesevai', desc: 'Nativity / domicile certificate', descTa: 'பூர்வீக / ஆதிக்கால சான்றிதழ்' },
  { name: 'Residence Certificate', nameTa: 'வசிப்பிட சான்றிதழ்', icon: '🏘️', category: 'tnesevai', desc: 'Residence / address proof certificate', descTa: 'வசிப்பிட / முகவரி சான்றிதழ்' },
  { name: 'No Male Child Certificate', nameTa: 'ஆண் குழந்தை இல்லை சான்றிதழ்', icon: '📄', category: 'tnesevai', desc: 'Certificate for no male child', descTa: 'ஆண் குழந்தை இல்லை என்ற சான்றிதழ்' },
  { name: 'Unmarried Certificate', nameTa: 'திருமணமாகாத சான்றிதழ்', icon: '💍', category: 'tnesevai', desc: 'Unmarried / bachelor certificate', descTa: 'திருமணமாகாத சான்றிதழ்' },
  { name: 'Legal Heir Certificate', nameTa: 'சட்டபூர்வ வாரிசு சான்றிதழ்', icon: '⚖️', category: 'tnesevai', desc: 'Legal heir / successors certificate', descTa: 'சட்டபூர்வ வாரிசு சான்றிதழ்' },
  { name: 'Encumbrance Certificate (EC)', nameTa: 'வில்லங்க சான்றிதழ் (EC)', icon: '📑', category: 'tnesevai', desc: 'Property encumbrance certificate', descTa: 'சொத்து வில்லங்க சான்றிதழ்' },
  { name: 'Patta Transfer', nameTa: 'பட்டா மாற்றம்', icon: '🏛️', category: 'tnesevai', desc: 'Land patta name transfer', descTa: 'நில பட்டா பெயர் மாற்றம்' },
  { name: 'Chitta / A-Register', nameTa: 'சிட்டா / A-பதிவேடு', icon: '📒', category: 'tnesevai', desc: 'Land chitta and A-register copy', descTa: 'நில சிட்டா மற்றும் A-பதிவேடு நகல்' },
  { name: 'Old Age Pension Application', nameTa: 'முதியோர் ஓய்வூதிய விண்ணப்பம்', icon: '👴', category: 'tnesevai', desc: 'Chief Minister old age pension scheme', descTa: 'முதலமைச்சர் முதியோர் ஓய்வூதிய திட்டம்' },
  { name: 'Widow Pension Application', nameTa: 'விதவை ஓய்வூதிய விண்ணப்பம்', icon: '👩', category: 'tnesevai', desc: 'Widow pension scheme application', descTa: 'விதவை ஓய்வூதிய திட்ட விண்ணப்பம்' },
  { name: 'Disability Certificate', nameTa: 'மாற்றுத்திறனாளி சான்றிதழ்', icon: '♿', category: 'tnesevai', desc: 'Disability certificate application', descTa: 'மாற்றுத்திறனாளி சான்றிதழ் விண்ணப்பம்' },
  { name: 'Marriage Certificate', nameTa: 'திருமண சான்றிதழ்', icon: '💒', category: 'tnesevai', desc: 'Register and get marriage certificate', descTa: 'திருமண சான்றிதழ் பதிவு மற்றும் பெறுதல்' },
  { name: 'First Graduate Certificate', nameTa: 'முதல் பட்டதாரி சான்றிதழ்', icon: '🎓', category: 'tnesevai', desc: 'First graduate in family certificate', descTa: 'குடும்பத்தில் முதல் பட்டதாரி சான்றிதழ்' },
  { name: 'Agricultural Certificate', nameTa: 'விவசாயி சான்றிதழ்', icon: '🌾', category: 'tnesevai', desc: 'Farmer / agricultural land certificate', descTa: 'விவசாயி / விவசாய நில சான்றிதழ்' },
  { name: 'Small Business Certificate', nameTa: 'சிறு வணிக சான்றிதழ்', icon: '🏪', category: 'tnesevai', desc: 'Small / micro business certificate', descTa: 'சிறு / நுண் வணிக சான்றிதழ்' },
  { name: 'Ration Card - Smart Card', nameTa: 'ரேஷன் கார்டு - ஸ்மார்ட் கார்டு', icon: '💳', category: 'tnesevai', desc: 'Convert to smart ration card', descTa: 'ஸ்மார்ட் ரேஷன் கார்டாக மாற்றவும்' },

  // ─────────────────────────────────────────────
  // Digital Seva Services
  // ─────────────────────────────────────────────
  { name: 'PAN Card - New Application', nameTa: 'பான் கார்டு - புதிய விண்ணப்பம்', icon: '💳', category: 'digitalSeva', desc: 'Apply for new PAN card (Form 49A)', descTa: 'புதிய PAN கார்டுக்கு விண்ணப்பிக்கவும்' },
  { name: 'PAN Card - Correction', nameTa: 'பான் கார்டு - திருத்தம்', icon: '🔄', category: 'digitalSeva', desc: 'Name, DOB, address, signature correction', descTa: 'பெயர், பிறந்த தேதி, முகவரி திருத்தம்' },
  { name: 'PAN Card - Reprint / Duplicate', nameTa: 'பான் கார்டு - மறுபிரிண்ட்', icon: '🖨️', category: 'digitalSeva', desc: 'Reprint lost or damaged PAN card', descTa: 'தொலைந்த அல்லது சேதமடைந்த PAN கார்டு மறுபிரிண்ட்' },
  { name: 'Passport - Fresh Application', nameTa: 'பாஸ்போர்ட் - புதிய விண்ணப்பம்', icon: '✈️', category: 'digitalSeva', desc: 'Apply for new passport online', descTa: 'புதிய பாஸ்போர்ட்டுக்கு ஆன்லைனில் விண்ணப்பிக்கவும்' },
  { name: 'Passport - Renewal', nameTa: 'பாஸ்போர்ட் - புதுப்பித்தல்', icon: '🔁', category: 'digitalSeva', desc: 'Renew expired or expiring passport', descTa: 'காலாவதியான பாஸ்போர்ட் புதுப்பித்தல்' },
  { name: 'Voter ID - New Registration', nameTa: 'வாக்காளர் அட்டை - புதிய பதிவு', icon: '🗳️', category: 'digitalSeva', desc: 'Register as new voter (Form 6)', descTa: 'புதிய வாக்காளராக பதிவு செய்யவும்' },
  { name: 'Voter ID - Correction', nameTa: 'வாக்காளர் அட்டை - திருத்தம்', icon: '✏️', category: 'digitalSeva', desc: 'Name, DOB, address correction (Form 8)', descTa: 'பெயர், பிறந்த தேதி திருத்தம்' },
  { name: 'Voter ID - Address Change', nameTa: 'வாக்காளர் அட்டை - முகவரி மாற்றம்', icon: '📍', category: 'digitalSeva', desc: 'Change address in voter ID (Form 8A)', descTa: 'வாக்காளர் அட்டையில் முகவரி மாற்றம்' },
  { name: 'Voter ID - Download / e-EPIC', nameTa: 'வாக்காளர் அட்டை - பதிவிறக்கம்', icon: '📥', category: 'digitalSeva', desc: 'Download e-EPIC voter ID card', descTa: 'e-EPIC வாக்காளர் அட்டை பதிவிறக்கம்' },
  { name: 'Driving Licence - New (LLR)', nameTa: 'ஓட்டுனர் உரிமம் - புதிய (LLR)', icon: '🚗', category: 'digitalSeva', desc: 'Apply for new learner licence', descTa: 'புதிய LLR ஓட்டுனர் உரிமம்' },
  { name: 'Driving Licence - Permanent', nameTa: 'ஓட்டுனர் உரிமம் - நிரந்தர', icon: '🚗', category: 'digitalSeva', desc: 'Apply for permanent driving licence', descTa: 'நிரந்தர ஓட்டுனர் உரிமம் விண்ணப்பம்' },
  { name: 'Driving Licence - Renewal', nameTa: 'ஓட்டுனர் உரிமம் - புதுப்பித்தல்', icon: '🔃', category: 'digitalSeva', desc: 'Renew driving licence', descTa: 'ஓட்டுனர் உரிமம் புதுப்பித்தல்' },
  { name: 'Driving Licence - Address Change', nameTa: 'ஓட்டுனர் உரிமம் - முகவரி மாற்றம்', icon: '📮', category: 'digitalSeva', desc: 'Change address in driving licence', descTa: 'ஓட்டுனர் உரிமத்தில் முகவரி மாற்றம்' },
  { name: 'Aadhar - Mobile Number Link', nameTa: 'ஆதார் - மொபைல் இணைப்பு', icon: '📱', category: 'digitalSeva', desc: 'Link mobile number with Aadhar', descTa: 'ஆதாருடன் மொபைல் எண் இணைக்கவும்' },
  { name: 'Aadhar - Name / DOB Correction', nameTa: 'ஆதார் - பெயர் / பிறந்த தேதி திருத்தம்', icon: '✏️', category: 'digitalSeva', desc: 'Correct name or date of birth in Aadhar', descTa: 'ஆதாரில் பெயர் அல்லது பிறந்த தேதி திருத்தம்' },
  { name: 'Aadhar - Address Update', nameTa: 'ஆதார் - முகவரி புதுப்பிப்பு', icon: '🏠', category: 'digitalSeva', desc: 'Update address in Aadhar card', descTa: 'ஆதார் கார்டில் முகவரி புதுப்பிக்கவும்' },
  { name: 'Aadhar - Enrolment (New)', nameTa: 'ஆதார் - புதிய பதிவு', icon: '🆔', category: 'digitalSeva', desc: 'New Aadhar card enrolment', descTa: 'புதிய ஆதார் கார்டு பதிவு' },
  { name: 'Aadhar - Download / e-Aadhar', nameTa: 'ஆதார் - பதிவிறக்கம்', icon: '📲', category: 'digitalSeva', desc: 'Download e-Aadhar from UIDAI', descTa: 'UIDAI இலிருந்து e-Aadhar பதிவிறக்கம்' },
  { name: 'Mobile Recharge - All Networks', nameTa: 'மொபைல் ரீசார்ஜ் - அனைத்து நெட்வொர்க்', icon: '📶', category: 'digitalSeva', desc: 'Airtel, Jio, BSNL, Vi recharge', descTa: 'Airtel, Jio, BSNL, Vi ரீசார்ஜ்' },
  { name: 'DTH Recharge', nameTa: 'DTH ரீசார்ஜ்', icon: '📺', category: 'digitalSeva', desc: 'Tata Sky, Airtel DTH, Sun Direct recharge', descTa: 'Tata Sky, Airtel DTH, Sun Direct ரீசார்ஜ்' },
  { name: 'Electricity Bill Payment', nameTa: 'மின் கட்டண செலுத்துதல்', icon: '⚡', category: 'digitalSeva', desc: 'TANGEDCO electricity bill payment', descTa: 'TANGEDCO மின் கட்டண செலுத்துதல்' },
  { name: 'Water Bill Payment', nameTa: 'தண்ணீர் கட்டண செலுத்துதல்', icon: '💧', category: 'digitalSeva', desc: 'Water bill / tax payment online', descTa: 'தண்ணீர் கட்டண செலுத்துதல்' },
  { name: 'Property Tax Payment', nameTa: 'சொத்து வரி செலுத்துதல்', icon: '🏘️', category: 'digitalSeva', desc: 'Local body property tax payment', descTa: 'உள்ளாட்சி சொத்து வரி செலுத்துதல்' },
  { name: 'Bus Pass Application', nameTa: 'பேருந்து பாஸ் விண்ணப்பம்', icon: '🚌', category: 'digitalSeva', desc: 'Student / monthly bus pass application', descTa: 'மாணவர் / மாதாந்திர பேருந்து பாஸ்' },
  { name: 'Print & Xerox (Color)', nameTa: 'பிரிண்ட் & ஸீரோக்ஸ் (வண்ண)', icon: '🖨️', category: 'digitalSeva', desc: 'Color and B/W printing service', descTa: 'வண்ண மற்றும் கருப்பு வெள்ளை பிரிண்ட்' },
  { name: 'Photo (Passport / ID Size)', nameTa: 'புகைப்படம் (பாஸ்போர்ட் / ID)', icon: '📸', category: 'digitalSeva', desc: 'Passport size, stamp size, ID photos', descTa: 'பாஸ்போர்ட் அளவு, முத்திரை அளவு புகைப்படம்' },
  { name: 'Scanning Service', nameTa: 'ஸ்கேனிங் சேவை', icon: '🔍', category: 'digitalSeva', desc: 'Document scanning and PDF conversion', descTa: 'ஆவண ஸ்கேன் மற்றும் PDF மாற்றம்' },
  { name: 'Lamination', nameTa: 'லேமினேஷன்', icon: '📄', category: 'digitalSeva', desc: 'ID card and document lamination', descTa: 'ID கார்டு மற்றும் ஆவண லேமினேஷன்' },
  { name: 'Email / Internet Assistance', nameTa: 'மின்னஞ்சல் / இணையம் உதவி', icon: '💻', category: 'digitalSeva', desc: 'Help with email, forms, online submissions', descTa: 'மின்னஞ்சல், ஆன்லைன் படிவம் உதவி' },

  // ─────────────────────────────────────────────
  // TNPSC Services
  // ─────────────────────────────────────────────
  { name: 'TNPSC Group 1 Application', nameTa: 'TNPSC குழு 1 விண்ணப்பம்', icon: '🏆', category: 'tnpsc', desc: 'TNPSC Group 1 Combined Civil Services', descTa: 'TNPSC குழு 1 ஒருங்கிணைந்த சிவில் சேவைகள்' },
  { name: 'TNPSC Group 2 Application', nameTa: 'TNPSC குழு 2 விண்ணப்பம்', icon: '🥈', category: 'tnpsc', desc: 'TNPSC Group 2 Interview / Non-interview posts', descTa: 'TNPSC குழு 2 நேர்காணல் / நேர்காணல் இல்லாத பணிகள்' },
  { name: 'TNPSC Group 2A Application', nameTa: 'TNPSC குழு 2A விண்ணப்பம்', icon: '📋', category: 'tnpsc', desc: 'TNPSC Group 2A Non-interview posts', descTa: 'TNPSC குழு 2A நேர்காணல் இல்லாத பணிகள்' },
  { name: 'TNPSC Group 4 / CCSE IV', nameTa: 'TNPSC குழு 4 / CCSE IV', icon: '📝', category: 'tnpsc', desc: 'TNPSC Group 4 Combined Sub. Services Exam', descTa: 'TNPSC குழு 4 ஒருங்கிணைந்த சேவைகள் தேர்வு' },
  { name: 'TNPSC VAO Application', nameTa: 'TNPSC VAO விண்ணப்பம்', icon: '🏘️', category: 'tnpsc', desc: 'Village Administrative Officer recruitment', descTa: 'கிராம நிர்வாக அலுவலர் ஆட்சேர்ப்பு' },
  { name: 'TNPSC CCSE I Application', nameTa: 'TNPSC CCSE I விண்ணப்பம்', icon: '🎖️', category: 'tnpsc', desc: 'Combined Civil Services Exam – I', descTa: 'ஒருங்கிணைந்த சிவில் சேவைகள் தேர்வு – I' },
  { name: 'TN Police SI Recruitment', nameTa: 'TN போலீஸ் SI ஆட்சேர்ப்பு', icon: '👮', category: 'tnpsc', desc: 'Sub-Inspector of Police recruitment', descTa: 'துணை ஆய்வாளர் ஆட்சேர்ப்பு' },
  { name: 'TN Police PC Recruitment', nameTa: 'TN போலீஸ் PC ஆட்சேர்ப்பு', icon: '🚔', category: 'tnpsc', desc: 'Police Constable recruitment application', descTa: 'காவல் துறை ஆட்கொணர்வு விண்ணப்பம்' },
  { name: 'TN Forest Guard Recruitment', nameTa: 'TN வனக் காவலர் ஆட்சேர்ப்பு', icon: '🌲', category: 'tnpsc', desc: 'Forest Guard / Watcher recruitment', descTa: 'வனக் காவலர் / கண்காணிப்பாளர் ஆட்சேர்ப்பு' },
  { name: 'TN TRB Teachers Recruitment', nameTa: 'TN TRB ஆசிரியர் ஆட்சேர்ப்பு', icon: '👩‍🏫', category: 'tnpsc', desc: 'TRB PG / UG / BT Teacher recruitment', descTa: 'TRB PG / UG / BT ஆசிரியர் ஆட்சேர்ப்பு' },
  { name: 'TNUSRB Recruitment', nameTa: 'TNUSRB ஆட்சேர்ப்பு', icon: '🔰', category: 'tnpsc', desc: 'TN Uniformed Services Recruitment Board', descTa: 'TN சீருடை சேவை ஆட்சேர்ப்பு குழு' },
  { name: 'SSC / UPSC Application Assistance', nameTa: 'SSC / UPSC விண்ணப்ப உதவி', icon: '🇮🇳', category: 'tnpsc', desc: 'Central govt exam application assistance', descTa: 'மத்திய அரசு தேர்வு விண்ணப்ப உதவி' },

  // ─────────────────────────────────────────────
  // Education Services
  // ─────────────────────────────────────────────
  { name: 'NEET UG Application', nameTa: 'NEET UG விண்ணப்பம்', icon: '🩺', category: 'education', desc: 'National Eligibility cum Entrance Test UG', descTa: 'NEET UG மருத்துவ நுழைவு தேர்வு விண்ணப்பம்' },
  { name: 'NEET PG Application', nameTa: 'NEET PG விண்ணப்பம்', icon: '👨‍⚕️', category: 'education', desc: 'NEET PG Medical post graduate entrance', descTa: 'NEET PG மருத்துவ முதுகலை நுழைவு' },
  { name: 'JEE Main Application', nameTa: 'JEE Main விண்ணப்பம்', icon: '⚙️', category: 'education', desc: 'JEE Main Engineering Entrance Exam', descTa: 'JEE Main பொறியியல் நுழைவு தேர்வு' },
  { name: 'TNEA Application', nameTa: 'TNEA விண்ணப்பம்', icon: '🏗️', category: 'education', desc: 'TN Engineering Admissions counselling', descTa: 'TN பொறியியல் சேர்க்கை ஆலோசனை' },
  { name: 'TNEAMCAP Application', nameTa: 'TNEAMCAP விண்ணப்பம்', icon: '🎨', category: 'education', desc: 'TN Arts & Science college admission', descTa: 'TN கலை & அறிவியல் கல்லூரி சேர்க்கை' },
  { name: 'Scholarship Application', nameTa: 'உதவித்தொகை விண்ணப்பம்', icon: '🎓', category: 'education', desc: 'BC / MBC / SC / ST / Minority scholarships', descTa: 'BC / MBC / SC / ST / சிறுபான்மை உதவித்தொகை' },
  { name: 'School TC / Study Certificate', nameTa: 'பள்ளி TC / படிப்பு சான்றிதழ்', icon: '🏫', category: 'education', desc: 'Transfer certificate / study certificate', descTa: 'மாற்று சான்றிதழ் / படிப்பு சான்றிதழ்' },
  { name: 'Degree Certificate Verification', nameTa: 'பட்ட சான்றிதழ் சரிபார்ப்பு', icon: '📜', category: 'education', desc: 'Online degree / mark sheet verification', descTa: 'ஆன்லைன் பட்ட / மதிப்பெண் சான்றிதழ் சரிபார்ப்பு' },
  { name: 'EMIS School Services', nameTa: 'EMIS பள்ளி சேவைகள்', icon: '🏫', category: 'education', desc: 'School EMIS portal services', descTa: 'பள்ளி EMIS போர்டல் சேவைகள்' },
];

// ─────────────────────────────────────────────────────────────────────────────
// REAL ACTIVE EXAM DATES — Updated March 2026
// Sources: tnpsc.gov.in Annual Planner 2026 | neet.nta.nic.in | NTA official
// ─────────────────────────────────────────────────────────────────────────────
export const CURRENT_EXAMS = [

  {
    name: 'NEET UG 2026',
    nameTa: 'NEET UG 2026',
    icon: '🩺',
    body: 'National Testing Agency (NTA)',
    lastDate: '2026-03-11',
    examDate: '2026-05-03',
    status: 'ongoing',
    applyLink: 'https://neet.nta.nic.in',
    note: 'Registration closed. Exam on 3 May 2026.',
  },

  {
    name: 'TNPSC Group 2A Mains 2026',
    nameTa: 'TNPSC குழு 2A மெயின்ஸ் 2026',
    icon: '📋',
    body: 'Tamil Nadu Public Service Commission',
    lastDate: '2026-03-02',
    examDate: '2026-03-15',
    status: 'ongoing',
    applyLink: 'https://www.tnpsc.gov.in',
    note: 'Mains exam on 15 March 2026.',
  },

  {
    name: 'TNPSC CTS Exam 2026',
    nameTa: 'TNPSC CTS தேர்வு 2026',
    icon: '⚙️',
    body: 'Tamil Nadu Public Service Commission',
    lastDate: '2026-03-12',
    examDate: '2026-03-22',
    status: 'ongoing',
    applyLink: 'https://www.tnpsc.gov.in',
    note: 'CBT exam: 22–25 March 2026.',
  }

];

export const ALL_EXAMS = CURRENT_EXAMS;