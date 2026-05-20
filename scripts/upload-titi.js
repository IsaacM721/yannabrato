const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('../yannabratoo-firebase-adminsdk-fbsvc-7cf79497fc.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount), storageBucket: 'yannabratoo.firebasestorage.app' });

const db = admin.firestore();
const bucket = admin.storage().bucket();

async function run() {
    console.log('Uploading titi-me-pregunto.png...');
    await bucket.upload(path.join(__dirname, '../titi-me-pregunto.png'), {
        destination: 'thumbnails/titi-me-pregunto.png',
        metadata: { cacheControl: 'public,max-age=31536000' },
    });
    await bucket.file('thumbnails/titi-me-pregunto.png').makePublic();
    const publicUrl = 'https://firebasestorage.googleapis.com/v0/b/yannabratoo.firebasestorage.app/o/thumbnails%2Ftiti-me-pregunto.png?alt=media';
    console.log('Uploaded:', publicUrl);

    await db.collection('projects').doc('oKalHmpB4rQgNO6J9Ncl').update({
        thumbnail: publicUrl,
        videoUrl: 'https://www.instagram.com/tv/CfpfHV7FSA5a50wOy4Vzz3pVx321J2r0DfK8ZE0/',
        updatedAt: new Date().toISOString(),
    });
    console.log('✅ Firestore updated for Tití Me Preguntó');
    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
