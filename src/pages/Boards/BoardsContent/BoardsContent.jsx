// import thư viện mui cần thiết để dùng
import Box from '@mui/material/Box'

// import components
import ListColumns from './ListColumns/ListColumns'


function BoardsContent() {
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      height: (theme) => theme.trello.boardContentHeight,
      width: '100%',
      p: '10px 0'
    }}>
      <ListColumns />
    </Box>
  )
}

export default BoardsContent