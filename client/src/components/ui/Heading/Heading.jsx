import React from 'react'
import styles from './Heading.module.css'

export default function Heading(props) {
  return (
    <h2 className={styles.Heading}>{props.children}</h2>
  )
}
