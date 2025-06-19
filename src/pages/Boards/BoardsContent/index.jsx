//box
import Box from '@mui/material/Box'


function BoardsContent() {
  return (
    <Box sx={{
      backgroundColor: 'primary.main',
      height: (theme) => `calc(100vh - ${theme.trello.appBarHeight} - ${theme.trello.boardBarHeight})`,
      width: '100%',
      display: 'flex',
      alignItems: 'center'
    }}>
        Content
    </Box>
  )
}

export default BoardsContent