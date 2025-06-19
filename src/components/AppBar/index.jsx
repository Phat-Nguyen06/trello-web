//box
import Box from '@mui/material/Box'

//components dark light mode
import ModeSelect from '~/components/ModeSelect/'


function AppBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.light',
      height: (theme) => theme.trello.appBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }}>
      <ModeSelect />
    </Box>
  )
}

export default AppBar