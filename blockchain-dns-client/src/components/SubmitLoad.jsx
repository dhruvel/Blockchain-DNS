import { useState } from 'react';
import styles from '@/styles/SubmitLoad.module.css';
import { VscLoading } from 'react-icons/vsc';

export default function SubmitLoad({ disappear }) {
    return (
        <div className={styles['loading-container']}>
            <div className={`${styles.background} ${disappear ? styles.disappear : ''}`} />
            <VscLoading className={`loading-circle ${disappear ? styles.disappear : ''}`} size={124} />
        </div>
    );
}