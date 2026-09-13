import React, { useEffect } from 'react';
import { Product } from '../types';

interface SEOHeadProps {
  currentView: string;
  selectedProduct?: Product | null;
  categoryFilter?: string;
  occasionFilter?: string;
}

const BASE_URL = 'https://minalkhan.store';

export const SEOHead: React.FC<SEOHeadProps> = ({
  currentView,
  selectedProduct,
  categoryFilter,
  occasionFilter,
}) => {
  useEffect(() => {
    // 1. Compute Page-Specific SEO Metadata
    let title = 'MINAL KHAN | Premium Gifts & Customized Gift Boxes in Pakistan';
    let description =
      'Shop premium gifts in Pakistan at MINAL KHAN. Discover perfumes, watches, wallets, chocolates, jewellery, personalized gifts and customized gift boxes.';
    let canonicalPath = '/';
    let isNoIndex = false;
    let ogType = 'website';
    let ogImage =
      'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop';

    // Breadcrumb array
    const breadcrumbs = [
      { name: 'Home', url: `${BASE_URL}/` },
    ];

    switch (currentView) {
      case 'home':
        title = 'MINAL KHAN | Premium Gifts & Customized Gift Boxes in Pakistan';
        canonicalPath = '/';
        break;

      case 'shop':
        if (categoryFilter && categoryFilter !== 'All') {
          title = `${categoryFilter} Gifts | MINAL KHAN Luxury Collection`;
          description = `Explore our exquisite ${categoryFilter.toLowerCase()} gifts collection in Pakistan. Luxury packaging, personalized notes, and express delivery.`;
        } else if (occasionFilter && occasionFilter !== 'All') {
          title = `${occasionFilter} Gifts | MINAL KHAN Celebrations`;
          description = `Celebrate ${occasionFilter.toLowerCase()} with bespoke luxury gifts, gourmet chocolates, and personalized hampers in Pakistan.`;
        } else {
          title = 'Shop Luxury Gifts & Hampers in Pakistan | MINAL KHAN';
          description =
            'Browse our curated collection of luxury perfumes, elegant watches, leather goods, floral bouquets, and chocolates with express delivery across Pakistan.';
        }
        canonicalPath = '/shop';
        breadcrumbs.push({ name: 'Shop All Gifts', url: `${BASE_URL}/shop` });
        break;

      case 'categories':
        title = 'Gift Categories | Luxury Perfumes, Watches, Leather & Chocolates | MINAL KHAN';
        description =
          'Discover curated gift categories at MINAL KHAN: designer perfumes, luxury watches, leather goods, artisanal chocolates, and personalized keepsakes.';
        canonicalPath = '/categories';
        breadcrumbs.push({ name: 'Categories', url: `${BASE_URL}/categories` });
        break;

      case 'occasions':
        title = 'Gifts by Occasion | Eid, Weddings, Birthdays & Anniversaries | MINAL KHAN';
        description =
          'Find the perfect presents for every milestone: Eid Mubarak, weddings, bridal showers, birthdays, and corporate achievements across Pakistan.';
        canonicalPath = '/occasions';
        breadcrumbs.push({ name: 'Occasions', url: `${BASE_URL}/occasions` });
        break;

      case 'box-builder':
        title = 'Build Your Own Customized Gift Box | MINAL KHAN';
        description =
          'Design your bespoke gift hamper: handpick premium gifts, select luxury box and satin ribbon finishes, and add a personalized calligraphy card.';
        canonicalPath = '/gift-box';
        breadcrumbs.push({ name: 'Build Your Own Box', url: `${BASE_URL}/gift-box` });
        break;

      case 'product-detail':
        if (selectedProduct) {
          title = `${selectedProduct.name} | MINAL KHAN Luxury Gifts`;
          description = selectedProduct.description
            ? `${selectedProduct.description.slice(0, 150)}... Order on WhatsApp with express delivery in Pakistan.`
            : `Order ${selectedProduct.name} from MINAL KHAN. Premium quality luxury gifts in Pakistan.`;
          canonicalPath = `/shop?product=${selectedProduct.id}`;
          ogType = 'product';
          if (selectedProduct.imageUrl) {
            ogImage = selectedProduct.imageUrl;
          }
          breadcrumbs.push({ name: 'Shop All Gifts', url: `${BASE_URL}/shop` });
          if (selectedProduct.category) {
            breadcrumbs.push({
              name: selectedProduct.category,
              url: `${BASE_URL}/shop`,
            });
          }
          breadcrumbs.push({
            name: selectedProduct.name,
            url: `${BASE_URL}/shop?product=${selectedProduct.id}`,
          });
        }
        break;

      case 'cart':
        title = 'Gift Cart | MINAL KHAN';
        description = 'Review your selected luxury gifts and custom gift hampers.';
        canonicalPath = '/cart';
        isNoIndex = true;
        break;

      case 'wishlist':
        title = 'Saved Wishlist | MINAL KHAN';
        description = 'Your favorite luxury gifts and custom hampers saved for later.';
        canonicalPath = '/wishlist';
        isNoIndex = true;
        break;

      case 'account':
      case 'auth':
        title = 'Customer Portal | MINAL KHAN';
        description = 'Customer account and order history.';
        canonicalPath = '/account';
        isNoIndex = true;
        break;

      case 'about':
        title = 'About Us | The Art of Luxury Gifting | MINAL KHAN';
        description =
          'Learn about MINAL KHAN - Pakistan’s premier destination for bespoke, unforgettable gift-giving experiences.';
        canonicalPath = '/about';
        breadcrumbs.push({ name: 'About Us', url: `${BASE_URL}/about` });
        break;

      case 'contact':
        title = 'Contact & VIP WhatsApp Concierge | MINAL KHAN';
        description =
          'Reach out to our gifting specialists for custom orders, corporate hampers, and express same-day delivery support in Pakistan.';
        canonicalPath = '/contact';
        breadcrumbs.push({ name: 'Contact Us', url: `${BASE_URL}/contact` });
        break;

      case 'privacy':
        title = 'Privacy Policy | MINAL KHAN';
        canonicalPath = '/privacy';
        isNoIndex = true;
        break;

      case 'terms':
        title = 'Terms of Service & Delivery Information | MINAL KHAN';
        canonicalPath = '/terms';
        isNoIndex = true;
        break;

      case 'admin':
        title = 'Admin Management Portal | MINAL KHAN';
        canonicalPath = '/admin';
        isNoIndex = true;
        break;

      default:
        break;
    }

    // 2. Apply document title
    document.title = title;

    // 3. Helper to safely update or create <meta> tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let meta = document.querySelector(`meta[${attrName}="${attrVal}"]`) as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attrName, attrVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // 4. Update Meta Description & Robots
    setMetaTag('name', 'description', description);
    setMetaTag(
      'name',
      'robots',
      isNoIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );
    setMetaTag('name', 'googlebot', isNoIndex ? 'noindex, nofollow' : 'index, follow');

    // 5. Update Open Graph & Twitter Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', `${BASE_URL}${canonicalPath}`);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', ogImage);

    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
    setMetaTag('name', 'twitter:url', `${BASE_URL}${canonicalPath}`);

    // 6. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${BASE_URL}${canonicalPath}`);

    // 7. Inject Dynamic BreadcrumbList Structured Data (JSON-LD)
    const breadcrumbScriptId = 'minal-jsonld-breadcrumbs';
    let breadcrumbScript = document.getElementById(breadcrumbScriptId) as HTMLScriptElement | null;
    if (breadcrumbs.length > 1 && !isNoIndex) {
      const breadcrumbData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((b, idx) => ({
          '@type': 'ListItem',
          position: idx + 1,
          name: b.name,
          item: b.url,
        })),
      };
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement('script');
        breadcrumbScript.id = breadcrumbScriptId;
        breadcrumbScript.type = 'application/ld+json';
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbData);
    } else if (breadcrumbScript) {
      breadcrumbScript.remove();
    }

    // 8. Inject Dynamic Product Structured Data (JSON-LD)
    const productScriptId = 'minal-jsonld-product';
    let productScript = document.getElementById(productScriptId) as HTMLScriptElement | null;
    if (currentView === 'product-detail' && selectedProduct && !isNoIndex) {
      const effectivePrice = selectedProduct.salePrice ?? selectedProduct.price;
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: selectedProduct.name,
        image: selectedProduct.imageUrl ? [selectedProduct.imageUrl] : [ogImage],
        description: selectedProduct.description || `${selectedProduct.name} - Luxury Gift from MINAL KHAN`,
        sku: selectedProduct.sku || `MK-${selectedProduct.id.slice(0, 8)}`,
        brand: {
          '@type': 'Brand',
          name: 'MINAL KHAN',
        },
        category: selectedProduct.category,
        offers: {
          '@type': 'Offer',
          url: `${BASE_URL}/shop?product=${selectedProduct.id}`,
          priceCurrency: 'PKR',
          price: effectivePrice,
          availability:
            selectedProduct.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {
            '@type': 'Organization',
            name: 'MINAL KHAN',
          },
        },
      };

      if (!productScript) {
        productScript = document.createElement('script');
        productScript.id = productScriptId;
        productScript.type = 'application/ld+json';
        document.head.appendChild(productScript);
      }
      productScript.textContent = JSON.stringify(productSchema);
    } else if (productScript) {
      productScript.remove();
    }
  }, [currentView, selectedProduct, categoryFilter, occasionFilter]);

  return null;
};
