import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '@/styles/Home.module.css';

import BlockCarousel from '@/components/BlockCarousel';
import AddBlockForm from '@/components/AddBlockForm';
import SubmitLoad from '@/components/SubmitLoad';

export default function Home() {
  const [loading, setLoading] = useState(0);
  const [domains, setDomains] = useState([]);
  const [walletAddress, setWallet] = useState('');

  useEffect(() => {
    if(window.ethereum) {
      window.ethereum.enable().then((accounts) => {
        setWallet(accounts[0]);
      });
    }
  }, []);

  useEffect(() => {
    fetch('api/domains').then(res => {
      res.json().then(domains => {
        setDomains(domains);
      });
    });
  }, []);

  const onAddBlock = (domain, ip, ownerId, expiryMonths) => {
    setLoading(1);
    console.log(domain, ip, ownerId, expiryMonths);
    
    fetch('api/addDomain', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        domain,
        ip,
        ownerId,
        expiryMonths,
      })
    }).then(res => {
      res.json().then(data => {
        console.log(data);
        setLoading(2);
        setTimeout(() => {
          setLoading(0);
        }, 1000);
      });
    });
  };

  return (
    <>
      <Head>
        <title>Blockchain DNS Client</title>
        <meta name="description" content="Blockchain DNS Client" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        loading > 0 && <SubmitLoad disappear={loading === 2} />
      }
      <main className={styles.main}>
        <h1>Blockchain DNS</h1>
        <BlockCarousel blocks={domains} />
        <AddBlockForm onSubmit={onAddBlock.bind(this)} authCompanyId={walletAddress} />
      </main>
    </>
  )
}
