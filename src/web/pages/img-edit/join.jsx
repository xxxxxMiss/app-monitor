import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Upload, Button, Tooltip, Modal } from 'antd'
import { DndProvider, useDrag, useDrop, createDndContext } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import update from 'immutability-helper'
import { UploadOutlined } from '@ant-design/icons'
import { post } from 'utils/request'

const RNDContext = createDndContext(HTML5Backend)

const type = 'DragableUploadList'
// TODO: ant upload file type
const getBase64 = file => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = error => {
      reject(error)
    }
    fileReader.readAsDataURL(file.originFileObj)
  })
}

const DragableUploadListItem = ({
  originNode,
  moveRow,
  file,
  fileList,
  preview = false,
}) => {
  const ref = React.useRef()
  const index = fileList.indexOf(file)
  const [base64, setBase64] = useState('')
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {}
      if (dragIndex === index) {
        return {}
      }
      return {
        isOver: monitor.isOver(),
        dropClassName:
          dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      }
    },
    drop: item => {
      // @ts-ignore
      moveRow(item.index, index)
    },
  })
  const [, drag] = useDrag({
    item: { type, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  })
  drop(drag(ref))
  const errorNode = (
    <Tooltip title="Upload Error" getPopupContainer={() => document.body}>
      {originNode.props.children}
    </Tooltip>
  )

  useEffect(() => {
    if (file) {
      getBase64(file).then(base64 => {
        setBase64(base64)
      })
    }
  }, [preview])

  return (
    <div
      ref={ref}
      className={`ant-upload-draggable-list-item ${
        isOver ? dropClassName : ''
      }`}
      style={{ cursor: 'move' }}
    >
      {file.status === 'error' ? (
        errorNode
      ) : preview ? (
        <img src={base64} />
      ) : (
        originNode
      )}
    </div>
  )
}

const DragSortingUpload = () => {
  const [category, setCategory] = useState('row')
  const [fileList, setFileList] = useState([])
  const [visible, setVisible] = useState(false)
  const [dataUrl, setDataUrl] = useState(null)
  const uploadRef = useRef(null)
  useEffect(() => {
    if (uploadRef.current === null) {
      uploadRef.current = document.querySelector('.ant-upload-list')
    }

    const listEl = uploadRef.current
    if (!listEl) return

    switch (category) {
      case 'row':
        listEl.style.display = 'block'
        break
      case 'col':
        listEl.style.display = 'flex'
        break
      case 'grid':
        listEl.style.cssText = `
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr;
        `
        break
    }
  }, [category])

  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = fileList[dragIndex]
      setFileList(
        update(fileList, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      )
    },
    [fileList],
  )

  const manager = useRef(RNDContext)

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handleBeforeUpload = useCallback(file => {
    setFileList(prev => {
      return [...prev, file]
    })
    return false
  }, [])

  const handleSubmit = useCallback(async () => {
    const formData = new FormData()
    fileList.forEach(item => {
      formData.append('files[]', item.originFileObj)
    })
    formData.append('category', category)
    const res = await post('/img/join', formData)
    setDataUrl(res)
    setVisible(true)
  }, [fileList, category])

  return (
    <div className={sx('page-img-join')}>
      <div className={sx('btn-group')}>
        <Button onClick={() => setCategory('row')}>横向排列</Button>
        <Button onClick={() => setCategory('col')}>纵向排列</Button>
        <Button onClick={() => setCategory('grid')}>网格排列</Button>
      </div>
      <div>
        <Button
          type="primary"
          disabled={!fileList.length}
          onClick={handleSubmit}
        >
          合成
        </Button>
      </div>
      <DndProvider manager={manager.current.dragDropManager}>
        <Upload
          fileList={fileList}
          onChange={onChange}
          listType="picture"
          multiple
          beforeUpload={handleBeforeUpload}
          itemRender={(originNode, file, currFileList) => (
            <DragableUploadListItem
              originNode={originNode}
              file={file}
              fileList={currFileList}
              moveRow={moveRow}
            />
          )}
          className={sx('testing')}
        >
          <Button>
            <UploadOutlined /> Click to Upload
          </Button>
        </Upload>
      </DndProvider>
      <Modal visible={visible} onCancel={() => setVisible(false)}>
        {dataUrl && <img src={dataUrl} alt="" />}
      </Modal>
    </div>
  )
}

export default DragSortingUpload
