import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  Grid,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseItem from "../components/ExpenseItem";

const ExpenseList = () => {
  const navigate = useNavigate();
  const { expenses, categories, loading, error } = useExpenses();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  // Filter expenses based on search term and category
  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.notes &&
        expense.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory =
      categoryFilter === "" || expense.category_id === parseInt(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Sort expenses
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    switch (sortBy) {
      case "amount-asc":
        return a.amount - b.amount;
      case "amount-desc":
        return b.amount - a.amount;
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "date-desc":
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Handle search clear
  const clearSearch = () => {
    setSearchTerm("");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Expenses
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/expenses/add")}
        >
          Add Expense
        </Button>
      </Box>

      {/* Filters */}
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Search expenses"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="clear search"
                      onClick={clearSearch}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              select
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="date-desc">Date (Newest First)</MenuItem>
              <MenuItem value="date-asc">Date (Oldest First)</MenuItem>
              <MenuItem value="amount-desc">Amount (Highest First)</MenuItem>
              <MenuItem value="amount-asc">Amount (Lowest First)</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Expenses List */}
      {sortedExpenses.length > 0 ? (
        <Box>
          {sortedExpenses.map((expense) => (
            <ExpenseItem key={expense.id} expense={expense} />
          ))}
        </Box>
      ) : (
        <Alert severity="info" sx={{ mt: 2 }}>
          No expenses found. Add your first expense to get started!
        </Alert>
      )}
    </Box>
  );
};

export default ExpenseList;
