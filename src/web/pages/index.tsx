import { Button } from 'antd'
import useMouse from '@react-hook/mouse-position'
import { useRef } from 'react'

export default function Index() {
  const handleClick = () => {}
  const mouseRef = useRef(null)
  const mouse = useMouse(mouseRef, {
    enterDelay: 100,
    leaveDelay: 100,
  })
  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        sentry
      </Button>
      this is index page and hello world yes {new Date().toISOString()}
    </div>
  )
}
