# Example: Production Log Analyzer Prompt

This example demonstrates how the `prompt-engineering` skill handles a request for a complex, production-ready agent prompt.

## User Request
"Crie um prompt para um agente que analisa logs de segurança do Cloudflare. O agente deve identificar ataques de SQL injection e DDoS, e retornar um JSON com a severidade e a recomendação de bloqueio."

## Agent Discovery Phase (Internal Simulation)
- **Architect**: Needs a structured JSON schema and a chain-of-thought reasoning step.
- **Diagnostician**: SQLi detection needs specific regex/patterns; DDoS needs volumetric/frequency context.
- **Model Specialist**: Claude (or Gemini) handles large logs better; use XML tagging for log samples.

## Resulting Output

### 1. Objective
Optimized for high-precision security log auditing with structured JSON output and low false-positive rate.

### 2. Final Prompt
```md
# SYSTEM PROMPT: Security Log Auditor (Cloudflare Specialist)

You are an elite Security Operations Center (SOC) Analyst. Your task is to audit Cloudflare WAF logs to detect SQL Injection (SQLi) and Distributed Denial of Service (DDoS) patterns.

## CONTEXT
- Inputs: Cloudflare JSON log entries.
- Focus: `clientRequest.uri`, `clientRequest.args`, `edgeResponse.status`.

## DETECTION RULES
1. **SQL Injection**:
   - Look for: `'`, `--`, `;`, `UNION SELECT`, `OR 1=1`.
   - Payload detection in query arguments.
2. **DDoS**:
   - Volumetric anomalies (if multiple logs are provided).
   - High frequency of 403/429 status codes from the same `clientIP`.

## OUTPUT FORMAT
Return ONLY a valid JSON object following this schema:
{
  "analysis": {
    "detected_threats": ["SQLi" | "DDoS" | "None"],
    "evidence": "Brief description of matching patterns",
    "severity": "Low" | "Medium" | "High" | "Critical"
  },
  "action": {
    "block_recommended": boolean,
    "firewall_rule_suggestion": "string"
  }
}
```

### 3. Why It Works (Portuguese)
- **Esquema Estrito**: O uso de um esquema JSON fixo garante que a saída possa ser integrada em pipelines de automação sem erros de parsing.
- **Detecção Multicamada**: Separa a lógica de SQLi (baseada em payload) da lógica de DDoS (baseada em status code e frequência), aumentando a precisão.
- **Role Framing**: Definir a IA como "SOC Analyst" ativa padrões de comportamento mais cautelosos e técnicos.

### 4. Variables
- `log_entries`: A lista de logs do Cloudflare para análise.
- `custom_thresholds`: Limites personalizados para volumetria.

### 5. Risks
- **Falsos Positivos**: Queries legítimas que contenham caracteres especiais podem ser marcadas como SQLi.
- **Escopo**: O agente analisa logs individuais; para DDoS real, ele precisaria de uma visão temporal agregada.
