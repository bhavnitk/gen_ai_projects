import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { useExpenses } from "../context/ExpenseContext";
import ExpenseForm from "../components/ExpenseForm";
import { fetchExpense } from "../api/api";

const EditExpense = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { editExpense, loading, error } = useExpenses();
  const [expense, setExpense] = useState(null);
  const [fetchError, setFetchError] = useState(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const getExpense = async () => {
      try {
        setIsFetching(true);
        const data = await fetchExpense(id);

        // Format the data for the form
        setExpense({
          ...data,
          date: new Date(data.date),
        });

        setFetchError(null);
      } catch (err) {
        console.error("Failed to fetch expense:", err);
        setFetchError("Failed to load expense. Please try again.");
      } finally {
        setIsFetching(false);
      }
    };

    getExpense();
  }, [id]);

  const handleSubmit = async (values) => {
    try {
      await editExpense(id, values);
      navigate("/expenses");
    } catch (err) {
      console.error("Failed to update expense:", err);
    }
  };

  if (isFetching || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (fetchError) {
    return (
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/expenses")}
            sx={{ mr: 2 }}
          >
            Back to Expenses
          </Button>
          <Typography variant="h4" component="h1">
            Edit Expense
          </Typography>
        </Box>
        <Alert severity="error">{fetchError}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/expenses")}
          sx={{ mr: 2 }}
        >
          Back to Expenses
        </Button>
        <Typography variant="h4" component="h1">
          Edit Expense
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      {expense && (
        <ExpenseForm
          initialValues={expense}
          onSubmit={handleSubmit}
          buttonText="Update"
        />
      )}
    </Box>
  );
};

export default EditExpense;
