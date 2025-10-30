import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { useCartStore } from '../store/cartStore';
import { useTranslation } from '../hooks/useTranslation';
import { useToast } from '../hooks/useToast';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Typography } from '../components/ui/Typography';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export function CartPage() {
  const { cart, fetchCart, updateQuantity, removeItem, isLoading } = useCartStore();
  const { t } = useTranslation();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateQuantity(itemId, quantity);
      toast({
        variant: 'success',
        title: t.toast.success,
        description: t.toast.cartUpdated,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: t.toast.failedToLoad,
      });
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeItem(itemId);
      toast({
        variant: 'success',
        title: t.toast.success,
        description: t.toast.removedFromCart,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: t.toast.failedToLoad,
      });
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <div className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
          <Typography>{t.common.loading}</Typography>
        </div>
      </Container>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
        <Container maxWidth="xl" className="py-16">
          <Card className="max-w-md mx-auto text-center !border-[#C2B280] dark:!border-[#4B5320] bg-white/80 dark:bg-[#3A3621]/80 backdrop-blur-sm">
            <CardContent className="pt-8 pb-8">
              <ShoppingBag className="h-20 w-20 mx-auto mb-4 text-[#6B8E23] dark:text-[#9C9A73]" />
              <Typography variant="h4" className="font-bold mb-2 !text-[#3B3A2E] dark:!text-[#E8E6D5]">{t.cart.empty}</Typography>
              <Typography className="text-muted-foreground mb-6">{t.cart.continueShopping}</Typography>
              <Link to="/">
                <Button className="bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23]">
                  {t.cart.continueShopping}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </Container>
      </div>
    );
  }

  const subtotal = parseFloat(cart.total);
  const tax = subtotal * 0.15; // South African VAT is 15%
  const shippingCost = subtotal >= 500 ? 0 : 75; // Free shipping over R500
  const total = subtotal + tax + shippingCost;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="xl" className="py-8 px-4 md:px-6">
        <Typography variant="h3" className="!font-bold !mb-8 !text-4xl bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] bg-clip-text text-transparent">
          {t.cart.title}
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Box className="space-y-4">
              {cart.items.map((item) => (
                <Card key={item.id} className="!border-[#C2B280] dark:!border-[#4B5320] !shadow-lg bg-white/90 dark:bg-[#3A3621]/90 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <Box className="flex gap-4 flex-col sm:flex-row">
                      <div
                        className="w-full sm:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-[#F5F4ED] to-[#D2B48C] dark:from-[#3A3621] dark:to-[#2A2817]"
                        dangerouslySetInnerHTML={{ __html: item.product_detail.svg_placeholder }}
                      />

                      <Box className="flex-1 space-y-2">
                        <Typography variant="h6" className="font-semibold !text-[#3B3A2E] dark:!text-[#E8E6D5]">
                          {item.product_detail.name}
                        </Typography>
                        <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
                          {item.product_detail.category_name}
                        </Typography>
                        {item.variant_detail && (
                          <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
                            {item.variant_detail.color && `Kleur: ${item.variant_detail.color}`}
                            {item.variant_detail.color && item.variant_detail.size && ' • '}
                            {item.variant_detail.size && `Grootte: ${item.variant_detail.size}`}
                          </Typography>
                        )}

                        <Box className="flex items-center gap-4 mt-4 flex-wrap">
                          <Box className="flex items-center gap-2 bg-[#D2B48C]/30 dark:bg-[#4B5320]/30 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 hover:bg-[#C2B280]/50 dark:hover:bg-[#4B5320]/50"
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Typography className="w-12 text-center font-semibold">{item.quantity}</Typography>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 hover:bg-[#C2B280]/50 dark:hover:bg-[#4B5320]/50"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </Box>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t.cart.remove}
                          </Button>
                        </Box>
                      </Box>

                      <Box className="text-right sm:text-right sm:min-w-[120px]">
                        <Typography className="font-semibold text-[#6B8E23] dark:text-[#9C9A73]">
                          {t.common.currency}{parseFloat(item.price).toFixed(2)}
                        </Typography>
                        <Typography variant="body2" className="text-muted-foreground">elk</Typography>
                        <Box className="mt-4 pt-4 border-t border-[#C2B280] dark:border-[#4B5320]">
                          <Typography variant="h6" className="font-bold text-[#3B3A2E] dark:text-[#E8E6D5]">
                            {t.common.currency}{parseFloat(item.subtotal).toFixed(2)}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Card className="sticky top-20 !border-[#C2B280] dark:!border-[#4B5320] bg-white/90 dark:bg-[#3A3621]/90 backdrop-blur-sm shadow-xl">
              <CardHeader className="bg-gradient-to-r from-[#D2B48C]/30 to-[#C2B280]/30 dark:from-[#4B5320]/30 dark:to-[#6C541E]/30">
                <CardTitle className="!text-[#3B3A2E] dark:!text-[#E8E6D5]">Bestellingoverzicht</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <Box className="flex justify-between items-center">
                  <Typography className="!text-black-700 dark:!text-black-300">
                    {t.cart.subtotal} ({cart.item_count} {cart.item_count === 1 ? t.cart.item : t.cart.items})
                  </Typography>
                  <Typography className="font-semibold !text-[#3B3A2E] dark:!text-[#E8E6D5]">
                    {t.common.currency}{subtotal.toFixed(2)}
                  </Typography>
                </Box>

                <Box className="flex justify-between items-center text-sm">
                  <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
                    {t.cart.tax} (15%)
                  </Typography>
                  <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
                    {t.common.currency}{tax.toFixed(2)}
                  </Typography>
                </Box>

                <Box className="flex justify-between items-center text-sm">
                  <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
                    {t.cart.shipping}
                  </Typography>
                  <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
                    {shippingCost === 0 ? (
                      <span className="text-green-600 dark:text-green-400 font-semibold">GRATIS</span>
                    ) : (
                      `${t.common.currency}${shippingCost.toFixed(2)}`
                    )}
                  </Typography>
                </Box>

                {subtotal < 500 && (
                  <Box className="bg-[#D2B48C]/20 dark:bg-[#4B5320]/30 p-3 rounded-lg border border-[#C2B280] dark:border-[#4B5320]">
                    <Typography variant="body2" className="text-sm !text-[#6B8E23] dark:!text-[#9C9A73]">
                      {t.cart.freeShipping} {t.common.currency}500!
                      <br />
                      Nog {t.common.currency}{(500 - subtotal).toFixed(2)} te gaan!
                    </Typography>
                  </Box>
                )}

                <Box className="border-t border-[#C2B280] dark:border-[#4B5320] pt-4">
                  <Box className="flex justify-between items-center">
                    <Typography variant="h6" className="font-bold !text-[#3B3A2E] dark:!text-[#E8E6D5]">
                      {t.cart.total}
                    </Typography>
                    <Typography variant="h6" className="font-bold !text-[#3B3A2E] dark:!text-[#E8E6D5]">
                      {t.common.currency}{total.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <Button
                  className="w-full bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23] shadow-lg"
                  size="lg"
                  onClick={() => navigate('/checkout')}
                >
                  {t.cart.checkout}
                </Button>
                <Link to="/" className="w-full">
                  <Button variant="outline" className="w-full !border-[#6B8E23] !text-[#6B8E23] dark:!text-[#9C9A73]">
                    {t.cart.continueShopping}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}
