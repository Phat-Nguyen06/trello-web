//box
import Box from '@mui/material/Box'


function BoardsContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
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