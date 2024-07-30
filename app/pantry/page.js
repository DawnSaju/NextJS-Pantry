// import { getUserSession } from '@/lib/session'

// export default async function Home() {
//   const user = await getUserSession()
//   return <main className="">{JSON.stringify(user)}</main>
// }

"use client";

import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "../firebase";
import { collection, query, getDocs, where, doc, setDoc, deleteDoc, getDoc, addDoc,updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { update } from "firebase/database";
import { useSession, signIn } from "next-auth/react";
import { getUserSession } from '../../lib/session'

export default function Home() {;
  const [pantry, setPantry] = useState([]);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const handleAddModalOpen = () => setOpenAddModal(true);
  const handleAddModalClose = () => setOpenAddModal(false);

  const handleUpdateModalOpen = () => setOpenUpdateModal(true);
  const handleUpdateModalClose = () => setOpenUpdateModal(false);
  const [itemName, setItemName] = useState("");
  const [itemQuantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [NewItem, setNewItem] = useState("");
  const [searchParam, setSearchParam] = useState("");
  const [param, setParam] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pantryItems, setPantryItems] = useState([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated") {
      console.log(session.user);
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

  const search = (param) => {
    if (!param) {
      setSearchParam("");
    } else {
      setSearchParam(param);
    }
  }

  const addItem = async (itemName, itemQuantity, expiryDate) => {
    if (status === "authenticated") {
      const userId = session.user.id;
  
      if (!itemName || !itemQuantity || !expiryDate) {
        console.error("Item name, quantity, and expiry date are required");
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
      const userId = session.user.id; 
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
      const userId = session.user.id;
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
      const userId = session.user.id;
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
          const userId = session.user.id;
          const userDocRef = doc(firestore, `users/${userId}`);
          const userDoc = await getDoc(userDocRef);

          if (userDoc) {
            const pantryRef = collection(userDocRef, 'pantry');
            const pantrySnapshot = await getDocs(pantryRef);
            const items = pantrySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            console.log('Pantry items:', items);

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
  }, [status, session]);
  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={2}
    >
      <Modal
        open={openAddModal}
        onClose={handleAddModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"column"} spacing={2}>
            <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
            <TextField id="outlined-basic" label="Expiry Date" type="date" variant="outlined" fullWidth value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} 
                  InputLabelProps={{
                    shrink: true,
                  }}
              />
            <Button variant="outline"sx={{backgroundColor: "#1976d2", color: "#fff"}} onClick={() =>  {
              addItem(itemName, 1,expiryDate);
              setItemName("");
              handleAddModalClose();
            }}>ADD</Button>
          </Stack>
        </Box>
      </Modal>
      <Box border={"1px solid #333"} height="300px" position={"absolute"} top={0} width="100vw">
        <Box
          height="300px"
          bgcolor={"#333"}
          color={"#fff"}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={4}
        >
          <Box gap={4} display={"flex"} justifyContent={"space-evenly"}>
          {user ? (
            <Typography variant={"h3"} color={"#fff"} textAlign={"center"}
            sx={
              {
                fontFamily: "Poppins, sans-serif",
                fontWeight: "500",
              }
            }
            >
              {user.name}'s' Pantry Items 
            </Typography>
            ) : (
              <Typography variant="h6" color="textSecondary">
                Loading user data...
              </Typography>
            )}
            <Box 
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              >
              <Button variant="contained"
                onClick={handleAddModalOpen}
              >ADD</Button>
            </Box>
          </Box>
          <Box gap={4} display={"flex"} justifyContent={"space-evenly"} width="30vw">
            <TextField
              id="outlined-basic"
              label="Search"
              variant="outlined"
              fullWidth
              value={param}
              onChange={(e) => setParam(e.target.value)}
              InputLabelProps={{
                style: { color: '#fff' },
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#c2c2c2',
                    borderRadius: '10px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#fff',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#fff',
                  },
                  input: {
                    color: '#fff',
                  },
                },
              }}
            />
            <Button variant="contained" onClick={() => search(param)}>Search</Button>
          </Box>
        </Box>
        <Stack width="100vw" height="800px" spacing={2} overflow={"auto"} bgcolor={"#333"}>
          {filteredPantry.length === 0 ? (
              <Typography variant={"h4"} color={"#fff"} textAlign={"center"}>
              No Pantry Items Found
            </Typography>
          ) : (
          filteredPantry.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="150px"
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
              bgcolor={"#242424"}
              paddingX={5}
            >
              <Typography variant={"h4"} color={"#fff"} textAlign={"center"}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>

              <Typography variant={"h4"} color={"#fff"} textAlign={"center"}>
                Quantity: {quantity}
              </Typography>
            <Box gap={2} display={"flex"} justifyContent={"space-evenly"}>
              <Button variant="contained" onClick={handleUpdateModalOpen}>Update</Button>
              <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
            </Box>
          </Box>
         ))
        )}
        
        <Modal
          open={openUpdateModal}
          onClose={handleUpdateModalClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update Item
            </Typography>
            <Stack width="100%" direction={"column"} spacing={2}>
              <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
              <TextField id="outlined-basic" label="Quantity" variant="outlined" fullWidth value={itemQuantity} onChange={(e) => setQuantity(e.target.value)}                  
                    InputLabelProps={{
                      shrink: true,
                    }}
                />
              <Button variant="outline"sx={{backgroundColor: "#1976d2", color: "#fff"}} onClick={() =>  {
                updateItem(itemName, itemQuantity);
                setItemName("");
                handleUpdateModalClose();
              }}>Update</Button>
            </Stack>
          </Box>
        </Modal>
        </Stack>
      </Box>
    </Box>
  );
}
