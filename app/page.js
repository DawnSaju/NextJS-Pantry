// // import { getUserSession } from '@/lib/session'

// // export default async function Home() {
// //   const user = await getUserSession()
// //   return <main className="">{JSON.stringify(user)}</main>
// // }

// "use client";

// import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
// import { firestore } from "../../firebase";
// import { collection, query, getDocs, doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
// import { useEffect, useState } from "react";
// import { update } from "firebase/database";
// import { useSession, signIn } from "next-auth/react";


// export default function Home() {;
//   const [pantry, setPantry] = useState([]);
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [openUpdateModal, setOpenUpdateModal] = useState(false);
//   const handleAddModalOpen = () => setOpenAddModal(true);
//   const handleAddModalClose = () => setOpenAddModal(false);

//   const handleUpdateModalOpen = () => setOpenUpdateModal(true);
//   const handleUpdateModalClose = () => setOpenUpdateModal(false);
//   const [itemName, setItemName] = useState("");
//   const [itemQuantity, setQuantity] = useState("");
//   const [expiryDate, setExpiryDate] = useState("");
//   const [NewItem, setNewItem] = useState("");
//   const [searchParam, setSearchParam] = useState("");
//   const [user, setUser] = useState(null);
  
//   const { data: session, status } = useSession();

//   useEffect(() => {
//     if (status === "authenticated") {
//       console.log(session.user);
//       setUser(session.user);
//     } else if (status === "unauthenticated") {
//       signIn();
//     }
//   }, [status, session]);

//   const style = {
//     display: 'flex',
//     flexDirection: 'column',
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     width: 400,
//     bgcolor: 'white',
//     border: '2px solid #fff',
//     boxShadow: 24,
//     p: 4,
//     gap: 1,
//   };
  
//   const addItem = async (item, expiryDate) => {
//     if (!item || !expiryDate) {
//       console.error("Item name and expiry date are required.");
//       return;
//     }
//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const { count } = docSnap.data();
//       await setDoc(docRef, { count: count + 1 }, { merge: true });
//     } else {
//       await setDoc(docRef, { count: 1, expiryDate });
//     }
//     await updatePantry();
//     setNewItem("");
//     setExpiryDate("");
//   };

//   const removeItem = async (item) => {
//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       const { count } = docSnap.data();
//       if (count <= 1) {
//         await deleteDoc(docRef);
//       } else {
//         await setDoc(docRef, { count: count - 1 }, { merge: true });
//       }
//       await updatePantry();
//     }
//   };

//   const updateItem = async (item, quantity) => {
//     if (!item || !quantity) {
//       console.error("Item name and quantity are required.");
//       return;
//     }

//     const docRef = doc(collection(firestore, "pantry"), item);
//     const docSnap = await getDoc(docRef);
//     if (docSnap.exists()) {
//       await setDoc(docRef, { count: quantity });
//     }
//     await updatePantry();
//     setNewItem("");
//     setQuantity("");
//   };

//   const updatePantry = async () => {
//     const snapshot = query(collection(firestore, "pantry"));
//     const docs = await getDocs(snapshot);
//     const pantryList = [];
//     docs.forEach((doc) => {
//       pantryList.push({"name": doc.id, ...doc.data()});
//     });
//     setPantry(pantryList);
//   }

//   const filteredPantry = pantry.filter(({ name }) =>
//     name.toLowerCase().includes(searchParam.toLowerCase())
//   );

