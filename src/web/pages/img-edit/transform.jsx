import { Button, Upload, Form, Input, Slider, Switch, Radio } from 'antd'
import { useRef, useState, useCallback, useEffect } from 'react'
import { InboxOutlined } from '@ant-design/icons'
import { post, get } from 'utils/request'

const { Dragger } = Upload
export default function TransformImage() {
  const [fileList, setFileList] = useState([])
  const [dataUrl, setDataUrl] = useState()
  const [vipKey, setVipKey] = useState('')
  const [round, setRound] = useState(0)
  const [size, setSize] = useState()
  const [radius, setRadius] = useState()
  const [rectRadius, setRectRadius] = useState()

  const handleBeforeUpload = useCallback(file => {
    const freader = new FileReader()
    freader.readAsDataURL(file)
    freader.onload = () => {
      setDataUrl(freader.result)
      setFileList([file])
    }
    return false
  }, [])

  const handleSubmit = async () => {
    const formData = new FormData()
    formData.append('file', fileList[0])
    const res = await post('/img/transform-pdf', formData)
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
      <div className={sx('wrapper')}>
        <img src={dataUrl} />
      </div>
      <Radio.Group value={round} onChange={e => setRound(e.target.value)}>
        <Radio value={0}>方形</Radio>
        <Radio value={1}>圆形</Radio>
      </Radio.Group>
      {round === 0 ? (
        <>
          <Input
            placeholder="方形尺寸，默认100"
            value={size}
            onChange={e => setSize(e.target.value)}
          />
          <Input
            placeholder="方形圆角半径，默认10"
            value={rectRadius}
            onChange={e => setRectRadius(e.target.value)}
          />
        </>
      ) : (
        <Input
          placeholder="圆形半径，默认50"
          value={radius}
          onChange={e => setRadius(e.target.value)}
        />
      )}
      <Button onClick={handleSubmit}>点击生成</Button>
    </div>
  )
}
