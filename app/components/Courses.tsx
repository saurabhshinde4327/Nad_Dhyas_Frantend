import styles from './Courses.module.css'

export default function Courses() {
  const courseCategories = [
    { title: "Classical Vocal Music", icon: "🎵" },
    { title: "Harmonium", icon: "🎹" },
    { title: "Tabla", icon: "🥁" },
    { title: "Pakhawaj", icon: "🥁" },
    { title: "Flute", icon: "flute" }, // Using text as placeholder if no emoji matches perfectly, or just generic
    { title: "Sitar", icon: "🎸" },
    { title: "Sound Arrangement", icon: "🎧" },
    { title: "Bhajan", icon: "🙏" },
    { title: "Light Music", icon: "🎼" },
    { title: "Bharatanatyam", icon: "💃" },
    { title: "Kathak", icon: "🕺" }
  ]

  return (
    <section className="section" id="courses" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div className={styles.coursesGrid}>
          {courseCategories.map((category, index) => (
            <div key={index} className={styles.courseCard}>
              <div className={styles.courseHeader}>
                <div className={styles.courseIcon}>{category.icon === "flute" ? "🎵" : category.icon}</div>
                <div>
                  <h3 className={styles.courseTitle}>{category.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


