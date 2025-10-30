import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, Tabs, Tab } from '@mui/material';
import { Package, Filter, Plus, Minus, Edit, AlertTriangle, History } from 'lucide-react';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';
import type { Product } from '../../types';

interface StockAdjustment {
  id: number;
  product_name: string;
  variant_info: string | null;
  adjustment_type: string;
  quantity: number;
  reason: string;
  adjusted_by_email: string;
  previous_stock: number;
  new_stock: number;
  created_at: string;
}

export function StaffInventoryPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustDialogOpen, setAdjustDialogOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const { toast } = useToast();

  // Filter states
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState(searchParams.get('out_of_stock') ? 'out' : searchParams.get('low_stock') ? 'low' : '');
  const [searchTerm, setSearchTerm] = useState('');

  // Adjustment form
  const [adjustForm, setAdjustForm] = useState({
    adjustment_type: 'add',
    quantity: 0,
    reason: '',
  });

  useEffect(() => {
    fetchProducts();
    if (currentTab === 1) {
      fetchAdjustments();
    }
  }, [searchParams, currentTab]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (categoryFilter) params.append('category_id', categoryFilter);
      if (stockFilter === 'out') params.append('out_of_stock', 'true');
      if (stockFilter === 'low') params.append('low_stock', 'true');

      const response = await api.get(`/api/inventory/products/?${params.toString()}`);
      setProducts(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch products',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAdjustments = async () => {
    try {
      const response = await api.get('/api/inventory/stock/history/');
      setAdjustments(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch stock adjustment history',
      });
    }
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (stockFilter === 'out') params.set('out_of_stock', 'true');
    if (stockFilter === 'low') params.set('low_stock', 'true');
    setSearchParams(params);
  };

  const clearFilters = () => {
    setCategoryFilter('');
    setStockFilter('');
    setSearchParams(new URLSearchParams());
  };

  const openAdjustDialog = (product: Product) => {
    setSelectedProduct(product);
    setAdjustForm({
      adjustment_type: 'add',
      quantity: 0,
      reason: '',
    });
    setAdjustDialogOpen(true);
  };

  const handleAdjustStock = async () => {
    if (!selectedProduct) return;

    if (!adjustForm.reason.trim()) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please provide a reason for the stock adjustment',
      });
      return;
    }

    try {
      const quantityToAdjust = adjustForm.adjustment_type === 'remove'
        ? -Math.abs(adjustForm.quantity)
        : Math.abs(adjustForm.quantity);

      await api.post('/api/inventory/stock/adjust/', {
        product_id: selectedProduct.id,
        variant_id: null,
        adjustment_type: adjustForm.adjustment_type,
        quantity: quantityToAdjust,
        reason: adjustForm.reason,
      });

      toast({
        variant: 'success',
        title: 'Success',
        description: 'Stock adjusted successfully',
      });
      setAdjustDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to adjust stock',
      });
    }
  };

  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return <Badge className="bg-[#6C541E] text-white">OUT OF STOCK</Badge>;
    } else if (stock < 10) {
      return <Badge className="bg-[#D2B48C] text-[#3B3A2E]">LOW STOCK</Badge>;
    }
    return <Badge className="bg-[#6B8E23] text-white">IN STOCK</Badge>;
  };

  const filteredProducts = products.filter(product => {
    if (!searchTerm) return true;
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Container maxWidth="xl" className="py-8">
      <Typography variant="h4" className="font-bold mb-6">
        Inventory Management
      </Typography>

      <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} className="mb-4">
        <Tab label="Products & Stock" />
        <Tab label="Adjustment History" />
      </Tabs>

      {currentTab === 0 && (
        <>
          {/* Filters */}
          <Paper className="p-4 mb-6">
            <Typography variant="h6" className="font-semibold mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Label>Stock Level</Label>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md bg-background"
                >
                  <option value="">All Stock Levels</option>
                  <option value="out">Out of Stock</option>
                  <option value="low">Low Stock (&lt; 10)</option>
                </select>
              </Grid>
              <Grid item xs={12} md={4}>
                <Label>Search Products</Label>
                <Input
                  placeholder="Search by name or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={4}>
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
          </Paper>

          {/* Products Table */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Typography>Loading products...</Typography>
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
                    }}>Product</TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#3B3A2E',
                      borderBottom: '2px solid #C2B280',
                      '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                    }}>Category</TableCell>
                    <TableCell sx={{
                      fontWeight: 600,
                      color: '#3B3A2E',
                      borderBottom: '2px solid #C2B280',
                      '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                    }}>Price</TableCell>
                    <TableCell align="center" sx={{
                      fontWeight: 600,
                      color: '#3B3A2E',
                      borderBottom: '2px solid #C2B280',
                      '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                    }}>Stock</TableCell>
                    <TableCell align="center" sx={{
                      fontWeight: 600,
                      color: '#3B3A2E',
                      borderBottom: '2px solid #C2B280',
                      '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                    }}>Status</TableCell>
                    <TableCell align="center" sx={{
                      fontWeight: 600,
                      color: '#3B3A2E',
                      borderBottom: '2px solid #C2B280',
                      '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                    }}>Type</TableCell>
                    <TableCell align="center" sx={{
                      fontWeight: 600,
                      color: '#3B3A2E',
                      borderBottom: '2px solid #C2B280',
                      '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                    }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" className="py-8">
                        <Package className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <Typography className="text-muted-foreground">
                          No products found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow key={product.id} sx={{
                        '&:hover': {
                          backgroundColor: 'rgba(210, 180, 140, 0.2)',
                          '.dark &': { backgroundColor: 'rgba(75, 83, 32, 0.3)' }
                        }
                      }}>
                        <TableCell>
                          <Typography className="font-medium">{product.name}</Typography>
                          {!product.is_active && (
                            <Typography variant="body2" className="text-red-600">
                              (Inactive)
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">{product.category_name}</Typography>
                        </TableCell>
                        <TableCell>
                          <Typography className="font-medium">R{product.base_price}</Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography className="font-bold text-lg">
                            {product.stock}
                          </Typography>
                          {product.stock < 10 && product.stock > 0 && (
                            <Typography variant="body2" className="text-orange-600">
                              Low
                            </Typography>
                          )}
                        </TableCell>
                        <TableCell align="center">
                          {getStockBadge(product.stock)}
                        </TableCell>
                        <TableCell align="center">
                          <Badge className={product.is_one_time ? 'bg-[#8B7D3A] text-white' : 'bg-[#9C9A73] text-white'}>
                            {product.is_one_time ? 'ONE-TIME' : 'RESTOCKABLE'}
                          </Badge>
                        </TableCell>
                        <TableCell align="center">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAdjustForm({ ...adjustForm, adjustment_type: 'add' });
                                openAdjustDialog(product);
                              }}
                              title="Add stock"
                              className="text-green-600"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAdjustForm({ ...adjustForm, adjustment_type: 'remove' });
                                openAdjustDialog(product);
                              }}
                              title="Remove stock"
                              className="text-red-600"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      {currentTab === 1 && (
        <>
          {/* Adjustment History */}
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
                  }}>Date</TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>Product</TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>Type</TableCell>
                  <TableCell align="right" sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>Quantity</TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>Previous</TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>New</TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>Reason</TableCell>
                  <TableCell sx={{
                    fontWeight: 600,
                    color: '#3B3A2E',
                    borderBottom: '2px solid #C2B280',
                    '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                  }}>Adjusted By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {adjustments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} align="center" className="py-8">
                      <History className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <Typography className="text-muted-foreground">
                        No adjustment history
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  adjustments.map((adjustment) => (
                    <TableRow key={adjustment.id} sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(210, 180, 140, 0.2)',
                        '.dark &': { backgroundColor: 'rgba(75, 83, 32, 0.3)' }
                      }
                    }}>
                      <TableCell>
                        <Typography variant="body2">{formatDate(adjustment.created_at)}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="font-medium">{adjustment.product_name}</Typography>
                        {adjustment.variant_info && (
                          <Typography variant="body2" className="text-muted-foreground">
                            {adjustment.variant_info}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          adjustment.adjustment_type === 'add' ? 'bg-[#6B8E23] text-white' :
                          adjustment.adjustment_type === 'remove' ? 'bg-[#6C541E] text-white' :
                          adjustment.adjustment_type === 'return' ? 'bg-[#9C9A73] text-white' :
                          adjustment.adjustment_type === 'damaged' ? 'bg-[#D2B48C] text-[#3B3A2E]' :
                          'bg-[#C2B280] text-[#3B3A2E]'
                        }>
                          {adjustment.adjustment_type.toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell align="right">
                        <Typography className={`font-bold ${adjustment.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {adjustment.quantity > 0 ? '+' : ''}{adjustment.quantity}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography>{adjustment.previous_stock}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography className="font-bold">{adjustment.new_stock}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{adjustment.reason}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{adjustment.adjusted_by_email}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      {/* Adjust Stock Dialog */}
      <Dialog open={adjustDialogOpen} onClose={() => setAdjustDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Adjust Stock for {selectedProduct?.name}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <div className="p-4 bg-[#D2B48C]/20 dark:bg-[#3A3621] rounded-md">
              <Typography variant="body2" className="text-muted-foreground">
                Current Stock
              </Typography>
              <Typography variant="h5" className="font-bold">
                {selectedProduct?.stock} units
              </Typography>
            </div>

            <div>
              <Label>Adjustment Type</Label>
              <select
                value={adjustForm.adjustment_type}
                onChange={(e) => setAdjustForm({ ...adjustForm, adjustment_type: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background"
              >
                <option value="add">Add Stock</option>
                <option value="remove">Remove Stock (In-store sale)</option>
                <option value="correction">Inventory Correction</option>
                <option value="return">Customer Return</option>
                <option value="damaged">Damaged/Lost</option>
              </select>
            </div>

            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                min="0"
                value={adjustForm.quantity}
                onChange={(e) => setAdjustForm({ ...adjustForm, quantity: parseInt(e.target.value) || 0 })}
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <Label>Reason *</Label>
              <textarea
                value={adjustForm.reason}
                onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                className="w-full px-3 py-2 border rounded-md bg-background min-h-[100px]"
                placeholder="Enter reason for adjustment (required)"
              />
            </div>

            {selectedProduct && (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-200 dark:border-blue-800">
                <Typography variant="body2" className="font-semibold">
                  New Stock After Adjustment:
                </Typography>
                <Typography variant="h6" className="font-bold">
                  {adjustForm.adjustment_type === 'remove'
                    ? selectedProduct.stock - Math.abs(adjustForm.quantity)
                    : selectedProduct.stock + Math.abs(adjustForm.quantity)
                  } units
                </Typography>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="outline" onClick={() => setAdjustDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAdjustStock}
            disabled={!adjustForm.reason.trim() || adjustForm.quantity === 0}
            className={adjustForm.adjustment_type === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
          >
            {adjustForm.adjustment_type === 'add' ? (
              <><Plus className="h-4 w-4 mr-2" />Add Stock</>
            ) : (
              <><Minus className="h-4 w-4 mr-2" />Remove Stock</>
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
