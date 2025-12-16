import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface SettingsDialogProps {
  userAvatar: string;
  userName: string;
  backgroundImage: string;
  onAvatarChange: (url: string) => void;
  onNameChange: (name: string) => void;
  onBackgroundChange: (url: string) => void;
}

const backgrounds = [
  { id: '1', name: 'Космос', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1200&q=80' },
  { id: '2', name: 'Горы', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80' },
  { id: '3', name: 'Океан', url: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=1200&q=80' },
  { id: '4', name: 'Лес', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80' },
  { id: '5', name: 'Город', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1200&q=80' },
  { id: '6', name: 'Градиент', url: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
];

export default function SettingsDialog({
  userAvatar,
  userName,
  backgroundImage,
  onAvatarChange,
  onNameChange,
  onBackgroundChange,
}: SettingsDialogProps) {
  const [tempName, setTempName] = useState(userName);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({ title: 'Ошибка', description: 'Выберите изображение', variant: 'destructive' });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;

        const response = await fetch('https://functions.poehali.dev/2442ac3b-c090-421d-802e-a6ad24a7551b', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        onAvatarChange(data.url);
        toast({ title: 'Успех!', description: 'Аватар обновлен' });
      };

      reader.readAsDataURL(file);
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось загрузить аватар', variant: 'destructive' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveName = () => {
    onNameChange(tempName);
    toast({ title: 'Сохранено', description: 'Имя обновлено' });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Icon name="Settings" className="mr-2" size={18} />
          Настройки
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-gradient">Настройки профиля</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Профиль</TabsTrigger>
            <TabsTrigger value="appearance">Оформление</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6 mt-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32 border-4 border-primary">
                <AvatarImage src={userAvatar} />
                <AvatarFallback className="text-4xl bg-gradient-to-br from-primary to-accent text-white">
                  {tempName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex gap-2">
                <Button variant="outline" disabled={isUploading} asChild>
                  <label className="cursor-pointer">
                    <Icon name="Upload" className="mr-2" size={16} />
                    {isUploading ? 'Загрузка...' : 'Загрузить фото'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarUpload}
                      disabled={isUploading}
                    />
                  </label>
                </Button>
                {userAvatar && (
                  <Button variant="ghost" onClick={() => onAvatarChange('')}>
                    <Icon name="Trash2" size={16} />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Ваше имя</Label>
              <div className="flex gap-2">
                <Input
                  id="name"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Введите имя"
                  className="flex-1"
                />
                <Button onClick={handleSaveName}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6 mt-6">
            <div className="space-y-3">
              <Label>Фон чата</Label>
              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => {
                      onBackgroundChange(bg.url);
                      toast({ title: 'Фон изменен', description: bg.name });
                    }}
                    className={cn(
                      'relative h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105',
                      backgroundImage === bg.url ? 'border-primary' : 'border-border'
                    )}
                    style={{
                      background: bg.url.startsWith('linear') ? bg.url : `url(${bg.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <span className="text-white font-medium drop-shadow-lg">{bg.name}</span>
                    </div>
                    {backgroundImage === bg.url && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-1">
                        <Icon name="Check" size={16} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  onBackgroundChange('');
                  toast({ title: 'Фон сброшен', description: 'Используется стандартный фон' });
                }}
              >
                <Icon name="RotateCcw" className="mr-2" size={16} />
                Сбросить фон
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
