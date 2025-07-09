import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Box,
  Tooltip,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { useExpenses } from "../context/ExpenseContext";

const ExpenseItem = ({ expense }) => {
  const navigate = useNavigate();
  const { removeExpense } = useExpenses();

  const handleEdit = () => {
    navigate(`/expenses/edit/${expense.id}`);
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await removeExpense(expense.id);
      } catch (error) {
        console.error("Failed to delete expense:", error);
      }
    }
  };

  // Format date for display
  const formattedDate = format(new Date(expense.date), "MMM dd, yyyy");

  return (
    <Card className="expense-card">
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" component="div">
              {expense.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {expense.notes && expense.notes.length > 50
                ? `${expense.notes.substring(0, 50)}...`
                : expense.notes}
            </Typography>
            <Box mt={1}>
              <Chip
                label={expense.category.name}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={formattedDate}
                size="small"
                sx={{ ml: 1 }}
                variant="outlined"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h5" component="div" color="primary">
              ${expense.amount.toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={2} container justifyContent="flex-end">
            <Tooltip title="Edit">
              <IconButton
                aria-label="edit"
                onClick={handleEdit}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                aria-label="delete"
                onClick={handleDelete}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ExpenseItem;
