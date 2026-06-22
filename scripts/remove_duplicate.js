const fs = require('fs/promises');
const path = require('path');

async function removeDuplicates() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node remove_duplicate.js <path-to-json-file>');
    process.exit(1);
  }
  const filePath = path.resolve(args[0]);

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);

    console.log(`Original count: ${data.length} channels.`);

    const uniqueChannels = [];
    const seenKeys = new Set();
    const duplicates = [];

    /**
     * Normalize a URL for comparison:
     * - Trim whitespace, lowercase
     * - Strip trailing '?' or '&'
     */
    function normalizeUrl(rawUrl) {
      return rawUrl.trim().toLowerCase().replace(/[?&]+$/, '');
    }

    for (const channel of data) {
      const rawUrl = (channel.url || channel.link || '').trim();
      const kid = (channel.kid || '').trim().toLowerCase();
      const key = (channel.key || '').trim().toLowerCase();

      if (!rawUrl) {
        // If there's no URL/link at all, keep it
        uniqueChannels.push(channel);
        continue;
      }

      let compositeKey;

      if (kid && key) {
        // DASH / Shaka Player streams: same kid+key = same content regardless of CDN URL
        compositeKey = `drm|${kid}|${key}`;
      } else {
        // HLS / TS streams: deduplicate by normalized URL
        compositeKey = `url|${normalizeUrl(rawUrl)}`;
      }

      if (seenKeys.has(compositeKey)) {
        duplicates.push(channel.name || 'Unknown');
        continue;
      }

      seenKeys.add(compositeKey);
      uniqueChannels.push(channel);
    }

    if (duplicates.length > 0) {
      await fs.writeFile(filePath, JSON.stringify(uniqueChannels, null, 4), 'utf8');
      console.log(`\nRemoved ${duplicates.length} duplicate channels:`);
      duplicates.forEach((name, i) => console.log(`  ${i + 1}. ${name}`));
      console.log(`\nDeduplicated count: ${uniqueChannels.length} channels.`);
      console.log(`Saved changes back to ${filePath}`);
    } else {
      console.log('No duplicate channels found.');
    }

  } catch (err) {
    console.error('Error processing file:', err);
  }
}

removeDuplicates();
