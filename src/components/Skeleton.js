import styles from './Skeleton.module.css';

export default function Skeleton({ type = 'box', width, height, className = '', style = {} }) {
  const inlineStyles = {
    width: width || (type === 'text' ? '100%' : 'auto'),
    height: height || (type === 'text' ? '1.2rem' : '100%'),
    ...style,
  };

  return (
    <div
      className={`${styles.skeleton} ${styles[type]} ${className}`}
      style={inlineStyles}
      aria-hidden="true"
    />
  );
}
