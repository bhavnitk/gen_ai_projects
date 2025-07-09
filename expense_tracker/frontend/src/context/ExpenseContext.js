import React, { createContext, useState, useEffect, useContext } from "react";
import {
  fetchExpenses,
  fetchCategories,
  createExpense,
  updateExpense,
  deleteExpense,
  createCategory,
} from "../api/api";

const ExpenseContext = createContext();

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpenseProvider");
  }
  return context;
};

export const ExpenseProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [expensesData, categoriesData] = await Promise.all([
          fetchExpenses(),
          fetchCategories(),
        ]);

        setExpenses(expensesData);
        setCategories(categoriesData);
        setError(null);
      } catch (err) {
        setError("Failed to load data. Please try again later.");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addExpense = async (expenseData) => {
    try {
      setLoading(true);
      const newExpense = await createExpense(expenseData);
      setExpenses([...expenses, newExpense]);
      return newExpense;
    } catch (err) {
      setError("Failed to add expense. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editExpense = async (id, expenseData) => {
    try {
      setLoading(true);
      const updatedExpense = await updateExpense(id, expenseData);
      setExpenses(
        expenses.map((expense) =>
          expense.id === id ? updatedExpense : expense
        )
      );
      return updatedExpense;
    } catch (err) {
      setError("Failed to update expense. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeExpense = async (id) => {
    try {
      setLoading(true);
      await deleteExpense(id);
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (err) {
      setError("Failed to delete expense. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData) => {
    try {
      setLoading(true);
      const newCategory = await createCategory(categoryData);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      setError("Failed to add category. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Calculate total expenses
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  // Get expenses by category
  const expensesByCategory = categories.map((category) => {
    const categoryExpenses = expenses.filter(
      (expense) => expense.category_id === category.id
    );
    const total = categoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    return {
      category: category.name,
      total,
      percentage: totalExpenses > 0 ? (total / totalExpenses) * 100 : 0,
    };
  });

  const value = {
    expenses,
    categories,
    loading,
    error,
    addExpense,
    editExpense,
    removeExpense,
    addCategory,
    totalExpenses,
    expensesByCategory,
  };

  return (
    <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>
  );
};
