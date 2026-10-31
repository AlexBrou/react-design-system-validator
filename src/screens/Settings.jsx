import {
  AppBar, Button, Container, IconButton, List, ListItem, ListItemText, Stack, Switch, TextField, Toolbar, Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function Settings() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" aria-label="Back">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="titleLarge" component="h1" sx={{ ml: 1 }}>
            Settings
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Typography variant="titleSmall" color="primary">
          Notifications
        </Typography>
        <List>
          <ListItem disableGutters secondaryAction={<Switch edge="end" defaultChecked slotProps={{ input: { 'aria-label': 'Push notifications' } }} />}>
            <ListItemText primary="Push notifications" secondary="Order updates and offers" />
          </ListItem>
          <ListItem disableGutters secondaryAction={<Switch edge="end" slotProps={{ input: { 'aria-label': 'Email digest' } }} />}>
            <ListItemText primary="Email digest" secondary="A weekly summary" />
          </ListItem>
        </List>

        <Stack spacing={2} sx={{ mt: 2 }}>
          <Typography variant="titleSmall" color="primary">
            Profile
          </Typography>
          <TextField label="Display name" defaultValue="Alex" />
          <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
            <Button variant="outlined">Reset</Button>
            <Button>Save</Button>
          </Stack>
        </Stack>
      </Container>
    </>
  )
}
