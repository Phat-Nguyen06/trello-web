// import hook
import { useEffect, useState, useCallback, useRef } from 'react'

// import thư viện lodash (sao chép dữ liệu)
import { cloneDeep } from 'lodash'

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
  closestCorners,
  // closestCenter,
  defaultDropAnimationSideEffects,
  pointerWithin,
  // rectIntersection,
  getFirstCollision
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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)

  // console.log(oderedColumns)
  // Tìm column của card thông qua id của card lấy từ event
  function findColumnByCardId(cardId) {
    return oderedColumns.find(column => column?.cards.map(card => card._id)?.includes(cardId))
  }

  function moveCardBetweenDifferentColumns(
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId
  ) {
    setOderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi mà activeCard sắp đc thả)
      const overCardIndex = overColumn?.cards.findIndex(card => card._id === overCardId)

      // Logic tính toán "CardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code thư viện
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mảng oderedColumns cũ ra một mảng mới để xử lý data rồi return - cập nhật lại oderedColumns mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // Column cũ
      if (nextActiveColumn) {
        // Xóa card ở column active
        nextActiveColumn.cards = nextActiveColumn?.cards.filter(card => card._id !== activeDraggingCardId)

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo có tồn tại ở overColumn chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau.
        const rebuild_activeDraggingCardData = {
          ...activeDragItemData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }

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

    if (event?.active?.data?.current) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trong quá trình kéo một phần tử
  function handleDragOver(event) {
    // Không làm gì thêm nếu đang kéo Column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    // console.log(event)
    const { active, over } = event
    // card đang cầm -> active
    // console.log('active: ', active)
    // từng card được di chuyển tới (card đích tới cuối) -> over
    // console.log('over: ', over)

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra khỏi phạm vi sontainer) thì ko làm gì
    if (!active || !over) return

    // activeDraggingCard: Là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: Là cái card đang tương tác trên hoặc dưới so với card được kéo ở trên
    const { id: overCardId } = over

    // Tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Nếu không tồn tại 1 trong 2 column thì ko làm gì
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì ko làm gì
    // Vì đây đang là đoạn xử lý lúc kéo (handleDragOver), còn xử lý kéo xong xuôi thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId)
    }
  }

  // start function chạy khi được người dùng kéo thả (hàm được gọi ở DndContext)
  function handleDragEnd(event) {
    const { active, over } = event

    // Kiểm tra ko tồn tại over (kéo linh tinh ra ngoài thì return tránh lỗi)
    if (!over) return
    // console.log('handleDragEnd : ', event)

    // Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard: Là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: Là cái card đang tương tác trên hoặc dưới so với card được kéo ở trên
      const { id: overCardId } = over

      // Tìm 2 cái column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Nếu không tồn tại 1 trong 2 column thì ko làm gì
      if (!activeColumn || !overColumn) return

      // Hành động kéo thả card giữa 2 column khác nhau
      //Phải dùng tới activeDragItemData.columnId hoặc oldColumnWhenDraggingCard._id chứ ko phải activeData trong scope handleDragEnd này là vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần r
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId)
      }
      else {
        // Lấy vị trí cũ từ oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex((c) => c._id === activeDraggingCardId)
        // Lấy vị trí mới từ overColumn
        const newCardIndex = overColumn?.cards?.findIndex((c) => c._id === overCardId)

        // DÙng arrayMove của dnd-kit để sắp xếp lại mảng Column ban đầu
        const dndOderedCard = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)

        setOderedColumns(prevColumns => {
          // Clone mảng oderedColumns cũ ra một mảng mới để xử lý data rồi return - cập nhật lại oderedColumns mới
          const nextColumns = cloneDeep(prevColumns)

          // tìm tới cái column mà chúng ta thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong targetColumn
          targetColumn.cards = dndOderedCard
          targetColumn.cardOrderIds = dndOderedCard.map(i => i._id)

          // Trả về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }

    // Xử lý kéo thả column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // Lấy vị trí cũ từ active
        const oldColumnIndex = oderedColumns.findIndex((c) => c._id === active.id)
        // Lấy vị trí mới từ over
        const newColumnIndex = oderedColumns.findIndex((c) => c._id === over.id)

        //DÙng arrayMove của dnd-kit để sắp xếp lại mảng Column ban đầu
        const dndOderedColumns = arrayMove(oderedColumns, oldColumnIndex, newColumnIndex)
        //2 cái console.log dữ liệu này sau dùng để xử lí gọi API
        // const dndOderedColumnsIds = dndOderedColumns.map(c => c._id)
        // console.log('dndOderedColumns: ', dndOderedColumns)
        // console.log('dndOderedColumnsIds: ', dndOderedColumnsIds)

        // cập nhật lại status columns ban đầu sau khi đã kéo thả
        setOderedColumns(dndOderedColumns)
      }
    }

    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
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

  // Chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns
  const collisionDetectionStrategy = useCallback((args) => {
    // Trường hợp kéo column thì dùng thuật toán closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tìm các điểm giao nhau, va nhau - intersections với con trỏ
    const pointerIntersections = pointerWithin(args)

    // Fix triệt để cái bug flickering của thư viện Dnd-kit trong trường hợp sau:
    // Kéo một cái card có image cover lớn và kéo lến phía trên cùng ra khỏi khu vực kéo thả
    if (!pointerIntersections.length) return

    // Thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
    // const intersections = !!pointerIntersections?.length
    //   ? pointerIntersections
    //   : rectIntersection(args)

    // Tìm overId đầu tiên trong đám pointerIntersections ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = oderedColumns.find(column => column._id === overId)
      if (checkColumn) {
        // console.log('overId before: ', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after: ', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Nếu overId là null thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, oderedColumns])

  return (
    <DndContext
      // Cảm biến
      sensors={sensors}
      // Thuật toán phát hiện va chạm (nếu ko có nó thì card với cover lớn sẽ ko kéo qua Column được vì lúc này nó đang bị Conflict giữa card và column)
      //https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
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