import styles from './PerformanceOpportunities.module.css'

export default function PerformanceOpportunities() {
  return (
    <section className={`section ${styles.performanceSection}`}>
      <div className="container">
        <div className={styles.performanceContent}>
          <div className={styles.performanceText}>
            <h2 className={styles.performanceTitle}>
              Performance opportunities@Swargufan
            </h2>
            <p className={styles.performanceSubtitle}>
              You Learn and,<br/>
              You Showcase Your Talent.
            </p>
            <p className={styles.performanceDescription}>
              Every student gets to perform
            </p>
          </div>
          <div className={styles.performanceImage}>
            <div className={styles.imagePlaceholder}>
              <span>Performance Events</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

