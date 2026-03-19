// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const { initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

// ── Helper: send push to all FCM tokens ──────────────────────
async function sendToAll(db, messaging, title, body, link) {
    const tokensSnap = await db.collection('fcm_tokens').get();
    if (tokensSnap.empty) { console.log('No tokens'); return; }

    const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean);
    console.log(`Sending to ${tokens.length} devices: ${title}`);

    const BATCH = 500;
    for (let i = 0; i < tokens.length; i += BATCH) {
        const batch = tokens.slice(i, i + BATCH);
        try {
            const response = await messaging.sendEachForMulticast({
                tokens: batch,
                notification: { title, body },
                webpush: {
                    notification: {
                        title, body,
                        icon: '/logo192.png',
                        badge: '/logo192.png',
                        vibrate: [200, 100, 200],
                        requireInteraction: false,
                    },
                    fcmOptions: { link: link || 'https://spt-royal-computers.vercel.app' },
                },
                android: {
                    notification: { title, body, color: '#22c55e', sound: 'default' },
                },
                apns: {
                    payload: { aps: { alert: { title, body }, sound: 'default', badge: 1 } },
                },
            });

            console.log(`Batch ${i}: ${response.successCount} ok, ${response.failureCount} failed`);

            // Remove invalid tokens
            const toDelete = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    const code = resp.error?.code;
                    if (
                        code === 'messaging/invalid-registration-token' ||
                        code === 'messaging/registration-token-not-registered'
                    ) toDelete.push(batch[idx]);
                }
            });
            if (toDelete.length > 0) {
                const del = db.batch();
                toDelete.forEach(t => del.delete(db.collection('fcm_tokens').doc(t)));
                await del.commit();
                console.log(`Removed ${toDelete.length} invalid tokens`);
            }
        } catch (err) {
            console.error('Batch error:', err);
        }
    }
}

// ── 1. Send push when admin adds notification ─────────────────
exports.sendPushOnNotification = onDocumentCreated(
    'notifications/{notifId}',
    async (event) => {
        const data = event.data?.data();
        if (!data) return;
        const db = getFirestore();
        const messaging = getMessaging();
        await sendToAll(db, messaging, data.title, data.body);
    }
);

// ── 2. Exam Auto-Reminder — runs every day at 9:00 AM IST ─────
exports.examDeadlineReminder = onSchedule(
    {
        schedule: '30 3 * * *',   // 3:30 UTC = 9:00 AM IST
        timeZone: 'Asia/Kolkata',
    },
    async () => {
        const db = getFirestore();
        const messaging = getMessaging();

        const now = new Date();
        const in7days = new Date(now.getTime() + 7 * 24 * 3600 * 1000);
        const in1day = new Date(now.getTime() + 1 * 24 * 3600 * 1000);
        const today = new Date(now.getTime());

        // Format date helper
        const fmt = (d) => d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

        // Fetch all exams
        const examsSnap = await db.collection('exams').get();
        if (examsSnap.empty) { console.log('No exams'); return; }

        for (const examDoc of examsSnap.docs) {
            const exam = examDoc.data();
            if (!exam.lastDate || !exam.name) continue;
            if (exam.status === 'closed') continue;

            const lastDate = new Date(exam.lastDate);
            const diffMs = lastDate - now;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

            let title = null;
            let body = null;

            if (diffDays === 7) {
                title = `⏰ 7 Days Left — ${exam.name}`;
                body = `Last date to apply: ${fmt(lastDate)}. Apply now at Royal Computers!`;
            } else if (diffDays === 3) {
                title = `🚨 Only 3 Days Left — ${exam.name}`;
                body = `Deadline: ${fmt(lastDate)}. Don't miss it — visit Royal Computers today!`;
            } else if (diffDays === 1) {
                title = `🔴 TOMORROW is the Last Date — ${exam.name}`;
                body = `Last date: ${fmt(lastDate)}. Apply TODAY at Royal Computers!`;
            } else if (diffDays === 0) {
                title = `🚨 TODAY is the Last Date — ${exam.name}`;
                body = `Final day to apply for ${exam.name}. Visit Royal Computers NOW!`;
            }

            if (title && body) {
                console.log(`Sending reminder for: ${exam.name} (${diffDays} days left)`);
                await sendToAll(
                    db, messaging, title, body,
                    'https://spt-royal-computers.vercel.app/exams'
                );
                // Small delay between exams to avoid rate limits
                await new Promise(r => setTimeout(r, 1000));
            }
        }

        console.log('Exam deadline check complete');
    }
);