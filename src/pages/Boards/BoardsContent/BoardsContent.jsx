// import hook
import { useEffect, useState } from 'react'

// import thư viện mui cần thiết để dùng
import Box from '@mui/material/Box'

// import components
import ListColumns from './ListColumns/ListColumns'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

// import function
import { mapOrder } from '~/utils/sorts'

//import thư viện dnd-kit (chức năng kéo thả)
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor, useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardsContent({ board }) {
  const [oderedColumns, setOderedColumns] = useState([])
  // Cùng 1 thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)

  // start khi board thay đổi thì gọi useEffect set lại oderedColumns
  useEffect(() => {
    setOderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  // end khi board thay đổi thì gọi useEffect set lại oderedColumns

  // Start fix trường hợp click vào chưa kèo đã gọi event
  // Nếu sử dụng PointerSensor mặc định thì kết hợp thuộc tính touch-action: none ở phần kéo thả - nhưng vẫn bug
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })

  // Yều cầu chuột di chuyển 10px thì mới kích hoạt event, fix trường hợp click vào chưa kèo đã gọi event
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })

  // Nhấn giữ 250ms và dung sai cảm ứng 500px mới kích hoạt
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  //Thuộc tính này tolerancebiểu thị khoảng cách, tính bằng pixel , của chuyển động được dung thứ trước
  // khi thao tác kéo bị hủy bỏ. Nếu ngón tay hoặc bút stylus di chuyển trong thời gian trì hoãn và dung
  // sai được đặt thành 0, thao tác kéo sẽ bị hủy bỏ ngay lập tức. Nếu dung sai cao hơn được đặt, ví dụ,
  // dung sai 5pixel, thao tác sẽ chỉ bị hủy bỏ nếu ngón tay di chuyển hơn 5 pixel trong thời gian trì hoãn.

  //Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để trải nghiệm trên mobile tốt nhất ko bug
  const sensors = useSensors(mouseSensor, touchSensor)
  // const sensors = useSensors( pointerSensor )
  // End fix


  function handleDragStart(event) {
    // console.log(event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
  }

  // start function chạy khi được người dùng kéo thả (hàm được gọi ở DndContext)
  function handleDragEnd(event) {
    // console.log('handleDragEnd : ', event)

    const { active, over } = event

    // Kiểm tra ko tồn tại over (kéo linh tinh ra ngoài thì return tránh lỗi)
    if (!over) return

    // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (active.id !== over.id) {
      // Lấy vị trí cũ từ active
      const oldIndex = oderedColumns.findIndex((c) => c._id === active.id)
      // Lấy vị trí mới từ over
      const newIndex = oderedColumns.findIndex((c) => c._id === over.id)

      //DÙng arrayMove của dnd-kit để sắp xếp lại mảng Column ban đầu
      const dndOderedColumns = arrayMove(oderedColumns, oldIndex, newIndex)
      //2 cái console.log dữ liệu này sau dùng để xử lí gọi API
      // const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
      // console.log('dndOderedColumns: ', dndOderedColumns)
      // console.log('dndOderedColumnsIds: ', dndOderedColumnsIds)

      // cập nhật lại status columns ban đầu sau khi đã kéo thả
      setOderedColumns(dndOderedColumns)
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
  }
  // end function chạy khi được người dùng kéo thả

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        height: (theme) => theme.trello.boardContentHeight,
        width: '100%',
        p: '10px 0'
      }}>
        <ListColumns columns={oderedColumns} />
        <DragOverlay dropAnimation={dropAnimationConfig}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardsContent