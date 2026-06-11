// Simple local test server for Gantt chart external API connector testing.
// No dependencies — uses only Node.js built-in http module.
// Run: node test-server/server.mjs
// Default port: 3456 (set PORT env var to override)

import http from 'node:http';

const PORT = parseInt(process.env.PORT || '3456', 10);

// ── Test data ────────────────────────────────────────────────────────

// 14 persons across different roles
const persons = [
  { id: 'p001', name: 'Zhang Wei', position: 'Senior Backend Engineer', avatar: 'https://i.pravatar.cc/48?u=zhangwei' },
  { id: 'p002', name: 'Li Na', position: 'UI Designer', avatar: 'https://i.pravatar.cc/48?u=lina' },
  { id: 'p003', name: 'Wang Fang', position: 'Engineering Manager' },
  { id: 'p004', name: 'Chen Jie', position: 'Frontend Developer', avatar: 'https://i.pravatar.cc/48?u=chenjie' },
  { id: 'p005', name: 'Liu Yang', position: 'DevOps Engineer' },
  { id: 'p006', name: 'Huang Li', position: 'QA Lead' },
  { id: 'p007', name: 'Zhao Min', position: 'Product Manager', avatar: 'https://i.pravatar.cc/48?u=zhaomin' },
  { id: 'p008', name: 'Sun Hao', position: 'Backend Developer' },
  { id: 'p009', name: 'Wu Jing', position: 'Data Engineer' },
  { id: 'p010', name: 'Xu Mei', position: 'Technical Writer' },
  { id: 'p011', name: 'Ma Ke', position: 'Mobile Developer' },
  { id: 'p012', name: 'Lin Feng', position: 'Security Engineer' },
  { id: 'p013', name: 'Zhou Lei', position: 'Data Scientist' },
  { id: 'p014', name: 'Tang Rui', position: 'UX Researcher' },
];

// 10 projects with varied statuses
const projects = [
  { id: 'proj-crm', name: 'CRM Platform', status: 'in-progress', requester: 'Sales Dept', tags: ['sales', 'internal'], metadata: { priority: 'P0', budget: '$500K' } },
  { id: 'proj-mobile', name: 'Mobile Banking App', color: '#7B61F8', status: 'in-progress', requester: 'Retail Banking', tags: ['mobile', 'customer-facing'], metadata: { platform: 'iOS+Android', budget: '$1.2M' } },
  { id: 'proj-data', name: 'Data Lake Migration', color: '#98C379', status: 'pending', requester: 'Data Platform', tags: ['data', 'infrastructure'] },
  { id: 'proj-qa', name: 'QA Automation', color: '#E06C75', status: 'online', requester: 'Engineering', tags: ['quality', 'devtools'], metadata: { coverage: '85%', framework: 'Playwright' } },
  { id: 'proj-portal', name: 'Customer Portal v2', color: '#E5C07B', status: 'in-progress', requester: 'Product', tags: ['web', 'customer-facing'], metadata: { stack: 'Next.js', launch: 'Q3' } },
  { id: 'proj-infra', name: 'Infrastructure Upgrade', color: '#56B6C2', status: 'pending', requester: 'SRE Team', tags: ['infrastructure', 'security'] },
  { id: 'proj-analytics', name: 'Real-time Analytics', color: '#C678DD', status: 'in-progress', requester: 'BI Team', tags: ['data', 'internal'], metadata: { stack: 'Kafka+ClickHouse' } },
  { id: 'proj-auth', name: 'SSO & Auth Service', color: '#BE5046', status: 'online', requester: 'Security', tags: ['security', 'platform'], metadata: { protocols: ['OAuth2', 'OIDC', 'SAML'] } },
  { id: 'proj-notify', name: 'Notification Center', color: '#61AFEF', status: 'pending', requester: 'Product', tags: ['platform', 'internal'] },
  { id: 'proj-search', name: 'Full-Text Search', status: 'completed', requester: 'All Teams', tags: ['platform', 'search'], metadata: { engine: 'Elasticsearch 8.x' } },
];

