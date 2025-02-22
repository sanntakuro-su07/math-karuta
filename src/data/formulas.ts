interface Formula {
  id: string;
  problem: string;
  formula: string;
  imageUrl: string;
}

export const formulas: Formula[] = [
  {
    id: '1',
    problem: '2次方程式の解の公式は？',
    formula: 'x = -b ± √(b² - 4ac) / 2a',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    problem: '三角形の面積の公式は？',
    formula: 'S = (1/2)ah',
    imageUrl: 'https://images.unsplash.com/photo-1647427060118-4911c9821b82?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    problem: '三平方の定理は？',
    formula: 'a² + b² = c²',
    imageUrl: 'https://images.unsplash.com/photo-1648737963030-73f24b16b441?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    problem: '円の面積の公式は？',
    formula: 'S = πr²',
    imageUrl: 'https://images.unsplash.com/photo-1649943075763-ad7c35870c3f?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    problem: '相似比と面積比の関係は？',
    formula: 'S₁:S₂ = k²',
    imageUrl: 'https://images.unsplash.com/photo-1648737963503-1a26da876aca?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '6',
    problem: '等差数列の和の公式は？',
    formula: 'Sn = n(a₁ + aₙ)/2',
    imageUrl: 'https://images.unsplash.com/photo-1648737963540-306235c8170e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '7',
    problem: '等比数列の和の公式は？',
    formula: 'Sn = a(1-rⁿ)/(1-r)',
    imageUrl: 'https://images.unsplash.com/photo-1648737962619-16e5cd465d2b?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '8',
    problem: '三角関数の相互関係は？',
    formula: 'sin²θ + cos²θ = 1',
    imageUrl: 'https://images.unsplash.com/photo-1648737962984-329ed8aba72d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '9',
    problem: '対数の性質は？',
    formula: 'log_a(MN) = log_aM + log_aN',
    imageUrl: 'https://images.unsplash.com/photo-1648737963030-73f24b16b441?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '10',
    problem: '微分の公式は？',
    formula: '(x^n)′ = nx^(n-1)',
    imageUrl: 'https://images.unsplash.com/photo-1648737962847-1a2403bcb19e?auto=format&fit=crop&q=80&w=400'
  }
];