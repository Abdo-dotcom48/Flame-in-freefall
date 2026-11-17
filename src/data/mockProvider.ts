import type { DataProvider, Investigation, Resource, ScenarioInput, ScenarioResult, Source } from './types';

const sources: Source[] = [
  {
    id: 'psi', title: 'PSI Data Repository: Combustion Science', organization: 'NASA Physical Sciences Informatics',
    url: 'https://psi.nasa.gov/physci/repo/search?q=combustion', kind: 'NASA data',
    description: 'NASA repository for physical-science investigations and associated publications or data files.',
  },
  {
    id: 'combustion', title: 'Combustion Science', organization: 'NASA Glenn Research Center',
    url: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/', kind: 'NASA overview',
    description: 'NASA overview of combustion investigations, science facilities, and archived experiment families.',
  },
  {
    id: 'guide', title: 'A Researcher’s Guide to International Space Station Combustion Science', organization: 'NASA',
    url: 'https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/', kind: 'NASA publication',
    description: 'Research guide covering combustion science conducted or planned for the ISS.',
  },
  {
    id: 'bass2-report', title: 'BASS-II: Combustion Science Results on the ISS', organization: 'NASA Technical Reports Server',
    url: 'https://ntrs.nasa.gov/api/citations/20210011385/downloads/TM-20210011385.pdf?attachment=true', kind: 'NASA publication',
    description: 'Technical report describing the BASS-II experiment and its reported observations.',
  },
  {
    id: 'saffire', title: 'Spacecraft Fire Safety Demonstration (Saffire)', organization: 'NASA',
    url: 'https://www.nasa.gov/wp-content/uploads/2025/07/spacecraft-fire-safety-demonstration-saffire.pdf', kind: 'NASA publication',
    description: 'NASA overview of the Saffire series and its large-scale flame-growth and material-flammability objectives.',
  },
  {
    id: 'investigations', title: 'NASA PSI Investigations by Research Area', organization: 'NASA',
    url: 'https://www.nasa.gov/physical-sciences-informatics-psi/psi-investigations-by-research-area/', kind: 'NASA data',
    description: 'Combustion Science investigation index, including FLEX-2, SAME-R, ACME, SPICE, and SLICE.',
  },
  {
    id: 'challenge-brief', title: 'Flame in Freefall — Challenge Brief', organization: 'NASA Space Apps Challenge',
    url: 'https://www.spaceappschallenge.org/2026/challenges/flame-in-freefall/', kind: 'Challenge resource',
    description: 'Challenge context, investigation families, hardware relationships, and the stated partial-gravity data gap.',
  },
];

