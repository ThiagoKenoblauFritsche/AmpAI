'use strict';

console.log(`FIXTURE_REPORT ${JSON.stringify({ case: 'functional-1', compliant: true })}`);
console.log(`FIXTURE_REPORT ${JSON.stringify({ case: 'functional-2', compliant: false })}`);
process.exitCode = 1;
