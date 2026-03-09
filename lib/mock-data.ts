export interface Episode {
  id: string;
  title: string;
  description: string;
  season: number;
  episodeNumber: number;
  date: string;
  category: string;
  thumbnailUrl: string;
  duration: string;
  durationSeconds: number;
  viewCount: number;
}

export const CATEGORIES = [
  "Will It?",
  "Taste Test",
  "Game",
  "Challenge",
  "Experiment",
  "Food Battle",
  "Mythical Kitchen",
  "Special",
  "Interview",
  "Versus",
] as const;

export const SEASONS = Array.from({ length: 26 }, (_, i) => 26 - i);

export const MOCK_EPISODES: Episode[] = [
  {
    id: "1",
    title: "Will It Cereal? Taste Test",
    description:
      "We put unexpected foods in a bowl with milk to find out the answer to the age-old question: Will it cereal?",
    season: 26,
    episodeNumber: 2201,
    date: "2024-11-15",
    category: "Will It?",
    thumbnailUrl: "https://picsum.photos/seed/gmm1/640/360",
    duration: "18:42",
    durationSeconds: 1122,
    viewCount: 3200000,
  },
  {
    id: "2",
    title: "Blind French Fry Taste Test",
    description:
      "Can Rhett and Link identify the fast food restaurant just by tasting their french fries while blindfolded?",
    season: 26,
    episodeNumber: 2199,
    date: "2024-11-13",
    category: "Taste Test",
    thumbnailUrl: "https://picsum.photos/seed/gmm2/640/360",
    duration: "21:15",
    durationSeconds: 1275,
    viewCount: 2800000,
  },
  {
    id: "3",
    title: "Guess That Celebrity Chef's Signature Dish",
    description:
      "We try to match celebrity chefs to their most iconic dishes in this culinary guessing game.",
    season: 26,
    episodeNumber: 2197,
    date: "2024-11-11",
    category: "Game",
    thumbnailUrl: "https://picsum.photos/seed/gmm3/640/360",
    duration: "16:33",
    durationSeconds: 993,
    viewCount: 1900000,
  },
  {
    id: "4",
    title: "Eating The World's Spiciest Chip Challenge",
    description:
      "Rhett and Link take on the one chip challenge with the world's spiciest tortilla chip. Who will survive?",
    season: 25,
    episodeNumber: 2150,
    date: "2024-08-20",
    category: "Challenge",
    thumbnailUrl: "https://picsum.photos/seed/gmm4/640/360",
    duration: "22:08",
    durationSeconds: 1328,
    viewCount: 5100000,
  },
  {
    id: "5",
    title: "What Happens When You Deep Fry Everything?",
    description:
      "We deep fry items that should never be deep fried and taste test the results. Science has gone too far.",
    season: 25,
    episodeNumber: 2148,
    date: "2024-08-18",
    category: "Experiment",
    thumbnailUrl: "https://picsum.photos/seed/gmm5/640/360",
    duration: "19:55",
    durationSeconds: 1195,
    viewCount: 2400000,
  },
  {
    id: "6",
    title: "Food Battle: Pizza Edition",
    description:
      "Rhett and Link go head to head creating the ultimate pizza using mystery ingredients. Who will be crowned pizza champion?",
    season: 25,
    episodeNumber: 2145,
    date: "2024-08-15",
    category: "Food Battle",
    thumbnailUrl: "https://picsum.photos/seed/gmm6/640/360",
    duration: "24:30",
    durationSeconds: 1470,
    viewCount: 3700000,
  },
  {
    id: "7",
    title: "Josh Makes The Perfect Breakfast Burrito",
    description:
      "Mythical Chef Josh creates the ultimate breakfast burrito using techniques from around the world.",
    season: 24,
    episodeNumber: 2100,
    date: "2024-05-10",
    category: "Mythical Kitchen",
    thumbnailUrl: "https://picsum.photos/seed/gmm7/640/360",
    duration: "15:20",
    durationSeconds: 920,
    viewCount: 1800000,
  },
  {
    id: "8",
    title: "GMM 2000th Episode Special",
    description:
      "Celebrating 2000 episodes of Good Mythical Morning with special guests, surprises, and a look back at our favorite moments.",
    season: 24,
    episodeNumber: 2000,
    date: "2024-03-14",
    category: "Special",
    thumbnailUrl: "https://picsum.photos/seed/gmm8/640/360",
    duration: "35:45",
    durationSeconds: 2145,
    viewCount: 8900000,
  },
  {
    id: "9",
    title: "Gordon Ramsay Tries Our Weird Food Combos",
    description:
      "Chef Gordon Ramsay joins us to try some of the most bizarre food combinations our Mythical Beasts have suggested.",
    season: 24,
    episodeNumber: 2050,
    date: "2024-04-02",
    category: "Interview",
    thumbnailUrl: "https://picsum.photos/seed/gmm9/640/360",
    duration: "28:12",
    durationSeconds: 1692,
    viewCount: 12000000,
  },
  {
    id: "10",
    title: "Rhett vs Link: Who Can Make The Better Sandwich?",
    description:
      "In this epic versus battle, Rhett and Link compete to create the ultimate sandwich with a $100 budget.",
    season: 23,
    episodeNumber: 1950,
    date: "2023-12-08",
    category: "Versus",
    thumbnailUrl: "https://picsum.photos/seed/gmm10/640/360",
    duration: "20:45",
    durationSeconds: 1245,
    viewCount: 4200000,
  },
  {
    id: "11",
    title: "Will It Ice Cream? Taste Test",
    description:
      "We blend unusual ingredients into ice cream to discover which unexpected flavors actually work as frozen treats.",
    season: 23,
    episodeNumber: 1948,
    date: "2023-12-06",
    category: "Will It?",
    thumbnailUrl: "https://picsum.photos/seed/gmm11/640/360",
    duration: "17:30",
    durationSeconds: 1050,
    viewCount: 4500000,
  },
  {
    id: "12",
    title: "International Snack Taste Test: Japan Edition",
    description:
      "Rhett and Link try the most popular and unusual snacks from Japan for the first time.",
    season: 23,
    episodeNumber: 1940,
    date: "2023-11-28",
    category: "Taste Test",
    thumbnailUrl: "https://picsum.photos/seed/gmm12/640/360",
    duration: "23:10",
    durationSeconds: 1390,
    viewCount: 3100000,
  },
  {
    id: "13",
    title: "Guess That Sound Challenge",
    description:
      "Can Rhett and Link identify mystery sounds? From everyday objects to bizarre noises, this game tests their ears.",
    season: 22,
    episodeNumber: 1850,
    date: "2023-06-15",
    category: "Game",
    thumbnailUrl: "https://picsum.photos/seed/gmm13/640/360",
    duration: "14:55",
    durationSeconds: 895,
    viewCount: 2600000,
  },
  {
    id: "14",
    title: "Eating Only Gas Station Food For 24 Hours",
    description:
      "Rhett and Link can only eat food from gas stations for an entire day. Will they find hidden gems or total disasters?",
    season: 22,
    episodeNumber: 1845,
    date: "2023-06-10",
    category: "Challenge",
    thumbnailUrl: "https://picsum.photos/seed/gmm14/640/360",
    duration: "26:40",
    durationSeconds: 1600,
    viewCount: 6300000,
  },
  {
    id: "15",
    title: "Can We Make Water Taste Like Soda?",
    description:
      "Using science and creativity, we attempt to make plain water taste exactly like popular sodas without any sugar.",
    season: 21,
    episodeNumber: 1750,
    date: "2023-01-20",
    category: "Experiment",
    thumbnailUrl: "https://picsum.photos/seed/gmm15/640/360",
    duration: "18:05",
    durationSeconds: 1085,
    viewCount: 3400000,
  },
  {
    id: "16",
    title: "Food Battle: Taco Tuesday Showdown",
    description:
      "It's taco Tuesday and Rhett and Link must create the most creative tacos using only ingredients from a mystery box.",
    season: 21,
    episodeNumber: 1745,
    date: "2023-01-15",
    category: "Food Battle",
    thumbnailUrl: "https://picsum.photos/seed/gmm16/640/360",
    duration: "21:50",
    durationSeconds: 1310,
    viewCount: 2900000,
  },
  {
    id: "17",
    title: "Will It Smoothie? Taste Test",
    description:
      "We blend things that should never go in a blender to answer the question: Will it smoothie?",
    season: 20,
    episodeNumber: 1650,
    date: "2022-09-05",
    category: "Will It?",
    thumbnailUrl: "https://picsum.photos/seed/gmm17/640/360",
    duration: "19:20",
    durationSeconds: 1160,
    viewCount: 5800000,
  },
  {
    id: "18",
    title: "MrBeast Joins Us For The Ultimate Food Challenge",
    description:
      "MrBeast stops by to take on Rhett and Link in the most extreme food challenge we've ever attempted on the show.",
    season: 20,
    episodeNumber: 1640,
    date: "2022-08-25",
    category: "Interview",
    thumbnailUrl: "https://picsum.photos/seed/gmm18/640/360",
    duration: "30:15",
    durationSeconds: 1815,
    viewCount: 15000000,
  },
];

export function formatViewCount(count: number): string {
  if (count >= 1_000_000) {
    return `${(count / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  if (count >= 1_000) {
    return `${(count / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  }
  return count.toString();
}
