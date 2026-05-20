const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const serviceAccount = require('../yannabratoo-firebase-adminsdk-fbsvc-7cf79497fc.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), storageBucket: 'yannabratoo.firebasestorage.app' });

const db = admin.firestore();
const bucket = admin.storage().bucket();

const LOCAL_THUMB = '/tmp/leton-pe-thumb.jpg';
const DEST = 'thumbnails/el-leton-pe.jpg';
const PUBLIC_URL = 'https://firebasestorage.googleapis.com/v0/b/yannabratoo.firebasestorage.app/o/thumbnails%2Fel-leton-pe.jpg?alt=media';

async function run() {
    if (!fs.existsSync(LOCAL_THUMB)) {
        throw new Error('Thumbnail not found at ' + LOCAL_THUMB);
    }

    console.log('Uploading thumbnail to Firebase Storage...');
    await bucket.upload(LOCAL_THUMB, {
        destination: DEST,
        metadata: { contentType: 'image/jpeg', cacheControl: 'public,max-age=31536000' },
    });
    await bucket.file(DEST).makePublic();
    console.log('Uploaded:', PUBLIC_URL);

    console.log('Creating Firestore document...');
    const docRef = await db.collection('projects').add({
        title: 'El Leton PE',
        slug: 'el-leton-pe',
        category: 'Dirección creativa & coreografía',
        year: '2026',
        description: 'BTS de mi trabajo como coreógrafa para el Tour de Leton PE',
        thumbnail: PUBLIC_URL,
        thumbnailPoster: '',
        videoUrl: 'https://www.instagram.com/reel/DX0LGPrJhOlrKEba_LcEOHJXHm8Enkx2sLO96M0/',
        credits: [],
        gallery: [],
        published: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    console.log('✅ Project created with ID:', docRef.id);
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
