// functions/index.js
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getMessaging } = require('firebase-admin/messaging');
const { getFirestore } = require('firebase-admin/firestore');

initializeApp();

// ── Trigger: jab bhi /notifications mein naya doc add ho ──
exports.sendPushOnNotification = onDocumentCreated(
    'notifications/{notifId}',
    async (event) => {
        const data = event.data?.data();
        if (!data) return;

        const { title, body } = data;
        const db = getFirestore();

        // Sab FCM tokens fetch karo
        const tokensSnap = await db.collection('fcm_tokens').get();
        if (tokensSnap.empty) {
            console.log('No FCM tokens found');
            return;
        }

        const tokens = tokensSnap.docs.map(d => d.data().token).filter(Boolean);
        console.log(`Sending push to ${tokens.length} devices`);

        const messaging = getMessaging();
        const BATCH_SIZE = 500;

        for (let i = 0; i < tokens.length; i += BATCH_SIZE) {
            const batch = tokens.slice(i, i + BATCH_SIZE);
            try {
                const response = await messaging.sendEachForMulticast({
                    tokens: batch,
                    notification: {
                        title: title || 'Royal Computers',
                        body: body || 'New notification',
                    },
                    webpush: {
                        notification: {
                            title: title || 'Royal Computers',
                            body: body || 'New notification',
                            icon: '/logo192.png',
                            badge: '/logo192.png',
                            vibrate: [200, 100, 200],
                            requireInteraction: false,
                        },
                        fcmOptions: {
                            link: 'https://spt-royal-computers.vercel.app',
                        },
                    },
                    android: {
                        notification: {
                            title: title || 'Royal Computers',
                            body: body || 'New notification',
                            color: '#22c55e',
                            sound: 'default',
                        },
                    },
                    apns: {
                        payload: {
                            aps: {
                                alert: { title, body },
                                sound: 'default',
                                badge: 1,
                            },
                        },
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
                        ) {
                            toDelete.push(batch[idx]);
                        }
                    }
                });

                if (toDelete.length > 0) {
                    const delBatch = db.batch();
                    toDelete.forEach(t => delBatch.delete(db.collection('fcm_tokens').doc(t)));
                    await delBatch.commit();
                    console.log(`Removed ${toDelete.length} invalid tokens`);
                }

            } catch (err) {
                console.error('Error sending batch:', err);
            }
        }
    }
);