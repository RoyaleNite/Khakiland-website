import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { ordersAPI } from '../api/client';
import type { Order } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Typography } from '../components/ui/Typography';
import { CheckCircle } from 'lucide-react';

export function OrderConfirmationPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (orderNumber) loadOrder();
  }, [orderNumber]);

  const loadOrder = async () => {
    try {
      const data = await ordersAPI.getOrder(orderNumber!);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Typography>Loading order...</Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="xl" className="py-8">
        <Typography>Order not found</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" className="py-8 px-4 md:px-6">
      <Box className="text-center mb-8">
        <CheckCircle className="h-20 w-20 text-[#6B8E23] dark:text-[#9C9A73] mx-auto mb-4" />
        <Typography variant="h3" className="!font-bold !mb-4 !text-3xl">Order Confirmed!</Typography>
        <Typography className="!text-[#5C5A44] dark:!text-[#C2B280] !text-lg">
          Thank you for your purchase. Your order has been placed successfully.
        </Typography>
      </Box>

      <Card className="mb-6 !border-[#C2B280] dark:!border-[#4B5320] !shadow-lg">
        <CardHeader>
          <Box className="flex justify-between items-center">
            <CardTitle>Order Details</CardTitle>
            <Typography variant="body2" className="text-muted-foreground">
              Order #{order.order_number}
            </Typography>
          </Box>
        </CardHeader>
        <CardContent className="space-y-6">
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="h6" className="font-semibold mb-2">Shipping Address</Typography>
                <Box className="text-sm text-muted-foreground space-y-1">
                  <Typography variant="body2" className="text-muted-foreground">{order.shipping_full_name}</Typography>
                  <Typography variant="body2" className="text-muted-foreground">{order.shipping_address_line1}</Typography>
                  {order.shipping_address_line2 && <Typography variant="body2" className="text-muted-foreground">{order.shipping_address_line2}</Typography>}
                  <Typography variant="body2" className="text-muted-foreground">
                    {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
                  </Typography>
                  <Typography variant="body2" className="text-muted-foreground">{order.shipping_country}</Typography>
                  <Typography variant="body2" className="text-muted-foreground pt-2">Phone: {order.shipping_phone}</Typography>
                </Box>
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box>
                <Typography variant="h6" className="font-semibold mb-2">Order Summary</Typography>
                <Box className="text-sm space-y-2">
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-muted-foreground">Subtotal</Typography>
                    <Typography variant="body2">${order.subtotal}</Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-muted-foreground">Tax</Typography>
                    <Typography variant="body2">${order.tax}</Typography>
                  </Box>
                  <Box className="flex justify-between">
                    <Typography variant="body2" className="text-muted-foreground">Shipping</Typography>
                    <Typography variant="body2">
                      {parseFloat(order.shipping_cost) === 0
                        ? 'FREE'
                        : `$${order.shipping_cost}`}
                    </Typography>
                  </Box>
                  <Box className="border-t pt-2">
                    <Box className="flex justify-between font-bold text-base">
                      <Typography className="font-bold">Total</Typography>
                      <Typography className="font-bold">${order.total}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>

          <Box>
            <Typography variant="h6" className="font-semibold mb-4">Items Ordered</Typography>
            <Box className="space-y-3">
              {order.items.map((item) => (
                <Box key={item.id} className="flex justify-between items-center py-2 border-b">
                  <Box>
                    <Typography className="font-medium">{item.product_name}</Typography>
                    {item.variant_info && (
                      <Typography variant="body2" className="text-muted-foreground">{item.variant_info}</Typography>
                    )}
                    <Typography variant="body2" className="text-muted-foreground">Quantity: {item.quantity}</Typography>
                  </Box>
                  <Box className="text-right">
                    <Typography className="font-semibold">${item.subtotal}</Typography>
                    <Typography variant="body2" className="text-muted-foreground">${item.price} each</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>

          <Box className="bg-muted p-4 rounded-lg">
            <Typography variant="body2" className="text-center">
              A confirmation email has been sent to your registered email address.
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Box className="flex justify-center gap-4">
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </Box>
    </Container>
  );
}