// 55 tasks spread across projects and persons
const tasks = [
  // ── CRM Platform ──
  { id: 't001', title: 'Requirements gathering', startDate: '2026-05-04', endDate: '2026-05-15', progress: 1, personId: 'p007', projectId: 'proj-crm', tags: ['planning'], url: 'https://confluence.example.com/crm-requirements', metadata: { prdVersion: '2.1', reviewer: 'p003' } },
  { id: 't002', title: 'Database schema design', startDate: '2026-05-18', endDate: '2026-05-25', progress: 1, personId: 'p001', projectId: 'proj-crm', tags: ['backend'] },
  { id: 't003', title: 'REST API scaffolding', startDate: '2026-05-25', endDate: '2026-06-03', progress: 0.9, personId: 'p001', projectId: 'proj-crm', tags: ['backend'], url: 'https://api.example.com/crm/swagger', metadata: { endpoints: 24, framework: 'Express.js' } },
  { id: 't004', title: 'Contact management module', startDate: '2026-06-01', endDate: '2026-06-12', progress: 0.6, personId: 'p008', projectId: 'proj-crm', tags: ['backend'], dependencies: ['t003'] },
  { id: 't005', title: 'Lead tracking dashboard', startDate: '2026-06-08', endDate: '2026-06-22', progress: 0.2, personId: 'p004', projectId: 'proj-crm', tags: ['frontend'], parentId: 't004' },
  { id: 't006', title: 'CRM UI components library', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.8, personId: 'p002', projectId: 'proj-crm', tags: ['design'], status: 'cancelled' },

  // ── Mobile Banking App ──
  { id: 't007', title: 'App architecture design', startDate: '2026-05-11', endDate: '2026-05-22', progress: 1, personId: 'p011', projectId: 'proj-mobile', tags: ['planning'], url: 'https://confluence.example.com/mobile-arch', metadata: { adrCount: 5 } },
  { id: 't008', title: 'Login & biometric auth', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.9, personId: 'p011', projectId: 'proj-mobile', tags: ['frontend'], dependencies: ['t007'], parentId: 't007' },
  { id: 't009', title: 'Account overview screen', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.5, personId: 'p004', projectId: 'proj-mobile', tags: ['frontend'], parentId: 't007' },
  { id: 't010', title: 'Transaction history list', startDate: '2026-06-10', endDate: '2026-06-20', progress: 0, personId: 'p004', projectId: 'proj-mobile', tags: ['frontend'], dependencies: ['t009'] },
  { id: 't011', title: 'Payment flow API', startDate: '2026-05-25', endDate: '2026-06-08', progress: 0.7, personId: 'p001', projectId: 'proj-mobile', tags: ['backend'], status: 'pending-online' },
  { id: 't012', title: 'Push notification integration', startDate: '2026-06-08', endDate: '2026-06-18', progress: 0.1, personId: 'p011', projectId: 'proj-mobile', tags: ['frontend'] },

  // ── Data Lake Migration ──
  { id: 't013', title: 'Inventory existing data sources', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.4, personId: 'p009', projectId: 'proj-data', tags: ['planning'] },
  { id: 't014', title: 'Schema mapping document', startDate: '2026-06-08', endDate: '2026-06-15', progress: 0, personId: 'p013', projectId: 'proj-data', tags: ['planning'], dependencies: ['t013'] },
  { id: 't015', title: 'ETL pipeline design', startDate: '2026-06-15', endDate: '2026-06-30', progress: 0, personId: 'p009', projectId: 'proj-data', tags: ['backend'], dependencies: ['t014'] },
  { id: 't016', title: 'Data quality validation framework', startDate: '2026-06-20', endDate: '2026-07-05', progress: 0, personId: 'p013', projectId: 'proj-data', tags: ['backend'] },

  // ── QA Automation ──
  { id: 't017', title: 'Test framework evaluation', startDate: '2026-05-04', endDate: '2026-05-10', progress: 1, personId: 'p006', projectId: 'proj-qa', tags: ['planning'], url: 'https://wiki.example.com/test-framework-eval' },
  { id: 't018', title: 'CI/CD test integration', startDate: '2026-05-11', endDate: '2026-05-22', progress: 1, personId: 'p005', projectId: 'proj-qa', tags: ['devops'] },
  { id: 't019', title: 'API test suite', startDate: '2026-05-25', endDate: '2026-06-10', progress: 0.7, personId: 'p006', projectId: 'proj-qa', tags: ['backend'], dependencies: ['t018'] },
  { id: 't020', title: 'UI automation scripts', startDate: '2026-06-01', endDate: '2026-06-15', progress: 0.3, personId: 'p006', projectId: 'proj-qa', tags: ['frontend'] },
  { id: 't021', title: 'Performance test suite', startDate: '2026-06-10', endDate: '2026-06-20', progress: 0, personId: 'p005', projectId: 'proj-qa', tags: ['devops'] },
  { id: 't022', title: 'Security scan pipeline', startDate: '2026-06-15', endDate: '2026-06-25', progress: 0, personId: 'p012', projectId: 'proj-qa', tags: ['security'], status: 'pending-online' },

  // ── Customer Portal v2 ──
  { id: 't023', title: 'User research interviews', startDate: '2026-05-11', endDate: '2026-05-22', progress: 1, personId: 'p014', projectId: 'proj-portal', tags: ['research'] },
  { id: 't024', title: 'Wireframes & prototypes', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.85, personId: 'p002', projectId: 'proj-portal', tags: ['design'] },
  { id: 't025', title: 'Design system tokens', startDate: '2026-05-25', endDate: '2026-06-03', progress: 1, personId: 'p002', projectId: 'proj-portal', tags: ['design'] },
  { id: 't026', title: 'Portal landing page', startDate: '2026-06-01', endDate: '2026-06-12', progress: 0.4, personId: 'p004', projectId: 'proj-portal', tags: ['frontend'], dependencies: ['t024'] },
  { id: 't027', title: 'Self-service dashboard', startDate: '2026-06-08', endDate: '2026-06-25', progress: 0.1, personId: 'p004', projectId: 'proj-portal', tags: ['frontend'] },
  { id: 't028', title: 'Knowledge base CMS', startDate: '2026-06-05', endDate: '2026-06-18', progress: 0.2, personId: 'p008', projectId: 'proj-portal', tags: ['backend'] },

  // ── Infrastructure Upgrade ──
  { id: 't029', title: 'Kubernetes cluster setup', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.5, personId: 'p005', projectId: 'proj-infra', tags: ['devops'], url: 'https://github.example.com/infra/k8s-config' },
  { id: 't030', title: 'Service mesh deployment', startDate: '2026-06-10', endDate: '2026-06-22', progress: 0, personId: 'p005', projectId: 'proj-infra', tags: ['devops'], dependencies: ['t029'] },
  { id: 't031', title: 'Monitoring stack upgrade', startDate: '2026-06-05', endDate: '2026-06-15', progress: 0.3, personId: 'p005', projectId: 'proj-infra', tags: ['devops'] },
  { id: 't032', title: 'Database replication config', startDate: '2026-06-15', endDate: '2026-06-28', progress: 0, personId: 'p001', projectId: 'proj-infra', tags: ['backend'], dependencies: ['t029'] },
  { id: 't033', title: 'Disaster recovery drill', startDate: '2026-06-25', endDate: '2026-07-02', progress: 0, personId: 'p012', projectId: 'proj-infra', tags: ['security'] },

  // ── Real-time Analytics ──
  { id: 't034', title: 'Stream processing architecture', startDate: '2026-05-18', endDate: '2026-05-30', progress: 0.9, personId: 'p009', projectId: 'proj-analytics', tags: ['planning'] },
  { id: 't035', title: 'Kafka topic design', startDate: '2026-06-01', endDate: '2026-06-08', progress: 0.5, personId: 'p009', projectId: 'proj-analytics', tags: ['backend'], dependencies: ['t034'] },
  { id: 't036', title: 'Real-time dashboard POC', startDate: '2026-06-05', endDate: '2026-06-18', progress: 0.2, personId: 'p013', projectId: 'proj-analytics', tags: ['frontend'] },
  { id: 't037', title: 'Data aggregation service', startDate: '2026-06-10', endDate: '2026-06-22', progress: 0, personId: 'p008', projectId: 'proj-analytics', tags: ['backend'], dependencies: ['t035'] },
  { id: 't038', title: 'Alerting rules engine', startDate: '2026-06-15', endDate: '2026-06-25', progress: 0, personId: 'p013', projectId: 'proj-analytics', tags: ['backend'] },
  { id: 't039', title: 'Data export APIs', startDate: '2026-06-20', endDate: '2026-07-01', progress: 0, personId: 'p008', projectId: 'proj-analytics', tags: ['backend'] },

  // ── SSO & Auth Service ──
  { id: 't040', title: 'OAuth2/OIDC flow design', startDate: '2026-05-04', endDate: '2026-05-12', progress: 1, personId: 'p012', projectId: 'proj-auth', tags: ['planning'], url: 'https://auth.example.com/.well-known/openid-configuration', metadata: { grantTypes: ['authorization_code', 'client_credentials'], tokenFormat: 'JWT' } },
  { id: 't041', title: 'Token service implementation', startDate: '2026-05-13', endDate: '2026-05-25', progress: 1, personId: 'p001', projectId: 'proj-auth', tags: ['backend'] },
  { id: 't042', title: 'SAML integration', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.8, personId: 'p012', projectId: 'proj-auth', tags: ['backend'], dependencies: ['t041'] },
  { id: 't043', title: 'Role-based access control', startDate: '2026-06-01', endDate: '2026-06-12', progress: 0.4, personId: 'p008', projectId: 'proj-auth', tags: ['backend'], dependencies: ['t041'] },
  { id: 't044', title: 'MFA setup & docs', startDate: '2026-06-10', endDate: '2026-06-18', progress: 0, personId: 'p010', projectId: 'proj-auth', tags: ['documentation'] },

  // ── Notification Center ──
  { id: 't045', title: 'Notification system design', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.3, personId: 'p007', projectId: 'proj-notify', tags: ['planning'] },
  { id: 't046', title: 'Email service integration', startDate: '2026-06-08', endDate: '2026-06-18', progress: 0, personId: 'p008', projectId: 'proj-notify', tags: ['backend'] },
  { id: 't047', title: 'In-app notification UI', startDate: '2026-06-12', endDate: '2026-06-25', progress: 0, personId: 'p004', projectId: 'proj-notify', tags: ['frontend'] },
  { id: 't048', title: 'SMS gateway integration', startDate: '2026-06-18', endDate: '2026-06-28', progress: 0, personId: 'p011', projectId: 'proj-notify', tags: ['backend'], dependencies: ['t046'] },
  { id: 't049', title: 'Notification preferences API', startDate: '2026-06-05', endDate: '2026-06-15', progress: 0.1, personId: 'p001', projectId: 'proj-notify', tags: ['backend'] },

  // ── Full-Text Search ──
  { id: 't050', title: 'Search engine evaluation', startDate: '2026-05-01', endDate: '2026-05-08', progress: 1, personId: 'p009', projectId: 'proj-search', tags: ['planning'] },
  { id: 't051', title: 'Elasticsearch cluster setup', startDate: '2026-05-08', endDate: '2026-05-15', progress: 1, personId: 'p005', projectId: 'proj-search', tags: ['devops'] },
  { id: 't052', title: 'Indexing pipeline', startDate: '2026-05-15', endDate: '2026-05-28', progress: 1, personId: 'p009', projectId: 'proj-search', tags: ['backend'], dependencies: ['t051'] },
  { id: 't053', title: 'Search API gateway', startDate: '2026-05-25', endDate: '2026-06-05', progress: 0.95, personId: 'p008', projectId: 'proj-search', tags: ['backend'], dependencies: ['t052'] },
  { id: 't054', title: 'Autocomplete service', startDate: '2026-06-01', endDate: '2026-06-10', progress: 0.5, personId: 'p004', projectId: 'proj-search', tags: ['frontend'], dependencies: ['t053'] },
  { id: 't055', title: 'Search analytics dashboard', startDate: '2026-06-08', endDate: '2026-06-18', progress: 0, personId: 'p013', projectId: 'proj-search', tags: ['frontend'] },
];

