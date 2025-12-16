import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const templates = [
  { id: '1', title: 'Креативная идея', prompt: 'Помоги мне придумать креативную идею для...' },
  { id: '2', title: 'Анализ текста', prompt: 'Проанализируй следующий текст и дай рекомендации...' },
  { id: '3', title: 'Генерация кода', prompt: 'Напиши код на Python для...' },
  { id: '4', title: 'Перевод', prompt: 'Переведи следующий текст на английский...' },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Привет! Я MonkyAI — твой персональный AI-ассистент. Чем могу помочь?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [chats] = useState<Chat[]>([
    { id: '1', title: 'Новый чат', lastMessage: 'Привет! Я MonkyAI...', timestamp: new Date() },
    { id: '2', title: 'Креативные идеи', lastMessage: 'Предложи идеи для...', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', title: 'Программирование', lastMessage: 'Напиши функцию...', timestamp: new Date(Date.now() - 7200000) },
  ]);
  const [showTemplates, setShowTemplates] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setInputValue('');

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Это демонстрационный ответ от MonkyAI. В полной версии здесь будет реальный ответ от AI-модели!',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleTemplateClick = (prompt: string) => {
    setInputValue(prompt);
    setShowTemplates(false);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setIsRecording(false);
        setInputValue('Это текст распознанный с голоса...');
      }, 2000);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <aside className="hidden lg:flex flex-col w-80 border-r border-border bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-gradient">MonkyAI Chat</h1>
          <p className="text-sm text-sidebar-foreground/70 mt-1">Твой креативный помощник</p>
        </div>

        <div className="p-4">
          <Button className="w-full" onClick={() => setMessages([{
            id: Date.now().toString(),
            content: 'Привет! Я MonkyAI. Чем могу помочь?',
            sender: 'ai',
            timestamp: new Date(),
          }])}>
            <Icon name="Plus" className="mr-2" size={16} />
            Новый чат
          </Button>
        </div>

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2">
            {chats.map((chat) => (
              <button
                key={chat.id}
                className="w-full text-left p-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 group"
              >
                <h3 className="font-medium text-sidebar-foreground group-hover:text-sidebar-accent-foreground truncate">
                  {chat.title}
                </h3>
                <p className="text-xs text-sidebar-foreground/60 truncate mt-1">{chat.lastMessage}</p>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <Icon name="Settings" className="mr-2" size={18} />
            Настройки
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Icon name="HelpCircle" className="mr-2" size={18} />
            Справка
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Icon name="User" className="mr-2" size={18} />
            Профиль
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-border glassmorphism lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Icon name="Menu" size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <div className="flex flex-col h-full">
                <div className="p-6 border-b border-sidebar-border">
                  <h1 className="text-2xl font-bold text-gradient">MonkyAI Chat</h1>
                  <p className="text-sm text-muted-foreground mt-1">Твой креативный помощник</p>
                </div>
                <ScrollArea className="flex-1 px-4 py-4">
                  <div className="space-y-2">
                    {chats.map((chat) => (
                      <button
                        key={chat.id}
                        className="w-full text-left p-3 rounded-lg hover:bg-accent transition-all"
                      >
                        <h3 className="font-medium truncate">{chat.title}</h3>
                        <p className="text-xs text-muted-foreground truncate mt-1">{chat.lastMessage}</p>
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="text-xl font-bold text-gradient">MonkyAI</h1>

          <Button variant="ghost" size="icon">
            <Icon name="Settings" size={20} />
          </Button>
        </header>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-3 animate-slide-up',
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {message.sender === 'ai' && (
                  <Avatar className="h-10 w-10 border-2 border-primary/20">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white">
                      AI
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 max-w-[80%] transition-all duration-200 hover:scale-[1.02]',
                    message.sender === 'user'
                      ? 'bg-gradient-to-br from-primary to-accent text-white ml-auto'
                      : 'glassmorphism'
                  )}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-60 mt-2 block">
                    {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <Avatar className="h-10 w-10 border-2 border-accent/20">
                    <AvatarFallback className="bg-accent">U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {showTemplates && (
          <div className="px-4 pb-2">
            <div className="max-w-4xl mx-auto glassmorphism rounded-2xl p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-sm">Быстрые шаблоны</h3>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowTemplates(false)}>
                  <Icon name="X" size={14} />
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateClick(template.prompt)}
                    className="text-left p-3 rounded-lg hover:bg-primary/10 transition-all border border-border hover:border-primary/50"
                  >
                    <h4 className="font-medium text-sm">{template.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 truncate">{template.prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-border glassmorphism">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowTemplates(!showTemplates)}
                className="shrink-0"
              >
                <Icon name="Lightbulb" size={20} />
              </Button>

              <div className="flex-1 relative">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Напишите сообщение..."
                  className="pr-12 rounded-xl"
                />
              </div>

              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
                onClick={toggleRecording}
                className={cn('shrink-0', isRecording && 'animate-pulse-glow')}
              >
                <Icon name={isRecording ? 'MicOff' : 'Mic'} size={20} />
              </Button>

              <Button
                onClick={handleSendMessage}
                size="icon"
                className="shrink-0 bg-gradient-to-br from-primary to-accent hover:opacity-90"
                disabled={!inputValue.trim()}
              >
                <Icon name="Send" size={20} />
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-3">
              MonkyAI может ошибаться. Проверяйте важную информацию.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
