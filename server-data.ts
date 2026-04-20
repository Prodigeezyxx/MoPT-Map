export const ALL_DELIVERABLES = [
  { id: "VR-1", stream: "VR", title: "Simulation flow (entry -> briefing -> procedure -> debrief)", owner: "PM", priority: "P0", sprint: "1", status: "In Spec" },
  { id: "VR-2", stream: "VR", title: "Spatial UI menu system (11 screens)", owner: "Oluwatosin / Dr. Tara", priority: "P0", sprint: "1-2", status: "In Build" },
  { id: "VR-3", stream: "VR", title: "Onboarding flow for new users", owner: "Oluwatosin", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "VR-4", stream: "VR", title: "Scoring/grading rubric per scenario", owner: "PM + CSO", priority: "P0", sprint: "2", status: "In Spec" },
  { id: "VR-5", stream: "VR", title: "Session data schema", owner: "PM + Femi", priority: "P0", sprint: "1", status: "In Spec" },
  { id: "VR-6", stream: "VR", title: "VR tutorial/guided walkthrough", owner: "Oluwatosin", priority: "P1", sprint: "3", status: "Not Started" },
  { id: "VR-7", stream: "VR", title: "Haptic feedback requirements", owner: "Oluwatosin", priority: "P1", sprint: "4", status: "Not Started" },
  { id: "VR-8", stream: "VR", title: "Accessibility spec (comfort, subtitles, left hand)", owner: "Dr. Tara", priority: "P1", sprint: "4", status: "In Spec" },
  { id: "VR-9", stream: "VR", title: "Error/edge-case handling", owner: "Oluwatosin + Femi", priority: "P1", sprint: "4", status: "Not Started" },
  { id: "VR-10", stream: "VR", title: "Analytics event taxonomy", owner: "PM", priority: "P0", sprint: "1", status: "In Spec" },
  { id: "VR-11", stream: "VR", title: "AI interaction model (Chat MoPT in VR)", owner: "Femi + PM", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "VR-12", stream: "VR", title: "Visual design system for VR", owner: "Dr. Tara", priority: "P1", sprint: "2", status: "In Spec" },
  { id: "VR-13", stream: "VR", title: "Content spec: full neonatal resus module", owner: "Dr. Olayinka + PM", priority: "P0", sprint: "2-3", status: "In Spec" },
  { id: "VR-14", stream: "VR", title: "In-VR notification/alert system", owner: "Oluwatosin", priority: "P2", sprint: "4", status: "Not Started" },
  { id: "VR-15", stream: "VR", title: "Performance benchmarks (72 FPS, load, memory)", owner: "Oluwatosin", priority: "P0", sprint: "1-4", status: "In Build" },
  { id: "VR-16", stream: "VR", title: "Multiplayer/collaborative mode", owner: "-", priority: "P2", sprint: "Post-Beta", status: "Not Started" },
  { id: "VR-17", stream: "VR", title: "Session replay/review feature", owner: "Oluwatosin", priority: "P2", sprint: "Post-Beta", status: "Not Started" },
  { id: "VR-18", stream: "VR", title: "Offline mode requirements", owner: "Femi + Oluwatosin", priority: "P1", sprint: "4", status: "In Spec" },
  { id: "VR-19", stream: "VR", title: "Voice interaction spec", owner: "Femi", priority: "P2", sprint: "Post-Beta", status: "In Discovery" },
  { id: "VR-20", stream: "VR", title: "Update/patching mechanism (App Lab channels)", owner: "Oluwatosin", priority: "P1", sprint: "1", status: "In Build" },
  { id: "VR-21", stream: "VR", title: "Device compatibility matrix", owner: "Dr. Tara", priority: "P1", sprint: "1", status: "In Spec" },
  { id: "VR-22", stream: "VR", title: "Beta test checklist + acceptance criteria", owner: "PM", priority: "P0", sprint: "5", status: "In Spec" },
  { id: "VR-23", stream: "VR", title: "QA test plan for VR", owner: "PM (until QA hire)", priority: "P0", sprint: "5", status: "In Spec" },
  { id: "VR-24", stream: "VR", title: "Data export spec (session -> LMS)", owner: "Femi", priority: "P0", sprint: "2", status: "In Spec" },
  { id: "VR-25", stream: "VR", title: "Feature flag system spec", owner: "Femi", priority: "P1", sprint: "3", status: "Not Started" },
  { id: "VR-26", stream: "VR", title: "In-VR user feedback mechanism", owner: "Oluwatosin", priority: "P1", sprint: "5", status: "In Spec" },
  { id: "VR-27", stream: "VR", title: "Clinical content review/approval workflow", owner: "CSO + PM", priority: "P0", sprint: "2", status: "In Spec" },
  { id: "Web-1", stream: "Web", title: "Review existing LMS (stack, features, API)", owner: "Femi + PM", priority: "P0", sprint: "1", status: "In Build" },
  { id: "Web-2", stream: "Web", title: "Data contract: Unity <-> LMS", owner: "Femi + PM", priority: "P0", sprint: "1", status: "In Spec" },
  { id: "Web-3", stream: "Web", title: "User authentication flow (VR client login)", owner: "Femi", priority: "P0", sprint: "1", status: "In Spec" },
  { id: "Web-4", stream: "Web", title: "Instructor dashboard wireframes", owner: "PM + Dr. Tara", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "Web-5", stream: "Web", title: "Admin panel wireframes", owner: "PM", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "Web-6", stream: "Web", title: "Session data upload endpoint", owner: "Femi", priority: "P0", sprint: "2", status: "In Build" },
  { id: "Web-7", stream: "Web", title: "Learner profile sync (Unity <-> LMS)", owner: "Femi", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "Web-8", stream: "Web", title: "Score/results submission endpoint", owner: "Femi", priority: "P0", sprint: "2", status: "In Spec" },
  { id: "Web-9", stream: "Web", title: "Individual learner performance view", owner: "Femi + PM", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "Web-10", stream: "Web", title: "Cohort/class-level analytics view", owner: "Femi + PM", priority: "P1", sprint: "4", status: "In Spec" },
  { id: "Web-11", stream: "Web", title: "Module completion & progress tracking", owner: "Femi", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "Web-12", stream: "Web", title: "User role management (learner, instructor, admin)", owner: "Femi", priority: "P1", sprint: "3", status: "In Spec" },
  { id: "Web-13", stream: "Web", title: "Data privacy review (GDPR/DPIA)", owner: "DPO + PM", priority: "P0", sprint: "1-4", status: "In Build" },
  { id: "Int-1", stream: "LMS", title: "Meet LMS team - integration points", owner: "PM + Femi", priority: "P0", sprint: "1", status: "Done" },
  { id: "Int-2", stream: "LMS", title: "API spec for Unity <-> LMS", owner: "Femi + PM", priority: "P0", sprint: "1", status: "In Build" },
  { id: "Int-3", stream: "LMS", title: "Auth method (Device Flow recommended)", owner: "Femi", priority: "P0", sprint: "1", status: "In Build" },
  { id: "Int-4", stream: "LMS", title: "Unity-side API client", owner: "Oluwatosin", priority: "P0", sprint: "2", status: "In Build" },
  { id: "Int-5", stream: "LMS", title: "Round-trip session data test", owner: "PM + Femi", priority: "P0", sprint: "3", status: "Not Started" },
  { id: "Int-6", stream: "LMS", title: "Learner VR login flow test", owner: "PM", priority: "P0", sprint: "3", status: "Not Started" },
  { id: "Int-7", stream: "LMS", title: "Score submission & retrieval test", owner: "PM + Femi", priority: "P0", sprint: "3", status: "Not Started" }
];

