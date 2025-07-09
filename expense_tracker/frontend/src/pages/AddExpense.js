import React from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, CircularProgress, Alert } from "@mui/material";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseForm from "../components/ExpenseForm";

const AddExpense = () => {
  const navigate = useNavigate();
  const { addExpense, loading, error } = useExpenses();

  const handleSubmit = async (values) => {
    try {
      await addExpense(values);
      navigate("/expenses");
    } catch (err) {
      console.error("Failed to add expense:", err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Add New Expense
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      <ExpenseForm onSubmit={handleSubmit} buttonText="Add Expense" />
    </Box>
  );
};

export default AddExpense;
