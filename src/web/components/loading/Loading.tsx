import { Spin } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import './Loading.less'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

export default function Loading() {
  return <Spin indicator={antIcon} size="large" delay={300} />
}
