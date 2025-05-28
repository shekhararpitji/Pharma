"use client"

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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon,
} from "@mui/icons-material"
import { toast } from "react-toastify"
import axiosInstance from "@/utils/axiosInstance"

const SUBSCRIPTION_TYPES = ["raw", "cleaned", "premium"]
const DATA_TYPES = ["type1", "type2", "type3"]
const CHAPTER_NUMBERS = Array.from({ length: 34 }, (_, i) => i + 1)

export default function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState(null)
  const [formData, setFormData] = useState({
    clientName: "",
    contactPerson: "",
    email: "",
    subscriptionType: [],
    dataType: [],
    chapterNumber: [],
    productlimit: 100,
    subscribedDurationDownload: 12,
    subscribedDurationView: 12,
    subscriptionCost: 0,
    paymentMethod: "credit_card",
    paymentId: "",
    autoRenew: true,
  })

  // Fetch subscriptions on component mount
  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await axiosInstance.get("/subscriptions")
      setSubscriptions(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch subscriptions")
      console.error("Error fetching subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (subscription = null) => {
    if (subscription) {
      setSelectedSubscription(subscription)
      setFormData({
        ...subscription,
        subscriptionType: subscription.subscriptionType || [],
        dataType: subscription.dataType || [],
        chapterNumber: subscription.chapterNumber || [],
      })
    } else {
      setSelectedSubscription(null)
      setFormData({
        clientName: "",
        contactPerson: "",
        email: "",
        subscriptionType: [],
        dataType: [],
        chapterNumber: [],
        productlimit: 100,
        subscribedDurationDownload: 12,
        subscribedDurationView: 12,
        subscriptionCost: 0,
        paymentMethod: "credit_card",
        paymentId: "",
        autoRenew: true,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedSubscription(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedSubscription) {
        // Update subscription
        await axiosInstance.put(`/subscriptions/${selectedSubscription.id}`, formData)
        toast.success("Subscription updated successfully")
      } else {
        // Create new subscription
        await axiosInstance.post("/subscriptions", formData)
        toast.success("Subscription created successfully")
      }
      handleCloseDialog()
      fetchSubscriptions()
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed")
      console.error("Error:", error)
    }
  }

  const handleDelete = async (subscriptionId) => {
    if (window.confirm("Are you sure you want to delete this subscription?")) {
      try {
        await axiosInstance.delete(`/subscriptions/${subscriptionId}`)
        toast.success("Subscription deleted successfully")
        fetchSubscriptions()
      } catch (error) {
        toast.error("Failed to delete subscription")
        console.error("Error deleting subscription:", error)
      }
    }
  }

  const handleAssignSubscription = async (subscriptionId) => {
    // Implement subscription assignment logic
    // This would typically open another dialog to select a user
    toast.info("Subscription assignment feature coming soon")
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h2">
          Subscription Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Subscription
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client Name</TableCell>
              <TableCell>Contact Person</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Subscription Type</TableCell>
              <TableCell>Product Limit</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Cost</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subscriptions.map((subscription) => (
              <TableRow key={subscription.id}>
                <TableCell>{subscription.clientName}</TableCell>
                <TableCell>{subscription.contactPerson}</TableCell>
                <TableCell>{subscription.email}</TableCell>
                <TableCell>
                  {subscription.subscriptionType.map((type) => (
                    <Chip
                      key={type}
                      label={type}
                      size="small"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </TableCell>
                <TableCell>{subscription.productlimit}</TableCell>
                <TableCell>
                  {subscription.subscribedDurationDownload} months
                </TableCell>
                <TableCell>${subscription.subscriptionCost}</TableCell>
                <TableCell>
                  <Chip
                    label={subscription.status}
                    color={subscription.status === "active" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenDialog(subscription)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(subscription.id)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleAssignSubscription(subscription.id)}>
                    <AssignmentIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Subscription Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedSubscription ? "Edit Subscription" : "Add New Subscription"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <TextField
                label="Client Name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Contact Person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
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
              <FormControl fullWidth>
                <InputLabel>Subscription Type</InputLabel>
                <Select
                  multiple
                  value={formData.subscriptionType}
                  onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value })}
                  label="Subscription Type"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {SUBSCRIPTION_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Data Type</InputLabel>
                <Select
                  multiple
                  value={formData.dataType}
                  onChange={(e) => setFormData({ ...formData, dataType: e.target.value })}
                  label="Data Type"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {DATA_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Chapter Numbers</InputLabel>
                <Select
                  multiple
                  value={formData.chapterNumber}
                  onChange={(e) => setFormData({ ...formData, chapterNumber: e.target.value })}
                  label="Chapter Numbers"
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {CHAPTER_NUMBERS.map((number) => (
                    <MenuItem key={number} value={number}>
                      {number}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Product Limit"
                type="number"
                value={formData.productlimit}
                onChange={(e) => setFormData({ ...formData, productlimit: parseInt(e.target.value) })}
                required
                fullWidth
              />
              <TextField
                label="Subscription Duration (months)"
                type="number"
                value={formData.subscribedDurationDownload}
                onChange={(e) => {
                  const value = parseInt(e.target.value)
                  setFormData({
                    ...formData,
                    subscribedDurationDownload: value,
                    subscribedDurationView: value,
                  })
                }}
                required
                fullWidth
              />
              <TextField
                label="Subscription Cost"
                type="number"
                value={formData.subscriptionCost}
                onChange={(e) => setFormData({ ...formData, subscriptionCost: parseFloat(e.target.value) })}
                required
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  label="Payment Method"
                >
                  <MenuItem value="credit_card">Credit Card</MenuItem>
                  <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
                  <MenuItem value="paypal">PayPal</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Payment ID"
                value={formData.paymentId}
                onChange={(e) => setFormData({ ...formData, paymentId: e.target.value })}
                fullWidth
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.autoRenew}
                    onChange={(e) => setFormData({ ...formData, autoRenew: e.target.checked })}
                  />
                }
                label="Auto Renew"
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {selectedSubscription ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
} 