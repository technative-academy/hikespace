import logo from "/src/assets/images/hike-space-logo.png";
import styles from "./SiteFooter.module.css";

function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.logo}>
        <img src={logo} alt="hike space logo" />
      </div>
      <br />
      <div className={styles.devs}>
        <h2>Dev Team</h2>
        <div className={styles.devSection}>
          <h2>Frontend</h2>
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/jo-null-burnett/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Jo
              </a>
            </li>
            <li>
              <a
                href="https://linkedin.com/in/handhwarah-abdu-muhumuza-0340321b9/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abdu
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.devSection}>
          <h2>Backend</h2>
          <ul>
            <li>
              <a
                href="https://www.linkedin.com/in/kostiantyn-semenenko-470a29239/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Kosta
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/finnian-holland-73412337a/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Finn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <br />
      <div className={styles.copyright}>
        <p>Copyright © 2026 Hike Space. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default SiteFooter;
