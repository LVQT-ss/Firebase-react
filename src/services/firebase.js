// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// sign in with google 
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp,
    onSnapshot,
    query,
    orderBy,
} from 'firebase/firestore';

async function loginWithGoogle() {
    try {
        const provider = new GoogleAuthProvider();
        const auth = getAuth();

        const { user } = await signInWithPopup(auth, provider);

        return { uid: user.uid, displayName: user.displayName };
    } catch (error) {
        if (error.code !== 'auth/cancelled-popup-request') {
            console.error(error);
        }

        return null;
    }
}

async function sendMessage(roomId, user, text) {
    try {
        await addDoc(collection(db, 'chat-rooms', roomId, 'messages'), {
            uid: user.uid,
            displayName: user.displayName,
            text: text.trim(),
            timestamp: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}

function getMessages(roomId, callback) {
    return onSnapshot(
        query(
            collection(db, 'chat-rooms', roomId, 'messages'),
            orderBy('timestamp', 'asc')
        ),
        (querySnapshot) => {
            const messages = querySnapshot.docs.map((x) => ({
                id: x.id,
                ...x.data(),
            }));

            callback(messages);
        }
    );
}

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDs0G67b-hgtCGzum4hEm4S3Ge5Up2YBxg",
    authDomain: "reactchat-be688.firebaseapp.com",
    projectId: "reactchat-be688",
    storageBucket: "reactchat-be688.firebasestorage.app",
    messagingSenderId: "1080867005274",
    appId: "1:1080867005274:web:b2c32b102a178ae4c74963"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);



export { db, auth, loginWithGoogle, sendMessage, getMessages };
export default app;