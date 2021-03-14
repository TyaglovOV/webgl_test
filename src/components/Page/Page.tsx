import React, { useState, useEffect, useRef } from 'react'

import Header from '../Header/Header'
import pages, { Pages } from '../pages'

import './Page.css'

function Page() {
  const [currentPage, setCurrentPage] = useState<Pages>(Pages.VectorField)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // @ts-ignore
  useEffect(() => {
    const page = pages.find((page) => {
      return page.id === currentPage
    })!

    const [init, clear] = page.body

    init(canvasRef.current as HTMLCanvasElement)

    return clear
  }, [currentPage])

  return (
    <div className="Page">
      <Header
        setCurrentPage={setCurrentPage}
      />

      <canvas
        className="canvas"
        ref={canvasRef}
      />
    </div>
  )
}

export default Page
