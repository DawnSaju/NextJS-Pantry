"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Modal, TextField } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (status === "loading") return;
    if (status === "authenticated") {
      setUser(session.user);
      router.push("/pantry");
    } else if (status === "unauthenticated") {
      signIn();
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <Typography>Loading...</Typography>;
  }

  if (status === "unauthenticated") {
    return <Typography>You need to sign in to access this page.</Typography>;
  }

  return (
    <Box padding={2}>
      <Typography variant="h4">Welcome!!!!</Typography>
    </Box>
  );
}
