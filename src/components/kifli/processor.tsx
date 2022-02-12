import { Product } from './index'

export function processKifli(order: string): Product[] {
  const byLines = order.split(/\n/)

  const productLines = byLines.filter(line => line.startsWith('Product'))

  return productLines.map(product => {
    const splitByT = product.split(/\t/)
    const name = splitByT[1]
    const amountAndPrice = splitByT[2]
    const splitByX = amountAndPrice.split('×')

    const amount = splitByX[0]
    const price = splitByX[1].trim().split(',')[0]

    return {
      name,
      amount:  parseInt(amount),
      price: parseInt(price)
    }
  })
}
