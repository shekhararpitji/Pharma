"use client";

import { useState, useEffect } from "react"
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import axiosInstance from "@/utils/axiosInstance"
import UserActivities from "./UserActivities"

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [showActivities, setShowActivities] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    partyName: "",
    mobileNumber: "",
  })

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/api/roles/users")
      setUsers(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch users")
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (user = null) => {
    if (user) {
      setSelectedUser(user)
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        partyName: user.partyName,
        mobileNumber: user.mobileNumber || "",
      })
    } else {
      setSelectedUser(null)
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        partyName: "",
        mobileNumber: "",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedUser(null)
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      partyName: "",
      mobileNumber: "",
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedUser) {
        // Update user
        await axiosInstance.put(`/api/roles/users/${selectedUser.id}/access`, formData)
        toast.success("User updated successfully")
      } else {
        // Create new user
        await axiosInstance.post("/api/roles/register", formData)
        toast.success("User created successfully")
      }
      handleCloseDialog()
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed")
      console.error("Error:", error)
    }
  }

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(`/api/roles/users/${userId}`)
        toast.success("User deleted successfully")
        fetchUsers()
      } catch (error) {
        toast.error("Failed to delete user")
        console.error("Error deleting user:", error)
      }
    }
  }

  const handleExport = async () => {
    try {
      const response = await axiosInstance.get("/api/roles/users/export", {
        responseType: "blob",
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "users.csv")
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      toast.error("Failed to export users")
      console.error("Error exporting users:", error)
    }
  }

  const handleViewActivities = (user) => {
    setSelectedUser(user)
    setShowActivities(true)
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          User Management
        </Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add User
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Party Name</TableCell>
              <TableCell>Mobile Number</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.partyName}</TableCell>
                <TableCell>{user.mobileNumber}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleViewActivities(user)}>
                    <HistoryIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDialog(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedUser ? "Edit User" : "Add New User"}</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                fullWidth
              />
              {!selectedUser && (
                <TextField
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  fullWidth
                />
              )}
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  label="Role"
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Party Name"
                value={formData.partyName}
                onChange={(e) => setFormData({ ...formData, partyName: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Mobile Number"
                value={formData.mobileNumber}
                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                fullWidth
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedUser ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* User Activities Dialog */}
      <UserActivities
        open={showActivities}
        onClose={() => setShowActivities(false)}
        userId={selectedUser?.id}
        userName={selectedUser?.name}
      />
    </Box>
  )
}
