import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import { productsAPI } from '../api/client';
import { useTranslation } from '../hooks/useTranslation';
import type { Product, Category } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';
import { useToast } from '../hooks/useToast';

type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name-asc');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, searchQuery]);

  const loadCategories = async () => {
    try {
      const data = await productsAPI.getCategories();
      console.log('🏷️  Categories loaded:', data.length, 'total');
      console.log('   - Parent categories:', data.filter((c: Category) => !c.parent).length);
      console.log('   - Subcategories:', data.filter((c: Category) => c.parent).length);
      setCategories(data);
    } catch (error) {
      console.error('❌ Failed to load categories:', error);
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: t.toast.failedToLoad,
      });
    }
  };

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      const params: any = {};
      if (selectedCategory) params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;

      const data = await productsAPI.getProducts(params);
      console.log('📦 Products loaded:', data.results.length, 'out of', data.count, 'total');
      setProducts(data.results);

      toast({
        variant: 'success',
        title: t.toast.productsLoaded,
        description: `${data.results.length} ${t.toast.productsFound}`,
      });
    } catch (error) {
      console.error('❌ Failed to load products:', error);
      toast({
        variant: 'destructive',
        title: t.toast.error,
        description: t.toast.failedToLoad,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filtered = [...products];

    // Filter by availability
    if (showAvailableOnly) {
      filtered = filtered.filter((p) => p.stock > 0);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.base_price) - parseFloat(b.base_price);
        case 'price-desc':
          return parseFloat(b.base_price) - parseFloat(a.base_price);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const filteredProducts = getFilteredAndSortedProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      <Container maxWidth="xl" className="py-8 px-4 md:px-6">
        {/* Header */}
        <Box className="mb-8 mt-4">
          <Typography variant="h3" className="!font-bold !mb-4 !text-4xl bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] bg-clip-text text-transparent">
            {t.products.title}
          </Typography>
          <Typography variant="body1" className="!text-black-600 dark:!text-black-400 !text-lg">
            {t.products.subtitle}
          </Typography>
        </Box>

        {/* Search */}
        <Box className="mb-6">
          <Input
            type="search"
            placeholder={t.home.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md !h-12 !text-base shadow-lg !border-[#C2B280] dark:!border-[#4B5320] focus:!border-[#6B8E23] dark:focus:!border-[#9C9A73]"
          />
        </Box>

        {/* Filters Section */}
        <div className="bg-card/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-xl border border-[#C2B280] dark:border-[#4B5320]">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-[#6B8E23] dark:text-[#9C9A73]" />
            <Typography variant="h6" className="!font-semibold !text-[#3B3A2E] dark:!text-[#E8E6D5]">
              {t.products.filtersTitle}
            </Typography>
          </div>

          {/* Categories */}
          <Box className="mb-6">
            <Typography variant="body2" className="!mb-3 !font-medium !text-[#3B3A2E] dark:!text-[#E8E6D5]">
              {t.products.categories}
            </Typography>
            <Box className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                className="!rounded-full"
                size="sm"
              >
                {t.home.allProducts}
              </Button>
              {Array.isArray(categories) && categories.filter(cat => !cat.parent).map((parentCat) => (
                <Box key={parentCat.id} className="flex flex-wrap gap-2 items-center">
                  <Button
                    variant={selectedCategory === parentCat.id.toString() ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(parentCat.id.toString())}
                    className="!rounded-full !font-semibold"
                    size="sm"
                  >
                    {parentCat.name}
                  </Button>
                  {parentCat.subcategories && parentCat.subcategories.length > 0 && (
                    <>
                      {parentCat.subcategories.map((subcat) => (
                        <Button
                          key={subcat.id}
                          variant={selectedCategory === subcat.id.toString() ? 'default' : 'outline'}
                          onClick={() => setSelectedCategory(subcat.id.toString())}
                          className="!rounded-full !ml-1"
                          size="sm"
                        >
                          {subcat.name}
                        </Button>
                      ))}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Sort Options */}
          <Box className="mb-6">
            <Typography variant="body2" className="!mb-3 !font-medium !text-[#3B3A2E] dark:!text-[#E8E6D5]">
              {t.products.sortBy}
            </Typography>
            <Box className="flex flex-wrap gap-2">
              <Button
                variant={sortBy === 'price-asc' ? 'default' : 'outline'}
                onClick={() => setSortBy('price-asc')}
                className="!rounded-full gap-2"
                size="sm"
              >
                <SortAsc className="w-4 h-4" />
                {t.products.priceLowHigh}
              </Button>
              <Button
                variant={sortBy === 'price-desc' ? 'default' : 'outline'}
                onClick={() => setSortBy('price-desc')}
                className="!rounded-full gap-2"
                size="sm"
              >
                <SortDesc className="w-4 h-4" />
                {t.products.priceHighLow}
              </Button>
              <Button
                variant={sortBy === 'name-asc' ? 'default' : 'outline'}
                onClick={() => setSortBy('name-asc')}
                className="!rounded-full gap-2"
                size="sm"
              >
                {t.products.nameAZ}
              </Button>
              <Button
                variant={sortBy === 'name-desc' ? 'default' : 'outline'}
                onClick={() => setSortBy('name-desc')}
                className="!rounded-full gap-2"
                size="sm"
              >
                {t.products.nameZA}
              </Button>
            </Box>
          </Box>

          {/* Availability Toggle */}
          <Box>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={(e) => setShowAvailableOnly(e.target.checked)}
                className="w-5 h-5 rounded border-[#C2B280] text-[#6B8E23] focus:ring-[#6B8E23] cursor-pointer"
              />
              <Typography variant="body2" className="!font-medium !text-black-700 dark:!text-black-300 group-hover:!text-[#6B8E23] dark:group-hover:!text-[#9C9A73] transition-colors">
                {t.products.availableOnly}
              </Typography>
            </label>
          </Box>
        </div>

        {/* Results Count */}
        <Box className="mb-4">
          <Typography variant="body2" className="!text-black-600 dark:!text-black-400">
            {t.products.showing} {filteredProducts.length} {filteredProducts.length !== 1 ? t.products.products : t.products.product}
          </Typography>
        </Box>

        {/* Products Grid */}
        {isLoading ? (
          <Box className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
            <Typography className="!text-black-700 dark:!text-black-300">{t.home.loading}</Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {filteredProducts.map((product) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                <Link to={`/products/${product.slug}`} className="block h-full">
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 !border-[#C2B280] dark:!border-[#4B5320] bg-card/90 backdrop-blur-sm group">
                    <CardHeader className="p-0 relative">
                      <div
                        className="w-full aspect-square !bg-gradient-to-br from-[#F5F4ED] to-[#D2B48C] dark:from-[#3A3621] dark:to-[#2A2817] flex items-center justify-center overflow-hidden rounded-t-lg group-hover:scale-105 transition-transform duration-300"
                        dangerouslySetInnerHTML={{ __html: product.svg_placeholder }}
                      />
                      {product.stock === 0 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <span className="bg-red-600 dark:bg-red-700 text-white px-4 py-2 rounded-full font-semibold">
                            {t.products.outOfStock}
                          </span>
                        </div>
                      )}
                      {product.stock > 0 && product.stock < 10 && (
                        <div className="absolute top-2 right-2 bg-orange-500 dark:bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                          {t.products.onlyLeft} {product.stock} {t.products.left}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4 pb-3">
                      <CardTitle className="!text-base !font-semibold line-clamp-2 !mb-2 !text-[#3B3A2E] dark:!text-[#E8E6D5] group-hover:!text-[#6B8E23] dark:group-hover:!text-[#9C9A73] transition-colors">{product.name}</CardTitle>
                      <Typography variant="body2" className="!text-black-500 dark:!text-black-400 !text-sm">
                        {product.category_name}
                      </Typography>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Box className="w-full flex justify-between items-center">
                        <Typography variant="h6" className="!font-bold !text-[#6B8E23] dark:!text-[#9C9A73]">
                          {t.common.currency}{parseFloat(product.base_price).toFixed(2)}
                        </Typography>
                        <Button size="sm" className="!text-xs bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23]">
                          {t.products.viewDetails}
                        </Button>
                      </Box>
                    </CardFooter>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}

        {!isLoading && filteredProducts.length === 0 && (
          <Box className="text-center py-12 bg-card/80 backdrop-blur-sm rounded-2xl border border-[#C2B280] dark:border-[#4B5320]">
            <Typography className="!text-black-600 dark:!text-black-400 text-lg">
              {t.products.noProductsFound}
            </Typography>
          </Box>
        )}
      </Container>
    </div>
  );
}
