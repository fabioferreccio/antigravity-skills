# codebase-design

> **Version**: 1.0.0 · **Scope**: workspace · **Author**: Fábio Ferreccio

## Overview

`codebase-design` is a supreme software architecture skill founded on John Ousterhout's *A Philosophy of Software Design*. It equips agents and engineering teams with the vocabulary and diagnostic tooling to combat software complexity, eliminate shallow module sprawl, and craft high-leverage **Deep Modules**.

## Key Features

- **Deep Module Analysis**: Evaluates interface-to-implementation leverage across files and packages.
- **Pass-Through Elimination**: Detects and consolidates anemic use cases, forwarder methods, and redundant DTO chains.
- **Information Hiding Safeguards**: Uncovers leaked implementation details that cause change amplification.
- **Anti-Tautological Design**: Restructures code to make observable state transitions testable without brittle mock chains.

## When to Use

- When an AI agent or team member has created too many thin, shallow files that make navigation painful.
- When refactoring legacy code that suffers from change amplification (editing one feature requires touching 15 files).
- When unit tests are fragile and overloaded with mocks.

## When NOT to Use

- For low-level syntax linting or code formatting.
- For database query tuning (use `dba-agent`).
- For general code review on PR diffs (use `code-review`).

## Usage

Activate the skill by typing any of the following triggers:
- `"codebase design"`
- `"analisar design do código"`
- `"deep modules"`
- `"refatorar modulos rasos"`
- `"improve codebase architecture"`

## Security & Permissions

- Network access: `false`
- Filesystem: `read-write`
- Terminal: `sandboxed`
