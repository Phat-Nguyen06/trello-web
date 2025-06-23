// import thư viện mui cần thiết để dùng
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'

// import components
import Column from './Column/Column'

//import thư viện dnd-kit (chức năng kéo thả)
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'


function ListColumns({ columns }) {
  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy} >
      <Box
        sx={{
          bgcolor: 'inherit',
          height: '100%',
          width: '100%',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 }
        }}
      >
        {/* Box column */}
        {columns.map(column => <Column key={column._id} column={column} />)}

        {/* Box Add new column CTA */}
        <Box sx={{
          minWidth: '200px',
          maxWidth: '200px',
          mx: 2,
          borderRadius: '6px',
          height: 'fit-content',
          bgcolor: '#ffffff3d'
        }}>
          <Button
            startIcon={<NoteAddIcon />}
            sx={{
              color: 'white',
              width: '100%',
              justifyContent: 'flex-start',
              pl: 2.5,
              py: 1
            }}
          >
            Add new column
          </Button>
        </Box>
      </Box>
    </SortableContext>
  )
}

export default ListColumns