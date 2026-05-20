const admin = require('firebase-admin');
const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');

const serviceAccount = require('../yannabratoo-firebase-adminsdk-fbsvc-7cf79497fc.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), storageBucket: 'yannabratoo.firebasestorage.app' });

const db = admin.firestore();
const bucket = admin.storage().bucket();

const thumbnailUrl = 'https://scontent.cdninstagram.com/v/t51.71878-15/551175877_1269276671618176_6954746804768318859_n.jpg?stp=cmp1_dst-jpg_e35_s640x640_tt6&_nc_cat=102&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=PZC4P5_gragQ7kNvwH6MgrF&_nc_oc=AdpDBQ4hs2GhE-mnAcIlknrDcPPdfSpi8p_1PmGJsdrQ2gohS3gmsomQANyJQxhhgjfTWwc4P3LhDuuwfUGCwBK7&_nc_zt=23&_nc_ht=scontent.cdninstagram.com&_nc_gid=9JXiXcGrKRZsYUPKdaBksA&_nc_ss=7260f&oh=00_Af6lfpESEQipBVnIbLMZ-GMKN2bQD-_I0PTSvp7MohFjKg&oe=6A13E123';

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                downloadFile(res.headers.location, dest).then(resolve).catch(reject);
                return;
            }
            res.pipe(file);
            file.on('finish', () => file.close(resolve));
        }).on('error', err => { fs.unlink(dest, () => {}); reject(err); });
    });
}

async function run() {
    const tmpPath = path.join(os.tmpdir(), 'documental-behind-thumbnail.jpg');

    console.log('Downloading Instagram thumbnail...');
    await downloadFile(thumbnailUrl, tmpPath);
    console.log('Downloaded to', tmpPath);

    console.log('Uploading to Firebase Storage...');
    await bucket.upload(tmpPath, {
        destination: 'thumbnails/documental-behind-the-scenes.jpg',
        metadata: { cacheControl: 'public,max-age=31536000' },
    });
    await bucket.file('thumbnails/documental-behind-the-scenes.jpg').makePublic();
    const publicUrl = 'https://firebasestorage.googleapis.com/v0/b/yannabratoo.firebasestorage.app/o/thumbnails%2Fdocumental-behind-the-scenes.jpg?alt=media';
    console.log('Uploaded:', publicUrl);

    await db.collection('projects').doc('yFFYDdFLZ7OFcjuoIjpq').update({
        thumbnail: publicUrl,
        videoUrl: 'https://www.instagram.com/reel/DOxDqPmjBFX/',
        updatedAt: new Date().toISOString(),
    });
    console.log('✅ Firestore updated for Documental Behind the Scenes');

    fs.unlinkSync(tmpPath);
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
