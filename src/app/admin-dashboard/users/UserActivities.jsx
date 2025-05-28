"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
} from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"
import { toast } from "react-toastify"
import axiosInstance from "@/utils/axiosInstance"

const getActionColor = (action) => {
  switch (action) {
    case "login":
      return "success"
    case "download":
      return "primary"
    case "view":
      return "info"
    default:
      return "default"
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString()
}

export default function UserActivities({ open, onClose, userId, userName }) {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open && userId) {
      fetchActivities()
    }
  }, [open, userId])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get(`/api/roles/users/${userId}/activities`)
      setActivities(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch user activities")
      console.error("Error fetching activities:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            User Activities - {userName}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Timestamp</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell>Details</TableCell>
                  <TableCell>Data Type</TableCell>
                  <TableCell>Chapter</TableCell>
                  <TableCell>Subscription Type</TableCell>
                  <TableCell>IP Address</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>{formatDate(activity.timestamp)}</TableCell>
                    <TableCell>
                      <Chip
                        label={activity.action}
                        color={getActionColor(activity.action)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{activity.details}</TableCell>
                    <TableCell>{activity.dataType || "-"}</TableCell>
                    <TableCell>{activity.chapterNumber || "-"}</TableCell>
                    <TableCell>{activity.subscriptionType || "-"}</TableCell>
                    <TableCell>{activity.ipAddress || "-"}</TableCell>
                  </TableRow>
                ))}
                {activities.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      No activities found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
    </Dialog>
  )
} 