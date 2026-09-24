import { useState } from 'react'

const labels = {
  en: {
    profile: 'Personal Profile',
    financial: 'Financial Details',
    age: 'Age',
    gender: 'Gender',
    state: 'State / Union Territory',
    income: 'Annual Family Income',
    incomeRange: 'Income Range',
    occupation: 'Occupation',
    select: 'Select an option',
    female: 'Female',
    male: 'Male',
    other: 'Other',

    student: 'Student',
    schoolStudent: 'School Student',
    collegeStudent: 'College Student',
    farmer: 'Farmer',
    governmentEmployee: 'Government Employee',
    privateEmployee: 'Private Employee',
    businessOwner: 'Business Owner',
    selfEmployed: 'Self-employed',
    dailyWage: 'Daily Wage Worker',
    homemaker: 'Homemaker',
    unemployed: 'Unemployed',
    seniorCitizen: 'Senior Citizen',
    artisan: 'Artisan / Craftsperson',
    streetVendor: 'Street Vendor',
    otherOccupation: 'Other',

    below1L: 'Below ₹1 Lakh',
    oneTo2L: '₹1 Lakh – ₹2 Lakh',
    twoTo3L: '₹2 Lakh – ₹3 Lakh',
    threeTo5L: '₹3 Lakh – ₹5 Lakh',
    above5L: 'Above ₹5 Lakh',
    enterManually: 'Enter income manually',

    residence: 'Residence',
    rural: 'Rural',
    urban: 'Urban',

    houseStatus: 'House Ownership',
    ownHouse: 'Own House',
    rentedHouse: 'Rented House',
    noPermanentHouse: 'No Permanent House',
    otherHouse: 'Other',

    additional: 'Additional Eligibility Details',
    studentStatus: 'Student Status',
    educationLevel: 'Education Level',
    course: 'Course / Study Area',

    farmerStatus: 'Farmer Status',
    landOwnership: 'Land Ownership',
    landSize: 'Land Size',

    employmentType: 'Employment Type',
    salaryRange: 'Salary / Income Range',

    businessType: 'Business Type',

    maritalStatus: 'Marital Status',
    married: 'Married',
    unmarried: 'Unmarried',

    socialCategory: 'Social Category',
    general: 'General',
    sc: 'SC',
    st: 'ST',
    bc: 'BC',
    minority: 'Minority',

    disabilityStatus: 'Disability Status',
    yes: 'Yes',
    no: 'No',

    check: 'Check Eligibility',
    checking: 'Checking Eligibility...',
    required: 'This field is required.',
    ageError: 'Please enter an age between 0 and 120.',
    incomeError: 'Please enter a valid annual income.',

    ageHint: 'Enter your age from 0 to 120 years.',
    incomeHint: 'Select an income range or enter the exact annual income.',
    occupationHint: 'Choose the option that best describes your current situation.',
  },

  te: {
    profile: 'వ్యక్తిగత వివరాలు',
    financial: 'ఆర్థిక వివరాలు',
    age: 'వయస్సు',
    gender: 'లింగం',
    state: 'రాష్ట్రం / కేంద్రపాలిత ప్రాంతం',
    income: 'వార్షిక కుటుంబ ఆదాయం',
    incomeRange: 'ఆదాయ పరిధి',
    occupation: 'వృత్తి',
    select: 'ఎంపికను ఎంచుకోండి',
    female: 'మహిళ',
    male: 'పురుషుడు',
    other: 'ఇతరులు',

    student: 'విద్యార్థి',
    schoolStudent: 'పాఠశాల విద్యార్థి',
    collegeStudent: 'కళాశాల విద్యార్థి',
    farmer: 'రైతు',
    governmentEmployee: 'ప్రభుత్వ ఉద్యోగి',
    privateEmployee: 'ప్రైవేట్ ఉద్యోగి',
    businessOwner: 'వ్యాపార యజమాని',
    selfEmployed: 'స్వయం ఉపాధి',
    dailyWage: 'రోజువారీ కూలీ',
    homemaker: 'గృహిణి',
    unemployed: 'నిరుద్యోగి',
    seniorCitizen: 'వృద్ధుడు / వృద్ధురాలు',
    artisan: 'కళాకారుడు / చేతివృత్తి',
    streetVendor: 'వీధి వ్యాపారి',
    otherOccupation: 'ఇతరులు',

    below1L: '₹1 లక్ష కంటే తక్కువ',
    oneTo2L: '₹1 లక్ష – ₹2 లక్షలు',
    twoTo3L: '₹2 లక్షలు – ₹3 లక్షలు',
    threeTo5L: '₹3 లక్షలు – ₹5 లక్షలు',
    above5L: '₹5 లక్షల కంటే ఎక్కువ',
    enterManually: 'ఆదాయాన్ని మాన్యువల్‌గా నమోదు చేయండి',

    residence: 'నివాసం',
    rural: 'గ్రామీణ',
    urban: 'పట్టణ',

    houseStatus: 'ఇంటి యాజమాన్యం',
    ownHouse: 'సొంత ఇల్లు',
    rentedHouse: 'అద్దె ఇల్లు',
    noPermanentHouse: 'శాశ్వత ఇల్లు లేదు',
    otherHouse: 'ఇతరులు',

    additional: 'అదనపు అర్హత వివరాలు',
    studentStatus: 'విద్యార్థి స్థితి',
    educationLevel: 'విద్యా స్థాయి',
    course: 'కోర్సు / చదువు',

    farmerStatus: 'రైతు స్థితి',
    landOwnership: 'భూమి యాజమాన్యం',
    landSize: 'భూమి పరిమాణం',

    employmentType: 'ఉద్యోగ రకం',
    salaryRange: 'జీతం / ఆదాయ పరిధి',

    businessType: 'వ్యాపార రకం',

    maritalStatus: 'వైవాహిక స్థితి',
    married: 'వివాహితులు',
    unmarried: 'అవివాహితులు',

    socialCategory: 'సామాజిక వర్గం',
    general: 'సాధారణ',
    sc: 'SC',
    st: 'ST',
    bc: 'BC',
    minority: 'మైనారిటీ',

    disabilityStatus: 'వైకల్య స్థితి',
    yes: 'అవును',
    no: 'కాదు',

    check: 'అర్హతను తనిఖీ చేయండి',
    checking: 'అర్హతను తనిఖీ చేస్తోంది...',
    required: 'ఈ ఫీల్డ్ అవసరం.',
    ageError: 'దయచేసి 0 నుండి 120 మధ్య వయస్సు నమోదు చేయండి.',
    incomeError: 'దయచేసి సరైన వార్షిక ఆదాయాన్ని నమోదు చేయండి.',

    ageHint: '0 నుండి 120 సంవత్సరాల మధ్య వయస్సు నమోదు చేయండి.',
    incomeHint: 'ఆదాయ పరిధిని ఎంచుకోండి లేదా ఖచ్చితమైన ఆదాయాన్ని నమోదు చేయండి.',
    occupationHint: 'మీ ప్రస్తుత పరిస్థితికి సరిపోయే ఎంపికను ఎంచుకోండి.',
  },

  hi: {
    profile: 'व्यक्तिगत प्रोफ़ाइल',
    financial: 'वित्तीय विवरण',
    age: 'उम्र',
    gender: 'लिंग',
    state: 'राज्य / केंद्र शासित प्रदेश',
    income: 'वार्षिक पारिवारिक आय',
    incomeRange: 'आय सीमा',
    occupation: 'व्यवसाय',
    select: 'विकल्प चुनें',
    female: 'महिला',
    male: 'पुरुष',
    other: 'अन्य',

    student: 'छात्र',
    schoolStudent: 'स्कूल छात्र',
    collegeStudent: 'कॉलेज छात्र',
    farmer: 'किसान',
    governmentEmployee: 'सरकारी कर्मचारी',
    privateEmployee: 'निजी कर्मचारी',
    businessOwner: 'व्यवसाय मालिक',
    selfEmployed: 'स्वरोजगार',
    dailyWage: 'दैनिक मजदूर',
    homemaker: 'गृहिणी',
    unemployed: 'बेरोजगार',
    seniorCitizen: 'वरिष्ठ नागरिक',
    artisan: 'कारीगर / शिल्पकार',
    streetVendor: 'स्ट्रीट वेंडर',
    otherOccupation: 'अन्य',

    below1L: '₹1 लाख से कम',
    oneTo2L: '₹1 लाख – ₹2 लाख',
    twoTo3L: '₹2 लाख – ₹3 लाख',
    threeTo5L: '₹3 लाख – ₹5 लाख',
    above5L: '₹5 लाख से अधिक',
    enterManually: 'आय मैन्युअल रूप से दर्ज करें',

    residence: 'निवास',
    rural: 'ग्रामीण',
    urban: 'शहरी',

    houseStatus: 'घर का स्वामित्व',
    ownHouse: 'अपना घर',
    rentedHouse: 'किराए का घर',
    noPermanentHouse: 'स्थायी घर नहीं',
    otherHouse: 'अन्य',

    additional: 'अतिरिक्त पात्रता विवरण',
    studentStatus: 'छात्र स्थिति',
    educationLevel: 'शिक्षा स्तर',
    course: 'कोर्स / अध्ययन क्षेत्र',

    farmerStatus: 'किसान स्थिति',
    landOwnership: 'भूमि स्वामित्व',
    landSize: 'भूमि का आकार',

    employmentType: 'रोजगार का प्रकार',
    salaryRange: 'वेतन / आय सीमा',

    businessType: 'व्यवसाय का प्रकार',

    maritalStatus: 'वैवाहिक स्थिति',
    married: 'विवाहित',
    unmarried: 'अविवाहित',

    socialCategory: 'सामाजिक श्रेणी',
    general: 'सामान्य',
    sc: 'SC',
    st: 'ST',
    bc: 'BC',
    minority: 'अल्पसंख्यक',

    disabilityStatus: 'दिव्यांगता स्थिति',
    yes: 'हाँ',
    no: 'नहीं',

    check: 'पात्रता जांचें',
    checking: 'पात्रता जांची जा रही है...',
    required: 'यह क्षेत्र आवश्यक है।',
    ageError: 'कृपया 0 से 120 के बीच उम्र दर्ज करें।',
    incomeError: 'कृपया सही वार्षिक आय दर्ज करें।',

    ageHint: '0 से 120 वर्ष के बीच उम्र दर्ज करें।',
    incomeHint: 'आय सीमा चुनें या सटीक वार्षिक आय दर्ज करें।',
    occupationHint: 'अपनी वर्तमान स्थिति के अनुसार विकल्प चुनें।',
  },
}

