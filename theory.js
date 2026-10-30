// Guitar Theory Data
const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const NOTES_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

const STRING_OPENS = [4, 9, 2, 7, 11, 4]; // E A D G B E in semitones from C (0)

const SCALES = {
  'Ionian (Major)': [0, 2, 4, 5, 7, 9, 11],
  'Dorian': [0, 2, 3, 5, 7, 9, 10],
  'Phrygian': [0, 1, 3, 5, 7, 8, 10],
  'Lydian': [0, 2, 4, 6, 7, 9, 11],
  'Mixolydian': [0, 2, 4, 5, 7, 9, 10],
  'Aeolian (Natural Minor)': [0, 2, 3, 5, 7, 8, 10],
  'Locrian': [0, 1, 3, 5, 6, 8, 10],
  'Major Pentatonic': [0, 2, 4, 7, 9],
  'Minor Pentatonic': [0, 3, 5, 7, 10],
  'Blues': [0, 3, 5, 6, 7, 10],
  'Harmonic Minor': [0, 2, 3, 5, 7, 8, 11],
  'Melodic Minor': [0, 2, 3, 5, 7, 9, 11],
  'Whole Tone': [0, 2, 4, 6, 8, 10],
  'Diminished (Half-Whole)': [0, 1, 3, 4, 6, 7, 9, 10]
};

const CHORDS = {
  'Major': [0, 4, 7],
  'Minor': [0, 3, 7],
  'Diminished': [0, 3, 6],
  'Augmented': [0, 4, 8],
  'Sus2': [0, 2, 7],
  'Sus4': [0, 5, 7],
  'Major 7': [0, 4, 7, 11],
  'Minor 7': [0, 3, 7, 10],
  'Dominant 7': [0, 4, 7, 10],
  'Minor 7b5': [0, 3, 6, 10],
  'Diminished 7': [0, 3, 6, 9],
  'Major 9': [0, 4, 7, 11, 14],
  'Minor 9': [0, 3, 7, 10, 14]
};

// CAGED major shapes relative frets for open (then barre accordingly)
// Format: array of [stringIndex 0-5 low to high, relativeFret]
const CAGED_MAJOR = {
  C: [[1,3],[2,2],[3,0],[4,1],[5,0]], // simplified open C, missing some
  A: [[0,0],[1,2],[2,2],[3,2],[4,0]],
  G: [[0,3],[1,2],[2,0],[3,0],[4,0],[5,3]],
  E: [[0,0],[1,2],[2,2],[3,1],[4,0],[5,0]],
  D: [[2,0],[3,2],[4,3],[5,2]]
};

// Better full shapes for display
const CAGED_SHAPES = {
  major: {
    C: { frets: [null, 3, 2, 0, 1, 0], rootString: 1 },
    A: { frets: [null, 0, 2, 2, 2, 0], rootString: 1 },
    G: { frets: [3, 2, 0, 0, 0, 3], rootString: 0 },
    E: { frets: [0, 2, 2, 1, 0, 0], rootString: 0 },
    D: { frets: [null, null, 0, 2, 3, 2], rootString: 2 }
  },
  minor: {
    C: { frets: [null, 3, 1, 0, 1, 0], rootString: 1 },
    A: { frets: [null, 0, 2, 2, 1, 0], rootString: 1 },
    G: { frets: [3, 1, 0, 0, 3, 3], rootString: 0 },
    E: { frets: [0, 2, 2, 0, 0, 0], rootString: 0 },
    D: { frets: [null, null, 0, 2, 3, 1], rootString: 2 }
  }
};

const PROGRESSIONS = {
  'I-IV-V': [1, 4, 5],
  'I-V-vi-IV': [1, 5, 6, 4],
  'ii-V-I': [2, 5, 1],
  'I-vi-IV-V': [1, 6, 4, 5],
  'vi-IV-I-V': [6, 4, 1, 5],
  'I-bVII-IV': [1, -2, 4], // relative
  '12-bar Blues': [1, 1, 1, 1, 4, 4, 1, 1, 5, 4, 1, 5]
};

function getNoteName(semitone, preferFlat = false) {
  const idx = ((semitone % 12) + 12) % 12;
  return preferFlat ? NOTES_FLAT[idx] : NOTES[idx];
}

function getScaleNotes(rootSemitone, scaleIntervals) {
  return scaleIntervals.map(i => (rootSemitone + i) % 12);
}

function getChordNotes(rootSemitone, chordIntervals) {
  return chordIntervals.map(i => (rootSemitone + i) % 12);
}

// Generate tab for a scale in a position (approx 5 frets starting at startFret)
function generateScaleTab(rootSemitone, scaleIntervals, startFret = 0, numFrets = 5) {
  const scaleNotes = getScaleNotes(rootSemitone, scaleIntervals);
  const tab = ['e|', 'B|', 'G|', 'D|', 'A|', 'E|'];
  for (let s = 0; s < 6; s++) {
    const open = STRING_OPENS[5 - s]; // high to low for tab order? Wait, reverse for display
    // Adjust: tab high e first
  }
  // Proper implementation later in app
  return 'Tab generation in app';
}

const CIRCLE_OF_FIFTHS = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'Db', 'Ab', 'Eb', 'Bb', 'F'];
const RELATIVE_MINORS = ['Am', 'Em', 'Bm', 'F#m', 'C#m', 'G#m', 'Ebm', 'Bbm', 'Fm', 'Cm', 'Gm', 'Dm'];