export const ALL_RISKS = [
  { id: "R-01", category: "Technical", risk: "VR drops below 72 FPS", score: 12, owner: "Oluwatosin", mitigation: "Strict poly/shader budget; OVR profiling every PR." },
  { id: "R-02", category: "Technical", risk: "Wi-Fi loss mid-session - data loss", score: 16, owner: "AI/Web Lead", mitigation: "Local cache + idempotent POST + retry." },
  { id: "R-03", category: "Product / Clinical", risk: "Chat MoPT hallucinates clinical advice", score: 15, owner: "AI/Web Lead + CSO", mitigation: "Temp=0, RAG on NHS/NICE, output evaluator, citations." },
  { id: "R-04", category: "Regulatory", risk: "NHS buyer requires DTAC, we aren't ready", score: 16, owner: "PM + DPO", mitigation: "DTAC pack built pre-beta; CSO appointed." },
  { id: "R-05", category: "Data / Security", risk: "PII breach", score: 10, owner: "DPO", mitigation: "UK-only infra; AES-256; OWASP; pen test; least privilege." },
  { id: "R-06", category: "Compliance", risk: "GDPR complaint from user", score: 8, owner: "DPO", mitigation: "Clear consent; SAR process; erasure endpoint." },
  { id: "R-07", category: "Clinical Safety", risk: "Scenario teaches incorrect protocol", score: 10, owner: "CSO", mitigation: "Two-SME sign-off; version locking; hazard log." },
  { id: "R-08", category: "Team", risk: "Key-person dependency on Oluwatosin", score: 16, owner: "COO", mitigation: "Docs-as-code; ADRs; recruit Unity dev #2." },
  { id: "R-09", category: "Team", risk: "AI/Web SPOF on Femi", score: 12, owner: "COO", mitigation: "Platform engineer hire; runbooks; pair on-call." },
  { id: "R-10", category: "Commercial", risk: "No institutional pilot signs", score: 12, owner: "CEO + PM", mitigation: "Start sales 6 weeks before beta; prepare Trust Center." },
  { id: "R-11", category: "Market", risk: "Competitor launches agentic AI first", score: 9, owner: "PM", mitigation: "Ship our differentiator quickly; lean on clinical evidence." },
  { id: "R-12", category: "Hardware", risk: "Meta pushes breaking Quest OS update", score: 6, owner: "VR Lead", mitigation: "MDM version pinning; Meta for Business relationship." },
  { id: "R-13", category: "Supplier", risk: "LLM vendor outage or policy change", score: 12, owner: "AI/Web Lead", mitigation: "Abstract LLM interface; maintain secondary model; cost cap." },
  { id: "R-14", category: "Financial", risk: "LLM token costs exceed margin", score: 9, owner: "COO + AI Lead", mitigation: "Token caps; caching; monitor cost per session." },
  { id: "R-15", category: "Reputational", risk: "Negative viral clinician review", score: 8, owner: "CEO", mitigation: "Great support; rapid response; community engagement." },
  { id: "R-16", category: "IP", risk: "Scenario IP contested by SME", score: 6, owner: "Graham (IP) + PM", mitigation: "Clear content agreements; MoPT ownership clauses." },
  { id: "R-17", category: "Operational", risk: "Hardware loss / damage at institution", score: 6, owner: "CSM", mitigation: "MDM enrollment; asset register; insurance guidance." },
  { id: "R-18", category: "Ethical / AI", risk: "Diagnostic bias in avatars/scenarios", score: 12, owner: "PM + CAB", mitigation: "Bias review; diverse avatar library; peer audit." },
  { id: "R-19", category: "Legal", risk: "Institutional DPA friction delays launch", score: 9, owner: "COO + Graham", mitigation: "Pre-drafted DPA + SLA templates; fast-turn legal." },
  { id: "R-20", category: "Content", risk: "Scenario backlog bottleneck", score: 12, owner: "PM", mitigation: "Hire Clinical Content Designer; standardize pipeline." }
];

export const ALL_OKRS = [
  {
    id: "O1",
    objective: "Earn the right to sell to the NHS.",
    keyResults: [
      "Complete DPIA and DCB0129 Clinical Safety Case.",
      "Achieve Cyber Essentials Plus certification.",
      "Submit DTAC pack to 1 NHS Trust buyer."
    ],
    owner: "PM + DPO + CSO"
  },
  {
    id: "O2",
    objective: "Prove learning outcomes in a clinical cohort.",
    keyResults: [
      "Run Private Beta with >=20 KCL clinicians.",
      "Demonstrate >=20% competency-score improvement (Kirkpatrick L2) across 3 attempts.",
      "Achieve Institutional NPS >=40."
    ],
    owner: "PM + Clinical Lead"
  },
  {
    id: "O3",
    objective: "Build a commercial, scalable platform.",
    keyResults: [
      "Sign 2 paid institutional pilots (£5-15k ARR each).",
      "Keep unit gross margin >=70% after LLM costs.",
      "Ship v1.0 scenario authoring pipeline used to release 3 modules."
    ],
    owner: "PM + COO"
  }
];
