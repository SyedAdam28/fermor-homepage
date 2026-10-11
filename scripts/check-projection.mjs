import assert from 'node:assert/strict';
import {projectSavings, requiredContribution} from '../lib/projection.ts';

assert.equal(projectSavings(10000, 5, 0).value, 600000);
const example = projectSavings(10000, 5, 7);
assert.equal(example.contributions, 600000);
assert.equal(Math.round(example.value), 715929);
assert.equal(projectSavings(20000, 5, 7).value, 2 * example.value);
assert.ok(projectSavings(10000, 10, 7).value > example.value);
for (const years of [1, 5, 10, 20]) {
  for (const rate of [0, 4, 7, 12]) {
    const monthly = requiredContribution(1000000, years, rate);
    assert.ok(Math.abs(projectSavings(monthly, years, rate).value - 1000000) < 0.01);
  }
}
console.log('Projection checks passed: zero return, known compound example, contribution scaling, duration and required-contribution inversion.');
