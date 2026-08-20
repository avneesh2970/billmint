// Runner script for BillMint Microservices
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('⚡ Starting BillMint Microservices Suite...');

const gateway = spawn('node', [path.join(__dirname, 'api-gateway/index.js')], { stdio: 'inherit' });

gateway.on('close', (code) => {
  console.log(`API Gateway exited with code ${code}`);
});
