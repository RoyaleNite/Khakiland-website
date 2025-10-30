import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ArrowLeft, Download, Package, MapPin, CreditCard, Truck, XCircle } from 'lucide-react';
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

export function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (orderNumber) {
      fetchOrder();
    }
  }, [orderNumber]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/orders/${orderNumber}/`);
      setOrder(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch order details',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/api/orders/${orderNumber}/invoice/`);
      const invoiceData = response.data;

      // Create a simple HTML invoice
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice - ${invoiceData.order_number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #6B8E23; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #6B8E23; padding-bottom: 5px; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            th { background-color: #E8E6D5; color: #3B3A2E; }
            .total-row { font-weight: bold; font-size: 1.2em; }
            .text-right { text-align: right; }
            .badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; }
            .badge-paid { background-color: #10B981; color: white; }
            .badge-unpaid { background-color: #F59E0B; color: white; }
            .badge-${invoiceData.status} { background-color: #6366F1; color: white; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>KHAKILAND</h1>
            <h2>INVOICE</h2>
            <p>Order #${invoiceData.order_number}</p>
            <p>Date: ${invoiceData.order_date}</p>
          </div>

          <div class="section">
            <div class="section-title">Customer Information</div>
            <p><strong>Name:</strong> ${invoiceData.customer.name}</p>
            <p><strong>Email:</strong> ${invoiceData.customer.email}</p>
          </div>

          <div class="section">
            <div class="section-title">Shipping Address</div>
            <p>${invoiceData.shipping_address.full_name}</p>
            <p>${invoiceData.shipping_address.phone}</p>
            <p>${invoiceData.shipping_address.address_line1}</p>
            ${invoiceData.shipping_address.address_line2 ? `<p>${invoiceData.shipping_address.address_line2}</p>` : ''}
            <p>${invoiceData.shipping_address.city}, ${invoiceData.shipping_address.state} ${invoiceData.shipping_address.postal_code}</p>
            <p>${invoiceData.shipping_address.country}</p>
          </div>

          <div class="section">
            <div class="section-title">Order Status</div>
            <p><strong>Order Status:</strong> <span class="badge badge-${invoiceData.status}">${invoiceData.status.toUpperCase()}</span></p>
            <p><strong>Payment Status:</strong> <span class="badge badge-${invoiceData.payment_status}">${invoiceData.payment_status.toUpperCase()}</span></p>
            ${invoiceData.payment_method ? `<p><strong>Payment Method:</strong> ${invoiceData.payment_method}</p>` : ''}
          </div>

          <div class="section">
            <div class="section-title">Order Items</div>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Price</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items.map((item: any) => `
                  <tr>
                    <td>${item.product_name}${item.variant_info ? ` (${item.variant_info})` : ''}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">R${item.unit_price}</td>
                    <td class="text-right">R${item.subtotal}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <table style="width: 300px; margin-left: auto;">
              <tr>
                <td>Subtotal:</td>
                <td class="text-right">R${invoiceData.subtotal}</td>
              </tr>
              <tr>
                <td>Tax:</td>
                <td class="text-right">R${invoiceData.tax}</td>
              </tr>
              <tr>
                <td>Shipping:</td>
                <td class="text-right">R${invoiceData.shipping_cost}</td>
              </tr>
              <tr class="total-row">
                <td>Total:</td>
                <td class="text-right">R${invoiceData.total}</td>
              </tr>
            </table>
          </div>

          <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
            <p>Thank you for your business!</p>
            <p>For any questions, please contact us at support@khakiland.com</p>
          </div>
        </body>
        </html>
      `;

      // Create a Blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${invoiceData.order_number}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Invoice downloaded successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to download invoice',
      });
    }
  };

  const handleCancelOrder = async () => {
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
      fetchOrder();
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canCancelOrder = order && order.status !== 'cancelled' && !order.shipped_at;

  if (loading) {
    return (
      <Container maxWidth="lg" className="py-8">
        <div className="flex justify-center items-center py-12">
          <Typography>Loading order details...</Typography>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container maxWidth="lg" className="py-8">
        <Typography variant="h6" className="text-center">
          Order not found
        </Typography>
        <div className="flex justify-center mt-4">
          <Link to="/my-orders">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/my-orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <Typography variant="h4" className="font-bold">
            Order #{order.order_number}
          </Typography>
        </div>
        <Button onClick={handleDownloadInvoice}>
          <Download className="h-4 w-4 mr-2" />
          Download Invoice
        </Button>
      </div>

      <Grid container spacing={4}>
        {/* Order Status Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Typography variant="body2" className="text-muted-foreground">
                    Order Status
                  </Typography>
                  <Badge className={`${statusColors[order.status]} ${statusTextColors[order.status]} mt-1`}>
                    {order.status.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <Typography variant="body2" className="text-muted-foreground">
                    Payment Status
                  </Typography>
                  <Badge className={`${paymentStatusColors[order.payment_status]} ${paymentTextColors[order.payment_status]} mt-1`}>
                    {order.payment_status.toUpperCase()}
                  </Badge>
                </div>

                {order.payment_method && (
                  <div>
                    <Typography variant="body2" className="text-muted-foreground">
                      Payment Method
                    </Typography>
                    <Typography className="mt-1">{order.payment_method}</Typography>
                  </div>
                )}

                <div>
                  <Typography variant="body2" className="text-muted-foreground">
                    Order Date
                  </Typography>
                  <Typography className="mt-1">{formatDate(order.created_at)}</Typography>
                </div>

                {order.shipped_at && (
                  <div>
                    <Typography variant="body2" className="text-muted-foreground">
                      Shipped On
                    </Typography>
                    <Typography className="mt-1">{formatDate(order.shipped_at)}</Typography>
                  </div>
                )}

                {order.delivered_at && (
                  <div>
                    <Typography variant="body2" className="text-muted-foreground">
                      Delivered On
                    </Typography>
                    <Typography className="mt-1">{formatDate(order.delivered_at)}</Typography>
                  </div>
                )}

                {order.cancelled_at && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800">
                    <Typography variant="body2" className="text-red-700 dark:text-red-400 font-semibold">
                      Cancelled
                    </Typography>
                    <Typography variant="body2" className="text-red-600 dark:text-red-500">
                      {formatDate(order.cancelled_at)}
                    </Typography>
                    {order.cancellation_reason && (
                      <Typography variant="body2" className="text-red-600 dark:text-red-500 mt-1">
                        Reason: {order.cancellation_reason}
                      </Typography>
                    )}
                  </div>
                )}

                {canCancelOrder && (
                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700 mt-4"
                    onClick={handleCancelOrder}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Card */}
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography className="font-semibold">{order.shipping_full_name}</Typography>
              <Typography variant="body2" className="text-muted-foreground">
                {order.shipping_phone}
              </Typography>
              <Typography variant="body2" className="text-muted-foreground mt-2">
                {order.shipping_address_line1}
              </Typography>
              {order.shipping_address_line2 && (
                <Typography variant="body2" className="text-muted-foreground">
                  {order.shipping_address_line2}
                </Typography>
              )}
              <Typography variant="body2" className="text-muted-foreground">
                {order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}
              </Typography>
              <Typography variant="body2" className="text-muted-foreground">
                {order.shipping_country}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items & Summary */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <TableContainer sx={{
                borderRadius: '8px',
                border: '1px solid #C2B280',
                overflow: 'hidden',
                '.dark &': { borderColor: '#4B5320' }
              }}>
                <Table>
                  <TableHead sx={{
                    background: 'linear-gradient(to right, rgba(210, 180, 140, 0.3), rgba(194, 178, 128, 0.3))',
                    '.dark &': { background: 'linear-gradient(to right, rgba(75, 83, 32, 0.3), rgba(108, 84, 30, 0.3))' }
                  }}>
                    <TableRow>
                      <TableCell sx={{
                        fontWeight: 600,
                        color: '#3B3A2E',
                        borderBottom: '2px solid #C2B280',
                        '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                      }}>Product</TableCell>
                      <TableCell align="right" sx={{
                        fontWeight: 600,
                        color: '#3B3A2E',
                        borderBottom: '2px solid #C2B280',
                        '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                      }}>Quantity</TableCell>
                      <TableCell align="right" sx={{
                        fontWeight: 600,
                        color: '#3B3A2E',
                        borderBottom: '2px solid #C2B280',
                        '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                      }}>Price</TableCell>
                      <TableCell align="right" sx={{
                        fontWeight: 600,
                        color: '#3B3A2E',
                        borderBottom: '2px solid #C2B280',
                        '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                      }}>Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.id} sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(210, 180, 140, 0.2)',
                          '.dark &': { backgroundColor: 'rgba(75, 83, 32, 0.3)' }
                        }
                      }}>
                        <TableCell>
                          <Typography className="font-medium">{item.product_name}</Typography>
                          {item.variant_info && (
                            <Typography variant="body2" className="text-muted-foreground">
                              {item.variant_info}
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="right">{item.quantity}</TableCell>
                        <TableCell align="right">R{item.price}</TableCell>
                        <TableCell align="right">R{item.subtotal}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Order Summary */}
              <div className="mt-6 border-t pt-6">
                <div className="space-y-2 max-w-sm ml-auto">
                  <div className="flex justify-between">
                    <Typography>Subtotal:</Typography>
                    <Typography>R{order.subtotal}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography>Tax:</Typography>
                    <Typography>R{order.tax}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography>Shipping:</Typography>
                    <Typography>R{order.shipping_cost}</Typography>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <Typography>Total:</Typography>
                    <Typography>R{order.total}</Typography>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
