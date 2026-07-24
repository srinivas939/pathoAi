#!/usr/bin/env bash
# scripts/ci_run_tests.sh
# PathoAI Android Appium CI test runner
# Runs inside the reactivecircus/android-emulator-runner@v2 container.
#
# Usage: bash scripts/ci_run_tests.sh
# Required env vars:
#   APK_PATH          — path to the compiled debug APK
#   ANDROID_SDK_ROOT  — set by GHA android action
#   GITHUB_PATH       — GHA environment file for PATH extension
#   GITHUB_STEP_SUMMARY — GHA summary file

set -euo pipefail

# ── Colours ───────────────────────────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; CYAN='\033[0;36m'; NC='\033[0m'
log()  { echo -e "${CYAN}[CI]${NC} $*"; }
ok()   { echo -e "${GREEN}[OK]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err()  { echo -e "${RED}[ERR]${NC} $*"; }

log "========================================================"
log "  PathoAI Android Appium E2E — CI Runner"
log "  $(date -u '+%Y-%m-%d %H:%M:%S UTC')"
log "========================================================"

# ── 1. Inject GHA Node.js path into shell PATH ────────────────────────────────
if [[ -f "${GITHUB_PATH:-}" ]]; then
  log "Injecting GITHUB_PATH entries into PATH..."
  while IFS= read -r p; do
    [[ -n "$p" ]] && export PATH="$p:$PATH"
  done < "$GITHUB_PATH"
fi

# Ensure node is visible
if ! command -v node &>/dev/null; then
  # Try common NVM/actions paths
  for d in /opt/hostedtoolcache/node/*/x64/bin /usr/local/lib/nodejs/*/bin; do
    [[ -d "$d" ]] && export PATH="$d:$PATH" && break
  done
fi

log "Node: $(node --version 2>/dev/null || echo 'not found')"
log "npm:  $(npm  --version 2>/dev/null || echo 'not found')"

# ── 2. Wait for emulator to be fully booted ────────────────────────────────────
log "Waiting for Android emulator to boot (up to 120 seconds)..."
BOOT_TIMEOUT=120
BOOT_START=$(date +%s)
while true; do
  BOOT_STATUS=$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r' || echo '0')
  [[ "$BOOT_STATUS" == "1" ]] && break
  NOW=$(date +%s)
  ELAPSED=$(( NOW - BOOT_START ))
  if [[ $ELAPSED -ge $BOOT_TIMEOUT ]]; then
    err "Emulator did not boot within ${BOOT_TIMEOUT}s"
    export FALLBACK_ERROR="Emulator did not boot within ${BOOT_TIMEOUT}s"
    node utils/generateFallbackReport.cjs || true
    exit 1
  fi
  sleep 3
  log "  Waiting... (${ELAPSED}s)"
done
ok "Emulator fully booted"

# Unlock screen
adb shell input keyevent 82 2>/dev/null || true
adb shell wm dismiss-keyguard 2>/dev/null || true

# ── 3. Install the APK ────────────────────────────────────────────────────────
APK_PATH="${APK_PATH:-android/app/build/outputs/apk/debug/app-debug.apk}"
if [[ -f "$APK_PATH" ]]; then
  log "Installing APK: $APK_PATH"
  adb install -r "$APK_PATH"
  ok "APK installed"
else
  warn "APK not found at $APK_PATH — continuing without install (noReset mode)"
fi

# ── 4. Start Appium server ─────────────────────────────────────────────────────
log "Starting Appium server..."
APPIUM_LOG="/tmp/appium.log"
npx appium --log-level warn > "$APPIUM_LOG" 2>&1 &
APPIUM_PID=$!
log "Appium PID: $APPIUM_PID"

# Wait for Appium to respond on port 4723 (up to 60 seconds)
APPIUM_TIMEOUT=60
APPIUM_START=$(date +%s)
while true; do
  if curl -sf "http://localhost:4723/status" > /dev/null 2>&1; then
    ok "Appium server is ready"
    break
  fi
  NOW=$(date +%s)
  ELAPSED=$(( NOW - APPIUM_START ))
  if [[ $ELAPSED -ge $APPIUM_TIMEOUT ]]; then
    err "Appium did not start within ${APPIUM_TIMEOUT}s"
    warn "Last 30 lines of appium.log:"
    tail -30 "$APPIUM_LOG" || true
    export FALLBACK_ERROR="Appium server failed to start within ${APPIUM_TIMEOUT}s"
    node utils/generateFallbackReport.cjs || true
    kill $APPIUM_PID 2>/dev/null || true
    exit 1
  fi
  sleep 2
  log "  Waiting for Appium... (${ELAPSED}s)"
done

# ── 5. Run WDIO ───────────────────────────────────────────────────────────────
log "Running WDIO test suite..."
WDIO_EXIT=0
node node_modules/@wdio/cli/bin/wdio.js run wdio.conf.cjs \
  --spec tests/mega_android_1111.test.cjs \
  2>&1 | tee /tmp/wdio.log || WDIO_EXIT=$?

if [[ $WDIO_EXIT -ne 0 ]]; then
  warn "WDIO exited with code $WDIO_EXIT"
  # If reports are empty/missing, generate fallback
  if [[ ! -s "Test_Results/Android/android-report.xlsx" ]]; then
    warn "No Excel report generated — running fallback reporter"
    export FALLBACK_ERROR="WDIO exited early (code $WDIO_EXIT)"
    node utils/generateFallbackReport.cjs || true
  fi
fi

# ── 6. Generate GitHub Actions summary ────────────────────────────────────────
JSONL=".wdio-results.jsonl"
if [[ -f "$JSONL" ]]; then
  log "Generating GitHub Actions summary..."
  node utils/generateSummary.cjs "$JSONL" || warn "generateSummary.cjs failed"
fi

# ── 7. Cleanup ────────────────────────────────────────────────────────────────
kill $APPIUM_PID 2>/dev/null || true
log "Appium server stopped"

log "========================================================"
ok "CI run complete — exit code: $WDIO_EXIT"
log "========================================================"

exit $WDIO_EXIT
