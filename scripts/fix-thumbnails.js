const admin = require('firebase-admin');
const serviceAccount = require('../yannabratoo-firebase-adminsdk-fbsvc-7cf79497fc.json');

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function run() {
    const now = new Date().toISOString();

    // Festival del Agua — set thumbnail = videoUrl so index card shows the video
    await db.collection('projects').doc('19hvxti3RIHPxUfC7GWs').update({
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/yannabratoo.firebasestorage.app/o/videos%2Ffestival-del-agua.MOV?alt=media',
        updatedAt: now,
    });
    console.log('✅ Festival del Agua thumbnail set');

    // Caribbean Cinemas — Postproducción — set thumbnail = videoUrl
    await db.collection('projects').doc('mqhLaoNRHx6MTlARBESn').update({
        thumbnail: 'https://firebasestorage.googleapis.com/v0/b/yannabratoo.firebasestorage.app/o/videos%2Fpostproduccion-carribean-cinemas.mp4?alt=media',
        updatedAt: now,
    });
    console.log('✅ Caribbean Cinemas thumbnail set');

    // Premios ADOPRESCI — thumbnailPosition top
    await db.collection('projects').doc('IZt8BKKd2SzCN4Mrgc79').update({
        thumbnailPosition: 'top',
        updatedAt: now,
    });
    console.log('✅ Premios ADOPRESCI thumbnailPosition = top');

    process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
