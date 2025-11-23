import { join } from 'node:path';
import { copy } from 'fs-extra';

const source = join(process.cwd(), 'bicep/src/textmate/bicep.tmlanguage');
const dest = join(process.cwd(), 'syntaxes/bicep.tmlanguage');

async function main() {
  try {
    await copy(source, dest);
    console.log(`Successfully copied grammar from ${source} to ${dest}`);
  } catch (err) {
    console.error('Error copying grammar:', err);
    process.exit(1);
  }
}

main();
