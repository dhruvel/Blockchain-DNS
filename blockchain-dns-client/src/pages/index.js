import Head from 'next/head'
import styles from '@/styles/Home.module.css'

import BlockCarousel from '@/components/BlockCarousel'

export default function Home() {
  return (
    <>
      <Head>
        <title>Blockchain DNS Client</title>
        <meta name="description" content="Blockchain DNS Client" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>Blockchain DNS</h1>
        <BlockCarousel />
      </main>
    </>
  )
}
