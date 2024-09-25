import Link from "next/link";
import styles from './styles.module.css'

export default function Home() {
    return (
        <div className={styles.welcomescreen}>
          <div className={styles.welcomecontent}>
            <h1 className={styles.title}>Bienvenido</h1>
            <p className={styles.text}>Estamos encantados de tenerte aquí. ¿Qué te gustaría hacer?</p>
            <div className={styles.buttoncontainer}>
              <button href="/register" className={styles.button}>
                Registrarse
              </button>
              <Link href="/login" className={styles.button}>
                Iniciar sesión
              </Link>
            </div>
          </div>
        </div>
      );
}
