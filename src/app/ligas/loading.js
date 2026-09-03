import Skeleton from '@/components/Skeleton';
import styles from './page.module.css';

export default function LigasLoading() {
  return (
    <div className={styles.page}>
      <section className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <Skeleton type="text" width="150px" height="30px" style={{ borderRadius: '20px' }} />
          <Skeleton type="title" width="80%" height="80px" />
          <Skeleton type="text" width="50%" height="20px" />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className={styles.leaguesGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={styles.leagueCard} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <Skeleton type="circle" width="56px" height="56px" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <Skeleton type="text" width="80%" height="24px" />
                    <Skeleton type="text" width="40%" height="16px" />
                  </div>
                </div>
                
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Skeleton type="box" width="100%" height="32px" />
                  <Skeleton type="box" width="100%" height="32px" />
                  <Skeleton type="box" width="100%" height="32px" />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <Skeleton type="text" width="80px" height="16px" />
                  <Skeleton type="text" width="20px" height="16px" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
