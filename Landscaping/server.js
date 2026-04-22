import express from 'express';
import compression from 'compression';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Force Gzip compression on all dynamically served textual/image assets
app.use(compression());

// Check if production build exists, fallback to raw folder if somehow failed
const distPath = join(__dirname, 'dist');
const servePath = fs.existsSync(distPath) ? distPath : __dirname;

// Serve statically with explicit caching disabled to ensure immediate deployment propagation on CDNs
app.use(express.static(servePath, {
    etag: true
}));

// Route standard entry points
app.get('*', (req, res) => {
  res.sendFile(join(servePath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Production optimized server listening on port ${PORT} serving from ${servePath}`);
});
