import styles from './Testimonials.module.css'

export default function Testimonials() {
  const testimonials = [
    {
      name: "Oorvi Dabke",
      course: "Hindustani Vocal, UK",
      text: "I've been learning at Swargufan Music Institute for 6 years. Coming from a Western classical background, I enjoy the depth of Hindustani music. My teacher, Mani, has been fantastic for the past 5 years. She helped me transition styles with her collaborative approach. Our lessons are always fun, challenging, and rewarding."
    }
  ]

  return (
    <section className={`section ${styles.testimonialsSection}`}>
      <div className="container">
        <h2 className={styles.sectionTitle}>
          My Swargufan Experience
          <span className={styles.subtitle}>Hear from our students</span>
        </h2>
        <div className={styles.testimonialsGrid}>
          {testimonials.map((testimonial, index) => (
            <div key={index} className={styles.testimonialCard}>
              <div className={styles.quoteIcon}>"</div>
              <p className={styles.testimonialText}>{testimonial.text}</p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className={styles.authorName}>{testimonial.name}</h4>
                  <p className={styles.authorCourse}>{testimonial.course}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


