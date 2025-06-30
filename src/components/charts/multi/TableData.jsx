import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export const TableData = ({ data, surveyATitle, surveyBTitle }) => {
  if (!data || data.length === 0) {
    return <Typography>No data to display.</Typography>;
  }

  return (
    <TableContainer
      component={Paper}
      elevation={3}
      sx={{
        mt: 4,
        maxWidth: 800,
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              Category
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              {surveyATitle}
            </TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold", fontSize: "1rem" }}>
              {surveyBTitle}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, idx) => (
            <TableRow
              key={row.text}
              sx={{
                backgroundColor: idx % 2 === 0 ? "#fff" : "#f9f9f9",
                "&:last-child td": { borderBottom: 0 },
              }}
            >
              <TableCell sx={{ py: 1 }}>{row.text}</TableCell>
              <TableCell align="right" sx={{ py: 1 }}>{row.A}</TableCell>
              <TableCell align="right" sx={{ py: 1 }}>{row.B}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
