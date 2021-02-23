import { Button, Upload, Form, Input, Slider, Switch } from 'antd'
import useMouse from '@react-hook/mouse-position'
import { useRef, useState, useCallback, useEffect } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { post } from 'utils/request'

const { Dragger } = Upload
export default function AddVip() {
  const [fileList, setFileList] = useState([])
  const [dataUrl, setDataUrl] = useState<any>('')
  const [coordx, setCoordx] = useState(0)
  const [coordy, setCoordy] = useState(0)
  const mouseRef = useRef(null)
  const mouse = useMouse(mouseRef, {
    enterDelay: 100,
    leaveDelay: 100,
  })

  useEffect(() => {
    setCoordx(mouse.x)
    setCoordy(mouse.y)
  }, [mouse.isDown])

  const handleBeforeUpload = useCallback(file => {
    const freader = new FileReader()
    freader.readAsDataURL(file)
    freader.onload = () => {
      setDataUrl(freader.result as string)
      setFileList([file])
    }
    return false
  }, [])

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('file', fileList[0])
    formData.append('coordx', String(coordx))
    formData.append('coordy', String(coordy))
    const res = await post('/img/add-vip', formData)
    setDataUrl(res)
  }

  return (
    <div>
      <Dragger
        showUploadList={false}
        fileList={fileList}
        beforeUpload={handleBeforeUpload}
      >
        <div>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from
            uploading company data or other band files
          </p>
        </div>
      </Dragger>
      <div ref={mouseRef} className={sx('wrapper')}>
        <div
          className={sx('dot')}
          style={{ left: mouse.x, top: mouse.y }}
        ></div>
        <div
          className={sx('coordinate-x')}
          style={{ width: mouse.elementWidth, top: mouse.y }}
        ></div>
        <div
          className={sx('coordinate-y')}
          style={{ height: mouse.elementHeight, left: mouse.x }}
        ></div>
        <img src={dataUrl} />
      </div>
      <Button onClick={handleSubmit}>点击生成</Button>
    </div>
  )
}
