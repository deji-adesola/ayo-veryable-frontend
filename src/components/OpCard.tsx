"use client";

import { Card, CardContent, Typography, Stack, Divider } from "@mui/material";
import { Op, Operator } from "@/types";
import OperatorTable from "./OperatorTable";

function formatTime(isoString: string) {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

interface OpCardProps {
  op: Op;
  operators: Operator[]; // might be filtered/sorted so we pass them in
  getStatus: (opId: number, operatorId: number) => { checkedIn: string | null; checkedOut: string | null };
  onCheckIn: (opId: number, operatorId: number) => void;
  onCheckOut: (opId: number, operatorId: number) => void;
}

export default function OpCard({
  op,
  operators,
  getStatus,
  onCheckIn,
  onCheckOut,
}: OpCardProps) {
  return (
    <Card variant="outlined" sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          {op.opTitle}
        </Typography>
        <Stack direction="row" spacing={3} sx={{ mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            <strong>ID:</strong> {op.publicId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Operators Needed:</strong> {op.operatorsNeeded}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <strong>Time:</strong> {formatTime(op.startTime)} -{" "}
            {formatTime(op.endTime)}
          </Typography>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <OperatorTable
          operators={operators}
          opId={op.opId}
          getStatus={getStatus}
          onCheckIn={onCheckIn}
          onCheckOut={onCheckOut}
        />
      </CardContent>
    </Card>
  );
}
