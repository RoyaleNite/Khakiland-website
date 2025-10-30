import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Grid } from '@mui/material';
import { Check, Zap, DollarSign } from 'lucide-react';
import { productsAPI } from '../api/client';
import { useTranslation } from '../hooks/useTranslation';
import type { Product, Category } from '../types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Typography } from '../components/ui/Typography';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

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
    } catch (error) {
      console.error('❌ Failed to load products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F4ED] via-[#E8E6D5] to-[#D2B48C] dark:from-[#2A2817] dark:via-[#3A3621] dark:to-[#2A2817]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#6B8E23]/10 via-[#8B7D3A]/10 to-[#4B5320]/10 animate-gradient" />
        <Container maxWidth="xl" className="relative py-20 px-4 md:px-6">
          <div className="text-center mb-12">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-[#6B8E23] via-[#8B7D3A] to-[#4B5320] bg-clip-text text-transparent animate-fade-in drop-shadow-sm">
              {t.home.welcome}
            </h1>
            <p className="text-xl md:text-2xl text-black-700 dark:text-black-300 mb-4 max-w-3xl mx-auto leading-relaxed">
              {t.home.subtitle}
            </p>
            <p className="text-lg md:text-xl text-black-600 dark:text-black-400 mb-8 max-w-2xl mx-auto">
              {t.home.description} <span className="font-bold text-[#6B8E23] dark:text-[#9C9A73]">{categories.length}+ {t.home.categories}</span>.
              <br />
              <span className="font-semibold bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] bg-clip-text text-transparent">
                {products.length}+ {t.home.curatedItems}
              </span>
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link to="/products">
                <Button className="!h-14 !px-10 !text-lg bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] hover:from-[#4B5320] hover:to-[#6B8E23] shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  {t.home.browseAll}
                </Button>
              </Link>
              <Button variant="outline" className="!h-14 !px-10 !text-lg !border-2 !border-[#6B8E23] !text-[#6B8E23] dark:!text-[#9C9A73] hover:!bg-[#D2B48C]/20 dark:hover:!bg-[#4B5320]/30 shadow-md">
                {t.home.learnMore}
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* Features Section */}
      <Container maxWidth="xl" className="py-16 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#C2B280] dark:border-[#4B5320] hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6B8E23] to-[#8B7D3A] rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">{t.home.qualityTitle}</h3>
            <p className="text-muted-foreground">{t.home.qualityDesc}</p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#C2B280] dark:border-[#4B5320] hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6B8E23] to-[#8B7D3A] rounded-full flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">{t.home.shippingTitle}</h3>
            <p className="text-muted-foreground">{t.home.shippingDesc}</p>
          </div>

          <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-[#C2B280] dark:border-[#4B5320] hover:shadow-xl transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-[#6B8E23] to-[#8B7D3A] rounded-full flex items-center justify-center mb-4">
              <DollarSign className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground mb-2">{t.home.priceTitle}</h3>
            <p className="text-muted-foreground">{t.home.priceDesc}</p>
          </div>
        </div>

        <Box className="mb-8 mt-4">
          <Typography variant="h4" className="!font-bold !mb-4 !text-3xl bg-gradient-to-r from-[#6B8E23] to-[#8B7D3A] bg-clip-text text-transparent">
            {t.home.featuredProducts}
          </Typography>
          <Typography variant="body1" className="!text-black-600 dark:!text-black-400 !text-lg">
            {t.home.featuredSubtitle}
          </Typography>
        </Box>

      <Box className="mb-8 space-y-4">
        <Input
          type="search"
          placeholder={t.home.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md !h-12 !text-base shadow-md"
        />

        <Box className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === '' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('')}
            className="!rounded-full"
          >
            {t.home.allProducts}
          </Button>
          {Array.isArray(categories) && categories.filter(cat => !cat.parent).map((parentCat) => (
            <Box key={parentCat.id} className="flex flex-wrap gap-2 items-center">
              <Button
                variant={selectedCategory === parentCat.id.toString() ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(parentCat.id.toString())}
                className="!rounded-full !font-semibold"
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

      {isLoading ? (
        <Box className="text-center py-12">
          <div className="inline-block w-12 h-12 border-4 border-[#6B8E23] border-t-transparent rounded-full animate-spin mb-4" />
          <Typography>{t.home.loading}</Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {Array.isArray(products) && products.map((product, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
              <Link to={`/products/${product.slug}`} className="block h-full">
                <Card
                  className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 !border-[#C2B280] dark:!border-[#4B5320] bg-card/90 backdrop-blur-sm group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader className="p-0 relative overflow-hidden">
                    <div
                      className="w-full aspect-square !bg-gradient-to-br from-[#F5F4ED] to-[#D2B48C] dark:from-[#3A3621] dark:to-[#2A2817] flex items-center justify-center overflow-hidden rounded-t-lg group-hover:scale-110 transition-transform duration-500"
                      dangerouslySetInnerHTML={{ __html: product.svg_placeholder }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#4B5320]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </CardHeader>
                  <CardContent className="pt-4 pb-3">
                    <CardTitle className="!text-base !font-semibold line-clamp-2 !mb-2 group-hover:text-[#6B8E23] dark:group-hover:text-[#9C9A73] transition-colors">
                      {product.name}
                    </CardTitle>
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

      {!isLoading && Array.isArray(products) && products.length === 0 && (
        <Box className="text-center py-12 bg-card/80 backdrop-blur-sm rounded-2xl">
          <Typography className="text-muted-foreground text-lg">
            {t.home.noProducts}
          </Typography>
        </Box>
      )}
    </Container>
    </div>
  );
}