// ── Detail data (rich descriptions, keyDates, keyLinks) ──
// Returned by GET /api/tasks/:id and GET /api/projects/:id.
// NOT included in GET /api/data (list endpoint).

const projectDetails = {
  'proj-crm': {
    description: '## CRM Platform\n\nUnified customer relationship management for the Sales department.\n\n### Key Goals\n- Single view of customer across all touchpoints\n- Automated lead scoring and routing\n- Real-time pipeline analytics\n\n**Stack**: React + Node.js + PostgreSQL',
    keyDates: [
      { name: 'Kickoff', date: '2026-05-04', color: '#4A90D9', icon: 'play' },
      { name: 'MVP Release', date: '2026-06-30', color: '#61AFEF', icon: 'triangle' },
      { name: 'GA Launch', date: '2026-08-15', color: '#98C379', icon: 'check' },
    ],
    keyLinks: [
      { name: 'Product Spec', url: 'https://confluence.example.com/crm-spec' },
      { name: 'Design Files', url: 'https://figma.com/file/crm-mockups' },
    ],
  },
  'proj-mobile': {
    description: '## Mobile Banking App\n\nNext-gen mobile banking with biometric auth and instant notifications.\n\n### Features\n- Face ID / fingerprint login\n- Real-time transaction push\n- P2P instant transfer\n- Dark mode',
    keyDates: [
      { name: 'Design Review', date: '2026-05-15', color: '#7B61F8', icon: 'target' },
      { name: 'Beta Release', date: '2026-07-01', color: '#61AFEF', icon: 'triangle' },
      { name: 'App Store Submit', date: '2026-08-01', color: '#98C379', icon: 'check' },
    ],
    keyLinks: [
      { name: 'API Docs', url: 'https://api.example.com/mobile-banking' },
    ],
  },
  'proj-data': {
    description: '## Data Lake Migration\n\nMigrate on-premise warehouse to cloud-native data lake.\n\n### Phases\n1. Inventory existing sources\n2. Schema mapping & transformation\n3. Incremental ETL pipelines\n4. Data quality validation',
    keyDates: [
      { name: 'Inventory Done', date: '2026-06-10', color: '#98C379', icon: 'circle' },
      { name: 'Migration Start', date: '2026-07-01', color: '#4A90D9', icon: 'play' },
      { name: 'Cutover', date: '2026-09-01', color: '#E06C75', icon: 'diamond' },
    ],
    keyLinks: [
      { name: 'Architecture Doc', url: 'https://confluence.example.com/data-lake' },
    ],
  },
  'proj-qa': {
    description: '## QA Automation\n\nEnd-to-end test automation across API, UI, performance, and security.\n\n### Coverage Targets\n- API: 95% endpoint coverage\n- UI: 80% critical paths\n- Perf: p95 < 200ms\n- Security: OWASP Top 10',
    keyDates: [
      { name: 'Framework Ready', date: '2026-05-22', color: '#98C379', icon: 'check' },
      { name: 'Full Coverage', date: '2026-07-15', color: '#61AFEF', icon: 'target' },
    ],
    keyLinks: [
      { name: 'Test Reports', url: 'https://allure.example.com/qa' },
    ],
  },
  'proj-portal': {
    description: '## Customer Portal v2\n\nComplete redesign with real-time order tracking and integrated knowledge base.\n\n### v2 Improvements\n- 3x faster page loads\n- Dark mode\n- Full-text search over KB articles\n- WebSocket live updates',
    keyDates: [
      { name: 'UX Research Done', date: '2026-05-22', color: '#E5C07B', icon: 'circle' },
      { name: 'Design Sign-off', date: '2026-06-05', color: '#7B61F8', icon: 'check' },
      { name: 'Public Beta', date: '2026-07-20', color: '#61AFEF', icon: 'triangle' },
    ],
    keyLinks: [
      { name: 'Design System', url: 'https://storybook.example.com/portal' },
    ],
  },
  'proj-infra': {
    description: '## Infrastructure Upgrade\n\nPlatform-wide modernization: Kubernetes 1.30, Istio service mesh, unified observability.\n\n### Components\n- K8s 1.30 with zero-downtime migration\n- Istio for mTLS and traffic management\n- Grafana + Loki + Tempo stack\n- PostgreSQL 16 with streaming replication',
    keyDates: [
      { name: 'K8s Upgrade', date: '2026-06-20', color: '#56B6C2', icon: 'diamond' },
      { name: 'Mesh Deploy', date: '2026-07-10', color: '#4A90D9', icon: 'triangle' },
      { name: 'DR Drill', date: '2026-07-02', color: '#E06C75', icon: 'target' },
    ],
    keyLinks: [
      { name: 'Runbook', url: 'https://confluence.example.com/infra' },
      { name: 'Grafana', url: 'https://grafana.example.com/d/infra' },
    ],
  },
  'proj-analytics': {
    description: '## Real-time Analytics\n\nStreaming analytics with Kafka + ClickHouse for sub-second queries.\n\n### Pipeline\n- **Ingest**: Kafka with schema registry\n- **Process**: ksqlDB stream transforms\n- **Store**: ClickHouse OLAP\n- **View**: WebSocket-pushed dashboards',
    keyDates: [
      { name: 'Kafka Ready', date: '2026-06-08', color: '#C678DD', icon: 'circle' },
      { name: 'POC Done', date: '2026-06-18', color: '#4A90D9', icon: 'play' },
      { name: 'Production', date: '2026-08-01', color: '#98C379', icon: 'check' },
    ],
    keyLinks: [
      { name: 'Data Model', url: 'https://dbdocs.io/analytics/schema' },
    ],
  },
  'proj-auth': {
    description: '## SSO & Auth Service\n\nCentralized auth supporting OAuth 2.0, OIDC, SAML 2.0, and MFA.\n\n### Protocols\n- OAuth 2.0 + PKCE\n- OpenID Connect\n- SAML 2.0 IdP-initiated\n- TOTP + WebAuthn MFA',
    keyDates: [
      { name: 'OAuth2 Ready', date: '2026-05-25', color: '#98C379', icon: 'check' },
      { name: 'SAML Done', date: '2026-06-05', color: '#BE5046', icon: 'target' },
      { name: 'MFA Rollout', date: '2026-06-18', color: '#61AFEF', icon: 'triangle' },
    ],
    keyLinks: [
      { name: 'OpenID Config', url: 'https://auth.example.com/.well-known/openid-configuration' },
    ],
  },
  'proj-notify': {
    description: '## Notification Center\n\nMulti-channel notifications: email, SMS, in-app, webhook.\n\n### Channels\n- Email: transactional + daily digest\n- SMS: critical alerts only\n- In-app: WebSocket real-time\n- Webhook: custom integrations',
    keyDates: [
      { name: 'Design Done', date: '2026-06-10', color: '#61AFEF', icon: 'target' },
      { name: 'Email Live', date: '2026-06-28', color: '#98C379', icon: 'check' },
      { name: 'All Channels', date: '2026-07-31', color: '#4A90D9', icon: 'triangle' },
    ],
    keyLinks: [],
  },
  'proj-search': {
    description: '## Full-Text Search\n\nElasticsearch-powered search with autocomplete, fuzzy matching, and faceted filters.\n\n### Features\n- Typo-tolerant fuzzy search\n- Autocomplete < 50ms\n- Faceted filtering\n- Relevance analytics',
    keyDates: [
      { name: 'ES Ready', date: '2026-05-15', color: '#98C379', icon: 'check' },
      { name: 'Indexing Done', date: '2026-05-28', color: '#4A90D9', icon: 'circle' },
      { name: 'Search Live', date: '2026-06-18', color: '#61AFEF', icon: 'triangle' },
    ],
    keyLinks: [
      { name: 'Search API', url: 'https://api.example.com/search/swagger' },
    ],
  },
};

