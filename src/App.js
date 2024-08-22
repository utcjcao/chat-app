// App.js
import React, { useState, useEffect } from "react";
import { firestore, firebase } from "./Firebase"; // Import Firestore instance

function App() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limitToLast(25);

    // Real-time listener for Firestore collection
    const unsubscribe = query.onSnapshot((snapshot) => {
      const messagesList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(messagesList);
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      await firestore.collection("messages").add({
        text: newMessage,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setNewMessage(""); // Clear input field
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <ul>
        {messages.map((msg) => (
          <li key={msg.id}>
            <strong>{msg.createdAt?.toDate().toLocaleString()}: </strong>
            {msg.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default App;
