import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';

interface User {
  id: string;
  username: string;
  avatar: string;
  balance: number;
}

interface CrashPlayer {
  username: string;
  bet: number;
  cashOut?: number;
  status: 'waiting' | 'playing' | 'cashed' | 'crashed';
}

interface DoublePlayer {
  username: string;
  bet: number;
  multiplier: number;
  won?: boolean;
  payout?: number;
}

type DoublePhase = 'betting' | 'spinning' | 'result';

type CrashPhase = 'betting' | 'flying' | 'crashed';

type GameMode = 'cases' | 'exchange' | 'contracts' | 'roulette' | 'crash' | 'wheel' | 'defuse' | 'double' | 'mines';

interface CSItem {
  name: string;
  weapon: string;
  type: 'weapon' | 'knife' | 'gloves' | 'sticker' | 'agent' | 'graffiti' | 'charm' | 'patch' | 'musickit' | 'case';
  rarity: 'consumer' | 'industrial' | 'milspec' | 'restricted' | 'classified' | 'covert' | 'knife' | 'extraordinary' | 'contraband';
  condition?: 'BS' | 'WW' | 'FT' | 'MW' | 'FN';
  price: number;
  image: string;
  float?: number;
  collection?: string;
}

const Index: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<GameMode>('cases');
  const [isLoading, setIsLoading] = useState(false);
  const [crashMultiplier, setCrashMultiplier] = useState(1.00);
  const [crashPhase, setCrashPhase] = useState<CrashPhase>('betting');
  const [crashHistory, setCrashHistory] = useState<number[]>([1.24, 3.67, 1.89, 15.23, 2.11]);
  const [bettingTimeLeft, setBettingTimeLeft] = useState(10);
  const [crashPlayers, setCrashPlayers] = useState<CrashPlayer[]>([
    { username: 'Pro_Gamer', bet: 100, status: 'waiting' },
    { username: 'LuckyShot', bet: 250, status: 'waiting' },
    { username: 'CrashMaster', bet: 50, status: 'waiting' },
    { username: 'BigWinner', bet: 500, status: 'waiting' },
    { username: 'FastHands', bet: 75, status: 'waiting' }
  ]);
  const [searchPrice, setSearchPrice] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [filteredItems, setFilteredItems] = useState<CSItem[]>([]);
  const [userBet, setUserBet] = useState('');
  const [crashUserBet, setCrashUserBet] = useState('');
  const [doublePhase, setDoublePhase] = useState<DoublePhase>('betting');
  const [doublePlayers, setDoublePlayers] = useState<DoublePlayer[]>([]);
  const [doubleResult, setDoubleResult] = useState<number>(2);
  const [doubleTimeLeft, setDoubleTimeLeft] = useState(15);
  const doubleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const crashIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const bettingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleSteamLogin = async () => {
    setIsLoading(true);
    // Simulate Steam login
    setTimeout(() => {
      setUser({
        id: '76561198123456789',
        username: 'Pro_Gamer_2024',
        avatar: 'https://avatars.steamstatic.com/f3b09d1dcdcf6e4a2d2e2a2a2a2a2a2a_full.jpg',
        balance: 15000
      });
      setIsLoading(false);
    }, 1500);
  };

  const gameContent = {
    cases: {
      title: 'Кейсы',
      description: 'Открывайте кейсы и получайте редкие скины',
      items: [
        { name: 'Spectrum Case', price: 100, rarity: 'common' },
        { name: 'Dragon Lore Case', price: 500, rarity: 'legendary' },
        { name: 'Knife Collection', price: 1000, rarity: 'mythical' }
      ]
    },
    exchange: {
      title: 'Обменник',
      description: 'Обменивайте баланс на предметы Counter-Strike',
      items: [
        // Ножи
        { name: 'Doppler', weapon: 'Karambit', type: 'knife', rarity: 'knife', condition: 'FN', price: 125000, image: '', float: 0.02 },
        { name: 'Fade', weapon: 'Butterfly Knife', type: 'knife', rarity: 'knife', condition: 'FN', price: 89000, image: '', float: 0.01 },
        { name: 'Tiger Tooth', weapon: 'M9 Bayonet', type: 'knife', rarity: 'knife', condition: 'FN', price: 67000, image: '', float: 0.03 },
        { name: 'Crimson Web', weapon: 'Bayonet', type: 'knife', rarity: 'knife', condition: 'MW', price: 45000, image: '', float: 0.12 },
        
        // Перчатки
        { name: 'Pandora\'s Box', weapon: 'Sport Gloves', type: 'gloves', rarity: 'extraordinary', condition: 'FT', price: 12000, image: '', float: 0.25 },
        { name: 'Superconductor', weapon: 'Driver Gloves', type: 'gloves', rarity: 'extraordinary', condition: 'MW', price: 8500, image: '', float: 0.08 },
        { name: 'Vice', weapon: 'Specialist Gloves', type: 'gloves', rarity: 'extraordinary', condition: 'FT', price: 6200, image: '', float: 0.20 },
        
        // Винтовки
        { name: 'Dragon Lore', weapon: 'AWP', type: 'weapon', rarity: 'contraband', condition: 'FT', price: 45000, image: '', float: 0.25 },
        { name: 'Asiimov', weapon: 'AWP', type: 'weapon', rarity: 'covert', condition: 'FT', price: 8900, image: '', float: 0.23 },
        { name: 'Redline', weapon: 'AK-47', type: 'weapon', rarity: 'classified', condition: 'FT', price: 2850, image: '', float: 0.25 },
        { name: 'Vulcan', weapon: 'AK-47', type: 'weapon', rarity: 'classified', condition: 'MW', price: 3400, image: '', float: 0.12 },
        { name: 'Fire Serpent', weapon: 'AK-47', type: 'weapon', rarity: 'covert', condition: 'FT', price: 12500, image: '', float: 0.18 },
        { name: 'Howl', weapon: 'M4A4', type: 'weapon', rarity: 'contraband', condition: 'FT', price: 25000, image: '', float: 0.16 },
        { name: 'Neo-Noir', weapon: 'M4A4', type: 'weapon', rarity: 'covert', condition: 'MW', price: 4200, image: '', float: 0.08 },
        
        // Пистолеты
        { name: 'Fade', weapon: 'Glock-18', type: 'weapon', rarity: 'restricted', condition: 'FN', price: 850, image: '', float: 0.01 },
        { name: 'Hypnotic', weapon: 'Nova', type: 'weapon', rarity: 'milspec', condition: 'FN', price: 180, image: '', float: 0.01 },
        { name: 'Deagle Blaze', weapon: 'Desert Eagle', type: 'weapon', rarity: 'restricted', condition: 'FN', price: 1200, image: '', float: 0.02 },
        
        // Наклейки
        { name: 'Katowice 2014', weapon: 'Titan (Holo)', type: 'sticker', rarity: 'extraordinary', price: 75000, image: '', collection: 'Katowice 2014' },
        { name: 'Katowice 2014', weapon: 'iBUYPOWER (Holo)', type: 'sticker', rarity: 'extraordinary', price: 150000, image: '', collection: 'Katowice 2014' },
        { name: 'Crown (Foil)', weapon: 'Crown', type: 'sticker', rarity: 'extraordinary', price: 3500, image: '', collection: 'Craftsmanship' },
        { name: 'Howling Dawn', weapon: 'Howling Dawn', type: 'sticker', rarity: 'extraordinary', price: 8500, image: '', collection: 'Contraband' },
        
        // Агенты
        { name: 'Sir Bloody Miami Darryl', weapon: 'The Professionals', type: 'agent', rarity: 'extraordinary', price: 4500, image: '' },
        { name: 'Cmdr. Mae \'Dead Cold\' Jamison', weapon: 'SWAT', type: 'agent', rarity: 'extraordinary', price: 3200, image: '' },
        { name: 'Prof. Shahmat', weapon: 'Elite Crew', type: 'agent', rarity: 'classified', price: 1800, image: '' },
        
        // Граффити
        { name: 'Sealed', weapon: 'Lambda', type: 'graffiti', rarity: 'classified', price: 45, image: '' },
        { name: 'Sealed', weapon: 'Nuke', type: 'graffiti', rarity: 'restricted', price: 85, image: '' },
        { name: 'Sealed', weapon: 'GGWP', type: 'graffiti', rarity: 'milspec', price: 25, image: '' },
        
        // Брелки
        { name: 'Dust II Pin', weapon: 'Genuine Pin', type: 'charm', rarity: 'extraordinary', price: 2500, image: '' },
        { name: 'Inferno Pin', weapon: 'Genuine Pin', type: 'charm', rarity: 'extraordinary', price: 1800, image: '' },
        { name: 'Mirage Pin', weapon: 'Genuine Pin', type: 'charm', rarity: 'classified', price: 950, image: '' },
        
        // Патчи
        { name: 'Skill Groups', weapon: 'Global Elite', type: 'patch', rarity: 'classified', price: 750, image: '' },
        { name: 'Op. Hydra', weapon: 'Guardian', type: 'patch', rarity: 'restricted', price: 320, image: '' },
        
        // Музыкальные наборы
        { name: 'StatTrak™', weapon: 'MOLOTOV', type: 'musickit', rarity: 'classified', price: 850, image: '' },
        { name: 'Daniel Sadowski', weapon: 'The 8-Bit Kit', type: 'musickit', rarity: 'restricted', price: 450, image: '' },
        
        // Кейсы
        { name: 'Revolution Case', weapon: 'Revolution Case', type: 'case', rarity: 'consumer', price: 15, image: '' },
        { name: 'Recoil Case', weapon: 'Recoil Case', type: 'case', rarity: 'consumer', price: 8, image: '' }
      ]
    },
    contracts: {
      title: 'Контракты',
      description: 'Обменивайте скины на лучшие предметы',
      items: [
        { name: 'AK-47 → M4A4', success: 85 },
        { name: 'Pistol → Rifle', success: 65 },
        { name: 'Knife Upgrade', success: 45 }
      ]
    },
    roulette: {
      title: 'Рулетка',
      description: 'Классическая рулетка с тремя цветами',
      multipliers: { red: 2, black: 2, green: 14 }
    },
    crash: {
      title: 'Краш',
      description: 'Делайте ставки и забирайте выигрыш до краша',
      currentMultiplier: crashMultiplier,
      phase: crashPhase,
      timeLeft: bettingTimeLeft
    },
    double: {
      title: 'Дабл',
      description: 'Делайте ставки на множители и удваивайте выигрыш',
      multipliers: [2, 3, 4, 10, 50],
      timeLeft: doubleTimeLeft,
      phase: doublePhase,
      result: doubleResult
    },
    defuse: {
      title: 'Дефьюз',
      description: 'Успейте обезвредить бомбу до взрыва',
      timeLeft: 45,
      wires: ['red', 'blue', 'yellow', 'green']
    },
    mines: {
      title: 'Мины',
      description: 'Найдите алмазы, избегая мин',
      gridSize: '5x5',
      minesCount: 5
    }
  };

  // Crash game logic
  const generateCrashPoint = () => {
    const rand = Math.random();
    if (rand < 0.5) return Math.random() * 2 + 1; // 50% chance for 1x-3x
    if (rand < 0.8) return Math.random() * 8 + 2; // 30% chance for 2x-10x
    if (rand < 0.95) return Math.random() * 40 + 10; // 15% chance for 10x-50x
    return Math.random() * 50 + 50; // 5% chance for 50x-100x
  };

  const generateRandomPlayers = () => {
    const names = ['GamerPro', 'LuckyOne', 'CrashKing', 'BigBet', 'QuickCash', 'RiskTaker', 'WinnerX', 'BetMaster'];
    const count = Math.floor(Math.random() * 4) + 3; // 3-6 players
    return Array.from({ length: count }, (_, i) => ({
      username: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
      bet: Math.floor(Math.random() * 900) + 100, // 100-1000
      status: 'waiting' as const
    }));
  };

  const startBettingPhase = () => {
    setCrashPhase('betting');
    setBettingTimeLeft(10);
    setCrashMultiplier(1.00);
    setCrashPlayers(generateRandomPlayers());
    
    bettingIntervalRef.current = setInterval(() => {
      setBettingTimeLeft(prev => {
        if (prev <= 1) {
          if (bettingIntervalRef.current) {
            clearInterval(bettingIntervalRef.current);
          }
          startCrashFlight();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startCrashFlight = () => {
    setCrashPhase('flying');
    setCrashPlayers(prev => prev.map(p => ({ ...p, status: 'playing' })));
    
    const crashPoint = generateCrashPoint();
    const duration = Math.min(crashPoint * 1000, 15000); // Max 15 seconds
    const startTime = Date.now();
    
    crashIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;
      
      if (progress >= 1) {
        // Crash!
        setCrashPhase('crashed');
        setCrashHistory(prev => [crashPoint, ...prev.slice(0, 4)]);
        
        // Update players and pay winners
        setCrashPlayers(prev => prev.map(p => {
          if (p.status === 'cashed') {
            // Player already cashed out - they won
            return p;
          } else {
            // Player didn't cash out - they lost
            return { ...p, status: 'crashed' };
          }
        }));
        
        if (crashIntervalRef.current) {
          clearInterval(crashIntervalRef.current);
        }
        // Start new betting phase after 3 seconds
        setTimeout(() => startBettingPhase(), 3000);
      } else {
        const currentMult = 1 + (crashPoint - 1) * progress;
        setCrashMultiplier(currentMult);
        
        // Simulate some players cashing out
        setCrashPlayers(prev => prev.map(p => {
          if (p.status === 'playing' && Math.random() < 0.01 && currentMult > 1.5) {
            return { ...p, status: 'cashed', cashOut: currentMult };
          }
          return p;
        }));
      }
    }, 50);
  };

  useEffect(() => {
    // Auto start crash game
    setTimeout(() => startBettingPhase(), 2000);
    // Auto start double game
    setTimeout(() => startDoubleBetting(), 1000);
    
    return () => {
      if (crashIntervalRef.current) {
        clearInterval(crashIntervalRef.current);
      }
      if (bettingIntervalRef.current) {
        clearInterval(bettingIntervalRef.current);
      }
      if (doubleIntervalRef.current) {
        clearInterval(doubleIntervalRef.current);
      }
    };
  }, []);

  // Filter and sort items
  useEffect(() => {
    let items = [...gameContent.exchange.items];
    
    // Filter by price
    if (searchPrice) {
      const maxPrice = parseInt(searchPrice);
      if (!isNaN(maxPrice)) {
        items = items.filter(item => item.price <= maxPrice);
      }
    }
    
    // Sort by price
    items.sort((a, b) => {
      return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
    
    setFilteredItems(items);
  }, [searchPrice, sortOrder, gameContent.exchange.items]);

  // Double game logic
  const generateDoublePlayers = () => {
    const names = ['DoubleMaster', 'LuckyBet', 'RiskPlayer', 'BigMulti', 'QuickWin'];
    const count = Math.floor(Math.random() * 5) + 3;
    return Array.from({ length: count }, (_, i) => ({
      username: names[Math.floor(Math.random() * names.length)] + Math.floor(Math.random() * 100),
      bet: Math.floor(Math.random() * 800) + 200,
      multiplier: [2, 3, 4, 10, 50][Math.floor(Math.random() * 5)]
    }));
  };

  const startDoubleBetting = () => {
    setDoublePhase('betting');
    setDoubleTimeLeft(15);
    setDoublePlayers(generateDoublePlayers());
    
    doubleIntervalRef.current = setInterval(() => {
      setDoubleTimeLeft(prev => {
        if (prev <= 1) {
          if (doubleIntervalRef.current) {
            clearInterval(doubleIntervalRef.current);
          }
          startDoubleSpinning();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const startDoubleSpinning = () => {
    setDoublePhase('spinning');
    
    // Generate result based on probabilities
    const rand = Math.random();
    let result;
    if (rand < 0.4) result = 2;
    else if (rand < 0.7) result = 3;
    else if (rand < 0.85) result = 4;
    else if (rand < 0.97) result = 10;
    else result = 50;
    
    setDoubleResult(result);
    
    setTimeout(() => {
      setDoublePhase('result');
      setDoublePlayers(prev => prev.map(p => {
        const won = p.multiplier === result;
        const payout = won ? p.bet * p.multiplier : 0;
        
        // Pay out winnings to user if they won
        if (won && user && p.username === user.username) {
          setUser(prevUser => prevUser ? { ...prevUser, balance: prevUser.balance + payout } : null);
        }
        
        return { ...p, won, payout };
      }));
      
      setTimeout(() => startDoubleBetting(), 5000);
    }, 3000);
  };

  const placeBetDouble = (multiplier: number) => {
    if (!user || !userBet || doublePhase !== 'betting') return;
    
    const betAmount = parseInt(userBet);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > user.balance) return;
    
    setUser(prev => prev ? { ...prev, balance: prev.balance - betAmount } : null);
    setDoublePlayers(prev => [...prev, {
      username: user.username,
      bet: betAmount,
      multiplier: multiplier
    }]);
    setUserBet('');
  };

  const placeBetCrash = () => {
    if (!user || !crashUserBet || crashPhase !== 'betting') return;
    
    const betAmount = parseInt(crashUserBet);
    if (isNaN(betAmount) || betAmount <= 0 || betAmount > user.balance) return;
    
    setUser(prev => prev ? { ...prev, balance: prev.balance - betAmount } : null);
    setCrashPlayers(prev => [...prev, {
      username: user.username,
      bet: betAmount,
      status: 'waiting'
    }]);
    setCrashUserBet('');
  };

  const cashOutCrash = () => {
    if (!user || crashPhase !== 'flying') return;
    
    const userPlayer = crashPlayers.find(p => p.username === user.username && p.status === 'playing');
    if (!userPlayer) return;
    
    const payout = Math.floor(userPlayer.bet * crashMultiplier);
    setUser(prev => prev ? { ...prev, balance: prev.balance + payout } : null);
    setCrashPlayers(prev => prev.map(p => 
      p.username === user.username && p.status === 'playing' 
        ? { ...p, status: 'cashed', cashOut: crashMultiplier }
        : p
    ));
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="bg-secondary border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="text-2xl font-heading font-bold text-primary">
              CASE FURY
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3 bg-card p-3 rounded-lg">
                <Avatar>
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-muted-foreground">${user.balance.toFixed(2)}</p>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleSteamLogin} 
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? (
                  <Icon name="Loader" className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Icon name="LogIn" className="w-4 h-4 mr-2" />
                )}
                Войти через Steam
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-secondary/50 border-b border-border">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as GameMode)}>
            <TabsList className="grid grid-cols-9 w-full bg-transparent h-auto">
              <TabsTrigger value="cases" className="flex flex-col items-center py-3">
                <Icon name="Package" className="w-5 h-5 mb-1" />
                <span className="text-xs">Кейсы</span>
              </TabsTrigger>
              <TabsTrigger value="exchange" className="flex flex-col items-center py-3">
                <Icon name="ArrowRightLeft" className="w-5 h-5 mb-1" />
                <span className="text-xs">Обменник</span>
              </TabsTrigger>
              <TabsTrigger value="contracts" className="flex flex-col items-center py-3">
                <Icon name="FileText" className="w-5 h-5 mb-1" />
                <span className="text-xs">Контракты</span>
              </TabsTrigger>
              <TabsTrigger value="roulette" className="flex flex-col items-center py-3">
                <Icon name="CircleDot" className="w-5 h-5 mb-1" />
                <span className="text-xs">Рулетка</span>
              </TabsTrigger>
              <TabsTrigger value="crash" className="flex flex-col items-center py-3">
                <Icon name="TrendingUp" className="w-5 h-5 mb-1" />
                <span className="text-xs">Краш</span>
              </TabsTrigger>
              <TabsTrigger value="double" className="flex flex-col items-center py-3">
                <Icon name="Target" className="w-5 h-5 mb-1" />
                <span className="text-xs">Дабл</span>
              </TabsTrigger>
              <TabsTrigger value="defuse" className="flex flex-col items-center py-3">
                <Icon name="Bomb" className="w-5 h-5 mb-1" />
                <span className="text-xs">Дефьюз</span>
              </TabsTrigger>

              <TabsTrigger value="mines" className="flex flex-col items-center py-3">
                <Icon name="Zap" className="w-5 h-5 mb-1" />
                <span className="text-xs">Мины</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab}>
          {/* Cases */}
          <TabsContent value="cases">
            <div className="min-h-96 flex items-center justify-center">
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-12">
                  <Icon name="Package" className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-2xl font-heading font-bold mb-2">Кейсы</h3>
                  <p className="text-muted-foreground">
                    Данная страница находится в разработке
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Crash Game */}
          <TabsContent value="crash">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.crash.title}</h2>
                <p className="text-muted-foreground">{gameContent.crash.description}</p>
              </div>
              <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                  <CardTitle className="text-6xl font-bold text-primary">
                    {gameContent.crash.currentMultiplier.toFixed(2)}x
                  </CardTitle>
                  <CardDescription>Текущий множитель</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-4">
                    <input 
                      type="number" 
                      placeholder="Ставка" 
                      className="flex-1 px-4 py-2 bg-input border border-border rounded-md text-foreground"
                    />
                    <Button className="bg-primary hover:bg-primary/90">
                      Поставить
                    </Button>
                    <Button variant="destructive">
                      Забрать
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mines Game */}
          <TabsContent value="mines">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.mines.title}</h2>
                <p className="text-muted-foreground">{gameContent.mines.description}</p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardHeader>
                  <CardTitle>Поле {gameContent.mines.gridSize}</CardTitle>
                  <CardDescription>Мин: {gameContent.mines.minesCount}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: 25 }, (_, i) => (
                      <Button
                        key={i}
                        variant="outline"
                        className="aspect-square p-0 hover:bg-primary/20"
                        onClick={() => {}}
                      >
                        <Icon name="HelpCircle" className="w-4 h-4" />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Roulette */}
          <TabsContent value="roulette">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.roulette.title}</h2>
                <p className="text-muted-foreground">{gameContent.roulette.description}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
                <Card className="bg-red-600 text-white">
                  <CardContent className="text-center py-8">
                    <h3 className="text-xl font-bold">RED</h3>
                    <p>x{gameContent.roulette.multipliers.red}</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-600 text-white">
                  <CardContent className="text-center py-8">
                    <h3 className="text-xl font-bold">GREEN</h3>
                    <p>x{gameContent.roulette.multipliers.green}</p>
                  </CardContent>
                </Card>
                <Card className="bg-gray-800 text-white">
                  <CardContent className="text-center py-8">
                    <h3 className="text-xl font-bold">BLACK</h3>
                    <p>x{gameContent.roulette.multipliers.black}</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Exchange */}
          <TabsContent value="exchange">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.exchange.title}</h2>
                <p className="text-muted-foreground">{gameContent.exchange.description}</p>
                {user && (
                  <div className="mt-4 p-4 bg-card rounded-lg border inline-block">
                    <div className="text-lg font-semibold">Ваш баланс: <span className="text-primary">₽{user.balance.toLocaleString()}</span></div>
                  </div>
                )}
              </div>
              
              {/* Search and Sort Controls */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="Максимальная цена (₽)"
                      value={searchPrice}
                      onChange={(e) => setSearchPrice(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-input border border-border rounded-md text-foreground placeholder-muted-foreground"
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center space-x-2"
                >
                  <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} className="w-4 h-4" />
                  <span>Цена: {sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}</span>
                </Button>
              </div>
              
              <div className="text-center text-muted-foreground">
                Найдено предметов: {filteredItems.length}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredItems.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center mb-3">
                        <Icon name={
                          item.type === 'knife' ? 'Sword' :
                          item.type === 'weapon' ? 'Zap' :
                          item.type === 'gloves' ? 'Hand' :
                          item.type === 'sticker' ? 'Sticker' :
                          item.type === 'agent' ? 'User' :
                          item.type === 'graffiti' ? 'Spray' :
                          item.type === 'charm' ? 'Award' :
                          item.type === 'patch' ? 'Shield' :
                          item.type === 'musickit' ? 'Music' :
                          'Package'
                        } className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <CardTitle className="text-sm">{item.weapon} {item.name && `| ${item.name}`}</CardTitle>
                      <div className="flex items-center justify-between flex-wrap gap-1">
                        <Badge variant={
                          item.rarity === 'knife' || item.rarity === 'extraordinary' || item.rarity === 'contraband' ? 'destructive' :
                          item.rarity === 'covert' || item.rarity === 'classified' ? 'default' :
                          item.rarity === 'restricted' || item.rarity === 'milspec' ? 'secondary' :
                          'outline'
                        } className="text-xs">
                          {item.rarity.toUpperCase()}
                        </Badge>
                        {item.condition && <Badge variant="outline" className="text-xs">{item.condition}</Badge>}
                        <Badge variant="outline" className="text-xs">{item.type.toUpperCase()}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-2">
                        {item.float && (
                          <div className="flex justify-between text-xs">
                            <span>Float:</span>
                            <span className="font-mono">{item.float.toFixed(3)}</span>
                          </div>
                        )}
                        {item.collection && (
                          <div className="flex justify-between text-xs">
                            <span>Коллекция:</span>
                            <span className="text-muted-foreground">{item.collection}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">₽{item.price.toLocaleString()}</span>
                          <Button 
                            size="sm"
                            className="bg-primary hover:bg-primary/90"
                            disabled={!user || user.balance < item.price}
                          >
                            {!user ? 'Войдите' : user.balance < item.price ? 'Недостаточно' : 'Купить'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {!user && (
                <div className="text-center py-8">
                  <Card className="max-w-md mx-auto">
                    <CardContent className="py-6">
                      <Icon name="Lock" className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">Вход через Steam</h3>
                      <p className="text-muted-foreground mb-4">
                        Войдите через Steam для покупки скинов
                      </p>
                      <Button onClick={handleSteamLogin} className="bg-primary hover:bg-primary/90">
                        Войти через Steam
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contracts */}
          <TabsContent value="contracts">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.contracts.title}</h2>
                <p className="text-muted-foreground">{gameContent.contracts.description}</p>
              </div>
              <div className="space-y-4">
                {gameContent.contracts.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <span>{item.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress value={item.success} className="w-20" />
                        <span className="text-sm">{item.success}%</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Crash */}
          <TabsContent value="crash">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.crash.title}</h2>
                <p className="text-muted-foreground">{gameContent.crash.description}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Graph */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      <div className="relative h-64 bg-background rounded-lg overflow-hidden border">
                        {/* Betting Timer or Animated Graph */}
                        {crashPhase === 'betting' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <div className="text-6xl font-bold text-primary mb-4">
                                {bettingTimeLeft}
                              </div>
                              <div className="text-xl text-muted-foreground">
                                Размещение ставок
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-end justify-center">
                            <div 
                              className="relative w-full h-full"
                              style={{
                                background: `linear-gradient(45deg, 
                                  transparent 0%, 
                                  transparent ${Math.min((crashMultiplier - 1) * 20, 80)}%, 
                                  ${crashPhase === 'crashed' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(34, 197, 94, 0.1)'} ${Math.min((crashMultiplier - 1) * 20, 80)}%, 
                                  ${crashPhase === 'crashed' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(34, 197, 94, 0.3)'} 100%)`
                              }}
                            >
                              {/* Line Chart */}
                              <svg className="absolute inset-0 w-full h-full">
                                <polyline
                                  fill="none"
                                  stroke={crashPhase === 'crashed' ? "#ef4444" : "#22c55e"}
                                  strokeWidth="3"
                                  points={`0,${256} ${Math.min((crashMultiplier - 1) * 100, 400)},${256 - Math.min((crashMultiplier - 1) * 200, 240)}`}
                                  className="transition-all duration-75 ease-linear"
                                />
                              </svg>
                              
                              {/* Current Multiplier Display */}
                              <div className="absolute top-4 left-4 bg-card p-3 rounded-lg border">
                                <div className={`text-3xl font-bold ${
                                  crashPhase === 'flying' ? 'text-green-400 animate-pulse' : 
                                  crashPhase === 'crashed' ? 'text-red-400' : 'text-muted-foreground'
                                }`}>
                                  {crashMultiplier.toFixed(2)}x
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {crashPhase === 'flying' ? 'Лети!' : 
                                   crashPhase === 'crashed' ? 'Краш!' : 'Ожидание'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Controls */}
                      <div className="mt-4 flex gap-4">
                        <div className="flex-1">
                          <input 
                            type="number" 
                            placeholder="Ставка" 
                            value={crashUserBet}
                            onChange={(e) => setCrashUserBet(e.target.value)}
                            className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground"
                            disabled={crashPhase !== 'betting'}
                          />
                        </div>
                        <Button 
                          onClick={crashPhase === 'betting' ? placeBetCrash : crashPhase === 'flying' ? cashOutCrash : undefined}
                          className={`min-w-24 ${
                            crashPhase === 'betting' ? 'bg-primary hover:bg-primary/90' :
                            crashPhase === 'flying' ? 'bg-green-600 hover:bg-green-700' :
                            'bg-red-600 hover:bg-red-700'
                          }`}
                          disabled={crashPhase === 'crashed' || !user}
                        >
                          {crashPhase === 'betting' ? 'Ставка' :
                           crashPhase === 'flying' ? 'Забрать' : 'Ждите'}
                        </Button>
                      </div>
                      
                      {user && (
                        <div className="mt-2 text-sm text-muted-foreground text-center">
                          Баланс: ₽{user.balance.toLocaleString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Players List */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Игроки ({crashPlayers.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                      {crashPlayers.map((player, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg flex justify-between items-center bg-card border"
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              player.status === 'waiting' ? 'bg-yellow-400' :
                              player.status === 'playing' ? 'bg-green-400' :
                              player.status === 'cashed' ? 'bg-blue-400' :
                              'bg-red-400'
                            }`}></div>
                            <span className="font-medium text-sm">{player.username}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">₽{player.bet}</div>
                            {player.cashOut && (
                              <div className="text-xs text-green-400">
                                {player.cashOut.toFixed(2)}x
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">История</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {crashHistory.map((mult, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg flex justify-between items-center ${
                            mult > 10 ? 'bg-yellow-500/20 text-yellow-400' :
                            mult > 5 ? 'bg-green-500/20 text-green-400' :
                            mult > 2 ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}
                        >
                          <span className="font-bold">{mult.toFixed(2)}x</span>
                          {mult > 10 && <Badge variant="secondary">HIGH</Badge>}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Статистика</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span>Игроков онлайн:</span>
                        <span className="text-primary font-bold">1,247</span>
                      </div>
                      <div className="flex justify-between">
                        <span>В игре:</span>
                        <span className="text-green-400 font-bold">89</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Банк:</span>
                        <span className="text-yellow-400 font-bold">₽12,485</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Double */}
          <TabsContent value="double">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.double.title}</h2>
                <p className="text-muted-foreground">{gameContent.double.description}</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Game Area */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardContent className="p-6">
                      {/* Timer or Result */}
                      <div className="text-center mb-6">
                        {doublePhase === 'betting' && (
                          <div>
                            <div className="text-4xl font-bold text-primary mb-2">{doubleTimeLeft}</div>
                            <div className="text-muted-foreground">Размещение ставок</div>
                          </div>
                        )}
                        {doublePhase === 'spinning' && (
                          <div>
                            <div className="text-3xl font-bold text-yellow-400 animate-pulse mb-2">🎲</div>
                            <div className="text-muted-foreground">Вращение...</div>
                          </div>
                        )}
                        {doublePhase === 'result' && (
                          <div>
                            <div className="text-6xl font-bold text-green-400 mb-2">{doubleResult}x</div>
                            <div className="text-muted-foreground">Результат!</div>
                          </div>
                        )}
                      </div>
                      
                      {/* Multiplier Buttons */}
                      <div className="grid grid-cols-5 gap-3 mb-6">
                        {gameContent.double.multipliers.map((mult) => (
                          <Button
                            key={mult}
                            onClick={() => placeBetDouble(mult)}
                            disabled={doublePhase !== 'betting' || !user}
                            className={`h-16 text-lg font-bold ${
                              mult === 2 ? 'bg-green-600 hover:bg-green-700' :
                              mult === 3 ? 'bg-blue-600 hover:bg-blue-700' :
                              mult === 4 ? 'bg-purple-600 hover:bg-purple-700' :
                              mult === 10 ? 'bg-orange-600 hover:bg-orange-700' :
                              'bg-red-600 hover:bg-red-700'
                            }`}
                          >
                            {mult}x
                          </Button>
                        ))}
                      </div>
                      
                      {/* Bet Input */}
                      <div className="flex gap-4">
                        <input
                          type="number"
                          placeholder="Ставка"
                          value={userBet}
                          onChange={(e) => setUserBet(e.target.value)}
                          disabled={doublePhase !== 'betting'}
                          className="flex-1 px-4 py-2 bg-input border border-border rounded-md text-foreground"
                        />
                        <div className="text-sm text-muted-foreground pt-2">
                          {user ? `Баланс: ₽${user.balance.toLocaleString()}` : 'Войдите в систему'}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Players List */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Игроки ({doublePlayers.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 max-h-64 overflow-y-auto">
                      {doublePlayers.map((player, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-lg flex justify-between items-center border ${
                            doublePhase === 'result' && player.won ? 'bg-green-500/20 border-green-500' :
                            doublePhase === 'result' && !player.won ? 'bg-red-500/20 border-red-500' :
                            'bg-card'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className={`w-8 h-6 rounded flex items-center justify-center text-xs font-bold text-white ${
                              player.multiplier === 2 ? 'bg-green-600' :
                              player.multiplier === 3 ? 'bg-blue-600' :
                              player.multiplier === 4 ? 'bg-purple-600' :
                              player.multiplier === 10 ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}>
                              {player.multiplier}x
                            </div>
                            <span className="font-medium text-sm">{player.username}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold">₽{player.bet}</div>
                            {player.payout && (
                              <div className="text-xs text-green-400">
                                +₽{player.payout}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Шансы</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>2x:</span>
                        <span className="text-green-400">40%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>3x:</span>
                        <span className="text-blue-400">30%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>4x:</span>
                        <span className="text-purple-400">15%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>10x:</span>
                        <span className="text-orange-400">12%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>50x:</span>
                        <span className="text-red-400">3%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Defuse */}
          <TabsContent value="defuse">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.defuse.title}</h2>
                <p className="text-muted-foreground">{gameContent.defuse.description}</p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-8 space-y-4">
                  <div className="text-4xl font-bold text-destructive">
                    00:{gameContent.defuse.timeLeft.toString().padStart(2, '0')}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {gameContent.defuse.wires.map((color, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="h-12"
                        style={{
                          backgroundColor: color === 'red' ? '#ef4444' : 
                                           color === 'blue' ? '#3b82f6' :
                                           color === 'yellow' ? '#eab308' :
                                           color === 'green' ? '#22c55e' : undefined,
                          color: 'white'
                        }}
                      >
                        {color.toUpperCase()}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>


        </Tabs>
      </main>
    </div>
  );
};

export default Index;