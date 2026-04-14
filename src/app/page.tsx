"use client";

import { useMemo, useState } from "react";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  Stack,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useOps } from "@/hooks/useOps";
import { useCheckInOut } from "@/hooks/useCheckInOut";
import { Operator } from "@/types";
import OpCard from "@/components/OpCard";

type SortField = "name" | "opsCompleted" | "reliability";

function sortOperators(
  operators: Operator[],
  field: SortField,
  asc: boolean
): Operator[] {
  const sorted = [...operators].sort((a, b) => {
    switch (field) {
      case "name": {
        const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
        const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
        return nameA.localeCompare(nameB);
      }
      case "opsCompleted":
        return a.opsCompleted - b.opsCompleted;
      case "reliability":
        return a.reliability - b.reliability;
    }
  });
  return asc ? sorted : sorted.reverse();
}

export default function Home() {
  const { ops, loading, error } = useOps();
  const { getStatus, checkIn, checkOut } = useCheckInOut();

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortAsc, setSortAsc] = useState(true);

  // filter ops based on search input
  const filteredOps = useMemo(() => {
    if (!search.trim()) return ops;
    const query = search.toLowerCase();
    return ops.filter((op) => {
      if (op.opTitle.toLowerCase().includes(query)) return true;
      if (op.publicId.toLowerCase().includes(query)) return true;
      // check if any operator name matches
      return op.operators.some((operator) => {
        const fullName = `${operator.firstName} ${operator.lastName}`.toLowerCase();
        return fullName.includes(query);
      });
    });
  }, [ops, search]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Ops Dashboard
      </Typography>

      {/* search and sort controls */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search"
          placeholder="Search by op title, public ID, or operator name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          sx={{ flexGrow: 1 }}
        />
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={sortField}
            label="Sort By"
            onChange={(e) => setSortField(e.target.value as SortField)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="opsCompleted">Ops Completed</MenuItem>
            <MenuItem value="reliability">Reliability</MenuItem>
          </Select>
        </FormControl>
        <IconButton
          onClick={() => setSortAsc(!sortAsc)}
          size="small"
          title={sortAsc ? "Ascending" : "Descending"}
        >
          {sortAsc ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
        </IconButton>
      </Stack>

      {filteredOps.length === 0 ? (
        <Typography color="text.secondary">
          No ops found matching &quot;{search}&quot;
        </Typography>
      ) : (
        filteredOps.map((op) => (
          <OpCard
            key={op.opId}
            op={op}
            operators={sortOperators(op.operators, sortField, sortAsc)}
            getStatus={getStatus}
            onCheckIn={checkIn}
            onCheckOut={checkOut}
          />
        ))
      )}
    </Container>
  );
}
