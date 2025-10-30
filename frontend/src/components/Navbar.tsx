import { Link } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, LogOut, Languages, UserCircle, Package2, LayoutDashboard, ClipboardList, Store, MapPin } from 'lucide-react';
import { AppBar, Toolbar, Box, Container, IconButton, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';
import { useThemeStore } from '../store/themeStore';
import { useLanguageStore } from '../store/languageStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { Button } from './ui/Button';
import { Typography } from './ui/Typography';
import { Badge } from './ui/Badge';

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const { theme, setTheme } = useThemeStore();
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  const [langMenuAnchor, setLangMenuAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    logout();
    toast({
      variant: 'success',
      title: t.toast.success,
      description: t.toast.logoutSuccess,
    });
  };

  const handleLanguageChange = (newLang: 'af' | 'en') => {
    setLanguage(newLang);
    setLangMenuAnchor(null);
    toast({
      variant: 'success',
      title: t.toast.success,
      description: newLang === 'af' ? 'Taal verander na Afrikaans' : 'Language changed to English',
    });
  };

  return (
    <AppBar position="sticky" className="!bg-[#F5F4ED]/95 !backdrop-blur-sm border-b !border-[#C2B280] !shadow-sm dark:!bg-[#2A2817]/95 dark:!border-[#4B5320]" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar className="!min-h-[64px] !py-2" disableGutters>
          <Box className="flex gap-6 md:gap-10 items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Store className="h-6 w-6 text-[#6B8E23] dark:text-[#9C9A73]" />
              <Typography variant="h6" className="font-bold bg-gradient-to-r from-[#6B8E23] via-[#8B7D3A] to-[#4B5320] bg-clip-text text-transparent">
                Khakiland
              </Typography>
            </Link>

            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className="text-sm font-medium text-[#5C5A44] dark:text-[#C2B280] hover:text-[#6B8E23] dark:hover:text-[#9C9A73] transition-colors"
              >
                {t.nav.home}
              </Link>
              <Link
                to="/products"
                className="text-sm font-medium text-[#5C5A44] dark:text-[#C2B280] hover:text-[#6B8E23] dark:hover:text-[#9C9A73] transition-colors"
              >
                {t.nav.products}
              </Link>
              {isAuthenticated && user?.is_staff && (
                <>
                  <Link
                    to="/staff/dashboard"
                    className="text-sm font-medium text-[#6B8E23] dark:text-[#9C9A73] hover:text-[#4B5320] dark:hover:text-[#C2B280] transition-colors flex items-center gap-1"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/staff/orders"
                    className="text-sm font-medium text-[#6B8E23] dark:text-[#9C9A73] hover:text-[#4B5320] dark:hover:text-[#C2B280] transition-colors flex items-center gap-1"
                  >
                    <ClipboardList className="h-4 w-4" />
                    Staff Orders
                  </Link>
                  <Link
                    to="/staff/inventory"
                    className="text-sm font-medium text-[#6B8E23] dark:text-[#9C9A73] hover:text-[#4B5320] dark:hover:text-[#C2B280] transition-colors flex items-center gap-1"
                  >
                    <Package2 className="h-4 w-4" />
                    Inventory
                  </Link>
                  <Link
                    to="/staff/products"
                    className="text-sm font-medium text-[#6B8E23] dark:text-[#9C9A73] hover:text-[#4B5320] dark:hover:text-[#C2B280] transition-colors flex items-center gap-1"
                  >
                    <Package2 className="h-4 w-4" />
                    Products
                  </Link>
                </>
              )}
            </nav>
          </Box>

          <Box className="flex flex-1 items-center justify-end space-x-4">

            {isAuthenticated ? (
              <>
                <Link to="/cart">
                  <IconButton className="relative text-foreground">
                    <ShoppingCart className="h-5 w-5" />
                    {cart && cart.item_count > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5">
                        {cart.item_count}
                      </Badge>
                    )}
                  </IconButton>
                </Link>

                <Box className="flex items-center gap-2">
                  <Typography variant="body2" className="text-muted-foreground hidden lg:block">
                    {user?.email}
                  </Typography>
                  <IconButton
                    onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                    className="text-foreground hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30"
                    title="User menu"
                  >
                    <UserCircle className="h-5 w-5 text-[#6B8E23] dark:text-[#9C9A73]" />
                  </IconButton>
                  <Menu
                    anchorEl={userMenuAnchor}
                    open={Boolean(userMenuAnchor)}
                    onClose={() => setUserMenuAnchor(null)}
                    className="mt-2"
                  >
                    <MenuItem
                      component={Link}
                      to="/profile"
                      onClick={() => setUserMenuAnchor(null)}
                      className="!text-[#3B3A2E] dark:!text-[#E8E6D5]"
                    >
                      <UserCircle className="h-4 w-4 mr-2 text-[#6B8E23] dark:text-[#9C9A73]" />
                      Profile
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to="/my-orders"
                      onClick={() => setUserMenuAnchor(null)}
                      className="!text-[#3B3A2E] dark:!text-[#E8E6D5]"
                    >
                      <ClipboardList className="h-4 w-4 mr-2 text-[#6B8E23] dark:text-[#9C9A73]" />
                      My Orders
                    </MenuItem>
                    {user?.is_staff && (
                      <>
                        <MenuItem divider className="!my-1" />
                        <MenuItem
                          component={Link}
                          to="/staff/dashboard"
                          onClick={() => setUserMenuAnchor(null)}
                          className="!text-[#6B8E23] dark:!text-[#9C9A73]"
                        >
                          <LayoutDashboard className="h-4 w-4 mr-2" />
                          Staff Dashboard
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/staff/orders"
                          onClick={() => setUserMenuAnchor(null)}
                          className="!text-[#6B8E23] dark:!text-[#9C9A73]"
                        >
                          <ClipboardList className="h-4 w-4 mr-2" />
                          Staff Orders
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/staff/inventory"
                          onClick={() => setUserMenuAnchor(null)}
                          className="!text-[#6B8E23] dark:!text-[#9C9A73]"
                        >
                          <Package2 className="h-4 w-4 mr-2" />
                          Inventory
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/staff/products"
                          onClick={() => setUserMenuAnchor(null)}
                          className="!text-[#6B8E23] dark:!text-[#9C9A73]"
                        >
                          <Package2 className="h-4 w-4 mr-2" />
                          Products
                        </MenuItem>
                      </>
                    )}
                    <MenuItem divider className="!my-1" />
                    <MenuItem
                      onClick={() => {
                        setUserMenuAnchor(null);
                        handleLogout();
                      }}
                      className="!text-red-600 dark:!text-red-400"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t.nav.logout}
                    </MenuItem>
                  </Menu>
                </Box>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost">{t.nav.login}</Button>
                </Link>
                <Link to="/register">
                  <Button>{t.nav.signup}</Button>
                </Link>
              </>
            )}

            {/* Language & Theme toggle */}
            <div className="ml-2 border-l border-[#C2B280] dark:border-[#4B5320] pl-4 flex gap-2">
              <IconButton
                onClick={(e) => setLangMenuAnchor(e.currentTarget)}
                className="text-foreground hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30"
                title={t.nav.language}
              >
                <Languages className="h-5 w-5 text-[#6B8E23] dark:text-[#9C9A73]" />
              </IconButton>
              <Menu
                anchorEl={langMenuAnchor}
                open={Boolean(langMenuAnchor)}
                onClose={() => setLangMenuAnchor(null)}
                className="mt-2"
              >
                <MenuItem
                  onClick={() => handleLanguageChange('af')}
                  selected={language === 'af'}
                  className="!text-[#3B3A2E] dark:!text-[#E8E6D5]"
                >
                  Afrikaans
                </MenuItem>
                <MenuItem
                  onClick={() => handleLanguageChange('en')}
                  selected={language === 'en'}
                  className="!text-[#3B3A2E] dark:!text-[#E8E6D5]"
                >
                  English
                </MenuItem>
              </Menu>

              <IconButton
                onClick={toggleTheme}
                className="text-foreground hover:bg-[#D2B48C]/20 dark:hover:bg-[#4B5320]/30"
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? <Sun className="h-5 w-5 text-[#D2B48C]" /> : <Moon className="h-5 w-5 text-[#6B8E23]" />}
              </IconButton>
            </div>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
