//box
import Box from '@mui/material/Box'


function BoardsBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.dark',
      height: (theme) => theme.trello.boardBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }}>
        Board Bar
    </Box>
  )
}

export default BoardsBar