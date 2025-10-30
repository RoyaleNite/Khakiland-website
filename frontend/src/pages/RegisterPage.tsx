import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Box, Grid, Alert } from '@mui/material';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';

export function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    password2: '',
    first_name: '',
    last_name: '',
  });
  const [error, setError] = useState<any>(null);
  const { register, isLoading } = useAuthStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.password2) {
      const errorMsg = "Wagwoorde stem nie ooreen nie / Passwords don't match";
      setError({ password: [errorMsg] });
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: errorMsg,
      });
      return;
    }

    try {
      await register(formData);
      toast({
        variant: 'success',
        title: t.toast.success,
        description: t.toast.registrationSuccess,
      });
      navigate('/');
    } catch (err: any) {
      const errorData = err.response?.data || t.toast.failedToLoad;
      setError(errorData);
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: typeof errorData === 'string' ? errorData : 'Registration failed',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Box className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md !shadow-xl !border-[#C2B280] dark:!border-[#4B5320] bg-card/90 backdrop-blur-sm">
          <CardHeader className="!pb-4 bg-gradient-to-r from-[#D2B48C]/30 to-[#C2B280]/30 dark:from-[#4B5320]/30 dark:to-[#6C541E]/30">
            <CardTitle className="!text-2xl !text-[#3B3A2E] dark:!text-[#E8E6D5]">{t.auth.signupTitle}</CardTitle>
            <CardDescription className="!text-base !text-black-700 dark:!text-black-300">{t.auth.signupTitle}</CardDescription>
          </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            {error && typeof error === 'object' && (
              <Alert severity="error" className="mb-4 !bg-red-50 dark:!bg-red-950 !border-red-200 dark:!border-red-900">
                {Object.entries(error).map(([key, value]: [string, any]) => (
                  <Box key={key}>{Array.isArray(value) ? value.join(', ') : value}</Box>
                ))}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box className="space-y-2">
                  <Label className="!text-black-700 dark:!text-black-300">{t.auth.firstName}</Label>
                  <Input
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className="space-y-2">
                  <Label className="!text-black-700 dark:!text-black-300">{t.auth.lastName}</Label>
                  <Input
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
                  />
                </Box>
              </Grid>
            </Grid>
            <Box className="space-y-2">
              <Label className="!text-black-700 dark:!text-black-300">{t.auth.username}</Label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
              />
            </Box>
            <Box className="space-y-2">
              <Label className="!text-black-700 dark:!text-black-300">{t.auth.email}</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
              />
            </Box>
            <Box className="space-y-2">
              <Label className="!text-black-700 dark:!text-black-300">{t.auth.password}</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
              />
            </Box>
            <Box className="space-y-2">
              <Label className="!text-black-700 dark:!text-black-300">{t.auth.confirmPassword}</Label>
              <Input
                type="password"
                name="password2"
                value={formData.password2}
                onChange={handleChange}
                required
                className="!border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
              />
            </Box>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23] shadow-lg" disabled={isLoading}>
              {isLoading ? `${t.common.loading}` : t.auth.signup}
            </Button>
            <Typography variant="body2" className="text-center !text-black-600 dark:!text-black-400">
              {t.auth.haveAccount}{' '}
              <Link to="/login" className="!text-[#6B8E23] dark:!text-[#9C9A73] hover:underline font-semibold">
                {t.auth.loginLink}
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </Box>
    </div>
  );
}