//   useEffect(() => {
//     updatePantry();
//   }, []);
//   return (
//     <Box
//       width="100vw"
//       height="100vh"
//       display={"flex"}
//       justifyContent={"center"}
//       flexDirection={"column"}
//       alignItems={"center"}
//       gap={2}
//     >
//       <Modal
//         open={openAddModal}
//         onClose={handleAddModalClose}
//         aria-labelledby="modal-modal-title"
//         aria-describedby="modal-modal-description"
//       >
//         <Box sx={style}>
//           <Typography id="modal-modal-title" variant="h6" component="h2">
//             Add Item
//           </Typography>
//           <Stack width="100%" direction={"column"} spacing={2}>
//             <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
//             <TextField id="outlined-basic" label="Expiry Date" type="date" variant="outlined" fullWidth value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} 
//                   InputLabelProps={{
//                     shrink: true,
//                   }}
//               />
//             <Button variant="outline"sx={{backgroundColor: "#1976d2", color: "#fff"}} onClick={() =>  {
//               addItem(itemName, expiryDate);
//               setItemName("");
//               handleAddModalClose();
//             }}>ADD</Button>
//           </Stack>
//         </Box>
//       </Modal>
//       <Box border={"1px solid #333"} height="300px" position={"absolute"} top={0} width="100vw">
//         <Box
//           height="300px"
//           bgcolor={"#333"}
//           color={"#fff"}
//           display={"flex"}
//           flexDirection={"column"}
//           justifyContent={"center"}
//           alignItems={"center"}
//           gap={4}
//         >
//           <Box gap={4} display={"flex"} justifyContent={"space-evenly"}>
//           {user ? (
//             <Typography variant={"h3"} color={"#fff"} textAlign={"center"}
//             sx={
//               {
//                 fontFamily: "Poppins, sans-serif",
//                 fontWeight: "500",
//               }
//             }
//             >
//               {user.name}'s' Pantry Items 
//             </Typography>
//             ) : (
//               <Typography variant="h6" color="textSecondary">
//                 Loading user data...
//               </Typography>
//             )}
//             <Box 
//               display={"flex"}
//               justifyContent={"center"}
//               alignItems={"center"}
//               >
//               <Button variant="contained"
//                 onClick={handleAddModalOpen}
//               >ADD</Button>
//             </Box>
//           </Box>
//           <Box gap={4} display={"flex"} justifyContent={"space-evenly"} width="30vw">
//             <TextField
//               id="outlined-basic"
//               label="Search"
//               variant="outlined"
//               fullWidth
//               value={searchParam}
//               onChange={(e) => setSearchParam(e.target.value)}
//               InputLabelProps={{
//                 style: { color: '#fff' },
//               }}
//               sx={{
//                 '& .MuiOutlinedInput-root': {
//                   '& fieldset': {
//                     borderColor: '#c2c2c2',
//                     borderRadius: '10px',
//                   },
//                   '&:hover fieldset': {
//                     borderColor: '#fff',
//                   },
//                   '&.Mui-focused fieldset': {
//                     borderColor: '#fff',
//                   },
//                   input: {
//                     color: '#fff',
//                   },
//                 },
//               }}
//             />
//             <Button variant="contained">Search</Button>
//           </Box>
//         </Box>
//         <Stack width="100vw" height="800px" spacing={2} overflow={"auto"} bgcolor={"#333"}>
//           {filteredPantry.length === 0 ? (
//               <Typography variant={"h4"} color={"#fff"} textAlign={"center"}>
//               No Pantry Items Found
//             </Typography>
//           ) : (
//           filteredPantry.map(({name, count}) => (
//             <Box
//               key={name}
//               width="100%"
//               minHeight="150px"
//               display={"flex"}
//               justifyContent={"space-between"}
//               alignItems={"center"}
//               bgcolor={"#242424"}
//               paddingX={5}
//             >
//               <Typography variant={"h4"} color={"#fff"} textAlign={"center"}>
//                 {name.charAt(0).toUpperCase() + name.slice(1)}
//               </Typography>

//               <Typography variant={"h4"} color={"#fff"} textAlign={"center"}>
//                 Quantity: {count}
//               </Typography>
//             <Box gap={2} display={"flex"} justifyContent={"space-evenly"}>
//               <Button variant="contained" onClick={handleUpdateModalOpen}>Update</Button>
//               <Button variant="contained" onClick={() => removeItem(name)}>Remove</Button>
//             </Box>
//           </Box>
//          ))
//         )}
        
//         <Modal
//           open={openUpdateModal}
//           onClose={handleUpdateModalClose}
//           aria-labelledby="modal-modal-title"
//           aria-describedby="modal-modal-description"
//         >
//           <Box sx={style}>
//             <Typography id="modal-modal-title" variant="h6" component="h2">
//               Update Item
//             </Typography>
//             <Stack width="100%" direction={"column"} spacing={2}>
//               <TextField id="outlined-basic" label="Item" variant="outlined" fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)} />
//               <TextField id="outlined-basic" label="Quantity" variant="outlined" fullWidth value={itemQuantity} onChange={(e) => setQuantity(e.target.value)}                  
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                 />
//               <Button variant="outline"sx={{backgroundColor: "#1976d2", color: "#fff"}} onClick={() =>  {
//                 updateItem(itemName, itemQuantity);
//                 setItemName("");
//                 handleUpdateModalClose();
//               }}>Update</Button>
//             </Stack>
//           </Box>
//         </Modal>
//         </Stack>
//       </Box>
//     </Box>
//   );
// }
