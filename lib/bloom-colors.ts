import { BloomLevel } from './types';

export const bloomColors = {
  [BloomLevel.MENGINGAT]: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-200',
    ring: 'ring-blue-200',
    hover: 'hover:bg-blue-50',
    badge: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  [BloomLevel.MEMAHAMI]: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-200',
    ring: 'ring-green-200',
    hover: 'hover:bg-green-50',
    badge: 'bg-green-100 text-green-800 border-green-200'
  },
  [BloomLevel.MENERAPKAN]: {
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-200',
    ring: 'ring-orange-200',
    hover: 'hover:bg-orange-50',
    badge: 'bg-orange-100 text-orange-800 border-orange-200'
  },
  [BloomLevel.MENGANALISIS]: {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-200',
    ring: 'ring-red-200',
    hover: 'hover:bg-red-50',
    badge: 'bg-red-100 text-red-800 border-red-200'
  },
  [BloomLevel.MENGEVALUASI]: {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-200',
    ring: 'ring-purple-200',
    hover: 'hover:bg-purple-50',
    badge: 'bg-purple-100 text-purple-800 border-purple-200'
  },
  [BloomLevel.MENCIPTA]: {
    bg: 'bg-pink-100',
    text: 'text-pink-800',
    border: 'border-pink-200',
    ring: 'ring-pink-200',
    hover: 'hover:bg-pink-50',
    badge: 'bg-pink-100 text-pink-800 border-pink-200'
  }
};

export function getBloomColor(level: BloomLevel, variant: keyof typeof bloomColors[BloomLevel.MENGINGAT] = 'badge'): string {
  return bloomColors[level]?.[variant] || 'bg-gray-100 text-gray-800 border-gray-200';
}

export const bloomLevelInfo = {
  [BloomLevel.MENGINGAT]: {
    label: 'Mengingat',
    description: 'Kemampuan mengingat dan mengenali informasi',
    keywords: ['mengenali', 'mengingat', 'menyebutkan', 'mendefinisikan']
  },
  [BloomLevel.MEMAHAMI]: {
    label: 'Memahami',
    description: 'Kemampuan memahami makna dan konsep',
    keywords: ['menjelaskan', 'merangkum', 'menginterpretasi', 'mencontohkan']
  },
  [BloomLevel.MENERAPKAN]: {
    label: 'Menerapkan',
    description: 'Kemampuan menggunakan informasi dalam situasi baru',
    keywords: ['melaksanakan', 'menggunakan', 'menerapkan', 'mendemonstrasikan']
  },
  [BloomLevel.MENGANALISIS]: {
    label: 'Menganalisis',
    description: 'Kemampuan memecah informasi menjadi bagian-bagian',
    keywords: ['membandingkan', 'mengorganisasi', 'menguraikan', 'mengatribusi']
  },
  [BloomLevel.MENGEVALUASI]: {
    label: 'Mengevaluasi',
    description: 'Kemampuan menilai berdasarkan kriteria',
    keywords: ['memeriksa', 'mengkritik', 'menilai', 'memvalidasi']
  },
  [BloomLevel.MENCIPTA]: {
    label: 'Mencipta',
    description: 'Kemampuan menciptakan sesuatu yang baru',
    keywords: ['merancang', 'mengkonstruksi', 'merencanakan', 'memproduksi']
  }
};