import {
  AppBar, Box, Button, Card, CardActions, CardContent, Chip, Container, Fab, IconButton, Stack, Toolbar, Typography,
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

export default function Product() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="titleLarge" component="h1" sx={{ ml: 1, flexGrow: 1 }}>
            Trail jacket
          </Typography>
          <IconButton edge="end" aria-label="Save">
            <FavoriteBorderIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Card variant="outlined">
          <Box sx={{ height: 200, bgcolor: 'm3.primaryContainer' }} />
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="headlineSmall" component="h2">
                Trail jacket
              </Typography>
              <Typography variant="bodyMedium" color="text.secondary">
                Lightweight, packable shell for wet mountain days.
              </Typography>
              <Stack direction="row" spacing={1}>
                <Chip label="Waterproof" variant="outlined" />
                <Chip label="2-year warranty" variant="outlined" />
              </Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button variant="text">Details</Button>
            <Button>Add to cart</Button>
          </CardActions>
        </Card>
      </Container>

      <Fab aria-label="Add to cart" sx={{ position: 'fixed', right: { xs: 16, sm: 24 }, bottom: { xs: 16, sm: 24 } }}>
        <AddShoppingCartIcon />
      </Fab>
    </>
  )
}
