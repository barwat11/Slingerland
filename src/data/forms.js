export const COLORS = {
  navy: '#1B3A5C',
  gold: '#D4982A',
  lightGold: '#FDF6E9',
  darkTeal: '#1A3C34',
};

export const DISCLAIMER_TEXT =
  'Important: Slingerland Screening tests are designed to identify areas of strength and weakness regarding auditory, visual, and motor-kinesthetic modalities of learning. The results of this test do not provide a diagnosis. They may indicate the need for remediation, intervention, or further testing. This calculator is only for use by those trained to administer and interpret Slingerland Screening Tests.';

export const COPYRIGHT_TEXT =
  'The Slingerland name and all related materials, content, and instructional resources referenced or displayed in this app are the property of Slingerland\u00AE. This material is intended for use by authorized teachers and instructors to support and guide students and parents in educational activities.';

export const COMPARISON_LABELS = {
  '1-2': 'Visual Copying (Far vs Near)',
  '3-5': 'Visual Memory (Input vs Output)',
  '4-7': 'Sensory Discrimination (V vs A)',
  '5-6': 'Sensory Recall (Visual vs Auditory)',
  '3-8': 'Recognition Recall (No Writing Output)',
  '8-6': 'Auditory Integrity (Input vs Output)',
  '6-9': 'Spelling vs General Knowledge',
};

