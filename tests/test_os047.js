/**
 * O.S. 047 — QA RED do contrato de erros e avisos BT/MT.
 *
 * Execução: node tests/test_os047.js
 * Contrato canônico: O.S. 046 BDD + SDD (envelopes JSON/RFC 7807).
 */
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');

const VALID_BT = Object.freeze({
  method: 'C',
  phases: 3,
  Ib_A: 10,
  In_A: 16,
  ULL_V: 380,
  length_m: 50,
  cosPhi: 0.92,
  duMax_pct: 3,
  thetaAmb_C: 30,
  nCircuits: 1,
  Icc_A: 10000,
  tProt_s: 0.2,
  conductor: 'Cu',
  insulation: 'XLPE'
});

const VALID_MT = Object.freeze({
  voltageClass: '8.7/15',
  earthing: 'solid',
  iFault_A: 1000,
  conductor: 'Cu',
  insulation: 'XLPE',
  Ib_A: 100,
  In_A: 125,
  cosPhi: 0.9,
  ULL_V: 13800,
  length_m: 100,
  duMax_pct: 2,
  formation: 'trefoil_touching',
  nCircuits: 1,
  rhoSoil_KmW: 1,
  depth_m: 0.8,
  thetaAmb_C: 20,
  Icc_A: 10000,
  tConductor_s: 0.5,
  tScreen_s: 1,
  sheath: 'PVC',
  _warnings: []
});

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function createDomStub(spies) {
  const elements = new Map();
  return {
    getElementById(id) {
      spies.domAccesses.push(`getElementById:${id}`);
      if (!elements.has(id)) {
        elements.set(id, {
          classList: {
            add() {},
            remove() {}
          },
          innerText: '',
          innerHTML: '',
          value: ''
        });
      }
      return elements.get(id);
    }
  };
}

function loadEngine(domain, { allowDom = true } = {}) {
  const spies = {
    domAccesses: [],
    rendererCalls: [],
    consoleWarnCalls: [],
    consoleErrorCalls: []
  };
  const window = {};
  window.AmpAI_State = {};
  window.renderCablingMTResults = (payload) => spies.rendererCalls.push(payload);
  window.renderCablingBTResults = (payload) => spies.rendererCalls.push(payload);
  window.renderCardBT = (payload) => spies.rendererCalls.push(payload);

  const context = {
    window,
    console: {
      log() {},
      warn(...args) { spies.consoleWarnCalls.push(args); },
      error(...args) { spies.consoleErrorCalls.push(args); }
    }
  };

  if (allowDom) {
    context.document = createDomStub(spies);
  } else {
    context.document = new Proxy({}, {
      get(_target, property) {
        spies.domAccesses.push(String(property));
        throw new Error('DOM access forbidden by OS047 purity contract');
      }
    });
  }

  vm.createContext(context);
  const filename = domain === 'BT' ? 'js/core_cabos_bt.js' : 'js/core_cabos_mt.js';
  const source = fs.readFileSync(path.join(ROOT, filename), 'utf8');
  vm.runInContext(source, context, { filename });

  return {
    calculate: domain === 'BT' ? window.calculateCablingBT : window.calculateCablingMT,
    spies
  };
}

