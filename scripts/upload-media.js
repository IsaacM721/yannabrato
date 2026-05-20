const admin = require('firebase-admin');
const path = require('path');
const fs = require('fs');

const serviceAccount = require('../yannabratoo-firebase-adminsdk-fbsvc-7cf79497fc.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'yannabratoo.firebasestorage.app',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function uploadFile(localPath, storagePath) {
    await bucket.upload(localPath, {
        destination: storagePath,
        metadata: { cacheControl: 'public,max-age=31536000' },
    });
    const file = bucket.file(storagePath);
    await file.makePublic();
    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/yannabratoo.firebasestorage.app/o/${encodeURIComponent(storagePath)}?alt=media`;
    return publicUrl;
}

async function run() {
    const root = path.join(__dirname, '..');

    // 1. Premios ADOPRESCI — premios-1.jpeg as thumbnail
    console.log('Uploading premios-1.jpeg...');
    const premiosUrl = await uploadFile(
        path.join(root, 'premios-1.jpeg'),
        'thumbnails/premios-adopresci.jpeg'
    );
    await db.collection('projects').doc('IZt8BKKd2SzCN4Mrgc79').update({
        thumbnail: premiosUrl,
        updatedAt: new Date().toISOString(),
    });
    console.log('✅ Premios ADOPRESCI thumbnail:', premiosUrl);

    // 2. Festival del Minuto del Agua — festival-del-agua.MOV as videoUrl
    console.log('Uploading festival-del-agua.MOV...');
    const aguaUrl = await uploadFile(
        path.join(root, 'festival-del-agua.MOV'),
        'videos/festival-del-agua.MOV'
    );
    await db.collection('projects').doc('19hvxti3RIHPxUfC7GWs').update({
        videoUrl: aguaUrl,
        updatedAt: new Date().toISOString(),
    });
    console.log('✅ Festival del Agua videoUrl:', aguaUrl);

    // 3. Caribbean Cinemas — Postproducción — postproduccion-carribean-cinemas.mp4 as videoUrl
    console.log('Uploading postproduccion-carribean-cinemas.mp4...');
    const caribbeanUrl = await uploadFile(
        path.join(root, 'postproduccion-carribean-cinemas.mp4'),
        'videos/postproduccion-carribean-cinemas.mp4'
    );
    await db.collection('projects').doc('mqhLaoNRHx6MTlARBESn').update({
        videoUrl: caribbeanUrl,
        updatedAt: new Date().toISOString(),
    });
    console.log('✅ Caribbean Cinemas — Postproducción videoUrl:', caribbeanUrl);

    console.log('\nDone.');
    process.exit(0);
}

run().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
