"use client";

import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore, storage, ref, uploadBytes, getDownloadURL } from "../firebase";
import { collection, query, getDocs, where, doc, setDoc, deleteDoc, getDoc, addDoc,updateDoc } from "firebase/firestore";
import { useEffect, useState, useRef } from "react";
import { update } from "firebase/database";
import { useSession, signIn } from "next-auth/react";
import { getUserSession } from '../../lib/session'
import Sidebar from "../sidebar";
import OpenAI from "openai";
import { Camera } from "react-camera-pro";

export default function Home() {;
  const [pantry, setPantry] = useState([]);
  const [openCameraModal, setOpenCameraModal] = useState(false);
  const handleCameraModalOpen = () => setOpenCameraModal(true);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [newItem, setNewItem] = useState({ name: "", quantity: "", expiryDate: "" });
  const [searchParam, setSearchParam] = useState("");
  const [param, setParam] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pantryItems, setPantryItems] = useState([]);
  const [currDate, setCurrDate] = useState(new Date());
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState(null);
  const camera = useRef(null);
  const [numberOfCameras, setNumberOfCameras] = useState(0);
  const [image, setImage] = useState(null);
  const [facingMode, setFacingMode] = useState("environment");                              
  const videoConstraints = {
    facingMode: "environment",
  };

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status, session]);

  const style = {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'white',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
    gap: 1,
  };

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const search = (param) => {
    if (!param) {
      setSearchParam("");
    } else {
      setSearchParam(param);
    }
  }
    
  const handleCameraModalClose = () => {
    setOpenCameraModal(false);
  };

  const captureImage = async () => {
    const photo = camera.current.takePhoto();
    const storageRef = ref(storage, `users/${userId}/images/${Date.now()}.jpg`);

    try {
      const snapshot = await uploadBytes(storageRef, dataURLtoBlob(photo));
      const downloadURL = await getDownloadURL(snapshot.ref);

      await addDoc(collection(firestore, `users/${userId}/images`), {
        url: downloadURL,
        timestamp: new Date()
      });

      alert('Image uploaded successfully!');
      // console.log('Image URL:', downloadURL);
      handleCameraModalClose();

      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVision: true, imageUrl: downloadURL }),
      });

      const result = await response.json();
      const UserexpiryDate = prompt("Enter the expiry date for this item (DD-MM-YYYY):");
      if (!UserexpiryDate || !/^\d{2}-\d{2}-\d{4}$/.test(UserexpiryDate)) {
        alert("Invalid Format. DD-MM-YYYY.");
      }
      const [day, month, year] = UserexpiryDate.split('-').map(Number);
      const expiryDate = new Date(year, month - 1, day);
      const curr = new Date();
      curr.setHours(0, 0, 0, 0);
    
      if (expiryDate < curr) {
        alert("Expiry date cannot be a past date.");
      } else {
        // console.log('Vision API result:', result);
        const json_data = JSON.parse( result.visionResult);
        // console.log(json_data);
        await addDoc(collection(firestore, `users/${userId}/pantry`), {
          name: json_data.name,
          quantity: 1,
          expiryDate: UserexpiryDate,
        });
        updatePantry(); 
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      handleCameraModalClose();
    }
  };

  const dataURLtoBlob = (dataURL) => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const suggestRecipe = async (pantryItems) => {
    try {
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isVision:false, pantryItems }),
      });
  
      const data = await response.json();
      return data.suggestion 
    } catch (error) {
      console.error('Error:', error);
      return "Error fetching suggestion";
    }
  };
                                
  const handleSuggestRecipe = async () => {
    const result = await suggestRecipe(pantryItems);
    setResponse(result);
    
    if (session.user.id) {
      setUserId(session.user.id);
    } else {
      setUserId(session.user.name);
    }
    const userDocRef = doc(firestore, `users/${userId}`);
    const pantryRef = collection(userDocRef, 'pantry');
    const pantrySnapshot = await getDocs(pantryRef);
    const items = pantrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const userPantryItems = items.map(item => item.name).join(", ");
    const recipeData = {
      recipe: response,
      pantryItems: pantryItems,
      createdAt: new Date().toISOString()
    };
    const recipeCollectionRef = collection(firestore, `users/${userId}/recipes`);
    await addDoc(recipeCollectionRef, recipeData);
    alert("Recipe suggestion saved successfully.");
  };

  const addItem = async (itemName, itemQuantity, expiryDate) => {
    if (status === "authenticated") {
      if (session.user.id) {
        setUserId(session.user.id);
      } else {
        setUserId(session.user.name);
      }
  
      if (!itemName || !itemQuantity || !expiryDate) {
        console.error("Item name, quantity, and expiry date are required");
        return;
      }

      const parsedExpiryDate = parse(expiryDate, 'dd-MM-yyyy', new Date());
      const today = new Date();
      const formattedToday = format(today, 'dd-MM-yyyy');
  
      if (parsedExpiryDate < today) {
        alert(`The expiry date ${expiryDate} is before today's date ${formattedToday}`);
        return;
      }
  
      try {
        const itemData = {
          name: itemName,
          quantity: itemQuantity,
          expiryDate: expiryDate,
        };
  
        const pantryCollectionRef = collection(firestore, `users/${userId}/pantry`);
        const q = query(pantryCollectionRef, where("name", "==", itemName));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          querySnapshot.forEach(async (docSnap) => {
            const docRef = doc(firestore, `users/${userId}/pantry/${docSnap.id}`);
            const existingData = docSnap.data();
  
            await setDoc(docRef, {
              quantity: existingData.quantity + parseInt(itemQuantity, 10),
              expiryDate: expiryDate
            }, { merge: true });

            updatePantry();
          });
        } else {
          await addDoc(pantryCollectionRef, itemData);  
          updatePantry();
        }
      } catch (error) {
        console.error("Error adding/updating item: ", error);
      }
    } else {
      console.error("User not authenticated");
    }
  };

  const removeItem = async (itemName) => {
    if (!itemName) {
      console.error("Item name is required.");
      return;
    }
  
    try {
      if (session.user.id) {
        setUserId(session.user.id);
      } else {
        setUserId(session.user.name);
      }
      const pantryCollectionRef = collection(firestore, `users/${userId}/pantry`);
      const q = query(pantryCollectionRef, where("name", "==", itemName));
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          const docRef = doc(firestore, `users/${userId}/pantry/${docSnap.id}`);
          const data = docSnap.data();
  
          if (!data) {
            console.error(`No data found for item '${itemName}'.`);
            return;
          }
  
          const { quantity } = data;
  
          if (quantity <= 1) {
            await deleteDoc(docRef);
          } else {
            await updateDoc(docRef, { quantity: quantity - 1 });
            console.log(`Item '${itemName}' quantity updated.`);
          }
          await updatePantry();
        });
      } else {
        console.log("Item does not exist.");
      }
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };
  
  const updateItem = async (item, quantity) => {
    if (!item || !quantity) {
      console.error("Item name and quantity are required.");
      return;
    }

    try {
      if (session.user.id) {
        setUserId(session.user.id);
      } else {
        setUserId(session.user.name);
      }
      const pantryCollectionRef = collection(firestore, `users/${userId}/pantry`);
      const q = query(pantryCollectionRef, where("name", "==", item));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (docSnap) => {
          const docRef = doc(firestore, `users/${userId}/pantry/${docSnap.id}`);
          await setDoc(docRef, { quantity: parseInt(quantity, 10) }, { merge: true });
          updatePantry();
        });
      } else {
        console.log("Item does not exist.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const updatePantry = async () => {
    if (status === "authenticated") {
      if (session.user.id) {
        setUserId(session.user.id);
      } else {
        setUserId(session.user.name);
      }
      const userDocRef = doc(firestore, `users/${userId}`);
      const pantryRef = collection(userDocRef, 'pantry');
      const pantrySnapshot = await getDocs(pantryRef);
      const items = pantrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPantryItems(items);
    }
  };

  const filteredPantry = pantryItems.filter(({ name }) =>
    name.toLowerCase().includes(searchParam.toLowerCase())
  );

  useEffect(() => {
    if (status === "authenticated" && session) {
      const fetchPantryItems = async () => {
        try {
          if (session.user.id) {
            setUserId(session.user.id);
          } else {
            setUserId(session.user.name);
          }
          const userDocRef = doc(firestore, `users/${userId}`);
          const userDoc = await getDoc(userDocRef);

          if (userDoc) {
            const pantryRef = collection(userDocRef, 'pantry');
            const pantrySnapshot = await getDocs(pantryRef);
            const items = pantrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPantryItems(items);
          } else {
            console.log('No user document found');
          }
        } catch (error) {
          console.error('Error fetching pantry items:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchPantryItems();
    }
  }, [status, session, userId]);
  return (
    <div className="flex-1">
      <Sidebar />
      <main className="main flex justify-center items-center bg-gradient-to-b from-green-100 to-green-200">
        <div className="max-w-6xl mx-auto p-2">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <p className="text-lg mb-6 text-gray-600 p-8">Manage your pantry items with ease. Add, update, remove, and search your pantry items all in one place.</p>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add New Item</h2>
                <input
                  type="text"
                  placeholder="Name"
                  value={pantryItems.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={pantryItems.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  className="w-full p-3 mb-2 border border-gray-300 rounded-lg"
                />
                <input
                  type="date"
                  placeholder="Expiry Date"
                  value={pantryItems.expiryDate}
                  min={getCurrentDate()}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                />
                <button
                  onClick={() => addItem(newItem.name, newItem.quantity, newItem.expiryDate)}
                  className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                >
                  Add Item
                </button>
                <button
                  onClick={() => handleCameraModalOpen()}
                  className="w-full p-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
                >
                  Upload Image
                </button>
              </div>
              <Modal open={openCameraModal} onClose={handleCameraModalClose}>
                <Box sx={style}>
                  <Typography variant="h6" component="h2">
                    Pantry Analysis
                  </Typography>
                  <Camera ref={camera} videoConstraints={{
          ...videoConstraints,
          facingMode
        }} aspectRatio={16 / 9} />
                  <Button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" onClick={captureImage}>
                    Capture Image
                  </Button>
                  <Button className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition" 
                        // hidden={numberOfCameras <= 1}
                        onClick={() => {
                          camera.current.switchCamera();
                        }}
                      >Switch Camera
                 </Button>
                </Box>
              </Modal>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">Search & Manage Pantry Items</h2>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                />
                <ul className="space-y-4">
                  {filteredPantry.length > 0 ? (
                    filteredPantry.map(item => (
                      <li key={item.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-50">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p>Quantity: {item.quantity}</p>
                          <p>Expiry Date: {item.expiryDate}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => updateItem(item.name, parseInt(item.quantity) + 1)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeItem(item.name)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                          >
                            Remove
                          </button>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No items found.</li>
                  )}
                </ul>
              </div>
            </div>
            <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <ul className="space-y-4">
                  {response ? (
                    <div className="bg-gray-200 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: response }} />
                  ) : (
                    <li className="text-gray-500">No recipe found.</li>
                  )}
                </ul>
              </div>
              <div className="flex justify-between items-center p-4 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="flex space-x-2 w-full">
                    <input
                      type="text"
                      placeholder="Type your message here..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                    />
                    <button
                      onClick={() => handleSuggestRecipe()}
                      className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                    >
                      Send
                    </button>
                  </div>
                </div>
          </div>
        </div>
      </main>
    </div>
  );
}