function execute(domain, input, options) {
  let engine;
  let result;
  let exception = null;

  try {
    engine = loadEngine(domain, options);
    result = engine.calculate(clone(input));
  } catch (error) {
    exception = error;
  }

  return {
    result,
    exception,
    spies: engine?.spies || {
      domAccesses: [],
      rendererCalls: [],
      consoleWarnCalls: [],
      consoleErrorCalls: []
    }
  };
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isSuccessEnvelope(result) {
  return isObject(result) &&
    result.ok === true &&
    isObject(result.data) &&
    Array.isArray(result.warnings);
}

function isProblemEnvelope(result, code) {
  return isObject(result) &&
    result.ok === false &&
    result.data === null &&
    Array.isArray(result.warnings) &&
    result.warnings.length === 0 &&
    isObject(result.error) &&
    result.error.type === `https://ampai.dev/problems/${code}` &&
    result.error.title === code &&
    result.error.status === 422 &&
    result.error.code === code &&
    isObject(result.error.params) &&
    result.error.severity === 'error';
}

function structuredWarning(result, code) {
  if (!isSuccessEnvelope(result)) return null;
  return result.warnings.find((warning) =>
    isObject(warning) &&
    warning.code === code &&
    isObject(warning.params) &&
    warning.severity === 'warning'
  ) || null;
}

function resultKind(result) {
  if (result === undefined) return 'undefined';
  if (result === null) return 'null';
  if (Array.isArray(result)) return 'array';
  return typeof result;
}

function hasNoSideEffects(spies) {
  return spies.domAccesses.length === 0 &&
    spies.rendererCalls.length === 0 &&
    spies.consoleWarnCalls.length === 0 &&
    spies.consoleErrorCalls.length === 0;
}

function successReport(caseName, domain, input) {
  const execution = execute(domain, input, { allowDom: true });
  const compliant = !execution.exception &&
    isSuccessEnvelope(execution.result) &&
    execution.result.warnings.length === 0 &&
    hasNoSideEffects(execution.spies);
  return {
    case: caseName,
    domain,
    observed: {
      threw: Boolean(execution.exception),
      exceptionName: execution.exception?.name || null,
      resultKind: resultKind(execution.result),
      ok: execution.result?.ok ?? null,
      hasData: isObject(execution.result?.data),
      warningsIsArray: Array.isArray(execution.result?.warnings),
      warningCount: Array.isArray(execution.result?.warnings) ? execution.result.warnings.length : null,
      domAccessCount: execution.spies.domAccesses.length,
      rendererCalls: execution.spies.rendererCalls.length,
      consoleWarnCalls: execution.spies.consoleWarnCalls.length,
      consoleErrorCalls: execution.spies.consoleErrorCalls.length
    },
    compliant
  };
}

function errorReport(caseName, domain, code, input) {
  const execution = execute(domain, input, { allowDom: true });
  const compliant = !execution.exception &&
    isProblemEnvelope(execution.result, code) &&
    hasNoSideEffects(execution.spies);
  return {
    case: caseName,
    domain,
    observed: {
      expectedCode: code,
      threw: Boolean(execution.exception),
      exceptionName: execution.exception?.name || null,
      resultKind: resultKind(execution.result),
      ok: execution.result?.ok ?? null,
      dataIsNull: execution.result?.data === null,
      warningsIsEmpty: Array.isArray(execution.result?.warnings) && execution.result.warnings.length === 0,
      problem: isObject(execution.result?.error) ? {
        type: execution.result.error.type ?? null,
        title: execution.result.error.title ?? null,
        status: execution.result.error.status ?? null,
        code: execution.result.error.code ?? null,
        hasParams: isObject(execution.result.error.params),
        severity: execution.result.error.severity ?? null
      } : null,
      domAccessCount: execution.spies.domAccesses.length,
      rendererCalls: execution.spies.rendererCalls.length,
      consoleWarnCalls: execution.spies.consoleWarnCalls.length,
      consoleErrorCalls: execution.spies.consoleErrorCalls.length
    },
    compliant
  };
}

function warningReport(caseName, domain, code, input) {
  const execution = execute(domain, input, { allowDom: true });
  const warning = structuredWarning(execution.result, code);
  const dataPreserved = isObject(execution.result?.data);
  const legacyPayload = execution.spies.rendererCalls[0] || execution.result;
  const legacyWarnings = Array.isArray(legacyPayload?.input?._warnings)
    ? legacyPayload.input._warnings
    : [];
  const compliant = !execution.exception &&
    isSuccessEnvelope(execution.result) &&
    Boolean(warning) &&
    dataPreserved &&
    hasNoSideEffects(execution.spies);
  return {
    case: caseName,
    domain,
    observed: {
      expectedCode: code,
      threw: Boolean(execution.exception),
      exceptionName: execution.exception?.name || null,
      resultKind: resultKind(execution.result),
      ok: execution.result?.ok ?? null,
      dataPreserved,
      warningsIsArray: Array.isArray(execution.result?.warnings),
      warningCount: Array.isArray(execution.result?.warnings) ? execution.result.warnings.length : null,
      structuredWarningFound: Boolean(warning),
      legacyWarningCount: legacyWarnings.length,
      legacyWarningValueTypes: legacyWarnings.map((item) => typeof item),
      domAccessCount: execution.spies.domAccesses.length,
      consoleWarnCalls: execution.spies.consoleWarnCalls.length,
      consoleErrorCalls: execution.spies.consoleErrorCalls.length,
      rendererCalls: execution.spies.rendererCalls.length
    },
    compliant
  };
}

function purityReport(caseName, domain, input) {
  const execution = execute(domain, input, { allowDom: false });
  const compliant = !execution.exception &&
    hasNoSideEffects(execution.spies);
  return {
    case: caseName,
    domain,
    observed: {
      threw: Boolean(execution.exception),
      exceptionName: execution.exception?.name || null,
      resultKind: resultKind(execution.result),
      domAccessCount: execution.spies.domAccesses.length,
      rendererCalls: execution.spies.rendererCalls.length,
      consoleWarnCalls: execution.spies.consoleWarnCalls.length,
      consoleErrorCalls: execution.spies.consoleErrorCalls.length
    },
    compliant
  };
}

const reports = [
  successReport('success-envelope-bt', 'BT', VALID_BT),
  successReport('success-envelope-mt', 'MT', VALID_MT),
  errorReport('rfc7807-error-qa-bt-001', 'BT', 'QA-BT-001', {
    ...VALID_BT,
    Ib_A: 16,
    In_A: 10
  }),
  errorReport('rfc7807-error-qa-mt-005', 'MT', 'QA-MT-005', {
    ...VALID_MT,
    Ib_A: 0
  }),
  warningReport('structured-warning-qa-bt-005', 'BT', 'QA-BT-005', {
    ...VALID_BT,
    tProt_s: 6
  }),
  warningReport('structured-warning-qa-mt-011', 'MT', 'QA-MT-011', {
    ...VALID_MT,
    Icc_A: 120000
  }),
  purityReport('pure-engine-bt', 'BT', VALID_BT),
  purityReport('pure-engine-mt', 'MT', VALID_MT)
];

reports.forEach((report) => console.log(`OS047_REPORT ${JSON.stringify(report)}`));

try {
  assert.equal(reports.length, 8, `O.S. 047 exige exatamente oito relatórios; obtidos: ${reports.length}.`);
  const failures = reports.filter((report) => report.compliant !== true);
  assert.equal(
    failures.length,
    0,
    `Contrato O.S. 046 violado em ${failures.length} caso(s): ` +
      JSON.stringify(failures.map((report) => ({ case: report.case, domain: report.domain })))
  );
  console.log('GREEN: os oito contratos de erros, warnings e pureza estão conformes.');
} catch (error) {
  console.error(`FAIL (RED esperado): ${error.message}`);
  process.exitCode = 1;
}
