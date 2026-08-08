import React, { Suspense } from 'react'
import { Box } from '@mui/material'
import RoomsSection from '@/src/components/rooms/RoomSection'

export default function page() {
  return (
    <Box>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        <RoomsSection />
      </Suspense>
    </Box>
  )
}