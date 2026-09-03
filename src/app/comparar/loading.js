import Skeleton from '@/components/Skeleton';
import styles from './page.module.css';

export default function CompararLoading() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <Skeleton type="text" width="220px" height="34px" style={{ borderRadius: '20px' }} />
          <Skeleton type="title" width="60%" height="80px" />
          <Skeleton type="text" width="50%" height="24px" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.compareLayout}>
            <div className={styles.selectRow}>
              {/* Fake Jugador 1 */}
              <div className={styles.selectPanel}>
                <Skeleton type="text" width="80px" height="16px" />
                <Skeleton type="box" width="100%" height="48px" />
              </div>

              {/* Fake VS */}
              <div className={styles.vsCenter}>
                <Skeleton type="circle" width="56px" height="56px" />
              </div>

              {/* Fake Jugador 2 */}
              <div className={styles.selectPanel}>
                <Skeleton type="text" width="80px" height="16px" />
                <Skeleton type="box" width="100%" height="48px" />
              </div>
            </div>
            
            <Skeleton type="box" width="100%" height="150px" style={{ marginTop: '2rem' }} />
          </div>
        </div>
      </section>
    </div>
  );
}
