// import thư viện mui cần thiết để dùng
import Box from '@mui/material/Box'

// import components
import ListColumns from './ListColumns/ListColumns'

// import function
import { mapOrder } from '~/utils/sorts'

function BoardsContent({ board }) {
  const oderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
  return (
    <Box sx={{
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
      height: (theme) => theme.trello.boardContentHeight,
      width: '100%',
      p: '10px 0'
    }}>
      <ListColumns columns={oderedColumns} />
    </Box>
  )
}

export default BoardsContent