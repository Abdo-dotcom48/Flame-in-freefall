import { useEffect, useMemo, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { dataProvider } from './data';
import type { Investigation, Resource, ScenarioInput, ScenarioResult, Source } from './data/types';

type Page = 'Overview' | 'Investigations' | 'Scenarios' | 'Resources';
type IconName = 'overview' | 'research' | 'scenario' | 'resource' | 'arrow' | 'external' | 'search' | 'filter' | 'close' | 'spark' | 'orbit' | 'chevron' | 'bookmark' | 'flame' | 'drop' | 'wave' | 'smoke';

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true as const };
  const paths: Record<IconName, ReactNode> = {
    overview: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="5" rx="2"/><rect x="14" y="12" width="7" height="9" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/></>,
    research: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/><path d="M8.3 11h5M10.8 8.5v5"/></>,
    scenario: <><path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/><circle cx="18" cy="6" r="1.5"/></>,
    resource: <><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H20v17H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 4.5v17M9 6h7M9 10h7"/></>,
    arrow: <><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></>,
    external: <><path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5"/></>,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4"/><circle cx="8" cy="7" r="1.5" fill="currentColor"/><circle cx="15" cy="12" r="1.5" fill="currentColor"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    spark: <><path d="m12 2 1.8 7.2L21 12l-7.2 2.8L12 22l-1.8-7.2L3 12l7.2-2.8L12 2Z"/><path d="m19 2 .6 2.4L22 5l-2.4.6L19 8l-.6-2.4L16 5l2.4-.6L19 2Z"/></>,
    orbit: <><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(-36 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4.5" transform="rotate(36 12 12)"/><circle cx="12" cy="12" r="1.7" fill="currentColor"/></>,
    chevron: <path d="m8 10 4 4 4-4"/>,
    bookmark: <><path d="M6 4.5A2.5 2.5 0 0 1 8.5 2H19v19l-6.5-4-6.5 4z"/><path d="M6 4.5V21"/></>,
    flame: <><path d="M12.4 2.5c.8 3.2-.6 4.3-2.1 6.1C8.8 10.4 8 12.2 8 14a4 4 0 0 0 8 0c0-1-.3-2-1-3.1 2.2 1.1 4 3.3 4 6A7 7 0 0 1 5 17c0-4.3 3.2-6.7 5-9.5 1-1.5 1.6-3.1 2.4-5Z"/></>,
    drop: <><path d="M12 2.7S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.7 12 2.7Z"/><path d="M9 15.5a3 3 0 0 0 3 3"/></>,
    wave: <><path d="M3 13c2.2 0 2.2-5 4.5-5S9.8 16 12 16s2.2-8 4.5-8S18.7 13 21 13"/><path d="M3 19h18"/></>,
    smoke: <><path d="M7 18.5a3.5 3.5 0 0 1 0-7 5 5 0 0 1 9-2A4.5 4.5 0 1 1 17.5 18H7Z"/><path d="M8 21h8"/></>,
  };
  return <svg {...shared}>{paths[name]}</svg>;
}

const pageIcons: Record<Page, IconName> = { Overview: 'overview', Investigations: 'research', Scenarios: 'scenario', Resources: 'resource' };
const topicMeta = [
  { title: 'Material behavior', topic: 'Materials', icon: 'flame' as const, tint: 'amber', text: 'Solid-fuel burning, flame spread, and extinction are studied across BASS and Saffire.' },
  { title: 'Smoke & aerosols', topic: 'Detection', icon: 'smoke' as const, tint: 'blue', text: 'SAME and SAME-R explore smoke properties that matter to spacecraft detection.' },
  { title: 'Droplet combustion', topic: 'Suppression', icon: 'drop' as const, tint: 'cyan', text: 'FLEX investigations examine liquid-fuel droplets and suppression by inert-gas dilution.' },
  { title: 'Gaseous flames', topic: 'Flame physics', icon: 'wave' as const, tint: 'violet', text: 'ACME, SPICE, and SLICE study gaseous flames in controlled research hardware.' },
];

const emptyScenario: ScenarioInput = { oxygenPercent: '', pressureKpa: '', airflow: '', material: '', gravityContext: 'Not specified' };

