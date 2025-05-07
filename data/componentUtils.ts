type Specs = Record<string, any>;

// CPU
export function classifyCPUPurpose(specs: Specs): string {
  const core = Number(specs.core_count);
  const boost = Number(specs.boost_clock);
  const tdp = Number(specs.tdp);

  if (core >= 6 && boost >= 4.5) return 'Gaming';
  if (core >= 4 && boost >= 3.5 && tdp <= 65) return 'Office';
  if (core >= 8 && boost >= 4.0) return 'Design';
  return 'General';
}

export function calculateCPUScore(specs: Specs) {
  const core = Number(specs.core_count);
  const coreClock = Number(specs.core_clock);
  const boostClock = Number(specs.boost_clock);
  const tdp = Number(specs.tdp) + 1;
  const smt = specs.smt === '1' ? 0.1 : 0;
  const graphics = (specs.graphics || '').toLowerCase();
  const graphicsBonus =
    graphics.includes('iris') || graphics.includes('pro') ? 5 : graphics.includes('uhd') ? 2 : 0;

  const rawScore = ((0.4 * core + 0.4 * (coreClock * 0.6 + boostClock * 0.4)) * (1 + smt)) / tdp;
  return (rawScore + graphicsBonus).toFixed(2);
}

// Internal Hard Drive
export function classifyStoragePurpose(specs: Specs): string {
  const type = specs.type;
  const iface = specs.interface || '';
  const capacity = Number(specs.capacity);

  if (type === 'SSD' && /PCIe 4\.0|PCIe 5\.0/.test(iface)) return 'Gaming';
  if (/5400|7200/.test(type) && capacity >= 4000) return 'Storage';
  if (type === 'SSD' && /SATA/.test(iface) && capacity <= 2000) return 'Office';
  return 'General';
}

export function calculateStorageScore(specs: Specs) {
  const iface = specs.interface || '';
  const capacity = Number(specs.capacity);
  const type = specs.type;
  const price = Number(specs.price_per_gb);
  const cache = Number(specs.cache) || 0;

  const speed = /PCIe 5\.0/.test(iface)
    ? 5
    : /PCIe 4\.0/.test(iface)
      ? 4
      : /PCIe 3\.0/.test(iface)
        ? 3
        : /SATA/.test(iface)
          ? 2
          : 1;
  const typeBonus = type === 'SSD' ? 2 : 1;
  const cacheBonus = cache > 0 ? cache / 1000 : 0;

  const score = ((capacity / 1000) * speed * typeBonus + cacheBonus) / (price + 0.001);
  return score.toFixed(2);
}

// Keyboard
export function classifyKeyboardPurpose(specs: Specs): string {
  const style = (specs.style || '').toLowerCase();
  const price = Number(specs.price);
  const tenkeyless = specs.tenkeyless?.toString().toLowerCase() === 'true';

  if (style.includes('gaming') && price > 150) return 'Premium Gaming';
  if (/standard|slim|ergonomic/.test(style) && price <= 50) return 'Office/Budget';
  if (style.includes('mini') || tenkeyless) return 'Compact';
  return 'Mid-Range Gaming';
}

export function calculateKeyboardScore(specs: Specs) {
  const switches = specs.switches || '';
  const backlit = (specs.backlit || '').toLowerCase();
  const conn = (specs.connection_type || '').toLowerCase();

  const switchScore = /cherry mx|razer/i.test(switches)
    ? 1
    : /gateron|kailh/i.test(switches)
      ? 0.8
      : switches !== 'Unknown'
        ? 0.5
        : 0;
  const backlitScore = backlit.includes('rgb') ? 1 : backlit && backlit !== 'none' ? 0.7 : 0;
  const connScore = conn.includes('wireless')
    ? 1
    : conn.includes('both')
      ? 0.8
      : conn.includes('wired')
        ? 0.6
        : 0;

  const raw = (switchScore * 0.4 + backlitScore * 0.3 + connScore * 0.3) * 100;
  return raw.toFixed(2);
}