const taskDetails = {
  't001': { description: '### Requirements Gathering\n\nStakeholder interviews with Sales department:\n- Lead scoring: BANT + custom fields\n- Pipeline stages: Prospect → Qualified → Proposal → Negotiation → Closed\n- ERP integration points identified\n\n**Outcome**: 42 functional requirements in approved PRD.', metadata: { interviewees: 14, sessions: 8, prdVersion: '2.1' } },
  't003': { description: '### REST API Scaffolding\n\nExpress.js + TypeScript:\n- OpenAPI 3.1 from Zod schemas\n- Cursor-based pagination\n- Rate limiting: 100 req/min per key\n\n**Swagger**: api.example.com/crm/swagger', metadata: { endpoints: 24, tests: 142, coverage: '94%' } },
  't005': { description: '### Lead Tracking Dashboard\n\nReal-time dashboard:\n- Funnel visualization per stage\n- Lead aging heatmap\n- Drag-and-drop kanban\n\n**Stack**: React + D3.js + WebSocket' },
  't007': { description: '### App Architecture Design\n\nModular MVVM + Coordinator:\n- Protocol-oriented networking\n- Secure enclave for biometrics\n\n**ADR**: confluence.example.com/mobile-arch', metadata: { adrCount: 5, pattern: 'MVVM+Coordinator' } },
  't017': { description: '### Test Framework Evaluation\n\nEvaluated 5 frameworks:\n\n| Tool | API | UI | Perf |\n|------|-----|----|------|\n| Playwright | ✓ | ✓ | ✓ |\n| Cypress | ✓ | ✓ | ✗ |\n| k6 | ✗ | ✗ | ✓ |\n\n**Decision**: Playwright + k6', metadata: { decision: 'Playwright + k6', runnerUp: 'Cypress' } },
  't040': { description: '### OAuth2/OIDC Flow Design\n\nGrant types:\n- Authorization Code + PKCE\n- Client Credentials (M2M)\n- Refresh Token rotation\n\n**Tokens**: RS256 JWT, 15-min access, 7-day refresh.', metadata: { grantTypes: ['authorization_code', 'client_credentials'], tokenFormat: 'JWT' } },
};

