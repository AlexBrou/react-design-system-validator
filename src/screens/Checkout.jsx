// This screen breaks M3 rules on purpose, to demo the checkers.
import { Box, Button, Container, Fab, IconButton, Stack, TextField, Typography } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import ChatIcon from '@mui/icons-material/Chat'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveIcon from '@mui/icons-material/Remove'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

export default function Checkout() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h5" component="h1">
        Checkout
      </Typography>

      <Stack spacing={0.75} sx={{ mt: 2 }}>
        <Box sx={{ p: 2, bgcolor: 'm3.surfaceContainer' }}>
          <Typography variant="bodyLarge">Trail jacket × 1</Typography>
          <Stack direction="row" spacing={0}>
            <IconButton aria-label="Decrease"><RemoveIcon /></IconButton>
            <IconButton aria-label="Increase"><AddIcon /></IconButton>
            <IconButton aria-label="Remove"><DeleteIcon /></IconButton>
          </Stack>
        </Box>

        <Typography sx={{ fontSize: 20, fontWeight: 700 }}>Total: $189.00</Typography>
        <Typography variant="bodySmall" sx={{ color: '#d32f2f' }}>
          Only 2 left in stock
        </Typography>

        <Stack direction="row" spacing={1}>
          <TextField label="Coupon" size="small" />
          <button>Apply</button>
        </Stack>

        <Box>
          <Button variant="contained" sx={{ mr: '8px' }}>Pay now</Button>
          <Button sx={{ borderRadius: 1, height: 36 }}>Pay later</Button>
        </Box>
      </Stack>

      <Fab size="medium" aria-label="Help" sx={{ position: 'fixed', left: 16, bottom: 16 }}>
        <ChatIcon />
      </Fab>
      <Fab aria-label="Bag" sx={{ position: 'fixed', right: 16, bottom: 16 }}>
        <ShoppingBagIcon />
      </Fab>
    </Container>
  )
}
