import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import pages, { PagePayload, Pages } from '../pages'
import './Header.css'

type Props = {
  setCurrentPage: Dispatch<SetStateAction<PagePayload>>
}

function Header(props: Props) {
  const { setCurrentPage } = props

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // @ts-ignore
    setCurrentPage(pages.find((page) => {
      return page.id === event.target.value
    }))
  }



  return (
    visible ? <div className="Header">
      <select className="pageSelect" name="pages" id="pages" onChange={onChange}>
        {
          pages.map((page) => {
            return <option key={page.id} value={page.id}>{page.name}</option>
          })
        }
      </select>
    </div> : null
  )
}

export default Header
