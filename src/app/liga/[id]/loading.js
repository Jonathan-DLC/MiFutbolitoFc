import Skeleton from '@/components/Skeleton';
import styles from './page.module.css';

export default function LigaLoading() {
  return (
    <>
      <section className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <Skeleton type="circle" width="80px" height="80px" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
            <Skeleton type="title" width="40%" height="60px" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <Skeleton type="text" width="60%" height="24px" />
            <Skeleton type="text" width="55%" height="24px" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <Skeleton type="text" width="200px" height="32px" />
          </div>
          <Skeleton type="box" width="100%" height="400px" />
        </div>
      </section>
      
      <section className="section">
        <div className="container">
          <div className="section-title">
            <Skeleton type="text" width="200px" height="32px" />
          </div>
          <div className={styles.matchGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
             {[1, 2, 3, 4].map(i => <Skeleton key={i} type="box" width="100%" height="150px" />)}
          </div>
        </div>
      </section>
    </>
  );
}
