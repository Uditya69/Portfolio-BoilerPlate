"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminContactPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(messagesData);
    } catch (err) {
      console.error("Error fetching messages:", err);
      toast.error("Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "messages", id), { read: true });
      toast.success("Message marked as read");
      fetchMessages();
    } catch (error) {
      toast.error("Failed to update message");
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteDoc(doc(db, "messages", id));
        toast.success("Message deleted successfully");
        fetchMessages();
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contact Messages</h1>
        <div className="text-sm text-muted-foreground">
          Total Messages: {messages.length}
        </div>
      </div>

      <div className="grid gap-4">
        {messages.map((message) => (
          <Card
            key={message.id}
            className={message.read ? "opacity-75" : "border-primary"}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{message.subject}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    From: {message.name} ({message.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(message.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {!message.read && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(message.id)}
                    >
                      Mark as Read
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(message.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line">{message.message}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 