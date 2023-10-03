// Install necessary dependencies:
// npm install firebase
// npm install @firebase/auth
// npm install @firebase/firestore

import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Initialize Firebase with your Firebase config
const firebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

function ChatApp() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Sign-in with Firebase Authentication
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        loadMessages();
      } else {
        setUser(null);
      }
    });
  }, []);

  const loadMessages = async () => {
    // Load messages from Firebase Firestore
    const messageRef = db.collection('messages');
    const query = messageRef.orderBy('timestamp');

    query.onSnapshot((snapshot) => {
      const messageList = snapshot.docs.map((doc) => doc.data());
      setMessages(messageList);
    });
  };

  const sendMessage = async () => {
    if (message.trim() === '') return;

    // Save message to Firebase Firestore
    await db.collection('messages').add({
      text: message,
      user: user.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });

    setMessage('');
  };

  const handleSignOut = () => {
    auth.signOut();
  };

  return (
    <div>
      {user ? (
        <div>
          <button onClick={handleSignOut}>Sign Out</button>
          <div>
            {messages.map((msg) => (
              <div key={msg.timestamp}>{msg.text}</div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      ) : (
        <button onClick={signInWithGoogle}>Sign In with Google</button>
      )}
    </div>
  );
}

export default ChatApp;
