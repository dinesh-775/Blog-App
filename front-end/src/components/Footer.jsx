import * as styles from "../styles/common"

function Footer() {
  return (
    <footer className="max-w-5xl mx-auto px-6 pb-12">
      <div className={styles.divider}></div>
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className={styles.mutedText}>
          © {new Date().getFullYear()} LOGO. All rights reserved.
        </p>
        <div className="flex gap-6">
          <a href="#" className={styles.mutedText + " hover:text-[#1d1d1f] transition-colors"}>Privacy Policy</a>
          <a href="#" className={styles.mutedText + " hover:text-[#1d1d1f] transition-colors"}>Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer