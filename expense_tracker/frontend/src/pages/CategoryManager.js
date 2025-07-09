import React, { useState } from "react";
import {
  Typography,
  Box,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useExpenses } from "../context/ExpenseContext";
import * as Yup from "yup";
import { useFormik } from "formik";

const CategoryManager = () => {
  const { categories, expensesByCategory, addCategory, loading, error } =
    useExpenses();
  const [formError, setFormError] = useState(null);

  // Form validation
  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Category name is required")
      .max(50, "Category name must be 50 characters or less"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        setFormError(null);

        // Check if category already exists
        if (
          categories.some(
            (cat) => cat.name.toLowerCase() === values.name.toLowerCase()
          )
        ) {
          setFormError("A category with this name already exists");
          return;
        }

        await addCategory(values);
        resetForm();
      } catch (err) {
        console.error("Failed to add category:", err);
        setFormError("Failed to add category. Please try again.");
      }
    },
  });

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
        Category Manager
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Add Category Form */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Add New Category
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {formError}
                </Alert>
              )}
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Category Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                startIcon={<AddIcon />}
                disabled={loading}
              >
                Add Category
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Category List */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Existing Categories
            </Typography>
            {categories.length > 0 ? (
              <List>
                {categories.map((category, index) => {
                  // Find expenses for this category
                  const categoryData = expensesByCategory.find(
                    (item) => item.category === category.name
                  ) || { total: 0, percentage: 0 };

                  return (
                    <React.Fragment key={category.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem>
                        <ListItemText
                          primary={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <Typography variant="body1">
                                {category.name}
                              </Typography>
                              {categoryData.total > 0 && (
                                <Chip
                                  label={`$${categoryData.total.toFixed(2)}`}
                                  color="primary"
                                  size="small"
                                />
                              )}
                            </Box>
                          }
                          secondary={
                            categoryData.total > 0
                              ? `${categoryData.percentage.toFixed(
                                  1
                                )}% of total expenses`
                              : "No expenses in this category"
                          }
                        />
                      </ListItem>
                    </React.Fragment>
                  );
                })}
              </List>
            ) : (
              <Alert severity="info">
                No categories found. Add your first category to get started!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CategoryManager;
