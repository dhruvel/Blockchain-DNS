import styles from '@/styles/AddBlockForm.module.css';

const handleSubmit = (e) => {
    e.preventDefault();
};

export default function AddBlockForm() {
    return (
        <form className={styles.formContainer}>
            <div className={styles.input}>
                <label htmlFor="domain">Domain</label>
                <input type="text" id="domain" name="domain" className='border-glow-focus' />
            </div>
            <div className={styles.input}>
                <label htmlFor="ip">IP Address</label>
                <input type="text" id="ip" name="ip" className='border-glow-focus' />
            </div>
            <div className={styles.input}>
                <label htmlFor="ownerId">Owner ID</label>
                <input type="text" id="ownerId" name="ownerId" className='border-glow-focus' />
            </div>
            <div className={styles.input}>
                <label htmlFor="authCompanyId">Auth Company ID</label>
                <input type="text" id="authCompanyId" name="authCompanyId" disabled />
            </div>
            <div className={styles.input}>
                <label htmlFor="expiry">Expiry (Months)</label>
                <input type="text" id="expiryMonths" name="expiry" className='border-glow-focus' />
            </div>
            <button className={`${styles.submit} rainbow-bg`} onClick={handleSubmit.bind(this)}>Submit</button>
        </form>
    );
}