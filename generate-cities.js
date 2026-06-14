/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-unused-vars */
const fs = require('fs');
const path = require('path');

const CONCURRENT = 20;

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function getCentroid(ibgeId) {
  try {
    const res = await fetch(
      `https://servicodados.ibge.gov.br/api/v3/malhas/municipios/${ibgeId}/metadados`
    );
    const data = await res.json();
    if (data.length > 0 && data[0].centroide) {
      return {
        lat: parseFloat(data[0].centroide.latitude.toFixed(6)),
        lon: parseFloat(data[0].centroide.longitude.toFixed(6)),
      };
    }
  } catch {}
  return null;
}

async function processBatch(batch) {
  return Promise.all(
    batch.map(async (city) => {
      const coords = await getCentroid(city.id);
      if (coords) {
        return { n: city.n, u: city.u, lat: coords.lat, lon: coords.lon };
      }
      return null;
    })
  );
}

async function generateAllCities() {
  console.log('Buscando municípios do IBGE...');
  
  const response = await fetch('https://servicodados.ibge.gov.br/api/v1/localidades/municipios');
  const data = await response.json();
  
  const municipalities = data.map(city => ({
    id: city.id,
    n: city.nome,
    u: city.microrregiao?.mesorregiao?.UF?.sigla || '',
  }));
  
  console.log(`Total: ${municipalities.length} municípios`);
  console.log('Buscando coordenadas via IBGE API v3...\n');
  
  const outputPath = path.join(__dirname, 'public', 'localizacao', 'distancia-cidades', 'cidades.json');
  
  const allCities = [];
  let processed = 0;
  let geocoded = 0;
  
  for (let i = 0; i < municipalities.length; i += CONCURRENT) {
    const batch = municipalities.slice(i, i + CONCURRENT);
    const results = await processBatch(batch);
    
    for (const result of results) {
      if (result) {
        allCities.push(result);
        geocoded++;
      }
    }
    
    processed += batch.length;
    if (processed % 100 === 0 || processed === municipalities.length) {
      console.log(`Progresso: ${processed}/${municipalities.length} (geocodificados: ${geocoded})`);
    }
  }
  
  allCities.sort((a, b) => a.n.localeCompare(b.n, 'pt-BR'));
  fs.writeFileSync(outputPath, JSON.stringify(allCities), 'utf8');
  
  console.log(`\nConcluído!`);
  console.log(`Total de cidades: ${allCities.length}`);
}

generateAllCities().catch(console.error);
