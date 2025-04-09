"use client"

import { useState, useEffect } from "react"
import { sendBlockchainTransfer, getEthereumProvider } from "@/lib/web3"
import { Loader2, CheckCircle, XCircle, Wallet } from "lucide-react"

export default function BlockchainTransferPage() {
  const [receiver, setReceiver] = useState("")
  const [amount, setAmount] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [transactionHash, setTransactionHash] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkWalletConnection = async () => {
      const provider = getEthereumProvider()
      if (provider) {
        try {
          await (window as any).ethereum.request({ method: "eth_accounts" })
          setWalletConnected(true)
        } catch (err) {
          console.error("Error checking wallet connection:", err)
        }
      }
    }
    checkWalletConnection()
  }, [])

  const connectWallet = async () => {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: "eth_requestAccounts" })
        setWalletConnected(true)
        setError("")
      } catch (err) {
        console.error("Wallet connection failed:", err)
        setError("Failed to connect wallet. Please try again.")
      }
    } else {
      setError("No Ethereum provider found. Install MetaMask and refresh the page.")
    }
  }

  const handleTransfer = async () => {
    if (!walletConnected) {
      setError("Connect your wallet first.")
      return
    }
    try {
      setIsLoading(true)
      setError("")
      const tx = await sendBlockchainTransfer(receiver, parseFloat(amount))
      setTransactionHash(tx.hash)
    } catch (error) {
      setError("Transaction failed. Check the console for errors.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="max-w-xl mx-auto p-6 mt-10">
      <div className="rounded-xl shadow-xl border bg-white dark:bg-zinc-900 dark:border-zinc-700 p-6 space-y-5">
        <h2 className="text-2xl font-semibold text-center text-zinc-800 dark:text-zinc-100 mb-2">
          🔗 Blockchain Transfer
        </h2>

        {!walletConnected ? (
          <button
            onClick={connectWallet}
            className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
          >
            <Wallet size={18} />
            Connect Wallet
          </button>
        ) : (
          <>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Receiver Wallet Address"
                className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
              />
              <input
                type="number"
                placeholder="Amount in ETH"
                className="w-full p-3 border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <button
              onClick={handleTransfer}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Processing...
                </>
              ) : (
                "Send"
              )}
            </button>
          </>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm mt-2">
            <XCircle size={18} />
            {error}
          </div>
        )}

        {transactionHash && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm mt-2 break-all">
            <CheckCircle size={18} />
            Transaction Hash: <span>{transactionHash}</span>
          </div>
        )}
      </div>
    </section>
  )
}
