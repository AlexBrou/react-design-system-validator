import {
  Button, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography,
} from '@mui/material'

export default function ConfirmDialog() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="headlineMedium" component="h1">
        Photos
      </Typography>

      <Dialog open aria-labelledby="confirm-title">
        <DialogTitle id="confirm-title">Delete 3 photos?</DialogTitle>
        <DialogContent>
          <DialogContentText>They will be removed from all your devices.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant="text">Cancel</Button>
          <Button variant="text">Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}
