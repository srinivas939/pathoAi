// dataset_training/generate_excel.cjs
// Utility script to create JSON dataset index from CSV

const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'pathology_dataset.csv');
const jsonPath = path.join(__dirname, 'pathology_dataset.json');

function buildDataset() {
  if (!fs.existsSync(csvPath)) {
    console.error('pathology_dataset.csv not found');
    return;
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim().length > 0);

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const row = [];
    let insideQuote = false;
    let entry = '';
    const line = lines[i];

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        row.push(entry.trim());
        entry = '';
      } else {
        entry += char;
      }
    }
    row.push(entry.trim());

    if (row.length >= 11) {
      records.push({
        imageId: row[0],
        diseaseName: row[1],
        category: row[2],
        confidence: parseFloat(row[3]) || 95.0,
        severity: row[4],
        description: row[5].replace(/^"|"$/g, ''),
        differentialDiagnosis: row[6].replace(/^"|"$/g, '').split(';').map(s => s.trim()),
        precautions: row[7].replace(/^"|"$/g, '').split(';').map(s => s.trim()),
        recommendedMedicines: row[8].replace(/^"|"$/g, '').split(';').map(medStr => {
          const match = medStr.match(/^(.*?)\s*\((.*?)\)$/);
          if (match) {
            const parts = match[2].split(',').map(p => p.trim());
            return {
              name: match[1],
              dosage: parts[0] || 'Standard dosage',
              frequency: parts[1] || 'As prescribed',
              duration: parts[2] || 'Until resolved',
              instructions: parts[3] || 'Consult physician'
            };
          }
          return {
            name: medStr,
            dosage: 'Standard application',
            frequency: 'Daily',
            duration: '7 days',
            instructions: 'Use as directed by doctor'
          };
        }),
        recommendedDiet: row[9].replace(/^"|"$/g, '').split(';').map(s => s.trim()),
        recommendedSpecialist: row[10]
      });
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2));
  console.log(`Successfully indexed ${records.length} dataset training cases to pathology_dataset.json`);
}

buildDataset();
