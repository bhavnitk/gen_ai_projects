import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Typography,
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useExpenses } from "../context/ExpenseContext";
import { format } from "date-fns";

const ExpenseForm = ({ initialValues, onSubmit, buttonText = "Submit" }) => {
  const { categories } = useExpenses();

  const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    amount: Yup.number()
      .required("Amount is required")
      .positive("Amount must be positive"),
    category_id: Yup.number().required("Category is required"),
    date: Yup.date().required("Date is required"),
    notes: Yup.string(),
  });

  const defaultValues = {
    title: "",
    amount: "",
    category_id: "",
    date: new Date(),
    notes: "",
  };

  const formik = useFormik({
    initialValues: initialValues || defaultValues,
    validationSchema,
    onSubmit: (values) => {
      // Format date to ISO string for backend
      const formattedValues = {
        ...values,
        date: format(values.date, "yyyy-MM-dd'T'HH:mm:ss"),
      };
      onSubmit(formattedValues);
    },
  });

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        {buttonText === "Update" ? "Edit Expense" : "Add New Expense"}
      </Typography>
      <Box
        component="form"
        onSubmit={formik.handleSubmit}
        className="expense-form"
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="amount"
              name="amount"
              label="Amount"
              type="number"
              value={formik.values.amount}
              onChange={formik.handleChange}
              error={formik.touched.amount && Boolean(formik.errors.amount)}
              helperText={formik.touched.amount && formik.errors.amount}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ mr: 1 }}>
                    $
                  </Box>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              id="category_id"
              name="category_id"
              select
              label="Category"
              value={formik.values.category_id}
              onChange={formik.handleChange}
              error={
                formik.touched.category_id && Boolean(formik.errors.category_id)
              }
              helperText={
                formik.touched.category_id && formik.errors.category_id
              }
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              label="Date"
              value={formik.values.date}
              onChange={(value) => formik.setFieldValue("date", value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={formik.touched.date && Boolean(formik.errors.date)}
                  helperText={formik.touched.date && formik.errors.date}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              id="notes"
              name="notes"
              label="Notes"
              multiline
              rows={4}
              value={formik.values.notes}
              onChange={formik.handleChange}
              error={formik.touched.notes && Boolean(formik.errors.notes)}
              helperText={formik.touched.notes && formik.errors.notes}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ mt: 2 }}
            >
              {buttonText}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ExpenseForm;
