import styles from '@/styles/BlockCarousel.module.css';
import { useState } from 'react';
import { ImProfile } from 'react-icons/im';
import { BsShieldFillCheck, BsFillClockFill } from 'react-icons/bs';
import { VscLoading } from 'react-icons/vsc';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

export default function BlockCarousel({ blocks }) {
    const [translateX, setTranslateX] = useState(-Math.floor(blocks.length / 2));

    if(blocks.length === 0) {
        return (
            <VscLoading className='loading-circle' size={124} />
        );
    }

    return (
        <div className={styles.blockCarouselContainer}>
            <button
                className={`${styles['carousel-control']} rainbow-bg ${styles.prev} ${translateX <= -(blocks.length - 1) ? styles.disabled : ''}`}
                onClick={() => {
                    if (translateX > -(blocks.length - 1)) {
                        setTranslateX(translateX - 1);
                    }
                }}
            >
                <IoIosArrowBack size={32} color='black' />
            </button>
            <div className={styles.blockCarousel}>
                {
                    blocks.map((block, index) => (
                        <div
                            key={`${block.domain}-${block.ipAddr}`}
                            className={`${styles.block} ${blocks.length - 1 + translateX === index ? 'border-glow' : '' }`}
                            style={{
                                translate: `calc(((-250px - 30px) * ${blocks.length - 1}) + ((-500px - 60px) * ${translateX}))`
                            }}
                        >
                            <span className={styles.domain}>{block.domain}</span>
                            <span className={styles.ip}>{block.ipAddr}</span>
                            <div className={styles['info-row']}>
                                <ImProfile size={32}/>
                                <span>{block.ownerId}</span>
                            </div>
                            <div className={styles['info-row']}>
                                <BsShieldFillCheck size={32}/>
                                <span>{block.authCompanyId}</span>
                            </div>
                            <div className={styles['info-row']}>
                                <BsFillClockFill size={32}/>
                                <span>{block.expiration}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
            <button
                className={`${styles['carousel-control']} rainbow-bg ${styles.next} ${translateX >= 0 ? styles.disabled : ''}`}
                onClick={() => {
                    if (translateX < 0) {
                        setTranslateX(translateX + 1);
                    }
                }}
            >
                <IoIosArrowForward size={32} color='black' />
            </button>
        </div>
    );
}