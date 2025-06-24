import React from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";

export const ChartTable = ({ data, optional, chartType }) => {
  if (
    (chartType === "stackedBar" || chartType === "groupedBar") &&
    optional?.length
  ) {
    const keys = Object.keys(optional[0].options);

    return (
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ mt: 4, maxWidth: 800, borderRadius: 2 }}
      >
        <Table size="small">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>Category</TableCell>
              {keys.map((key) => (
                <TableCell key={key} align="right" sx={{ fontWeight: "bold" }}>
                  {key}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {optional.map((item, idx) => (
              <TableRow
                key={item.text}
                sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
              >
                <TableCell>{item.text}</TableCell>
                {keys.map((key) => (
                  <TableCell key={key} align="right">
                    {item.options[key] ?? 0}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

  if (!data?.length) return null;

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{ mt: 4, maxWidth: 800, borderRadius: 2 }}
    >
      <Table size="small">
        <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Answer</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={row.text}
              sx={{ backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9" }}
            >
              <TableCell>{row.text}</TableCell>
              <TableCell align="right">{row.count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
