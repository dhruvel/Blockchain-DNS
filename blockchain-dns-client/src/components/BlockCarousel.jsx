import styles from '@/styles/BlockCarousel.module.css';
import { useEffect, useState } from 'react';
import { ImProfile } from 'react-icons/im';
import { BsShieldFillCheck, BsFillClockFill } from 'react-icons/bs';

const fetchBlocks = async () => {
    return [
        {
            hash: '0x1234',
            domain: 'example.com',
            ip: '1.2.3.4',
            ipType: 'ipv4',
            ownerId: '0x1234',
            authCompanyId: '0x1234',
            timestamp: '2021-01-01',
            expiry: '2021-01-01',
        },
        {
            hash: '0x1235',
            domain: 'google.ca',
            ip: '1.2.3.5',
            ipType: 'ipv4',
            ownerId: '0x1234',
            authCompanyId: '0x1234',
            timestamp: '2021-01-01',
            expiry: '2021-01-01',
        }
    ];
};

export default function BlockCarousel() {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        const fetch = async () => {
            const blocks = await fetchBlocks();
            setBlocks(blocks);
        };
        fetch();
    }, []);

    return (
        <div className={styles.blockCarousel}>
        {
            blocks.map(block => (
                <div key={block.hash} className={styles.block}>
                    <span className={styles.domain}>{block.domain}</span>
                    <span className={styles.ip}>{block.ip}</span>
                    <div className={styles['info-row']}>
                        <ImProfile size={32}/>
                        <span>{block.ownerId}</span>
                    </div>
                </div>
            ))
        }
        </div>
    );
}