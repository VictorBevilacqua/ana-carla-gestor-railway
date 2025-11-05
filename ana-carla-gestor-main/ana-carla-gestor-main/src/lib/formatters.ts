// Utility functions for formatting values in PT-BR

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
};

export const formatGrams = (grams: number): string => {
  return `${grams}g`;
};

export const formatKg = (kg: number): string => {
  return `${kg.toFixed(2)} kg`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};
