# Complexity Levels Reference

## Level Matrix

```
LEVEL  COMPONENTS                          WHEN TO USE
─────────────────────────────────────────────────────────────────
  1    SKILL.md only                       Pure instructions, no tooling
  2    + examples/                         Needs concrete usage demos
  3    + scripts/                          Requires executable tooling
  4    + references/ + templates/ + graph/ Complex domain knowledge
  5    + MCP integration                   External service orchestration
```

## Directory Templates

### Level 1
```
<skill-name>/
├── SKILL.md
├── README.md
├── examples/
│   └── example-01.md
└── tests/
    └── test-01.md
```

### Level 2
```
<skill-name>/
├── SKILL.md
├── README.md
├── examples/
│   ├── example-01.md
│   └── example-02.md
└── tests/
    └── test-01.md
```

### Level 3
```
<skill-name>/
├── SKILL.md
├── README.md
├── examples/
│   └── example-01.md
├── tests/
│   └── test-01.md
└── scripts/
    └── <tool>.sh|.py
```

### Level 4
```
<skill-name>/
├── SKILL.md
├── README.md
├── examples/
│   └── example-01.md
├── tests/
│   └── test-01.md
├── scripts/
├── references/
├── templates/
└── graph/
    ├── ontology.yaml
    ├── workflows.yaml
    └── heuristics.yaml
```

### Level 5
```
<skill-name>/
├── SKILL.md
├── README.md
├── examples/
├── tests/
├── scripts/
├── references/
├── templates/
├── graph/
└── mcp/
    └── config.json
```
