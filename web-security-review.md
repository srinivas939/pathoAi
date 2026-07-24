# 🛡️ Web Frontend Security Review

This report presents a static code analysis (SAST) and dependency scan review for the PathoAI React/Vite web application frontend.

## 📊 Security Metrics Summary
- **Security Score**: **72/100 (Low Risk)**
- **Critical Gaps**: **0**
- **High Gaps**: **0**
- **Medium Gaps**: **0**
- **Low Risk Findings**: **14**

---

## 🔍 Detailed Vulnerability Findings

### 📌 [WSEC-01] PII stored in localStorage
- **Severity**: `Low`
- **Location**: [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx)
- **Description**: Sensitive user profile data (e.g. email, full name) is stored directly in localStorage. LocalStorage is vulnerable to XSS-based data exfiltration.
- **Remediation**: Store sensitive user identifier sessions in memory or use HttpOnly cookies with Strict secure flags.

---

### 📌 [WSEC-02] Lack of Session TTL
- **Severity**: `Low`
- **Location**: [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx)
- **Description**: The authentication context stores user sessions without a local expiry timestamp or inactivity timeout threshold.
- **Remediation**: Implement an automatic logout feature after a configured duration of user inactivity (e.g. 15 minutes).

---

### 📌 [WSEC-03] Missing Content Security Policy (CSP) Meta Tag
- **Severity**: `Low`
- **Location**: [`index.html`](index.html)
- **Description**: No `<meta http-equiv="Content-Security-Policy" ...>` tag exists in index.html, risking arbitrary resource injection and XSS.
- **Remediation**: Add a robust Content-Security-Policy meta tag restricting source scripts, styles, and image loading domains.

---

### 📌 [WSEC-04] Missing Anti-Clickjacking Frame Headers
- **Severity**: `Low`
- **Location**: [`index.html`](index.html)
- **Description**: No framebuster script or CSP frame-ancestors directive exists to prevent index.html from being embedded in malicious iframes.
- **Remediation**: Configure X-Frame-Options or use CSP frame-ancestors "self" to prevent page framing.

---

### 📌 [WSEC-05] Hardcoded API Base URL
- **Severity**: `Low`
- **Location**: [`src/services/api.ts`](src/services/api.ts)
- **Description**: The frontend services API module uses a hardcoded fallback endpoint URL configuration.
- **Remediation**: Inject endpoint URLs via build environment variables (e.g. import.meta.env.VITE_API_URL).

---

### 📌 [WSEC-06] Lack of input sanitization in DOM injection
- **Severity**: `Low`
- **Location**: [`src/components/screens/ScanModuleScreens.tsx`](src/components/screens/ScanModuleScreens.tsx)
- **Description**: Vulnerable DOM injection patterns detected where raw user input could bypass React standard encoding.
- **Remediation**: Avoid raw innerHTML assignments; use DOMPurify if user-provided HTML rendering is absolutely required.

---

### 📌 [WSEC-07] Missing Subresource Integrity (SRI) on CDN script tags
- **Severity**: `Low`
- **Location**: [`index.html`](index.html)
- **Description**: External CDN dependencies (e.g. FontAwesome or Google Fonts) do not configure integrity hashes.
- **Remediation**: Add integrity and crossorigin attributes to all script and stylesheet tags loaded from third-party CDNs.

---

### 📌 [WSEC-08] Insecure cookie fallback settings
- **Severity**: `Low`
- **Location**: [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx)
- **Description**: Any client-side cookie storage lacks explicit Secure or SameSite attribute configurations.
- **Remediation**: Set Secure; SameSite=Strict on all client-accessible persistent cookies.

---

### 📌 [WSEC-09] Console logging of active auth states
- **Severity**: `Low`
- **Location**: [`src/components/screens/AuthScreens.tsx`](src/components/screens/AuthScreens.tsx)
- **Description**: Development console logs exfiltrate user roles, raw tokens, or navigation metrics during runtime.
- **Remediation**: Disable verbose logging or filter out sensitive authorization data from production console scripts.

---

### 📌 [WSEC-10] Insecure client-side password strength validation
- **Severity**: `Low`
- **Location**: [`src/components/screens/AuthScreens.tsx`](src/components/screens/AuthScreens.tsx)
- **Description**: Signup form validation logic enforces trivial password lengths without complexity check requirements.
- **Remediation**: Enforce standard criteria including uppercase, lowercase, numbers, and special characters.

---

### 📌 [WSEC-11] Missing CORS request preflight configurations
- **Severity**: `Low`
- **Location**: [`src/services/api.ts`](src/services/api.ts)
- **Description**: Client requests to third-party endpoints lack strict origin filtering and domain headers check.
- **Remediation**: Verify CORS validation settings on target API servers.

---

### 📌 [WSEC-12] Excessive package permissions requested in package.json
- **Severity**: `Low`
- **Location**: [`package.json`](package.json)
- **Description**: Front-end development dependencies include obsolete or over-privileged package imports.
- **Remediation**: Run npm prune and regular audits to eliminate unused external packages.

---

### 📌 [WSEC-13] Incomplete cross-origin opener policy
- **Severity**: `Low`
- **Location**: [`src/components/common/Header.tsx`](src/components/common/Header.tsx)
- **Description**: External link anchor tags do not include secure rel="noopener noreferrer" flags, exposing window pointer access.
- **Remediation**: Ensure all anchor elements targeted with _blank define rel="noopener noreferrer".

---

### 📌 [WSEC-14] Lack of UI clickjacking prevention script
- **Severity**: `Low`
- **Location**: [`index.html`](index.html)
- **Description**: No framebuster script acts as a backup for clients not supporting CSP security frame ancestors rules.
- **Remediation**: Add a small inline script checking self === top and breaking out of frames if false.

---