// Mouse
export function classifyMousePurpose(specs: Specs): string {
  const dpi = Number(specs.max_dpi);
  const price = Number(specs.price);
  const conn = (specs.connection_type || '').toLowerCase();

  if (dpi >= 20000 && price > 100) return 'Premium Gaming';
  if (price <= 30 && dpi <= 4000) return 'Office/Budget';
  if (conn.includes('wireless') && dpi <= 12000) return 'Portable';
  return 'Mid-Range Gaming';
}

export function calculateMouseScore(specs: Specs) {
  const dpi = Number(specs.max_dpi);
  const conn = (specs.connection_type || '').toLowerCase();

  const dpiScore = dpi / 20000;
  const connScore = conn.includes('wireless')
    ? 1
    : conn.includes('both')
      ? 0.8
      : conn.includes('wired')
        ? 0.6
        : 0;

  const raw = (dpiScore * 0.6 + connScore * 0.4) * 100;
  return raw.toFixed(2);
}

// RAM
export function classifyRAMPurpose(specs: Specs): string {
  const speed = Number(specs.speed_mhz);
  const cap = Number(specs.total_capacity);
  const latency = Number(specs.first_word_latency);

  if (speed >= 6000 && latency <= 10) return 'Gaming';
  if (speed >= 3200 && cap >= 16 && latency <= 12) return 'Office';
  if (cap >= 32 && speed >= 5600) return 'Design';
  return 'General';
}

export function calculateRAMScore(specs: Specs) {
  const speed = Number(specs.speed_mhz);
  const cas = Number(specs.cas_latency);
  const latency = Number(specs.first_word_latency);
  const cap = Number(specs.total_capacity);

  const latencyFactor = 1 / (latency + cas + 1);
  const speedBonus = speed / 6000;
  const capBonus = cap / 32;

  const raw = 0.4 * speedBonus + 0.3 * latencyFactor + 0.3 * capBonus;
  return (raw * 100).toFixed(2);
}

// Motherboard
export function classifyMotherboardPurpose(specs: Specs): string {
  const maxMem = Number(specs.max_memory);
  const slots = Number(specs.memory_slots);
  const socket = specs.socket?.toUpperCase();
  const form = specs.form_factor?.toLowerCase();

  if (maxMem >= 128 && slots >= 4 && ['AM5', 'LGA1700', 'LGA1200'].includes(socket))
    return 'Gaming';
  if (maxMem >= 64 && ['micro atx', 'mini itx'].includes(form)) return 'Office';
  if (maxMem >= 128 && slots >= 4 && ['atx', 'eatx'].includes(form)) return 'Design';
  return 'General';
}

export function calculateMotherboardScore(specs: Specs) {
  const maxMem = Number(specs.max_memory);
  const slots = Number(specs.memory_slots);
  const socket = specs.socket;

  const socketScoreMap: Record<string, number> = {
    AM5: 1.0,
    LGA1700: 1.0,
    LGA1200: 0.9,
    AM4: 0.8,
    STRX4: 0.7,
    LGA1151: 0.6,
    LGA1155: 0.4,
    LGA1156: 0.3,
    AM3: 0.2,
    LGA775: 0.1,
  };

  const memoryBonus = maxMem / 128;
  const slotBonus = slots / 4;
  const socketBonus = socketScoreMap[socket] ?? 0.5;

  const raw = 0.4 * memoryBonus + 0.3 * slotBonus + 0.3 * socketBonus;
  return (raw * 100).toFixed(2);
}

// GPU
export function classifyGPUPurpose(specs: Specs): string {
  const chipset = (specs.chipset || '').toUpperCase();
  const mem = Number(specs.memory);
  const boost = Number(specs.boost_clock);
  const price = Number(specs.price);

  if (/RTX 4090|RTX 4080|RX 7900 XTX/.test(chipset)) return 'High-End Gaming';
  if (mem >= 16 && boost >= 2000) return 'Workstation';
  if (price <= 300 && mem <= 8) return 'Budget Gaming';
  return 'Mid-Range Gaming';
}

export function calculateGPUScore(specs: Specs) {
  const clockScore = Number(specs.boost_clock) / 2500;
  const memoryScore = Number(specs.memory) / 24;
  const cudaScore = (specs.cuda_cores || 0) / 16000;

  const rawScore = (clockScore * 0.5 + memoryScore * 0.3 + cudaScore * 0.2) * 100;
  return Math.min(rawScore, 100).toFixed(2);
}
