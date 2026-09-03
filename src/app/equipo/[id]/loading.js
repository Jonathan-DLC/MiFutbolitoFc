import Skeleton from '@/components/Skeleton';
import styles from './page.module.css';

export default function EquipoLoading() {
  return (
    <>
      <section className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <Skeleton type="circle" width="100px" height="100px" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
            <Skeleton type="title" width="50%" height="50px" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Skeleton type="text" width="100px" height="24px" />
            <Skeleton type="text" width="100px" height="24px" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-title">
            <Skeleton type="text" width="180px" height="32px" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} type="box" width="100%" height="320px" />)}
          </div>
        </div>
      </section>
    </>
  );
}
