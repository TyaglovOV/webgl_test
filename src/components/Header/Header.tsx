import React, { Dispatch, SetStateAction } from 'react'
import pages, { Pages } from '../pages'
import './Header.css'

type Props = {
  setCurrentPage: Dispatch<SetStateAction<Pages>>
}

function Header(props: Props) {
  const  { setCurrentPage } = props

  const onChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentPage(event.target.value as Pages)
  }

  return (
    <div className="Header">
      <select name="pages" id="pages" onChange={onChange}>
        {
          pages.map((page) => {
            return <option key={page.id} value={page.id}>{page.name}</option>
          })
        }
      </select>
    </div>
  )
}

export default Header
