import { useEffect, useState } from 'react';
import {
  Container,
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
  Paper,
} from '@mui/material';
import {
  Tag,
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  FolderTree,
} from 'lucide-react';
import { Typography } from '../../components/ui/Typography';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useToast } from '../../hooks/useToast';
import api from '../../api/client';
import type { Category } from '../../types';

export function CategoryManagementPage() {
  const [currentTab, setCurrentTab] = useState(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const { toast } = useToast();

  // Category form state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '' as string | number,
    has_variants: false,
    variant_type: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Auto-generate slug from name
    if (categoryForm.name && !editingCategory) {
      const slug = categoryForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setCategoryForm((prev) => ({ ...prev, slug }));
    }
  }, [categoryForm.name, editingCategory]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/products/staff/categories/');
      setCategories(response.data);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch categories',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      parent: '',
      has_variants: false,
      variant_type: '',
    });
    setEditingCategory(null);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      parent: category.parent || '',
      has_variants: category.has_variants,
      variant_type: category.variant_type,
    });
    setCurrentTab(1);
  };

  const handleDeleteClick = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!categoryToDelete) return;

    try {
      await api.delete(`/api/products/staff/categories/${categoryToDelete.id}/`);
      toast({
        variant: 'success',
        title: 'Success',
        description: 'Category deleted successfully',
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to delete category. It may have products.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!categoryForm.name || !categoryForm.slug) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill in all required fields',
      });
      return;
    }

    try {
      const data = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        parent: categoryForm.parent || null,
        has_variants: categoryForm.has_variants,
        variant_type: categoryForm.has_variants ? categoryForm.variant_type : '',
      };

      if (editingCategory) {
        // Update existing category
        await api.put(`/api/products/staff/categories/${editingCategory.id}/`, data);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        // Create new category
        await api.post('/api/products/staff/categories/create/', data);
        toast({
          variant: 'success',
          title: 'Success',
          description: 'Category created successfully',
        });
      }

      resetForm();
      setCurrentTab(0);
      fetchCategories();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save category',
      });
    }
  };

  // Get parent categories (no parent)
  const parentCategories = categories.filter((cat) => !cat.parent);

  // Get category hierarchy display
  const getCategoryDisplay = (category: Category) => {
    if (category.parent_name) {
      return `${category.parent_name} > ${category.name}`;
    }
    return category.name;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="xl" className="py-8">
        <Typography variant="h4" className="font-bold mb-6">
          Category Management
        </Typography>

        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)} className="mb-4">
          <Tab label="Categories List" />
          <Tab label={editingCategory ? 'Edit Category' : 'Create Category'} />
        </Tabs>

        {currentTab === 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5" />
                  All Categories
                </CardTitle>
                <Button onClick={() => { resetForm(); setCurrentTab(1); }}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Typography className="text-center py-8">Loading categories...</Typography>
              ) : categories.length === 0 ? (
                <Typography className="text-center py-8 text-muted-foreground">
                  No categories found. Create your first category!
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
                        }}>Slug</TableCell>
                        <TableCell sx={{
                          fontWeight: 600,
                          color: '#3B3A2E',
                          borderBottom: '2px solid #C2B280',
                          '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                        }}>Type</TableCell>
                        <TableCell sx={{
                          fontWeight: 600,
                          color: '#3B3A2E',
                          borderBottom: '2px solid #C2B280',
                          '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                        }}>Variants</TableCell>
                        <TableCell sx={{
                          fontWeight: 600,
                          color: '#3B3A2E',
                          borderBottom: '2px solid #C2B280',
                          '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                        }}>Subcategories</TableCell>
                        <TableCell sx={{
                          fontWeight: 600,
                          color: '#3B3A2E',
                          borderBottom: '2px solid #C2B280',
                          '.dark &': { color: '#E8E6D5', borderBottom: '2px solid #4B5320' }
                        }}>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category.id} sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(210, 180, 140, 0.2)',
                            '.dark &': { backgroundColor: 'rgba(75, 83, 32, 0.3)' }
                          }
                        }}>
                          <TableCell>
                            <Typography className="font-medium">
                              {getCategoryDisplay(category)}
                            </Typography>
                            {category.description && (
                              <Typography variant="body2" className="text-muted-foreground">
                                {category.description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" className="font-mono text-sm">
                              {category.slug}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Badge className={category.parent ? 'bg-[#9C9A73] text-white' : 'bg-[#6B8E23] text-white'}>
                              {category.parent ? 'SUBCATEGORY' : 'PARENT'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {category.has_variants ? (
                              <Badge className="bg-[#8B7D3A] text-white">
                                {category.variant_type.toUpperCase()}
                              </Badge>
                            ) : (
                              <Badge className="bg-[#C2B280] text-[#3B3A2E]">
                                NO VARIANTS
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {category.subcategories && category.subcategories.length > 0 ? (
                              <Badge className="bg-[#D2B48C] text-[#3B3A2E]">
                                {category.subcategories.length}
                              </Badge>
                            ) : (
                              <Typography variant="body2" className="text-muted-foreground">-</Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditCategory(category)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(category)}
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
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Category Name*</Label>
                    <Input
                      id="name"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                      placeholder="e.g., Clothing, Electronics"
                    />
                  </div>

                  <div>
                    <Label htmlFor="slug">Slug*</Label>
                    <Input
                      id="slug"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      required
                      placeholder="e.g., clothing, electronics"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={categoryForm.description}
                      onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                      className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background min-h-[80px]"
                      placeholder="Brief description of this category"
                    />
                  </div>

                  <div>
                    <Label htmlFor="parent">Parent Category</Label>
                    <select
                      id="parent"
                      value={categoryForm.parent}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parent: e.target.value })}
                      className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background"
                    >
                      <option value="">None (Parent Category)</option>
                      {parentCategories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <Typography variant="body2" className="text-muted-foreground mt-1">
                      Leave empty to create a parent category
                    </Typography>
                  </div>

                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <input
                        type="checkbox"
                        checked={categoryForm.has_variants}
                        onChange={(e) => setCategoryForm({
                          ...categoryForm,
                          has_variants: e.target.checked,
                          variant_type: e.target.checked ? categoryForm.variant_type : ''
                        })}
                        className="w-4 h-4"
                      />
                      Has Product Variants
                    </Label>

                    {categoryForm.has_variants && (
                      <select
                        value={categoryForm.variant_type}
                        onChange={(e) => setCategoryForm({ ...categoryForm, variant_type: e.target.value })}
                        className="w-full px-3 py-2 border border-[#C2B280] dark:border-[#4B5320] rounded-md bg-background"
                        required={categoryForm.has_variants}
                      >
                        <option value="">Select variant type</option>
                        <option value="size_color">Size & Color</option>
                        <option value="size">Size Only</option>
                        <option value="color">Color Only</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    {editingCategory ? 'Update Category' : 'Create Category'}
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
              Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone and will fail if the category has products.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}
