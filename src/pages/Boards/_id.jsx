// Board Details

//container
import Container from '@mui/material/Container'

//components
import AppBar from '../../components/AppBar'

//
import BoardsBar from './BoardsBar'
import BoardsContent from './BoardsContent'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }} >
      <AppBar />
      <BoardsBar />
      <BoardsContent />
    </Container>
  )
}

export default Board