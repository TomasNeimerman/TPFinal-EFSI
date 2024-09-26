import React from 'react'
import styles from './card.module.css'

export default function Card({  titulo, descripcion, fecha}) {
  return (
    <div className={styles.card}>
      <h2 className={styles.title}>{titulo}</h2>
      <p className={styles.description}>{descripcion}</p>
      <p className={styles.date}>{fecha}</p>
    </div>
  )
}