// Guitar Theory Lab - Main Application Logic

document.addEventListener('DOMContentLoaded', () => {
  // Navigation
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.section).classList.add('active');
    });
  });

  // Populate selects
  const rootSelect = document.getElementById('rootSelect');
  const scaleSelect = document.getElementById('scaleSelect');
  const chordSelect = document.getElementById('chordSelect');
  const chordRoot = document.getElementById('chordRoot');
  const progKey = document.getElementById('progKey');

  NOTES.forEach((n, i) => {
    const opt = `<option value="${i}">${n}</option>`;
    rootSelect.innerHTML += opt;
    chordRoot.innerHTML += opt;
    progKey.innerHTML += opt;
  });

  Object.keys(SCALES).forEach(name => {
    scaleSelect.innerHTML += `<option value="${name}">${name}</option>`;
  });

  Object.keys(CHORDS).forEach(name => {
    chordSelect.innerHTML += `<option value="${name}">${name}</option>`;
  });

  // Fretboard rendering
  function renderFretboard() {
    const rootIdx = parseInt(rootSelect.value);
    const scaleName = scaleSelect.value;
    const chordName = chordSelect.value;
    const showMode = document.getElementById('showMode').value;
    const preferFlat = document.getElementById('preferFlat').checked;
    const scaleInts = SCALES[scaleName];
    const chordInts = CHORDS[chordName];
    const scaleNotes = getScaleNotes(rootIdx, scaleInts);
    const chordNotes = getChordNotes(rootIdx, chordInts);

    const fb = document.getElementById('fretboardDisplay');
    fb.innerHTML = '';
    const numFrets = 15;

    // String labels and frets (high e to low E for visual top-to-bottom? Standard is low E bottom or top. Common is high e top.
    const stringNames = ['e', 'B', 'G', 'D', 'A', 'E'];
    for (let s = 0; s < 6; s++) {
      const stringDiv = document.createElement('div');
      stringDiv.className = 'string';
      const label = document.createElement('div');
      label.style.width = '30px';
      label.textContent = stringNames[s];
      label.style.fontSize = '0.8rem';
      label.style.color = 'var(--muted)';
      stringDiv.appendChild(label);

      const openSemitone = STRING_OPENS[5 - s]; // adjust for high to low
      for (let f = 0; f <= numFrets; f++) {
        const fretDiv = document.createElement('div');
        fretDiv.className = 'fret';
        const noteSemitone = (openSemitone + f) % 12;
        const isScale = scaleNotes.includes(noteSemitone);
        const isChord = chordNotes.includes(noteSemitone);
        const isRoot = noteSemitone === rootIdx;

        if ((showMode === 'scale' && isScale) || (showMode === 'chord' && isChord) || (showMode === 'both' && (isScale || isChord))) {
          const noteEl = document.createElement('div');
          let cls = 'note';
          if (isRoot) cls += ' root';
          else if (isChord && showMode !== 'scale') cls += ' chord';
          else if (isScale) cls += ' scale';
          noteEl.className = cls;
          noteEl.textContent = getNoteName(noteSemitone, preferFlat);
          const interval = getIntervalName((noteSemitone - rootIdx + 12) % 12);
          noteEl.title = `${getNoteName(noteSemitone, preferFlat)} — interval ${interval}`;
          fretDiv.appendChild(noteEl);
        }
        // Markers on bottom string and double at 12
        if (f > 0 && [3,5,7,9,12,15].includes(f) && s === 5) {
          const marker = document.createElement('div');
          marker.className = 'fret-marker';
          marker.textContent = f === 12 ? '12' : f;
          fretDiv.appendChild(marker);
        }
        stringDiv.appendChild(fretDiv);
      }
      fb.appendChild(stringDiv);
    }

    // Interval info
    const info = document.getElementById('intervalInfo');
    info.innerHTML = `<strong>${getNoteName(rootIdx, preferFlat)} ${scaleName}</strong><br>Intervals: ${scaleInts.map(i => getIntervalName(i)).join(', ')}<br>
                      Notes: ${scaleNotes.map(n => getNoteName(n, preferFlat)).join(' – ')}`;
  }

  function getIntervalName(semitones) {
    const names = ['1', 'b2', '2', 'b3', '3', '4', '#4/b5', '5', 'b6', '6', 'b7', '7'];
    return names[((semitones % 12) + 12) % 12];
  }

  // Generate simple tab for scale across neck (positions)
  function generateTab() {
    const rootIdx = parseInt(rootSelect.value);
    const scaleName = scaleSelect.value;
    const scaleInts = SCALES[scaleName];
    const preferFlat = document.getElementById('preferFlat').checked;
    const output = document.getElementById('tabOutput');
    const rootName = getNoteName(rootIdx, preferFlat);
    let tab = `${rootName} ${scaleName}\nNotes: ${getScaleNotes(rootIdx, scaleInts).map(n => getNoteName(n, preferFlat)).join(' – ')}\n\n`;

    // 5 common positions
    const positions = [0, 2, 5, 7, 10];
    positions.forEach((start, pos) => {
      tab += `── Position ${pos + 1} (frets ${start}–${start+4}) ──\n`;
      const lines = ['e|', 'B|', 'G|', 'D|', 'A|', 'E|'];
      for (let s = 0; s < 6; s++) {
        const open = STRING_OPENS[5 - s];
        let line = lines[s];
        for (let f = start; f < start + 5; f++) {
          const note = (open + f) % 12;
          if (getScaleNotes(rootIdx, scaleInts).includes(note)) {
            const name = getNoteName(note, preferFlat);
            line += (f === 0 ? '0' : f).toString().padStart(2, ' ') + (note === rootIdx ? '*' : '-');
          } else {
            line += '---';
          }
        }
        lines[s] = line + '|';
      }
      tab += lines.join('\n') + '\n\n';
    });
    tab += '* = root note\n';
    output.textContent = tab;
  }

  rootSelect.addEventListener('change', renderFretboard);
  scaleSelect.addEventListener('change', renderFretboard);
  chordSelect.addEventListener('change', renderFretboard);
  document.getElementById('showMode').addEventListener('change', renderFretboard);
  document.getElementById('preferFlat').addEventListener('change', renderFretboard);
  document.getElementById('generateTab').addEventListener('click', generateTab);

  // Initial render
  renderFretboard();

  // Scales list
  const scaleList = document.getElementById('scaleList');
  Object.entries(SCALES).forEach(([name, ints]) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${name}</h3><p>Formula: ${ints.map(i => getIntervalName(i)).join(' ')}</p>
                      <p>Example in C: ${ints.map(i => getNoteName(i)).join(' ')}</p>`;
    scaleList.appendChild(card);
  });

  // CAGED display
  function renderCAGED() {
    const root = parseInt(document.getElementById('chordRoot').value);
    const quality = document.getElementById('chordQuality').value;
    const display = document.getElementById('cagedDisplay');
    display.innerHTML = '';
    const shapes = CAGED_SHAPES[quality];
    // Approximate open-root frets for each shape (major)
    const openRoots = quality === 'major' 
      ? { C: 0, A: 0, G: 0, E: 0, D: 0 }
      : { C: 0, A: 0, G: 0, E: 0, D: 0 };

    Object.entries(shapes).forEach(([shapeName, shape]) => {
      const card = document.createElement('div');
      card.className = 'card';
      // Simple barre estimate: find lowest non-null fret and offset by root
      const baseFrets = shape.frets.map(f => f === null ? 'x' : f);
      const tabLines = baseFrets.join('  ');
      card.innerHTML = `<h3>${shapeName} Shape</h3>
        <p><strong>${getNoteName(root)} ${quality}</strong></p>
        <pre style="font-size:1.1rem; line-height:1.4">E| ${baseFrets[0] ?? 'x'}
A| ${baseFrets[1] ?? 'x'}
D| ${baseFrets[2] ?? 'x'}
G| ${baseFrets[3] ?? 'x'}
B| ${baseFrets[4] ?? 'x'}
e| ${baseFrets[5] ?? 'x'}</pre>
        <p>Move this shape up so the root note (string ${shape.rootString + 1}) matches ${getNoteName(root)}.</p>`;
      display.appendChild(card);
    });
  }
  document.getElementById('chordRoot').addEventListener('change', renderCAGED);
  document.getElementById('chordQuality').addEventListener('change', renderCAGED);
  renderCAGED();

  // Circle of Fifths
  const circle = document.getElementById('circleOfFifths');
  CIRCLE_OF_FIFTHS.forEach((key, i) => {
    const item = document.createElement('div');
    item.className = 'circle-item';
    const angle = (i * 30 - 90) * Math.PI / 180;
    const r = 180;
    item.style.left = (250 + r * Math.cos(angle) - 30) + 'px';
    item.style.top = (250 + r * Math.sin(angle) - 30) + 'px';
    item.innerHTML = `<strong>${key}</strong><small>${RELATIVE_MINORS[i]}</small>`;
    item.addEventListener('click', () => {
      document.querySelectorAll('.circle-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      const info = document.getElementById('circleInfo');
      const idx = NOTES.indexOf(key.replace('#', '#').replace('b', 'b')); // rough
      info.innerHTML = `<strong>Key of ${key}</strong><br>
        Relative minor: ${RELATIVE_MINORS[i]}<br>
        I-IV-V: ${key} – ${CIRCLE_OF_FIFTHS[(i+11)%12]} – ${CIRCLE_OF_FIFTHS[(i+1)%12]}<br>
        Common: I-V-vi-IV etc.`;
    });
    circle.appendChild(item);
  });

  // Progressions
  function renderProgressions() {
    const keyIdx = parseInt(progKey.value);
    const list = document.getElementById('progList');
    list.innerHTML = '';
    Object.entries(PROGRESSIONS).forEach(([name, degrees]) => {
      const card = document.createElement('div');
      card.className = 'card';
      const chords = degrees.map(d => {
        if (d < 0) return getNoteName((keyIdx + d + 12) % 12) + ' (borrowed)';
        const scale = SCALES['Ionian (Major)'];
        const note = (keyIdx + scale[(d-1) % 7]) % 12;
        const quality = [0,3,4].includes((d-1)%7) ? '' : 'm'; // rough major/minor
        return getNoteName(note) + quality;
      });
      card.innerHTML = `<h3>${name}</h3><p>${chords.join(' – ')}</p>`;
      list.appendChild(card);
    });
  }
  progKey.addEventListener('change', renderProgressions);
  renderProgressions();
});
