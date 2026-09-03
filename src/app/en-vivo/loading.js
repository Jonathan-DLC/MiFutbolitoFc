import Skeleton from '@/components/Skeleton';
import styles from './page.module.css';

export default function EnVivoLoading() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <Skeleton type="text" width="220px" height="34px" style={{ borderRadius: '20px' }} />
          <Skeleton type="title" width="60%" height="80px" />
          <Skeleton type="text" width="40%" height="24px" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <Skeleton type="text" width="250px" height="32px" />
          </div>
          <div className={styles.matchGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className={styles.matchWrap}>
                <Skeleton type="box" width="100%" height="28px" style={{ borderRadius: '12px 12px 0 0', borderBottom: 'none' }} />
                <Skeleton type="box" width="100%" height="140px" style={{ borderRadius: '0 0 12px 12px' }} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
