"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { firestore, storage } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import Sidebar from "../sidebar";

export default function Recent() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status, session]);

  useEffect(() => {
    if (user) {
      if (user.id) {
        setUserId(user.id);
      } else {
        setUserId(user.name);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchImages = async () => {
      if (!userId) return;

      const imagesRef = collection(firestore, `users/${userId}/images`);
      const imageDocs = await getDocs(imagesRef);
      const imageUrls = [];

      for (let doc of imageDocs.docs) {
        const imageUrl = doc.data().url;
        imageUrls.push(imageUrl);
      }

      setEntries(imageUrls);
      setLoading(false);
    };

    fetchImages();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex-1">
        <Sidebar />
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Recent Uploads</h1>
            <div className="flex items-center justify-center">
                <p className="text-lg">Loading...</p>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Sidebar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Recent Uploads</h1>
        {entries.length > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {entries.map((url, index) => (
              <div key={index} className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p>No images found.</p>
        )}
      </div>
    </div>
  );
}