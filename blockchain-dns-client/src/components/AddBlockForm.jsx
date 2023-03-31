import { useState } from 'react';
import styles from '@/styles/AddBlockForm.module.css';

export default function AddBlockForm({ onSubmit, authCompanyId }) {
    const [domain, setDomain] = useState('');
    const [ip, setIp] = useState('');
    const [ownerId, setOwnerId] = useState('');
    const [expiryMonths, setExpiryMonths] = useState('');
    const [error, setError] = useState(false);

    return (
        <form className={`${styles.formContainer} ${error ? styles.error : ''}`}>
            <div className={styles.input}>
                <label htmlFor="domain">Domain</label>
                <input type="text" id="domain" name="domain" className='border-glow-focus'
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                />
            </div>
            <div className={styles.input}>
                <label htmlFor="ip">IP Address</label>
                <input type="text" id="ip" name="ip" className='border-glow-focus'
                    value={ip}
                    onChange={e => setIp(e.target.value)}
                />
            </div>
            <div className={styles.input}>
                <label htmlFor="ownerId">Owner ID</label>
                <input type="text" id="ownerId" name="ownerId" className='border-glow-focus'
                    value={ownerId}
                    onChange={e => setOwnerId(e.target.value)}
                />
            </div>
            <div className={styles.input}>
                <label htmlFor="authCompanyId">Auth Company ID</label>
                <input type="text" id="authCompanyId" name="authCompanyId" disabled
                    value={authCompanyId}
                />
            </div>
            <div className={styles.input}>
                <label htmlFor="expiry">Expiry (Months)</label>
                <input type="text" id="expiryMonths" name="expiry" className='border-glow-focus'
                    value={expiryMonths}
                    onChange={e => setExpiryMonths(e.target.value)}
                />
            </div>
            <button
                className={`${styles.submit} rainbow-bg`}
                onClick={e => {
                    e.preventDefault();
                    e.disabled = true;
                    if(domain.length > 0 && ip.length > 0 && ownerId.length > 0 && expiryMonths.length > 0
                        && !isNaN(expiryMonths) && parseInt(expiryMonths) > 0 && authCompanyId.length > 0){
                        onSubmit(domain, ip, ownerId, expiryMonths);
                        setTimeout(() => {
                            setDomain('');
                            setIp('');
                            setOwnerId('');
                            setExpiryMonths('');
                            e.disabled = false;
                        }, 500);
                    }else{
                        setError(true);
                        setTimeout(() => setError(false), 200);
                    }
                }}
            >
                Submit
            </button>
        </form>
    );
}