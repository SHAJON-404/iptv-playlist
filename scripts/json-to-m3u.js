/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

console.log('-'.repeat(80));
console.log('[+] IPTV Channel Converter (JSON <-> M3U)');
console.log('-'.repeat(80));

// Helper function to convert M3U to JSON
function parseM3UToJSON(inputPath, outputPath) {
    console.log(`[+] Input M3U:  ${inputPath}`);
    console.log(`[+] Output JSON: ${outputPath}`);

    if (!fs.existsSync(inputPath)) {
        console.error(`[-] Error: Input file does not exist at "${inputPath}"`);
        return false;
    }

    try {
        const rawData = fs.readFileSync(inputPath, 'utf8');
        const lines = rawData.split(/\r?\n/);

        const channels = [];
        let currentChannel = null;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;

            if (line.startsWith('#EXTM3U')) {
                continue;
            }

            if (line.startsWith('#EXTINF:')) {
                if (currentChannel && !currentChannel.url) {
                    console.warn(`[-] Warning: Channel "${currentChannel.name || 'Unnamed'}" is missing a URL. Skipping.`);
                }
                
                currentChannel = {};
                
                // Parse attributes
                const logoMatch = line.match(/(?:tvg-logo|logo)="([^"]+)"/i);
                if (logoMatch) currentChannel.logo = logoMatch[1];

                const groupMatch = line.match(/(?:group-title|tvg-group|group)="([^"]+)"/i);
                if (groupMatch) currentChannel.group = groupMatch[1];
                
                const idMatch = line.match(/(?:tvg-id|id)="([^"]+)"/i);
                if (idMatch) currentChannel.id = idMatch[1];

                const commaIndex = line.lastIndexOf(",");
                if (commaIndex !== -1) {
                    currentChannel.name = line.substring(commaIndex + 1).trim();
                } else {
                    currentChannel.name = "Unnamed Channel";
                }
                continue;
            }

            if (line.startsWith('#EXTVLCOPT:')) {
                if (currentChannel) {
                    const opt = line.substring('#EXTVLCOPT:'.length).trim();
                    const eqIndex = opt.indexOf('=');
                    if (eqIndex !== -1) {
                        const key = opt.substring(0, eqIndex).toLowerCase();
                        const val = opt.substring(eqIndex + 1);
                        if (key === 'http-referrer') {
                            currentChannel.referer = val;
                        } else if (key === 'http-origin') {
                            currentChannel.origin = val;
                        } else if (key === 'http-user-agent') {
                            if (!currentChannel.customHeaders) {
                                currentChannel.customHeaders = {};
                            }
                            currentChannel.customHeaders['user-agent'] = val;
                        } else {
                            if (!currentChannel.customHeaders) {
                                currentChannel.customHeaders = {};
                            }
                            currentChannel.customHeaders[key] = val;
                        }
                    }
                }
                continue;
            }

            if (line.startsWith('#')) {
                continue;
            }

            // It's a URL line
            if (currentChannel) {
                currentChannel.url = line;
                channels.push(currentChannel);
                currentChannel = null;
            } else {
                channels.push({
                    name: line.split('/').pop() || 'Unnamed Channel',
                    url: line,
                    logo: "",
                    group: "Custom"
                });
            }
        }

        if (currentChannel && !currentChannel.url) {
            console.warn(`[-] Warning: Channel "${currentChannel.name || 'Unnamed'}" has no URL at the end of the file. Skipping.`);
        }

        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(channels, null, 4), 'utf8');

        console.log(`[+] Success! JSON playlist generated at: "${outputPath}"`);
        console.log(`[+] Total channels in JSON: ${channels.length}`);
        console.log('-'.repeat(80));
        return true;
    } catch (error) {
        console.error(`[-] Conversion failed for "${inputPath}" with error:`);
        console.error(error.message);
        console.log('-'.repeat(80));
        return false;
    }
}

