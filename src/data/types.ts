export type SafetyTopic = 'Materials' | 'Detection' | 'Suppression' | 'Flame physics';

export interface Source {
  id: string;
  title: string;
  organization: string;
  url: string;
  kind: 'NASA data' | 'NASA overview' | 'NASA publication' | 'Challenge resource' | 'Video';
  description?: string;
}

export interface ExperimentalConditions {
  gravity: string | null;
  oxygen: string | null;
  pressure: string | null;
  airflow: string | null;
  material: string | null;
}

export interface Investigation {
  id: string;
  acronym: string;
  name: string;
  family: string;
  topic: SafetyTopic;
  summary: string;
  objective: string | null;
  conditions: ExperimentalConditions;
  measurements: string[] | null;
  platforms: string[];
  hardware: string[];
  fuelMaterials: string[];
  sourceIds: string[];
  sampleLabel?: string;
}

export interface ScenarioInput {
  oxygenPercent: string;
  pressureKpa: string;
  airflow: string;
  material: string;
  gravityContext: 'Microgravity' | 'Partial gravity' | 'Earth gravity' | 'Not specified';
}

export interface ScenarioResult {
  status: 'not-connected' | 'ready';
  summary?: string;
  evidenceSourceIds: string[];
  /** The number of input features that can be compared to reported conditions. */
  coverage?: { compared: number; supplied: number };
  /** Relevant records, ordered by transparent feature overlap rather than risk. */
  matches?: { investigationId: string; matchedFeatures: string[]; unavailableFeatures: string[] }[];
}

export interface Resource {
  id: string;
  title: string;
  organization: string;
  description: string;
  url: string;
  category: 'Research data' | 'Combustion science' | 'Mission history' | 'Technology transfer' | 'Media';
}

export interface DataProvider {
  getInvestigations(): Promise<Investigation[]>;
  getInvestigation(id: string): Promise<Investigation | undefined>;
  getSources(): Promise<Source[]>;
  getResources(): Promise<Resource[]>;
  analyzeScenario(input: ScenarioInput): Promise<ScenarioResult>;
}
