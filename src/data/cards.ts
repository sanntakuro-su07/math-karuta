interface Card {
  id: string;
  reading: string;
  meaning: string;
  imageUrl: string;
}

export const cards: Card[] = [
  {
    id: '1',
    reading: 'さくら',
    meaning: 'Cherry Blossom',
    imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '2',
    reading: 'つき',
    meaning: 'Moon',
    imageUrl: 'https://images.unsplash.com/photo-1522441815192-d9f04eb0615c?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '3',
    reading: 'やま',
    meaning: 'Mountain',
    imageUrl: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '4',
    reading: 'うみ',
    meaning: 'Sea',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: '5',
    reading: 'あめ',
    meaning: 'Rain',
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=400'
  }
];