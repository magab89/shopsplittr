export interface TescoProduct {
  name: string
  price?: number
  isByKilo?: boolean
  amount: number
  total?: number
}

function processNonAvailableProductLine (line: string): TescoProduct {
  const [name, amount] = line.replaceAll(',','.').split(/\t/)
  const isByKilo = amount.includes(' kg')

  return {
    name,
    amount: isByKilo ?
      parseFloat(amount.replace(' kg', '').trim()) :
      parseInt(amount),
  }
}

function processProductLine (line: string): TescoProduct {
  const [name, price, amount, total] = line.replaceAll(',','.').split(/\t/)
  const isByKilo = amount.includes(' kg')

  return {
    name,
    isByKilo,
    amount: isByKilo ?
      parseFloat(amount.replace(' kg', '').trim()) :
      parseInt(amount),
    price: isByKilo ? parseFloat(price.replace(' / kg', '').trim()) : parseFloat(price),
    total: parseInt(total)
  }
}

export function processTescoEmail({ email }) {
  const afterATermekNemElerheto = email.split('A termék nem elérhető')[1]

  const notAvailable = afterATermekNemElerheto
    .split('Az Ön vásárlása')[0]
    .replace('Sajnáljuk! A kiválasztott termék jelenleg nem elérhető (nem számoltuk fel az árát).', '')
    .trim()
    .split(/\n/)

  const afterAzOnVasarlasa = afterATermekNemElerheto.split('Az Ön vásárlása')[1]
  const afterHeaderRow = afterAzOnVasarlasa.replace(' \tEgységár\tMennyiség\tÖsszesen', '').trim()

  const order = afterHeaderRow.split('Fizetés és kedvezmény')[0].trim()

  const orderLines = order.split(/\n/)

  const products = orderLines.map(processProductLine)
  const notAvailableProducts = notAvailable.map(processNonAvailableProductLine)

  return { products, notAvailableProducts }
}
