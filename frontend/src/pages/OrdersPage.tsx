import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Grid, Paper } from '@mui/material';
import { Package, Calendar, DollarSign, FileText, XCircle } from 'lucide-react';
import { Typography } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useToast } from '../hooks/useToast';
import api from '../api/client';
import type { Order } from '../types';

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-[#D2B48C]',
  processing: 'bg-[#D2B48C]',
  shipped: 'bg-[#9C9A73]',
  delivered: 'bg-[#6B8E23]',
  cancelled: 'bg-[#6C541E]',
};

const statusTextColors: Record<Order['status'], string> = {
  pending: 'text-[#3B3A2E]',
  processing: 'text-[#3B3A2E]',
  shipped: 'text-white',
  delivered: 'text-white',
  cancelled: 'text-white',
};

const paymentStatusColors: Record<Order['payment_status'], string> = {
  unpaid: 'bg-[#D2B48C]',
  paid: 'bg-[#6B8E23]',
  refunded: 'bg-[#6C541E]',
};

const paymentTextColors: Record<Order['payment_status'], string> = {
  unpaid: 'text-[#3B3A2E]',
  paid: 'text-white',
  refunded: 'text-white',
};

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders/');
      setOrders(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch orders',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderNumber: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      await api.post(`/api/orders/${orderNumber}/cancel/`, {
        reason: 'Cancelled by customer',
      });
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Order cancelled successfully',
      });
      fetchOrders();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.error || 'Failed to cancel order',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const canCancelOrder = (order: Order) => {
    return order.status !== 'cancelled' && !order.shipped_at;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h4" className="font-bold mb-6">
          My Orders
        </Typography>
        <div className="flex justify-center items-center py-12">
          <Typography>Loading orders...</Typography>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <Typography variant="h4" className="font-bold mb-6">
        My Orders
      </Typography>

      {orders.length === 0 ? (
        <Paper className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <Typography variant="h6" className="mb-2">
            No Orders Yet
          </Typography>
          <Typography className="text-muted-foreground mb-4">
            You haven't placed any orders yet. Start shopping to see your orders here!
          </Typography>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </Paper>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <Grid container spacing={3}>
                  {/* Order Info */}
                  <Grid item xs={12} md={8}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <Typography variant="h6" className="font-semibold">
                          Order #{order.order_number}
                        </Typography>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          {formatDate(order.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={`${statusColors[order.status]} ${statusTextColors[order.status]}`}>
                          {order.status.toUpperCase()}
                        </Badge>
                        <Badge className={`${paymentStatusColors[order.payment_status]} ${paymentTextColors[order.payment_status]}`}>
                          {order.payment_status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="space-y-2">
                      <Typography variant="body2" className="font-semibold">
                        Items:
                      </Typography>
                      {order.items.slice(0, 3).map((item) => (
                        <Typography key={item.id} variant="body2" className="text-muted-foreground">
                          • {item.quantity}x {item.product_name}
                          {item.variant_info && ` (${item.variant_info})`}
                        </Typography>
                      ))}
                      {order.items.length > 3 && (
                        <Typography variant="body2" className="text-muted-foreground">
                          + {order.items.length - 3} more items
                        </Typography>
                      )}
                    </div>

                    {/* Shipping Address */}
                    <div className="mt-4">
                      <Typography variant="body2" className="font-semibold">
                        Shipping To:
                      </Typography>
                      <Typography variant="body2" className="text-muted-foreground">
                        {order.shipping_full_name}, {order.shipping_city}, {order.shipping_state}
                      </Typography>
                    </div>

                    {/* Cancellation Info */}
                    {order.cancelled_at && (
                      <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                        <Typography variant="body2" className="text-red-700 dark:text-red-400">
                          Cancelled on {formatDate(order.cancelled_at)}
                          {order.cancellation_reason && `: ${order.cancellation_reason}`}
                        </Typography>
                      </div>
                    )}
                  </Grid>

                  {/* Order Total & Actions */}
                  <Grid item xs={12} md={4}>
                    <div className="flex flex-col h-full justify-between">
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                          <Typography variant="body2">Subtotal:</Typography>
                          <Typography variant="body2">R{order.subtotal}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="body2">Tax:</Typography>
                          <Typography variant="body2">R{order.tax}</Typography>
                        </div>
                        <div className="flex justify-between">
                          <Typography variant="body2">Shipping:</Typography>
                          <Typography variant="body2">R{order.shipping_cost}</Typography>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t">
                          <Typography>Total:</Typography>
                          <Typography>R{order.total}</Typography>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link to={`/my-orders/${order.order_number}`} className="block">
                          <Button variant="outline" className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>
                        {canCancelOrder(order) && (
                          <Button
                            variant="outline"
                            className="w-full text-red-600 hover:text-red-700"
                            onClick={() => handleCancelOrder(order.order_number)}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Cancel Order
                          </Button>
                        )}
                      </div>
                    </div>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
