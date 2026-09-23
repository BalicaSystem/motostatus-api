import 'dotenv/config'
import { hashSync } from 'bcryptjs'
import { sql } from 'drizzle-orm'
import { db } from './index'
import {
  customers,
  motorcycles,
  orderItems,
  orders,
  users,
  type NewCustomer,
  type NewMotorcycle,
  type NewOrder,
  type NewOrderItem,
} from './schema'

const CUSTOMER_COUNT = 1000
const MOTORCYCLE_COUNT = 1000
const ORDER_COUNT = 200

const FIRST_NAMES = [
  'João',
  'Maria',
  'Antônio',
  'Francisca',
  'José',
  'Ana',
  'Francisco',
  'Luiza',
  'Paulo',
  'Carla',
  'Carlos',
  'Patrícia',
  'Pedro',
  'Juliana',
  'Lucas',
  'Amanda',
  'Marcos',
  'Fernanda',
  'Rafael',
  'Gabriela',
  'Bruno',
  'Larissa',
  'Diego',
  'Camila',
  'Thiago',
  'Beatriz',
  'Gabriel',
  'Mariana',
  'Felipe',
  'Carolina',
  'André',
  'Isabela',
  'Ricardo',
  'Vanessa',
  'Rodrigo',
  'Aline',
  'Vinícius',
  'Renata',
  'Eduardo',
  'Vanessa',
  'Leonardo',
  'Priscila',
  'Gustavo',
  'Natália',
  'Álvaro',
  'Tatiane',
  'Márcio',
  'Simone',
]

const LAST_NAMES = [
  'Silva',
  'Santos',
  'Oliveira',
  'Souza',
  'Costa',
  'Pereira',
  'Almeida',
  'Nascimento',
  'Lima',
  'Araújo',
  'Ferreira',
  'Rodrigues',
  'Alves',
  'Gomes',
  'Martins',
  'Barbosa',
  'Carvalho',
  'Rocha',
  'Ribeiro',
  'Cardoso',
  'Teixeira',
  'Moreira',
  'Correia',
  'Dias',
  'Moura',
  'Castro',
  'Mendes',
  'Vasconcelos',
  'Barros',
  'Freitas',
  'Cavalcante',
  'Monteiro',
  'Farias',
  'Bezerra',
  'Cordeiro',
  'Azevedo',
  'Braga',
  'Vieira',
  'Maia',
  'Peixoto',
]

const CITIES = [
  'Fortaleza',
  'Sobral',
  'Juazeiro do Norte',
  'Caucaia',
  'Maracanaú',
  'Crato',
  'Itapipoca',
  'Quixadá',
  'Iguatu',
  'Crateús',
  'Canindé',
  'Russas',
  'Tianguá',
  'Camocim',
  'Acaraú',
  'Baturité',
  'Maranguape',
  'Ipu',
  'Boa Viagem',
  'Morada Nova',
]

const MOTORCYCLE_MODELS = [
  'CG 160 Fan',
  'CG 160 Titan',
  'CG 160 Start',
  'Biz 110i',
  'Biz 125',
  'Pop 110i',
  'Bros 160',
  'XRE 190',
  'XRE 300 Sahara',
  'XTZ 250 Lander',
  'Ténéré 250',
  'Fazer FZ25',
  'FZ15 160',
  'Factor 150',
  'Crosser 150',
  'MT-03',
  'MT-07',
  'PCX 160',
  'Elite 125',
  'Shineray Worker 150',
]

const SELLERS = [
  'Ana Beatriz Lima',
  'Carlos Eduardo Souza',
  'Fernanda Oliveira',
  'João Pedro Costa',
  'Mariana Almeida',
  'Rafael Martins',
  'Juliana Ferreira',
  'Thiago Cavalcante',
  'Larissa Gomes',
]

const CHASSIS_CHARS = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'

function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function randomDigits(length: number): string {
  let digits = ''

  for (let i = 0; i < length; i++) {
    digits += Math.floor(Math.random() * 10).toString()
  }

  return digits
}

function randomChassis(): string {
  let chassis = ''

  for (let i = 0; i < 17; i++) {
    chassis += CHASSIS_CHARS[Math.floor(Math.random() * CHASSIS_CHARS.length)]
  }

  return chassis
}

function formatCpf(document: string): string {
  return `${document.slice(0, 3)}.${document.slice(3, 6)}.${document.slice(6, 9)}-${document.slice(9, 11)}`
}

function formatCnpj(document: string): string {
  return `${document.slice(0, 2)}.${document.slice(2, 5)}.${document.slice(5, 8)}/${document.slice(8, 12)}-${document.slice(12, 14)}`
}

