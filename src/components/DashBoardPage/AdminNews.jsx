import React, { useState } from "react";
import { Button } from "@mui/material";
import {Box} from "@mui/material";
import {AppBar} from "@mui/material";
import {Toolbar} from "@mui/material";
import {Typography} from "@mui/material";
import {Tabs} from "@mui/material";
import {Tab} from "@mui/material";
import {Paper} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import StoryNews from "./StoryNews";
import DigitalNews from "./DigitalNews";
import Editors from "./Editors";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const AdminNews = () => {
  const [tab, setTab] = useState(0);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    toast.success("Logged out");
    router.push("/login");
  };

  return (
    <Box minHeight="100vh">
      <AppBar position="static" color="default">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography fontWeight="bold">🛠 Admin Panel</Typography>
          <Button
            color="error"
            variant="contained"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Paper>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
          <Tab label="📰 Story News" />
          <Tab label="🎥 Digital News" />
          <Tab label="👥 Editors" />
        </Tabs>
      </Paper>

      <TabPanel value={tab} index={0}>
        <StoryNews />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <DigitalNews />
      </TabPanel>
      <TabPanel value={tab} index={2}>
        <Editors />
      </TabPanel>
    </Box>
  );
};

export default AdminNews;
