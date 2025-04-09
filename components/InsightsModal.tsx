'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Pie } from 'react-chartjs-2'
import {
  CategoryScale,
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { useMemo } from 'react'
import { formatAmount } from '@/lib/utils'

ChartJS.register(CategoryScale, ArcElement, Tooltip, Legend)

type Transaction = {
  id: string
  name: string
  amount: number
  type: string
  date: string
  category: string
  paymentChannel: string
}

type InsightsModalProps = {
  open: boolean
  setOpen: (val: boolean) => void
  transactions: Transaction[]
}

const InsightsModal = ({ open, setOpen, transactions }: InsightsModalProps) => {
  const categoryTotals = useMemo(() => {
    const totals: Record<string, number> = {}

    transactions.forEach((txn) => {
      const category = txn.category || 'Uncategorized'
      const isDebit = txn.type.toLowerCase() === 'debit'

      const normalizedAmount = isDebit ? Math.abs(txn.amount) : -Math.abs(txn.amount)

      totals[category] = (totals[category] || 0) + normalizedAmount
    })

    return Object.entries(totals).map(([name, totalAmount]) => ({
      name,
      totalAmount,
    }))
  }, [transactions])

  const chartData = useMemo(() => {
    return {
      labels: categoryTotals.map((cat) =>
        `${cat.name} (${formatAmount(cat.totalAmount)})`
      ),
      datasets: [
        {
          label: 'Amount Spent',
          data: categoryTotals.map((cat) => cat.totalAmount),
          backgroundColor: [
            '#60A5FA',
            '#F472B6',
            '#34D399',
            '#FBBF24',
            '#A78BFA',
            '#FB7185',
            '#FACC15',
            '#4ADE80',
            '#F87171',
            '#C084FC',
          ],
          borderColor: '#fff',
          borderWidth: 2,
        },
      ],
    }
  }, [categoryTotals])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity" />
      )}
      <DialogContent className="z-50 max-w-lg bg-white shadow-lg rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-semibold">
            Spending Insights
          </DialogTitle>
        </DialogHeader>
        <div className="pt-4">
          <Pie
            data={chartData}
            options={{
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      const label = context.label || ''
                      const value = context.parsed || 0
                      return `${label}: ${formatAmount(value)}`
                    },
                  },
                },
              },
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InsightsModal