const data = { persons, projects, tasks };

function sendJSON(res, statusCode, body) {
  const json = JSON.stringify(body);
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  });
  res.end(json);
}

function sleep(ms) {
  return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// Global write counter for failEvery support on individual endpoints.
// When a write request carries ?failEvery=N, every Nth write (across all
// endpoints) is rejected instead of applied.
var writeCounter = 0;

function checkFailEvery(url) {
  var failEvery = parseInt(url.searchParams.get('failEvery') || '0', 10);
  if (failEvery > 0) {
    writeCounter++;
    if (writeCounter % failEvery === 0) {
      return 'Simulated failure (failEvery=' + failEvery + ', writeCount=' + writeCounter + ')';
    }
  }
  return null;
}

function readBody(req) {
  return new Promise(function (resolve) {
    var chunks = [];
    req.on('data', function (chunk) { chunks.push(chunk); });
    req.on('end', function () {
      var raw = Buffer.concat(chunks).toString('utf8');
      try { resolve(JSON.parse(raw)); }
      catch (_) { resolve(null); }
    });
  });
}

function upsertById(list, items) {
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    if (!item || !item.id) continue;
    var found = -1;
    for (var j = 0; j < list.length; j++) {
      if (list[j].id === item.id) { found = j; break; }
    }
    if (found >= 0) {
      // Merge into existing
      var keys = Object.keys(item);
      for (var k = 0; k < keys.length; k++) {
        list[found][keys[k]] = item[keys[k]];
      }
    } else {
      list.push(item);
    }
  }
}

