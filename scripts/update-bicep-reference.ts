#!/usr/bin/env bun

/**
 * Update the Azure/bicep reference repository using git subtree
 *
 * This script updates the vendor/bicep directory with the latest changes
 * from https://github.com/Azure/bicep
 */

import { $ } from 'bun';

const BICEP_REPO = 'https://github.com/Azure/bicep';
const SUBTREE_PREFIX = 'vendor/bicep';
const BRANCH = 'main';

console.log('Updating Azure/bicep reference...');
console.log(`Repository: ${BICEP_REPO}`);
console.log(`Branch: ${BRANCH}`);
console.log(`Target: ${SUBTREE_PREFIX}`);
console.log();

try {
  await $`git subtree pull --prefix=${SUBTREE_PREFIX} ${BICEP_REPO} ${BRANCH} --squash`;
  console.log('\n✓ Successfully updated Azure/bicep reference');
} catch (error) {
  console.error('\n✗ Failed to update Azure/bicep reference');
  console.error(error);
  process.exit(1);
}
