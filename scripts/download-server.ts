import { exec } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const BICEP_VERSION = 'v0.39.26';
const ASSETS_DIR = path.join(__dirname, '..', 'assets');
const LANG_SERVER_DIR = path.join(ASSETS_DIR, 'bicepLanguageServer');
const ZIP_FILE = path.join(ASSETS_DIR, 'bicep-langserver.zip');
const DOWNLOAD_URL = `https://github.com/Azure/bicep/releases/download/${BICEP_VERSION}/bicep-langserver.zip`;

async function downloadFile(url: string, dest: string) {
  console.log(`Downloading ${url} to ${dest}...`);

  // Use curl for reliable download with redirect support
  const command = `curl -L -o "${dest}" "${url}"`;

  try {
    await execAsync(command);
    console.log(`Downloaded ${dest}`);

    // Verify file was downloaded
    if (!fs.existsSync(dest)) {
      throw new Error(`Download failed: ${dest} not found`);
    }

    const stats = fs.statSync(dest);
    if (stats.size === 0) {
      throw new Error(`Download failed: ${dest} is empty`);
    }

    console.log(`File size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (error) {
    throw new Error(`Failed to download ${url}: ${error}`);
  }
}

async function extractZip(zipPath: string, extractTo: string) {
  console.log(`Extracting ${zipPath} to ${extractTo}...`);

  // Create extract directory if it doesn't exist
  if (!fs.existsSync(extractTo)) {
    fs.mkdirSync(extractTo, { recursive: true });
  }

  // Use unzip command (available on macOS and most Linux distros)
  // On Windows, this will use built-in tar command (Windows 10+)
  const isWindows = process.platform === 'win32';
  const command = isWindows
    ? `powershell -command "Expand-Archive -Path '${zipPath}' -DestinationPath '${extractTo}' -Force"`
    : `unzip -q -o "${zipPath}" -d "${extractTo}"`;

  try {
    await execAsync(command);
    console.log('Extraction completed.');
  } catch (error) {
    throw new Error(`Failed to extract zip: ${error}`);
  }
}

async function main() {
  // Create assets directory if it doesn't exist
  if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
  }

  // Check if language server DLL already exists
  const dllPath = path.join(LANG_SERVER_DIR, 'Bicep.LangServer.dll');
  if (fs.existsSync(dllPath)) {
    console.log('Bicep Language Server DLL already exists. Skipping download.');
    return;
  }

  try {
    // Download bicep-langserver.zip
    await downloadFile(DOWNLOAD_URL, ZIP_FILE);

    // Extract the zip
    await extractZip(ZIP_FILE, LANG_SERVER_DIR);

    // Clean up zip file
    fs.unlinkSync(ZIP_FILE);
    console.log('Cleaned up zip file.');

    // Verify the DLL exists
    if (!fs.existsSync(dllPath)) {
      throw new Error(`Expected DLL not found at ${dllPath}`);
    }

    console.log('Bicep Language Server downloaded and extracted successfully.');
    console.log(`DLL location: ${dllPath}`);
  } catch (error) {
    console.error('Error downloading or extracting Language Server:', error);
    process.exit(1);
  }
}

main();