function deleteById(list, ids) {
  var idSet = {};
  for (var i = 0; i < ids.length; i++) { idSet[ids[i]] = true; }
  for (var j = list.length - 1; j >= 0; j--) {
    if (idSet[list[j].id]) { list.splice(j, 1); }
  }
}

function matchRoute(method, pathname) {
  // GET /api/tasks/:id — detail endpoint
  var taskGet = pathname.match(/^\/api\/tasks\/(.+)$/);
  if (method === 'GET' && taskGet) return { resource: 'tasks', action: 'detail', id: taskGet[1] };
  // GET /api/projects/:id — detail endpoint
  var projGet = pathname.match(/^\/api\/projects\/(.+)$/);
  if (method === 'GET' && projGet) return { resource: 'projects', action: 'detail', id: projGet[1] };
  // DELETE /api/tasks/:id
  var taskDel = pathname.match(/^\/api\/tasks\/(.+)$/);
  if (method === 'DELETE' && taskDel) return { resource: 'tasks', action: 'delete', id: taskDel[1] };
  // DELETE /api/projects/:id
  var projDel = pathname.match(/^\/api\/projects\/(.+)$/);
  if (method === 'DELETE' && projDel) return { resource: 'projects', action: 'delete', id: projDel[1] };
  // POST /api/tasks
  if (method === 'POST' && pathname === '/api/tasks') return { resource: 'tasks', action: 'upsert' };
  // POST /api/projects
  if (method === 'POST' && pathname === '/api/projects') return { resource: 'projects', action: 'upsert' };
  return null;
}