const statesAndUTs = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

const occupations = [
  ['Student', 'student'],
  ['School Student', 'schoolStudent'],
  ['College Student', 'collegeStudent'],
  ['Farmer', 'farmer'],
  ['Government Employee', 'governmentEmployee'],
  ['Private Employee', 'privateEmployee'],
  ['Business Owner', 'businessOwner'],
  ['Self-employed', 'selfEmployed'],
  ['Daily Wage Worker', 'dailyWage'],
  ['Homemaker', 'homemaker'],
  ['Unemployed', 'unemployed'],
  ['Senior Citizen', 'seniorCitizen'],
  ['Artisan / Craftsperson', 'artisan'],
  ['Street Vendor', 'streetVendor'],
  ['Other', 'otherOccupation'],
]

function EligibilityForm({ language, loading, onSubmit }) {
  const t = labels[language] || labels.en

  const [form, setForm] = useState({
    age: '',
    gender: '',
    state: '',
    custom_state: '',
    custom_occupation: '',
    annual_income: '',
    income_range: '',
    occupation: '',
    student_status: '',
    education_level: '',
    course: '',
    farmer_status: '',
    land_ownership: '',
    land_size: '',
    employment_type: '',
    government_sector: '',
    salary_range: '',
    business_type: '',
    marital_status: '',
    social_category: '',
    disability_status: '',
    rural_urban: '',
    house_status: '',
  })

  const [errors, setErrors] = useState({})

  function updateField(event) {
    const { name, value } = event.target

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }))

    setErrors((previous) => ({
      ...previous,
      [name]: '',
    }))
  }

  const isStudent =
    form.occupation === 'Student' ||
    form.occupation === 'School Student' ||
    form.occupation === 'College Student'

  const isFarmer = form.occupation === 'Farmer'

  const isEmployee =
    form.occupation === 'Government Employee' ||
    form.occupation === 'Private Employee'

  const isBusiness =
    form.occupation === 'Business Owner' ||
    form.occupation === 'Self-employed'

  const isGovernmentEmployee = form.occupation === 'Government Employee'

  function submitForm(event) {
    event.preventDefault()

    const nextErrors = {}

    if (!form.age) {
      nextErrors.age = t.required
    } else if (Number(form.age) < 0 || Number(form.age) > 120) {
      nextErrors.age = t.ageError
    }

    if (!form.gender) {
      nextErrors.gender = t.required
    }

    if (!form.state) {
      nextErrors.state = t.required
    } else if (form.state === 'Other' && !form.custom_state.trim()) {
      nextErrors.custom_state = t.required
    }

    if (!form.income_range) {
      nextErrors.income_range = t.required
    }

    if (
      form.income_range === 'manual' &&
      (!form.annual_income || Number(form.annual_income) < 0)
    ) {
      nextErrors.annual_income = t.incomeError
    }

    if (!form.occupation) {
      nextErrors.occupation = t.required
    } else if (form.occupation === 'Other' && !form.custom_occupation.trim()) {
      nextErrors.custom_occupation = t.required
    }

    if (!form.rural_urban) {
      nextErrors.rural_urban = t.required
    }

    if (!form.house_status) {
      nextErrors.house_status = t.required
    }

    if (!form.social_category) {
      nextErrors.social_category = t.required
    }

    if (!form.disability_status) {
      nextErrors.disability_status = t.required
    }

    if (isStudent) {
      if (!form.student_status) {
        nextErrors.student_status = t.required
      }

      if (!form.education_level) {
        nextErrors.education_level = t.required
      }
    }

    if (isFarmer) {
      if (!form.farmer_status) {
        nextErrors.farmer_status = t.required
      }

      if (!form.land_ownership) {
        nextErrors.land_ownership = t.required
      }
    }

    if (isEmployee && !form.employment_type) {
      nextErrors.employment_type = t.required
    }

    if (isBusiness && !form.business_type) {
      nextErrors.business_type = t.required
    }

    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    let income = Number(form.annual_income)

    if (form.income_range === 'below1L') income = 50000
    if (form.income_range === 'oneTo2L') income = 150000
    if (form.income_range === 'twoTo3L') income = 250000
    if (form.income_range === 'threeTo5L') income = 400000
    if (form.income_range === 'above5L' && !form.annual_income) {
      income = 600000
    }

    onSubmit({
      ...form,
      age: Number(form.age),
      annual_income: income,
    })
  }

  const fieldClass = (name) =>
    `field ${errors[name] ? 'has-error' : ''}`

  return (
    <form
      className="eligibility-form"
      noValidate
      onSubmit={submitForm}
    >
      {/* PERSONAL PROFILE */}
      <fieldset>
        <legend>
          <span>1</span>
          {t.profile}
        </legend>

        <div className="form-grid">
          <label className={fieldClass('age')}>
            {t.age}

            <input
              name="age"
              type="number"
              min="0"
              max="120"
              inputMode="numeric"
              value={form.age}
              onChange={updateField}
              placeholder="e.g. 22"
            />

            <small>{t.ageHint}</small>

            {errors.age && <em>{errors.age}</em>}
          </label>

          <label className={fieldClass('gender')}>
            {t.gender}

            <select
              name="gender"
              value={form.gender}
              onChange={updateField}
            >
              <option value="">{t.select}</option>
              <option value="Female">{t.female}</option>
              <option value="Male">{t.male}</option>
              <option value="Other">{t.other}</option>
            </select>

            {errors.gender && <em>{errors.gender}</em>}
          </label>

          <label className={fieldClass('state')}>
            {t.state}

            <select
              name="state"
              value={form.state}
              onChange={updateField}
            >
              <option value="">{t.select}</option>

              <option value="Central Government">
                Central Government / All India
              </option>

              <option value="Other">Other / Enter manually</option>

              <optgroup label="States">
                {statesAndUTs.slice(0, 28).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </optgroup>

              <optgroup label="Union Territories">
                {statesAndUTs.slice(28).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </optgroup>
            </select>

            {form.state === 'Other' && (
              <>
                <input
                  name="custom_state"
                  value={form.custom_state}
                  onChange={updateField}
                  placeholder="Enter your State / Union Territory"
                />
                {errors.custom_state && <em>{errors.custom_state}</em>}
              </>
            )}

            {errors.state && <em>{errors.state}</em>}
          </label>

        </div>
      </fieldset>

      {/* FINANCIAL DETAILS */}
      <fieldset>
        <legend>
          <span>2</span>
          {t.financial}
        </legend>

        <div className="form-grid">
          <label className={fieldClass('income_range')}>
            {t.incomeRange}

            <select
              name="income_range"
              value={form.income_range}
              onChange={updateField}
            >
              <option value="">{t.select}</option>
              <option value="below1L">{t.below1L}</option>
              <option value="oneTo2L">{t.oneTo2L}</option>
              <option value="twoTo3L">{t.twoTo3L}</option>
              <option value="threeTo5L">{t.threeTo5L}</option>
              <option value="above5L">{t.above5L}</option>
              <option value="manual">{t.enterManually}</option>
            </select>

            {errors.income_range && <em>{errors.income_range}</em>}
          </label>

          {(form.income_range === 'manual' ||
            form.income_range === 'above5L') && (
            <label className={fieldClass('annual_income')}>
              {t.income}

              <input
                name="annual_income"
                type="number"
                min="0"
                inputMode="numeric"
                value={form.annual_income}
                onChange={updateField}
                placeholder="e.g. 650000"
              />

              <small>{t.incomeHint}</small>

              {errors.annual_income && <em>{errors.annual_income}</em>}
            </label>
          )}

          <label className={fieldClass('occupation')}>
            {t.occupation}

            <select
              name="occupation"
              value={form.occupation}
              onChange={updateField}
            >
              <option value="">{t.select}</option>

              {occupations.map(([value, labelKey]) => (
                <option key={value} value={value}>
                  {t[labelKey]}
                </option>
              ))}
            </select>

            <small>{t.occupationHint}</small>

            {errors.occupation && <em>{errors.occupation}</em>}

            {form.occupation === 'Other' && (
              <>
                <input
                  name="custom_occupation"
                  value={form.custom_occupation}
                  onChange={updateField}
                  placeholder="Enter your occupation"
                />
                {errors.custom_occupation && <em>{errors.custom_occupation}</em>}
              </>
            )}
          </label>
        </div>
      </fieldset>

      {/* RESIDENCE */}
      <fieldset>
        <legend>
          <span>3</span>
          {t.residence}
        </legend>

        <div className="form-grid">
          <label className={fieldClass('rural_urban')}>
            {t.residence}

            <select
              name="rural_urban"
              value={form.rural_urban}
              onChange={updateField}
            >
              <option value="">{t.select}</option>
              <option value="Rural">{t.rural}</option>
              <option value="Urban">{t.urban}</option>
            </select>

            {errors.rural_urban && <em>{errors.rural_urban}</em>}
          </label>

          <label className={fieldClass('house_status')}>
            {t.houseStatus}

            <select
              name="house_status"
              value={form.house_status}
              onChange={updateField}
            >
              <option value="">{t.select}</option>
              <option value="Own">{t.ownHouse}</option>
              <option value="Rented">{t.rentedHouse}</option>
              <option value="No Permanent House">{t.noPermanentHouse}</option>
              <option value="Other">{t.otherHouse}</option>
            </select>

            {form.house_status === 'Other' && (
              <input
                name="house_status_detail"
                value={form.house_status_detail || ''}
                onChange={updateField}
                placeholder="Enter your housing situation"
              />
            )}

            {errors.house_status && <em>{errors.house_status}</em>}
          </label>
        </div>
      </fieldset>

      {/* COMMON ELIGIBILITY */}
      <fieldset>
        <legend>
          <span>4</span>
          {t.additional}
        </legend>

        <div className="form-grid">
          <label className={fieldClass('social_category')}>
            {t.socialCategory}

            <select
              name="social_category"
              value={form.social_category}
              onChange={updateField}
            >
              <option value="">{t.select}</option>
              <option value="General">{t.general}</option>
              <option value="SC">{t.sc}</option>
              <option value="ST">{t.st}</option>
              <option value="BC">{t.bc}</option>
              <option value="Minority">{t.minority}</option>
              <option value="Other">{t.other}</option>
            </select>

            {form.social_category === 'Other' && (
              <input
                name="social_category_detail"
                value={form.social_category_detail || ''}
                onChange={updateField}
                placeholder="Enter social category"
              />
            )}

            {errors.social_category && (
              <em>{errors.social_category}</em>
            )}
          </label>

          <label className={fieldClass('disability_status')}>
            {t.disabilityStatus}

            <select
              name="disability_status"
              value={form.disability_status}
              onChange={updateField}
            >
              <option value="">{t.select}</option>
              <option value="Yes">{t.yes}</option>
              <option value="No">{t.no}</option>
            </select>

            {errors.disability_status && (
              <em>{errors.disability_status}</em>
            )}
          </label>

          {/* STUDENT DETAILS */}
          {isStudent && (
            <>
              <label className={fieldClass('student_status')}>
                {t.studentStatus}

                <select
                  name="student_status"
                  value={form.student_status}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="Yes">{t.yes}</option>
                  <option value="No">{t.no}</option>
                </select>

                {errors.student_status && (
                  <em>{errors.student_status}</em>
                )}
              </label>

              <label className={fieldClass('education_level')}>
                {t.educationLevel}

                <select
                  name="education_level"
                  value={form.education_level}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="School">School</option>
                  <option value="Diploma">Diploma</option>
                  <option value="Undergraduate">
                    Undergraduate / B.Tech / Degree
                  </option>
                  <option value="Postgraduate">
                    Postgraduate
                  </option>
                  <option value="PhD">PhD / Research</option>
                  <option value="Other">Other / Enter manually</option>
                </select>

                {form.education_level === 'Other' && (
                  <input
                    name="education_level_detail"
                    value={form.education_level_detail || ''}
                    onChange={updateField}
                    placeholder="Enter education level"
                  />
                )}

                {errors.education_level && (
                  <em>{errors.education_level}</em>
                )}
              </label>

              <label className="field">
                {t.course}

                <input
                  name="course"
                  value={form.course}
                  onChange={updateField}
                  placeholder="e.g. Data Science"
                />
              </label>
            </>
          )}

          {/* FARMER DETAILS */}
          {isFarmer && (
            <>
              <label className={fieldClass('farmer_status')}>
                {t.farmerStatus}

                <select
                  name="farmer_status"
                  value={form.farmer_status}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="Yes">{t.yes}</option>
                  <option value="No">{t.no}</option>
                </select>

                {errors.farmer_status && (
                  <em>{errors.farmer_status}</em>
                )}
              </label>

              <label className={fieldClass('land_ownership')}>
                {t.landOwnership}

                <select
                  name="land_ownership"
                  value={form.land_ownership}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="Owned">Owned</option>
                  <option value="Leased">Leased</option>
                  <option value="Shared">Shared / Joint</option>
                  <option value="No Land">No Land</option>
                  <option value="Other">Other / Enter manually</option>
                </select>

                {form.land_ownership === 'Other' && (
                  <input
                    name="land_ownership_detail"
                    value={form.land_ownership_detail || ''}
                    onChange={updateField}
                    placeholder="Enter land ownership"
                  />
                )}

                {errors.land_ownership && (
                  <em>{errors.land_ownership}</em>
                )}
              </label>

              <label className="field">
                {t.landSize}

                <select
                  name="land_size"
                  value={form.land_size}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="Below 1 acre">
                    Below 1 acre
                  </option>
                  <option value="1-2 acres">1–2 acres</option>
                  <option value="2-5 acres">2–5 acres</option>
                  <option value="Above 5 acres">
                    Above 5 acres
                  </option>
                  <option value="Other">Other / Enter manually</option>
                </select>
                {form.land_size === 'Other' && (
                  <input
                    name="land_size_detail"
                    value={form.land_size_detail || ''}
                    onChange={updateField}
                    placeholder="Enter land size"
                  />
                )}
              </label>
            </>
          )}

          {/* EMPLOYEE DETAILS */}
          {isEmployee && (
            <>
              <label className={fieldClass('employment_type')}>
                {t.employmentType}

                <select
                  name="employment_type"
                  value={form.employment_type}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Temporary">Temporary</option>
                  <option value="Contract">Contract</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Other">Other / Enter manually</option>
                </select>

                {form.employment_type === 'Other' && (
                  <input
                    name="employment_type_detail"
                    value={form.employment_type_detail || ''}
                    onChange={updateField}
                    placeholder="Enter employment type"
                  />
                )}

                {errors.employment_type && (
                  <em>{errors.employment_type}</em>
                )}
              </label>

              {isGovernmentEmployee && (
                <label className="field">
                  Government sector details
                  <input
                    name="government_sector"
                    value={form.government_sector}
                    onChange={updateField}
                    placeholder="Enter department / sector"
                  />
                </label>
              )}

              <label className="field">
                {t.salaryRange}

                <select
                  name="salary_range"
                  value={form.salary_range}
                  onChange={updateField}
                >
                  <option value="">{t.select}</option>
                  <option value="Below 2 Lakh">
                    Below ₹2 Lakh
                  </option>
                  <option value="2-5 Lakh">
                    ₹2–5 Lakh
                  </option>
                  <option value="5-10 Lakh">
                    ₹5–10 Lakh
                  </option>
                  <option value="Above 10 Lakh">
                    Above ₹10 Lakh
                  </option>
                  <option value="Other">Other / Enter manually</option>
                </select>

                {form.salary_range === 'Other' && (
                  <input
                    name="salary_range_detail"
                    value={form.salary_range_detail || ''}
                    onChange={updateField}
                    placeholder="Enter exact annual salary"
                  />
                )}
              </label>
            </>
          )}

          {/* BUSINESS DETAILS */}
          {isBusiness && (
            <label className={fieldClass('business_type')}>
              {t.businessType}

              <select
                name="business_type"
                value={form.business_type}
                onChange={updateField}
              >
                <option value="">{t.select}</option>
                <option value="Small Business">
                  Small Business
                </option>
                <option value="Micro Enterprise">
                  Micro Enterprise
                </option>
                <option value="Startup">Startup</option>
                <option value="Self Employment">
                  Self Employment
                </option>
                <option value="Other">Other</option>
              </select>

              {form.business_type === 'Other' && (
                <input
                  name="business_type_detail"
                  value={form.business_type_detail || ''}
                  onChange={updateField}
                  placeholder="Enter business type"
                />
              )}

              {errors.business_type && (
                <em>{errors.business_type}</em>
              )}
            </label>
          )}

          {/* OPTIONAL HOMEMAKER DETAIL */}
          {form.occupation === 'Homemaker' && (
            <label className="field">
              {t.maritalStatus}

              <select
                name="marital_status"
                value={form.marital_status}
                onChange={updateField}
              >
                <option value="">{t.select}</option>
                <option value="Married">{t.married}</option>
                <option value="Unmarried">{t.unmarried}</option>
                <option value="Other">{t.other}</option>
              </select>
            </label>
          )}

        </div>
      </fieldset>

      <button
        className="primary-button"
        type="submit"
        disabled={loading}
      >
        {loading && (
          <span
            className="spinner"
            aria-hidden="true"
          />
        )}

        {loading ? t.checking : t.check}

        <span aria-hidden="true">
          &#8594;
        </span>
      </button>
    </form>
  )
}

export default EligibilityForm
