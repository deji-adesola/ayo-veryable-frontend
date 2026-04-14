"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Stack,
  Typography,
} from "@mui/material";
import { Operator } from "@/types";

interface OperatorRowProps {
  operator: Operator;
  opId: number;
  checkedIn: string | null;
  checkedOut: string | null;
  onCheckIn: () => void;
  onCheckOut: () => void;
}

function OperatorRow({
  operator,
  checkedIn,
  checkedOut,
  onCheckIn,
  onCheckOut,
}: OperatorRowProps) {
  const isCheckedIn = !!checkedIn;
  const isCheckedOut = !!checkedOut;

  return (
    <TableRow>
      <TableCell>
        {operator.firstName} {operator.lastName}
      </TableCell>
      <TableCell align="center">{operator.opsCompleted}</TableCell>
      <TableCell align="center">
        {Math.round(operator.reliability * 100)}%
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
          {operator.endorsements.map((endorsement, idx) => (
            <Chip key={idx} label={endorsement} size="small" variant="outlined" />
          ))}
        </Stack>
      </TableCell>
      <TableCell align="center">
        <Stack direction="row" spacing={1} justifyContent="center">
          {isCheckedOut ? (
            <Typography variant="body2" color="success.main" fontWeight={500}>
              Completed
            </Typography>
          ) : (
            <>
              <Button
                variant="contained"
                size="small"
                onClick={onCheckIn}
                disabled={isCheckedIn}
              >
                Check In
              </Button>
              <Button
                variant="outlined"
                size="small"
                onClick={onCheckOut}
                disabled={!isCheckedIn}
              >
                Check Out
              </Button>
            </>
          )}
        </Stack>
      </TableCell>
    </TableRow>
  );
}

// table wrapper for what goes inside the card
interface OperatorTableProps {
  operators: Operator[];
  opId: number;
  getStatus: (opId: number, operatorId: number) => { checkedIn: string | null; checkedOut: string | null };
  onCheckIn: (opId: number, operatorId: number) => void;
  onCheckOut: (opId: number, operatorId: number) => void;
}

export default function OperatorTable({
  operators,
  opId,
  getStatus,
  onCheckIn,
  onCheckOut,
}: OperatorTableProps) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Ops Completed
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Reliability
            </TableCell>
            <TableCell sx={{ fontWeight: 600 }}>Endorsements</TableCell>
            <TableCell sx={{ fontWeight: 600 }} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {operators.map((operator) => {
            const status = getStatus(opId, operator.id);
            return (
              <OperatorRow
                key={operator.id}
                operator={operator}
                opId={opId}
                checkedIn={status.checkedIn}
                checkedOut={status.checkedOut}
                onCheckIn={() => onCheckIn(opId, operator.id)}
                onCheckOut={() => onCheckOut(opId, operator.id)}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