const investigations: Investigation[] = [
  {
    id: 'bass', acronym: 'BASS', name: 'Burning and Suppression of Solids', family: 'Solid fuels', topic: 'Materials',
    summary: 'Examines burning and extinction characteristics of solid fuel samples in microgravity.',
    objective: 'Study how a range of solid fuels burn and extinguish in microgravity to inform fire-safety research.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: null, material: 'A variety of solid fuels; specific samples vary by test' },
    measurements: null, platforms: ['International Space Station'], hardware: ['Microgravity Science Glovebox (MSG)', 'SPICE fan-driven flow duct'],
    fuelMaterials: ['Solid fuels'], sourceIds: ['combustion', 'guide'],
  },
  {
    id: 'bass-ii', acronym: 'BASS-II', name: 'Burning and Suppression of Solids II', family: 'Solid fuels', topic: 'Materials',
    summary: 'Studies ignition, flame growth, flame spread, and extinction limits for solid fuels in low-velocity forced flow.',
    objective: 'Characterize solid-fuel burning and extinction in microgravity to support flammability research and combustion models.',
    conditions: { gravity: 'Microgravity', oxygen: 'Oxygen concentration varied in the investigation', pressure: null, airflow: 'Low-velocity forced flow', material: 'Solid fuel samples; specific samples vary by test' },
    measurements: ['Flame growth and spread behavior', 'Extinction limits', 'O₂, CO, and CO₂ sensor measurements'],
    platforms: ['International Space Station'], hardware: ['Microgravity Science Glovebox (MSG)'], fuelMaterials: ['Solid fuels'], sourceIds: ['bass2-report', 'psi'],
  },
  {
    id: 'saffire', acronym: 'Saffire I–III', name: 'Spacecraft Fire Safety Demonstration', family: 'Spacecraft fire safety', topic: 'Materials',
    summary: 'A series of spacecraft experiments investigating large-scale flame growth and material flammability limits.',
    objective: 'Investigate large-scale flame growth and material flammability limits in space.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: null, material: 'Materials tested vary by Saffire experiment' },
    measurements: ['Flame growth and spread observations'], platforms: ['Cygnus cargo spacecraft after departure from the ISS'], hardware: ['Saffire experiment enclosure'],
    fuelMaterials: ['Spacecraft materials'], sourceIds: ['saffire'],
  },
  {
    id: 'same', acronym: 'SAME', name: 'Smoke Aerosol Measurement Experiment', family: 'Smoke and aerosols', topic: 'Detection',
    summary: 'Studies smoke properties relevant to spacecraft fire detection in microgravity.',
    objective: 'Characterize smoke and aerosol properties to inform spacecraft smoke-detection research.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: null, material: 'Smoke-producing samples; specific samples not stated here' },
    measurements: ['Smoke and aerosol characteristics'], platforms: ['International Space Station'], hardware: ['Microgravity Science Glovebox (MSG)', 'Smoke and aerosol measurement instruments'],
    fuelMaterials: ['Smoke-producing samples'], sourceIds: ['combustion', 'guide'],
  },
  {
    id: 'same-r', acronym: 'SAME-R', name: 'Smoke Aerosol Measurement Experiment Reflight', family: 'Smoke and aerosols', topic: 'Detection',
    summary: 'A reflight of SAME focused on smoke and aerosol measurements for spacecraft fire detection.',
    objective: 'Extend smoke and aerosol measurement research relevant to spacecraft fire detection.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: null, material: null },
    measurements: ['Smoke and aerosol characteristics'], platforms: ['International Space Station'], hardware: ['Microgravity Science Glovebox (MSG)'],
    fuelMaterials: [], sourceIds: ['investigations', 'guide'],
  },
  {
    id: 'flex', acronym: 'FLEX', name: 'Flame Extinguishment Experiment', family: 'Droplet combustion', topic: 'Suppression',
    summary: 'Studies droplet combustion and the effectiveness of inert-gas suppression in microgravity.',
    objective: 'Assess inert-gas suppressant effectiveness and determine limiting oxygen conditions for steady droplet combustion.',
    conditions: { gravity: 'Microgravity', oxygen: 'Varied in published studies', pressure: null, airflow: null, material: 'Liquid-fuel droplets; fuel varies by test' },
    measurements: ['Droplet combustion and extinction behavior'], platforms: ['International Space Station'], hardware: ['Combustion Integrated Rack (CIR)', 'Multi-user Droplet Combustion Apparatus (MDCA)'],
    fuelMaterials: ['Liquid-fuel droplets'], sourceIds: ['combustion', 'guide'],
  },
  {
    id: 'flex-2', acronym: 'FLEX-2', name: 'Flame Extinguishment Experiment 2', family: 'Droplet combustion', topic: 'Suppression',
    summary: 'Continues ISS droplet-combustion research using the Multi-user Droplet Combustion Apparatus.',
    objective: null, conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: null, material: 'Liquid-fuel droplets; specific fuel not stated here' },
    measurements: null, platforms: ['International Space Station'], hardware: ['Combustion Integrated Rack (CIR)', 'Multi-user Droplet Combustion Apparatus (MDCA)'],
    fuelMaterials: ['Liquid-fuel droplets'], sourceIds: ['investigations', 'guide'],
  },
  {
    id: 'acme', acronym: 'ACME', name: 'Advanced Combustion via Microgravity Experiments', family: 'Gaseous flames', topic: 'Flame physics',
    summary: 'A project of gaseous-fuel experiments using a modular hardware set in the Combustion Integrated Rack.',
    objective: 'Conduct fundamental microgravity combustion research; project goals include advancing combustion understanding and technology.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: null, material: 'Gaseous fuels; experiment configuration varies' },
    measurements: null, platforms: ['International Space Station'], hardware: ['Combustion Integrated Rack (CIR)', 'ACME modular hardware'],
    fuelMaterials: ['Gaseous fuels'], sourceIds: ['combustion', 'guide'],
  },
  {
    id: 'spice', acronym: 'SPICE', name: 'Smoke Point in Co-flow Experiment', family: 'Gaseous flames', topic: 'Flame physics',
    summary: 'Studies stability and extinction behavior of co-flow laminar diffusion flames.',
    objective: 'Study fundamental phenomena that control the stability and extinction of jet diffusion flames.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: 'Co-flow configuration; numeric conditions not stated here', material: 'Gaseous fuel' },
    measurements: ['Flame stability and extinction behavior'], platforms: ['International Space Station'], hardware: ['Microgravity Science Glovebox (MSG)', 'SPICE fan-driven flow duct'],
    fuelMaterials: ['Gaseous fuels'], sourceIds: ['combustion', 'guide'],
  },
  {
    id: 'slice', acronym: 'SLICE', name: 'Structure & Liftoff in Combustion Experiment', family: 'Gaseous flames', topic: 'Flame physics',
    summary: 'Uses co-flow laminar diffusion flames to study flame structure and liftoff in microgravity.',
    objective: 'Study the structure and liftoff behavior of co-flow laminar diffusion flames.',
    conditions: { gravity: 'Microgravity', oxygen: null, pressure: null, airflow: 'Co-flow configuration; numeric conditions not stated here', material: 'Gaseous fuel' },
    measurements: ['Flame structure and liftoff behavior'], platforms: ['International Space Station'], hardware: ['Microgravity Science Glovebox (MSG)', 'SPICE fan-driven flow duct'],
    fuelMaterials: ['Gaseous fuels'], sourceIds: ['combustion', 'guide'],
  },
];