export const FORMS = [
  {
    id: 'A',
    label: 'Form A',
    subtests: [
      { num: 1, name: 'Copying - Chart', focus: 'Far Point Copying', totalPossible: 30 },
      { num: 2, name: 'Copying - Page', focus: 'Near Point Copying', totalPossible: 10 },
      { num: 3, name: 'V-P-M', focus: 'Visual Memory (no writing)', totalPossible: 10 },
      { num: 4, name: 'Visual Discrim.', focus: 'Visual Discrimination', totalPossible: 8 },
      { num: 5, name: 'V-P-M-K', focus: 'Visual Memory (with writing)', totalPossible: 12 },
      {
        num: 6,
        name: 'Auditory Recall',
        focus: 'Auditory Memory (with writing)',
        totalPossible: 0,
        children: [
          { focus: 'Letters', totalPossible: 4 },
          { focus: 'Numbers', totalPossible: 4 },
          { focus: 'Spelling', totalPossible: 8 },
        ],
      },
      { num: 7, name: 'Aud. Sounds', focus: 'Auditory Discrimination', totalPossible: 16 },
      { num: 8, name: 'Aud. Assoc.', focus: 'Auditory Memory (no writing)', totalPossible: 12 },
    ],
    comparisons: [
      { leftNum: 1, leftFocus: 'Far Point Copying', rightNum: 2, rightFocus: 'Near Point Copying' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 5, rightFocus: 'Visual Memory (with writing)' },
      { leftNum: 4, leftFocus: 'Visual Discrimination', rightNum: 7, rightFocus: 'Auditory Discrimination' },
      { leftNum: 5, leftFocus: 'Visual Memory (with writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 8, rightFocus: 'Auditory Memory (no writing)' },
      { leftNum: 8, leftFocus: 'Auditory Memory (no writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
    ],
  },
  {
    id: 'B',
    label: 'Form B',
    subtests: [
      { num: 1, name: 'Copying - Chart', focus: 'Far Point Copying', totalPossible: 41 },
      { num: 2, name: 'Copying - Page', focus: 'Near Point Copying', totalPossible: 10 },
      { num: 3, name: 'V-P-M', focus: 'Visual Memory (no writing)', totalPossible: 12 },
      { num: 4, name: 'Visual Discrim.', focus: 'Visual Discrimination', totalPossible: 8 },
      { num: 5, name: 'V-P-M-K', focus: 'Visual Memory (with writing)', totalPossible: 15 },
      {
        num: 6,
        name: 'Auditory Recall',
        focus: 'Auditory Memory (with writing)',
        totalPossible: 0,
        children: [
          { focus: 'Letters', totalPossible: 7 },
          { focus: 'Numbers', totalPossible: 5 },
          { focus: 'Spelling', totalPossible: 14 },
        ],
      },
      { num: 7, name: 'Aud. Sounds', focus: 'Auditory Discrimination', totalPossible: 18 },
      { num: 8, name: 'Aud. Assoc.', focus: 'Auditory Memory (no writing)', totalPossible: 18 },
    ],
    comparisons: [
      { leftNum: 1, leftFocus: 'Far Point Copying', rightNum: 2, rightFocus: 'Near Point Copying' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 5, rightFocus: 'Visual Memory (with writing)' },
      { leftNum: 4, leftFocus: 'Visual Discrimination', rightNum: 7, rightFocus: 'Auditory Discrimination' },
      { leftNum: 5, leftFocus: 'Visual Memory (with writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 8, rightFocus: 'Auditory Memory (no writing)' },
      { leftNum: 8, leftFocus: 'Auditory Memory (no writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
    ],
  },
  {
    id: 'C',
    label: 'Form C',
    subtests: [
      { num: 1, name: 'Copying - Chart', focus: 'Far Point Copying', totalPossible: 36 },
      { num: 2, name: 'Copying - Page', focus: 'Near Point Copying', totalPossible: 10 },
      { num: 3, name: 'V-P-M', focus: 'Visual Memory (no writing)', totalPossible: 14 },
      { num: 4, name: 'Visual Discrim.', focus: 'Visual Discrimination', totalPossible: 8 },
      { num: 5, name: 'V-P-M-K', focus: 'Visual Memory (with writing)', totalPossible: 15 },
      {
        num: 6,
        name: 'Auditory Recall',
        focus: 'Auditory Memory (with writing)',
        totalPossible: 0,
        children: [
          { focus: 'Letters', totalPossible: 4 },
          { focus: 'Numbers', totalPossible: 3 },
          {
            focus: 'Spelling (22 or 30)',
            totalPossible: 30,
            editableTotalPossible: true,
            editableHint: 'Enter 22 or 30',
          },
        ],
      },
      { num: 7, name: 'Aud. Sounds', focus: 'Auditory Discrimination', totalPossible: 18 },
      { num: 8, name: 'Aud. Assoc.', focus: 'Auditory Memory (no writing)', totalPossible: 18 },
    ],
    comparisons: [
      { leftNum: 1, leftFocus: 'Far Point Copying', rightNum: 2, rightFocus: 'Near Point Copying' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 5, rightFocus: 'Visual Memory (with writing)' },
      { leftNum: 4, leftFocus: 'Visual Discrimination', rightNum: 7, rightFocus: 'Auditory Discrimination' },
      { leftNum: 5, leftFocus: 'Visual Memory (with writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 8, rightFocus: 'Auditory Memory (no writing)' },
      { leftNum: 8, leftFocus: 'Auditory Memory (no writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
    ],
  },
  {
    id: 'D',
    label: 'Form D',
    subtests: [
      { num: 1, name: 'Copying - Chart', focus: 'Far Point Copying', totalPossible: 52 },
      { num: 2, name: 'Copying - Page', focus: 'Near Point Copying', totalPossible: 10 },
      { num: 3, name: 'V-P-M', focus: 'Visual Memory (no writing)', totalPossible: 14 },
      { num: 4, name: 'Visual Discrim.', focus: 'Visual Discrimination', totalPossible: 8 },
      { num: 5, name: 'V-P-M-K', focus: 'Visual Memory (with writing)', totalPossible: 15 },
      {
        num: 6,
        name: 'Auditory Recall',
        focus: 'Auditory Memory (with writing)',
        totalPossible: 0,
        children: [
          { focus: 'Letters', totalPossible: 4 },
          { focus: 'Numbers', totalPossible: 4 },
          { focus: 'Spelling', totalPossible: 20 },
          { focus: 'Dictated Sentence', totalPossible: 13 },
        ],
      },
      { num: 7, name: 'Aud. Sounds', focus: 'Auditory Discrimination', totalPossible: 21 },
      { num: 8, name: 'Aud. Assoc.', focus: 'Auditory Memory (no writing)', totalPossible: 18 },
      { num: 9, name: 'General Knowledge', focus: 'General Knowledge (with writing)', totalPossible: 18 },
    ],
    comparisons: [
      { leftNum: 1, leftFocus: 'Far Point Copying', rightNum: 2, rightFocus: 'Near Point Copying' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 5, rightFocus: 'Visual Memory (with writing)' },
      { leftNum: 4, leftFocus: 'Visual Discrimination', rightNum: 7, rightFocus: 'Auditory Discrimination' },
      { leftNum: 5, leftFocus: 'Visual Memory (with writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
      { leftNum: 3, leftFocus: 'Visual Memory (no writing)', rightNum: 8, rightFocus: 'Auditory Memory (no writing)' },
      { leftNum: 8, leftFocus: 'Auditory Memory (no writing)', rightNum: 6, rightFocus: 'Auditory Memory (with writing)' },
    ],
    extraComparisons: [
      { leftNum: 6, leftFocus: 'Spelling (with writing)', rightNum: 9, rightFocus: 'General Knowledge (with writing)' },
    ],
  },
];
