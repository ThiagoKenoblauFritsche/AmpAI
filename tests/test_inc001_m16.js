'use strict';

const assert = require('node:assert/strict');
const { CurtoCircuitoIEC60909 } = require('../js/core_curto_circuito.js');

const METHOD = 'CurtoCircuitoIEC60909.calcularCorrenteInicialSimetrica';
const ALLOWED_C = [0.9, 0.95, 1, 1.05, 1.1];
const RELATIVE_TOLERANCE = 0.0001; // 0,01%

const spies = {
  domAccessCount: 0,
  rendererCalls: 0,
  consoleWarnCalls: 0,
  consoleErrorCalls: 0,
};

const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;
const createdGlobals = [];

function installSideEffectSpies() {
  console.warn = (...args) => {
    spies.consoleWarnCalls += 1;
    return originalConsoleWarn.apply(console, args);
  };
  console.error = (...args) => {
    spies.consoleErrorCalls += 1;
    return originalConsoleError.apply(console, args);
  };

  ['document', 'HTMLElement', 'Element', 'Node'].forEach((name) => {
    if (!Object.prototype.hasOwnProperty.call(globalThis, name)) {
      Object.defineProperty(globalThis, name, {
        configurable: true,
        get() {
          spies.domAccessCount += 1;
          return undefined;
        },
      });
      createdGlobals.push(name);
    }
  });

  ['render', 'renderResult', 'renderError', 'renderWarning', 'renderCurtoCircuito', 'ui_render'].forEach((name) => {
    if (!Object.prototype.hasOwnProperty.call(globalThis, name)) {
      Object.defineProperty(globalThis, name, {
        configurable: true,
        value: () => {
          spies.rendererCalls += 1;
        },
      });
      createdGlobals.push(name);
    }
  });
}

function resetSpies() {
  spies.domAccessCount = 0;
  spies.rendererCalls = 0;
  spies.consoleWarnCalls = 0;
  spies.consoleErrorCalls = 0;
}

function restoreSideEffectSpies() {
  console.warn = originalConsoleWarn;
  console.error = originalConsoleError;
  createdGlobals.forEach((name) => {
    delete globalThis[name];
  });
}

