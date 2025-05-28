"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Button,
} from "@mui/material"
import {
  People as PeopleIcon,
  Subscriptions as SubscriptionsIcon,
  Add as AddIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material"

// Components
import UserManagement from "./users/page"
import SubscriptionManagement from "./subscriptions/page"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState(0)
  const router = useRouter()

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage users and subscriptions
            </Typography>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12}>
          <Paper sx={{ width: "100%" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                icon={<PeopleIcon />}
                label="Users"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
              <Tab
                icon={<SubscriptionsIcon />}
                label="Subscriptions"
                iconPosition="start"
                sx={{ minHeight: 64 }}
              />
            </Tabs>

            {/* Tab Content */}
            <Box sx={{ p: 3 }}>
              {activeTab === 0 && <UserManagement />}
              {activeTab === 1 && <SubscriptionManagement />}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}