const server = http.createServer(async function (req, res) {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end();
    return;
  }

  // Log request
  const ts = new Date().toISOString().slice(11, 19);
  console.log(`[${ts}] ${req.method} ${url.pathname}`);

  // ── GET routes ──
  if (req.method === 'GET' && url.pathname === '/api/health') {
    sendJSON(res, 200, { ok: true, uptime: process.uptime() });
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/tasks') {
    sendJSON(res, 200, data.tasks);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/persons') {
    sendJSON(res, 200, data.persons);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/projects') {
    sendJSON(res, 200, data.projects);
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/data') {
    sendJSON(res, 200, data);
    return;
  }

  // ── Partial failure simulation endpoint ──
  // POST /api/push-partial?failEvery=N — fails every Nth item to test partial rollback
  if (req.method === 'POST' && url.pathname === '/api/push-partial') {
    try {
      var body = await readBody(req);
      var failEvery = parseInt(url.searchParams.get('failEvery') || '3', 10);
      var delayMs = parseInt(url.searchParams.get('delay') || '0', 10);
      var tasks = (body.tasks || []);
      var projects = (body.projects || []);
      var deletedTaskIds = (body.deletedTaskIds || []);
      var deletedProjectIds = (body.deletedProjectIds || []);
      var allItems = [];
      for (var ti = 0; ti < tasks.length; ti++) {
        allItems.push({ id: tasks[ti].id, type: 'task' });
      }
      for (var pi = 0; pi < projects.length; pi++) {
        allItems.push({ id: projects[pi].id, type: 'project' });
      }
      for (var di = 0; di < deletedTaskIds.length; di++) {
        allItems.push({ id: deletedTaskIds[di], type: 'task' });
      }
      for (var dp = 0; dp < deletedProjectIds.length; dp++) {
        allItems.push({ id: deletedProjectIds[dp], type: 'project' });
      }

      var failedItems = [];
      for (var ai = 0; ai < allItems.length; ai++) {
        if (delayMs > 0) await sleep(delayMs);
        if ((ai + 1) % failEvery === 0) {
          failedItems.push({
            id: allItems[ai].id,
            type: allItems[ai].type,
            error: 'Simulated failure (failEvery=' + failEvery + ', index=' + ai + ')',
          });
        } else {
          // Apply successful items to data store
          if (allItems[ai].type === 'task') {
            var t = tasks.find(function (x) { return x.id === allItems[ai].id; }) || { id: allItems[ai].id };
            upsertById(data.tasks, [t]);
          } else {
            var p = projects.find(function (x) { return x.id === allItems[ai].id; }) || { id: allItems[ai].id };
            upsertById(data.projects, [p]);
          }
        }
      }
      // Apply deletes for successful items
      var successDeletedTasks = deletedTaskIds.filter(function (id) {
        return !failedItems.some(function (fi) { return fi.id === id && fi.type === 'task'; });
      });
      var successDeletedProjects = deletedProjectIds.filter(function (id) {
        return !failedItems.some(function (fi) { return fi.id === id && fi.type === 'project'; });
      });
      deleteById(data.tasks, successDeletedTasks);
      deleteById(data.projects, successDeletedProjects);

      if (failedItems.length > 0) {
        console.log('  → partial failure: ' + failedItems.length + ' of ' + allItems.length + ' items failed');
        sendJSON(res, 200, {
          success: false,
          error: 'Partial failure: ' + failedItems.length + ' of ' + allItems.length + ' items failed',
          failedItems: failedItems,
        });
      } else {
        sendJSON(res, 200, { success: true });
      }
    } catch (e) {
      sendJSON(res, 500, { success: false, error: e.message });
    }
    return;
  }

  // ── Write + Detail routes ──
  var route = matchRoute(req.method, url.pathname);
  if (route) {
    try {
      if (route.action === 'detail') {
        // Return rich detail for a single task or project
        var detailData;
        if (route.resource === 'tasks') {
          var task = data.tasks.find(function (t) { return t.id === route.id; });
          if (!task) { sendJSON(res, 404, { error: 'Task not found: ' + route.id }); return; }
          // Merge list fields + detail fields
          detailData = Object.assign({}, task, taskDetails[route.id] || {});
        } else {
          var project = data.projects.find(function (p) { return p.id === route.id; });
          if (!project) { sendJSON(res, 404, { error: 'Project not found: ' + route.id }); return; }
          detailData = Object.assign({}, project, projectDetails[route.id] || {});
        }
        console.log('  → detail ' + route.resource + '/' + route.id);
        sendJSON(res, 200, detailData);
        return;
      }
      if (route.action === 'upsert') {
        var body = await readBody(req);
        if (!body || !Array.isArray(body)) {
          sendJSON(res, 400, { success: false, error: 'Expected a JSON array' });
          return;
        }
        var failErr = checkFailEvery(url);
        if (failErr) {
          console.log('  → upsert FAILED: ' + failErr);
          sendJSON(res, 500, { success: false, error: failErr });
          return;
        }
        var delayMs = parseInt(url.searchParams.get('delay') || '0', 10);
        if (delayMs > 0) await sleep(delayMs);
        upsertById(data[route.resource], body);
        console.log(`  → upserted ${body.length} ${route.resource} (delay=${delayMs}ms)`);
        sendJSON(res, 200, { success: true, count: body.length });
        return;
      }
      if (route.action === 'delete') {
        var failErr = checkFailEvery(url);
        if (failErr) {
          console.log('  → delete FAILED: ' + failErr);
          sendJSON(res, 500, { success: false, error: failErr });
          return;
        }
        var delayMs = parseInt(url.searchParams.get('delay') || '0', 10);
        if (delayMs > 0) await sleep(delayMs);
        deleteById(data[route.resource], [route.id]);
        console.log(`  → deleted ${route.resource}/${route.id} (delay=${delayMs}ms)`);
        sendJSON(res, 200, { success: true });
        return;
      }
    } catch (e) {
      sendJSON(res, 500, { success: false, error: e.message });
      return;
    }
  }

  sendJSON(res, 404, { error: 'Not found', path: url.pathname });
});

server.listen(PORT, () => {
  console.log(`\nGantt test API server running at http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log(`  GET    /api/health          — health check`);
  console.log(`  GET    /api/data            — all rendering data (lightweight)`);
  console.log(`  GET    /api/tasks           — task list`);
  console.log(`  GET    /api/tasks/:id       — task detail (with description)`);
  console.log(`  GET    /api/persons         — person list`);
  console.log(`  GET    /api/projects        — project list`);
  console.log(`  GET    /api/projects/:id    — project detail (with keyDates, keyLinks, description)`);
  console.log(`  POST   /api/tasks           — batch upsert tasks (JSON array)`);
  console.log(`  POST   /api/projects        — batch upsert projects (JSON array)`);
  console.log(`  DELETE /api/tasks/:id       — delete a task`);
  console.log(`  DELETE /api/projects/:id    — delete a project`);
  console.log(`  POST   /api/push-partial    — simulate partial push failure (?failEvery=N)\n`);
});
