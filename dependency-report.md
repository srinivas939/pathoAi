# 📦 Backend Dependency Security Report

Dependency vulnerability audit scan summary of requirements.txt manifest.

## 📊 Vulnerability Count
- **Critical**: **0**
- **High**: **0**
- **Medium**: **0**
- **Low**: **4**

---

## 🔍 Detailed Dependency Audit

| Package Name | Version | Severity | Advisory / Remediation |
|--------------|---------|----------|------------------------|
| **Flask** | `2.0.1` | `Low` | Possible Denial of Service (DoS) in Werkzeug fallback routing. |
| **Werkzeug** | `2.0.1` | `Low` | Re-implementation of default cookie parser regex. |
| **PyJWT** | `1.7.1` | `Low` | Key confusion vulnerability in algorithmic validation. |
| **Flask-CORS** | `3.0.10` | `None` | Manifest checks passed. No actions required. |
| **cryptography** | `3.2` | `None` | Manifest checks passed. No actions required. |
| **jinja2** | `2.11.3` | `Low` | Re-implementation of sandboxing policies. |
