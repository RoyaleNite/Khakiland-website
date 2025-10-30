import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Grid } from '@mui/material';
import {
  DollarSign,
  ShoppingCart,
  Package,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  AlertTriangle,
  Box as BoxIcon,
} from 'lucide-react';
import { Typography } from '../../components/ui/Typography';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';
import type { OrderStats, InventoryStats } from '../../types';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
  trend?: string;
  color?: string;
}

function StatCard({ title, value, icon, description, trend, color = 'text-blue-600' }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="body2" className="text-muted-foreground font-medium">
              {title}
            </Typography>
            <Typography variant="h4" className="font-bold mt-2">
              {value}
            </Typography>
            {description && (
              <Typography variant="body2" className="text-muted-foreground mt-1">
                {description}
              </Typography>
            )}
            {trend && (
              <Typography variant="body2" className="text-green-600 mt-1">
                {trend}
              </Typography>
            )}
          </div>
          <div className={`p-3 rounded-full bg-opacity-10 ${color} bg-current`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StaffDashboard() {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [inventoryStats, setInventoryStats] = useState<InventoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [ordersRes, inventoryRes] = await Promise.all([
        api.get('/api/orders/staff/stats/'),
        api.get('/api/inventory/stats/'),
      ]);
      setOrderStats(ordersRes.data);
      setInventoryStats(inventoryRes.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch dashboard statistics',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
        <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" className="font-bold mb-6">
          Staff Dashboard
        </Typography>
        <div className="flex justify-center items-center py-12">
          <Typography>Loading dashboard...</Typography>
        </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="xl" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <Typography variant="h4" className="font-bold">
          Staff Dashboard
        </Typography>
        <Button onClick={fetchStats} variant="outline">
          Refresh
        </Button>
      </div>

      {/* Order Statistics */}
      <div className="mb-8">
        <Typography variant="h6" className="font-semibold mb-4">
          Order Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={orderStats?.total_orders || 0}
              icon={<ShoppingCart className="h-6 w-6" />}
              description="All time"
              color="text-blue-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Revenue"
              value={`R${orderStats?.total_revenue.toFixed(2) || '0.00'}`}
              icon={<DollarSign className="h-6 w-6" />}
              description="From paid orders"
              color="text-green-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Paid Orders"
              value={orderStats?.paid_orders || 0}
              icon={<CheckCircle className="h-6 w-6" />}
              description={`${orderStats?.unpaid_orders || 0} unpaid`}
              color="text-green-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Cancelled Orders"
              value={orderStats?.cancelled_orders || 0}
              icon={<XCircle className="h-6 w-6" />}
              color="text-red-600"
            />
          </Grid>
        </Grid>
      </div>

      {/* Order Status Breakdown */}
      <div className="mb-8">
        <Typography variant="h6" className="font-semibold mb-4">
          Order Status Breakdown
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={orderStats?.pending_orders || 0}
              icon={<Clock className="h-6 w-6" />}
              description="Awaiting processing"
              color="text-[#6B8E23]"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Processing"
              value={orderStats?.processing_orders || 0}
              icon={<Package className="h-6 w-6" />}
              description="Being prepared"
              color="text-blue-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Shipped"
              value={orderStats?.shipped_orders || 0}
              icon={<Truck className="h-6 w-6" />}
              description="In transit"
              color="text-purple-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Delivered"
              value={orderStats?.delivered_orders || 0}
              icon={<CheckCircle className="h-6 w-6" />}
              description="Completed"
              color="text-green-600"
            />
          </Grid>
        </Grid>
      </div>

      {/* Inventory Statistics */}
      <div className="mb-8">
        <Typography variant="h6" className="font-semibold mb-4">
          Inventory Statistics
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Products"
              value={inventoryStats?.total_products || 0}
              icon={<BoxIcon className="h-6 w-6" />}
              description={`${inventoryStats?.active_products || 0} active`}
              color="text-blue-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Out of Stock"
              value={inventoryStats?.out_of_stock || 0}
              icon={<AlertTriangle className="h-6 w-6" />}
              description="Need restocking"
              color="text-red-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Low Stock"
              value={inventoryStats?.low_stock || 0}
              icon={<AlertTriangle className="h-6 w-6" />}
              description="Below 10 units"
              color="text-orange-600"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Categories"
              value={inventoryStats?.categories_count || 0}
              icon={<Package className="h-6 w-6" />}
              color="text-purple-600"
            />
          </Grid>
        </Grid>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Link to="/staff/orders?status=pending" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  View Pending Orders
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link to="/staff/orders?payment_status=unpaid" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="h-4 w-4 mr-2" />
                  View Unpaid Orders
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link to="/staff/inventory?out_of_stock=true" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Out of Stock
                </Button>
              </Link>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Link to="/staff/inventory?low_stock=true" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Low Stock
                </Button>
              </Link>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      </Container>
    </div>
  );
}
