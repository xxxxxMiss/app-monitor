import { Button, Upload, Form, Input, Slider, Switch } from 'antd'
import useMouse from '@react-hook/mouse-position'
import { useRef, useState, useCallback, useEffect } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { SketchPicker } from 'react-color'
import { post } from 'utils/request'

const { Dragger } = Upload
const { Item } = Form
export default function AddWatermark() {
  const [fileList, setFileList] = useState([])
  const [dataUrl, setDataUrl] = useState<any>('')
  const [coordx, setCoordx] = useState(0)
  const [coordy, setCoordy] = useState(0)
  const [fontSize, setFontSize] = useState('16')
  const [fillColor, setFillColor] = useState('#333')
  const [opacity, setOpacity] = useState(0.5)
  const [text, setText] = useState('Text')
  const [rotate, setRotate] = useState(0)
  const [repeat, setRepeat] = useState(false)
  const [colorPickerVisible, setColorPickerVisible] = useState(false)
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
    formData.append('fillColor', fillColor)
    formData.append('fontSize', fontSize)
    formData.append('opacity', String(opacity))
    formData.append('rotate', String(rotate))
    formData.append('repeat', String(repeat))
    formData.append('text', text)
    const res = await post('/watermark/add', formData)
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
      <Form>
        <Item label="水印内容">
          <Input value={text} onChange={e => setText(e.target.value)} />
        </Item>
        <Item label="字体大小">
          <Input value={fontSize} onChange={e => setFontSize(e.target.value)} />
        </Item>
        <Item label="字体颜色">
          <Input
            value={fillColor}
            onChange={e => setFillColor(e.target.value)}
            onFocus={() => setColorPickerVisible(true)}
          />
        </Item>
        <Item label="透明度">
          <Slider
            min={0}
            max={1}
            step={0.1}
            value={opacity}
            onChange={value => setOpacity(value)}
          />
        </Item>
        <Item label="旋转角度">
          <Slider
            min={0}
            max={360}
            step={10}
            value={rotate}
            onChange={value => setRotate(value)}
          />
        </Item>
        <Item label="开启平铺模式">
          <Switch checked={repeat} onChange={checked => setRepeat(checked)} />
        </Item>
      </Form>
      {colorPickerVisible && (
        <SketchPicker
          color={fillColor}
          onChangeComplete={color => setFillColor(color.hex)}
        />
      )}
      <Button onClick={handleSubmit}>点击生成</Button>
    </div>
  )
}