function hasNoSideEffects(sideEffects) {
  return sideEffects.domAccessCount === 0
    && sideEffects.rendererCalls === 0
    && sideEffects.consoleWarnCalls === 0
    && sideEffects.consoleErrorCalls === 0;
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isResultPattern(result) {
  return isObject(result)
    && typeof result.isSuccess === 'boolean'
    && Object.prototype.hasOwnProperty.call(result, 'value')
    && Object.prototype.hasOwnProperty.call(result, 'error');
}

function isProblemDetails(error, expectedCode, expectedParams) {
  if (!isObject(error)) return false;
  if (error.type !== `https://ampai.dev/problems/${expectedCode}`) return false;
  if (error.title !== expectedCode) return false;
  if (error.status !== 422) return false;
  if (error.code !== expectedCode) return false;
  if (error.severity !== 'error') return false;
  if (!isObject(error.params)) return false;

  return Object.entries(expectedParams).every(([key, expected]) => {
    const observed = error.params[key];
    if (Array.isArray(expected)) {
      return Array.isArray(observed)
        && observed.length === expected.length
        && observed.every((value, index) => value === expected[index]);
    }
    return observed === expected;
  });
}

function relativeClose(observed, expected) {
  return typeof observed === 'number'
    && Number.isFinite(observed)
    && Math.abs(observed - expected) / Math.abs(expected) <= RELATIVE_TOLERANCE;
}

function jsonReplacer(_key, value) {
  if (typeof value === 'number') {
    if (Number.isNaN(value)) return 'NaN';
    if (value === Number.POSITIVE_INFINITY) return 'Infinity';
    if (value === Number.NEGATIVE_INFINITY) return '-Infinity';
  }
  return value;
}

function callM16(input) {
  resetSpies();
  const args = [];
  if (Object.prototype.hasOwnProperty.call(input, 'Un')) args[0] = input.Un;
  if (Object.prototype.hasOwnProperty.call(input, 'Zk')) args[1] = input.Zk;
  if (Object.prototype.hasOwnProperty.call(input, 'c')) args[2] = input.c;

  try {
    const result = CurtoCircuitoIEC60909.calcularCorrenteInicialSimetrica(...args);
    return {
      threw: false,
      thrownName: null,
      thrownMessage: null,
      result,
      sideEffects: { ...spies },
    };
  } catch (error) {
    return {
      threw: true,
      thrownName: error && error.name ? error.name : typeof error,
      thrownMessage: error && error.message ? error.message : String(error),
      result: null,
      sideEffects: { ...spies },
    };
  }
}

function successReport(testCase) {
  const execution = callM16(testCase.input);
  const result = execution.result;
  const resultPatternPreserved = !execution.threw && isResultPattern(result);
  const success = resultPatternPreserved && result.isSuccess === true;
  const value = success ? result.value : null;
  const valueShape = isObject(value)
    && typeof value.valor_amperes === 'number'
    && Number.isFinite(value.valor_amperes)
    && typeof value.valor_kiloamperes === 'number'
    && Number.isFinite(value.valor_kiloamperes)
    && result.error === null;
  const valueMatches = valueShape
    && relativeClose(value.valor_kiloamperes, testCase.expectedKA)
    && relativeClose(value.valor_amperes, testCase.expectedKA * 1000);
  const paramsMatch = valueShape
    && isObject(value.parametros_utilizados)
    && value.parametros_utilizados.Un === testCase.input.Un
    && value.parametros_utilizados.Zk === testCase.input.Zk
    && value.parametros_utilizados.c === testCase.input.c;
  const noSideEffects = hasNoSideEffects(execution.sideEffects);

  return {
    case: testCase.id,
    category: 'success',
    method: METHOD,
    input: testCase.input,
    expected: {
      isSuccess: true,
      value_kiloamperes: testCase.expectedKA,
      relativeTolerance: RELATIVE_TOLERANCE,
    },
    observed: {
      threw: execution.threw,
      thrownName: execution.thrownName,
      resultPatternPreserved,
      isSuccess: result && result.isSuccess,
      value_kiloamperes: value && value.valor_kiloamperes,
      value_amperes: value && value.valor_amperes,
      error: result && result.error,
      sideEffects: execution.sideEffects,
    },
    checks: {
      resultPatternPreserved,
      success,
      valueShape,
      valueMatches,
      paramsMatch,
      noSideEffects,
    },
    compliant: resultPatternPreserved
      && success
      && valueShape
      && valueMatches
      && paramsMatch
      && noSideEffects,
  };
}

function errorReport(testCase) {
  const execution = callM16(testCase.input);
  const result = execution.result;
  const resultPatternPreserved = !execution.threw && isResultPattern(result);
  const failure = resultPatternPreserved && result.isSuccess === false;
  const valueNull = failure && result.value === null;
  const problemDetails = failure && isProblemDetails(result.error, testCase.expectedCode, testCase.expectedParams);
  const noTextualException = !execution.threw;
  const noSideEffects = hasNoSideEffects(execution.sideEffects);

  return {
    case: testCase.id,
    category: testCase.category,
    method: METHOD,
    input: testCase.input,
    expected: {
      isSuccess: false,
      value: null,
      errorCode: testCase.expectedCode,
      errorStatus: 422,
      severity: 'error',
      params: testCase.expectedParams,
    },
    observed: {
      threw: execution.threw,
      thrownName: execution.thrownName,
      thrownMessage: execution.thrownMessage,
      resultPatternPreserved,
      isSuccess: result && result.isSuccess,
      value: result && result.value,
      error: result && result.error,
      sideEffects: execution.sideEffects,
    },
    checks: {
      resultPatternPreserved,
      failure,
      valueNull,
      problemDetails,
      noTextualException,
      noSideEffects,
    },
    compliant: resultPatternPreserved
      && failure
      && valueNull
      && problemDetails
      && noTextualException
      && noSideEffects,
  };
}

function structuralCases() {
  const base = { Un: 410, Zk: 0.017, c: 1.05 };
  const invalids = [
    { suffix: 'absent', include: false, value: undefined },
    { suffix: 'non_numeric_text', include: true, value: 'abc' },
    { suffix: 'NaN', include: true, value: Number.NaN },
    { suffix: 'Infinity', include: true, value: Number.POSITIVE_INFINITY },
    { suffix: '-Infinity', include: true, value: Number.NEGATIVE_INFINITY },
  ];

  return ['Un', 'Zk', 'c'].flatMap((field) => invalids.map((invalid) => {
    const input = { ...base };
    if (invalid.include) input[field] = invalid.value;
    else delete input[field];
    return {
      id: `TC-M16-STRUCT-${field}-${invalid.suffix}`,
      type: 'error',
      category: 'structural-block',
      input,
      expectedCode: 'IEC60909-M16-001',
      expectedParams: { field, reason: 'not_finite' },
    };
  }));
}

const testCases = [
  {
    id: 'TC-M16-01',
    type: 'success',
    input: { Un: 400, Zk: 0.01717, c: 1.05 },
    expectedKA: 14.1227206,
  },
  {
    id: 'TC-M16-05',
    type: 'success',
    input: { Un: 410, Zk: 0.017, c: 0.95 },
    expectedKA: 13.2281135,
  },
  {
    id: 'TC-M16-02',
    type: 'error',
    category: 'physical-block',
    input: { Un: 0, Zk: 0.017, c: 1.05 },
    expectedCode: 'IEC60909-M16-002',
    expectedParams: { field: 'Un', reason: 'non_positive' },
  },
  {
    id: 'TC-M16-02b',
    type: 'error',
    category: 'physical-block',
    input: { Un: -400, Zk: 0.017, c: 1.05 },
    expectedCode: 'IEC60909-M16-002',
    expectedParams: { field: 'Un', reason: 'non_positive' },
  },
  {
    id: 'TC-M16-03',
    type: 'error',
    category: 'physical-block',
    input: { Un: 410, Zk: 0, c: 1.05 },
    expectedCode: 'IEC60909-M16-003',
    expectedParams: { field: 'Zk', reason: 'non_positive' },
  },
  {
    id: 'TC-M16-03b',
    type: 'error',
    category: 'physical-block',
    input: { Un: 410, Zk: -0.017, c: 1.05 },
    expectedCode: 'IEC60909-M16-003',
    expectedParams: { field: 'Zk', reason: 'non_positive' },
  },
  {
    id: 'TC-M16-04',
    type: 'error',
    category: 'normative-block',
    input: { Un: 410, Zk: 0.017, c: 1.15 },
    expectedCode: 'IEC60909-M16-004',
    expectedParams: { field: 'c', reason: 'not_in_allowed_set', allowed: ALLOWED_C },
  },
  {
    id: 'TC-M16-06',
    type: 'error',
    category: 'normative-block',
    input: { Un: 410, Zk: 0.017, c: 0.85 },
    expectedCode: 'IEC60909-M16-004',
    expectedParams: { field: 'c', reason: 'not_in_allowed_set', allowed: ALLOWED_C },
  },
  {
    id: 'TC-M16-07',
    type: 'error',
    category: 'normative-block',
    input: { Un: 410, Zk: 0.017, c: 0.93 },
    expectedCode: 'IEC60909-M16-004',
    expectedParams: { field: 'c', reason: 'not_in_allowed_set', allowed: ALLOWED_C },
  },
  ...structuralCases(),
];

function main() {
  installSideEffectSpies();
  try {
    const reports = testCases.map((testCase) => (
      testCase.type === 'success' ? successReport(testCase) : errorReport(testCase)
    ));

    reports.forEach((report) => {
      console.log(`INC001_M16_REPORT ${JSON.stringify(report, jsonReplacer)}`);
    });

    assert.equal(reports.length, 24, `CONFIG_ERROR: esperado exatamente 24 INC001_M16_REPORT; observado ${reports.length}.`);
    assert.equal(
      reports.every((report) => report.method === METHOD && report.observed && Object.prototype.hasOwnProperty.call(report.observed, 'resultPatternPreserved')),
      true,
      'CONFIG_ERROR: todos os relatórios devem exercitar o contrato M16 e registrar Result Pattern observado.',
    );

    const nonCompliant = reports.filter((report) => !report.compliant);
    if (nonCompliant.length > 0) {
      console.error(`INC001_M16_SUMMARY ${JSON.stringify({
        classification: 'FUNCTIONAL_FAILURE',
        reports: reports.length,
        compliant: reports.length - nonCompliant.length,
        nonCompliant: nonCompliant.length,
        nonCompliantCases: nonCompliant.map((report) => report.case),
      })}`);
      process.exit(1);
    }

    console.log(`INC001_M16_SUMMARY ${JSON.stringify({
      classification: 'PASS',
      reports: reports.length,
      compliant: reports.length,
      nonCompliant: 0,
    })}`);
    process.exit(0);
  } finally {
    restoreSideEffectSpies();
  }
}

main();
