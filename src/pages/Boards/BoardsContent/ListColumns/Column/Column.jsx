import { useState } from 'react'

// import thư viện mui cần thiết để dùng
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import ContentCopy from '@mui/icons-material/ContentCopy'
import ContentPaste from '@mui/icons-material/ContentPaste'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Tooltip from '@mui/material/Tooltip'
import AddCardIcon from '@mui/icons-material/AddCard'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'

// import components
import ListCards from './ListCards/ListCards'

// import function
import { mapOrder } from '~/utils/sorts'

//import thư viện dnd-kit (chức năng kéo thả)
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Column({ column }) {
  // Start dnd-kit (chức năng kéo thả)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyles = {
    // touchAction: 'none',
    transform: CSS.Translate.toString(transform),
    transition,
    // Chiều cao phải luôn max 100% vì nếu ko sẽ lỗi lúc kéo column ngắn qua column dài
    // thì phải luôn kéo ở khu vực giữa giữa (bug). Lưu ý phải kết hợp với {...listeners}
    // nằm ở Box chứ ko phải div ngoài cùng để tránh trường hợp kéo ngoài card
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }
  // End dndkit (chức năng kéo thả)

  // Start đóng mở dropdown
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  // End đóng mở dropdown

  // Sắp xếp mảng dựa trên 1 mảng khác
  const oderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id')

  // Phải bọc div ở đây vì vấn đề chiều cao của column khi kéo thả sẽ có bug kiểu kiểu flickering
  return (
    <div ref={setNodeRef} style={dndKitColumnStyles} {...attributes}>
      <Box {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box column header*/}
        <Box
          sx={{
            height: (theme) => (theme.trello.columnHeaderHeight),
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <Typography variant='h6'
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >{column?.title}</Typography>

          <Box>
            <Tooltip title="More options">
              <ExpandMoreIcon
                sx={{ color: 'text.primary', cursor: 'pointer' }}
                id="basic-button-workspaces"
                aria-controls={open ? 'basic-menu-workspaces' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
              />
            </Tooltip>
            <Menu
              id="basic-menu-workspaces"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  'aria-labelledby': 'basic-button-workspaces'
                }
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCardIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>

              <Divider />

              <MenuItem>
                <ListItemIcon>
                  <DeleteForeverIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Remove this column</ListItemText>
              </MenuItem>

              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Box list card  */}
        <ListCards cards={oderedCards} />

        {/* Box column footer*/}
        <Box sx={{
          height: (theme) => theme.trello.columnFooterHeight,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Button startIcon={<AddCardIcon />}>Add new card</Button>

          <Tooltip title="Drag to move">
            <DragHandleIcon sx={{ cursor: 'pointer' }} />
          </Tooltip>
        </Box>
      </Box>
    </div>
  )
}

export default Column