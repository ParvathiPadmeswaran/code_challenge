const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.sendMessage = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snapshot, context) => {
    const message = snapshot.data();
    const recipientUid = message.receiverUid;
    const senderName = message.senderName;

    const payload = {
      notification: {
        title: `${senderName} sent you a message`,
        body: message.text,
      },
    };

    const options = {
      priority: "high",
    };

    try {
      const response = await admin.messaging().sendToTopic(recipientUid, payload, options);
      console.log("Notification sent:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });
