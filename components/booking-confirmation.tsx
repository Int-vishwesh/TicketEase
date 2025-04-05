"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

interface BookingConfirmationProps {
  confirmationId: string
  onDone: () => void
}

export function BookingConfirmation({ confirmationId, onDone }: BookingConfirmationProps) {
  return (
    <Card className="w-full max-w-md mx-auto text-center">
      <CardHeader>
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle>Booking Confirmed!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">Your booking has been successfully processed.</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <p className="text-sm text-gray-500">Confirmation Number</p>
          <p className="text-xl font-mono font-bold">{confirmationId}</p>
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Please save this confirmation number for your records. You'll need it to make any changes to your booking.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onDone}>Done</Button>
      </CardFooter>
    </Card>
  )
}

