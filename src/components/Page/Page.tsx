import React, { useState, useEffect, useRef, ReactElement, useCallback } from 'react'

import pages, { PagePayload } from '../pages'

import './Page.css'
import { setCanvasToFullScreen } from '../../utils/utils'

function Page() {
  const [currentPage, setCurrentPage] = useState<PagePayload>(pages[0])
  const [controlsVisible, setControlsVisible] = useState<boolean>(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const controlsRef = useRef<HTMLDivElement>(null)

  // @ts-ignore
  useEffect(() => {
    if (canvasRef.current && controlsRef.current) {
      const { init, createControls, clear } = currentPage.createScene(canvasRef.current as HTMLCanvasElement, controlsRef.current as HTMLDivElement)

      canvasRef.current && setCanvasToFullScreen(canvasRef.current)

      init()
      createControls()

      return clear
    }
  }, [currentPage])

  const listener = useCallback((event: KeyboardEvent) => {
    if (event.key === 'p' || event.key === 'з') {
      setControlsVisible((state) => !state)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keypress', listener)

    return () => document.removeEventListener('keypress', listener)
  },  [listener])

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    setCurrentPage(pages.find((page) => {
      return page.id === event.target.value
    }))
  }

  return (
    <div className="Page">
      <div className={`Header ${controlsVisible ? '' : 'hidden'}`}>
        <select className="pageSelect" name="pages" id="pages" onChange={onChange}>
          {
            pages.map((page) => {
              return <option key={page.id} value={page.id}>{page.name}</option>
            })
          }
        </select>
        <div className="headerControlsWrapper" ref={controlsRef} />
        <span className="headerText">press 'p' for change header visibility</span>
      </div>

      <canvas
        className="canvas"
        ref={canvasRef}
      />
    </div>
  )
}

export default Page
