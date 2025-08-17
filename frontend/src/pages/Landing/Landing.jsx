import React from 'react'
import Navbar from '../../components/Navbar.jsx'
import landing from '../../assets/landing.jpg'
import styles from './Landing.module.css'
import { Link } from 'react-router-dom'
function Landing() {
  return (
    <div>
      <Navbar active={"home"} />
      <div className={styles.landing__wrapper}>
        <div className={styles.landing__text}>
          <h1>Schedule Your Daily Tasks With <span className="primaryText">DoDo!</span></h1>
          <div className='btnWrapper'>
            <Link to="/register" className="primaryBtn">Register</Link>
            <Link to="/login" className='secondaryBtn'>Login</Link>
          </div>
        </div>

        <div className={styles.landing__img}>
          <img src={landing} alt="landing" />
        </div>
      </div>
    </div>
  )
}

export default Landing