// Helper function to convert a single JSON channel list to M3U
function convertFile(inputPath, outputPath) {
    console.log(`[+] Input JSON:  ${inputPath}`);
    console.log(`[+] Output M3U: ${outputPath}`);

    if (!fs.existsSync(inputPath)) {
        console.error(`[-] Error: Input file does not exist at "${inputPath}"`);
        return false;
    }

    try {
        const rawData = fs.readFileSync(inputPath, 'utf8');
        const channels = JSON.parse(rawData);

        if (!Array.isArray(channels)) {
            throw new Error('JSON root element must be an array of channel objects.');
        }

        console.log(`[+] Found ${channels.length} channels. Converting...`);

        const m3uLines = ['#EXTM3U'];

        channels.forEach((channel, index) => {
            if (!channel.url) {
                console.warn(`[-] Warning: Channel at index ${index} ("${channel.name || 'Unnamed'}") has no URL. Skipping.`);
                return;
            }

            if (channel.type === 'dash') {
                return;
            }

            let extinf = '#EXTINF:-1';

            if (channel.id) {
                extinf += ` tvg-id="${channel.id}"`;
            }
            if (channel.logo) {
                extinf += ` tvg-logo="${channel.logo}"`;
            }

            const group = channel.group || channel.category;
            if (group) {
                extinf += ` group-title="${group}"`;
            }

            extinf += `,${channel.name || 'Unnamed Channel'}`;

            m3uLines.push(extinf);

            // Extract User-Agent from multiple possible fields
            const userAgent = channel['user-agent'] || channel.userAgent || (channel.customHeaders && channel.customHeaders['user-agent']);

            // Extract Origin from multiple possible fields
            const origin = channel.origin || (channel.customHeaders && channel.customHeaders.origin);

            // If custom headers or options exist, add VLC options for compatibility
            if (channel.referer) {
                m3uLines.push(`#EXTVLCOPT:http-referrer=${channel.referer}`);
            }
            if (origin) {
                m3uLines.push(`#EXTVLCOPT:http-origin=${origin}`);
            }
            if (userAgent) {
                m3uLines.push(`#EXTVLCOPT:http-user-agent=${userAgent}`);
            } else if (channel.referer || origin) {
                m3uLines.push(`#EXTVLCOPT:http-user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/149.0.0.0 Safari/537.36`);
            }

            // Write all other customHeaders that are not user-agent or origin or referer
            if (channel.customHeaders) {
                Object.keys(channel.customHeaders).forEach(headerKey => {
                    const normalizedKey = headerKey.toLowerCase();
                    if (normalizedKey !== 'user-agent' && normalizedKey !== 'origin' && normalizedKey !== 'referer') {
                        m3uLines.push(`#EXTVLCOPT:${headerKey}=${channel.customHeaders[headerKey]}`);
                    }
                });
            }

            m3uLines.push(channel.url);
        });

        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, m3uLines.join('\n') + '\n', 'utf8');

        console.log(`[+] Success! M3U playlist generated at: "${outputPath}"`);
        console.log(`[+] Total channels in M3U: ${channels.filter(c => c.url && c.type !== 'dash').length}`);
        console.log('-'.repeat(80));
        return true;
    } catch (error) {
        console.error(`[-] Conversion failed for "${inputPath}" with error:`);
        console.error(error.message);
        console.log('-'.repeat(80));
        return false;
    }
}

// Check if specific input/output arguments are provided via CLI
if (process.argv[2]) {
    const inputPath = path.resolve(process.argv[2]);
    const isM3UInput = inputPath.toLowerCase().endsWith('.m3u');
    
    let outputPath;
    if (process.argv[3]) {
        outputPath = path.resolve(process.argv[3]);
    } else {
        outputPath = isM3UInput 
            ? inputPath.replace(/\.m3u$/i, '.json') 
            : inputPath.replace(/\.json$/i, '.m3u');
    }

    const success = isM3UInput 
        ? parseM3UToJSON(inputPath, outputPath) 
        : convertFile(inputPath, outputPath);
        
    process.exit(success ? 0 : 1);
} else {
    // Otherwise, default to converting all .json files in app/data/
    const dataDir = path.join(__dirname, '../app/data');
    if (!fs.existsSync(dataDir)) {
        console.error(`[-] Error: Data directory does not exist at "${dataDir}"`);
        process.exit(1);
    }

    const files = fs.readdirSync(dataDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    if (jsonFiles.length === 0) {
        console.log('[-] No JSON files found in app/data/');
        process.exit(0);
    }

    console.log(`[+] Found ${jsonFiles.length} JSON file(s) in app/data/`);
    console.log('-'.repeat(80));

    let allSuccess = true;
    jsonFiles.forEach(file => {
        const inputPath = path.join(dataDir, file);
        const outputPath = path.join(dataDir, file.replace(/\.json$/i, '.m3u'));
        const success = convertFile(inputPath, outputPath);
        if (!success) {
            allSuccess = false;
        }
    });

    process.exit(allSuccess ? 0 : 1);
}