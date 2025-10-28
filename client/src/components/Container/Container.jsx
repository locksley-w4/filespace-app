import React from 'react'
import cls from './Container.module.css'

export default function Container(props) {
  return (
    <div className={cls.Container}>{props.children}</div>
  )
}
