import Skeleton from '@/components/Skeleton';
import styles from './page.module.css';

export default function JugadorLoading() {
  return (
    <>
      <section className={styles.header}>
        <div className={`container ${styles.headerContent}`}>
          <Skeleton type="circle" width="120px" height="120px" style={{ marginBottom: '1rem', margin: '0 auto' }} />
          <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '1rem' }}>
            <Skeleton type="title" width="40%" height="50px" />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Skeleton type="text" width="80px" height="24px" />
            <Skeleton type="text" width="80px" height="24px" />
            <Skeleton type="text" width="80px" height="24px" />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <Skeleton type="box" width="100%" height="300px" style={{ borderRadius: '16px' }} />
        </div>
      </section>
    </>
  );
}
