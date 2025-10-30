import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Upload,
  Save,
  X,
  Tag,
} from 'lucide-react';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';

interface Category {
  id: number;
  name: string;
  slug: string;
  has_variants: boolean;
  variant_type: string;
}

interface ProductVariant {
  id?: number;
  sku: string;
  color: string;
  size: string;
  price_modifier: string;
  stock: number;
  is_active: boolean;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  category: number;
  category_name: string;
  description: string;
  base_price: string;
  stock: number;
  image: string | null;
  svg_placeholder: string;
  is_active: boolean;
  is_restockable: boolean;
  variants: ProductVariant[];
  has_variants: boolean;
}

export function ProductManagementPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Product form state
  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    category: '',
    description: '',
    base_price: '',
    stock: 0,
    image: null as File | null,
    svg_placeholder: '',
    is_active: true,
    is_restockable: true,
  });

  // Variant management
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-generate slug from name
    if (productForm.name && !editingProduct) {
      const slug = productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setProductForm((prev) => ({ ...prev, slug }));
    }
  }, [productForm.name, editingProduct]);

  useEffect(() => {
    // Update selected category when category changes
    if (productForm.category) {
      const cat = categories.find((c) => c.id === parseInt(productForm.category));
      setSelectedCategory(cat || null);
    }
  }, [productForm.category, categories]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products/staff/products/');
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

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/products/categories/');
      setCategories(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch categories',
      });
    }
  };

  const resetForm = () => {
    setProductForm({
      name: '',
      slug: '',
      category: '',
      description: '',
      base_price: '',
      stock: 0,
      image: null,
      svg_placeholder: '',
      is_active: true,
      is_restockable: true,
    });
    setVariants([]);
    setEditingProduct(null);
    setSelectedCategory(null);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      slug: product.slug,
      category: product.category.toString(),
      description: product.description,
      base_price: product.base_price,
      stock: product.stock,
      image: null,
      svg_placeholder: product.svg_placeholder,
      is_active: product.is_active,
      is_restockable: product.is_restockable,
    });
    setVariants(product.variants || []);
    setCurrentTab(1);
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/api/products/staff/products/${productToDelete.id}/`);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Product deactivated successfully',
      });
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      fetchProducts();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete product',
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProductForm({ ...productForm, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!productForm.name || !productForm.category || !productForm.base_price) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('slug', productForm.slug);
      formData.append('category', productForm.category);
      formData.append('description', productForm.description);
      formData.append('base_price', productForm.base_price);
      formData.append('stock', productForm.stock.toString());
      formData.append('svg_placeholder', productForm.svg_placeholder);
      formData.append('is_active', productForm.is_active.toString());
      formData.append('is_restockable', productForm.is_restockable.toString());

      if (productForm.image) {
        formData.append('image', productForm.image);
      }

      let response;
      if (editingProduct) {
        // Update existing product
        response = await api.put(
          `/api/products/staff/products/${editingProduct.id}/`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        // Update variants if category has variants
        if (selectedCategory?.has_variants && variants.length > 0) {
          await Promise.all(
            variants.map(async (variant) => {
              if (variant.id) {
                // Update existing variant
                await api.put(
                  `/api/products/staff/products/${editingProduct.id}/variants/${variant.id}/`,
                  variant
                );
              } else {
                // Create new variant
                await api.post(
                  `/api/products/staff/products/${editingProduct.id}/variants/`,
                  variant
                );
              }
            })
          );
        }

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Product updated successfully',
        });
      } else {
        // Create new product
        response = await api.post(
          '/api/products/staff/products/create/',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );

        // Create variants if category has variants
        if (selectedCategory?.has_variants && variants.length > 0) {
          const productId = response.data.id;
          await Promise.all(
            variants.map((variant) =>
              api.post(`/api/products/staff/products/${productId}/variants/`, variant)
            )
          );
        }

        toast({
          variant: 'success',
          title: 'Success',
          description: 'Product created successfully',
        });
      }

      resetForm();
      setCurrentTab(0);
      fetchProducts();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save product',
      });
    }
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      {
        sku: '',
        color: '',
        size: '',
        price_modifier: '0.00',
        stock: 0,
        is_active: true,
      },
    ]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof ProductVariant, value: any) => {
    const newVariants = [...variants];
    newVariants[index] = { ...newVariants[index], [field]: value };
    setVariants(newVariants);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" className="font-bold mb-6">
          Product Management
        </Typography>

        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} className="mb-4">
          <Tab label="Products List" />
          <Tab label={editingProduct ? 'Edit Product' : 'Create Product'} />
        </Tabs>

        {currentTab === 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  All Products
                </CardTitle>
                <Button onClick={() => { resetForm(); setCurrentTab(1); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Typography className="text-center py-8">Loading products...</Typography>
              ) : products.length === 0 ? (
                <Typography className="text-center py-8 text-muted-foreground">
                  No products found. Create your first product!
                </Typography>
              ) : (
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
                        }}>Name</TableCell>
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
                        <TableCell sx={{
                          fontWeight: 600,
                          color: '#3B3A2E',
                          borderBottom: '2px solid #C2B280',
                          '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                        }}>Stock</TableCell>
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
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id} sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(210, 180, 140, 0.2)',
                            '.dark &': { backgroundColor: 'rgba(75, 83, 32, 0.3)' }
                          }
                        }}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              {product.image ? (
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                              ) : (
                                <div
                                  className="w-12 h-12 rounded flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: product.svg_placeholder }}
                                />
                              )}
                              <div>
                                <Typography className="font-medium">{product.name}</Typography>
                                <Typography variant="body2" className="text-muted-foreground">
                                  {product.slug}
                                </Typography>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{product.category_name}</TableCell>
                          <TableCell>R{product.base_price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge className={product.is_active ? 'bg-[#6B8E23] text-white' : 'bg-[#6C541E] text-white'}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(product)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {currentTab === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>
                {editingProduct ? 'Edit Product' : 'Create New Product'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Label htmlFor="name">Product Name*</Label>
                    <Input
                      id="name"
                      value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Label htmlFor="slug">Slug*</Label>
                    <Input
                      id="slug"
                      value={productForm.slug}
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Label htmlFor="category">Category*</Label>
                    <select
                      id="category"
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background"
                      required
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Label htmlFor="base_price">Base Price (R)*</Label>
                    <Input
                      id="base_price"
                      type="number"
                      step="0.01"
                      value={productForm.base_price}
                      onChange={(e) => setProductForm({ ...productForm, base_price: e.target.value })}
                      required
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Label htmlFor="stock">Initial Stock</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Label htmlFor="image">Product Image</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {productForm.image && (
                      <Typography variant="body2" className="text-muted-foreground mt-1">
                        Selected: {productForm.image.name}
                      </Typography>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background min-h-[100px]"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Label htmlFor="svg_placeholder">SVG Placeholder (optional)</Label>
                    <Input
                      id="svg_placeholder"
                      value={productForm.svg_placeholder}
                      onChange={(e) => setProductForm({ ...productForm, svg_placeholder: e.target.value })}
                      placeholder="<svg>...</svg>"
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <div className="flex gap-4 pt-8">
                      <Label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.is_active}
                          onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Active
                      </Label>
                      <Label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={productForm.is_restockable}
                          onChange={(e) => setProductForm({ ...productForm, is_restockable: e.target.checked })}
                          className="w-4 h-4"
                        />
                        Restockable
                      </Label>
                    </div>
                  </Grid>
                </Grid>

                {/* Variant Management */}
                {selectedCategory?.has_variants && (
                  <div className="mt-6 p-4 border border-[#C2B280] dark:border-[#4B5320] rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <Typography variant="h6" className="font-semibold flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Product Variants ({selectedCategory.variant_type})
                      </Typography>
                      <Button type="button" variant="outline" size="sm" onClick={addVariant}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Variant
                      </Button>
                    </div>

                    {variants.length === 0 ? (
                      <Typography className="text-center text-muted-foreground py-4">
                        No variants added. Click "Add Variant" to create variations.
                      </Typography>
                    ) : (
                      <div className="space-y-4">
                        {variants.map((variant, index) => (
                          <div key={index} className="p-4 bg-muted/20 rounded-md">
                            <div className="flex items-center justify-between mb-3">
                              <Typography variant="body2" className="font-semibold">
                                Variant {index + 1}
                              </Typography>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => removeVariant(index)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={3}>
                                <Label>SKU*</Label>
                                <Input
                                  value={variant.sku}
                                  onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                                  required
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <Label>Color</Label>
                                <Input
                                  value={variant.color}
                                  onChange={(e) => updateVariant(index, 'color', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <Label>Size</Label>
                                <Input
                                  value={variant.size}
                                  onChange={(e) => updateVariant(index, 'size', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <Label>Price Modifier</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  value={variant.price_modifier}
                                  onChange={(e) => updateVariant(index, 'price_modifier', e.target.value)}
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <Label>Stock</Label>
                                <Input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value))}
                                />
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingProduct ? 'Update Product' : 'Create Product'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      resetForm();
                      setCurrentTab(0);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to deactivate "{productToDelete?.name}"? This will hide it from customers.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Deactivate
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