function ExternalLink({ source, label }: { source: Source; label?: string }) {
  return <a className="source-link" href={source.url} target="_blank" rel="noreferrer" aria-label={`${label ?? source.title} (opens in a new tab)`}>
    <span>{label ?? source.title}</span><Icon name="external" size={14} />
  </a>;
}

function SourcePill({ source }: { source: Source }) {
  return <a className="source-pill" href={source.url} target="_blank" rel="noreferrer" aria-label={`${source.title}, opens in a new tab`}>
    <span className="source-dot" />{source.organization}<Icon name="external" size={12} />
  </a>;
}

function App() {
  const [page, setPage] = useState<Page>('Overview');
  const [investigations, setInvestigations] = useState<Investigation[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedId, setSelectedId] = useState('bass-ii');
  const [query, setQuery] = useState('');
  const [topicFilter, setTopicFilter] = useState('All topics');
  const [materialFilter, setMaterialFilter] = useState('All materials');
  const [platformFilter, setPlatformFilter] = useState('All platforms');
  const [hardwareFilter, setHardwareFilter] = useState('All hardware');
  const [resourceQuery, setResourceQuery] = useState('');
  const [scenario, setScenario] = useState<ScenarioInput>(emptyScenario);
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | null>(null);
  const [scenarioBusy, setScenarioBusy] = useState(false);

  useEffect(() => {
    let current = true;
    void Promise.all([dataProvider.getInvestigations(), dataProvider.getSources(), dataProvider.getResources()]).then(([items, refs, library]) => {
      if (!current) return;
      setInvestigations(items);
      setSources(refs);
      setResources(library);
    });
    return () => { current = false; };
  }, []);

  const sourceById = useMemo(() => new Map(sources.map((source) => [source.id, source])), [sources]);
  const selected = investigations.find((item) => item.id === selectedId) ?? investigations[0];
  const materials = useMemo(() => Array.from(new Set(investigations.flatMap((item) => item.fuelMaterials))).sort(), [investigations]);
  const platforms = useMemo(() => Array.from(new Set(investigations.flatMap((item) => item.platforms))).sort(), [investigations]);
  const hardware = useMemo(() => Array.from(new Set(investigations.flatMap((item) => item.hardware))).sort(), [investigations]);
  const filteredInvestigations = useMemo(() => investigations.filter((item) => {
    const searchable = [item.acronym, item.name, item.summary, item.family, ...item.fuelMaterials, ...item.platforms, ...item.hardware].join(' ').toLowerCase();
    return (!query || searchable.includes(query.toLowerCase()))
      && (topicFilter === 'All topics' || item.topic === topicFilter)
      && (materialFilter === 'All materials' || item.fuelMaterials.includes(materialFilter))
      && (platformFilter === 'All platforms' || item.platforms.includes(platformFilter))
      && (hardwareFilter === 'All hardware' || item.hardware.includes(hardwareFilter));
  }), [investigations, query, topicFilter, materialFilter, platformFilter, hardwareFilter]);
  const filteredResources = useMemo(() => resources.filter((item) => `${item.title} ${item.organization} ${item.description} ${item.category}`.toLowerCase().includes(resourceQuery.toLowerCase())), [resources, resourceQuery]);

  function navigate(next: Page) {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function clearFilters() {
    setQuery(''); setTopicFilter('All topics'); setMaterialFilter('All materials'); setPlatformFilter('All platforms'); setHardwareFilter('All hardware');
  }

  function openRecord(id: string) {
    setSelectedId(id);
    setPage('Investigations');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function prepareScenario(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setScenarioBusy(true);
    setScenarioResult(null);
    try {
      setScenarioResult(await dataProvider.analyzeScenario(scenario));
    } finally {
      setScenarioBusy(false);
    }
  }

  const challengeSource = sourceById.get('challenge-brief');

  return <div className="app-shell">
    <aside className="sidebar">
      <a className="brand" href="#overview" onClick={(event) => { event.preventDefault(); navigate('Overview'); }} aria-label="Flame in Freefall home">
        <span className="brand-mark"><Icon name="orbit" size={24} /></span>
        <span><strong>FREEFALL</strong><small>COMBUSTION ATLAS</small></span>
      </a>
      <div className="nav-section-label">WORKSPACE</div>
      <nav className="primary-nav" aria-label="Main navigation">
        {(['Overview', 'Investigations', 'Scenarios', 'Resources'] as Page[]).map((item) => <button key={item} className={`nav-item ${page === item ? 'active' : ''}`} onClick={() => navigate(item)} aria-current={page === item ? 'page' : undefined}>
          <Icon name={pageIcons[item]} size={18} /><span>{item}</span>{page === item && <span className="nav-active-mark" />}
        </button>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-orbit"><div className="orbit-ring orbit-a"/><div className="orbit-ring orbit-b"/><span className="orbit-core"/><span className="orbit-satellite"/></div>
        <p>Read the evidence.<br />Keep its limits in view.</p>
        <span className="prototype-tag"><span className="status-dot" /> ILLUSTRATIVE RECORDS</span>
      </div>
      <div className="sidebar-footer"><span>Independent research prototype</span><span className="no-endorsement">Not affiliated with or endorsed by NASA</span></div>
    </aside>

    <div className="main-shell">
      <header className="topbar">
        <div className="breadcrumb"><span>RESEARCH ATLAS</span><span className="breadcrumb-separator">/</span><strong>{page}</strong></div>
        <div className="topbar-right"><span className="demo-chip"><span className="status-dot" /> DEMO DATA</span><span className="topbar-divider"/><span className="topbar-date">SOURCE-FIRST EXPLORER</span></div>
      </header>

      <main className="page-content">
        {page === 'Overview' && <OverviewPage investigations={investigations} sources={sourceById} onNavigate={navigate} onOpen={openRecord} challengeSource={challengeSource} />}
        {page === 'Investigations' && <InvestigationsPage
          items={filteredInvestigations} allItems={investigations} selected={selected} sourceById={sourceById} selectedId={selectedId}
          query={query} setQuery={setQuery} topicFilter={topicFilter} setTopicFilter={setTopicFilter} materialFilter={materialFilter} setMaterialFilter={setMaterialFilter}
          platformFilter={platformFilter} setPlatformFilter={setPlatformFilter} hardwareFilter={hardwareFilter} setHardwareFilter={setHardwareFilter}
          materials={materials} platforms={platforms} hardware={hardware} onSelect={setSelectedId} onClear={clearFilters}
        />}
        {page === 'Scenarios' && <ScenarioPage scenario={scenario} setScenario={(next) => { setScenario(next); setScenarioResult(null); }} onSubmit={prepareScenario} busy={scenarioBusy} result={scenarioResult} />}
        {page === 'Resources' && <ResourcesPage resources={filteredResources} query={resourceQuery} setQuery={setResourceQuery} />}
      </main>

      <footer className="page-footer"><span>FLAME IN FREEFALL <i>·</i> FRONTEND PROTOTYPE</span><span>Summaries link to their source. Unreported fields stay unreported.</span></footer>
    </div>
  </div>;
}

export default App;

function OverviewPage({ investigations, sources, onNavigate, onOpen, challengeSource }: {
  investigations: Investigation[]; sources: Map<string, Source>; onNavigate: (page: Page) => void; onOpen: (id: string) => void; challengeSource?: Source;
}) {
  const cards = [
    { id: 'bass-ii', code: '01 / MATERIALS', title: 'What can ignite, spread, or go out?', text: topicMeta[0].text, icon: 'flame' as const, color: 'amber', sourceId: 'bass2-report' },
    { id: 'same', code: '02 / DETECTION', title: 'How does smoke move and register?', text: topicMeta[1].text, icon: 'smoke' as const, color: 'blue', sourceId: 'combustion' },
    { id: 'flex', code: '03 / SUPPRESSION', title: 'What changes a droplet flame?', text: topicMeta[2].text, icon: 'drop' as const, color: 'cyan', sourceId: 'combustion' },
    { id: 'acme', code: '04 / FLAME PHYSICS', title: 'How do gas flames behave?', text: topicMeta[3].text, icon: 'wave' as const, color: 'violet', sourceId: 'guide' },
  ];
  return <>
    <section className="hero-panel">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-line"/> NASA LOW-GRAVITY COMBUSTION RESEARCH</span>
        <h1>Fire behaves differently<br />when <em>nothing rises.</em></h1>
        <p className="hero-description">Explore the evidence behind flame behavior, smoke detection, and suppression in spaceflight research — with every summary tied back to a source.</p>
        <div className="hero-actions"><button className="button button-primary" onClick={() => onNavigate('Investigations')}>Explore investigations <Icon name="arrow" size={16}/></button><button className="text-button" onClick={() => onNavigate('Resources')}>Browse source library <Icon name="arrow" size={15}/></button></div>
        <div className="hero-note"><span className="note-icon"><Icon name="spark" size={15}/></span><span><strong>Evidence, not prediction.</strong> This prototype organizes research; it does not estimate fire risk.</span></div>
      </div>
      <div className="hero-visual" aria-label="Illustration of flame research pathways">
        <div className="visual-kicker">RESEARCH LANDSCAPE <span>01—04</span></div>
        <div className="flame-orbit"><div className="glow-core"/><div className="flame-shape flame-one"/><div className="flame-shape flame-two"/><div className="flame-shape flame-three"/><div className="visual-ring ring-one"/><div className="visual-ring ring-two"/><div className="visual-ring ring-three"/><span className="orbit-point point-one"/><span className="orbit-point point-two"/><span className="orbit-point point-three"/></div>
        <div className="visual-caption"><span>THE QUESTION</span><strong>What changes<br />without buoyancy?</strong><span>FLAME · FLOW · FUEL</span></div>
        <span className="visual-coordinate">MICROGRAVITY / ISS RESEARCH CONTEXT</span>
      </div>
    </section>

    <section className="section-block topic-section">
      <div className="section-heading"><div><span className="eyebrow muted-eyebrow">FOUR RESEARCH LENSES</span><h2>Follow the evidence trail</h2></div><button className="text-button" onClick={() => onNavigate('Investigations')}>All investigations <Icon name="arrow" size={15}/></button></div>
      <div className="topic-grid">
        {cards.map((card) => <article className="topic-card" key={card.id}>
          <div className={`topic-icon ${card.color}`}><Icon name={card.icon} size={19}/></div><span className="topic-code">{card.code}</span>
          <h3>{card.title}</h3><p>{card.text}</p>
          <button className="card-link" onClick={() => onOpen(card.id)}>Open investigation <Icon name="arrow" size={14}/></button>
          {sources.get(card.sourceId) && <div className="card-source"><span>TRACE</span><SourcePill source={sources.get(card.sourceId)!}/></div>}
        </article>)}
      </div>
    </section>

    <section className="section-block platform-section">
      <div className="section-heading"><div><span className="eyebrow muted-eyebrow">PLATFORMS & HARDWARE</span><h2>Where the research happens</h2></div><span className="section-side-note">A map of relationships, not a mission timeline</span></div>
      <div className="platform-map">
        <div className="platform-root"><span className="platform-icon"><Icon name="orbit" size={20}/></span><div><small>RESEARCH PLATFORM</small><strong>International Space Station</strong></div><span className="root-tag">ISS</span></div>
        <div className="platform-branches">
          <div className="branch-line"/>
          <div className="platform-node"><span className="node-mark amber-mark"/><div><strong>CIR + MDCA</strong><span>Droplet combustion and gaseous-flame work</span></div><span className="node-tag">FLEX · ACME</span></div>
          <div className="platform-node"><span className="node-mark blue-mark"/><div><strong>MSG</strong><span>Solid fuels, smoke studies, and co-flow flames</span></div><span className="node-tag">BASS · SAME · SPICE</span></div>
          <div className="platform-node"><span className="node-mark violet-mark"/><div><strong>Cygnus</strong><span>Saffire experiments after station departure</span></div><span className="node-tag">SAFFIRE</span></div>
        </div>
        <div className="platform-map-source">Based on NASA combustion overview and challenge hardware notes {challengeSource && <SourcePill source={challengeSource}/>}</div>
      </div>
    </section>

    <section className="insight-row">
      <div className="insight-copy"><span className="eyebrow muted-eyebrow">EVIDENCE GAP</span><h2>Partial gravity remains an open chapter.</h2>
        <p>The challenge brief states that PSI currently has no direct partial-gravity combustion data. It distinguishes this gap from ACME’s electric-field experiment, which mimicked partial-gravity effects.</p>
        <div className="gap-chips"><span><i className="gap-dot filled"/> Microgravity studies</span><span><i className="gap-dot outline"/> Partial gravity data gap</span></div>
        {challengeSource && <ExternalLink source={challengeSource} label="Read the challenge source"/>}
      </div>
      <div className="gap-visual"><div className="gravity-track"><span className="gravity-end earth"/><span className="gravity-segment"/><span className="gravity-gap"><i/><i/><i/></span><span className="gravity-segment active-segment"/><span className="gravity-end micro"/></div><div className="gravity-labels"><span>Earth gravity</span><span>Partial gravity</span><span>Microgravity</span></div><div className="gap-caption"><span className="gap-caption-mark">?</span><span><strong>Evidence boundary</strong><small>Intermediate conditions are not established by these records.</small></span></div></div>
    </section>

    <section className="section-block insight-list-section">
      <div className="section-heading"><div><span className="eyebrow muted-eyebrow">READ WITH CONTEXT</span><h2>Small summaries. Clear provenance.</h2></div><span className="section-side-note">No scores. No inferred outcomes.</span></div>
      <div className="insight-list">
        <div className="insight-list-item"><span className="insight-index">A</span><div><strong>Records describe different questions.</strong><p>Materials, smoke detection, droplet flames, and gaseous flames use different methods and should be compared with care.</p></div><Icon name="research" size={18}/></div>
        <div className="insight-list-item"><span className="insight-index">B</span><div><strong>Conditions belong beside every finding.</strong><p>Oxygen, pressure, flow, gravity, and fuel are shown only when a linked source reports them.</p></div><Icon name="filter" size={18}/></div>
        <div className="insight-list-item"><span className="insight-index">C</span><div><strong>Every source opens at the point of use.</strong><p>Follow each card back to a NASA research page, report, repository, or the challenge brief.</p></div><Icon name="external" size={18}/></div>
      </div>
    </section>
    <div className="overview-endnote"><Icon name="bookmark" size={16}/><span>{investigations.length ? `${investigations.length} illustrative demo records` : 'Loading reference records'} <i>·</i> Ordering is illustrative, not a ranking.</span><button className="text-button" onClick={() => onNavigate('Investigations')}>Open explorer <Icon name="arrow" size={14}/></button></div>
  </>;
}

function InvestigationsPage({ items, allItems, selected, sourceById, selectedId, query, setQuery, topicFilter, setTopicFilter, materialFilter, setMaterialFilter, platformFilter, setPlatformFilter, hardwareFilter, setHardwareFilter, materials, platforms, hardware, onSelect, onClear }: {
  items: Investigation[]; allItems: Investigation[]; selected?: Investigation; sourceById: Map<string, Source>; selectedId: string;
  query: string; setQuery: (value: string) => void; topicFilter: string; setTopicFilter: (value: string) => void; materialFilter: string; setMaterialFilter: (value: string) => void;
  platformFilter: string; setPlatformFilter: (value: string) => void; hardwareFilter: string; setHardwareFilter: (value: string) => void;
  materials: string[]; platforms: string[]; hardware: string[]; onSelect: (id: string) => void; onClear: () => void;
}) {
  return <>
    <PageHeading eyebrow="EVIDENCE EXPLORER" title="Investigations" intro="Browse the experiments by topic, fuel, platform, and hardware. Open a record to inspect what its source reports — and what it leaves unknown." />
    <div className="explorer-toolbar"><label className="search-field"><Icon name="search" size={17}/><span className="sr-only">Search investigations</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, material, or topic…" /></label><span className="filter-label"><Icon name="filter" size={16}/> FILTERS</span><button className="clear-filters" onClick={onClear}>Clear filters</button></div>
    <div className="filter-grid">
      <FilterSelect label="Safety topic" value={topicFilter} onChange={setTopicFilter} options={['All topics', 'Materials', 'Detection', 'Suppression', 'Flame physics']} />
      <FilterSelect label="Fuel or material" value={materialFilter} onChange={setMaterialFilter} options={['All materials', ...materials]} />
      <FilterSelect label="Platform" value={platformFilter} onChange={setPlatformFilter} options={['All platforms', ...platforms]} />
      <FilterSelect label="Hardware" value={hardwareFilter} onChange={setHardwareFilter} options={['All hardware', ...hardware]} />
    </div>
    <div className="explorer-layout">
      <section className="record-list" aria-label="Investigation records">
        <div className="list-heading"><div><span className="eyebrow muted-eyebrow">CURATED DEMO RECORDS</span><h2>Research records</h2></div><span className="record-count">{items.length} of {allItems.length} demo records</span></div>
        {items.length === 0 ? <div className="empty-state"><span className="empty-icon"><Icon name="search" size={21}/></span><h3>No investigations match</h3><p>Try a broader search or clear one of the filters.</p><button className="button button-secondary" onClick={onClear}>Clear filters</button></div> : <div className="record-stack">{items.map((item, index) => <button className={`record-card ${selectedId === item.id ? 'selected' : ''}`} key={item.id} onClick={() => onSelect(item.id)} aria-pressed={selectedId === item.id}>
          <div className="record-topline"><span className="record-family">{item.family}</span><span className="record-number">{String(index + 1).padStart(2, '0')}</span></div><div className="record-title-row"><h3>{item.acronym}</h3><span className="topic-badge">{item.topic}</span></div><p>{item.name}</p><p className="record-summary">{item.summary}</p><div className="record-tags">{item.fuelMaterials.slice(0, 2).map((material) => <span key={material}>{material}</span>)}<span>{item.platforms[0] ?? 'Platform not stated'}</span></div>
        </button>)}</div>}
      </section>
      <InvestigationDetail key={selected?.id ?? 'empty'} item={selected} sources={sourceById} />
    </div>
  </>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="filter-select"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option}>{option}</option>)}</select><Icon name="chevron" size={15}/></label>;
}

function InvestigationDetail({ item, sources }: { item?: Investigation; sources: Map<string, Source> }) {
  if (!item) return <section className="detail-panel empty-detail"><span className="empty-icon"><Icon name="research" size={20}/></span><h2>Select an investigation</h2><p>Choose a record from the list to inspect its reported details.</p></section>;
  const conditionRows: [string, string | null][] = [
    ['Gravity', item.conditions.gravity], ['Oxygen concentration', item.conditions.oxygen], ['Pressure', item.conditions.pressure], ['Airflow', item.conditions.airflow], ['Fuel / material', item.conditions.material],
  ];
  const itemSources = item.sourceIds.map((id) => sources.get(id)).filter((source): source is Source => Boolean(source));
  return <section className="detail-panel">
    <div className="detail-top"><div><span className="eyebrow muted-eyebrow">INVESTIGATION RECORD</span><span className="detail-topic">{item.topic}</span></div><button className="icon-button" aria-label="Selected record" title="Selected record"><Icon name="bookmark" size={17}/></button></div>
    <h2>{item.acronym}</h2><h3 className="detail-name">{item.name}</h3><p className="detail-summary">{item.summary}</p>
    <div className="detail-rule"/>
    <div className="detail-section"><div className="detail-section-heading"><span>OBJECTIVE</span><span className="section-mini-mark">01</span></div><p>{item.objective ?? <Unknown />}</p></div>
    <div className="detail-section"><div className="detail-section-heading"><span>AVAILABLE CONDITIONS</span><span className="section-mini-mark">02</span></div><dl className="conditions-list">{conditionRows.map(([label, value]) => <div className="condition-row" key={label}><dt>{label}</dt><dd>{value ?? <Unknown />}</dd></div>)}</dl></div>
    <div className="detail-section"><div className="detail-section-heading"><span>MEASUREMENTS</span><span className="section-mini-mark">03</span></div>{item.measurements?.length ? <ul className="measurement-list">{item.measurements.map((measurement) => <li key={measurement}><span className="list-dot"/>{measurement}</li>)}</ul> : <p><Unknown /></p>}</div>
    <div className="detail-section detail-hardware"><div className="detail-section-heading"><span>PLATFORM & HARDWARE</span><span className="section-mini-mark">04</span></div><div className="detail-chips">{item.platforms.map((value) => <span className="detail-chip platform-chip" key={value}><Icon name="orbit" size={13}/>{value}</span>)}{item.hardware.map((value) => <span className="detail-chip" key={value}>{value}</span>)}</div></div>
    <div className="detail-sources"><div className="detail-section-heading"><span>SOURCE LINKS</span><span className="section-mini-mark">↗</span></div>{itemSources.length ? itemSources.map((source) => <a className="detail-source" href={source.url} target="_blank" rel="noreferrer" key={source.id} aria-label={`${source.title}, opens in a new tab`}><span className="source-file-icon"><Icon name="resource" size={16}/></span><span><strong>{source.title}</strong><small>{source.organization} · opens in a new tab</small></span><Icon name="external" size={15}/></a>) : <p><Unknown /></p>}</div>
    <div className="detail-disclaimer"><Icon name="spark" size={15}/><span>Record summaries are descriptive. No ranking or fire-safety prediction is generated.</span></div>
  </section>;
}

function Unknown() { return <span className="unknown-value">Not stated in linked source</span>; }

function ScenarioPage({ scenario, setScenario, onSubmit, busy, result }: { scenario: ScenarioInput; setScenario: (scenario: ScenarioInput) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void; busy: boolean; result: ScenarioResult | null }) {
  function update<K extends keyof ScenarioInput>(key: K, value: ScenarioInput[K]) {
    setScenario({ ...scenario, [key]: value });
  }
  return <>
    <PageHeading eyebrow="MISSION CONDITIONS" title="Scenario workspace" intro="Describe a set of conditions to find research records with overlapping reported features. The result is a traceable evidence match, never a fire-risk prediction." />
    <div className="scenario-banner"><div className="scenario-banner-mark"><Icon name="spark" size={19}/></div><div><strong>MULTI-FEATURE MATCHING</strong><p>Compare gravity, material, oxygen, airflow, and pressure reporting across the research records.</p></div><span className="demo-chip"><span className="status-dot"/> LOCAL DEMO</span></div>
    <div className="scenario-layout">
      <form className="scenario-form" onSubmit={onSubmit}>
        <div className="form-heading"><div><span className="eyebrow muted-eyebrow">SCENARIO INPUT</span><h2>Mission conditions</h2></div><span className="form-step">01 <i>/</i> 02</span></div>
        <div className="form-fields">
          <label className="form-field"><span>Oxygen concentration <small>%</small></span><input type="number" min="0" max="100" step="any" inputMode="decimal" value={scenario.oxygenPercent} onChange={(event) => update('oxygenPercent', event.target.value)} placeholder="Enter a value" /></label>
          <label className="form-field"><span>Pressure <small>kPa</small></span><input type="number" min="0" step="any" inputMode="decimal" value={scenario.pressureKpa} onChange={(event) => update('pressureKpa', event.target.value)} placeholder="Enter a value" /></label>
          <label className="form-field"><span>Airflow <small>m/s</small></span><input type="number" min="0" step="any" inputMode="decimal" value={scenario.airflow} onChange={(event) => update('airflow', event.target.value)} placeholder="Enter a value" /></label>
          <label className="form-field"><span>Material or fuel</span><input value={scenario.material} onChange={(event) => update('material', event.target.value)} placeholder="Enter a material" /></label>
          <FilterSelect label="Gravity context" value={scenario.gravityContext} onChange={(value) => update('gravityContext', value as ScenarioInput['gravityContext'])} options={['Not specified', 'Microgravity', 'Partial gravity', 'Earth gravity']} />
        </div>
        <div className="form-footnote"><Icon name="orbit" size={15}/><span>Use units shown. The fields do not imply that matching experimental data exists.</span></div>
        <div className="form-actions"><button className="button button-primary" type="submit" disabled={busy}>{busy ? 'Preparing…' : 'Prepare scenario'} <Icon name="arrow" size={15}/></button><button className="text-button reset-button" type="button" onClick={() => setScenario(emptyScenario)}>Reset fields</button></div>
      </form>
      <aside className="scenario-results">
        <div className="results-topline"><span className="eyebrow muted-eyebrow">EVIDENCE MATCH</span><span className={`results-status ${result?.status === 'ready' ? 'ready' : ''}`}><i/> {result?.status === 'ready' ? 'READY' : 'AWAITING INPUT'}</span></div>
        {result?.status === 'ready' ? <ScenarioMatchResult result={result} /> : <>
          <div className="results-illustration"><div className="results-orbit"><span/><i/><i/><i/></div><div className="results-dashes"><i/><i/><i/><i/><i/></div></div>
          <h2>Build an evidence match</h2><p>Enter one or more mission conditions to find investigations with overlapping reported features.</p>
        </>}
        <div className="results-divider"/><div className="results-footer"><span>NO RISK SCORE</span><span>NO PREDICTION</span><span>TRACEABLE MATCHES</span></div>
      </aside>
    </div>
    <section className="scenario-note"><span className="note-index">WHY THIS MATTERS</span><p>NASA’s challenge brief calls out oxygen concentration and airflow as important to flammability in microgravity. A future analysis should preserve the source and conditions behind every comparison.</p><span className="note-source">SOURCE-READY BY DESIGN</span></section>
  </>;
}

function ScenarioMatchResult({ result }: { result: ScenarioResult }) {
  return <div className="match-result">
    <div className="match-orb"><span>{result.matches?.length ?? 0}</span><small>RECORDS</small></div>
    <h2>Closest research context</h2><p>{result.summary}</p>
    <div className="coverage-line"><span>REPORTED FEATURE OVERLAP</span><strong>{result.coverage?.compared ?? 0} matches</strong></div>
    <div className="match-list">{result.matches?.map((match) => <div className="match-item" key={match.investigationId}>
      <strong>{match.investigationId.toUpperCase()}</strong><span>{match.matchedFeatures.join(' · ')}</span>
    </div>)}</div>
  </div>;
}

function ResourcesPage({ resources, query, setQuery }: { resources: Resource[]; query: string; setQuery: (value: string) => void }) {
  return <>
    <PageHeading eyebrow="SOURCE LIBRARY" title="Resources" intro="The challenge’s ten reference links, with a quick note on what each one supports. Every external link opens in a new tab." />
    <div className="resource-intro"><span className="resource-intro-icon"><Icon name="resource" size={18}/></span><div><strong>Start with the research record</strong><p>Use PSI and NASA’s combustion overview to trace investigation records. The historical and technology-transfer links add mission context.</p></div><span className="resource-count-badge">10 CHALLENGE RESOURCES</span></div>
    <label className="search-field resource-search"><Icon name="search" size={17}/><span className="sr-only">Search resources</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search resources…" /></label>
    {resources.length === 0 ? <div className="empty-state resource-empty"><span className="empty-icon"><Icon name="search" size={21}/></span><h3>No resources match</h3><p>Try another search term.</p><button className="button button-secondary" onClick={() => setQuery('')}>Clear search</button></div> : <div className="resource-grid">{resources.map((resource, index) => <article className="resource-card" key={resource.id}>
      <div className="resource-card-top"><span className="resource-index">{String(index + 1).padStart(2, '0')}</span><span className={`resource-category category-${resource.category.toLowerCase().replace(/ /g, '-')}`}>{resource.category}</span></div>
      <div className="resource-card-icon"><Icon name={resource.category === 'Research data' ? 'research' : resource.category === 'Media' ? 'wave' : resource.category === 'Mission history' ? 'orbit' : 'resource'} size={19}/></div>
      <h2>{resource.title}</h2><span className="resource-org">{resource.organization}</span><p>{resource.description}</p>
      <a className="resource-open" href={resource.url} target="_blank" rel="noreferrer" aria-label={`${resource.title}, opens in a new tab`}><span>Open resource <small>↗ new tab</small></span><Icon name="external" size={16}/></a>
    </article>)}</div>}
    <div className="resource-footnote"><Icon name="spark" size={15}/><span>Resource summaries are brief guides. Follow the source link for full context and access terms.</span></div>
  </>;
}

function PageHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return <div className="page-heading"><span className="eyebrow muted-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>;
}
