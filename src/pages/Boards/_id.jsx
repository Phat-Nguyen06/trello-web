// Board Details

// import thư viện mui cần thiết để dùng
import Container from '@mui/material/Container'

//components
import AppBar from '~/components/AppBar/AppBar'

//
import BoardsBar from './BoardsBar/BoardsBar'
import BoardsContent from './BoardsContent/BoardsContent'

// import API
import { mockData } from '~/apis/mock-data'

function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }} >
      <AppBar />
      <BoardsBar board={mockData?.board} />
      <BoardsContent board={mockData?.board} />
    </Container>
  )
}

export default Board