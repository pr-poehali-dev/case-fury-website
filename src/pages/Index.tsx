import React, { useState } from 'react';
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

type GameMode = 'cases' | 'updates' | 'contracts' | 'roulette' | 'crash' | 'wheel' | 'defuse' | 'double' | 'mines';

const Index: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<GameMode>('cases');
  const [isLoading, setIsLoading] = useState(false);

  const handleSteamLogin = async () => {
    setIsLoading(true);
    // Simulate Steam login
    setTimeout(() => {
      setUser({
        id: '76561198123456789',
        username: 'Pro_Gamer_2024',
        avatar: 'https://avatars.steamstatic.com/f3b09d1dcdcf6e4a2d2e2a2a2a2a2a2a_full.jpg',
        balance: 0
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
    updates: {
      title: 'Обновления',
      description: 'Последние новости и обновления сайта',
      items: [
        { name: 'Новые кейсы добавлены', date: '21.09.2024' },
        { name: 'Улучшена система краша', date: '20.09.2024' },
        { name: 'Добавлен режим мин', date: '19.09.2024' }
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
      currentMultiplier: 1.24,
      isActive: true
    },
    wheel: {
      title: 'Колесо Фортуны',
      description: 'Бесплатное вращение каждые 24 часа',
      prizes: [10, 25, 50, 100, 250, 500, 1000, 'Jackpot']
    },
    defuse: {
      title: 'Дефьюз',
      description: 'Успейте обезвредить бомбу до взрыва',
      timeLeft: 45,
      wires: ['red', 'blue', 'yellow', 'green']
    },
    double: {
      title: 'Дабл',
      description: 'Удвойте свою ставку или потеряйте всё',
      chance: 50
    },
    mines: {
      title: 'Мины',
      description: 'Найдите алмазы, избегая мин',
      gridSize: '5x5',
      minesCount: 5
    }
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
              <TabsTrigger value="updates" className="flex flex-col items-center py-3">
                <Icon name="Newspaper" className="w-5 h-5 mb-1" />
                <span className="text-xs">Обновления</span>
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
              <TabsTrigger value="wheel" className="flex flex-col items-center py-3">
                <Icon name="Disc" className="w-5 h-5 mb-1" />
                <span className="text-xs">Колесо</span>
              </TabsTrigger>
              <TabsTrigger value="defuse" className="flex flex-col items-center py-3">
                <Icon name="Bomb" className="w-5 h-5 mb-1" />
                <span className="text-xs">Дефьюз</span>
              </TabsTrigger>
              <TabsTrigger value="double" className="flex flex-col items-center py-3">
                <Icon name="Coins" className="w-5 h-5 mb-1" />
                <span className="text-xs">Дабл</span>
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
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.cases.title}</h2>
                <p className="text-muted-foreground">{gameContent.cases.description}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gameContent.cases.items.map((item, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {item.name}
                        <Badge variant={item.rarity === 'legendary' ? 'destructive' : 'secondary'}>
                          {item.rarity}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">${item.price}</span>
                        <Button className="bg-primary hover:bg-primary/90">
                          Открыть
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

          {/* Updates */}
          <TabsContent value="updates">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.updates.title}</h2>
                <p className="text-muted-foreground">{gameContent.updates.description}</p>
              </div>
              <div className="space-y-4">
                {gameContent.updates.items.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <span>{item.name}</span>
                      <Badge variant="secondary">{item.date}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

          {/* Wheel */}
          <TabsContent value="wheel">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.wheel.title}</h2>
                <p className="text-muted-foreground">{gameContent.wheel.description}</p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-8">
                  <Icon name="Disc" className="w-24 h-24 mx-auto mb-4 text-primary" />
                  <Button className="bg-primary hover:bg-primary/90" size="lg">
                    Крутить колесо
                  </Button>
                </CardContent>
              </Card>
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

          {/* Double */}
          <TabsContent value="double">
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold mb-2">{gameContent.double.title}</h2>
                <p className="text-muted-foreground">{gameContent.double.description}</p>
              </div>
              <Card className="max-w-md mx-auto">
                <CardContent className="text-center py-8 space-y-4">
                  <div className="text-2xl font-bold">Шанс: {gameContent.double.chance}%</div>
                  <div className="space-y-2">
                    <input 
                      type="number" 
                      placeholder="Ставка" 
                      className="w-full px-4 py-2 bg-input border border-border rounded-md text-foreground"
                    />
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Удвоить
                    </Button>
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