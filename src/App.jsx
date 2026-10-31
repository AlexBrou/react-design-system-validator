import { lazy, Suspense, useSyncExternalStore } from 'react'
import { AppBar, Container, List, ListItemButton, ListItemText, Toolbar, Typography } from '@mui/material'
import { screens } from './screens/registry.js'

const components = Object.fromEntries(screens.map((s) => [s.id, lazy(s.load)]))

function subscribe(callback) {
  window.addEventListener('hashchange', callback)
  return () => window.removeEventListener('hashchange', callback)
}

function useRoute() {
  return useSyncExternalStore(subscribe, () => window.location.hash.replace(/^#\/?/, ''))
}

export default function App() {
  const route = useRoute()
  const Screen = components[route]

  if (Screen) {
    return (
      <Suspense>
        <div data-screen={route}>
          <Screen />
        </div>
      </Suspense>
    )
  }

  return (
    <div data-screen="index">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="titleLarge" component="h1">Screens</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <List>
          {screens.map((s) => (
            <ListItemButton key={s.id} component="a" href={`#/${s.id}`}>
              <ListItemText primary={s.title} secondary={`#/${s.id}`} />
            </ListItemButton>
          ))}
        </List>
      </Container>
    </div>
  )
}
