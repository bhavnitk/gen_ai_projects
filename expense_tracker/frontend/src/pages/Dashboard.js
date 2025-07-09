import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useExpenses } from "../context/ExpenseContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    expenses,
    categories,
    loading,
    error,
    totalExpenses,
    expensesByCategory,
  } = useExpenses();

  // Generate random colors for chart
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`hsl(${Math.random() * 360}, 70%, 60%)`);
    }
    return colors;
  };

  // Prepare data for pie chart
  const pieData = {
    labels: expensesByCategory.map((item) => item.category),
    datasets: [
      {
        data: expensesByCategory.map((item) => item.total),
        backgroundColor: generateColors(expensesByCategory.length),
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for bar chart - recent expenses
  const recentExpenses = [...expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const barData = {
    labels: recentExpenses.map((expense) => expense.title),
    datasets: [
      {
        label: "Amount ($)",
        data: recentExpenses.map((expense) => expense.amount),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Recent Expenses",
      },
    },
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
          Dashboard
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

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                color="text.secondary"
                gutterBottom
              >
                Total Expenses
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                ${totalExpenses.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                color="text.secondary"
                gutterBottom
              >
                Total Categories
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {categories.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Typography
                variant="h6"
                component="div"
                color="text.secondary"
                gutterBottom
              >
                Total Transactions
              </Typography>
              <Typography variant="h4" component="div" color="primary">
                {expenses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Expenses by Category
            </Typography>
            {expensesByCategory.length > 0 ? (
              <Box className="chart-container">
                <Pie data={pieData} />
              </Box>
            ) : (
              <Alert severity="info">No expense data available</Alert>
            )}
          </Paper>
        </Grid>

        {/* Bar Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Expenses
            </Typography>
            {recentExpenses.length > 0 ? (
              <Box className="chart-container">
                <Bar data={barData} options={barOptions} />
              </Box>
            ) : (
              <Alert severity="info">No expense data available</Alert>
            )}
          </Paper>
        </Grid>

        {/* Category Breakdown */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Category Breakdown
            </Typography>
            {expensesByCategory.length > 0 ? (
              <Grid container spacing={2}>
                {expensesByCategory
                  .sort((a, b) => b.total - a.total)
                  .map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography variant="body1">
                            {item.category}
                          </Typography>
                          <Typography variant="body1" fontWeight="bold">
                            ${item.total.toFixed(2)}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {item.percentage.toFixed(1)}% of total
                        </Typography>
                        <Divider sx={{ mt: 1 }} />
                      </Box>
                    </Grid>
                  ))}
              </Grid>
            ) : (
              <Alert severity="info">No expense data available</Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
