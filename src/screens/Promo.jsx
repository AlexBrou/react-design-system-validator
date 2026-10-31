// This screen passes ESLint but breaks M3 rules through its CSS file, to show
// what only the rendered checks can catch.
import { Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material'
import './promo.css'

export default function Promo() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="headlineMedium" component="h1">
        Home
      </Typography>

      <Dialog open slotProps={{ paper: { className: 'promo-paper' } }} aria-labelledby="promo-title">
        <DialogTitle id="promo-title" className="promo-headline">Get 20% off your next order</DialogTitle>
        <DialogContent>
          <DialogContentText>Subscribe to our newsletter and we will send you a code.</DialogContentText>
        </DialogContent>
        <DialogActions className="promo-actions">
          <Button variant="text">No thanks</Button>
          <Button>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
