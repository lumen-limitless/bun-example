import { createPublicClient, formatGwei, webSocket } from 'viem'
import { mainnet } from 'viem/chains'
try {
  const publicClient = createPublicClient({
    chain: mainnet,
    transport: webSocket(process.env.WSS_URL_MAINNET),
  })

  const block = await publicClient.getBlockNumber()
  const gasPrice = await publicClient.getGasPrice()

  console.log(`Block number: ${Number(block)}`)

  console.log(`Gas price: ${formatGwei(gasPrice)} gwei`)

  publicClient.watchPendingTransactions({
    onTransactions: async (txs) => {
      for (const tx of txs) {
        console.log(`Pending tx: ${tx}`)
        const data = await publicClient.getTransaction({
          hash: tx,
        })
        console.log(data)
      }
    },
  })
} catch (err) {
  console.error(err)
  process.exit(1)
}
