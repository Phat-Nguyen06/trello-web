// Board Details

//container
import Container from '@mui/material/Container'

//components
import AppBar from '~/components/AppBar/AppBar'

//
import BoardsBar from './BoardsBar/BoardsBar'
import BoardsContent from './BoardsContent/BoardsContent'

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