import { Button } from 'antd'
export default function Index() {
  const handleClick = () => {}
  return (
    <div>
      <Button type="primary" onClick={handleClick}>
        sentry
      </Button>
      this is index page and hello world yes {new Date().toISOString()}
    </div>
  )
}
