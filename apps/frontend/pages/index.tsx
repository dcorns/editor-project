import type { NextPage } from 'next'
import Head from 'next/head'
import { Interface } from '../src/layout'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Editor Project</title>
      </Head>
      <Interface />
    </>
  )
}

export default Home