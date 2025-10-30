import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Package, Filter, Search, Edit, XCircle, CheckCircle, Truck, RotateCcw } from 'lucide-react';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';
import type { Order } from '../../types';

const statusColors: Record<Order['status'], string> = {
  pending: 'bg-[#D2B48C]',
  processing: 'bg-blue-500',
  shipped: 'bg-purple-500',
  delivered: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const paymentStatusColors: Record<Order['payment_status'], string> = {
  unpaid: 'bg-orange-500',
  paid: 'bg-green-500',
  refunded: 'bg-gray-500',
};

export function StaffOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [receivedBackDialogOpen, setReceivedBackDialogOpen] = useState(false);
  const { toast } = useToast();

  // Filter states
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(searchParams.get('payment_status') || '');
  const [startDate, setStartDate] = useState(searchParams.get('start_date') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end_date') || '');
  const [searchTerm, setSearchTerm] = useState('');

  // Update form states
  const [updateForm, setUpdateForm] = useState({
    status: '',
    payment_status: '',
    payment_method: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [searchParams]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter) params.append('status', statusFilter);
      if (paymentStatusFilter) params.append('payment_status', paymentStatusFilter);
      if (startDate) params.append('start_date', startDate);
      if (endDate) params.append('end_date', endDate);

      const response = await api.get(`/api/orders/staff/all/?${params.toString()}`);
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

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (statusFilter) params.set('status', statusFilter);
    if (paymentStatusFilter) params.set('payment_status', paymentStatusFilter);
    if (startDate) params.set('start_date', startDate);
    if (endDate) params.set('end_date', endDate);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setStatusFilter('');
    setPaymentStatusFilter('');
    setStartDate('');
    setEndDate('');
    setSearchParams(new URLSearchParams());
  };

  const openUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setUpdateForm({
      status: order.status,
      payment_status: order.payment_status,
      payment_method: order.payment_method || '',
    });
    setUpdateDialogOpen(true);
  };

  const handleUpdateOrder = async () => {
    if (!selectedOrder) return;

    try {
      await api.patch(`/api/orders/staff/${selectedOrder.order_number}/update/`, updateForm);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Order updated successfully',
      });
      setUpdateDialogOpen(false);
      fetchOrders();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update order',
      });
    }
  };

  const handleCancelOrder = async (orderNumber: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    const reason = prompt('Enter cancellation reason:');
    if (!reason) return;

    try {
      await api.post(`/api/orders/staff/${orderNumber}/cancel/`, { reason });
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

  const handleMarkReceivedBack = async () => {
    if (!selectedOrder) return;

    try {
      await api.post(`/api/orders/staff/${selectedOrder.order_number}/received-back/`);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Order marked as received back - stock restored',
      });
      setReceivedBackDialogOpen(false);
      fetchOrders();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.error || 'Failed to mark as received back',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredOrders = orders.filter(order => {
    if (!searchTerm) return true;
    return (
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="font-bold mb-6">
        Order Management
      </Typography>

      {/* Filters */}
      <Paper className="p-4 mb-6">
        <Typography variant="h6" className="font-semibold mb-4 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Label>Order Status</Label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Label>Payment Status</Label>
            <select
              value={paymentStatusFilter}
              onChange={(e) => setPaymentStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md bg-background"
            >
              <option value="">All Payment Statuses</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
          </Grid>
          <Grid item xs={12} md={2}>
            <Label>Start Date</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Label>End Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Label>&nbsp;</Label>
            <div className="flex gap-2">
              <Button onClick={applyFilters} className="flex-1">
                Apply
              </Button>
              <Button onClick={clearFilters} variant="outline">
                Clear
              </Button>
            </div>
          </Grid>
        </Grid>

        <div className="mt-4">
          <Label>Search Orders</Label>
          <Input
            placeholder="Search by order number, customer name, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
      </Paper>

      {/* Orders Table */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Typography>Loading orders...</Typography>
        </div>
      ) : (
        <TableContainer component={Paper} sx={{
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
                }}>Order #</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#3B3A2E',
                  borderBottom: '2px solid #C2B280',
                  '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                }}>Customer</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#3B3A2E',
                  borderBottom: '2px solid #C2B280',
                  '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                }}>Date</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#3B3A2E',
                  borderBottom: '2px solid #C2B280',
                  '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                }}>Status</TableCell>
                <TableCell sx={{
                  fontWeight: 600,
                  color: '#3B3A2E',
                  borderBottom: '2px solid #C2B280',
                  '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                }}>Payment</TableCell>
                <TableCell align="right" sx={{
                  fontWeight: 600,
                  color: '#3B3A2E',
                  borderBottom: '2px solid #C2B280',
                  '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                }}>Total</TableCell>
                <TableCell align="center" sx={{
                  fontWeight: 600,
                  color: '#3B3A2E',
                  borderBottom: '2px solid #C2B280',
                  '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" className="py-8">
                    <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <Typography className="text-muted-foreground">
                      No orders found
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order.id} sx={{
                    '&:hover': {
                      backgroundColor: 'rgba(210, 180, 140, 0.2)',
                      '.dark &': { backgroundColor: 'rgba(75, 83, 32, 0.3)' }
                    }
                  }}>
                    <TableCell>
                      <Link
                        to={`/my-orders/${order.order_number}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {order.order_number}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Typography className="font-medium">{order.shipping_full_name}</Typography>
                      <Typography variant="body2" className="text-muted-foreground">
                        {order.shipping_city}, {order.shipping_state}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDate(order.created_at)}</Typography>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[order.status]}>
                        {order.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={paymentStatusColors[order.payment_status]}>
                        {order.payment_status.toUpperCase()}
                      </Badge>
                      {order.payment_method && (
                        <Typography variant="body2" className="text-muted-foreground mt-1">
                          {order.payment_method}
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell align="right">
                      <Typography className="font-bold">R{order.total}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <div className="flex gap-1 justify-center">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openUpdateDialog(order)}
                          title="Update order"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {order.status !== 'cancelled' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCancelOrder(order.order_number)}
                            className="text-red-600"
                            title="Cancel order"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        )}
                        {order.status === 'cancelled' && order.shipped_at && !order.is_received_back && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order);
                              setReceivedBackDialogOpen(true);
                            }}
                            className="text-green-600"
                            title="Mark as received back"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Update Order Dialog */}
      <Dialog open={updateDialogOpen} onClose={() => setUpdateDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Update Order {selectedOrder?.order_number}</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <div>
              <Label>Order Status</Label>
              <select
                value={updateForm.status}
                onChange={(e) => setUpdateForm({ ...updateForm, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <Label>Payment Status</Label>
              <select
                value={updateForm.payment_status}
                onChange={(e) => setUpdateForm({ ...updateForm, payment_status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="refunded">Refunded</option>
              </select>
              <Typography variant="body2" className="text-muted-foreground mt-1">
                {updateForm.payment_status === 'paid' && selectedOrder?.payment_status !== 'paid' && (
                  <span className="text-orange-600">⚠️ Changing to paid will deduct stock</span>
                )}
              </Typography>
            </div>

            <div>
              <Label>Payment Method</Label>
              <select
                value={updateForm.payment_method}
                onChange={(e) => setUpdateForm({ ...updateForm, payment_method: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="">Not specified</option>
                <option value="cash">Cash</option>
                <option value="card">Credit/Debit Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="eft">EFT</option>
                <option value="in_store">In Store</option>
              </select>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={() => setUpdateDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleUpdateOrder}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Update Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* Received Back Dialog */}
      <Dialog open={receivedBackDialogOpen} onClose={() => setReceivedBackDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Mark Items as Received Back</DialogTitle>
        <DialogContent>
          <Typography className="py-4">
            Mark order {selectedOrder?.order_number} as received back? This will restore the stock for all items in this order.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={() => setReceivedBackDialogOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleMarkReceivedBack} className="bg-green-600 hover:bg-green-700">
            <RotateCcw className="h-4 w-4 mr-2" />
            Mark as Received Back
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