function addDays(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function buildCustomers(): NewCustomer[] {
  const values: NewCustomer[] = []
  const usedDocuments = new Set<string>()

  for (let i = 0; i < CUSTOMER_COUNT; i++) {
    const isCnpj = Math.random() < 0.25

    let document: string

    do {
      document = isCnpj
        ? formatCnpj(randomDigits(14))
        : formatCpf(randomDigits(11))
    } while (usedDocuments.has(document))

    usedDocuments.add(document)

    values.push({
      name: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
      document,
      city: pick(CITIES),
    })
  }

  return values
}

function buildMotorcycles(): NewMotorcycle[] {
  const values: NewMotorcycle[] = []
  const usedChassis = new Set<string>()

  for (let i = 0; i < MOTORCYCLE_COUNT; i++) {
    let chassis: string

    do {
      chassis = randomChassis()
    } while (usedChassis.has(chassis))

    usedChassis.add(chassis)

    let status: NewMotorcycle['status']
    let estimatedArrival: string | null

    if (i < 500) {
      status = 'in_transit'
      estimatedArrival = addDays(1 + Math.floor(Math.random() * 35))
    } else if (i < 700) {
      status = 'delayed'
      estimatedArrival = addDays(-(1 + Math.floor(Math.random() * 15)))
    } else {
      status = 'arrived'
      estimatedArrival = null
    }

    values.push({
      model: pick(MOTORCYCLE_MODELS),
      chassis,
      status,
      estimatedArrival,
    })
  }

  return values
}

async function main() {
  console.log('[seed] Limpando dados existentes...')

  await db.execute(
    sql`TRUNCATE TABLE users, order_items, orders, motorcycles, customers RESTART IDENTITY CASCADE`,
  )

  await db.insert(users).values({
    name: 'Administrador',
    email: 'admin@motostatus.com.br',
    passwordHash: hashSync('MotoStatus@2026!', 10),
  })

  const customerValues = buildCustomers()
  const insertedCustomers = await db
    .insert(customers)
    .values(customerValues)
    .returning({ id: customers.id })

  const motorcycleValues = buildMotorcycles()
  const insertedMotorcycles = await db
    .insert(motorcycles)
    .values(motorcycleValues)
    .returning({ id: motorcycles.id })

  const customerIds = insertedCustomers.map((row) => row.id)
  const motorcycleIds = insertedMotorcycles.map((row) => row.id)

  const orderValues: NewOrder[] = []

  for (let i = 0; i < ORDER_COUNT; i++) {
    orderValues.push({
      customerId: pick(customerIds),
      seller: pick(SELLERS),
      billingDate:
        Math.random() < 0.6
          ? addDays(-(1 + Math.floor(Math.random() * 60)))
          : null,
    })
  }

  const insertedOrders = await db
    .insert(orders)
    .values(orderValues)
    .returning({ id: orders.id })

  const orderItemValores: NewOrderItem[] = []
  const usedMotorcycles = new Set<string>()
  const orderItemStatuses: NewOrderItem['status'][] = [
    'active',
    'released',
    'completed',
  ]
  const registrationStatuses: NewOrderItem['registrationStatus'][] = [
    'without_registration',
    'registering',
    'registered',
  ]

  for (const { id: orderId } of insertedOrders) {
    const itemCount = Math.random() < 0.3 ? 2 : 1

    for (let j = 0; j < itemCount; j++) {
      let motorcycleId: string | null = null

      for (let tries = 0; tries < 50; tries++) {
        const candidate = pick(motorcycleIds)

        if (!usedMotorcycles.has(candidate)) {
          motorcycleId = candidate
          break
        }
      }

      if (!motorcycleId) {
        continue
      }

      usedMotorcycles.add(motorcycleId)

      const registrationStatus = pick(registrationStatuses)

      orderItemValores.push({
        orderId,
        motorcycleId,
        status: pick(orderItemStatuses),
        registrationStatus,
        registrationDate:
          registrationStatus === 'registered'
            ? addDays(-(1 + Math.floor(Math.random() * 30)))
            : null,
      })
    }
  }

  await db.insert(orderItems).values(orderItemValores)

  console.log('[seed] Seed concluído:')
  console.log('[seed] Administrador:')
  console.log('[seed]   E-mail: admin@motostatus.com.br')
  console.log('[seed]   Senha: MotoStatus@2026!')
  console.log(`[seed] Clientes: ${insertedCustomers.length}`)
  console.log(`[seed] Motocicletas: ${insertedMotorcycles.length}`)
  console.log(`[seed] Pedidos: ${insertedOrders.length}`)
  console.log(`[seed] Itens de pedido: ${orderItemValores.length}`)
}

await main()

process.exit(0)
