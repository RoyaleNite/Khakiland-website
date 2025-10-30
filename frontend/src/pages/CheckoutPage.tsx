import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { useCartStore } from '../store/cartStore';
import { ordersAPI } from '../api/client';
import type { ShippingInfo } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Typography } from '../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function CheckoutPage() {
  const { cart, fetchCart } = useCartStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ShippingInfo>({
    shipping_full_name: '',
    shipping_phone: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    shipping_country: 'South Africa',
    payment_method: 'card',
    payment_status: 'unpaid',
  });

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const order = await ordersAPI.createOrder(formData);
      navigate(`/orders/${order.order_number}`);
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('Failed to create order. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="xl" className="py-16 text-center">
        <Typography variant="h4" className="font-bold mb-4">Your cart is empty</Typography>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </Container>
    );
  }

  const subtotal = parseFloat(cart.total);
  const tax = subtotal * 0.08;
  const shipping = subtotal >= 50 ? 0 : 10;
  const total = subtotal + tax + shipping;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
    <Container maxWidth="xl" className="py-8 px-4 md:px-6">
      <Typography variant="h3" className="!font-bold !mb-8 !text-3xl bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] bg-clip-text text-transparent">Checkout</Typography>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card className="!border-[#C2B280] dark:!border-[#4B5320] !shadow-md bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="!text-xl !text-[#3B3A2E] dark:!text-[#E8E6D5]">Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box className="space-y-2">
                      <Label className="text-sm font-medium">Full Name*</Label>
                      <Input
                        name="shipping_full_name"
                        value={formData.shipping_full_name}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Box className="space-y-2">
                      <Label className="text-sm font-medium">Phone*</Label>
                      <Input
                        name="shipping_phone"
                        value={formData.shipping_phone}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box className="space-y-2">
                  <Label className="text-sm font-medium">Address Line 1*</Label>
                  <Input
                    name="shipping_address_line1"
                    value={formData.shipping_address_line1}
                    onChange={handleChange}
                    required
                  />
                </Box>

                <Box className="space-y-2">
                  <Label className="text-sm font-medium">Address Line 2</Label>
                  <Input
                    name="shipping_address_line2"
                    value={formData.shipping_address_line2}
                    onChange={handleChange}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box className="space-y-2">
                      <Label className="text-sm font-medium">City*</Label>
                      <Input
                        name="shipping_city"
                        value={formData.shipping_city}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box className="space-y-2">
                      <Label className="text-sm font-medium">State*</Label>
                      <Input
                        name="shipping_state"
                        value={formData.shipping_state}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </Grid>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Box className="space-y-2">
                      <Label className="text-sm font-medium">ZIP Code*</Label>
                      <Input
                        name="shipping_postal_code"
                        value={formData.shipping_postal_code}
                        onChange={handleChange}
                        required
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Box className="space-y-2">
                  <Label className="text-sm font-medium">Country*</Label>
                  <Input
                    name="shipping_country"
                    value={formData.shipping_country}
                    onChange={handleChange}
                    required
                  />
                </Box>

                <Box className="!mt-6 pt-6 border-t">
                  <Typography variant="h6" className="font-semibold mb-4">
                    Payment Information
                  </Typography>

                  <Box className="space-y-2">
                    <Label className="text-sm font-medium">Payment Method*</Label>
                    <select
                      name="payment_method"
                      value={formData.payment_method}
                      onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                      className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background"
                      required
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="cash">Cash</option>
                      <option value="eft">EFT</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="in_store">In Store</option>
                    </select>
                  </Box>

                  <Box className="mt-4 p-4 bg-[#D2B48C]/20 dark:bg-[#4B5320]/30 rounded-md border border-[#C2B280] dark:border-[#4B5320]">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="pay_now"
                        checked={formData.payment_status === 'paid'}
                        onChange={(e) => setFormData({
                          ...formData,
                          payment_status: e.target.checked ? 'paid' : 'unpaid'
                        })}
                        className="mt-1 h-4 w-4 border-[#C2B280] text-[#6B8E23] focus:ring-[#6B8E23]"
                      />
                      <div className="flex-1">
                        <Label htmlFor="pay_now" className="text-sm font-medium cursor-pointer !text-[#3B3A2E] dark:!text-[#E8E6D5]">
                          Mark as paid now
                        </Label>
                        <Typography variant="body2" className="text-muted-foreground mt-1">
                          {formData.payment_status === 'paid'
                            ? '✓ Stock will be deducted immediately'
                            : 'Order will be marked as unpaid. Stock will be deducted when payment is received.'
                          }
                        </Typography>
                      </div>
                    </div>
                  </Box>
                </Box>

                <Button type="submit" className="w-full !mt-6 bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23]" size="lg" disabled={isLoading}>
                  {isLoading ? 'Processing...' : `Place Order - R${total.toFixed(2)}`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Card className="!border-[#C2B280] dark:!border-[#4B5320] !shadow-md lg:!sticky lg:!top-20 bg-card/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-[#D2B48C]/30 to-[#C2B280]/30 dark:from-[#4B5320]/30 dark:to-[#6C541E]/30">
              <CardTitle className="!text-xl !text-[#3B3A2E] dark:!text-[#E8E6D5]">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Box className="space-y-2">
                {cart.items.map((item) => (
                  <Box key={item.id} className="flex justify-between text-sm">
                    <Typography variant="body2">
                      {item.quantity}x {item.product_detail.name}
                    </Typography>
                    <Typography variant="body2">${item.subtotal}</Typography>
                  </Box>
                ))}
              </Box>

              <Box className="border-t pt-4 space-y-2">
                <Box className="flex justify-between">
                  <Typography>Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between text-sm text-muted-foreground">
                  <Typography variant="body2" className="text-muted-foreground">Tax (8%)</Typography>
                  <Typography variant="body2" className="text-muted-foreground">${tax.toFixed(2)}</Typography>
                </Box>
                <Box className="flex justify-between text-sm text-muted-foreground">
                  <Typography variant="body2" className="text-muted-foreground">Shipping</Typography>
                  <Typography variant="body2" className="text-muted-foreground">{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</Typography>
                </Box>
                <Box className="border-t pt-2">
                  <Box className="flex justify-between text-lg font-bold">
                    <Typography variant="h6" className="font-bold">Total</Typography>
                    <Typography variant="h6" className="font-bold">${total.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
    </div>
  );
}