const resources: Resource[] = [
  { id: 'r-psi', title: 'PSI Data Repository: Combustion Science', organization: 'NASA Physical Sciences Informatics', description: 'Browse public physical-science investigation records, publications, and data files.', url: 'https://psi.nasa.gov/physci/repo/search?q=combustion', category: 'Research data' },
  { id: 'r-combustion', title: 'NASA Combustion Science', organization: 'NASA Glenn Research Center', description: 'Introduces NASA combustion research, experiment families, and ISS facilities.', url: 'https://www.nasa.gov/glenn/glenn-expertise-space-exploration/physical-sciences-program/combustion-science/', category: 'Combustion science' },
  { id: 'r-video', title: 'The Power of Studying Combustion on the ISS', organization: 'NASA ScienceCasts', description: 'A short video introduction to NASA combustion research aboard the space station.', url: 'https://www.youtube.com/watch?v=W1oXykoz9zg', category: 'Media' },
  { id: 'r-guide', title: 'A Researcher’s Guide to ISS Combustion Science', organization: 'NASA', description: 'A broad guide to combustion science experiments conducted or planned for the ISS.', url: 'https://www.nasa.gov/missions/station/a-researchers-guide-to-combustion-science/', category: 'Combustion science' },
  { id: 'r-apollo1', title: 'Apollo 1', organization: 'NASA Safety Center', description: 'Mission and investigation information about the Apollo 1 fire and lessons learned.', url: 'https://sma.nasa.gov/sma-disciplines/accllp/apollo-1', category: 'Mission history' },
  { id: 'r-apollo13', title: 'Apollo 13', organization: 'NASA Safety Center', description: 'Mission and investigation information about the oxygen-tank accident and response.', url: 'https://sma.nasa.gov/sma-disciplines/accllp/apollo-13', category: 'Mission history' },
  { id: 'r-mir', title: '25 Years Ago: Fire Aboard Space Station Mir', organization: 'NASA History', description: 'A retrospective on the 1997 fire aboard Mir during joint operations.', url: 'https://www.nasa.gov/history/25-years-ago-fire-aboard-space-station-mir/', category: 'Mission history' },
  { id: 'r-tanks', title: 'Fireman’s Air Tanks', organization: 'NASA Spinoff', description: 'How spacesuit technology contributed to firefighter breathing equipment.', url: 'https://spinoff.nasa.gov/node/9582', category: 'Technology transfer' },
  { id: 'r-detector', title: 'Fire Detector', organization: 'NASA Spinoff', description: 'A NASA-developed smoke detector designed to distinguish smoke from dust.', url: 'https://spinoff.nasa.gov/node/9407', category: 'Technology transfer' },
  { id: 'r-attire', title: 'New Technology for the Fire Attire', organization: 'NASA Spinoff', description: 'A NASA spacesuit-technology application for firefighter protective clothing.', url: 'https://spinoff.nasa.gov/node/9918', category: 'Technology transfer' },
];

