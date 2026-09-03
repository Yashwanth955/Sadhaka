export const sportsList = [
  {
    id: 'cricket',
    name: 'Cricket',
    icon: 'sports-cricket',
    image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'football',
    name: 'Football',
    icon: 'sports-soccer',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'hockey',
    name: 'Hockey',
    icon: 'sports-hockey',
    image: 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'badminton',
    name: 'Badminton',
    icon: 'sports-tennis',
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'basketball',
    name: 'Basketball',
    icon: 'sports-basketball',
    image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'volleyball',
    name: 'Volleyball',
    icon: 'sports-volleyball',
    image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'wrestling',
    name: 'Wrestling',
    icon: 'sports-kabaddi',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'boxing',
    name: 'Boxing',
    icon: 'sports-mma',
    image: 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'athletics',
    name: 'Athletics',
    icon: 'directions-run',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kabaddi',
    name: 'Kabaddi',
    icon: 'groups',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'kho-kho',
    name: 'Kho-Kho',
    icon: 'directions-run',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
  },
];

export const sportsImageMap = {
  'cricket': 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80',
  'football': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
  'hockey': 'https://images.unsplash.com/photo-1580748141549-71748dbe0bdc?auto=format&fit=crop&w=800&q=80',
  'badminton': 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80',
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=800&q=80',
  'volleyball': 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=800&q=80',
  'wrestling': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'boxing': 'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?auto=format&fit=crop&w=800&q=80',
  'athletics': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  'kabaddi': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
  'kho-kho': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
  'athletics-sprint': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
  'athletics-distance': 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
  'athletics-longjump': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
  'athletics-throwing': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
};

const testDatabase = {
  '30m Sprint': { title: '30 m Sprint', category: 'Speed', duration: '~5-10s', difficulty: 'Low Difficulty', difficultyIcon: 'signal-cellular-alt-1-bar' },
  '5-10-5 Shuttle Run': { title: '5-10-5 Shuttle Run', category: 'Agility', duration: '~5-10s', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Vertical Jump': { title: 'Vertical Jump', category: 'Power', duration: '~5s', difficulty: 'High Difficulty', difficultyIcon: 'signal-cellular-alt' },
  'Push-Ups': { title: 'Push-Ups', category: 'Endurance', duration: '~1m', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Squats': { title: 'Squats', category: 'Strength', duration: '~1m', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Reaction Test': { title: 'Reaction Test', category: 'Reaction', duration: '~30s', difficulty: 'Low Difficulty', difficultyIcon: 'signal-cellular-alt-1-bar' },
  'Single-Leg Balance': { title: 'Single-Leg Balance', category: 'Stability', duration: '~30s', difficulty: 'Low Difficulty', difficultyIcon: 'signal-cellular-alt-1-bar' },
  'Shoulder Mobility': { title: 'Shoulder Mobility', category: 'Mobility', duration: '~1m', difficulty: 'Low Difficulty', difficultyIcon: 'signal-cellular-alt-1-bar' },
  'Beep Test': { title: 'Beep Test', category: 'Endurance', duration: '~5-15m', difficulty: 'High Difficulty', difficultyIcon: 'signal-cellular-alt' },
  'Lateral Movement': { title: 'Lateral Movement', category: 'Agility', duration: '~15s', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Standing Long Jump': { title: 'Standing Long Jump', category: 'Power', duration: '~5s', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Plank': { title: 'Plank', category: 'Core', duration: '~1m', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Flexibility Test': { title: 'Flexibility Test', category: 'Flexibility', duration: '~1m', difficulty: 'Low Difficulty', difficultyIcon: 'signal-cellular-alt-1-bar' },
  'Punch Speed Test': { title: 'Punch Speed Test', category: 'Speed', duration: '~30s', difficulty: 'High Difficulty', difficultyIcon: 'signal-cellular-alt' },
  'Shadow Boxing': { title: 'Shadow Boxing', category: 'Coordination', duration: '~2m', difficulty: 'High Difficulty', difficultyIcon: 'signal-cellular-alt' },
  '1.6 km Run': { title: '1.6 km Run', category: 'Endurance', duration: '~10m', difficulty: 'High Difficulty', difficultyIcon: 'signal-cellular-alt' },
  'Medicine Ball Throw': { title: 'Medicine Ball Throw', category: 'Power', duration: '~10s', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
  'Shuttle Run': { title: 'Shuttle Run', category: 'Agility', duration: '~15s', difficulty: 'Med Difficulty', difficultyIcon: 'signal-cellular-alt-2-bar' },
};

export const getTestsForSport = (sportId) => {
  const testsMapping = {
    'cricket': ['30m Sprint', '5-10-5 Shuttle Run', 'Vertical Jump', 'Push-Ups', 'Squats', 'Reaction Test', 'Single-Leg Balance', 'Shoulder Mobility'],
    'football': ['30m Sprint', '5-10-5 Shuttle Run', 'Vertical Jump', 'Squats', 'Single-Leg Balance', 'Reaction Test', 'Beep Test'],
    'hockey': ['30m Sprint', '5-10-5 Shuttle Run', 'Lateral Movement', 'Vertical Jump', 'Squats', 'Reaction Test', 'Beep Test'],
    'badminton': ['5-10-5 Shuttle Run', 'Lateral Movement', 'Reaction Test', 'Vertical Jump', '30m Sprint', 'Single-Leg Balance', 'Shoulder Mobility'],
    'basketball': ['Vertical Jump', 'Standing Long Jump', '30m Sprint', '5-10-5 Shuttle Run', 'Lateral Movement', 'Squats', 'Reaction Test', 'Beep Test'],
    'volleyball': ['Vertical Jump', 'Standing Long Jump', '30m Sprint', 'Lateral Movement', 'Squats', 'Reaction Test', 'Shoulder Mobility', 'Single-Leg Balance'],
    'wrestling': ['Squats', 'Push-Ups', 'Vertical Jump', 'Shuttle Run', 'Plank', 'Single-Leg Balance', 'Flexibility Test', 'Reaction Test'],
    'boxing': ['Reaction Test', 'Punch Speed Test', 'Shuttle Run', 'Shadow Boxing', 'Push-Ups', 'Squats', 'Plank', 'Vertical Jump'],
    'kabaddi': ['30m Sprint', 'Shuttle Run', 'Squats', 'Vertical Jump', 'Reaction Test', 'Single-Leg Balance', 'Plank', 'Beep Test'],
    'kho-kho': ['30m Sprint', 'Shuttle Run', 'Lateral Movement', 'Vertical Jump', 'Squats', 'Reaction Test', 'Single-Leg Balance', 'Beep Test'],
    'athletics-sprint': ['30m Sprint', 'Vertical Jump', 'Standing Long Jump', 'Squats', 'Reaction Test', 'Flexibility Test'],
    'athletics-distance': ['Beep Test', '1.6 km Run', 'Squats', 'Plank', 'Single-Leg Balance', 'Flexibility Test'],
    'athletics-longjump': ['30m Sprint', 'Standing Long Jump', 'Vertical Jump', 'Squats', 'Flexibility Test', 'Single-Leg Balance'],
    'athletics-throwing': ['Standing Long Jump', 'Push-Ups', 'Squats', 'Medicine Ball Throw', 'Shoulder Mobility', 'Plank'],
  };

  const testNames = testsMapping[sportId] || [];
  return testNames.map((name, index) => ({
    id: `${sportId}-test-${index}`,
    ...testDatabase[name],
    description: `AI evaluates ${testDatabase[name]?.category?.toLowerCase() || ''} metrics during the ${name}.`,
  }));
};
