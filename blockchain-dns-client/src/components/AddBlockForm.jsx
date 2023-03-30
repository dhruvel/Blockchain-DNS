import styles from '@/styles/AddBlockForm.module.css';

export default function AddBlockForm() {
    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <div className={styles.input}>
                    <label htmlFor="domain">Domain</label>
                    <input type="text" id="domain" name="domain" />
                </div>
                <div className={styles.input}>
                    <label htmlFor="ip">IP</label>
                    <input type="text" id="ip" name="ip" />
                </div>
                <div className={styles.input}>
                    <label htmlFor="ipType">IP Type</label>
                    <input type="text" id="ipType" name="ipType" />
                </div>
                <div className={styles.input}>
                    <label htmlFor="ownerId">Owner ID</label>
                    <input type="text" id="ownerId" name="ownerId" />
                </div>
                <div className={styles.input}>
                    <label htmlFor="authCompanyId">Auth Company ID</label>
                    <input type="text" id="authCompanyId" name="authCompanyId" />
                </div>
                <div className={styles.input}>
                    <label htmlFor="timestamp">Timestamp</label>
                    <input type="text" id="timestamp" name="timestamp" />
                </div>
                <div className={styles.input}>
                    <label htmlFor="expiry">Expiry</label>
                    <input type="text" id="expiry" name="expiry" />
                </div>
                <button className={styles.submit}>Submit</button>
            </div>
        </div>
    );
}