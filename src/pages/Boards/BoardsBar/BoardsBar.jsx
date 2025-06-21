// import thư viện mui cần thiết để dùng
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const MENU_STYLES = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardsBar() {
  return (
    <Box sx={{
      height: (theme) => theme.trello.boardBarHeight,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Chip
          sx={MENU_STYLES}
          icon={<DashboardIcon />}
          label="Phat Nguyen"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label="Public/Private Workspace"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automation"
          clickable
        />

        <Chip
          sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
        >Invite
        </Button>

        <AvatarGroup
          max={6}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: 34,
              height: 34,
              fontSize: 16,
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0be' }
            }
          }}
        >
          <Tooltip title="Phat Nguyen">
            <Avatar
              alt="Remy Sharp"
              src="https://file.hstatic.net/200001029891/file/z6725172432342_fd97fe18bba2e9828effa61770d2a027.jpg"
            />
          </Tooltip>

          <Tooltip title="Remy Sharp">
            <Avatar
              alt="Remy Sharp"
              src="https://png.pngtree.com/png-clipart/20230813/original/pngtree-circular-avatar-vector-illustration-male-character-businesswoman-asian-vector-picture-image_10581229.png"
            />
          </Tooltip>

          <Tooltip title="Cindy Baker">
            <Avatar
              alt="Cindy Baker"
              src="https://png.pngtree.com/png-vector/20220608/ourlarge/pngtree-round-kid-avatar-boy-face-png-image_4919114.png"
            />
          </Tooltip>

          <Tooltip title="Phat Nguyen">
            <Avatar
              alt="Remy Sharp"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShI0cN6xaoQJAGyEKEphYn8-bbYqqYPwk7vw&s"
            />
          </Tooltip>

          <Tooltip title="Phat Nguyen">
            <Avatar
              alt="Remy Sharp"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXjwI8uDFbzIANHceaKVIYIQfJ-w2jweiUkw&s"
            />
          </Tooltip>
          <Tooltip title="Phat Nguyen">
            <Avatar
              alt="Remy Sharp"
              src="https://file.hstatic.net/200001029891/file/z6725172432342_fd97fe18bba2e9828effa61770d2a027.jpg"
            />
          </Tooltip>

          <Tooltip title="Remy Sharp">
            <Avatar
              alt="Remy Sharp"
              src="https://png.pngtree.com/png-clipart/20230813/original/pngtree-circular-avatar-vector-illustration-male-character-businesswoman-asian-vector-picture-image_10581229.png"
            />
          </Tooltip>

          <Tooltip title="Cindy Baker">
            <Avatar
              alt="Cindy Baker"
              src="https://png.pngtree.com/png-vector/20220608/ourlarge/pngtree-round-kid-avatar-boy-face-png-image_4919114.png"
            />
          </Tooltip>

          <Tooltip title="Phat Nguyen">
            <Avatar
              alt="Remy Sharp"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShI0cN6xaoQJAGyEKEphYn8-bbYqqYPwk7vw&s"
            />
          </Tooltip>

          <Tooltip title="Phat Nguyen">
            <Avatar
              alt="Remy Sharp"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXjwI8uDFbzIANHceaKVIYIQfJ-w2jweiUkw&s"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  )
}

export default BoardsBar