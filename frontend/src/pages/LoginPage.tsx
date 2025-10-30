import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Alert } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      toast({
        variant: 'success',
        title: t.toast.success,
        description: t.toast.loginSuccess,
      });
      navigate('/');
    } catch (err: any) {
      const errorMsg = err.response?.data?.detail || t.toast.failedToLoad;
      setError(errorMsg);
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: errorMsg,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Box className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md !shadow-xl !border-[#C2B280] dark:!border-[#4B5320] bg-white/90 dark:bg-[#3A3621]/90 backdrop-blur-sm">
          <CardHeader className="!pb-4 bg-gradient-to-r from-[#D2B48C]/30 to-[#C2B280]/30 dark:from-[#4B5320]/30 dark:to-[#6C541E]/30">
            <CardTitle className="!text-2xl !text-[#3B3A2E] dark:!text-[#E8E6D5]">{t.auth.loginTitle}</CardTitle>
            <CardDescription className="!text-base !text-black-700 dark:!text-black-300">{t.auth.loginTitle}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4 pt-6">
              {error && (
                <Alert severity="error" className="mb-4 !bg-red-50 dark:!bg-red-950 !border-red-200 dark:!border-red-900">
                  {error}
                </Alert>
              )}
              <Box className="space-y-2">
                <Label className="!text-black-700 dark:!text-black-300">{t.auth.email}</Label>
                <Input
                  type="email"
                  placeholder="jy@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
                />
              </Box>
              <Box className="space-y-2">
                <Label className="!text-black-700 dark:!text-black-300">{t.auth.password}</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
                />
              </Box>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23] shadow-lg" disabled={isLoading}>
                {isLoading ? `${t.common.loading}` : t.auth.login}
              </Button>
              <Typography variant="body2" className="text-center !text-black-600 dark:!text-black-400">
                {t.auth.noAccount}{' '}
                <Link to="/register" className="!text-[#6B8E23] dark:!text-[#9C9A73] hover:underline font-semibold">
                  {t.auth.signupLink}
                </Link>
              </Typography>
            </CardFooter>
          </form>
        </Card>
      </Box>
    </div>
  );
}