export const mockProvider: DataProvider = {
  async getInvestigations() { return investigations; },
  async getInvestigation(id) { return investigations.find((item) => item.id === id); },
  async getSources() { return sources; },
  async getResources() { return resources; },
  async analyzeScenario(input: ScenarioInput): Promise<ScenarioResult> {
    const supplied = [input.oxygenPercent, input.pressureKpa, input.airflow, input.material, input.gravityContext !== 'Not specified'].filter(Boolean).length;
    const words = input.material.toLowerCase().match(/[a-z0-9]+/g)?.filter((word) => word.length > 2) ?? [];
    const matches = investigations.map((item) => {
      const matchedFeatures: string[] = [];
      const unavailableFeatures: string[] = [];
      if (input.gravityContext !== 'Not specified') {
        if (item.conditions.gravity?.toLowerCase().includes(input.gravityContext.toLowerCase())) matchedFeatures.push('gravity context');
        else unavailableFeatures.push('gravity context');
      }
      if (words.length) {
        const recordText = `${item.conditions.material ?? ''} ${item.fuelMaterials.join(' ')}`.toLowerCase();
        if (words.some((word) => recordText.includes(word))) matchedFeatures.push('material / fuel');
        else unavailableFeatures.push('material / fuel');
      }
      if (input.oxygenPercent) {
        if (item.conditions.oxygen) matchedFeatures.push('oxygen condition');
        else unavailableFeatures.push('oxygen condition');
      }
      if (input.airflow) {
        if (item.conditions.airflow) matchedFeatures.push('airflow condition');
        else unavailableFeatures.push('airflow condition');
      }
      if (input.pressureKpa) unavailableFeatures.push('pressure');
      return { investigationId: item.id, matchedFeatures, unavailableFeatures };
    }).filter((entry) => entry.matchedFeatures.length > 0)
      .sort((a, b) => b.matchedFeatures.length - a.matchedFeatures.length)
      .slice(0, 3);
    const compared = matches.reduce((total, entry) => total + entry.matchedFeatures.length, 0);
    const evidenceSourceIds = [...new Set(matches.flatMap((entry) => investigations.find((item) => item.id === entry.investigationId)?.sourceIds ?? []))];
    const summary = matches.length
      ? `Found ${matches.length} research record${matches.length === 1 ? '' : 's'} with reported conditions that overlap your scenario. This is an evidence match, not a safety assessment.`
      : 'No record has a reported condition that can be matched to this scenario. Try a broader material description or use the investigation explorer.';
    return { status: 'ready', summary, evidenceSourceIds, coverage: { compared, supplied }, matches };
  },
};
