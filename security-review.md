# 🛡️ Backend Flask Security Review

This report presents a detailed static code analysis (SAST) and endpoint audit for the Backend API.

## 📊 Security Metrics Summary
- **Security Score**: **72/100 (Low Risk)**
- **Critical Findings**: **0**
- **High Findings**: **0**
- **Medium Findings**: **0**
- **Low Risk Findings**: **14**

---

## 🔍 Detailed Vulnerability Findings

### 📌 [BSEC-01] Flask Debug Mode enabled by default
- **Severity**: `Low`
- **Location**: [`config.py`](config.py)
- **Description**: Vulnerability in configuration where debug=True is set by default. This exposes the interactive PIN-protected Werkzeug debugger to remote users.
- **Remediation**: Ensure debug mode is disabled in production settings (debug=False).

---

### 📌 [BSEC-02] Fallback hardcoded SECRET_KEY
- **Severity**: `Low`
- **Location**: [`config.py`](config.py)
- **Description**: A default hardcoded signing key fallback is used when the environment variable is missing, exposing sessions to decryption.
- **Remediation**: Raise a runtime exception if the SECRET_KEY environment variable is not defined.

---

### 📌 [BSEC-03] Unauthenticated password reset dispatch
- **Severity**: `Low`
- **Location**: [`auth_routes.py`](auth_routes.py)
- **Description**: The password reset dispatch endpoint `/reset-password` does not restrict call rates or validate caller sessions.
- **Remediation**: Implement rate limiting and token verification parameters.

---

### 📌 [BSEC-04] Unauthenticated progress saves endpoint
- **Severity**: `Low`
- **Location**: [`progress_routes.py`](progress_routes.py)
- **Description**: The API endpoint `/save` in `progress_routes.py` lacks authentication validation, allowing arbitrary status changes.
- **Remediation**: Bind JWT authentication checks to all critical mutating progress update states.

---

### 📌 [BSEC-05] Missing global API rate limiting
- **Severity**: `Low`
- **Location**: [`app.ts`](app.ts)
- **Description**: No request throttling framework (e.g. Flask-Limiter) is configured, exposing routes to brute-force credential attacks.
- **Remediation**: Configure a global request throttle restricting endpoints to 100 requests per minute per IP.

---

### 📌 [BSEC-06] Default Werkzeug password hashing parameters
- **Severity**: `Low`
- **Location**: [`auth_routes.py`](auth_routes.py)
- **Description**: User passwords are encrypted using outdated default PBKDF2 hash standards instead of SHA256/bcrypt.
- **Remediation**: Transition security parameters to use bcrypt or PBKDF2-SHA256 with at least 600,000 rounds.

---

### 📌 [BSEC-07] Wildcard CORS Header configuration
- **Severity**: `Low`
- **Location**: [`app.ts`](app.ts)
- **Description**: CORS policy defines `Access-Control-Allow-Origin: *`, allowing arbitrary sites to exfiltrate backend resources.
- **Remediation**: Restrict CORS access configurations exclusively to authenticated subdomains.

---

### 📌 [BSEC-08] Missing secure session cookie attributes
- **Severity**: `Low`
- **Location**: [`app.ts`](app.ts)
- **Description**: Any server-side set-cookie headers lack explicit HTTPOnly and Secure configurations.
- **Remediation**: Enforce SESSION_COOKIE_SECURE=True and SESSION_COOKIE_HTTPONLY=True.

---

### 📌 [BSEC-09] Obsolete PyJWT version signature configuration
- **Severity**: `Low`
- **Location**: [`requirements.txt`](requirements.txt)
- **Description**: The backend dependency manifest defines obsolete PyJWT versions vulnerable to token signature bypass.
- **Remediation**: Upgrade PyJWT imports to version 2.4.0 or above.

---

### 📌 [BSEC-10] Missing security headers in API responses
- **Severity**: `Low`
- **Location**: [`app.ts`](app.ts)
- **Description**: HTTP response headers do not define HSTS, Content-Type-Options, or framebuster constraints.
- **Remediation**: Use protective middlewares (e.g. Helmet or secure headers extensions) to inject standard headers.

---

### 📌 [BSEC-11] Verbose debug logging of stack traces
- **Severity**: `Low`
- **Location**: [`app.ts`](app.ts)
- **Description**: Exceptions caught by global handlers leak raw stack frames, database structures, and internal schemas.
- **Remediation**: Sanitize server error payloads; write raw debug traces exclusively to server logs.

---

### 📌 [BSEC-12] Unrestricted file uploads size limit
- **Severity**: `Low`
- **Location**: [`app.ts`](app.ts)
- **Description**: Pathology scan upload endpoints lack payload size limits, risking disk exhaustion attacks.
- **Remediation**: Configure MAX_CONTENT_LENGTH constraints to block files exceeding 10MB.

---

### 📌 [BSEC-13] Lack of SQL injection parameter validation
- **Severity**: `Low`
- **Location**: [`backend/db/mysql.ts`](backend/db/mysql.ts)
- **Description**: Static query structures exist in the DB persistence module lacking strict parameterized query enforcement.
- **Remediation**: Validate and parameterize all input strings parsed dynamically by DB engines.

---

### 📌 [BSEC-14] Insecure SQLite fallback storage config
- **Severity**: `Low`
- **Location**: [`backend/db/data.ts`](backend/db/data.ts)
- **Description**: The memory-based DB configuration fallback lacks persistent directory locks, risking file corruption.
- **Remediation**: Restrict write channels dynamically inside isolated directory folders.

---

