
export type ComponentType = "CPU" | "Motherboard" | "RAM" | "GPU" | "Storage" | "Keyboard" | "Mouse"


export interface TPcComponent {
  id: string;
  type: ComponentType;
  name: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  specs: {
    [key: string]: string;
  };
  compatibility: string[];
}

export const pcComponents: TPcComponent[] = [
  // CPUs
  {
    id: 'cpu-1',
    type: 'CPU',
    name: 'Intel Core i9-13900K',
    description:
      'High-end desktop processor with 24 cores (8P+16E) and 32 threads, perfect for gaming and content creation.',
    price: 599.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      cores: '24 (8P+16E)',
      threads: '32',
      baseFrequency: '3.0 GHz',
      boostFrequency: '5.8 GHz',
      socket: 'LGA 1700',
      tdp: '125W',
    },
    compatibility: [
      'Intel 600 series motherboards',
      'Intel 700 series motherboards',
      'DDR5 memory',
    ],
  },
  {
    id: 'cpu-2',
    type: 'CPU',
    name: 'AMD Ryzen 9 7950X',
    description: 'Flagship AMD processor with 16 cores and 32 threads based on Zen 4 architecture.',
    price: 549.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      cores: '16',
      threads: '32',
      baseFrequency: '4.5 GHz',
      boostFrequency: '5.7 GHz',
      socket: 'AM5',
      tdp: '170W',
    },
    compatibility: ['AMD AM5 motherboards', 'DDR5 memory'],
  },
  {
    id: 'cpu-3',
    type: 'CPU',
    name: 'Intel Core i5-13600K',
    description:
      'Mid-range processor with excellent gaming performance and good multi-threading capabilities.',
    price: 319.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      cores: '14 (6P+8E)',
      threads: '20',
      baseFrequency: '3.5 GHz',
      boostFrequency: '5.1 GHz',
      socket: 'LGA 1700',
      tdp: '125W',
    },
    compatibility: [
      'Intel 600 series motherboards',
      'Intel 700 series motherboards',
      'DDR4/DDR5 memory',
    ],
  },
  {
    id: 'cpu-4',
    type: 'CPU',
    name: 'AMD Ryzen 5 7600X',
    description: 'Excellent mid-range gaming CPU with 6 cores and 12 threads.',
    price: 249.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      cores: '6',
      threads: '12',
      baseFrequency: '4.7 GHz',
      boostFrequency: '5.3 GHz',
      socket: 'AM5',
      tdp: '105W',
    },
    compatibility: ['AMD AM5 motherboards', 'DDR5 memory'],
  },

  // Motherboards
  {
    id: 'mb-1',
    type: 'Motherboard',
    name: 'ASUS ROG Maximus Z790 Hero',
    description:
      'High-end Intel motherboard with premium features for overclocking and connectivity.',
    price: 629.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      chipset: 'Intel Z790',
      socket: 'LGA 1700',
      formFactor: 'ATX',
      memorySlots: '4',
      maxMemory: '128GB',
      ramType: 'DDR5',
      pciSlots: '3x PCIe 5.0 x16',
    },
    compatibility: ['Intel 12th/13th Gen CPUs', 'DDR5 memory'],
  },
  {
    id: 'mb-2',
    type: 'Motherboard',
    name: 'MSI MPG B650 CARBON WIFI',
    description: 'Feature-rich AMD motherboard with excellent VRM for the Ryzen 7000 series.',
    price: 329.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      chipset: 'AMD B650',
      socket: 'AM5',
      formFactor: 'ATX',
      memorySlots: '4',
      maxMemory: '128GB',
      ramType: 'DDR5',
      pciSlots: '2x PCIe 5.0 x16, 1x PCIe 4.0 x16',
    },
    compatibility: ['AMD Ryzen 7000 series CPUs', 'DDR5 memory'],
  },
  {
    id: 'mb-3',
    type: 'Motherboard',
    name: 'Gigabyte B760 AORUS ELITE',
    description: 'Mid-range Intel motherboard with good features and reasonable price.',
    price: 199.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      chipset: 'Intel B760',
      socket: 'LGA 1700',
      formFactor: 'ATX',
      memorySlots: '4',
      maxMemory: '128GB',
      ramType: 'DDR4',
      pciSlots: '1x PCIe 5.0 x16, 2x PCIe 3.0 x16',
    },
    compatibility: ['Intel 12th/13th Gen CPUs', 'DDR4 memory'],
  },

  // RAM
  {
    id: 'ram-1',
    type: 'RAM',
    name: 'Corsair Vengeance RGB DDR5-6000',
    description:
      'High-performance DDR5 memory with RGB lighting and excellent overclocking potential.',
    price: 189.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      capacity: '32GB (2x16GB)',
      type: 'DDR5',
      speed: '6000MHz',
      casLatency: 'CL36',
      voltage: '1.35V',
    },
    compatibility: ['DDR5 compatible motherboards', 'Intel 12th/13th Gen', 'AMD Ryzen 7000 series'],
  },
  {
    id: 'ram-2',
    type: 'RAM',
    name: 'G.Skill Trident Z5 RGB',
    description: 'Premium DDR5 memory with sleek design and high performance.',
    price: 219.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      capacity: '32GB (2x16GB)',
      type: 'DDR5',
      speed: '6400MHz',
      casLatency: 'CL32',
      voltage: '1.4V',
    },
    compatibility: ['DDR5 compatible motherboards', 'Intel 12th/13th Gen', 'AMD Ryzen 7000 series'],
  },
  {
    id: 'ram-3',
    type: 'RAM',
    name: 'Kingston FURY Beast DDR4',
    description: 'Reliable DDR4 memory with good performance for gaming and productivity.',
    price: 89.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      capacity: '16GB (2x8GB)',
      type: 'DDR4',
      speed: '3600MHz',
      casLatency: 'CL16',
      voltage: '1.35V',
    },
    compatibility: [
      'DDR4 compatible motherboards',
      'Intel 10th/11th/12th/13th Gen',
      'AMD Ryzen 3000/5000 series',
    ],
  },

  // GPUs
  {
    id: 'gpu-1',
    type: 'GPU',
    name: 'NVIDIA RTX 4090',
    description:
      'Flagship graphics card with unmatched performance for gaming and content creation.',
    price: 1599.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      cudaCores: '16384',
      memory: '24GB GDDR6X',
      memoryBus: '384-bit',
      boostClock: '2.52 GHz',
      powerRequirement: '450W',
      ports: '3x DisplayPort 1.4, 1x HDMI 2.1',
    },
    compatibility: ['PCIe 4.0 x16 slot', '850W+ power supply recommended'],
  },
  {
    id: 'gpu-2',
    type: 'GPU',
    name: 'AMD Radeon RX 7900 XTX',
    description: 'High-end AMD graphics card with excellent performance and value.',
    price: 999.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      streamProcessors: '12288',
      memory: '24GB GDDR6',
      memoryBus: '384-bit',
      boostClock: '2.5 GHz',
      powerRequirement: '355W',
      ports: '2x DisplayPort 2.1, 1x HDMI 2.1, 1x USB-C',
    },
    compatibility: ['PCIe 4.0 x16 slot', '750W+ power supply recommended'],
  },
  {
    id: 'gpu-3',
    type: 'GPU',
    name: 'NVIDIA RTX 3050',
    description:
      'Entry-level RTX card with good 1080p gaming performance and ray tracing capabilities.',
    price: 249.99,
    rating: 4,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      cudaCores: '2560',
      memory: '8GB GDDR6',
      memoryBus: '128-bit',
      boostClock: '1.78 GHz',
      powerRequirement: '130W',
      ports: '3x DisplayPort 1.4, 1x HDMI 2.1',
    },
    compatibility: ['PCIe 4.0 x16 slot', '550W+ power supply recommended'],
  },

  // Storage
  {
    id: 'storage-1',
    type: 'Storage',
    name: 'Samsung 990 PRO NVMe SSD',
    description: 'Ultra-fast PCIe 4.0 NVMe SSD with excellent performance and reliability.',
    price: 169.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      capacity: '1TB',
      interface: 'PCIe 4.0 x4',
      formFactor: 'M.2 2280',
      readSpeed: '7450 MB/s',
      writeSpeed: '6900 MB/s',
      endurance: '600 TBW',
    },
    compatibility: ['M.2 PCIe 4.0 slot', 'M.2 PCIe 3.0 slot (with reduced speed)'],
  },
  {
    id: 'storage-2',
    type: 'Storage',
    name: 'WD Black SN850X NVMe SSD',
    description: 'High-performance NVMe SSD optimized for gaming and content creation.',
    price: 149.99,
    rating: 5,
    image: 'https://placeholder.svg?height=300&width=300',
    specs: {
      capacity: '1TB',
      interface: 'PCIe 4.0 x4',
      formFactor: 'M.2 2280',
      readSpeed: '7300 MB/s',
      writeSpeed: '6600 MB/s',
      endurance: '600 TBW',
    },
    compatibility: ['M.2 PCIe 4.0 slot', 'M.2 PCIe 3.0 slot (with reduced speed)'],
  },
  {
    id: 'storage-3',
    type: 'Storage',
    name: 'Seagate Barracuda HDD',
    description: 'Reliable hard drive for mass storage needs.',
    price: 49.99,
    rating: 4,
    image: "https://placeholder.svg?height=300&width=300",
    specs: {
      capacity: "2TB",
      interface: "SATA 6Gb/s",
      formFactor: "3.5-inch",
      rpm: "7200 RPM",
      cacheSize: "256MB",
    },
    compatibility: ["SATA port", "3.5-inch drive bay"],
  },
]

